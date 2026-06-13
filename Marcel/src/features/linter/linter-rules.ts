// ── Linter Rules (shared naming module) ──
// Single source of truth for the Linter's PURE PER-NODE naming rules (D-11).
// Imported by both the existing Linter handler (linter-engine.ts) and, in Plan 03,
// the unified runQualityCheck() orchestrator — so the per-node naming logic lives once.
//
// NEW shared-style module → uses const/let and named exports only (per CONVENTIONS.md),
// NOT the `var` style of linter-engine.ts.
//
// Scope: ONLY the pure-sync per-node naming rules:
//   - vague-names         (engine Rule 2)
//   - component-naming     (engine Rule 4)
//   - long-names           (engine Rule 5)
//   - special-chars        (engine Rule 6)
//   - numbered-suffix      (engine Rule 7)
//   - text-mismatch        (engine Rule 8)
// The async default-names rule (awaits suggestAutoFix → getMainComponentAsync) and the
// cross-node duplicate-siblings rule (needs a parent→siblings map) do NOT fit the
// pure-sync per-node mold and stay handled by the engine/orchestrator (D-11 landmine).

import { Violation } from "../../shared/violation-types";

// ── Rule patterns (mirrored from linter-engine.ts; load-bearing for numbered-suffix
//    and text-mismatch which both skip Figma default names) ──

const DEFAULT_NAME_REGEX =
  /^(Frame|Rectangle|Ellipse|Line|Group|Vector|Text|Polygon|Star|Image|Slice|Component|Instance|Boolean|Section)\s*\d*$/i;

const SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s\-_\/\.àéèêëïîôùûüçÀÉÈÊËÏÎÔÙÛÜÇ]/;

const NUMBERED_SUFFIX_REGEX = /\s+\d+$/;

// ── Naming context ──
// Precomputed inputs the pure-sync naming checks need. Built once by the caller
// (engine or orchestrator) from its collected nodes / config, then passed per-node.
// Mirrors the locals computed at the top of runRulesOnNodes:
//   vagueNames (engine line 296), maxLen (line 303), usedComponentIds (line 284).

export interface NamingCtx {
  vagueNames: Set<string>;
  maxLen: number;
  usedComponentIds: Set<string>;
}

// ── checkNodeNaming: pure-sync per-node naming rules ──
// Returns the naming-category Violations for a single node. Rule bodies are lifted
// verbatim from runRulesOnNodes — same id/rule/severity/category/message/autoFixable/
// metadata (behavior-preserving, D-05).

export function checkNodeNaming(node: SceneNode, nodePath: string, ctx: NamingCtx): Violation[] {
  const violations: Violation[] = [];

  // ── Rule 2: VAGUE_NAME (warning) ──
  if (ctx.vagueNames.has(node.name.toLowerCase())) {
    violations.push({
      id: "lint-vague-names-" + node.id,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: nodePath,
      rule: "vague-names",
      severity: "warning",
      category: "naming",
      message: "\"" + node.name + "\" est un nom trop générique.",
      autoFixable: false,
      metadata: { ruleName: "Noms vagues", nodeType: node.type },
    });
  }

  // ── Rule 4: COMPONENT_CONVENTION (error) ──
  if (node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
    if (!node.name.includes("/")) {
      violations.push({
        id: "lint-component-naming-" + node.id,
        nodeId: node.id,
        nodeName: node.name,
        nodePath: nodePath,
        rule: "component-naming",
        severity: "error",
        category: "naming",
        message: "Le composant \"" + node.name + "\" n'est pas catégorisé (pas de \"/\").",
        autoFixable: false,
        metadata: { ruleName: "Nommage composant", nodeType: node.type },
      });
    }
  }

  // ── Rule 5: LONG_NAME (info) ──
  if (node.name.length > ctx.maxLen) {
    violations.push({
      id: "lint-long-names-" + node.id,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: nodePath,
      rule: "long-names",
      severity: "info",
      category: "naming",
      message: "Le nom fait " + node.name.length + " caractères (max recommandé : " + ctx.maxLen + ").",
      autoFixable: false,
      metadata: { ruleName: "Noms trop longs", nodeType: node.type },
    });
  }

  // ── Rule 6: SPECIAL_CHARS (info) ──
  if (SPECIAL_CHARS_REGEX.test(node.name)) {
    violations.push({
      id: "lint-special-chars-" + node.id,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: nodePath,
      rule: "special-chars",
      severity: "info",
      category: "naming",
      message: "\"" + node.name + "\" contient des caractères non-standard.",
      autoFixable: false,
      metadata: { ruleName: "Caractères spéciaux", nodeType: node.type },
    });
  }

  // ── Rule 7: NUMBERED_SUFFIX (warning) ──
  if (!DEFAULT_NAME_REGEX.test(node.name) && NUMBERED_SUFFIX_REGEX.test(node.name)) {
    const baseName = node.name.replace(NUMBERED_SUFFIX_REGEX, "");
    violations.push({
      id: "lint-numbered-suffix-" + node.id,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: nodePath,
      rule: "numbered-suffix",
      severity: "warning",
      category: "naming",
      message: "\"" + node.name + "\" se termine par un suffixe numérique (copier-coller probable).",
      suggestion: baseName,
      confidence: "high",
      autoFixable: true,            // confidence "high" !== "low" — matches byRule.fixableCount
      metadata: { ruleName: "Suffixe numérique", nodeType: node.type },
    });
  }

  // ── Rule 8: TEXT_MISMATCH (warning) ──
  if (node.type === "TEXT" && !DEFAULT_NAME_REGEX.test(node.name)) {
    const textContent = (node as TextNode).characters.trim();
    if (textContent.length > 0) {
      let textPreview = textContent.split(/\s+/).slice(0, 5).join(" ");
      if (textPreview.length > 40) textPreview = textPreview.substring(0, 37) + "...";
      const nameLower = node.name.toLowerCase().trim();
      const contentLower = textContent.toLowerCase();
      const matchesContent =
        contentLower.indexOf(nameLower) !== -1 ||
        nameLower.indexOf(contentLower.substring(0, 20)) !== -1;
      if (!matchesContent) {
        const nameFirstWord = nameLower.split(/[\s\-_\/]/)[0];
        const contentFirstWord = contentLower.split(/\s+/)[0];
        const matchesFirstWord = nameFirstWord.length > 2 && contentFirstWord.indexOf(nameFirstWord) !== -1;
        if (!matchesFirstWord) {
          let suggestedName = textContent.split(/\s+/).slice(0, 3).join(" ");
          if (suggestedName.length > 30) suggestedName = suggestedName.substring(0, 27) + "...";
          violations.push({
            id: "lint-text-mismatch-" + node.id,
            nodeId: node.id,
            nodeName: node.name,
            nodePath: nodePath,
            rule: "text-mismatch",
            severity: "warning",
            category: "naming",
            message: "Le nom \"" + node.name + "\" ne correspond pas au contenu visible \"" + textPreview + "\".",
            suggestion: suggestedName,
            confidence: "high",
            autoFixable: true,            // confidence "high" !== "low" — matches byRule.fixableCount
            metadata: { ruleName: "Texte incohérent", nodeType: node.type },
          });
        }
      }
    }
  }

  return violations;
}
