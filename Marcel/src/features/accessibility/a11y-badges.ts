import { createText, createFrame, loadFont, solidFill } from '../../shared/figma-helpers';
import { colors, borderRadius, fonts } from '../../shared/tokens';
import type { ImageNodeInfo } from './a11y-engine';

// ── Badge prefix for cleanup ──

const BADGE_PREFIX = '_a11y-badge-';

// ── Colors ──

const COLOR_OK: RGB = { r: 0.13, g: 0.69, b: 0.30 };
const COLOR_MISSING: RGB = { r: 0.90, g: 0.22, b: 0.21 };
const COLOR_WHITE: RGB = { r: 1, g: 1, b: 1 };
const COLOR_DARK: RGB = { r: 0.07, g: 0.07, b: 0.07 };
const COLOR_SUBTLE: RGB = { r: 0.27, g: 0.27, b: 0.27 };

// ── Annotation dimensions ──

const ANNOTATION_WIDTH = 240;
const ANNOTATION_GAP = 8;
const CONNECTOR_LENGTH = 24;

// ── Cleanup ──

/**
 * Remove all existing A11Y badges from the page to prevent accumulation on re-scan.
 */
export function cleanupBadges(page: PageNode): void {
  const badges = page.findAll(n => n.name.startsWith(BADGE_PREFIX));
  for (const badge of badges) {
    badge.remove();
  }
}

// ── Connector line ──

function createConnectorLine(x: number, y1: number, y2: number, color: RGB): LineNode {
  const line = figma.createLine();
  line.x = x;
  line.y = y1;
  line.rotation = -90; // vertical
  line.resize(Math.abs(y2 - y1), 0);
  line.strokes = solidFill(color);
  line.strokeWeight = 1.5;
  line.dashPattern = [4, 4];
  return line;
}

// ── Annotation component creation ──

async function createAltTextAnnotation(
  img: ImageNodeInfo,
  node: SceneNode
): Promise<FrameNode> {
  const statusColor = img.hasAlt ? COLOR_OK : COLOR_MISSING;
  const altValue = img.hasAlt ? img.altText : 'Manquant';

  // ── Outer container ──
  const annotation = createFrame({
    name: `${BADGE_PREFIX}${img.nodeId}`,
    width: ANNOTATION_WIDTH,
    height: 1, // auto-sized
    layoutMode: 'VERTICAL',
    primaryAxisSizingMode: 'AUTO',
    counterAxisSizingMode: 'FIXED',
    fills: solidFill(COLOR_WHITE),
    cornerRadius: borderRadius.m,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: 0,
    clipsContent: true,
  });

  // ── Top color bar (status indicator) ──
  const topBar = figma.createRectangle();
  topBar.name = 'status-bar';
  topBar.resize(ANNOTATION_WIDTH, 4);
  topBar.fills = solidFill(statusColor);
  annotation.appendChild(topBar);
  topBar.layoutAlign = 'STRETCH';

  // ── Content area ──
  const content = createFrame({
    name: 'content',
    width: ANNOTATION_WIDTH,
    height: 1,
    layoutMode: 'VERTICAL',
    primaryAxisSizingMode: 'AUTO',
    counterAxisSizingMode: 'FIXED',
    fills: [],
    paddingTop: 10,
    paddingBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
    itemSpacing: 8,
  });
  annotation.appendChild(content);
  content.layoutAlign = 'STRETCH';

  // ── Header row: status dot + "Texte alternatif" ──
  const header = createFrame({
    name: 'header',
    width: 1,
    height: 1,
    layoutMode: 'HORIZONTAL',
    primaryAxisSizingMode: 'AUTO',
    counterAxisSizingMode: 'AUTO',
    fills: [],
    itemSpacing: 6,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  content.appendChild(header);

  // Status dot
  const dot = figma.createEllipse();
  dot.name = 'status-dot';
  dot.resize(8, 8);
  dot.fills = solidFill(statusColor);
  header.appendChild(dot);

  const headerLabel = createText({
    text: 'Texte alternatif',
    fontSize: 11,
    fontStyle: fonts.weights.bold,
    color: COLOR_DARK,
  });
  header.appendChild(headerLabel);

  // ── Image name (subtle, smaller) ──
  const nameLabel = createText({
    text: img.nodeName,
    fontSize: 10,
    color: COLOR_SUBTLE,
  });
  content.appendChild(nameLabel);
  nameLabel.layoutAlign = 'STRETCH';
  nameLabel.textTruncation = 'ENDING';

  // ── Separator line ──
  const separator = figma.createRectangle();
  separator.name = 'separator';
  separator.resize(ANNOTATION_WIDTH - 24, 1);
  separator.fills = solidFill({ r: 0.92, g: 0.92, b: 0.92 });
  content.appendChild(separator);
  separator.layoutAlign = 'STRETCH';

  // ── Alt text value ──
  const altLabel = createText({
    text: img.hasAlt ? `alt="${altValue}"` : 'alt manquant — ajouter un texte descriptif',
    fontSize: 12,
    fontStyle: img.hasAlt ? fonts.weights.regular : fonts.weights.medium,
    color: img.hasAlt ? COLOR_DARK : COLOR_MISSING,
    width: ANNOTATION_WIDTH - 24,
    lineHeight: 16,
  });
  content.appendChild(altLabel);
  altLabel.layoutAlign = 'STRETCH';

  // ── Shadow ──
  annotation.effects = [
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 2 },
      radius: 8,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
    {
      type: 'DROP_SHADOW',
      color: { r: 0, g: 0, b: 0, a: 0.04 },
      offset: { x: 0, y: 0 },
      radius: 1,
      spread: 0,
      visible: true,
      blendMode: 'NORMAL',
    },
  ];

  // ── Position: to the right of the image ──
  annotation.x = img.x + img.width + CONNECTOR_LENGTH + ANNOTATION_GAP;
  annotation.y = img.y;

  return annotation;
}

// ── Badge creation ──

/**
 * Create annotation components next to each image node showing alt-text status and value.
 * Always calls cleanupBadges first to prevent duplication.
 * Returns the number of annotations created.
 */
export async function createAltTextBadges(
  imageNodes: ImageNodeInfo[]
): Promise<number> {
  // Cleanup existing badges before creating new ones
  cleanupBadges(figma.currentPage);

  if (imageNodes.length === 0) return 0;

  // Load fonts for all annotations
  await Promise.all([
    loadFont(fonts.family, fonts.weights.regular),
    loadFont(fonts.family, fonts.weights.medium),
    loadFont(fonts.family, fonts.weights.bold),
  ]);

  let badgesCreated = 0;

  for (const img of imageNodes) {
    // Look up the actual node — skip if removed
    const node = await figma.getNodeByIdAsync(img.nodeId);
    if (!node || node.removed) continue;

    const statusColor = img.hasAlt ? COLOR_OK : COLOR_MISSING;

    // Create connector line from image to annotation
    const lineX = img.x + img.width + ANNOTATION_GAP;
    const lineY = img.y + Math.min(img.height / 2, 20);
    const connector = createConnectorLine(
      lineX,
      lineY,
      lineY,
      statusColor
    );
    connector.resize(CONNECTOR_LENGTH, 0);
    connector.name = `${BADGE_PREFIX}line-${img.nodeId}`;
    figma.currentPage.appendChild(connector);

    // Create annotation component
    const annotation = await createAltTextAnnotation(img, node as SceneNode);
    figma.currentPage.appendChild(annotation);

    badgesCreated++;
  }

  return badgesCreated;
}
