// ── Linter Engine ──
// Async linter engine using Phase 1 shared infrastructure.
// Produces Violation[] (shared type) via traverseNodes().

import { traverseNodes, ScanAbortToken, TraversalScope } from "../../shared/node-traversal";
import { Violation } from "../../shared/violation-types";
import { buildScoreResult, calculateCategoryScore, ScoreResult } from "../../shared/scoring";
import { LinterConfig } from "./linter-config";
import { rgbToHex, DS_TOKENS } from "../../shared/tokens";

// ── Exported types ──

export interface LintResult {
  totalNodes: number;
  violations: Violation[];
  score: ScoreResult;
  scanDuration: number;
  errorCount: number;
  warningCount: number;
  infoCount: number;
  byRule: Record<string, { count: number; fixableCount: number }>;
}

export interface PageLintResult {
  pageId: string;
  pageName: string;
  result: LintResult;
}

// ── Rule patterns (PRD V2) ──

var DEFAULT_NAME_REGEX =
  /^(Frame|Rectangle|Ellipse|Line|Group|Vector|Text|Polygon|Star|Image|Slice|Component|Instance|Boolean|Section)\s*\d*$/i;

var BASE_VAGUE_NAMES = [
  "container", "wrapper", "element", "item", "box",
  "block", "content", "inner", "outer", "main",
  "div", "section", "comp", "layer",
];

var SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s\-_\/\.àéèêëïîôùûüçÀÉÈÊËÏÎÔÙÛÜÇ]/;

var NUMBERED_SUFFIX_REGEX = /\s+\d+$/;

// ── DS color hex set for style rules (O(1) token color lookup) ──
var DS_LINTER_COLOR_SET = new Set<string>();
(function() {
  var colorTokens = DS_TOKENS.filter(function(t) { return t.category === "color"; });
  for (var i = 0; i < colorTokens.length; i++) {
    DS_LINTER_COLOR_SET.add(colorTokens[i].value.toLowerCase());
  }
})();

// ── Confidence levels for filtering ──

var CONFIDENCE_ORDER: Record<string, number> = { "high": 3, "medium": 2, "low": 1 };

function meetsConfidenceThreshold(
  confidence: "high" | "medium" | "low" | undefined,
  threshold: "high" | "medium" | "low"
): boolean {
  if (!confidence) return false;
  return CONFIDENCE_ORDER[confidence] >= CONFIDENCE_ORDER[threshold];
}

// ── Helpers ──

function buildParentPath(node: SceneNode, maxLevels: number = 3): string {
  var parts: string[] = [];
  var current: BaseNode | null = node.parent;
  var level = 0;
  while (current && level < maxLevels) {
    if (current.type === "PAGE" || current.type === "DOCUMENT") break;
    parts.unshift(current.name);
    current = current.parent;
    level++;
  }
  return parts.join(" > ");
}

function shouldSkipNode(node: SceneNode, config: LinterConfig): boolean {
  if ("visible" in node && !node.visible) return true;
  if (node.name.startsWith("_") || node.name.startsWith(".")) return true;
  // Ignored layers
  for (var i = 0; i < config.ignoredLayers.length; i++) {
    if (node.name === config.ignoredLayers[i]) return true;
  }
  return false;
}

function getNodeDepth(node: SceneNode): number {
  var depth = 0;
  var current: BaseNode | null = node.parent;
  while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
    depth++;
    current = current.parent;
  }
  return depth;
}

function isOnIgnoredPage(config: LinterConfig, pageName: string): boolean {
  for (var i = 0; i < config.ignoredPages.length; i++) {
    if (pageName === config.ignoredPages[i]) return true;
  }
  return false;
}

// ── Style rule helpers ──

function extractNodeColors(node: SceneNode): string[] {
  var colors: string[] = [];
  if ("fills" in node) {
    var fills = (node as GeometryMixin).fills;
    if (Array.isArray(fills)) {
      for (var i = 0; i < fills.length; i++) {
        if (fills[i].type === "SOLID" && fills[i].visible !== false) {
          var c = fills[i].color;
          colors.push(rgbToHex(c.r, c.g, c.b).toLowerCase());
        }
      }
    }
  }
  if ("strokes" in node) {
    var strokes = (node as GeometryMixin).strokes;
    if (Array.isArray(strokes)) {
      for (var j = 0; j < strokes.length; j++) {
        if (strokes[j].type === "SOLID" && strokes[j].visible !== false) {
          var sc = strokes[j].color;
          colors.push(rgbToHex(sc.r, sc.g, sc.b).toLowerCase());
        }
      }
    }
  }
  return colors;
}

// ── Auto-fix suggestion heuristics ──

interface AutoFixSuggestion {
  name: string;
  confidence: "high" | "medium" | "low";
}

