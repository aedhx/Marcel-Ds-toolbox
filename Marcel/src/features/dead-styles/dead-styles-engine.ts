import type { ScanAbortToken, TraversalScope } from "../../shared/node-traversal";
import { traverseNodes } from "../../shared/node-traversal";
import { rgbToHex } from "../../shared/tokens";
import { findNearestColorToken } from "../health-check/hc-colors";
import type {
  DeadStyleInfo,
  DeadStylesResult,
  DSSuggestion,
  ForeignItemInfo,
  ForeignItemSource,
  StyleCleanerResult,
  StylePreview,
} from "./dead-styles-types";

// ── Caches (cleared at start of each scan) ──

interface CachedVariable {
  name: string;
  remote: boolean;
  collectionName: string;
  isForeign: boolean;
  resolvedType: string;
  key: string;
  // Default-mode color captured at classification time (COLOR variables only) so the
  // foreign-item preview needs no second getVariableByIdAsync / collection round-trip.
  defaultColor: RGB | null;
}

interface CachedStyle {
  isForeign: boolean;
  libraryName: string;
  styleName: string;
  styleType: "PAINT" | "TEXT" | "EFFECT";
  // Preview + DS suggestion computed once per style at classification time (foreign only).
  preview: StylePreview;
  suggestion: DSSuggestion | null;
}

let variableCache = new Map<string, CachedVariable | null>();
let styleCache = new Map<string, CachedStyle | null>();
// Collections are shared by many variables: resolve each id once per scan. The promise is
// cached (not the value) so concurrent classifications of sibling variables coalesce.
let collectionCache = new Map<string, Promise<VariableCollection | null>>();

function getCollectionCached(collectionId: string): Promise<VariableCollection | null> {
  let pending = collectionCache.get(collectionId);
  if (!pending) {
    pending = figma.variables.getVariableCollectionByIdAsync(collectionId).catch(() => null);
    collectionCache.set(collectionId, pending);
  }
  return pending;
}

// Classification is a per-id round-trip; run the UNIQUE ids of a binding list in concurrent
// chunks (same pattern as hc-components / hc-coverage) so the per-binding loops below only
// ever hit the caches. Chunked rather than one giant Promise.all to bound in-flight requests.
const CLASSIFY_CHUNK = 50;

async function prewarm<T>(ids: string[], classify: (id: string) => Promise<T>): Promise<void> {
  const unique = Array.from(new Set(ids));
  for (let i = 0; i < unique.length; i += CLASSIFY_CHUNK) {
    await Promise.all(unique.slice(i, i + CLASSIFY_CHUNK).map((id) => classify(id)));
  }
}

// ── Raw binding collected during sync traversal (pass 1) ──
// Exported (D-07) so the unified runQualityCheck() pass can declare these accumulators and
// feed them to finalizeDeadStyles() after the single traversal.

export interface RawVarBinding {
  varId: string;
  nodeId: string;
  nodeName: string;
  field: string;
  paintIndex?: number;
}

export interface RawStyleBinding {
  styleId: string;
  nodeId: string;
  nodeName: string;
  prop: string;
  itemType: "PAINT" | "TEXT" | "EFFECT";
}

// ── Helper: Collect variable IDs from boundVariables recursively ──

export function collectVariableIds(
  bv: Record<string, any>,
  usedIds: Set<string>
): void {
  for (const key in bv) {
    const val = bv[key];
    if (!val) continue;
    // Single VariableAlias
    if (val.type === "VARIABLE_ALIAS" && val.id) {
      usedIds.add(val.id);
    }
    // Array of VariableAlias (fills, strokes, effects, textRangeFills)
    if (Array.isArray(val)) {
      for (const item of val) {
        if (item && item.type === "VARIABLE_ALIAS" && item.id) {
          usedIds.add(item.id);
        }
      }
    }
    // Nested object (componentProperties)
    if (typeof val === "object" && !Array.isArray(val) && val.type !== "VARIABLE_ALIAS") {
      collectVariableIds(val, usedIds);
    }
  }
}

// ── Helper: Collect variable IDs from paint/stroke/effect arrays on a node ──

export function collectPaintVariableIds(node: SceneNode, usedIds: Set<string>): void {
  // Check fills
  if ("fills" in node && (node as any).fills !== figma.mixed && Array.isArray((node as any).fills)) {
    for (const paint of (node as any).fills) {
      if (paint.boundVariables) {
        collectVariableIds(paint.boundVariables, usedIds);
      }
      if (paint.gradientStops) {
        for (const stop of paint.gradientStops) {
          if (stop.boundVariables) {
            collectVariableIds(stop.boundVariables, usedIds);
          }
        }
      }
    }
  }
  // Check strokes
  if ("strokes" in node && Array.isArray((node as any).strokes)) {
    for (const paint of (node as any).strokes) {
      if (paint.boundVariables) {
        collectVariableIds(paint.boundVariables, usedIds);
      }
    }
  }
  // Check effects
  if ("effects" in node && (node as any).effects !== figma.mixed && Array.isArray((node as any).effects)) {
    for (const effect of (node as any).effects) {
      if (effect.boundVariables) {
        collectVariableIds(effect.boundVariables, usedIds);
      }
    }
  }
}

