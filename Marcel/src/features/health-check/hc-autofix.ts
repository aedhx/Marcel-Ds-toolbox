// ── Health Check Auto-fix ──
// Applies DS-compliant fixes for color, spacing, and typography violations.

import { hexToRgb, rgbToHex, fonts, DS_TOKENS } from "../../shared/tokens";
import { loadFont } from "../../shared/figma-helpers";
import type { Violation } from "../../shared/violation-types";

// ── Style mapping for typography fix ──

var STYLE_MAP: Record<string, string> = {
  Thin: "Light",
  ExtraLight: "Light",
  Light: "Light",
  Regular: "Regular",
  Medium: "Medium",
  SemiBold: "Bold",
  Bold: "Bold",
  ExtraBold: "Bold",
  Black: "Bold",
  Italic: "Italic",
};

// ── Variable / style resolution cache ──
// Uses both local and team library sources so DS variables/styles
// from external libraries are found and properly bound.

var _spacingVarsCache: Variable[] | null = null;
var _textStylesCache: TextStyle[] | null = null;
var _colorVarsCache: Variable[] | null = null;

function resetResolutionCache() {
  _spacingVarsCache = null;
  _textStylesCache = null;
  _colorVarsCache = null;
}

// ── Color variable resolution ──
// A DS-correct color fix BINDS the Marcel color variable, not just the hex.
// Candidates: local COLOR variables + Marcel team-library collections + the
// COLOR variables already bound to fills/strokes on the current page (the only
// listing that works in a project file whatever the library is named).

/** Resolve a variable's first-mode value to a lowercase hex, following one alias hop. */
async function variableHex(v: Variable): Promise<string | null> {
  var modeIds = Object.keys(v.valuesByMode);
  if (modeIds.length === 0) return null;
  var raw: any = v.valuesByMode[modeIds[0]];
  if (raw && typeof raw === "object" && "id" in raw) {
    try {
      var aliased = await figma.variables.getVariableByIdAsync(raw.id);
      if (!aliased) return null;
      var aModes = Object.keys(aliased.valuesByMode);
      if (aModes.length === 0) return null;
      raw = aliased.valuesByMode[aModes[0]];
    } catch (_e) {
      return null;
    }
  }
  if (raw && typeof raw === "object" && "r" in raw && "g" in raw && "b" in raw) {
    return rgbToHex(raw.r, raw.g, raw.b).toLowerCase();
  }
  return null;
}

async function resolveColorVariable(targetHex: string): Promise<Variable | null> {
  if (!_colorVarsCache) {
    var colorVars: Variable[] = await figma.variables.getLocalVariablesAsync("COLOR");
    var seen: Record<string, true> = {};
    for (var i0 = 0; i0 < colorVars.length; i0++) seen[colorVars[i0].id] = true;

    // Marcel team-library collections (same listing as spacing).
    try {
      var cols = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      for (var c = 0; c < cols.length; c++) {
        if (!cols[c].libraryName.toLowerCase().includes("marcel")) continue;
        var libVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(cols[c].key);
        for (var lv = 0; lv < libVars.length; lv++) {
          if (libVars[lv].resolvedType !== "COLOR") continue;
          var imported = await figma.variables.importVariableByKeyAsync(libVars[lv].key);
          if (!seen[imported.id]) { seen[imported.id] = true; colorVars.push(imported); }
        }
      }
    } catch (_e) { /* teamLibrary unavailable — continue */ }

    // COLOR variables already bound to paints on this page.
    try {
      var painted = figma.currentPage.findAll(function (n) {
        return "fills" in n || "strokes" in n;
      });
      for (var pn = 0; pn < painted.length; pn++) {
        var lists: any[] = [];
        var fl = (painted[pn] as any).fills;
        var st = (painted[pn] as any).strokes;
        if (Array.isArray(fl)) lists = lists.concat(fl);
        if (Array.isArray(st)) lists = lists.concat(st);
        for (var pi = 0; pi < lists.length; pi++) {
          var bound = lists[pi] && lists[pi].boundVariables && lists[pi].boundVariables.color;
          var boundId = bound && typeof bound === "object" ? bound.id : null;
          if (!boundId || seen[boundId]) continue;
          seen[boundId] = true;
          try {
            var bv = await figma.variables.getVariableByIdAsync(boundId);
            if (bv && bv.resolvedType === "COLOR") colorVars.push(bv);
          } catch (_e2) { /* stale id */ }
        }
      }
    } catch (_e3) { /* page not loaded — continue */ }

    _colorVarsCache = colorVars;
  }

  var want = targetHex.toLowerCase();
  for (var i = 0; i < _colorVarsCache.length; i++) {
    var hex = await variableHex(_colorVarsCache[i]);
    if (hex === want) return _colorVarsCache[i];
  }
  return null;
}