async function suggestAutoFix(node: SceneNode): Promise<AutoFixSuggestion | null> {
  if (!DEFAULT_NAME_REGEX.test(node.name)) return null;

  // Rectangle heuristics
  if (node.type === "RECTANGLE") {
    var rParent = node.parent;
    if (rParent && "width" in rParent && "height" in rParent) {
      var rnW = node.width;
      var rnH = node.height;
      // Thin full-width → Divider
      if (rnW > rnH * 10 && rnH <= 2) {
        return { name: "Divider", confidence: "high" };
      }
      // Same size as parent with fills → Background
      var rpW = (rParent as any).width as number;
      var rpH = (rParent as any).height as number;
      if (Math.abs(rnW - rpW) < 2 && Math.abs(rnH - rpH) < 2) {
        return { name: "Background", confidence: "medium" };
      }
    }
    var rFills = (node as RectangleNode).fills;
    if (Array.isArray(rFills)) {
      for (var rf = 0; rf < rFills.length; rf++) {
        if (rFills[rf].type === "IMAGE") return { name: "Image", confidence: "high" };
      }
    }
    if (
      "cornerRadius" in node &&
      typeof node.cornerRadius === "number" &&
      node.cornerRadius > 0
    ) {
      var rHasShadow = false;
      for (var re = 0; re < node.effects.length; re++) {
        if (node.effects[re].type === "DROP_SHADOW") { rHasShadow = true; break; }
      }
      if (rHasShadow) return { name: "Card", confidence: "medium" };
      return { name: "Shape", confidence: "medium" };
    }
    // Fallback for any rectangle
    return { name: "Shape", confidence: "medium" };
  }

  // Frame heuristics
  if (node.type === "FRAME") {
    var frame = node as FrameNode;
    if (frame.layoutMode === "VERTICAL") return { name: "Column", confidence: "medium" };
    if (frame.layoutMode === "HORIZONTAL") return { name: "Row", confidence: "medium" };
    if ("children" in frame && frame.children.length === 1) {
      var fChild = frame.children[0];
      if (fChild.type === "TEXT") {
        var fText = (fChild as TextNode).characters.trim();
        if (fText.length > 0) {
          var fLabel = fText.length > 30 ? fText.substring(0, 27) + "..." : fText;
          return { name: fLabel, confidence: "low" };
        }
      }
      if (fChild.type === "INSTANCE") {
        var fInst = fChild as InstanceNode;
        var fMain = await fInst.getMainComponentAsync();
        if (fMain) return { name: fMain.name, confidence: "medium" };
      }
      return { name: "Wrapper/" + fChild.name, confidence: "low" };
    }
    if ("children" in frame && frame.children.length === 0) {
      return { name: "Empty Frame", confidence: "low" };
    }
    // Fallback: frame with multiple children
    return { name: "Container", confidence: "medium" };
  }

  // Ellipse
  if (node.type === "ELLIPSE") {
    if (node.width === node.height && node.width <= 48) {
      return { name: node.width <= 12 ? "Dot" : "Avatar", confidence: "medium" };
    }
    return { name: "Ellipse Shape", confidence: "low" };
  }

  // Text
  if (node.type === "TEXT") {
    var txContent = (node as TextNode).characters.trim();
    if (txContent.length > 0) {
      var txWords = txContent.split(/\s+/).slice(0, 3).join(" ");
      var txLabel = txWords.length > 30 ? txWords.substring(0, 27) + "..." : txWords;
      return { name: txLabel, confidence: "high" };
    }
    return { name: "Text", confidence: "low" };
  }

  // Line / Vector
  if (node.type === "LINE") return { name: "Separator", confidence: "medium" };
  if (node.type === "VECTOR") return { name: "Icon", confidence: "medium" };
  if (node.type === "POLYGON") return { name: "Polygon Shape", confidence: "low" };
  if (node.type === "STAR") return { name: "Star Shape", confidence: "low" };
  if (node.type === "SLICE") return { name: "Slice", confidence: "low" };
  if (node.type === "BOOLEAN_OPERATION" as any) return { name: "Boolean Shape", confidence: "low" };

  // Group
  if (node.type === "GROUP") {
    var grpChildren = (node as GroupNode).children;
    if (grpChildren.length > 0) {
      var grpCounts: Record<string, number> = {};
      for (var g = 0; g < grpChildren.length; g++) {
        var gct = grpChildren[g].type;
        grpCounts[gct] = (grpCounts[gct] || 0) + 1;
      }
      var grpDominant = grpChildren[0].type;
      var grpMax = 0;
      for (var gk in grpCounts) {
        if (grpCounts[gk] > grpMax) {
          grpMax = grpCounts[gk];
          grpDominant = gk;
        }
      }
      return { name: "Group/" + grpDominant.toLowerCase() + "s", confidence: "low" };
    }
    return { name: "Empty Group", confidence: "low" };
  }

  // Section
  if (node.type === "SECTION") return { name: "Section", confidence: "low" };

  // Ultimate fallback
  return { name: "Layer", confidence: "low" };
}