// ── Helper: Collect raw variable bindings from a node (sync — for pass 1) ──

export function collectRawVarBindings(node: SceneNode, bindings: RawVarBinding[], seenKeys: Set<string>): void {
  // Check top-level boundVariables
  if (node.boundVariables) {
    const bv = node.boundVariables as Record<string, any>;
    for (const field in bv) {
      const val = bv[field];
      if (!val) continue;

      if (val.type === "VARIABLE_ALIAS" && val.id) {
        const key = `${val.id}-${node.id}-${field}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          bindings.push({ varId: val.id, nodeId: node.id, nodeName: node.name, field });
        }
      }
      if (Array.isArray(val)) {
        for (let idx = 0; idx < val.length; idx++) {
          const item = val[idx];
          if (item && item.type === "VARIABLE_ALIAS" && item.id) {
            const key = `${item.id}-${node.id}-${field}-${idx}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              bindings.push({ varId: item.id, nodeId: node.id, nodeName: node.name, field, paintIndex: idx });
            }
          }
        }
      }
    }
  }

  // Check paint-level variable bindings (fills, strokes)
  if ("fills" in node && (node as any).fills !== figma.mixed && Array.isArray((node as any).fills)) {
    const fills = (node as any).fills as Paint[];
    for (let i = 0; i < fills.length; i++) {
      const paint = fills[i];
      if ((paint as any).boundVariables?.color) {
        const alias = (paint as any).boundVariables.color;
        if (alias.type === "VARIABLE_ALIAS" && alias.id) {
          const key = `${alias.id}-${node.id}-fills-${i}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            bindings.push({ varId: alias.id, nodeId: node.id, nodeName: node.name, field: "fills", paintIndex: i });
          }
        }
      }
    }
  }

  if ("strokes" in node && Array.isArray((node as any).strokes)) {
    const strokes = (node as any).strokes as Paint[];
    for (let i = 0; i < strokes.length; i++) {
      const paint = strokes[i];
      if ((paint as any).boundVariables?.color) {
        const alias = (paint as any).boundVariables.color;
        if (alias.type === "VARIABLE_ALIAS" && alias.id) {
          const key = `${alias.id}-${node.id}-strokes-${i}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            bindings.push({ varId: alias.id, nodeId: node.id, nodeName: node.name, field: "strokes", paintIndex: i });
          }
        }
      }
    }
  }
}

// ── Helper: Collect raw style bindings from a node (sync — for pass 1) ──

export function collectRawStyleBindings(node: SceneNode, bindings: RawStyleBinding[], seenKeys: Set<string>): void {
  const styleFields: Array<{ prop: string; itemType: "PAINT" | "TEXT" | "EFFECT" }> = [
    { prop: "fillStyleId", itemType: "PAINT" },
    { prop: "strokeStyleId", itemType: "PAINT" },
    { prop: "textStyleId", itemType: "TEXT" },
    { prop: "effectStyleId", itemType: "EFFECT" },
  ];

  for (const { prop, itemType } of styleFields) {
    if (!(prop in node)) continue;
    const styleId = (node as any)[prop];

    // Handle figma.mixed (e.g. text nodes with mixed styles)
    if (styleId === figma.mixed || typeof styleId !== "string" || !styleId) continue;

    const key = `${styleId}-${node.id}-${prop}`;
    if (seenKeys.has(key)) continue;
    seenKeys.add(key);

    bindings.push({ styleId, nodeId: node.id, nodeName: node.name, prop, itemType });
  }
}

// ── Helper: Collect the style IDs a node consumes (sync — for pass 1) ──
//
// Replaces one `style.getStyleConsumersAsync()` per local style (each a file-wide search,
// awaited sequentially) with a single read per node during the traversal the dead-variable
// detection already performs. A local style is dead iff its id never appears in this set.
// Text nodes can carry per-range fill/text styles (`figma.mixed`); those are expanded via
// getStyledTextSegments so a style used only on a sub-range still counts as consumed.
const USED_STYLE_FIELDS = ["fillStyleId", "strokeStyleId", "effectStyleId", "gridStyleId", "textStyleId"] as const;
const RANGE_STYLE_FIELDS = ["fillStyleId", "textStyleId"] as const;

