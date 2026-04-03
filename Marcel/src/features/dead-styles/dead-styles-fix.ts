// ── Dead Styles Fix Operations ──
// Replace and detach operations for foreign variables and styles.
// Parallel to dead-styles-actions.ts (which handles local deletion).

import { hexToRgb, rgbToHex } from "../../shared/tokens";
import type { DeadItemType, DSSuggestion } from "./dead-styles-types";

// ── Result type for individual operations ──

export interface FixResult {
  success: boolean;
  detail: string;
}

// ── Individual operations ──

/**
 * Detach a foreign variable binding from a node.
 * - Paint-level (fills/strokes with paintIndex): clone array, setBoundVariableForPaint(paint, "color", null), reassign.
 * - Node-level (paddingLeft, width, etc.): setBoundVariable(field, null).
 */
export async function detachVariableBinding(
  nodeId: string,
  field: string,
  paintIndex?: number
): Promise<FixResult> {
  try {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return { success: false, detail: "Node not found" };
    }

    var sceneNode = node as SceneNode;

    // Paint-level variable binding (fills or strokes with paintIndex)
    if ((field === "fills" || field === "strokes") && paintIndex !== undefined) {
      var paintArray: readonly Paint[] | typeof figma.mixed;

      if (field === "fills" && "fills" in sceneNode) {
        paintArray = (sceneNode as MinimalFillsMixin).fills;
      } else if (field === "strokes" && "strokes" in sceneNode) {
        paintArray = (sceneNode as MinimalStrokesMixin).strokes;
      } else {
        return { success: false, detail: "Node has no " + field };
      }

      if (paintArray === figma.mixed) {
        return { success: false, detail: "Mixed " + field };
      }

      if (paintIndex < 0 || paintIndex >= paintArray.length) {
        return { success: false, detail: "Paint index out of range" };
      }

      // Clone the paint array (immutability requirement)
      var newPaints: Paint[] = [];
      for (var i = 0; i < paintArray.length; i++) {
        if (i === paintIndex) {
          // Detach the variable binding on this paint
          var detachedPaint = figma.variables.setBoundVariableForPaint(
            paintArray[i] as SolidPaint,
            "color",
            null as any
          );
          newPaints.push(detachedPaint);
        } else {
          newPaints.push(paintArray[i]);
        }
      }

      if (field === "fills") {
        (sceneNode as MinimalFillsMixin).fills = newPaints;
      } else {
        (sceneNode as MinimalStrokesMixin).strokes = newPaints;
      }

      return { success: true, detail: "Variable binding detached from " + field + "[" + paintIndex + "]" };
    }

    // Node-level variable binding (paddingLeft, width, itemSpacing, etc.)
    try {
      (sceneNode as any).setBoundVariable(field as VariableBindableNodeField, null);
      return { success: true, detail: "Variable binding detached from " + field };
    } catch (e: any) {
      return { success: false, detail: "Cannot detach " + field + ": " + (e?.message || "unknown error") };
    }
  } catch (error: any) {
    return { success: false, detail: error?.message || "Detach failed" };
  }
}

/**
 * Replace a foreign variable binding with a DS variable.
 * NOTE: For initial implementation, dsVariableKey may not always be available
 * (tokens.ts has hex values, not variable keys). When unavailable, UI offers detach only.
 */
export async function replaceVariableBinding(
  nodeId: string,
  field: string,
  dsVariableKey: string,
  paintIndex?: number
): Promise<FixResult> {
  try {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return { success: false, detail: "Node not found" };
    }

    var sceneNode = node as SceneNode;

    // Import the DS variable
    var dsVariable: Variable;
    try {
      dsVariable = await figma.variables.importVariableByKeyAsync(dsVariableKey);
    } catch (e: any) {
      return { success: false, detail: "Cannot import DS variable: " + (e?.message || "key not found") };
    }

    // Paint-level replacement
    if ((field === "fills" || field === "strokes") && paintIndex !== undefined) {
      var paintArray: readonly Paint[] | typeof figma.mixed;

      if (field === "fills" && "fills" in sceneNode) {
        paintArray = (sceneNode as MinimalFillsMixin).fills;
      } else if (field === "strokes" && "strokes" in sceneNode) {
        paintArray = (sceneNode as MinimalStrokesMixin).strokes;
      } else {
        return { success: false, detail: "Node has no " + field };
      }

      if (paintArray === figma.mixed) {
        return { success: false, detail: "Mixed " + field };
      }

      if (paintIndex < 0 || paintIndex >= paintArray.length) {
        return { success: false, detail: "Paint index out of range" };
      }

      // Clone the paint array with the DS variable bound
      var newPaints: Paint[] = [];
      for (var i = 0; i < paintArray.length; i++) {
        if (i === paintIndex) {
          var boundPaint = figma.variables.setBoundVariableForPaint(
            paintArray[i] as SolidPaint,
            "color",
            dsVariable
          );
          newPaints.push(boundPaint);
        } else {
          newPaints.push(paintArray[i]);
        }
      }

      if (field === "fills") {
        (sceneNode as MinimalFillsMixin).fills = newPaints;
      } else {
        (sceneNode as MinimalStrokesMixin).strokes = newPaints;
      }

      return { success: true, detail: "Variable replaced in " + field + "[" + paintIndex + "]" };
    }

    // Node-level replacement
    try {
      (sceneNode as any).setBoundVariable(field as VariableBindableNodeField, dsVariable);
      return { success: true, detail: "Variable replaced on " + field };
    } catch (e: any) {
      return { success: false, detail: "Cannot replace " + field + ": " + (e?.message || "unknown error") };
    }
  } catch (error: any) {
    return { success: false, detail: error?.message || "Replace failed" };
  }
}

