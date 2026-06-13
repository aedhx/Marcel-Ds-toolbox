import { traverseNodes, type TraversalScope, type ScanAbortToken } from '../../shared/node-traversal';
import { buildScoreResult } from '../../shared/scoring';
import { groupViolationsByRule, type Violation } from '../../shared/violation-types';
import { getNodeFills, getNodeStrokes } from '../../shared/figma-helpers';
import { checkNodeColors, checkNodeStrokes } from './hc-colors';
import { checkNodeTypography } from './hc-typography';
import { checkNodeSpacing } from './hc-spacing';
import { collectInstanceIds, checkDetachedInstances, resolveComponentViolations } from './hc-components';
import { classifyCoverageInstances } from './hc-coverage';
import { type HCResult, type HCCategoryResult, HC_SEVERITY_WEIGHTS, HC_FIXABLE_RULES } from './hc-types';
import type { CategoryScore } from '../../shared/scoring';

// Re-export the auto-fixable rule set (canonical definition lives in hc-types.ts, a leaf
// module, to avoid a circular import with the sub-checkers that build Violation literals).
export { HC_FIXABLE_RULES };

// ── Helpers ──

function hasVisibleFillsOrStrokes(node: SceneNode): boolean {
  const fills = getNodeFills(node);
  for (const paint of fills) {
    if (paint.type === 'SOLID' && paint.visible !== false) return true;
  }
  const strokes = getNodeStrokes(node);
  for (const paint of strokes) {
    if (paint.type === 'SOLID' && paint.visible !== false) return true;
  }
  return false;
}

function isAutoLayout(node: SceneNode): boolean {
  if (
    node.type !== 'FRAME' &&
    node.type !== 'COMPONENT' &&
    node.type !== 'COMPONENT_SET' &&
    node.type !== 'INSTANCE'
  ) {
    return false;
  }
  return (node as FrameNode).layoutMode !== 'NONE';
}

function calculateHCCategoryScore(
  category: string,
  violations: Violation[],
  totalChecked: number
): CategoryScore {
  if (totalChecked === 0) {
    return { category, score: 100, weight: 1.0, violationCount: 0, totalChecked: 0 };
  }
  const weightedCount = violations.reduce((sum, v) => {
    return sum + (HC_SEVERITY_WEIGHTS[v.severity] ?? 1.0);
  }, 0);
  const score = Math.max(0, Math.round(100 - (weightedCount / totalChecked) * 100));
  return { category, score, weight: 1.0, violationCount: violations.length, totalChecked };
}

function buildCategoryResult(violations: Violation[], totalChecked: number, score: number): HCCategoryResult {
  return {
    score,
    violationGroups: groupViolationsByRule(violations),
    totalChecked,
    totalViolations: violations.length,
  };
}

// ── Main export ──

