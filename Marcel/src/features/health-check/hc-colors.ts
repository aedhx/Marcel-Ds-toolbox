import { nearest, differenceCiede2000, parse } from 'culori';
import { DS_TOKENS, rgbToHex } from '../../shared/tokens';
import { getNodeFills, getNodeStrokes } from '../../shared/figma-helpers';
import type { Violation } from '../../shared/violation-types';
import { DELTA_E_THRESHOLDS, HC_FIXABLE_RULES } from './hc-types';

// ── Pre-build DS color lookup structures at module level ──

const DS_COLOR_TOKENS = DS_TOKENS.filter(t => t.category === 'color');

// Map from token name -> hex value
const dsColorMap: Record<string, string> = {};
for (const token of DS_COLOR_TOKENS) {
  dsColorMap[token.name] = token.value.toLowerCase();
}

// O(1) exact match check: set of all DS color hex values (lowercased)
const DS_COLOR_HEX_SET = new Set<string>(Object.values(dsColorMap));

// Pre-built nearest-color function using culori Delta E CIE2000
const findNearestToken = nearest(
  Object.keys(dsColorMap),
  differenceCiede2000(),
  (name: string) => dsColorMap[name]
);

// Pre-build difference function for computing actual Delta E value
const computeDeltaE = differenceCiede2000();

// ── Exported helpers ──

/**
 * Find the nearest DS color token to a given hex value.
 * Returns null if no tokens exist or if Delta E > mediumConfidence threshold.
 */
export function findNearestColorToken(
  hex: string
): { name: string; hex: string; confidence: 'high' | 'medium' | null } | null {
  const results = findNearestToken(hex, 1, Infinity);
  if (!results || results.length === 0) return null;

  const tokenName = results[0] as string;
  const tokenHex = dsColorMap[tokenName];
  if (!tokenHex) return null;

  // Compute actual Delta E to determine confidence
  const parsedInput = parse(hex);
  const parsedToken = parse(tokenHex);
  if (!parsedInput || !parsedToken) return null;

  const deltaE = computeDeltaE(parsedInput, parsedToken);

  let confidence: 'high' | 'medium' | null;
  if (deltaE < DELTA_E_THRESHOLDS.highConfidence) {
    confidence = 'high';
  } else if (deltaE < DELTA_E_THRESHOLDS.mediumConfidence) {
    confidence = 'medium';
  } else {
    confidence = null;
  }

  return { name: tokenName, hex: tokenHex, confidence };
}

/**
 * Check a node's fills for off-token colors.
 * Skips: non-SOLID paints, invisible paints, variable-bound fills.
 */
export function checkNodeColors(node: SceneNode, nodePath: string): Violation[] {
  const violations: Violation[] = [];
  const fills = getNodeFills(node);

  for (let i = 0; i < fills.length; i++) {
    const paint = fills[i];

    // Skip non-SOLID paints (gradients, images, etc.)
    if (paint.type !== 'SOLID') continue;

    // Skip invisible paints
    if (paint.visible === false) continue;

    // Skip variable-bound fills — they are intentionally DS-compliant
    if ((paint as SolidPaint).boundVariables?.color) continue;

    const solidPaint = paint as SolidPaint;
    const hex = rgbToHex(solidPaint.color.r, solidPaint.color.g, solidPaint.color.b).toLowerCase();

    // Exact match against DS token set — compliant
    if (DS_COLOR_HEX_SET.has(hex)) continue;

    // Off-token: find nearest DS color suggestion
    const nearest = findNearestColorToken(hex);
    const suggestion =
      nearest && nearest.confidence !== null
        ? `${nearest.name} (${nearest.hex})`
        : undefined;

    violations.push({
      id: `hc-color-fill-${node.id}-${i}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'off-token-fill',
      severity: 'error',
      category: 'color',
      message: `Fill color ${hex} is not a DS token`,
      suggestion,
      autoFixable: HC_FIXABLE_RULES.has('off-token-fill'), // category 'color' is never 'component'
      metadata: {
        currentValue: hex,
        nearestToken: nearest?.name,
        nearestHex: nearest?.hex,
        confidence: nearest?.confidence,
      },
    });
  }

  return violations;
}

/**
 * Check a node's strokes for off-token colors.
 * Same logic as checkNodeColors but for strokes.
 */
export function checkNodeStrokes(node: SceneNode, nodePath: string): Violation[] {
  const violations: Violation[] = [];
  const strokes = getNodeStrokes(node);

  for (let i = 0; i < strokes.length; i++) {
    const paint = strokes[i];

    // Skip non-SOLID paints
    if (paint.type !== 'SOLID') continue;

    // Skip invisible paints
    if (paint.visible === false) continue;

    // Skip variable-bound strokes
    if ((paint as SolidPaint).boundVariables?.color) continue;

    const solidPaint = paint as SolidPaint;
    const hex = rgbToHex(solidPaint.color.r, solidPaint.color.g, solidPaint.color.b).toLowerCase();

    // Exact match against DS token set — compliant
    if (DS_COLOR_HEX_SET.has(hex)) continue;

    // Off-token: find nearest DS color suggestion
    const nearestColor = findNearestColorToken(hex);
    const suggestion =
      nearestColor && nearestColor.confidence !== null
        ? `${nearestColor.name} (${nearestColor.hex})`
        : undefined;

    violations.push({
      id: `hc-color-stroke-${node.id}-${i}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'off-token-stroke',
      severity: 'error',
      category: 'color',
      message: `Stroke color ${hex} is not a DS token`,
      suggestion,
      autoFixable: HC_FIXABLE_RULES.has('off-token-stroke'), // category 'color' is never 'component'
      metadata: {
        currentValue: hex,
        nearestToken: nearestColor?.name,
        nearestHex: nearestColor?.hex,
        confidence: nearestColor?.confidence,
      },
    });
  }

  return violations;
}
