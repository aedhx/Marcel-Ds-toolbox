import type { ViolationSeverity } from "./violation-types";

export interface CategoryScore {
  category: string;       // e.g., "naming", "colors", "typography"
  score: number;          // 0-100
  weight: number;         // Relative weight (e.g., 1.0, 0.5)
  violationCount: number; // Number of violations in this category
  totalChecked: number;   // Number of nodes checked for this category
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