export async function runHealthCheck(
  scope: TraversalScope,
  abortToken?: ScanAbortToken,
  onProgress?: (category: string, processed: number, total: number) => void
): Promise<HCResult> {
  const startTime = Date.now();

  // ── Accumulators ──
  const colorViolations: Violation[] = [];
  const typographyViolations: Violation[] = [];
  const spacingViolations: Violation[] = [];
  const componentViolations: Violation[] = [];
  const instanceIds: string[] = [];
  const coverageInstanceIds: string[] = [];

  let colorNodesChecked = 0;
  let textNodesChecked = 0;
  let layoutNodesChecked = 0;
  let componentNodesChecked = 0;

  // ── Pass 1: Single synchronous traversal ──
  const traversalResult = await traverseNodes((node, _depth, path) => {
    // Collect ALL instance IDs for coverage (must be before remote skip)
    if (node.type === 'INSTANCE') {
      coverageInstanceIds.push(node.id);
    }

    // Skip remote library instances (toolkit components) and their children
    if (node.type === 'INSTANCE') {
      try {
        const main = await (node as InstanceNode).getMainComponentAsync();
        if (main && main.remote) return false;
      } catch (_) {
        // dynamic-page access — skip this instance to be safe
        return false;
      }
    }

    // ── Colors (all nodes with fills/strokes) ──
    const fillViolations = checkNodeColors(node, path);
    const strokeViolations = checkNodeStrokes(node, path);
    if (fillViolations.length > 0 || strokeViolations.length > 0 || hasVisibleFillsOrStrokes(node)) {
      colorNodesChecked++;
    }
    colorViolations.push(...fillViolations, ...strokeViolations);

    // ── Typography (TEXT nodes only) ──
    if (node.type === 'TEXT') {
      textNodesChecked++;
      typographyViolations.push(...checkNodeTypography(node, path));
    }

    // ── Spacing (auto-layout frames) ──
    if (
      node.type === 'FRAME' ||
      node.type === 'COMPONENT' ||
      node.type === 'COMPONENT_SET' ||
      node.type === 'INSTANCE'
    ) {
      const spacingResult = checkNodeSpacing(node, path);
      if (spacingResult.length > 0 || isAutoLayout(node)) {
        layoutNodesChecked++;
      }
      spacingViolations.push(...spacingResult);
    }

    // ── Components (collect for async pass) ──
    const instanceId = collectInstanceIds(node);
    if (instanceId) instanceIds.push(instanceId);

    // Detached instances (sync)
    const detached = checkDetachedInstances(node, path);
    componentViolations.push(...detached);
    if (node.type === 'INSTANCE' || (node.type === 'FRAME' && detached.length > 0)) {
      componentNodesChecked++;
    }
  }, {
    scope,
    chunkSize: 150,
    abortToken,
    onProgress: (processed, total) => {
      if (onProgress) onProgress('Scanning nodes', processed, total);
    },
  });

  // ── Pass 2: Async component resolution ──
  if (onProgress) onProgress('Checking components', 0, instanceIds.length);
  const asyncComponentViolations = await resolveComponentViolations(instanceIds);
  componentViolations.push(...asyncComponentViolations);
  componentNodesChecked += instanceIds.length;

  // ── Pass 3: Coverage classification (all instances including remote) ──
  if (onProgress) onProgress('Checking coverage', 0, coverageInstanceIds.length);
  const coverageResult = await classifyCoverageInstances(coverageInstanceIds);

  // ── Severity-weighted scoring (equal 1.0 weight per category) ──
  const coverageCatScore: CategoryScore = {
    category: 'coverage',
    score: coverageResult.score === -1 ? 100 : coverageResult.score,
    weight: coverageResult.score === -1 ? 0 : 1.0,
    violationCount: coverageResult.violations.length,
    totalChecked: coverageResult.totalCount,
  };

  const categoryScores = [
    calculateHCCategoryScore('colors', colorViolations, colorNodesChecked),
    calculateHCCategoryScore('typography', typographyViolations, textNodesChecked),
    calculateHCCategoryScore('spacing', spacingViolations, layoutNodesChecked),
    calculateHCCategoryScore('components', componentViolations, componentNodesChecked),
    coverageCatScore,
  ];
  const scoreResult = buildScoreResult(categoryScores);

  // ── Build HCResult ──
  return {
    scoreResult,
    categories: {
      color: buildCategoryResult(colorViolations, colorNodesChecked, categoryScores[0].score),
      typography: buildCategoryResult(typographyViolations, textNodesChecked, categoryScores[1].score),
      spacing: buildCategoryResult(spacingViolations, layoutNodesChecked, categoryScores[2].score),
      component: buildCategoryResult(componentViolations, componentNodesChecked, categoryScores[3].score),
      coverage: buildCategoryResult(coverageResult.violations, coverageResult.totalCount, coverageCatScore.score),
    },
    scanDuration: Date.now() - startTime,
    totalNodesScanned: traversalResult.processed,
    scope,
  };
}
