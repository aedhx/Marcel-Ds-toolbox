import { getNodeFills, resolveOrMixed } from '../../shared/figma-helpers';
import type { Violation } from '../../shared/violation-types';
import type { ContrastResult } from './a11y-types';

// ── sRGB linearization (WCAG 2.1 - IEC 61966-2-1) ──

/**
 * Convert sRGB channel value (0-1) to linear light.
 * Uses WCAG 2.1 threshold of 0.04045 (NOT the older 0.03928).
 */
export function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

/**
 * Convert linear light value back to sRGB (inverse gamma).
 */
export function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

// ── WCAG relative luminance ──

/**
 * Compute relative luminance per WCAG 2.1 definition.
 * Input: Figma RGB (0-1 range, sRGB).
 */
export function relativeLuminance(color: RGB): number {
  return (
    0.2126 * srgbToLinear(color.r) +
    0.7152 * srgbToLinear(color.g) +
    0.0722 * srgbToLinear(color.b)
  );
}

// ── Contrast ratio ──

/**
 * Compute WCAG contrast ratio between two colors.
 * Returns value >= 1 (e.g., 4.5 for 4.5:1).
 */
export function contrastRatio(fg: RGB, bg: RGB): number {
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Large text detection ──

/**
 * Determine if a text node qualifies as "large text" per WCAG:
 * >= 24px (18pt) regular, or >= 18.66px (14pt) bold (weight >= 700).
 */
export function isLargeText(node: TextNode): boolean {
  const fontSize = resolveOrMixed(node.fontSize, 14);
  const fontWeight = resolveOrMixed(node.fontWeight, 400);
  return fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
}

// ── Background resolution ──

/**
 * Walk up the parent chain to find the first opaque background color.
 * Returns null for gradient/image backgrounds (manual check needed).
 * Returns white fallback with isReliable=false if no background found.
 */
export function resolveBackgroundColor(
  node: SceneNode
): { color: RGB; isReliable: boolean } | null {
  let current: BaseNode | null = node.parent;
  while (current && current.type !== 'PAGE' && current.type !== 'DOCUMENT') {
    if ('fills' in current) {
      const fills = getNodeFills(current as SceneNode);
      // Iterate from topmost fill (last) to bottom (first)
      for (let i = fills.length - 1; i >= 0; i--) {
        const paint = fills[i];
        if (paint.visible === false) continue;

        if (paint.type === 'SOLID' && (paint.opacity ?? 1) >= 0.99) {
          return { color: (paint as SolidPaint).color, isReliable: true };
        }

        // Gradient or image: cannot reliably determine contrast
        if (
          paint.type === 'GRADIENT_LINEAR' ||
          paint.type === 'GRADIENT_RADIAL' ||
          paint.type === 'GRADIENT_ANGULAR' ||
          paint.type === 'GRADIENT_DIAMOND' ||
          paint.type === 'IMAGE'
        ) {
          return null;
        }
      }
    }
    current = current.parent;
  }

  // Default: assume white background (common Figma default)
  return { color: { r: 1, g: 1, b: 1 }, isReliable: false };
}

// ── Contrast checker ──

/**
 * Check a text node for WCAG contrast compliance.
 * Returns violations for insufficient contrast or manual-check-needed cases.
 */
export function checkContrast(node: TextNode, path: string): Violation[] {
  const violations: Violation[] = [];

  // Resolve foreground color from node fills (first visible SOLID fill)
  const fills = getNodeFills(node);
  let fgColor: RGB | null = null;
  for (const paint of fills) {
    if (paint.visible === false) continue;
    if (paint.type === 'SOLID') {
      fgColor = (paint as SolidPaint).color;
      break;
    }
  }

  // No visible solid fill on text — skip
  if (!fgColor) return violations;

  // Resolve background color
  const bg = resolveBackgroundColor(node);

  if (bg === null) {
    // Gradient or image background — manual check needed
    violations.push({
      id: `a11y-contrast-manual-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: path,
      rule: 'contrast-manual-check',
      severity: 'info',
      category: 'contrast',
      message: `"${node.name}" has a gradient or image background — manual contrast check needed`,
      metadata: { fgColor },
    });
    return violations;
  }

  const ratio = contrastRatio(fgColor, bg.color);
  const ratioRounded = Math.round(ratio * 100) / 100;
  const ratioText = `${ratioRounded}:1`;
  const largeText = isLargeText(node);

  // WCAG thresholds
  const aaThreshold = largeText ? 3.0 : 4.5;
  const aaaThreshold = largeText ? 4.5 : 7.0;
  const aa = ratio >= aaThreshold;
  const aaa = ratio >= aaaThreshold;

  const contrastMeta: ContrastResult = {
    ratio: ratioRounded,
    ratioText,
    aa,
    aaa,
    isLargeText: largeText,
    isReliable: bg.isReliable,
  };

  if (!aa) {
    // Fails AA — error
    violations.push({
      id: `a11y-contrast-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: path,
      rule: 'insufficient-contrast',
      severity: 'error',
      category: 'contrast',
      message: `Contrast ratio ${ratioText} fails WCAG AA (minimum ${aaThreshold}:1${largeText ? ' for large text' : ''})`,
      metadata: { ...contrastMeta, fgColor, bgColor: bg.color },
    });
  } else if (!aaa) {
    // Passes AA but fails AAA — warning
    violations.push({
      id: `a11y-contrast-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: path,
      rule: 'insufficient-contrast',
      severity: 'warning',
      category: 'contrast',
      message: `Contrast ratio ${ratioText} passes AA but fails AAA (minimum ${aaaThreshold}:1${largeText ? ' for large text' : ''})`,
      metadata: { ...contrastMeta, fgColor, bgColor: bg.color },
    });
  }

  return violations;
}
