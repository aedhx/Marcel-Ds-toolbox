import { fonts } from '../../shared/tokens';
import type { Violation } from '../../shared/violation-types';

/**
 * Check a text node for typography violations:
 * - Missing text style linkage
 * - Off-DS font family
 * Handles figma.mixed gracefully for both fontName and textStyleId.
 */
export function checkNodeTypography(node: SceneNode, nodePath: string): Violation[] {
  if (node.type !== 'TEXT') return [];

  const textNode = node as TextNode;
  const violations: Violation[] = [];

  // ── Rule 1: Missing text style ──
  const textStyleId = textNode.textStyleId;

  if (textStyleId === figma.mixed) {
    // Mixed styles across different text ranges — flag as info
    violations.push({
      id: `hc-typography-mixed-style-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'mixed-text-styles',
      severity: 'info',
      category: 'typography',
      message: 'Text has mixed styles across ranges',
    });
  } else if (textStyleId === '' || textStyleId === null || textStyleId === undefined) {
    violations.push({
      id: `hc-typography-no-style-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'missing-text-style',
      severity: 'warning',
      category: 'typography',
      message: 'Text node has no linked text style',
      suggestion: 'Link to a DS text style',
    });
  }

  // ── Rule 2: Non-DS font family ──
  const fontName = textNode.fontName;

  if (fontName === figma.mixed) {
    // Mixed font families — cannot inspect individual segments without loaded fonts
    violations.push({
      id: `hc-typography-mixed-font-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath,
      rule: 'mixed-fonts',
      severity: 'info',
      category: 'typography',
      message: 'Text has mixed font families — check each segment manually',
    });
  } else {
    if (fontName.family !== fonts.family) {
      violations.push({
        id: `hc-typography-off-ds-font-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: 'off-ds-font',
        severity: 'error',
        category: 'typography',
        message: `Font '${fontName.family}' is not the DS font (${fonts.family})`,
        suggestion: fonts.family,
        metadata: {
          currentFont: fontName.family,
          dsFont: fonts.family,
        },
      });
    }
  }

  return violations;
}
