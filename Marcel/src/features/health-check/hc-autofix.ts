// ── Health Check Auto-fix ──
// Applies DS-compliant fixes for color, spacing, and typography violations.

import { hexToRgb, rgbToHex, fonts } from "../../shared/tokens";
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

function resetResolutionCache() {
  _spacingVarsCache = null;
  _textStylesCache = null;
}

async function resolveSpacingVariable(value: number): Promise<Variable | null> {
  if (!_spacingVarsCache) {
    // Start with local variables
    var allVars = await figma.variables.getLocalVariablesAsync("FLOAT");

    // Also fetch from team library collections (requires "teamlibrary" permission)
    try {
      var libCollections =
        await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      for (var c = 0; c < libCollections.length; c++) {
        var col = libCollections[c];
        // Only import from Marcel DS library (col.name = collection name, col.libraryName = library name)
        if (!col.libraryName.toLowerCase().includes("marcel")) continue;
        var libVars =
          await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
            col.key
          );
        for (var lv = 0; lv < libVars.length; lv++) {
          var imported = await figma.variables.importVariableByKeyAsync(
            libVars[lv].key
          );
          allVars.push(imported);
        }
      }
    } catch (_e) {
      // teamLibrary may not be available — continue with local only
    }

    _spacingVarsCache = allVars;
  }

  for (var i = 0; i < _spacingVarsCache.length; i++) {
    var v = _spacingVarsCache[i];
    if (!v.name.toLowerCase().includes("spacing")) continue;
    var modeIds = Object.keys(v.valuesByMode);
    if (modeIds.length === 0) continue;
    var raw = v.valuesByMode[modeIds[0]];
    // Resolve aliases: if value is a VariableAlias, follow the reference
    var val = raw;
    if (typeof raw === "object" && raw !== null && "id" in (raw as any)) {
      try {
        var aliased = await figma.variables.getVariableByIdAsync((raw as any).id);
        if (aliased) {
          var aModes = Object.keys(aliased.valuesByMode);
          if (aModes.length > 0) val = aliased.valuesByMode[aModes[0]];
        }
      } catch (_e2) { /* skip */ }
    }
    if (typeof val === "number" && val === value) return v;
  }
  return null;
}

async function resolveTextStyle(textNode: TextNode): Promise<TextStyle | null> {
  if (!_textStylesCache) {
    // Start with local text styles
    var allStyles: TextStyle[] = await figma.getLocalTextStylesAsync();

    // Also fetch from team library (requires "teamlibrary" permission)
    try {
      // `getAvailableLibraryTextStylesAsync` is a runtime figma.teamLibrary method that the
      // installed @figma/plugin-typings do not declare (TeamLibraryAPI only types the
      // variable-collection methods) — a genuine typings gap. Cast through `any`; the call is
      // already wrapped in try/catch so a missing method degrades to local-only styles.
      var libStyles =
        await (figma.teamLibrary as any).getAvailableLibraryTextStylesAsync();
      for (var ls = 0; ls < libStyles.length; ls++) {
        var libStyle = libStyles[ls];
        // Only import from Marcel DS library
        if (!libStyle.libraryName.toLowerCase().includes("marcel")) continue;
        var imported = (await figma.importStyleByKeyAsync(
          libStyle.key
        )) as TextStyle;
        allStyles.push(imported);
      }
    } catch (_e) {
      // teamLibrary may not be available — continue with local only
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
      return fixFillColor(sceneNode, violation.metadata);
    case "off-token-stroke":
      return fixStrokeColor(sceneNode, violation.metadata);
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

function fixFillColor(
  node: SceneNode,
  meta?: Record<string, unknown>
): { success: boolean; detail: string } {
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
  return { success: true, detail: targetHex };
}

// ── Color stroke fix ──

function fixStrokeColor(
  node: SceneNode,
  meta?: Record<string, unknown>
): { success: boolean; detail: string } {
  if (!meta?.nearestHex || !("strokes" in node)) {
    return { success: false, detail: "Missing metadata or strokes" };
  }

  var strokes = (node as MinimalStrokesMixin).strokes;

  var currentHex = String(meta.currentValue).toLowerCase();
  var targetHex = String(meta.nearestHex).toLowerCase();
  var targetRgb = hexToRgb(targetHex);

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
  return { success: true, detail: targetHex };
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

  var variable = await resolveSpacingVariable(nearestValue);
  if (variable) {
    try {
      (node as FrameNode).setBoundVariable(property as VariableBindableNodeField, variable);
    } catch (_e) {
      (node as any)[property] = nearestValue;
    }
  } else {
    (node as any)[property] = nearestValue;
  }
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