export function collectUsedStyleIds(node: SceneNode, usedStyleIds: Set<string>): void {
  for (const field of USED_STYLE_FIELDS) {
    if (!(field in node)) continue;
    const styleId = (node as any)[field];
    if (typeof styleId === "string") {
      if (styleId) usedStyleIds.add(styleId);
      continue;
    }
    if (styleId === figma.mixed && node.type === "TEXT" && (RANGE_STYLE_FIELDS as readonly string[]).includes(field)) {
      try {
        const segments = (node as TextNode).getStyledTextSegments([field as "fillStyleId" | "textStyleId"]);
        for (const seg of segments) {
          const segId = (seg as any)[field];
          if (typeof segId === "string" && segId) usedStyleIds.add(segId);
        }
      } catch {
        // Segment read failed — leave the range unaccounted rather than abort the scan
      }
    }
  }
}

// ── Helper: Extract preview data from a style ──

function extractStylePreview(style: PaintStyle | TextStyle | EffectStyle): StylePreview {
  if (style.type === "PAINT") {
    const ps = style as PaintStyle;
    const paint = ps.paints[0];
    if (paint && paint.type === "SOLID") {
      return {
        type: "color",
        hex: rgbToHex(paint.color.r, paint.color.g, paint.color.b),
        opacity: paint.opacity !== undefined && paint.opacity < 1 ? paint.opacity : undefined,
      };
    }
    return { type: "gradient", description: "Gradient" };
  }
  if (style.type === "TEXT") {
    const ts = style as TextStyle;
    return {
      type: "text",
      fontFamily: ts.fontName.family,
      fontSize: ts.fontSize,
      fontStyle: ts.fontName.style,
    };
  }
  if (style.type === "EFFECT") {
    const es = style as EffectStyle;
    const effectTypes = es.effects.map((e: Effect) => e.type).join(", ");
    return { type: "effect", description: effectTypes || "No effects" };
  }
  return { type: "unknown" };
}

// ── Approved DS collections (from Marcel Semantic library) ──
// Only variables from these collections are considered DS-approved.
// Everything else (other libraries, deprecated collections) is foreign.
const APPROVED_COLLECTIONS = ["Layout", "Semantics", "Text Styles", "Themes", "Decorative"];

function isApprovedCollection(name: string): boolean {
  return APPROVED_COLLECTIONS.some(
    (approved) => name.toLowerCase() === approved.toLowerCase()
  );
}

// ── Foreign detection: Variable classification (async — pass 2) ──

async function classifyAndCacheVariable(varId: string): Promise<CachedVariable | null> {
  if (variableCache.has(varId)) {
    return variableCache.get(varId)!;
  }

  try {
    const variable = await figma.variables.getVariableByIdAsync(varId);
    if (!variable) {
      // Inaccessible variable = foreign (library removed or inaccessible)
      const entry: CachedVariable = {
        name: varId,
        remote: true,
        collectionName: "Unknown (inaccessible)",
        isForeign: true,
        resolvedType: "UNKNOWN",
        key: "",
        defaultColor: null,
      };
      variableCache.set(varId, entry);
      return entry;
    }

    if (!variable.remote) {
      // Local variable — not foreign
      const entry: CachedVariable = {
        name: variable.name,
        remote: false,
        collectionName: "",
        isForeign: false,
        resolvedType: variable.resolvedType,
        key: variable.key,
        defaultColor: null,
      };
      variableCache.set(varId, entry);
      return entry;
    }

    // Remote variable — check if collection is from approved DS library.
    // One collection round-trip per DISTINCT collection per scan (getCollectionCached).
    const collection = await getCollectionCached(variable.variableCollectionId);
    const collectionName = collection ? collection.name : "";

    // Foreign = NOT from an approved DS collection
    const isForeign = !collectionName || !isApprovedCollection(collectionName);

    // Capture the default-mode color now (same variable + collection objects already in
    // hand) so the preview step is a pure cache read.
    let defaultColor: RGB | null = null;
    if (isForeign && variable.resolvedType === "COLOR" && collection) {
      const value = variable.valuesByMode[collection.defaultModeId];
      if (value && typeof value === "object" && "r" in value) {
        defaultColor = value as RGB;
      }
    }

    const entry: CachedVariable = {
      name: variable.name,
      remote: true,
      collectionName,
      isForeign,
      resolvedType: variable.resolvedType,
      key: variable.key,
      defaultColor,
    };
    variableCache.set(varId, entry);
    return entry;
  } catch {
    // API error — treat as foreign
    const entry: CachedVariable = {
      name: varId,
      remote: true,
      collectionName: "Unknown (error)",
      isForeign: true,
      resolvedType: "UNKNOWN",
      key: "",
      defaultColor: null,
    };
    variableCache.set(varId, entry);
    return entry;
  }
}

