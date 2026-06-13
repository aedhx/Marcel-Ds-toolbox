// ── Unified Quality Check result contract (D-14) ──
//
// `runQualityCheck()` (quality-check-engine.ts) returns this single stable shape, which
// Plan 04 and Phase 4 consume to render the one 0-100 score + the one unified violation
// list. It EXTENDS the existing ScoreResult (scoring.ts) rather than inventing a new type
// (D-14, minimal new surface — downstream already understands ScoreResult/CategoryScore).
//
// New shared module → const/let + named exports only (per CONVENTIONS.md).
//
// The unified `violations[]` carries ALL families' findings INCLUDING non-scoring
// dead-styles. The scored / non-scored distinction is carried by the `category` convention
// (D-02/D-08): scored categories = naming | colors | typography | spacing | coverage |
// component; the non-scored category is "dead-styles". There is deliberately NO new boolean
// `scored` field on Violation — the category convention IS the flag (matching the Phase-1
// dead-styles adapter, which stamps category: "dead-styles").

import type { ScoreResult } from "./scoring";
import type { Violation } from "./violation-types";

export interface QualityCheckResult extends ScoreResult {
  // Inherited from ScoreResult: overall, label, color, categories (CategoryScore[]),
  // totalViolations, totalChecked.

  // The unified array across ALL families — naming, colors, typography, spacing, coverage,
  // component, AND non-scoring dead-styles (each tagged via its `category`, D-02/D-08).
  violations: Violation[];

  // Number of nodes the single traverseNodes() pass processed (D-13/D-10).
  processed: number;

  // True only if the scan was cancelled. On cancel, runQualityCheck returns null
  // (discard-on-cancel, D-09) — this flag is `false` on any returned result.
  cancelled: boolean;
}
