import type { A11YResult, A11YCategory } from './a11y-types';

// ── Score label ──

function scoreLabel(score: number): string {
  if (score >= 90) return 'Excellent';
  if (score >= 75) return 'Bon';
  if (score >= 50) return 'A ameliorer';
  return 'Critique';
}

// ── Category display names ──

const CATEGORY_NAMES: Record<A11YCategory, string> = {
  'alt-text': 'Alt-Text',
  'contrast': 'Contrast',
  'touch-targets': 'Touch Targets',
};

// ── Report generator ──

/**
 * Generate a structured text report for clipboard copy.
 * Covers overall score, per-category scores, and violation details.
 */
export function generateA11YReport(result: A11YResult): string {
  const lines: string[] = [];

  // Header
  lines.push('=== Marcel Accessibility Audit Report ===');
  lines.push('');
  lines.push(`Score: ${result.scoreResult.overall}/100 (${scoreLabel(result.scoreResult.overall)})`);
  lines.push(`Scanned: ${result.totalNodesScanned} nodes in ${result.scanDuration}ms`);
  lines.push('');

  // Per-category summary
  const categories: A11YCategory[] = ['alt-text', 'contrast', 'touch-targets'];
  for (const cat of categories) {
    const catResult = result.categories[cat];
    lines.push(`## ${CATEGORY_NAMES[cat]}: ${catResult.score}/100 (${catResult.totalViolations} violations)`);
  }
  lines.push('');

  // Violation details
  for (const cat of categories) {
    const catResult = result.categories[cat];
    if (catResult.totalViolations === 0) continue;

    lines.push(`### ${CATEGORY_NAMES[cat]}`);
    for (const group of catResult.violationGroups) {
      lines.push(`  ${group.rule} (${group.count}x)`);
      const shown = group.violations.slice(0, 5);
      for (const v of shown) {
        lines.push(`    - ${v.nodePath}: ${v.message}`);
      }
      const remaining = group.count - shown.length;
      if (remaining > 0) {
        lines.push(`    ... and ${remaining} more`);
      }
    }
    lines.push('');
  }

  // Timestamp
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');

  return lines.join('\n');
}
