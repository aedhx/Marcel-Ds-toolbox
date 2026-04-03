// ── Linter Auto-fix ──
// Applies heuristic renaming for layers with naming violations.

import { Violation } from "../../shared/violation-types";

var DEFAULT_NAME_REGEX =
  /^(Frame|Rectangle|Ellipse|Line|Group|Vector|Text|Polygon|Star|Image|Slice|Component|Instance|Boolean|Section)\s*\d*$/i;

var NUMBERED_SUFFIX_REGEX = /\s+\d+$/;

// ── Deduplicate sibling names ──

function deduplicateSiblingName(node: SceneNode, desiredName: string): string {
  var parent = node.parent;
  if (!parent || !("children" in parent)) return desiredName;

  var siblings = (parent as ChildrenMixin).children;
  var existingNames: Record<string, boolean> = {};
  for (var i = 0; i < siblings.length; i++) {
    if (siblings[i].id !== node.id) {
      existingNames[siblings[i].name] = true;
    }
  }

  if (!existingNames[desiredName]) return desiredName;

  var counter = 2;
  while (existingNames[desiredName + " " + counter]) {
    counter++;
  }
  return desiredName + " " + counter;
}

// ── Compute auto-fix name for default-name violations ──

async function computeAutoFixName(node: SceneNode): Promise<string | null> {
  if (node.type === "RECTANGLE") {
    var rParent = node.parent;
    if (rParent && "width" in rParent && "height" in rParent) {
      var rnW = node.width;
      var rnH = node.height;
      if (rnW > rnH * 10 && rnH <= 2) return "Divider";
      var rpW = (rParent as any).width as number;
      var rpH = (rParent as any).height as number;
      if (Math.abs(rnW - rpW) < 2 && Math.abs(rnH - rpH) < 2) return "Background";
    }
    var rFills = (node as RectangleNode).fills;
    if (Array.isArray(rFills)) {
      for (var rf = 0; rf < rFills.length; rf++) {
        if (rFills[rf].type === "IMAGE") return "Image";
      }
    }
    var rect = node as RectangleNode;
    if (typeof rect.cornerRadius === "number" && rect.cornerRadius > 0) {
      var rHasShadow = false;
      for (var re = 0; re < rect.effects.length; re++) {
        if (rect.effects[re].type === "DROP_SHADOW") { rHasShadow = true; break; }
      }
      if (rHasShadow) return "Card";
    }
    return "Shape";
  }

  if (node.type === "FRAME") {
    var frame = node as FrameNode;
    if (frame.layoutMode === "VERTICAL") return "Column";
    if (frame.layoutMode === "HORIZONTAL") return "Row";
    if ("children" in frame && frame.children.length === 1) {
      var fChild = frame.children[0];
      if (fChild.type === "TEXT") {
        var fText = (fChild as TextNode).characters.trim();
        if (fText.length > 0) {
          return fText.length > 30 ? fText.substring(0, 27) + "..." : fText;
        }
      }
      if (fChild.type === "INSTANCE") {
        var fInst = fChild as InstanceNode;
        var fMainComp = await fInst.getMainComponentAsync();
        if (fMainComp) return fMainComp.name;
      }
      return "Wrapper/" + fChild.name;
    }
    if ("children" in frame && frame.children.length === 0) return "Empty Frame";
    return "Container";
  }

  if (node.type === "ELLIPSE") {
    if (node.width === node.height && node.width <= 48) {
      return node.width <= 12 ? "Dot" : "Avatar";
    }
    return "Ellipse Shape";
  }

  if (node.type === "TEXT") {
    var txContent = (node as TextNode).characters.trim();
    if (txContent.length > 0) {
      var txWords = txContent.split(/\s+/).slice(0, 3).join(" ");
      return txWords.length > 30 ? txWords.substring(0, 27) + "..." : txWords;
    }
    return "Text";
  }

  if (node.type === "LINE") return "Separator";
  if (node.type === "VECTOR") return "Icon";

  if (node.type === "GROUP") {
    var grpNode = node as GroupNode;
    if (grpNode.children.length > 0) {
      var grpCounts: Record<string, number> = {};
      for (var j = 0; j < grpNode.children.length; j++) {
        var gt = grpNode.children[j].type;
        grpCounts[gt] = (grpCounts[gt] || 0) + 1;
      }
      var grpDom = grpNode.children[0].type;
      var grpMax = 0;
      for (var gk in grpCounts) {
        if (grpCounts[gk] > grpMax) {
          grpMax = grpCounts[gk];
          grpDom = gk;
        }
      }
      return "Group/" + grpDom.toLowerCase() + "s";
    }
    return "Empty Group";
  }

  return "Layer";
}

// ── Fix a single node (async for dynamic-page) ──

export async function autoFixNode(
  nodeId: string,
  suggestion?: string
): Promise<{ success: boolean; newName: string }> {
  var node = await figma.getNodeByIdAsync(nodeId);
  if (!node || !("name" in node)) {
    return { success: false, newName: "" };
  }

  var sceneNode = node as SceneNode;
  var currentName = sceneNode.name;
  var newName: string | null = null;

  // Priority 1: Use provided suggestion directly
  if (suggestion && suggestion.length > 0) {
    newName = suggestion;
  }
  // Priority 2: Numbered suffix removal
  else if (NUMBERED_SUFFIX_REGEX.test(currentName) && !DEFAULT_NAME_REGEX.test(currentName)) {
    newName = currentName.replace(NUMBERED_SUFFIX_REGEX, "");
  }
  // Priority 3: Compute from heuristics
  else if (DEFAULT_NAME_REGEX.test(currentName)) {
    newName = await computeAutoFixName(sceneNode);
  }

  if (newName && newName !== currentName) {
    var finalName = deduplicateSiblingName(sceneNode, newName);
    sceneNode.name = finalName;
    return { success: true, newName: finalName };
  }

  return { success: false, newName: currentName };
}

// ── Fix all auto-fixable violations (async) ──

export async function autoFixAll(
  violations: Violation[]
): Promise<{ fixed: number; failed: number; fixedNodeIds: string[] }> {
  var fixed = 0;
  var failed = 0;
  var fixedNodeIds: string[] = [];

  var fixable: Violation[] = [];
  for (var i = 0; i < violations.length; i++) {
    if (violations[i].confidence !== undefined && violations[i].confidence !== "low") {
      fixable.push(violations[i]);
    }
  }

  if (fixable.length === 0) {
    return { fixed: 0, failed: 0, fixedNodeIds: [] };
  }

  // Step 1: Select all fixable nodes
  var allFixableNodes: SceneNode[] = [];
  for (var s = 0; s < fixable.length; s++) {
    var sn = await figma.getNodeByIdAsync(fixable[s].nodeId);
    if (sn && "type" in sn && sn.type !== "DOCUMENT" && sn.type !== "PAGE") {
      allFixableNodes.push(sn as SceneNode);
    }
  }
  if (allFixableNodes.length > 0) {
    figma.currentPage.selection = allFixableNodes;
  }

  // Step 2: Apply all fixes
  for (var j = 0; j < fixable.length; j++) {
    var v = fixable[j];
    var result = await autoFixNode(v.nodeId, v.suggestion);
    if (result.success) {
      fixed++;
      fixedNodeIds.push(v.nodeId);
    } else {
      failed++;
    }
  }

  // Step 3: Select fixed nodes and zoom
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

  return { fixed: fixed, failed: failed, fixedNodeIds: fixedNodeIds };
}
