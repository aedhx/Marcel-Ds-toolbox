import type { ViolationSeverity } from "./violation-types";
import {
  PENALTY_CATEGORIES,
  CATEGORY_BUDGETS,
  RULE_SEVERITY_MAP,
  CATEGORY_OF_RULE,
  penaltyFor,
  type PenaltyCategory,
} from "./scoring-config";

export interface CategoryScore {
  category: string;       // e.g., "naming", "colors", "typography"
  score: number;          // 0-100
  weight: number;         // Relative weight (e.g., 1.0, 0.5)
  violationCount: number; // Number of violations in this category
  totalChecked: number;   // Number of nodes checked for this category
  budget?: number;        // Penalty model (Phase 5.2): the category's max penalty (spec §1.4)
  penalty?: number;       // Penalty model (Phase 5.2): capped penalty actually applied
}

export type ScoreLabel = "Excellent" | "Bon" | "A ameliorer" | "Critique";

export interface ScoreResult {
  overall: number;        // 0-100 weighted score
  label: ScoreLabel;
  color: string;          // CSS color value
  categories: CategoryScore[];
  totalViolations: number;
  totalChecked: number;
}

/**
 * Calculate weighted score from category scores.
 * Formula: sum(category.score * category.weight) / sum(weights)
 * Returns 100 if no categories or total weight is 0.
 */
export function calculateWeightedScore(categories: CategoryScore[]): number {
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  if (totalWeight === 0) return 100;
  const weighted = categories.reduce((sum, c) => sum + c.score * c.weight, 0);
  return Math.max(0, Math.min(100, Math.round(weighted / totalWeight)));
}

/**
 * Score label thresholds per user decision:
 * 90+ = Excellent, 75-89 = Bon, 50-74 = A ameliorer, <50 = Critique
 */
export function formatScoreLabel(score: number): ScoreLabel {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Bon";
  if (score >= 50) return "A ameliorer";
  return "Critique";
}

/**
 * CSS color for score display.
 * Uses CSS custom properties where available, fallback hex values.
 */
export function getScoreColor(score: number): string {
  if (score >= 90) return "var(--success)";
  if (score >= 75) return "#f59e0b";
  if (score >= 50) return "#f97316";
  return "var(--error)";
}

/**
 * Build a complete ScoreResult from category scores.
 */
export function buildScoreResult(categories: CategoryScore[]): ScoreResult {
  const overall = calculateWeightedScore(categories);
  return {
    overall,
    label: formatScoreLabel(overall),
    color: getScoreColor(overall),
    categories,
    totalViolations: categories.reduce((sum, c) => sum + c.violationCount, 0),
    totalChecked: categories.reduce((sum, c) => sum + c.totalChecked, 0),
  };
}

/**
 * Calculate a category score from violation count and total checked.
 * Score = max(0, 100 - (violations / totalChecked * 100))
 * Returns 100 if totalChecked is 0.
 */
export function calculateCategoryScore(
  category: string,
  violationCount: number,
  totalChecked: number,
  weight: number = 1.0
): CategoryScore {
  const score = totalChecked === 0
    ? 100
    : Math.max(0, Math.round(100 - (violationCount / totalChecked) * 100));
  return { category, score, weight, violationCount, totalChecked };
}

// ── Severity-weighted category score (was duplicated in hc-engine & a11y-engine) ──

export const DEFAULT_SEVERITY_WEIGHTS = { error: 1.0, warning: 0.5, info: 0.1 } as const;

/**
 * Severity-weighted category score. Body lifted verbatim from the previously
 * duplicated calculateHCCategoryScore / calculateA11YCategoryScore — same rounding,
 * same `?? 1.0` fallback, same `totalChecked === 0 → 100` short-circuit. Each family
 * passes in its own severity-weights constant so output is provably unchanged.
 */
