// ── Unified Quality Check engine (runQualityCheck) ──
//
// The single orchestrator that merges all four V1 audits onto ONE cancellable
// node-traversal pass and produces ONE weighted 0-100 score (QC-02 / QC-03 / QC-05).
// Generalized verbatim from the hc-engine.ts::runHealthCheck prototype (D-06): same
// accumulators-up-front → single visitor fan-out → post-pass batched resolvers →
// calculateWeightedCategoryScore[] → buildScoreResult skeleton, widened to also fan out
// the shared naming rules (Plan 01) and the dead-styles per-node foreign-binding collectors
// (Plan 02 / D-07), and to omit dead-styles from the score (D-02).
//
// This file lives in shared/ → features are imported via `../features/...` (one `../`).
// const/let + single quotes (matches hc-engine, the prototype).

import { traverseNodes, type TraversalScope, type ScanAbortToken } from './node-traversal';
import { buildScoreResult, calculateWeightedCategoryScore, DEFAULT_SEVERITY_WEIGHTS } from './scoring';
import type { CategoryScore } from './scoring';
import { type Violation } from './violation-types';
import { getNodeFills, getNodeStrokes } from './figma-helpers';
import type { QualityCheckResult } from './quality-check-types';

import { checkNodeColors, checkNodeStrokes } from '../features/health-check/hc-colors';
import { checkNodeTypography } from '../features/health-check/hc-typography';
import { checkNodeSpacing } from '../features/health-check/hc-spacing';
import { collectInstanceIds, checkDetachedInstances, resolveComponentViolations } from '../features/health-check/hc-components';
import { classifyCoverageInstances } from '../features/health-check/hc-coverage';
import { checkNodeNaming, type NamingCtx } from '../features/linter/linter-rules';
import {
  collectVariableIds,
  collectPaintVariableIds,
  collectRawVarBindings,
  collectRawStyleBindings,
  finalizeDeadStyles,
  type RawVarBinding,
  type RawStyleBinding,
} from '../features/dead-styles/dead-styles-engine';
import { styleCleanerToViolations } from '../features/dead-styles/dead-styles-adapter';

// ── Equal-weight category weights (D-01) ──
// Single retunable source for the SCORED categories' relative weights. All 1.0 to start
// (equal-weight, D-01); change here once real scores are observed — no other call site edits.
// dead-styles is deliberately ABSENT: it is non-scoring (D-02) and never entered into
// categoryScores, so it has no weight here.
const QC_CATEGORY_WEIGHTS: Record<string, number> = {
  naming: 1.0,
  colors: 1.0,
  typography: 1.0,
  spacing: 1.0,
  coverage: 1.0,
};

// ── Default vague-name set for the naming context ──
// Mirrors linter-engine.ts BASE_VAGUE_NAMES (the engine default, before user customVagueNames).
// The unified pass uses the linter defaults; per-rule config toggles and custom vague names are
// a Linter-tab concern (Phase 3 wiring), out of scope here.
const QC_BASE_VAGUE_NAMES = [
  'container', 'wrapper', 'element', 'item', 'box',
  'block', 'content', 'inner', 'outer', 'main',
  'div', 'section', 'comp', 'layer',
];
const QC_DEFAULT_MAX_NAME_LENGTH = 60; // matches DEFAULT_LINTER_CONFIG.maxNameLength

// ── Helpers (lifted from hc-engine.ts for the same node-checked gating) ──

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

// ── Main export ──
//
// One cancellable pass, fan-out to all families, post-pass batched resolution, one weighted
// score over the SCORED categories only. Returns null on cancel (discard-on-cancel, D-09 —
// no partial score). The returned QualityCheckResult (D-14) is the stable contract Plan 04
// and Phase 4 consume.
//
// Naming async-rule note (D-11 landmine): only the SIX pure-sync naming rules
// (checkNodeNaming) ride the unified pass. The async `default-names` rule (awaits
// suggestAutoFix) and the aggregate `unused-components` rule (file-wide getMainComponentAsync
// precompute) are NOT included here — they don't fit the pure-sync per-node mold and stay in
// the Linter tab (Plan 01). `usedComponentIds` is therefore an empty set: checkNodeNaming's
// six rules do not read it.

