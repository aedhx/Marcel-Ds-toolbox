import { traverseNodes, type TraversalScope, type ScanAbortToken } from '../../shared/node-traversal';
import { buildScoreResult } from '../../shared/scoring';
import { groupViolationsByRule, type Violation } from '../../shared/violation-types';
import { checkAltText, getAltText } from './a11y-alt-text';
import { checkContrast } from './a11y-contrast';
import { checkTouchTarget, isInteractiveElement } from './a11y-touch-targets';
import { type A11YResult, type A11YCategoryResult, A11Y_SEVERITY_WEIGHTS } from './a11y-types';
import type { CategoryScore } from '../../shared/scoring';

// ── Image node info for badge creation ──

export interface ImageNodeInfo {
  nodeId: string;
  nodeName: string;
  hasAlt: boolean;
  altText: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// ── Helpers ──

function calculateA11YCategoryScore(
  category: string,
  violations: Violation[],
  totalChecked: number
): CategoryScore {
  if (totalChecked === 0) {
    return { category, score: 100, weight: 1.0, violationCount: 0, totalChecked: 0 };
  }
  const weightedCount = violations.reduce((sum, v) => {
    return sum + (A11Y_SEVERITY_WEIGHTS[v.severity as keyof typeof A11Y_SEVERITY_WEIGHTS] ?? 1.0);
  }, 0);
  const score = Math.max(0, Math.round(100 - (weightedCount / totalChecked) * 100));
  return { category, score, weight: 1.0, violationCount: violations.length, totalChecked };
}

function buildCategoryResult(violations: Violation[], totalChecked: number, score: number): A11YCategoryResult {
  return {
    score,
    violationGroups: groupViolationsByRule(violations),
    totalChecked,
    totalViolations: violations.length,
  };
}

// ── Main export ──

export async function runAccessibilityAudit(
  scope: TraversalScope,
  abortToken?: ScanAbortToken,
  onProgress?: (category: string, processed: number, total: number) => void
): Promise<A11YResult & { imageNodes: ImageNodeInfo[] }> {
  const startTime = Date.now();

  // ── Accumulators ──
  const altTextViolations: Violation[] = [];
  const contrastViolations: Violation[] = [];
  const touchTargetViolations: Violation[] = [];

  let imageNodesChecked = 0;
  let textNodesChecked = 0;
  let interactiveNodesChecked = 0;

  // Track image nodes for badge creation
  const imageNodes: ImageNodeInfo[] = [];

  // ── Single traversal pass ──
  const traversalResult = await traverseNodes((node, _depth, path) => {
    // ── Alt-text (all nodes — checker filters for images) ──
    const altResult = checkAltText(node, path);
    if (altResult.isImage) {
      imageNodesChecked++;
      imageNodes.push({
        nodeId: node.id,
        nodeName: node.name,
        hasAlt: altResult.violation === null,
        altText: getAltText(node),
        x: node.absoluteTransform[0][2],
        y: node.absoluteTransform[1][2],
        width: node.width,
        height: node.height,
      });
      if (altResult.violation) {
        altTextViolations.push(altResult.violation);
      }
    }

    // ── Contrast (TEXT nodes only) ──
    if (node.type === 'TEXT') {
      textNodesChecked++;
      contrastViolations.push(...checkContrast(node as TextNode, path));
    }

    // ── Touch targets (interactive elements) ──
    if (isInteractiveElement(node)) {
      interactiveNodesChecked++;
      const touchViolation = checkTouchTarget(node, path);
      if (touchViolation) {
        touchTargetViolations.push(touchViolation);
      }
    }
  }, {
    scope,
    chunkSize: 150,
    abortToken,
    onProgress: (processed, total) => {
      if (onProgress) onProgress('Scanning nodes', processed, total);
    },
  });

  // ── Severity-weighted scoring (equal 1.0 weight per category) ──
  const categoryScores = [
    calculateA11YCategoryScore('alt-text', altTextViolations, imageNodesChecked),
    calculateA11YCategoryScore('contrast', contrastViolations, textNodesChecked),
    calculateA11YCategoryScore('touch-targets', touchTargetViolations, interactiveNodesChecked),
  ];
  const scoreResult = buildScoreResult(categoryScores);

  // ── Build A11YResult ──
  return {
    scoreResult,
    categories: {
      'alt-text': buildCategoryResult(altTextViolations, imageNodesChecked, categoryScores[0].score),
      'contrast': buildCategoryResult(contrastViolations, textNodesChecked, categoryScores[1].score),
      'touch-targets': buildCategoryResult(touchTargetViolations, interactiveNodesChecked, categoryScores[2].score),
    },
    scanDuration: Date.now() - startTime,
    totalNodesScanned: traversalResult.processed,
    scope,
    checklist: null,
    imageNodes,
  };
}