// ── Foreign detection: Style classification (async — pass 2) ──

async function classifyStyle(styleId: string): Promise<CachedStyle | null> {
  if (styleCache.has(styleId)) {
    return styleCache.get(styleId)!;
  }

  try {
    const style = await figma.getStyleByIdAsync(styleId);
    if (!style) {
      // Cannot resolve — not foreign (might be deleted)
      styleCache.set(styleId, null);
      return null;
    }

    if (!style.remote) {
      // Local style — not foreign
      const entry: CachedStyle = {
        isForeign: false,
        libraryName: "",
        styleName: style.name,
        styleType: style.type as "PAINT" | "TEXT" | "EFFECT",
        preview: { type: "unknown" },
        suggestion: null,
      };
      styleCache.set(styleId, entry);
      return entry;
    }

    // Remote style — Figma API doesn't expose source library for styles.
    // Flag as foreign if the style name contains known deprecated patterns.
    // DS styles from Marcel Semantic are trusted (no way to distinguish otherwise).
    const stylePath = style.name.toUpperCase();
    const isForeign =
      stylePath.includes("DEPRECATED") ||
      stylePath.includes("[DS] FOUNDATION") ||
      stylePath.includes("DO NOT USE");

    // Preview + DS suggestion from the style object already in hand — computed once per
    // style, not once per node binding (the former per-binding getStyleByIdAsync refetch).
    let preview: StylePreview = { type: "unknown" };
    let suggestion: DSSuggestion | null = null;
    if (isForeign) {
      try {
        preview = extractStylePreview(style as PaintStyle | TextStyle | EffectStyle);
        if (style.type === "PAINT") {
          const paint = (style as PaintStyle).paints[0];
          if (paint && paint.type === "SOLID") {
            suggestion = suggestDSColorReplacement(paint.color);
          }
        }
      } catch {
        // Keep unknown preview
      }
    }

    const entry: CachedStyle = {
      isForeign,
      libraryName: style.description || "Remote library",
      styleName: style.name,
      styleType: style.type as "PAINT" | "TEXT" | "EFFECT",
      preview,
      suggestion,
    };
    styleCache.set(styleId, entry);
    return entry;
  } catch {
    styleCache.set(styleId, null);
    return null;
  }
}

// ── DS variable key lookup (built at scan start from team library) ──

let dsVariableKeyMap = new Map<string, string>(); // tokenName → variableKey
// The map is a teamLibrary round-trip (every Marcel collection, then every variable in
// each) — network-bound and identical from one scan to the next within a session. Reuse
// it for DS_KEY_MAP_TTL_MS instead of refetching on every Quality Check.
const DS_KEY_MAP_TTL_MS = 10 * 60 * 1000;
let dsVariableKeyMapBuiltAt = 0;

async function buildDSVariableKeyMap(): Promise<void> {
  const fresh = dsVariableKeyMap.size > 0 && Date.now() - dsVariableKeyMapBuiltAt < DS_KEY_MAP_TTL_MS;
  if (fresh) return;
  dsVariableKeyMap = new Map();
  try {
    const libCollections =
      await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    for (const col of libCollections) {
      // Only import from Marcel DS library
      if (!col.libraryName.toLowerCase().includes("marcel")) continue;
      const libVars =
        await figma.teamLibrary.getVariablesInLibraryCollectionAsync(col.key);
      for (const lv of libVars) {
        if (lv.resolvedType === "COLOR") {
          dsVariableKeyMap.set(lv.name, lv.key);
        }
      }
    }
    dsVariableKeyMapBuiltAt = Date.now();
  } catch {
    // teamLibrary may not be available — continue without variable keys (and retry next scan)
  }
}

// ── Foreign detection: DS color suggestion ──

function suggestDSColorReplacement(color: RGB): DSSuggestion | null {
  const hex = rgbToHex(color.r, color.g, color.b);
  const nearest = findNearestColorToken(hex);
  if (!nearest || nearest.confidence === null) return null;

  return {
    tokenName: nearest.name,
    tokenHex: nearest.hex,
    variableKey: dsVariableKeyMap.get(nearest.name),
    confidence: nearest.confidence,
  };
}

// ── Foreign detection: Resolve variable color for preview/suggestion ──