export async function runQualityCheck(
  scope: TraversalScope,
  abortToken?: ScanAbortToken,
  onProgress?: (phase: string, processed: number, total: number) => void
): Promise<QualityCheckResult | null> {
  // ── Accumulators (declared up front, hc-engine idiom) ──
  const namingViolations: Violation[] = [];
  const colorViolations: Violation[] = [];
  const typographyViolations: Violation[] = [];
  const spacingViolations: Violation[] = [];
  const componentViolations: Violation[] = [];

  const instanceIds: string[] = [];            // collected → resolveComponentViolations (after pass)
  const coverageInstanceIds: string[] = [];    // collected → classifyCoverageInstances (after pass)

  // dead-styles per-node collector state (foreign half rides the pass; D-07)
  const usedVarIds = new Set<string>();
  const rawVarBindings: RawVarBinding[] = [];
  const rawStyleBindings: RawStyleBinding[] = [];
  const varSeenKeys = new Set<string>();
  const styleSeenKeys = new Set<string>();

  let namingNodesChecked = 0;
  let colorNodesChecked = 0;
  let textNodesChecked = 0;
  let layoutNodesChecked = 0;
  let componentNodesChecked = 0;

  // Precompute the naming context once (D-11 — built before the pass, passed per-node).
  const namingCtx: NamingCtx = {
    vagueNames: new Set(QC_BASE_VAGUE_NAMES),
    maxLen: QC_DEFAULT_MAX_NAME_LENGTH,
    usedComponentIds: new Set<string>(), // unused by the six pure-sync rules (see note above)
  };

  // ── Pass 1: ONE cancellable traversal, fan out to ALL families (D-13 — no re-walk) ──
  const traversalResult = await traverseNodes((node, _depth, path) => {
    // Collect ALL instance IDs for coverage (must be BEFORE the remote skip — hc-engine 77-79)
    if (node.type === 'INSTANCE') {
      coverageInstanceIds.push(node.id);
    }

    // Skip remote library instances (toolkit components) and their children.
    // VERBATIM from hc-engine lines 81-90 — keeps the unified pass seeing the same node set
    // the HC pass sees today under figma.skipInvisibleInstanceChildren (do NOT await/"fix").
    if (node.type === 'INSTANCE') {
      try {
        const main = await (node as InstanceNode).getMainComponentAsync();
        if (main && main.remote) return false;
      } catch (_) {
        // dynamic-page access — skip this instance to be safe
        return false;
      }
    }

    // ── Naming (all nodes; six pure-sync rules — Plan 01) ──
    const nameViolations = checkNodeNaming(node, path, namingCtx);
    namingViolations.push(...nameViolations);
    namingNodesChecked++;

    // ── Colors (all nodes with fills/strokes — canonical HC ΔE source, D-04) ──
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

    // ── Components (collect instance IDs for the async pass; detached are sync) ──
    const instanceId = collectInstanceIds(node);
    if (instanceId) instanceIds.push(instanceId);

    const detached = checkDetachedInstances(node, path);
    componentViolations.push(...detached);
    if (node.type === 'INSTANCE' || (node.type === 'FRAME' && detached.length > 0)) {
      componentNodesChecked++;
    }

    // ── Dead-styles per-node collectors (foreign half rides the pass; D-07) ──
    if (node.boundVariables) {
      collectVariableIds(node.boundVariables as Record<string, any>, usedVarIds);
    }
    collectPaintVariableIds(node, usedVarIds);
    collectRawVarBindings(node, rawVarBindings, varSeenKeys);
    collectRawStyleBindings(node, rawStyleBindings, styleSeenKeys);
  }, {
    scope,
    chunkSize: 150,
    abortToken,
    onProgress: (processed, total) => {
      if (onProgress) onProgress('Scanning nodes', processed, total);
    },
  });

  // ── Discard-on-cancel (D-09) — no partial score ──
  if (abortToken?.cancelled || traversalResult.cancelled) {
    return null;
  }

  // ── Post-pass batched aggregate resolution (Plan 02 — Promise.all chunked) ──
  if (onProgress) onProgress('Checking components', 0, instanceIds.length);
  const asyncComponentViolations = await resolveComponentViolations(instanceIds);
  componentViolations.push(...asyncComponentViolations);
  componentNodesChecked += instanceIds.length;

  if (onProgress) onProgress('Checking coverage', 0, coverageInstanceIds.length);
  const coverageResult = await classifyCoverageInstances(coverageInstanceIds);

  if (abortToken?.cancelled) {
    return null;
  }

  // ── Dead-styles finalize: foreign (scope-aware) + unused-local (file-level, D-07) ──
  // Routed through the Phase-1 adapter into the unified violations[] tagged category:
  // "dead-styles" (D-08) — non-scoring by virtue of being omitted from categoryScores (D-02).
  if (onProgress) onProgress('Checking dead styles', 0, rawVarBindings.length + rawStyleBindings.length);
  const finalized = await finalizeDeadStyles(
    rawVarBindings,
    rawStyleBindings,
    scope,
    abortToken || { cancelled: false },
    (phase, current, total) => {
      if (onProgress) onProgress('Checking dead styles', current, total);
    }
  );

  if (abortToken?.cancelled) {
    return null;
  }

  const deadStyleViolations = styleCleanerToViolations(finalized.result);

  // ── Weighted score over SCORED categories ONLY (D-01/D-02/D-03/D-14) ──
  // dead-styles is OMITTED from categoryScores — that omission IS the non-scoring mechanism (D-02).
  const coverageCatScore: CategoryScore = {
    category: 'coverage',
    score: coverageResult.score === -1 ? 100 : coverageResult.score,
    weight: coverageResult.score === -1 ? 0 : QC_CATEGORY_WEIGHTS.coverage,
    violationCount: coverageResult.violations.length,
    totalChecked: coverageResult.totalCount,
  };

  const categoryScores: CategoryScore[] = [
    calculateWeightedCategoryScore('naming', namingViolations, namingNodesChecked, QC_CATEGORY_WEIGHTS.naming, DEFAULT_SEVERITY_WEIGHTS),
    calculateWeightedCategoryScore('colors', colorViolations, colorNodesChecked, QC_CATEGORY_WEIGHTS.colors, DEFAULT_SEVERITY_WEIGHTS),
    calculateWeightedCategoryScore('typography', typographyViolations, textNodesChecked, QC_CATEGORY_WEIGHTS.typography, DEFAULT_SEVERITY_WEIGHTS),
    calculateWeightedCategoryScore('spacing', spacingViolations, layoutNodesChecked, QC_CATEGORY_WEIGHTS.spacing, DEFAULT_SEVERITY_WEIGHTS),
    coverageCatScore,
    // NOTE (D-02): components is scored in HC today but is NOT one of the five QC scored
    // categories named in the must_haves (naming/colors/typography/spacing/coverage). Component
    // violations still ride the unified violations[] below; component scoring is folded into the
    // HC result today and is intentionally not double-counted into the QC headline here.
  ];
  const scoreResult = buildScoreResult(categoryScores);

  // ── Assemble QualityCheckResult (D-14) ──
  // violations[] = every family's violations concatenated, INCLUDING the dead-styles adapter
  // output (tagged category: "dead-styles", non-scoring) and component violations.
  const violations: Violation[] = [
    ...namingViolations,
    ...colorViolations,
    ...typographyViolations,
    ...spacingViolations,
    ...componentViolations,
    ...coverageResult.violations,
    ...deadStyleViolations,
  ];

  return {
    overall: scoreResult.overall,
    label: scoreResult.label,
    color: scoreResult.color,
    categories: scoreResult.categories,
    totalViolations: scoreResult.totalViolations,
    totalChecked: scoreResult.totalChecked,
    violations,
    processed: traversalResult.processed,
    cancelled: false,
  };
}
