import type { Violation } from '../../shared/violation-types';
import { EXCESSIVE_OVERRIDES_THRESHOLD } from './hc-types';

// ── Pass 1: Synchronous — called during traversal ──

/**
 * If the node is an InstanceNode, return its ID for async resolution in pass 2.
 * Returns null for all other node types.
 */
export function collectInstanceIds(node: SceneNode): string | null {
  if (node.type === 'INSTANCE') return node.id;
  return null;
}

/**
 * Check if a FrameNode has detached instance info (was previously a component instance).
 * Uses a best-effort check on the detachedInfo property (available in newer Figma API versions).
 */
export function checkDetachedInstances(node: SceneNode, nodePath: string): Violation[] {
  if (node.type !== 'FRAME') return [];

  const frame = node as FrameNode;
  const violations: Violation[] = [];

  // detachedInfo is available on FrameNode when it was previously a component instance
  if (
    (frame as any).detachedInfo !== null &&
    (frame as any).detachedInfo !== undefined
  ) {
    violations.push({
      id: `hc-component-detached-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'detached-instance',
      severity: 'error',
      category: 'component',
      message: 'Detached instance (was previously a component instance)',
      autoFixable: false, // component-category violations are never auto-fixable (hcFixAll skips category 'component')
    });
  }

  return violations;
}

// ── Pass 2: Asynchronous — called after traversal completes ──

/**
 * Resolve collected instance IDs asynchronously to check:
 * - Broken component references (main component deleted or moved)
 * - Excessive overrides (above EXCESSIVE_OVERRIDES_THRESHOLD)
 */
export async function resolveComponentViolations(instanceIds: string[]): Promise<Violation[]> {
  const violations: Violation[] = [];

  for (const nodeId of instanceIds) {
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type !== 'INSTANCE') continue;

    const instance = node as InstanceNode;

    // Sub-rule 1: Broken component — main component is null
    const main = await instance.getMainComponentAsync();

    // Skip remote library instances (toolkit components)
    if (main && main.remote) continue;
    if (main === null) {
      violations.push({
        id: `hc-component-broken-${nodeId}`,
        nodeId,
        nodeName: instance.name,
        nodePath: instance.name,
        rule: 'broken-component',
        severity: 'error',
        category: 'component',
        message: 'Component reference is broken (source component missing or deleted)',
        autoFixable: false, // component-category violations are never auto-fixable (hcFixAll skips category 'component')
      });
    }

    // Sub-rule 2: Excessive overrides
    if (instance.overrides && instance.overrides.length >= EXCESSIVE_OVERRIDES_THRESHOLD) {
      violations.push({
        id: `hc-component-overrides-${nodeId}`,
        nodeId,
        nodeName: instance.name,
        nodePath: instance.name,
        rule: 'excessive-overrides',
        severity: 'info',
        category: 'component',
        message: `Instance has ${instance.overrides.length} overrides (threshold: ${EXCESSIVE_OVERRIDES_THRESHOLD}) — consider if a new component variant is needed`,
        autoFixable: false, // component-category violations are never auto-fixable (hcFixAll skips category 'component')
        metadata: {
          overrideCount: instance.overrides.length,
          threshold: EXCESSIVE_OVERRIDES_THRESHOLD,
        },
      });
    }
  }

  return violations;
}
