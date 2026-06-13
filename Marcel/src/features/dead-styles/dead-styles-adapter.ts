import type { Violation } from "../../shared/violation-types";
import type { DeadStyleInfo, ForeignItemInfo, StyleCleanerResult } from "./dead-styles-types";

// ── Dead-styles → Violation adapter (define-only, not UI-wired in Phase 1) ──
//
// Maps the two dead-styles finding shapes onto the shared Violation model (QC-04 / D-04).
// Pure mapping only — no figma.* API, no I/O, no message-contract change (D-05).
// The existing DeadStylesResult / StyleCleanerResult wrappers stay intact; this module is
// defined and type-checked but NOT yet wired into main.ts / ui.html (Phase 2/4/7).

const DS_CATEGORY = "dead-styles";

// Dead LOCAL style/variable: NOT node-owned. nodeId = "" sentinel (A1).
// Downstream navigation must guard `if (!v.nodeId)` (Pitfall 2); metadata carries
// nodeKind: "style-level" so a future consumer can detect the no-owning-node case.
export function deadStyleToViolation(item: DeadStyleInfo): Violation {
  return {
    id: `ds-dead-${item.id}`,
    nodeId: "",                       // sentinel: style-level, no owning node — guard downstream (Pitfall 2)
    nodeName: item.name,
    nodePath: item.name,
    rule: item.itemType === "VARIABLE" ? "dead-variable" : "dead-style",
    severity: "info",                 // [A2] unused-but-harmless local style → lowest severity
    category: DS_CATEGORY,
    message: `Unused local ${item.itemType.toLowerCase()} "${item.name}"`,
    autoFixable: true,                // removeDeadStyle() can delete it (A3)
    metadata: { styleId: item.id, itemType: item.itemType, preview: item.preview, nodeKind: "style-level" },
  };
}

// FOREIGN binding: IS node-owned, real nodeId.
export function foreignItemToViolation(item: ForeignItemInfo): Violation {
  return {
    id: item.id,
    nodeId: item.nodeId,
    nodeName: item.nodeName,
    nodePath: item.nodeName,          // engine tracks no full path for foreign items
    rule: item.id.startsWith("foreign-var-") ? "foreign-variable" : "foreign-style",
    severity: "warning",             // [A2] active off-DS binding → warning
    category: DS_CATEGORY,
    message: `Foreign ${item.itemType.toLowerCase()} "${item.source.variableOrStyleName}" on "${item.nodeName}"`,
    suggestion: item.suggestion ? `Replace with ${item.suggestion.tokenName}` : undefined,
    confidence: item.suggestion?.confidence === "high" ? "high"
              : item.suggestion?.confidence === "medium" ? "medium" : undefined,
    autoFixable: true,               // detach always available (A3)
    metadata: {
      bindingField: item.bindingField, paintIndex: item.paintIndex,
      foreignId: item.foreignId, source: item.source,
      hasReplacement: !!item.suggestion?.variableKey,
    },
  };
}

export function styleCleanerToViolations(r: StyleCleanerResult): Violation[] {
  return [
    ...r.deadStyles.map(deadStyleToViolation),
    ...r.foreignItems.map(foreignItemToViolation),
  ];
}