function resolveVariableColorPreview(
  cached: CachedVariable
): { preview: StylePreview; suggestion: DSSuggestion | null } {
  // No API calls: the default-mode color was captured during classification.
  if (cached.resolvedType === "COLOR" && cached.defaultColor) {
    const rgb = cached.defaultColor;
    return {
      preview: { type: "color", hex: rgbToHex(rgb.r, rgb.g, rgb.b), resolvedType: "COLOR" },
      suggestion: suggestDSColorReplacement(rgb),
    };
  }

  return {
    preview: {
      type: "variable",
      resolvedType: cached.resolvedType,
      description: cached.name,
    },
    suggestion: null,
  };
}

// ── Pass 2: Process raw variable bindings into ForeignItemInfo (async) ──

async function processForeignVariableBindings(
  rawBindings: RawVarBinding[],
  foreignItems: ForeignItemInfo[]
): Promise<void> {
  // Classify each DISTINCT variable once, concurrently in chunks; the ordered loop below
  // then only reads caches, so output order stays identical to the former sequential loop.
  await prewarm(rawBindings.map((b) => b.varId), classifyAndCacheVariable);

  for (const binding of rawBindings) {
    const cached = await classifyAndCacheVariable(binding.varId);
    if (!cached || !cached.isForeign) continue;

    const { preview, suggestion } = resolveVariableColorPreview(cached);

    const source: ForeignItemSource = {
      libraryName: cached.collectionName || "Unknown library",
      variableOrStyleName: cached.name,
    };

    const itemType = cached.resolvedType === "COLOR" ? "PAINT" as const : "VARIABLE" as const;

    foreignItems.push({
      id: `foreign-var-${binding.varId}-${binding.nodeId}-${binding.field}`,
      nodeId: binding.nodeId,
      nodeName: binding.nodeName,
      itemType,
      bindingField: binding.field,
      paintIndex: binding.paintIndex,
      source,
      preview,
      suggestion,
      foreignId: binding.varId,
    });
  }
}

// ── Pass 2: Process raw style bindings into ForeignItemInfo (async) ──

async function processForeignStyleBindings(
  rawBindings: RawStyleBinding[],
  foreignItems: ForeignItemInfo[]
): Promise<void> {
  // Same shape as the variable half: classify each DISTINCT style once, concurrently.
  await prewarm(rawBindings.map((b) => b.styleId), classifyStyle);

  for (const binding of rawBindings) {
    const cached = await classifyStyle(binding.styleId);
    if (!cached || !cached.isForeign) continue;

    const preview = cached.preview;
    const suggestion = cached.suggestion;

    const source: ForeignItemSource = {
      libraryName: cached.libraryName,
      variableOrStyleName: cached.styleName,
    };

    foreignItems.push({
      id: `foreign-style-${binding.styleId}-${binding.nodeId}`,
      nodeId: binding.nodeId,
      nodeName: binding.nodeName,
      itemType: binding.itemType,
      bindingField: binding.prop,
      source,
      preview,
      suggestion,
      foreignId: binding.styleId,
    });
  }
}

// ── Main scan function (original — preserved for backward compat) ──

export async function scanDeadStyles(
  abortToken: ScanAbortToken,
  onProgress?: (phase: string, current: number, total: number) => void
): Promise<DeadStylesResult> {
  const result = await scanStyleCleaner(abortToken, onProgress);
  return {
    deadStyles: result.deadStyles,
    totalLocalStyles: result.totalLocalStyles,
    totalLocalVariables: result.totalLocalVariables,
    scanDurationMs: result.scanDurationMs,
  };
}

// ── Extended scan function ──

