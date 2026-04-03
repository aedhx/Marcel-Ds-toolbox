import { getNodeFills } from '../../shared/figma-helpers';
import type { Violation } from '../../shared/violation-types';

/**
 * Check if a node has visible IMAGE fills.
 */
export function isImageNode(node: SceneNode): boolean {
  const fills = getNodeFills(node);
  for (const paint of fills) {
    if (paint.type === 'IMAGE' && paint.visible !== false) return true;
  }
  return false;
}

/**
 * Check if a node is an instance of a known image/avatar component.
 * Matches common DS patterns: image, avatar, photo, thumbnail, picture.
 */
export function isImageComponentInstance(node: SceneNode): boolean {
  if (node.type !== 'INSTANCE') return false;
  const name = node.name.toLowerCase();
  return (
    name.includes('image') ||
    name.includes('avatar') ||
    name.includes('photo') ||
    name.includes('thumbnail') ||
    name.includes('picture')
  );
}

/** Regex to detect and extract [ALT=…] from a layer name. */
const ALT_TAG_RE = /\s*\[ALT=([^\]]*)\]/;

/**
 * Get the alt-text encoded in the layer name via [ALT=…].
 * Falls back to legacy pluginData if present.
 */
export function getAltText(node: SceneNode): string {
  const match = node.name.match(ALT_TAG_RE);
  if (match) return match[1];
  // Legacy fallback: read from pluginData
  return node.getPluginData('alt-text') || '';
}

/**
 * Set alt-text by appending/updating [ALT=…] in the layer name.
 */
export function setAltText(node: SceneNode, altText: string): void {
  // Remove any existing [ALT=…] tag
  const baseName = node.name.replace(ALT_TAG_RE, '').trimEnd();

  if (altText) {
    node.name = `${baseName} [ALT=${altText}]`;
  } else {
    // Clear: just restore the base name
    node.name = baseName;
  }

  // Clear legacy pluginData if it was set
  if (node.getPluginData('alt-text')) {
    node.setPluginData('alt-text', '');
  }
}

/**
 * Check if a node has alt-text set.
 */
export function hasAltText(node: SceneNode): boolean {
  return getAltText(node).length > 0;
}

/**
 * Check a node for alt-text compliance.
 * Returns isImage=false if the node is not an image.
 * Returns a violation if it is an image without alt-text.
 */
export function checkAltText(
  node: SceneNode,
  path: string
): { isImage: boolean; violation: Violation | null } {
  const isImage = isImageNode(node) || isImageComponentInstance(node);
  if (!isImage) {
    return { isImage: false, violation: null };
  }

  const altTextPresent = hasAltText(node);
  if (altTextPresent) {
    return { isImage: true, violation: null };
  }

  return {
    isImage: true,
    violation: {
      id: `a11y-alt-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: path,
      rule: 'missing-alt-text',
      severity: 'error',
      category: 'alt-text',
      message: `Image "${node.name}" is missing alt-text`,
      suggestion: 'Add descriptive alt-text for this image',
      metadata: { hasAltText: false },
    },
  };
}
