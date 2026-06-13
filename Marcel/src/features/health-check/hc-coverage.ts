import type { Violation } from '../../shared/violation-types';
import { HC_FIXABLE_RULES } from './hc-types';

// ── Coverage result ──

export interface CoverageResult {
  dsCount: number;
  customCount: number;
  totalCount: number;
  score: number;            // 0-100, or -1 for N/A (zero instances)
  deprecatedDSCount: number;
  violations: Violation[];
}

// ── Coverage classification ──

/**
 * Classify component instances as DS (remote) or custom (local).
 * - Remote instances = DS library components
 * - Local instances = custom/local components
 * - Null main component = broken reference, counted as custom
 * - Deprecated DS components flagged as warnings
 * - Custom components grouped by name with instance counts (info severity)
 */
export async function classifyCoverageInstances(instanceIds: string[]): Promise<CoverageResult> {
  let dsCount = 0;
  let customCount = 0;
  let deprecatedDSCount = 0;
  const violations: Violation[] = [];

  // Track custom component groups: componentName -> { count, nodeIds }
  const customGroups = new Map<string, { count: number; nodeIds: string[] }>();

  // Batch node resolution to fix the sequential getNodeByIdAsync O(n) bottleneck (D-13).
  // Chunks are processed in array order and each chunk's resolved nodes are iterated in
  // slice order, so customGroups insertion order — and thus violation IDs/ordering — is
  // identical to the previous one-at-a-time loop. Behavior-preserving (D-05).
  const CHUNK = 50;
  for (let i = 0; i < instanceIds.length; i += CHUNK) {
    const slice = instanceIds.slice(i, i + CHUNK);
    const nodes = await Promise.all(slice.map((id) => figma.getNodeByIdAsync(id)));

    for (let j = 0; j < nodes.length; j++) {
      const node = nodes[j];
      const nodeId = slice[j];
      if (!node || node.type !== 'INSTANCE') continue;

      const instance = node as InstanceNode;
    let main: ComponentNode | null = null;
    try {
      main = await instance.getMainComponentAsync();
    } catch (_) {
      // dynamic-page access — treat as custom
      main = null;
    }

    if (main === null) {
      // Broken reference — count as custom
      customCount++;
      const groupName = instance.name || '_broken';
      const group = customGroups.get(groupName);
      if (group) {
        group.count++;
        group.nodeIds.push(nodeId);
      } else {
        customGroups.set(groupName, { count: 1, nodeIds: [nodeId] });
      }
      continue;
    }

    if (main.remote) {
      // DS library instance
      dsCount++;

      // Check deprecated heuristic
      const nameLC = main.name.toLowerCase();
      const descLC = (main.description || '').toLowerCase();
      if (nameLC.includes('deprecated') || descLC.includes('deprecated')) {
        deprecatedDSCount++;
        violations.push({
          id: `hc-coverage-deprecated-${nodeId}`,
          nodeId,
          nodeName: instance.name,
          nodePath: instance.name,
          rule: 'deprecated-ds-component',
          severity: 'warning',
          category: 'coverage',
          message: `Deprecated DS component: ${main.name}`,
          autoFixable: HC_FIXABLE_RULES.has('deprecated-ds-component'), // category 'coverage' is never 'component'
          metadata: {
            componentName: main.name,
            componentDescription: main.description || '',
          },
        });
      }
    } else {
      // Local/custom instance
      customCount++;
      const groupName = main.name || instance.name;
      const group = customGroups.get(groupName);
      if (group) {
        group.count++;
        group.nodeIds.push(nodeId);
      } else {
        customGroups.set(groupName, { count: 1, nodeIds: [nodeId] });
      }
      }
    }
  }

  // Create info-severity violations for each custom component group
  for (const [name, group] of customGroups) {
    violations.push({
      id: `hc-coverage-custom-${name}`,
      nodeId: group.nodeIds[0],
      nodeName: name,
      nodePath: name,
      rule: 'custom-component',
      severity: 'info',
      category: 'coverage',
      message: `${name} (${group.count} instance(s))`,
      autoFixable: HC_FIXABLE_RULES.has('custom-component'), // category 'coverage' is never 'component'
      metadata: {
        instanceCount: group.count,
        nodeIds: group.nodeIds,
      },
    });
  }

  const totalCount = dsCount + customCount;
  const score = totalCount === 0 ? -1 : Math.round((dsCount / totalCount) * 100);

  return {
    dsCount,
    customCount,
    totalCount,
    score,
    deprecatedDSCount,
    violations,
  };
}