export async function scanStyleCleaner(
  abortToken: ScanAbortToken,
  onProgress?: (phase: string, current: number, total: number) => void
): Promise<StyleCleanerResult> {
  const startTime = Date.now();

  // Clear caches at start of each scan
  variableCache = new Map();
  styleCache = new Map();
  collectionCache = new Map();

  // Phase 0: Build DS variable key map for replace-with-variable support
  await buildDSVariableKeyMap();

  // Phase 1: Fetch all local styles (ASYNC only — dynamic-page manifest)
  const paintStyles = await figma.getLocalPaintStylesAsync();
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();

  const allStyles = [...paintStyles, ...textStyles, ...effectStyles];
  const totalLocalStyles = allStyles.length;

  if (abortToken.cancelled) {
    return emptyResult(totalLocalStyles, 0, startTime);
  }

  // Phase 2: dead local styles are derived from the style ids consumed file-wide, collected
  // during the single traversal below (no per-style getStyleConsumersAsync round-trips).
  const deadStyles: DeadStyleInfo[] = [];
  const usedStyleIds = new Set<string>();

  // Phase 3: Fetch local variables and find unused ones
  const localVars = await figma.variables.getLocalVariablesAsync();
  const totalLocalVariables = localVars.length;

  const usedVarIds = new Set<string>();

  // Collect raw bindings during sync traversal (pass 1)
  const rawVarBindings: RawVarBinding[] = [];
  const rawStyleBindings: RawStyleBinding[] = [];
  const varSeenKeys = new Set<string>();
  const styleSeenKeys = new Set<string>();

  // Phase 3a: Traverse entire file (sync pass)
  // Collects used variable IDs for dead-local detection
  // AND raw binding data for foreign detection (processed async in pass 2)
  await traverseNodes(
    (node) => {
      // Collect used variable IDs (for dead-local detection)
      if (node.boundVariables) {
        collectVariableIds(node.boundVariables as Record<string, any>, usedVarIds);
      }
      collectPaintVariableIds(node, usedVarIds);
      collectUsedStyleIds(node, usedStyleIds);

      // Collect raw bindings for foreign detection (sync — no await)
      collectRawVarBindings(node, rawVarBindings, varSeenKeys);
      collectRawStyleBindings(node, rawStyleBindings, styleSeenKeys);
    },
    {
      scope: "file",
      chunkSize: 150,
      abortToken,
      onProgress: (current, total) => {
        if (onProgress) {
          onProgress("variables", current, total);
        }
      },
    }
  );

  if (abortToken.cancelled) {
    return emptyResult(totalLocalStyles, totalLocalVariables, startTime);
  }

  collectDeadStyles(allStyles, usedStyleIds, deadStyles);
  if (onProgress) onProgress("styles", totalLocalStyles, totalLocalStyles);

  // Phase 3b: Check local styles themselves for variable bindings
  for (const ps of paintStyles) {
    if ((ps as any).boundVariables) {
      collectVariableIds((ps as any).boundVariables, usedVarIds);
    }
    for (const paint of ps.paints) {
      if ("boundVariables" in paint && (paint as any).boundVariables) {
        collectVariableIds((paint as any).boundVariables, usedVarIds);
      }
    }
  }

  for (const es of effectStyles) {
    if ((es as any).boundVariables) {
      collectVariableIds((es as any).boundVariables, usedVarIds);
    }
    for (const effect of es.effects) {
      if ("boundVariables" in effect && (effect as any).boundVariables) {
        collectVariableIds((effect as any).boundVariables, usedVarIds);
      }
    }
  }

  for (const ts of textStyles) {
    if ((ts as any).boundVariables) {
      collectVariableIds((ts as any).boundVariables, usedVarIds);
    }
  }

  // Phase 3c: Filter dead variables
  for (const v of localVars) {
    if (!usedVarIds.has(v.id)) {
      deadStyles.push({
        id: v.id,
        name: v.name,
        itemType: "VARIABLE",
        preview: {
          type: "variable",
          resolvedType: v.resolvedType,
          description: v.name,
        },
      });
    }
  }

  if (abortToken.cancelled) {
    return emptyResult(totalLocalStyles, totalLocalVariables, startTime);
  }

  // Phase 4: Process foreign bindings (async pass 2)
  // Classify variables and styles, resolve previews and suggestions
  const foreignItems: ForeignItemInfo[] = [];

  if (onProgress) {
    onProgress("foreign-variables", 0, rawVarBindings.length);
  }
  await processForeignVariableBindings(rawVarBindings, foreignItems);
  if (onProgress) {
    onProgress("foreign-variables", rawVarBindings.length, rawVarBindings.length);
  }

  if (abortToken.cancelled) {
    return emptyResult(totalLocalStyles, totalLocalVariables, startTime);
  }

  if (onProgress) {
    onProgress("foreign-styles", 0, rawStyleBindings.length);
  }
  await processForeignStyleBindings(rawStyleBindings, foreignItems);
  if (onProgress) {
    onProgress("foreign-styles", rawStyleBindings.length, rawStyleBindings.length);
  }

  // Count foreign items by type
  const totalForeignVariables = foreignItems.filter(
    (f) => f.id.startsWith("foreign-var-")
  ).length;
  const totalForeignStyles = foreignItems.filter(
    (f) => f.id.startsWith("foreign-style-")
  ).length;

  return {
    foreignItems,
    deadStyles,
    totalLocalStyles,
    totalLocalVariables,
    totalForeignVariables,
    totalForeignStyles,
    scanDurationMs: Date.now() - startTime,
  };
}

