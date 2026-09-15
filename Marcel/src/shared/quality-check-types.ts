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

  // How many scanned violations the ignore allowlist excluded BEFORE scoring (EVP-01).
  // « Ignorer » means "excluded from the score": these findings never reach
  // calculatePenaltyScore, so they burn no penalty points. 0 when the allowlist is empty.
  ignoredCount: number;

  // The excluded findings themselves, retained so main.ts can re-score on un-ignore
  // without re-traversing the file. Bounded by the allowlist size (a designer-authored
  // handful), never by file size. The UI does not render this array today — it exists
  // purely as the sandbox's in-memory re-score input (see quality-check-rescored).
  ignoredViolations: Violation[];

  // Number of nodes the single traverseNodes() pass processed (D-13/D-10).
  processed: number;

  // True only if the scan was cancelled. On cancel, runQualityCheck returns null
  // (discard-on-cancel, D-09) — this flag is `false` on any returned result.
  cancelled: boolean;

  // ── Penalty-model fields (Phase 5.2) ──
  // The DS conformity headline = 100 − Σ capped category penalties (SCORE-01).
  // Set by runQualityCheck from calculatePenaltyScore (Plan 01). For now
  // `overall === conformityScore`; the a11y gate (Plan 03) will later derive
  // `overall = conformityScore − a11yGatePenalty`.
  conformityScore: number;

  // Legacy dual-view — DS debt bound to an old/frozen library, counted apart
  // from the penalty score (SCORE-03). Populated by Plan 02.
  legacyDebtPercent?: number;

  // Accessibility presence gate — lot 1 (SCORE-04). Populated by Plan 03.
  // `a11yFramePresent` = the standard a11y frame was found by name;
  // `a11yGatePenalty` = points subtracted from the global score when absent.
  a11yFramePresent?: boolean;
  // Designer attestation read from the Cover config at scan time (lot 2). This is what
  // now drives `a11yGatePenalty` (A11Y_UNATTESTED_PENALTY when false). Distinct from
  // `a11yFramePresent`, which stays NOT-EVALUATED (undefined) per WR-08.
  a11yAttested?: boolean;
  a11yGatePenalty?: number;

  // HS delivery checklist (HS-01). Populated by Plan 04.
  // `hsPenalty` = total soft penalty from HS items; `coverUpToDate` = the hard
  // gate condition; `hsChecklist` = per-item pass/penalty breakdown.
  hsPenalty?: number;
  coverUpToDate?: boolean;
  hsChecklist?: Array<{ id: string; ok: boolean; penalty: number }>;
}