// ── Internal: run the 17 rules on a flat node array ──

interface CollectedNode {
  node: SceneNode;
  path: string;
}

async function runRulesOnNodes(
  collectedNodes: CollectedNode[],
  config: LinterConfig
): Promise<Violation[]> {
  var violations: Violation[] = [];

  // ── Pre-computation for unused-components rule ──
  var usedComponentIds = new Set<string>();
  if (config.enabledRules["unused-components"] !== false) {
    for (var uc = 0; uc < collectedNodes.length; uc++) {
      var ucNode = collectedNodes[uc].node;
      if (ucNode.type === "INSTANCE") {
        var mainComp = await (ucNode as InstanceNode).getMainComponentAsync();
        if (mainComp) usedComponentIds.add(mainComp.id);
      }
    }
  }

  // Build vague names set (base + custom)
  var vagueNames = new Set(BASE_VAGUE_NAMES);
  for (var cv = 0; cv < config.customVagueNames.length; cv++) {
    var custom = config.customVagueNames[cv].trim().toLowerCase();
    if (custom.length > 0) vagueNames.add(custom);
  }

  var threshold = config.autoFixConfidenceThreshold;
  var maxLen = config.maxNameLength || 60;

  // ── Rule 1: DEFAULT_NAME (error) ──
  if (config.enabledRules["default-names"] !== false) {
    for (var i = 0; i < collectedNodes.length; i++) {
      var node = collectedNodes[i].node;
      var nodePath = collectedNodes[i].path;
      if (DEFAULT_NAME_REGEX.test(node.name)) {
        var fix = await suggestAutoFix(node);
        violations.push({
          id: "lint-default-names-" + node.id,
          nodeId: node.id,
          nodeName: node.name,
          nodePath: nodePath,
          rule: "default-names",
          severity: "error",
          category: "naming",
          message: "\"" + node.name + "\" est un nom par d\u00e9faut Figma.",
          suggestion: fix ? fix.name : undefined,
          confidence: fix ? fix.confidence : undefined,
          autoFixable: !!(fix && fix.confidence !== "low"),
          metadata: { ruleName: "Noms par d\u00e9faut", nodeType: node.type },
        });
      }
    }
  }

  // ── Rule 2: VAGUE_NAME (warning) ──
  if (config.enabledRules["vague-names"] !== false) {
    for (var i2 = 0; i2 < collectedNodes.length; i2++) {
      var node2 = collectedNodes[i2].node;
      var nodePath2 = collectedNodes[i2].path;
      if (vagueNames.has(node2.name.toLowerCase())) {
        violations.push({
          id: "lint-vague-names-" + node2.id,
          nodeId: node2.id,
          nodeName: node2.name,
          nodePath: nodePath2,
          rule: "vague-names",
          severity: "warning",
          category: "naming",
          message: "\"" + node2.name + "\" est un nom trop g\u00e9n\u00e9rique.",
          autoFixable: false,
          metadata: { ruleName: "Noms vagues", nodeType: node2.type },
        });
      }
    }
  }

  // ── Rule 3: DUPLICATE_SIBLINGS (warning) ──
  if (config.enabledRules["duplicate-siblings"] !== false) {
    var parentMap: Record<string, CollectedNode[]> = {};
    for (var i3 = 0; i3 < collectedNodes.length; i3++) {
      var node3 = collectedNodes[i3].node;
      if (node3.parent && "id" in node3.parent) {
        var parentId = node3.parent.id;
        if (!parentMap[parentId]) parentMap[parentId] = [];
        parentMap[parentId].push(collectedNodes[i3]);
      }
    }
    for (var pid in parentMap) {
      var siblings = parentMap[pid];
      var nameCount: Record<string, number> = {};
      for (var s = 0; s < siblings.length; s++) {
        nameCount[siblings[s].node.name] = (nameCount[siblings[s].node.name] || 0) + 1;
      }
      for (var dupName in nameCount) {
        if (nameCount[dupName] > 1) {
          for (var s2 = 0; s2 < siblings.length; s2++) {
            if (siblings[s2].node.name === dupName) {
              violations.push({
                id: "lint-duplicate-siblings-" + siblings[s2].node.id,
                nodeId: siblings[s2].node.id,
                nodeName: siblings[s2].node.name,
                nodePath: siblings[s2].path,
                rule: "duplicate-siblings",
                severity: "warning",
                category: "naming",
                message: "\"" + dupName + "\" appara\u00eet " + nameCount[dupName] + " fois au m\u00eame niveau.",
                autoFixable: false,
                metadata: { ruleName: "Doublons fr\u00e8res", nodeType: siblings[s2].node.type },
              });
            }
          }
        }
      }
    }
  }

  // ── Rule 4: COMPONENT_CONVENTION (error) ──
  if (config.enabledRules["component-naming"] !== false) {
    for (var i4 = 0; i4 < collectedNodes.length; i4++) {
      var node4 = collectedNodes[i4].node;
      var nodePath4 = collectedNodes[i4].path;
      if (node4.type === "COMPONENT" || node4.type === "COMPONENT_SET") {
        if (!node4.name.includes("/")) {
          violations.push({
            id: "lint-component-naming-" + node4.id,
            nodeId: node4.id,
            nodeName: node4.name,
            nodePath: nodePath4,
            rule: "component-naming",
            severity: "error",
            category: "naming",
            message: "Le composant \"" + node4.name + "\" n'est pas cat\u00e9goris\u00e9 (pas de \"/\").",
            autoFixable: false,
            metadata: { ruleName: "Nommage composant", nodeType: node4.type },
          });
        }
      }
    }
  }

  // ── Rule 5: LONG_NAME (info) ──
  if (config.enabledRules["long-names"] !== false) {
    for (var i5 = 0; i5 < collectedNodes.length; i5++) {
      var node5 = collectedNodes[i5].node;
      var nodePath5 = collectedNodes[i5].path;
      if (node5.name.length > maxLen) {
        violations.push({
          id: "lint-long-names-" + node5.id,
          nodeId: node5.id,
          nodeName: node5.name,
          nodePath: nodePath5,
          rule: "long-names",
          severity: "info",
          category: "naming",
          message: "Le nom fait " + node5.name.length + " caract\u00e8res (max recommand\u00e9 : " + maxLen + ").",
          autoFixable: false,
          metadata: { ruleName: "Noms trop longs", nodeType: node5.type },
        });
      }
    }
  }

  // ── Rule 6: SPECIAL_CHARS (info) ──
  if (config.enabledRules["special-chars"] !== false) {
    for (var i6 = 0; i6 < collectedNodes.length; i6++) {
      var node6 = collectedNodes[i6].node;
      var nodePath6 = collectedNodes[i6].path;
      if (SPECIAL_CHARS_REGEX.test(node6.name)) {
        violations.push({
          id: "lint-special-chars-" + node6.id,
          nodeId: node6.id,
          nodeName: node6.name,
          nodePath: nodePath6,
          rule: "special-chars",
          severity: "info",
          category: "naming",
          message: "\"" + node6.name + "\" contient des caract\u00e8res non-standard.",
          autoFixable: false,
          metadata: { ruleName: "Caract\u00e8res sp\u00e9ciaux", nodeType: node6.type },
        });
      }
    }
  }

  // ── Rule 7: NUMBERED_SUFFIX (warning) ──
  if (config.enabledRules["numbered-suffix"] !== false) {
    for (var i7 = 0; i7 < collectedNodes.length; i7++) {
      var node7 = collectedNodes[i7].node;
      var nodePath7 = collectedNodes[i7].path;
      if (DEFAULT_NAME_REGEX.test(node7.name)) continue;
      if (NUMBERED_SUFFIX_REGEX.test(node7.name)) {
        var baseName = node7.name.replace(NUMBERED_SUFFIX_REGEX, "");
        violations.push({
          id: "lint-numbered-suffix-" + node7.id,
          nodeId: node7.id,
          nodeName: node7.name,
          nodePath: nodePath7,
          rule: "numbered-suffix",
          severity: "warning",
          category: "naming",
          message: "\"" + node7.name + "\" se termine par un suffixe num\u00e9rique (copier-coller probable).",
          suggestion: baseName,
          confidence: "high",
          autoFixable: true,            // confidence "high" !== "low" \u2014 matches byRule.fixableCount
          metadata: { ruleName: "Suffixe num\u00e9rique", nodeType: node7.type },
        });
      }
    }
  }

  // ── Rule 8: TEXT_MISMATCH (warning) ──
  if (config.enabledRules["text-mismatch"] !== false) {
    for (var i8 = 0; i8 < collectedNodes.length; i8++) {
      var node8 = collectedNodes[i8].node;
      var nodePath8 = collectedNodes[i8].path;
      if (node8.type !== "TEXT") continue;
      // Skip if already caught by default-names rule
      if (DEFAULT_NAME_REGEX.test(node8.name)) continue;
      var textContent = (node8 as TextNode).characters.trim();
      if (textContent.length === 0) continue;
      var textPreview = textContent.split(/\s+/).slice(0, 5).join(" ");
      if (textPreview.length > 40) textPreview = textPreview.substring(0, 37) + "...";
      var nameLower = node8.name.toLowerCase().trim();
      var contentLower = textContent.toLowerCase();
      if (contentLower.indexOf(nameLower) !== -1 || nameLower.indexOf(contentLower.substring(0, 20)) !== -1) continue;
      var nameFirstWord = nameLower.split(/[\s\-_\/]/)[0];
      var contentFirstWord = contentLower.split(/\s+/)[0];
      if (nameFirstWord.length > 2 && contentFirstWord.indexOf(nameFirstWord) !== -1) continue;
      var suggestedName = textContent.split(/\s+/).slice(0, 3).join(" ");
      if (suggestedName.length > 30) suggestedName = suggestedName.substring(0, 27) + "...";
      violations.push({
        id: "lint-text-mismatch-" + node8.id,
        nodeId: node8.id,
        nodeName: node8.name,
        nodePath: nodePath8,
        rule: "text-mismatch",
        severity: "warning",
        category: "naming",
        message: "Le nom \"" + node8.name + "\" ne correspond pas au contenu visible \"" + textPreview + "\".",
        suggestion: suggestedName,
        confidence: "high",
        autoFixable: true,            // confidence "high" !== "low" \u2014 matches byRule.fixableCount
        metadata: { ruleName: "Texte incoh\u00e9rent", nodeType: node8.type },
      });
    }
  }

  // ── Rule 9: EMPTY_FRAMES (warning) ──
  if (config.enabledRules["empty-frames"] !== false) {
    for (var i9 = 0; i9 < collectedNodes.length; i9++) {
      var node9 = collectedNodes[i9].node;
      var nodePath9 = collectedNodes[i9].path;
      if (
        (node9.type === "FRAME" && (node9 as FrameNode).children.length === 0) ||
        (node9.type === "GROUP" && (node9 as GroupNode).children.length === 0)
      ) {
        violations.push({
          id: "lint-empty-frames-" + node9.id,
          nodeId: node9.id,
          nodeName: node9.name,
          nodePath: nodePath9,
          rule: "empty-frames",
          severity: "warning",
          category: "structure",
          message: "\"" + node9.name + "\" est un frame/groupe vide sans contenu.",
          autoFixable: false,
          metadata: { ruleName: "Frames vides", nodeType: node9.type },
        });
      }
    }
  }

  // ── Rule 10: EXCESSIVE_NESTING (warning) ──
  if (config.enabledRules["excessive-nesting"] !== false) {
    var maxNesting = config.maxNestingDepth || 8;
    for (var i10 = 0; i10 < collectedNodes.length; i10++) {
      var node10 = collectedNodes[i10].node;
      var nodePath10 = collectedNodes[i10].path;
      var depth = getNodeDepth(node10);
      if (depth > maxNesting) {
        violations.push({
          id: "lint-excessive-nesting-" + node10.id,
          nodeId: node10.id,
          nodeName: node10.name,
          nodePath: nodePath10,
          rule: "excessive-nesting",
          severity: "warning",
          category: "structure",
          message: "\"" + node10.name + "\" est imbrique a " + depth + " niveaux (max recommande : " + maxNesting + ").",
          autoFixable: false,
          metadata: { ruleName: "Imbrication excessive", nodeType: node10.type, depth: depth },
        });
      }
    }
  }

  // ── Rule 11: SINGLE_CHILD_GROUPS (info) ──
  if (config.enabledRules["single-child-groups"] !== false) {
    for (var i11 = 0; i11 < collectedNodes.length; i11++) {
      var node11 = collectedNodes[i11].node;
      var nodePath11 = collectedNodes[i11].path;
      var isSingleChildGroup = node11.type === "GROUP" && (node11 as GroupNode).children.length === 1;
      var isSingleChildFrame = node11.type === "FRAME" && (node11 as FrameNode).layoutMode === "NONE" && (node11 as FrameNode).children.length === 1;
      if (isSingleChildGroup || isSingleChildFrame) {
        var childName = "children" in node11 ? ((node11 as FrameNode | GroupNode).children[0] as SceneNode).name : undefined;
        violations.push({
          id: "lint-single-child-groups-" + node11.id,
          nodeId: node11.id,
          nodeName: node11.name,
          nodePath: nodePath11,
          rule: "single-child-groups",
          severity: "info",
          category: "structure",
          message: "\"" + node11.name + "\" est un groupe/frame avec un seul enfant (wrapper inutile potentiel).",
          suggestion: childName,
          confidence: "low",
          autoFixable: false,           // confidence "low" — excluded from byRule.fixableCount
          metadata: { ruleName: "Groupes a enfant unique", nodeType: node11.type },
        });
      }
    }
  }

  // ── Rule 12: ORPHAN_LAYERS (info) ──
  if (config.enabledRules["orphan-layers"] !== false) {
    for (var i12 = 0; i12 < collectedNodes.length; i12++) {
      var node12 = collectedNodes[i12].node;
      var nodePath12 = collectedNodes[i12].path;
      if (
        node12.parent && node12.parent.type === "PAGE" &&
        node12.type !== "FRAME" && node12.type !== "SECTION" && node12.type !== "COMPONENT_SET"
      ) {
        violations.push({
          id: "lint-orphan-layers-" + node12.id,
          nodeId: node12.id,
          nodeName: node12.name,
          nodePath: nodePath12,
          rule: "orphan-layers",
          severity: "info",
          category: "structure",
          message: "\"" + node12.name + "\" est directement sur la page, en dehors de tout frame.",
          autoFixable: false,
          metadata: { ruleName: "Layers orphelins", nodeType: node12.type },
        });
      }
    }
  }

  // ── Rule 13: UNUSED_COMPONENTS (info) ──
  if (config.enabledRules["unused-components"] !== false) {
    for (var i13 = 0; i13 < collectedNodes.length; i13++) {
      var node13 = collectedNodes[i13].node;
      var nodePath13 = collectedNodes[i13].path;
      if (node13.type === "COMPONENT" && !usedComponentIds.has(node13.id)) {
        violations.push({
          id: "lint-unused-components-" + node13.id,
          nodeId: node13.id,
          nodeName: node13.name,
          nodePath: nodePath13,
          rule: "unused-components",
          severity: "info",
          category: "structure",
          message: "Le composant \"" + node13.name + "\" n'a aucune instance dans ce scope.",
          autoFixable: false,
          metadata: { ruleName: "Composants inutilises", nodeType: node13.type },
        });
      }
    }
  }

  // ── Rule 14: NON_TOKEN_COLORS (warning) ──
  if (config.enabledRules["non-token-colors"] !== false) {
    for (var i14 = 0; i14 < collectedNodes.length; i14++) {
      var node14 = collectedNodes[i14].node;
      var nodePath14 = collectedNodes[i14].path;
      // Skip TEXT nodes (text color handled by typography rules in HC)
      if (node14.type === "TEXT") continue;
      var nodeColors = extractNodeColors(node14);
      var offTokenColors: string[] = [];
      for (var ci14 = 0; ci14 < nodeColors.length; ci14++) {
        if (!DS_LINTER_COLOR_SET.has(nodeColors[ci14])) {
          offTokenColors.push(nodeColors[ci14]);
        }
      }
      if (offTokenColors.length > 0) {
        violations.push({
          id: "lint-non-token-colors-" + node14.id,
          nodeId: node14.id,
          nodeName: node14.name,
          nodePath: nodePath14,
          rule: "non-token-colors",
          severity: "warning",
          category: "style",
          message: "\"" + node14.name + "\" utilise des couleurs hors tokens DS : " + offTokenColors.join(", ") + ".",
          autoFixable: false,
          metadata: { ruleName: "Couleurs hors tokens", nodeType: node14.type, offTokenColors: offTokenColors },
        });
      }
    }
  }

  // ── Rule 15: INCONSISTENT_RADIUS (warning) ──
  if (config.enabledRules["inconsistent-radius"] !== false) {
    var parentRadiusMap: Record<string, { radii: Set<number>; nodes: Array<{ cn: CollectedNode; radius: number }> }> = {};
    for (var i15 = 0; i15 < collectedNodes.length; i15++) {
      var node15 = collectedNodes[i15].node;
      if ("cornerRadius" in node15 && typeof node15.cornerRadius === "number") {
        var parentNode15 = node15.parent;
        if (parentNode15 && "id" in parentNode15) {
          var pid15 = parentNode15.id;
          if (!parentRadiusMap[pid15]) {
            parentRadiusMap[pid15] = { radii: new Set<number>(), nodes: [] };
          }
          parentRadiusMap[pid15].radii.add(node15.cornerRadius);
          parentRadiusMap[pid15].nodes.push({ cn: collectedNodes[i15], radius: node15.cornerRadius });
        }
      }
    }
    for (var prk in parentRadiusMap) {
      var prGroup = parentRadiusMap[prk];
      if (prGroup.radii.size > 1) {
        var siblingRadii = Array.from(prGroup.radii);
        for (var pr = 0; pr < prGroup.nodes.length; pr++) {
          var prEntry = prGroup.nodes[pr];
          violations.push({
            id: "lint-inconsistent-radius-" + prEntry.cn.node.id,
            nodeId: prEntry.cn.node.id,
            nodeName: prEntry.cn.node.name,
            nodePath: prEntry.cn.path,
            rule: "inconsistent-radius",
            severity: "warning",
            category: "style",
            message: "\"" + prEntry.cn.node.name + "\" a un border-radius de " + prEntry.radius + "px, different de ses voisins.",
            autoFixable: false,
            metadata: { ruleName: "Border-radius incoherent", nodeType: prEntry.cn.node.type, radius: prEntry.radius, siblingRadii: siblingRadii },
          });
        }
      }
    }
  }

  // ── Rule 16: MIXED_FILLS (info) ──
  if (config.enabledRules["mixed-fills"] !== false) {
    for (var i16 = 0; i16 < collectedNodes.length; i16++) {
      var node16 = collectedNodes[i16].node;
      var nodePath16 = collectedNodes[i16].path;
      if ("fills" in node16) {
        var fills16 = (node16 as GeometryMixin).fills;
        if (Array.isArray(fills16)) {
          var visibleTypes: string[] = [];
          for (var f16 = 0; f16 < fills16.length; f16++) {
            if (fills16[f16].visible !== false) {
              visibleTypes.push(fills16[f16].type);
            }
          }
          var uniqueTypes = Array.from(new Set(visibleTypes));
          if (uniqueTypes.length > 1) {
            violations.push({
              id: "lint-mixed-fills-" + node16.id,
              nodeId: node16.id,
              nodeName: node16.name,
              nodePath: nodePath16,
              rule: "mixed-fills",
              severity: "info",
              category: "style",
              message: "\"" + node16.name + "\" combine des types de remplissage differents (" + uniqueTypes.join(", ") + ").",
              autoFixable: false,
              metadata: { ruleName: "Fills mixtes", nodeType: node16.type, fillTypes: uniqueTypes },
            });
          }
        }
      }
    }
  }

  // ── Rule 17: DETACHED_STYLES (warning) ──
  if (config.enabledRules["detached-styles"] !== false) {
    for (var i17 = 0; i17 < collectedNodes.length; i17++) {
      var node17 = collectedNodes[i17].node;
      var nodePath17 = collectedNodes[i17].path;
      // Check fillStyleId === figma.mixed (partially detached fill styles)
      if ("fillStyleId" in node17) {
        var fillSid = (node17 as any).fillStyleId;
        if (fillSid === figma.mixed) {
          violations.push({
            id: "lint-detached-styles-fill-" + node17.id,
            nodeId: node17.id,
            nodeName: node17.name,
            nodePath: nodePath17,
            rule: "detached-styles",
            severity: "warning",
            category: "style",
            message: "\"" + node17.name + "\" a des styles de remplissage partiellement detaches (mixed).",
            autoFixable: false,
            metadata: { ruleName: "Styles detaches", nodeType: node17.type, detachedProperty: "fillStyleId" },
          });
        }
      }
      // Check textStyleId === figma.mixed (partially detached text styles on TEXT nodes)
      if (node17.type === "TEXT" && "textStyleId" in node17) {
        var textSid = (node17 as any).textStyleId;
        if (textSid === figma.mixed) {
          violations.push({
            id: "lint-detached-styles-text-" + node17.id,
            nodeId: node17.id,
            nodeName: node17.name,
            nodePath: nodePath17,
            rule: "detached-styles",
            severity: "warning",
            category: "style",
            message: "\"" + node17.name + "\" a des styles de texte partiellement detaches (mixed).",
            autoFixable: false,
            metadata: { ruleName: "Styles detaches", nodeType: node17.type, detachedProperty: "textStyleId" },
          });
        }
      }
    }
  }

  return violations;
}