// ── Spacing variable resolution ──
//
// Why it used to "do nothing" in project files: the candidates were matched ONLY by
// numeric value after a single alias hop on the first mode. Marcel spacing variables
// are remote (Layout collection) and alias primitives; when the hop failed the value
// stayed an alias object, nothing matched, and the fix failed as "no spacing variable".
// The Marcel names are known (DS_TOKENS: "Spacing/M" = 12 …), so match by NAME first
// and fall back to a deeper, all-modes numeric match. The library import is also
// narrowed to FLOAT variables named "*spacing*" — the former loop imported EVERY Marcel
// variable (hundreds of colors) one await at a time before the first fix could run.

var SPACING_NAME_BY_VALUE: Record<number, string> = {};
for (var _ti = 0; _ti < DS_TOKENS.length; _ti++) {
  if (DS_TOKENS[_ti].category === "spacing") {
    SPACING_NAME_BY_VALUE[parseInt(DS_TOKENS[_ti].value, 10)] = DS_TOKENS[_ti].name;
  }
}

/** "Marcel / Spacing-M" → "marcel/spacing/m" so library naming variants still line up. */
function normalizeVarName(name: string): string {
  return name.toLowerCase().replace(/[\s_\-]+/g, "/").replace(/\/+/g, "/");
}

function isSpacingCandidate(v: { name: string; resolvedType: string }): boolean {
  return v.resolvedType === "FLOAT" && v.name.toLowerCase().indexOf("spacing") !== -1;
}

/** First numeric value across modes, following aliases up to 3 hops. */
async function spacingNumericValue(v: Variable): Promise<number | null> {
  var modeIds = Object.keys(v.valuesByMode);
  for (var m = 0; m < modeIds.length; m++) {
    var val: any = v.valuesByMode[modeIds[m]];
    for (var hop = 0; hop < 3 && val && typeof val === "object" && "id" in val; hop++) {
      try {
        var target = await figma.variables.getVariableByIdAsync(val.id);
        if (!target) { val = null; break; }
        var tModes = Object.keys(target.valuesByMode);
        val = tModes.length > 0 ? target.valuesByMode[tModes[0]] : null;
      } catch (_e) { val = null; }
    }
    if (typeof val === "number") return val;
  }
  return null;
}

async function collectSpacingCandidates(): Promise<Variable[]> {
  var allVars: Variable[] = (await figma.variables.getLocalVariablesAsync("FLOAT")).filter(isSpacingCandidate);
  var seenVarIds: Record<string, true> = {};
  for (var sv = 0; sv < allVars.length; sv++) seenVarIds[allVars[sv].id] = true;

  // Team library (requires "teamlibrary" permission; lists only libraries ENABLED in this file).
  try {
    var libCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    for (var c = 0; c < libCollections.length; c++) {
      var col = libCollections[c];
      var libName = (col.libraryName || "").toLowerCase();
      var colName = (col.name || "").toLowerCase();
      if (libName.indexOf("marcel") === -1 && colName !== "layout" && colName.indexOf("spacing") === -1) continue;
      var libVars = (await figma.teamLibrary.getVariablesInLibraryCollectionAsync(col.key)).filter(isSpacingCandidate);
      var imported = await Promise.all(
        libVars.map(function (lv) { return figma.variables.importVariableByKeyAsync(lv.key).catch(function () { return null; }); })
      );
      for (var im = 0; im < imported.length; im++) {
        var iv = imported[im];
        if (iv && !seenVarIds[iv.id]) { seenVarIds[iv.id] = true; allVars.push(iv); }
      }
    }
  } catch (_e) {
    // teamLibrary unavailable — continue with local + harvested
  }

  // Harvest the spacing variables ALREADY BOUND on this page's auto-layout frames: the one
  // listing that works in a project file whatever the library is named or enabled.
  try {
    var layoutNodes = figma.currentPage.findAllWithCriteria({ types: ["FRAME", "COMPONENT", "INSTANCE"] });
    var spacingFields = ["paddingTop", "paddingBottom", "paddingLeft", "paddingRight", "itemSpacing"];
    var pendingIds: string[] = [];
    for (var ln = 0; ln < layoutNodes.length; ln++) {
      var bvMap = (layoutNodes[ln] as any).boundVariables as Record<string, any> | undefined;
      if (!bvMap) continue;
      for (var sf = 0; sf < spacingFields.length; sf++) {
        var alias = bvMap[spacingFields[sf]];
        var aliasId = alias && typeof alias === "object" ? alias.id : null;
        if (!aliasId || seenVarIds[aliasId]) continue;
        seenVarIds[aliasId] = true;
        pendingIds.push(aliasId);
      }
    }
    var harvested = await Promise.all(
      pendingIds.map(function (id) { return figma.variables.getVariableByIdAsync(id).catch(function () { return null; }); })
    );
    for (var h = 0; h < harvested.length; h++) {
      var hv = harvested[h];
      if (hv && isSpacingCandidate(hv)) allVars.push(hv);
    }
  } catch (_e4) {
    // page not loaded / API unavailable — continue with what we have
  }

  return allVars;
}

