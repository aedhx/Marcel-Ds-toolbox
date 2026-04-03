import { DS_TOKENS } from '../../shared/tokens';
import type { Violation } from '../../shared/violation-types';

// ── Pre-build DS spacing set at module level ──

// Parse spacing values from DS_TOKENS (e.g., "8px" -> 8)
const DS_SPACING_VALUES = DS_TOKENS.filter(t => t.category === 'spacing').map(t =>
  parseInt(t.value, 10)
);

// Set for O(1) lookup; 0 is always valid
const DS_SPACING_SET = new Set<number>([0, ...DS_SPACING_VALUES]);

// Map from spacing value -> token name for suggestions
const spacingValueToName: Record<number, string> = {};
for (const token of DS_TOKENS.filter(t => t.category === 'spacing')) {
  const val = parseInt(token.value, 10);
  spacingValueToName[val] = token.name;
}

/**
 * Find the nearest DS spacing token for a given pixel value.
 * Returns a formatted string like "spacing-m (12px)".
 */
function findNearestSpacing(value: number): { label: string; value: number } {
  let nearest = DS_SPACING_VALUES[0];
  let minDist = Math.abs(value - nearest);

  for (const sv of DS_SPACING_VALUES) {
    const dist = Math.abs(value - sv);
    if (dist < minDist) {
      minDist = dist;
      nearest = sv;
    }
  }

  const name = spacingValueToName[nearest] ?? `spacing (${nearest}px)`;
  return { label: `${name} (${nearest}px)`, value: nearest };
}

/**
 * Check an auto-layout frame/component/instance for spacing violations.
 * Only inspects nodes with layoutMode !== 'NONE'.
 * Checks paddingTop, paddingBottom, paddingLeft, paddingRight, itemSpacing.
 */
export function checkNodeSpacing(node: SceneNode, nodePath: string): Violation[] {
  // Only frames, components, component sets, and instances have auto-layout
  if (
    node.type !== 'FRAME' &&
    node.type !== 'COMPONENT' &&
    node.type !== 'COMPONENT_SET' &&
    node.type !== 'INSTANCE'
  ) {
    return [];
  }

  const frame = node as FrameNode;

  // Only check auto-layout nodes — NONE means spacing properties are not applicable
  if (frame.layoutMode === 'NONE') return [];

  const violations: Violation[] = [];

  const propsToCheck: Array<{ key: keyof FrameNode; label: string }> = [
    { key: 'paddingTop', label: 'paddingTop' },
    { key: 'paddingBottom', label: 'paddingBottom' },
    { key: 'paddingLeft', label: 'paddingLeft' },
    { key: 'paddingRight', label: 'paddingRight' },
    { key: 'itemSpacing', label: 'itemSpacing' },
  ];

  for (const { key, label } of propsToCheck) {
    const value = frame[key] as number;

    // Skip zero — always valid
    if (value === 0) continue;

    if (DS_SPACING_SET.has(value)) {
      // Value is on the DS scale — check if it's bound to a variable
      const bv = frame.boundVariables as Record<string, any> | undefined;
      if (!bv || !bv[key]) {
        const tokenName = spacingValueToName[value] ?? `Spacing (${value}px)`;
        violations.push({
          id: `hc-spacing-unbound-${node.id}-${label}`,
          nodeId: node.id,
          nodeName: node.name,
          nodePath,
          rule: 'missing-spacing-var',
          severity: 'info',
          category: 'spacing',
          message: `${label}: ${value}px is not bound to a DS variable`,
          suggestion: tokenName,
          metadata: {
            property: label,
            currentValue: value,
            nearestValue: value,
          },
        });
      }
      continue;
    }

    var nearestSpacing = findNearestSpacing(value);
    violations.push({
      id: `hc-spacing-${node.id}-${label}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'off-token-spacing',
      severity: 'warning',
      category: 'spacing',
      message: `${label}: ${value}px is not on the DS spacing scale`,
      suggestion: nearestSpacing.label,
      metadata: {
        property: label,
        currentValue: value,
        nearestValue: nearestSpacing.value,
      },
    });
  }

  return violations;
}