// ── Internal: build LintResult from violations and node count ──

function buildLintResult(
  violations: Violation[],
  totalNodes: number,
  startTime: number
): LintResult {
  // ── Deduplicate by nodeId + rule ──
  var seen: Record<string, boolean> = {};
  var uniqueViolations: Violation[] = [];
  for (var d = 0; d < violations.length; d++) {
    var v = violations[d];
    var key = v.nodeId + "::" + v.rule;
    if (!seen[key]) {
      seen[key] = true;
      uniqueViolations.push(v);
    }
  }

  // ── Counts ──
  var errorCount = 0, warningCount = 0, infoCount = 0;
  for (var c = 0; c < uniqueViolations.length; c++) {
    if (uniqueViolations[c].severity === "error") errorCount++;
    else if (uniqueViolations[c].severity === "warning") warningCount++;
    else infoCount++;
  }

  // ── Per-category counts ──
  var namingViolations = 0;
  var structureViolations = 0;
  var styleViolations = 0;
  for (var cat = 0; cat < uniqueViolations.length; cat++) {
    var catV = uniqueViolations[cat];
    if (catV.category === "naming") namingViolations++;
    else if (catV.category === "structure") structureViolations++;
    else if (catV.category === "style") styleViolations++;
  }

  // ── Build category scores (equal weight 1.0 each) ──
  var categoryScores = [
    calculateCategoryScore("naming", namingViolations, totalNodes),
    calculateCategoryScore("structure", structureViolations, totalNodes),
    calculateCategoryScore("style", styleViolations, totalNodes),
  ];

  var score = buildScoreResult(categoryScores);

  // ── byRule summary ──
  var byRule: Record<string, { count: number; fixableCount: number }> = {};
  for (var b = 0; b < uniqueViolations.length; b++) {
    var rv = uniqueViolations[b];
    if (!byRule[rv.rule]) byRule[rv.rule] = { count: 0, fixableCount: 0 };
    byRule[rv.rule].count++;
    // fixableCount: derived from confidence (high/medium = fixable)
    if (rv.confidence !== undefined && rv.confidence !== "low") {
      byRule[rv.rule].fixableCount++;
    }
  }

  return {
    totalNodes: totalNodes,
    violations: uniqueViolations,
    score: score,
    scanDuration: Date.now() - startTime,
    errorCount: errorCount,
    warningCount: warningCount,
    infoCount: infoCount,
    byRule: byRule,
  };
}