export function calculateWeightedCategoryScore(
  category: string,
  violations: { severity: ViolationSeverity }[],
  totalChecked: number,
  weight: number = 1.0,
  weights: Record<string, number> = DEFAULT_SEVERITY_WEIGHTS
): CategoryScore {
  if (totalChecked === 0) {
    return { category, score: 100, weight, violationCount: 0, totalChecked: 0 };
  }
  const weightedCount = violations.reduce((sum, v) => {
    return sum + (weights[v.severity] ?? 1.0);
  }, 0);
  const score = Math.max(0, Math.round(100 - (weightedCount / totalChecked) * 100));
  return { category, score, weight, violationCount: violations.length, totalChecked };
}

// ── Penalty scoring model (Phase 5.2 — spec §1.1–§1.5) ────────────────────────
//
// NEW model, added ALONGSIDE the legacy % functions above (which the standalone
// HC / a11y tabs still call until Phase 7 — do NOT delete them).
//
//   score = 100 − Σ (capped category penalties)
//
// Each violation burns `penaltyFor(category, severity)` = budget × fraction of
// its penalty category; each category's total is capped at its budget, so a real
// grave fault BITES regardless of page volume (1 grave color among 500 clean
// nodes → −10 → 90, not 99.6), and no category can over-drain the score.
// All tunable numbers come from scoring-config.ts — none is hand-typed here.

interface PenaltyViolationInput {
  rule: string;
  category: string;
  severity: ViolationSeverity;
}

/**
 * Compute the penalty-based DS conformity ScoreResult from raw violations.
 *
 * - Each violation is bucketed into a PenaltyCategory via CATEGORY_OF_RULE
 *   (keyed on violation.category). Violations whose category maps to null
 *   (e.g. "coverage") or to no known bucket are EXCLUDED from the score.
 * - Severity is looked up in RULE_SEVERITY_MAP (default "cosmetique" if the rule
 *   is unmapped, so a new rule can never silently tank a score).
 * - Per-category penalty is summed then capped at CATEGORY_BUDGETS[category].
 * - overall = max(0, round(100 − Σ capped penalties)).
 *
 * Returns one CategoryScore per penalty category (always all five), each
 * carrying `budget`, `penalty` (capped), and `score = budget − penalty`.
 */
export function calculatePenaltyScore(violations: PenaltyViolationInput[]): ScoreResult {
  // Raw (uncapped) penalty accumulator + violation count per penalty category.
  const rawPenalty: Record<PenaltyCategory, number> = {
    colors: 0,
    typography: 0,
    spacing: 0,
    components: 0,
    naming: 0,
  };
  const counts: Record<PenaltyCategory, number> = {
    colors: 0,
    typography: 0,
    spacing: 0,
    components: 0,
    naming: 0,
  };

  for (const v of violations) {
    const bucket = CATEGORY_OF_RULE[v.category];
    if (!bucket) continue; // null (coverage) or unknown category → not scored
    const severity = RULE_SEVERITY_MAP[v.rule] ?? "cosmetique";
    rawPenalty[bucket] += penaltyFor(bucket, severity);
    counts[bucket] += 1;
  }

  const categories: CategoryScore[] = PENALTY_CATEGORIES.map((category) => {
    const budget = CATEGORY_BUDGETS[category];
    const penalty = Math.min(budget, rawPenalty[category]);
    return {
      category,
      score: Math.max(0, Math.round(budget - penalty)),
      weight: budget, // spec §1.2: a category's weight IS its budget
      violationCount: counts[category],
      totalChecked: 0, // not meaningful in the penalty model (volume must not dilute)
      budget,
      penalty,
    };
  });

  const totalPenalty = categories.reduce((sum, c) => sum + (c.penalty ?? 0), 0);
  const overall = Math.max(0, Math.round(100 - totalPenalty));

  return {
    overall,
    label: formatScoreLabel(overall),
    color: getScoreColor(overall),
    categories,
    totalViolations: categories.reduce((sum, c) => sum + c.violationCount, 0),
    totalChecked: 0,
  };
}
