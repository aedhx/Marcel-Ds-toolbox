import type { Violation } from '../../shared/violation-types';

// ── Interactive element detection heuristic ──

/**
 * Determine if a node is likely an interactive element based on naming conventions.
 * For INSTANCE nodes: matches button, btn, link, input, checkbox, radio, switch, toggle, tab, chip, icon-button, fab.
 * For FRAME/GROUP/COMPONENT nodes: matches button, cta, clickable.
 */
export function isInteractiveElement(node: SceneNode): boolean {
  if (node.type === 'INSTANCE') {
    const name = node.name.toLowerCase();
    return (
      name.includes('button') ||
      name.includes('btn') ||
      name.includes('link') ||
      name.includes('input') ||
      name.includes('checkbox') ||
      name.includes('radio') ||
      name.includes('switch') ||
      name.includes('toggle') ||
      name.includes('tab') ||
      name.includes('chip') ||
      name.includes('icon-button') ||
      name.includes('fab')
    );
  }

  if (
    node.type === 'FRAME' ||
    node.type === 'GROUP' ||
    node.type === 'COMPONENT' ||
    node.type === 'COMPONENT_SET'
  ) {
    const name = node.name.toLowerCase();
    return (
      name.includes('button') ||
      name.includes('cta') ||
      name.includes('clickable')
    );
  }

  return false;
}

// ── Touch target size validation ──

/**
 * Check if an interactive element meets the minimum 44x44px touch target size.
 * Returns null if the element is large enough, otherwise returns a violation.
 */
export function checkTouchTarget(
  node: SceneNode,
  path: string
): Violation | null {
  const width = node.width;
  const height = node.height;

  if (width >= 44 && height >= 44) return null;

  return {
    id: `a11y-touch-${node.id}`,
    nodeId: node.id,
    nodeName: node.name,
    nodePath: path,
    rule: 'undersized-touch-target',
    severity: 'error',
    category: 'touch-targets',
    message: `Touch target is ${Math.round(width)}x${Math.round(height)}px (minimum 44x44px)`,
    metadata: { width, height, minSize: 44 },
  };
}