// ── Empty result helper ──

function emptyResult(startTime: number): LintResult {
  return {
    totalNodes: 0,
    violations: [],
    score: buildScoreResult([
      calculateCategoryScore("naming", 0, 0),
      calculateCategoryScore("structure", 0, 0),
      calculateCategoryScore("style", 0, 0),
    ]),
    scanDuration: Date.now() - startTime,
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
    byRule: {},
  };
}

// ── runLintAsync: async scan for page and selection scopes ──

export async function runLintAsync(
  scope: TraversalScope,
  config: LinterConfig,
  abortToken?: ScanAbortToken,
  onProgress?: (processed: number, total: number) => void,
  pageName?: string
): Promise<LintResult> {
  var startTime = Date.now();

  // Check if page is ignored
  var currentPageName = pageName !== undefined ? pageName : figma.currentPage.name;
  if (isOnIgnoredPage(config, currentPageName)) {
    return emptyResult(startTime);
  }

  // Selection scope with empty selection
  if (scope === "selection" && figma.currentPage.selection.length === 0) {
    return emptyResult(startTime);
  }

  // Collect nodes via traverseNodes
  var collectedNodes: CollectedNode[] = [];

  await traverseNodes(
    function(node: SceneNode, depth: number, path: string) {
      if (!shouldSkipNode(node, config)) {
        collectedNodes.push({ node: node, path: path });
      }
      // Always return void (not false) so children are traversed
    },
    {
      scope: scope,
      onProgress: onProgress,
      abortToken: abortToken,
    }
  );

  // Check abort after collection
  if (abortToken && abortToken.cancelled) {
    return emptyResult(startTime);
  }

  var violations = await runRulesOnNodes(collectedNodes, config);
  return buildLintResult(violations, collectedNodes.length, startTime);
}