async function resolveSpacingVariable(value: number): Promise<Variable | null> {
  if (!_spacingVarsCache) _spacingVarsCache = await collectSpacingCandidates();
  var candidates = _spacingVarsCache;

  // 1. Name match against the Marcel token for this value ("Spacing/M" for 12).
  var targetName = SPACING_NAME_BY_VALUE[value];
  if (targetName) {
    var want = normalizeVarName(targetName);
    for (var i = 0; i < candidates.length; i++) {
      var have = normalizeVarName(candidates[i].name);
      if (have === want || have.slice(-(want.length + 1)) === "/" + want) return candidates[i];
    }
  }

  // 2. Numeric match (any mode, aliases followed) for libraries with other naming.
  for (var j = 0; j < candidates.length; j++) {
    var num = await spacingNumericValue(candidates[j]);
    if (num === value) return candidates[j];
  }
  return null;
}

async function resolveTextStyle(textNode: TextNode): Promise<TextStyle | null> {
  if (!_textStylesCache) {
    // Start with local text styles
    var allStyles: TextStyle[] = await figma.getLocalTextStylesAsync();

    // The Plugin API has NO way to list a team library's text styles
    // (figma.teamLibrary only exposes variable collections — the former
    // `getAvailableLibraryTextStylesAsync` call never existed and always threw,
    // silently leaving project files with ZERO candidates). Instead, harvest the
    // library text styles ALREADY USED in this file: every TEXT node bound to a
    // (remote) text style resolves through getStyleByIdAsync. Ubuntu-only filter
    // below keeps the pool DS-only.
    var seenStyleIds: Record<string, true> = {};
    for (var li = 0; li < allStyles.length; li++) seenStyleIds[allStyles[li].id] = true;
    try {
      var textNodes = figma.currentPage.findAllWithCriteria({ types: ["TEXT"] });
      for (var tn = 0; tn < textNodes.length; tn++) {
        var sid = (textNodes[tn] as TextNode).textStyleId;
        if (typeof sid !== "string" || !sid || seenStyleIds[sid]) continue;
        seenStyleIds[sid] = true;
        try {
          var usedStyle = await figma.getStyleByIdAsync(sid);
          if (usedStyle && usedStyle.type === "TEXT") allStyles.push(usedStyle as TextStyle);
        } catch (_e2) { /* stale style id — skip */ }
      }
    } catch (_e) {
      // page not loaded / API unavailable — continue with local only
    }

    _textStylesCache = allStyles;
  }

  var fontName = textNode.fontName;
  if (fontName === figma.mixed) return null;

  var nodeFontSize = textNode.fontSize;
  if (nodeFontSize === figma.mixed) return null;

  var nodeWeight = (fontName as FontName).style;
  var bestMatch: TextStyle | null = null;

  for (var i = 0; i < _textStylesCache.length; i++) {
    var style = _textStylesCache[i];
    if (style.fontName.family !== fonts.family) continue;
    if (style.fontSize !== nodeFontSize) continue;
    // Exact weight match preferred
    if (style.fontName.style === nodeWeight) return style;
    // Otherwise keep first size match as fallback
    if (!bestMatch) bestMatch = style;
  }
  return bestMatch;
}

// ── Single-node fix ──