/**
 * Detach a foreign style binding from a node.
 * Sets the style ID to "" which removes the style reference while preserving visual value.
 */
export async function detachStyleBinding(
  nodeId: string,
  styleType: "PAINT" | "TEXT" | "EFFECT",
  bindingField: string
): Promise<FixResult> {
  try {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return { success: false, detail: "Node not found" };
    }

    var sceneNode = node as SceneNode;

    if (styleType === "PAINT" && bindingField === "fillStyleId") {
      await (sceneNode as any).setFillStyleIdAsync("");
      return { success: true, detail: "Fill style detached" };
    }

    if (styleType === "PAINT" && bindingField === "strokeStyleId") {
      await (sceneNode as any).setStrokeStyleIdAsync("");
      return { success: true, detail: "Stroke style detached" };
    }

    if (styleType === "TEXT") {
      await (sceneNode as TextNode).setTextStyleIdAsync("");
      return { success: true, detail: "Text style detached" };
    }

    if (styleType === "EFFECT") {
      await (sceneNode as any).setEffectStyleIdAsync("");
      return { success: true, detail: "Effect style detached" };
    }

    return { success: false, detail: "Unknown style type/field: " + styleType + "/" + bindingField };
  } catch (error: any) {
    return { success: false, detail: error?.message || "Detach style failed" };
  }
}

/**
 * Replace a foreign style binding with a DS style.
 * Same note as replaceVariableBinding regarding key availability.
 */
export async function replaceStyleBinding(
  nodeId: string,
  styleType: "PAINT" | "TEXT" | "EFFECT",
  dsStyleKey: string,
  bindingField: string
): Promise<FixResult> {
  try {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return { success: false, detail: "Node not found" };
    }

    var sceneNode = node as SceneNode;

    // Import the DS style
    var dsStyle: BaseStyle;
    try {
      dsStyle = await figma.importStyleByKeyAsync(dsStyleKey);
    } catch (e: any) {
      return { success: false, detail: "Cannot import DS style: " + (e?.message || "key not found") };
    }

    if (styleType === "PAINT" && bindingField === "fillStyleId") {
      await (sceneNode as any).setFillStyleIdAsync(dsStyle.id);
      return { success: true, detail: "Fill style replaced" };
    }

    if (styleType === "PAINT" && bindingField === "strokeStyleId") {
      await (sceneNode as any).setStrokeStyleIdAsync(dsStyle.id);
      return { success: true, detail: "Stroke style replaced" };
    }

    if (styleType === "TEXT") {
      await (sceneNode as TextNode).setTextStyleIdAsync(dsStyle.id);
      return { success: true, detail: "Text style replaced" };
    }

    if (styleType === "EFFECT") {
      await (sceneNode as any).setEffectStyleIdAsync(dsStyle.id);
      return { success: true, detail: "Effect style replaced" };
    }

    return { success: false, detail: "Unknown style type/field: " + styleType + "/" + bindingField };
  } catch (error: any) {
    return { success: false, detail: error?.message || "Replace style failed" };
  }
}

// ── Batch operations ──

/**
 * Batch detach all foreign items (variables and styles).
 * Per-item error handling: failures do not stop the batch.
 */
export async function batchDetachForeign(
  items: Array<{
    nodeId: string;
    field: string;
    paintIndex?: number;
    itemType: DeadItemType;
    styleType?: "PAINT" | "TEXT" | "EFFECT";
    bindingField?: string;
  }>
): Promise<{ detached: number; failed: number }> {
  var detached = 0;
  var failed = 0;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var result: FixResult;

    if (item.itemType === "VARIABLE" || (item.itemType === "PAINT" && !item.styleType)) {
      // Variable binding — itemType VARIABLE or PAINT (color variable)
      result = await detachVariableBinding(item.nodeId, item.field, item.paintIndex);
    } else {
      // Style binding — PAINT, TEXT, or EFFECT with styleType
      var styleType = item.styleType || item.itemType as "PAINT" | "TEXT" | "EFFECT";
      var bindingField = item.bindingField || item.field;
      result = await detachStyleBinding(item.nodeId, styleType, bindingField);
    }

    if (result.success) {
      detached++;
    } else {
      failed++;
    }
  }

  return { detached, failed };
}

/**
 * Batch replace foreign items with DS equivalents.
 * For color variables without DS variable keys: detach binding and apply DS hex value directly
 * (same approach as hc-autofix.ts fixFillColor).
 * Only processes items where suggestion is not null.
 */