// ── runLintFile: multi-page scan with per-page isolation ──

export async function runLintFile(
  config: LinterConfig,
  abortToken: ScanAbortToken,
  onPageProgress?: (pageName: string, pageIndex: number, totalPages: number) => void
): Promise<PageLintResult[]> {
  figma.skipInvisibleInstanceChildren = true;

  var results: PageLintResult[] = [];
  var pages = figma.root.children;
  var totalPages = pages.length;

  for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
    if (abortToken.cancelled) break;

    var page = pages[pageIndex];
    await page.loadAsync();

    // Check if page is ignored
    if (isOnIgnoredPage(config, page.name)) {
      if (onPageProgress) onPageProgress(page.name, pageIndex + 1, totalPages);
      continue;
    }

    var startTime = Date.now();

    // Walk the page's children manually for per-page isolation
    // (duplicate-siblings rule builds parent map — must be cleared between pages)
    var collectedNodes: CollectedNode[] = [];
    var queue: Array<{ node: SceneNode; depth: number; path: string }> = [];

    var pageChildren = page.children as SceneNode[];
    for (var ci = 0; ci < pageChildren.length; ci++) {
      queue.push({ node: pageChildren[ci], depth: 0, path: pageChildren[ci].name });
    }

    while (queue.length > 0) {
      if (abortToken.cancelled) break;

      var entry = queue.shift()!;
      var node = entry.node;
      var path = entry.path;

      if (!shouldSkipNode(node, config)) {
        collectedNodes.push({ node: node, path: path });
      }

      if ("children" in node) {
        var children = (node as ChildrenMixin).children as SceneNode[];
        for (var k = 0; k < children.length; k++) {
          queue.push({
            node: children[k],
            depth: entry.depth + 1,
            path: path + " > " + children[k].name,
          });
        }
      }
    }

    if (abortToken.cancelled) break;

    var violations = await runRulesOnNodes(collectedNodes, config);
    var result = buildLintResult(violations, collectedNodes.length, startTime);

    results.push({
      pageId: page.id,
      pageName: page.name,
      result: result,
    });

    if (onPageProgress) onPageProgress(page.name, pageIndex + 1, totalPages);
  }

  return results;
}