export async function hcFixNode(
  nodeId: string,
  violation: { rule: string; metadata?: Record<string, unknown> }
): Promise<{ success: boolean; detail: string }> {
  var node = await figma.getNodeByIdAsync(nodeId);
  if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
    return { success: false, detail: "Node not found" };
  }

  var sceneNode = node as SceneNode;

  switch (violation.rule) {
    case "off-token-fill":
      return await fixFillColor(sceneNode, violation.metadata);
    case "off-token-stroke":
      return await fixStrokeColor(sceneNode, violation.metadata);
    case "off-token-spacing":
    case "missing-spacing-var":
      return await fixSpacing(sceneNode, violation.metadata);
    case "off-ds-font":
      return await fixTypography(sceneNode, violation.metadata);
    case "missing-text-style":
      return await fixMissingTextStyle(sceneNode);
    default:
      return { success: false, detail: "Not fixable" };
  }
}

// ── Color fill fix ──

async function fixFillColor(
  node: SceneNode,
  meta?: Record<string, unknown>
): Promise<{ success: boolean; detail: string }> {
  if (!meta?.nearestHex || !("fills" in node)) {
    return { success: false, detail: "Missing metadata or fills" };
  }

  var fills = (node as MinimalFillsMixin).fills;
  if (fills === figma.mixed) {
    return { success: false, detail: "Mixed fills" };
  }

  var currentHex = String(meta.currentValue).toLowerCase();
  var targetHex = String(meta.nearestHex).toLowerCase();
  var targetRgb = hexToRgb(targetHex);
  var colorVar = await resolveColorVariable(targetHex);

  var newFills: Paint[] = [];
  var matched = false;

  for (var i = 0; i < fills.length; i++) {
    var paint = fills[i];
    if (!matched && paint.type === "SOLID") {
      var paintHex = rgbToHex(paint.color.r, paint.color.g, paint.color.b).toLowerCase();
      if (paintHex === currentHex) {
        var newPaint: SolidPaint = {
          type: "SOLID",
          color: targetRgb,
          opacity: paint.opacity,
          visible: paint.visible,
          blendMode: paint.blendMode,
        };
        // Bind the DS variable when one resolves — the hex alone only mimics the token.
        if (colorVar) {
          try {
            newPaint = figma.variables.setBoundVariableForPaint(newPaint, "color", colorVar);
          } catch (_e) { /* keep the raw hex */ }
        }
        newFills.push(newPaint);
        matched = true;
        continue;
      }
    }
    newFills.push(paint);
  }

  if (!matched) {
    return { success: false, detail: "Paint not found" };
  }

  (node as MinimalFillsMixin).fills = newFills;
  return { success: true, detail: colorVar ? colorVar.name : targetHex };
}

// ── Color stroke fix ──

async function fixStrokeColor(
  node: SceneNode,
  meta?: Record<string, unknown>
): Promise<{ success: boolean; detail: string }> {
  if (!meta?.nearestHex || !("strokes" in node)) {
    return { success: false, detail: "Missing metadata or strokes" };
  }

  var strokes = (node as MinimalStrokesMixin).strokes;

  var currentHex = String(meta.currentValue).toLowerCase();
  var targetHex = String(meta.nearestHex).toLowerCase();
  var targetRgb = hexToRgb(targetHex);
  var colorVar = await resolveColorVariable(targetHex);

  var newStrokes: Paint[] = [];
  var matched = false;

  for (var i = 0; i < strokes.length; i++) {
    var paint = strokes[i];
    if (!matched && paint.type === "SOLID") {
      var paintHex = rgbToHex(paint.color.r, paint.color.g, paint.color.b).toLowerCase();
      if (paintHex === currentHex) {
        var newPaint: SolidPaint = {
          type: "SOLID",
          color: targetRgb,
          opacity: paint.opacity,
          visible: paint.visible,
          blendMode: paint.blendMode,
        };
        if (colorVar) {
          try {
            newPaint = figma.variables.setBoundVariableForPaint(newPaint, "color", colorVar);
          } catch (_e) { /* keep the raw hex */ }
        }
        newStrokes.push(newPaint);
        matched = true;
        continue;
      }
    }
    newStrokes.push(paint);
  }

  if (!matched) {
    return { success: false, detail: "Stroke paint not found" };
  }

  (node as MinimalStrokesMixin).strokes = newStrokes;
  return { success: true, detail: colorVar ? colorVar.name : targetHex };
}

// ── Spacing fix ──