export async function batchReplaceForeign(
  items: Array<{
    nodeId: string;
    field: string;
    paintIndex?: number;
    itemType: DeadItemType;
    suggestion: DSSuggestion | null;
    styleType?: "PAINT" | "TEXT" | "EFFECT";
    bindingField?: string;
  }>
): Promise<{ replaced: number; failed: number }> {
  var replaced = 0;
  var failed = 0;

  for (var i = 0; i < items.length; i++) {
    var item = items[i];

    // Skip items without a suggestion
    if (!item.suggestion) {
      continue;
    }

    var result: FixResult;

    // For style bindings, detach the style first
    if (item.styleType) {
      var styleType = item.styleType || item.itemType as "PAINT" | "TEXT" | "EFFECT";
      var bindingField = item.bindingField || item.field;
      await detachStyleBinding(item.nodeId, styleType, bindingField);
    }

    // Determine paint field (for style bindings: fillStyleId→fills, strokeStyleId→strokes)
    var paintField = item.field;
    if (item.field === "fillStyleId") paintField = "fills";
    else if (item.field === "strokeStyleId") paintField = "strokes";
    if (item.bindingField === "fillStyleId") paintField = "fills";
    else if (item.bindingField === "strokeStyleId") paintField = "strokes";

    // Strategy 1: Bind DS variable directly (preserves variable binding)
    if (item.suggestion.variableKey && (paintField === "fills" || paintField === "strokes")) {
      result = await replaceVariableBinding(item.nodeId, paintField, item.suggestion.variableKey, item.paintIndex);
    } else if (item.suggestion.tokenHex && (paintField === "fills" || paintField === "strokes")) {
      // Strategy 2: Fallback to hex color
      result = await replaceWithDSColor(item.nodeId, paintField, item.suggestion.tokenHex, item.paintIndex);
    } else {
      // Non-color or no replacement available: detach only
      if (!item.styleType) {
        result = await detachVariableBinding(item.nodeId, item.field, item.paintIndex);
      } else {
        result = { success: true, detail: "Style detached (no color replacement)" };
      }
    }

    if (result.success) {
      replaced++;
    } else {
      failed++;
    }
  }

  return { replaced, failed };
}

// ── Helper: Replace with DS color (detach binding + apply hex value) ──

async function replaceWithDSColor(
  nodeId: string,
  field: string,
  targetHex: string,
  paintIndex?: number
): Promise<FixResult> {
  try {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return { success: false, detail: "Node not found" };
    }

    var sceneNode = node as SceneNode;
    var targetRgb = hexToRgb(targetHex);

    if (field === "fills" && "fills" in sceneNode) {
      var fills = (sceneNode as MinimalFillsMixin).fills;
      if (fills === figma.mixed) {
        return { success: false, detail: "Mixed fills" };
      }

      var newFills: Paint[] = [];
      for (var i = 0; i < fills.length; i++) {
        if (paintIndex !== undefined && i !== paintIndex) {
          newFills.push(fills[i]);
          continue;
        }
        if (fills[i].type === "SOLID") {
          // Detach any variable binding first
          var detachedPaint = figma.variables.setBoundVariableForPaint(
            fills[i] as SolidPaint,
            "color",
            null as any
          );
          // Apply DS color
          var newPaint: SolidPaint = {
            type: "SOLID",
            color: targetRgb,
            opacity: (detachedPaint as SolidPaint).opacity,
            visible: detachedPaint.visible,
            blendMode: detachedPaint.blendMode,
          };
          newFills.push(newPaint);
        } else {
          newFills.push(fills[i]);
        }
      }
      (sceneNode as MinimalFillsMixin).fills = newFills;
      return { success: true, detail: "Replaced with " + targetHex };
    }

    if (field === "strokes" && "strokes" in sceneNode) {
      var strokes = (sceneNode as MinimalStrokesMixin).strokes;

      var newStrokes: Paint[] = [];
      for (var j = 0; j < strokes.length; j++) {
        if (paintIndex !== undefined && j !== paintIndex) {
          newStrokes.push(strokes[j]);
          continue;
        }
        if (strokes[j].type === "SOLID") {
          var detachedStroke = figma.variables.setBoundVariableForPaint(
            strokes[j] as SolidPaint,
            "color",
            null as any
          );
          var newStroke: SolidPaint = {
            type: "SOLID",
            color: targetRgb,
            opacity: (detachedStroke as SolidPaint).opacity,
            visible: detachedStroke.visible,
            blendMode: detachedStroke.blendMode,
          };
          newStrokes.push(newStroke);
        } else {
          newStrokes.push(strokes[j]);
        }
      }
      (sceneNode as MinimalStrokesMixin).strokes = newStrokes;
      return { success: true, detail: "Replaced with " + targetHex };
    }

    return { success: false, detail: "Cannot apply color to " + field };
  } catch (error: any) {
    return { success: false, detail: error?.message || "Replace color failed" };
  }
}
