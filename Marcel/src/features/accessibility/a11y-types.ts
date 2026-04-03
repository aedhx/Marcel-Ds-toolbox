import type { ScoreResult } from '../../shared/scoring';
import type { ViolationGroup } from '../../shared/violation-types';

// ── Category type ──

export type A11YCategory = 'alt-text' | 'contrast' | 'touch-targets';

// ── Per-category result ──

export interface A11YCategoryResult {
  score: number;                    // 0-100
  violationGroups: ViolationGroup[];
  totalChecked: number;             // number of nodes checked for this category
  totalViolations: number;          // number of violations in this category
}

// ── Full accessibility audit result sent to UI ──

export interface A11YResult {
  scoreResult: ScoreResult;
  categories: Record<A11YCategory, A11YCategoryResult>;
  scanDuration: number;
  totalNodesScanned: number;
  scope: 'page' | 'selection' | 'file';
  /** Placeholder for future A11Y-09 interactive checklist */
  checklist: null;
}

// ── Severity weights ──
// errors = 1.0 weight, warnings = 0.5, info = 0.1
// Used to compute weighted violation count for scoring

export const A11Y_SEVERITY_WEIGHTS = {
  error: 1.0,
  warning: 0.5,
  info: 0.1,
} as const;

// ── Contrast result ──

export interface ContrastResult {
  ratio: number;
  ratioText: string;        // e.g., "4.5:1"
  aa: boolean;
  aaa: boolean;
  isLargeText: boolean;
  isReliable: boolean;       // false if background was assumed (white fallback)
}