// ── Scope-aware finalize for the unified runQualityCheck() pass (D-07) ──
//
// Splits dead-styles per D-07 so the FOREIGN-BINDING half can ride the single unified
// per-node pass while the UNUSED-LOCAL half stays whole-file:
//
//   • Foreign half — `processForeign*` over the rawVarBindings / rawStyleBindings that the
//     unified visitor collected via the exported sync collectors. Those bindings were
//     gathered at the pass's scope, so this half naturally honors page/selection/file scope.
//
//   • Unused-local half — style-consumer "dead local style" detection
//     (getStyleConsumersAsync, inherently file-wide) and dead-variable detection. The latter
//     needs a file-wide `usedVarIds` set: forcing it under a narrow scope produces false
//     positives (D-07 — explicitly rejected), so this function ALWAYS computes usedVarIds
//     file-wide via its own `scope: "file"` traversal + local-style bookkeeping, regardless
//     of the `scope` the unified scan ran at. The result is labeled `unusedScope: "file"` so
//     the consumer knows these findings are not scope-bounded.
//
// Returns a StyleCleanerResult (route via styleCleanerToViolations → unified violations[],
// D-08) plus the file-level label. Caches are reset here just like scanStyleCleaner.

export interface FinalizedDeadStyles {
  result: StyleCleanerResult;
  // "file" when the unused-local half ran (file-scope scan). For page/selection scans the
  // unused-local half is SKIPPED (see below) and this echoes the scan scope so the consumer
  // knows dead local styles/variables were not evaluated on this run.
  unusedScope: TraversalScope;
}

export async function finalizeDeadStyles(
  rawVarBindings: RawVarBinding[],
  rawStyleBindings: RawStyleBinding[],
  scope: TraversalScope,
  abortToken: ScanAbortToken,
  onProgress?: (phase: string, current: number, total: number) => void
): Promise<FinalizedDeadStyles> {
  const startTime = Date.now();

  // Reset classification caches (mirrors scanStyleCleaner) and build the DS key map so
  // color suggestions resolve identically to the standalone Style Cleaner scan.
  variableCache = new Map();
  styleCache = new Map();
  collectionCache = new Map();
  await buildDSVariableKeyMap();

  const deadStyles: DeadStyleInfo[] = [];

  // ── Unused-local half — FILE-SCOPE SCANS ONLY ──
  // D-07 pins this half file-wide because a narrow usedVarIds set yields false positives.
  // The corollary is that it costs O(file) no matter what the designer selected: a second
  // full traversal of every page, one getStyleConsumersAsync() (itself a file-wide search)
  // per local style, plus getLocalVariablesAsync. Dead local styles/variables are
  // non-scoring (D-02) and style-level (no owning node), so on a page/selection scan we
  // skip the half entirely instead of paying a whole-file price for findings that neither
  // move the score nor belong to the selected nodes. They still surface on a file scan.
  if (scope !== "file") {
    const foreignOnly = await processForeignHalf(rawVarBindings, rawStyleBindings, abortToken, onProgress);
    return {
      result: {
        foreignItems: foreignOnly.foreignItems,
        deadStyles,
        totalLocalStyles: 0,
        totalLocalVariables: 0,
        totalForeignVariables: foreignOnly.totalForeignVariables,
        totalForeignStyles: foreignOnly.totalForeignStyles,
        scanDurationMs: Date.now() - startTime,
      },
      unusedScope: scope,
    };
  }

  const paintStyles = await figma.getLocalPaintStylesAsync();
  const textStyles = await figma.getLocalTextStylesAsync();
  const effectStyles = await figma.getLocalEffectStylesAsync();
  const allStyles = [...paintStyles, ...textStyles, ...effectStyles];
  const totalLocalStyles = allStyles.length;

  // Phase 2: dead local styles = local styles whose id is consumed nowhere file-wide. The
  // consumed set is collected on the same traversal as usedVarIds (below) — one pass instead
  // of one sequential getStyleConsumersAsync (a file-wide search each) per local style.
  const usedStyleIds = new Set<string>();

  // Phase 3 verbatim: dead variables = local vars whose IDs are not used anywhere file-wide.
  // usedVarIds MUST be file-wide (not the unified scan's scope) to avoid false positives.
  const localVars = await figma.variables.getLocalVariablesAsync();
  const totalLocalVariables = localVars.length;

  const usedVarIds = new Set<string>();
  await traverseNodes(
    (node) => {
      if (node.boundVariables) {
        collectVariableIds(node.boundVariables as Record<string, any>, usedVarIds);
      }
      collectPaintVariableIds(node, usedVarIds);
      collectUsedStyleIds(node, usedStyleIds);
    },
    {
      scope: "file",
      chunkSize: 150,
      abortToken,
      onProgress: (current, total) => {
        if (onProgress) onProgress("variables", current, total);
      },
    }
  );

  if (abortToken.cancelled) {
    return { result: emptyResult(totalLocalStyles, totalLocalVariables, startTime), unusedScope: "file" };
  }

  collectDeadStyles(allStyles, usedStyleIds, deadStyles);
  if (onProgress) onProgress("styles", totalLocalStyles, totalLocalStyles);

  // Phase 3b verbatim: local styles' own variable bindings count as usage.
  for (const ps of paintStyles) {
    if ((ps as any).boundVariables) collectVariableIds((ps as any).boundVariables, usedVarIds);
    for (const paint of ps.paints) {
      if ("boundVariables" in paint && (paint as any).boundVariables) {
        collectVariableIds((paint as any).boundVariables, usedVarIds);
      }
    }
  }
  for (const es of effectStyles) {
    if ((es as any).boundVariables) collectVariableIds((es as any).boundVariables, usedVarIds);
    for (const effect of es.effects) {
      if ("boundVariables" in effect && (effect as any).boundVariables) {
        collectVariableIds((effect as any).boundVariables, usedVarIds);
      }
    }
  }
  for (const ts of textStyles) {
    if ((ts as any).boundVariables) collectVariableIds((ts as any).boundVariables, usedVarIds);
  }

  // Phase 3c verbatim: filter dead variables.
  for (const v of localVars) {
    if (!usedVarIds.has(v.id)) {
      deadStyles.push({
        id: v.id,
        name: v.name,
        itemType: "VARIABLE",
        preview: { type: "variable", resolvedType: v.resolvedType, description: v.name },
      });
    }
  }

  if (abortToken.cancelled) {
    return { result: emptyResult(totalLocalStyles, totalLocalVariables, startTime), unusedScope: "file" };
  }

  // ── Foreign half (scope-aware — bindings already collected at the unified scan's scope) ──
  const foreign = await processForeignHalf(rawVarBindings, rawStyleBindings, abortToken, onProgress);

  if (abortToken.cancelled) {
    return { result: emptyResult(totalLocalStyles, totalLocalVariables, startTime), unusedScope: "file" };
  }

  return {
    result: {
      foreignItems: foreign.foreignItems,
      deadStyles,
      totalLocalStyles,
      totalLocalVariables,
      totalForeignVariables: foreign.totalForeignVariables,
      totalForeignStyles: foreign.totalForeignStyles,
      scanDurationMs: Date.now() - startTime,
    },
    unusedScope: "file",
  };
}

