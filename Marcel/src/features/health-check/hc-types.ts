import type { ScoreResult } from '../../shared/scoring';
import type { ViolationGroup } from '../../shared/violation-types';

// ── Category type ──

export type HCCategory = 'color' | 'typography' | 'spacing' | 'component' | 'coverage';

// ── Per-category result ──

export interface HCCategoryResult {
  score: number;                    // 0-100
  violationGroups: ViolationGroup[];
  totalChecked: number;             // number of nodes checked for this category
  totalViolations: number;          // number of violations in this category
}

// ── Full health check result sent to UI ──

export interface HCResult {
  scoreResult: ScoreResult;
  categories: Record<HCCategory, HCCategoryResult>;
  scanDuration: number;
  totalNodesScanned: number;
  scope: 'page' | 'selection' | 'file';
}

// ── Severity weights ──
// errors = 1.0 weight, warnings = 0.5, info = 0.1
// Used to compute weighted violation count for scoring

export const HC_SEVERITY_WEIGHTS = {
  error: 1.0,
  warning: 0.5,
  info: 0.1,
} as const;

// ── Delta E thresholds for color suggestion confidence ──
// DeltaE < 5 = high confidence suggestion
// DeltaE 5-15 = medium confidence suggestion
// DeltaE > 15 = no meaningful suggestion

export const DELTA_E_THRESHOLDS = {
  highConfidence: 5,
  mediumConfidence: 15,
} as const;

// ── Excessive override threshold ──

export const EXCESSIVE_OVERRIDES_THRESHOLD = 5;