async function fixSpacing(
  node: SceneNode,
  meta?: Record<string, unknown>
): Promise<{ success: boolean; detail: string }> {
  if (!meta?.property || meta?.nearestValue === undefined) {
    return { success: false, detail: "Missing metadata" };
  }

  var property = String(meta.property);
  var nearestValue = Number(meta.nearestValue);
  var currentValue = Number(meta.currentValue);

  var variable = await resolveSpacingVariable(nearestValue);
  if (variable) {
    try {
      (node as FrameNode).setBoundVariable(property as VariableBindableNodeField, variable);
      return { success: true, detail: variable.name };
    } catch (e: any) {
      // A variable WAS found but Figma refused the binding on this node: say so with
      // Figma's own message instead of the misleading "no spacing variable" fallback.
      return { success: false, detail: "bind failed: " + String(e?.message || e) };
    }
  }

  // No DS variable reachable. For `missing-spacing-var` the value is ALREADY on
  // the scale (nearest === current): re-writing the same number changes nothing
  // and the violation would survive the re-scan — report an honest failure
  // instead of a fake success.
  if (nearestValue === currentValue) {
    return { success: false, detail: "No DS spacing variable found" };
  }
  (node as any)[property] = nearestValue;
  return { success: true, detail: String(nearestValue) };
}

// ── Typography fix ──

async function fixTypography(
  node: SceneNode,
  meta?: Record<string, unknown>
): Promise<{ success: boolean; detail: string }> {
  if (node.type !== "TEXT") {
    return { success: false, detail: "Not a text node" };
  }

  var textNode = node as TextNode;
  var fontName = textNode.fontName;

  if (fontName === figma.mixed) {
    return { success: false, detail: "Mixed fonts" };
  }

  var currentStyle = (fontName as FontName).style;
  var targetStyle = STYLE_MAP[currentStyle] || "Regular";

  try {
    await loadFont(fonts.family, targetStyle);
    textNode.fontName = { family: fonts.family, style: targetStyle };
  } catch (_e) {
    // Fallback to Regular if target style not available
    try {
      await loadFont(fonts.family, "Regular");
      textNode.fontName = { family: fonts.family, style: "Regular" };
    } catch (_e2) {
      return { success: false, detail: "Font load failed" };
    }
  }

  // Bind matching text style after font change
  var textStyle = await resolveTextStyle(textNode);
  if (textStyle) await textNode.setTextStyleIdAsync(textStyle.id);

  return { success: true, detail: fonts.family };
}

// ── Missing text style fix ──

async function fixMissingTextStyle(
  node: SceneNode
): Promise<{ success: boolean; detail: string }> {
  if (node.type !== "TEXT") {
    return { success: false, detail: "Not a text node" };
  }

  var textNode = node as TextNode;
  var textStyle = await resolveTextStyle(textNode);
  if (textStyle) {
    await textNode.setTextStyleIdAsync(textStyle.id);
    return { success: true, detail: textStyle.name };
  }
  return { success: false, detail: "No matching DS text style" };
}

// ── Bulk fix all ──

export async function hcFixAll(
  violations: Violation[]
): Promise<{ fixed: number; failed: number; fixedNodeIds: string[]; fixedViolationIds: string[] }> {
  resetResolutionCache();

  var fixed = 0;
  var failed = 0;
  var fixedNodeIds: string[] = [];
  var fixedViolationIds: string[] = [];

  // Filter to fixable: not low-confidence and not component category
  var fixable: Violation[] = [];
  for (var i = 0; i < violations.length; i++) {
    var v = violations[i];
    if (v.category === "component") continue;
    if (v.confidence !== undefined && v.confidence === "low") continue;
    fixable.push(v);
  }

  if (fixable.length === 0) {
    return { fixed: 0, failed: 0, fixedNodeIds: [], fixedViolationIds: [] };
  }

  // Apply all fixes
  for (var j = 0; j < fixable.length; j++) {
    var fv = fixable[j];
    var result = await hcFixNode(fv.nodeId, { rule: fv.rule, metadata: fv.metadata });
    if (result.success) {
      fixed++;
      fixedNodeIds.push(fv.nodeId);
      fixedViolationIds.push(fv.id);
    } else {
      failed++;
    }
  }

  // Select fixed nodes and zoom into view
  if (fixedNodeIds.length > 0) {
    var fixedNodes: SceneNode[] = [];
    for (var k = 0; k < fixedNodeIds.length; k++) {
      var fn = await figma.getNodeByIdAsync(fixedNodeIds[k]);
      if (fn && "type" in fn && fn.type !== "DOCUMENT" && fn.type !== "PAGE") {
        fixedNodes.push(fn as SceneNode);
      }
    }
    if (fixedNodes.length > 0) {
      figma.currentPage.selection = fixedNodes;
      figma.viewport.scrollAndZoomIntoView(fixedNodes);
    }
  }

  return { fixed: fixed, failed: failed, fixedNodeIds: fixedNodeIds, fixedViolationIds: fixedViolationIds };
}