// ── Foreign half, shared by both scope branches of finalizeDeadStyles ──
// Only walks the bindings the unified visitor already collected, so its cost is bounded by
// the scan scope (not the file). Returns whatever it had classified if cancelled mid-way;
// callers check abortToken after it returns.
async function processForeignHalf(
  rawVarBindings: RawVarBinding[],
  rawStyleBindings: RawStyleBinding[],
  abortToken: ScanAbortToken,
  onProgress?: (phase: string, current: number, total: number) => void
): Promise<{ foreignItems: ForeignItemInfo[]; totalForeignVariables: number; totalForeignStyles: number }> {
  const foreignItems: ForeignItemInfo[] = [];

  if (onProgress) onProgress("foreign-variables", 0, rawVarBindings.length);
  await processForeignVariableBindings(rawVarBindings, foreignItems);
  if (onProgress) onProgress("foreign-variables", rawVarBindings.length, rawVarBindings.length);

  if (!abortToken.cancelled) {
    if (onProgress) onProgress("foreign-styles", 0, rawStyleBindings.length);
    await processForeignStyleBindings(rawStyleBindings, foreignItems);
    if (onProgress) onProgress("foreign-styles", rawStyleBindings.length, rawStyleBindings.length);
  }

  return {
    foreignItems,
    totalForeignVariables: foreignItems.filter((f) => f.id.startsWith("foreign-var-")).length,
    totalForeignStyles: foreignItems.filter((f) => f.id.startsWith("foreign-style-")).length,
  };
}

// ── Helper: local styles never consumed anywhere in the file → dead ──
function collectDeadStyles(
  allStyles: Array<PaintStyle | TextStyle | EffectStyle>,
  usedStyleIds: Set<string>,
  deadStyles: DeadStyleInfo[]
): void {
  for (const style of allStyles) {
    if (usedStyleIds.has(style.id)) continue;
    const itemType = style.type as "PAINT" | "TEXT" | "EFFECT";
    deadStyles.push({ id: style.id, name: style.name, itemType, preview: extractStylePreview(style) });
  }
}

// ── Helper: Empty result for abort cases ──

function emptyResult(
  totalLocalStyles: number,
  totalLocalVariables: number,
  startTime: number
): StyleCleanerResult {
  return {
    foreignItems: [],
    deadStyles: [],
    totalLocalStyles,
    totalLocalVariables,
    totalForeignVariables: 0,
    totalForeignStyles: 0,
    scanDurationMs: Date.now() - startTime,
  };
}
