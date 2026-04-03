import { colors, fonts, spacing, borderRadius } from "./tokens";

// ── figma.mixed guard utilities (INFRA-07) ──

/**
 * Returns fallback if value is figma.mixed, otherwise returns the value.
 */
export function resolveOrMixed<T>(value: T | typeof figma.mixed, fallback: T): T {
  return value === figma.mixed ? fallback : value;
}

/**
 * Safely get fills from a node, returning empty array for mixed or missing fills.
 */
export function getNodeFills(node: SceneNode): ReadonlyArray<Paint> {
  if (!("fills" in node)) return [];
  const fills = (node as MinimalFillsMixin).fills;
  if (fills === figma.mixed) return [];
  return fills;
}

/**
 * Safely get strokes from a node.
 */
export function getNodeStrokes(node: SceneNode): ReadonlyArray<Paint> {
  if (!("strokes" in node)) return [];
  return (node as MinimalStrokesMixin).strokes;
}

/**
 * Check if a value is figma.mixed.
 */
export function isMixed(value: unknown): boolean {
  return value === figma.mixed;
}

// Font loading cache to avoid duplicate loads
const loadedFonts = new Set<string>();

export async function loadFont(
  family: string = fonts.family,
  style: string = fonts.weights.regular
): Promise<void> {
  const key = `${family}::${style}`;
  if (loadedFonts.has(key)) return;
  await figma.loadFontAsync({ family, style });
  loadedFonts.add(key);
}

export async function loadAllFonts(): Promise<void> {
  await Promise.all([
    loadFont(fonts.family, fonts.weights.regular),
    loadFont(fonts.family, fonts.weights.medium),
    loadFont(fonts.family, fonts.weights.bold),
  ]);
}

export function createText(options: {
  text: string;
  fontSize: number;
  fontStyle?: string;
  color?: RGB;
  x?: number;
  y?: number;
  width?: number;
  lineHeight?: number;
  letterSpacing?: number;
  opacity?: number;
}): TextNode {
  const node = figma.createText();
  node.fontName = {
    family: fonts.family,
    style: options.fontStyle || fonts.weights.regular,
  };
  node.characters = options.text;
  node.fontSize = options.fontSize;
  node.fills = [{ type: "SOLID", color: options.color || colors.contentDefault }];
  if (options.x !== undefined) node.x = options.x;
  if (options.y !== undefined) node.y = options.y;
  if (options.width !== undefined) {
    node.resize(options.width, node.height);
    node.textAutoResize = "HEIGHT";
  }
  if (options.lineHeight !== undefined) {
    node.lineHeight = { value: options.lineHeight, unit: "PIXELS" };
  }
  if (options.letterSpacing !== undefined) {
    node.letterSpacing = { value: options.letterSpacing, unit: "PIXELS" };
  }
  if (options.opacity !== undefined) {
    node.opacity = options.opacity;
  }
  return node;
}

export function createFrame(options: {
  name: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  fills?: ReadonlyArray<Paint>;
  cornerRadius?: number;
  layoutMode?: "HORIZONTAL" | "VERTICAL" | "NONE";
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  itemSpacing?: number;
  primaryAxisSizingMode?: "FIXED" | "AUTO";
  counterAxisSizingMode?: "FIXED" | "AUTO";
  clipsContent?: boolean;
}): FrameNode {
  const frame = figma.createFrame();
  frame.name = options.name;
  frame.resize(options.width, options.height);
  if (options.x !== undefined) frame.x = options.x;
  if (options.y !== undefined) frame.y = options.y;
  if (options.fills !== undefined) frame.fills = options.fills;
  if (options.cornerRadius !== undefined) frame.cornerRadius = options.cornerRadius;
  if (options.layoutMode && options.layoutMode !== "NONE") {
    frame.layoutMode = options.layoutMode;
  }
  if (options.paddingTop !== undefined) frame.paddingTop = options.paddingTop;
  if (options.paddingBottom !== undefined) frame.paddingBottom = options.paddingBottom;
  if (options.paddingLeft !== undefined) frame.paddingLeft = options.paddingLeft;
  if (options.paddingRight !== undefined) frame.paddingRight = options.paddingRight;
  if (options.itemSpacing !== undefined) frame.itemSpacing = options.itemSpacing;
  if (options.primaryAxisSizingMode !== undefined) {
    frame.primaryAxisSizingMode = options.primaryAxisSizingMode;
  }
  if (options.counterAxisSizingMode !== undefined) {
    frame.counterAxisSizingMode = options.counterAxisSizingMode;
  }
  if (options.clipsContent !== undefined) frame.clipsContent = options.clipsContent;
  return frame;
}

export function createRect(options: {
  name: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  fills?: ReadonlyArray<Paint>;
  cornerRadius?: number;
  opacity?: number;
}): RectangleNode {
  const rect = figma.createRectangle();
  rect.name = options.name;
  rect.resize(options.width, options.height);
  if (options.x !== undefined) rect.x = options.x;
  if (options.y !== undefined) rect.y = options.y;
  if (options.fills !== undefined) rect.fills = options.fills;
  if (options.cornerRadius !== undefined) rect.cornerRadius = options.cornerRadius;
  if (options.opacity !== undefined) rect.opacity = options.opacity;
  return rect;
}

export function solidFill(color: RGB, opacity?: number): SolidPaint[] {
  return [{ type: "SOLID", color, opacity: opacity ?? 1 }];
}

export function gradientFill(
  colorStart: RGB,
  colorEnd: RGB,
  angleDeg: number = 245
): GradientPaint[] {
  // Convert angle to gradient handle positions
  const angleRad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(angleRad);
  const sin = Math.sin(angleRad);
  return [
    {
      type: "GRADIENT_LINEAR",
      gradientStops: [
        { position: 0.1, color: { ...colorEnd, a: 1 } },
        { position: 0.57, color: { ...colorStart, a: 1 } },
      ],
      gradientTransform: [
        [cos, sin, 0.5 - (cos + sin) * 0.5],
        [-sin, cos, 0.5 - (-sin + cos) * 0.5],
      ],
    },
  ];
}

export function addShadow(node: FrameNode | RectangleNode): void {
  node.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.08 },
      offset: { x: 0, y: 2 },
      radius: 12,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];
}

export async function importAndCreateInstance(
  componentKey: string,
  parent?: PageNode | FrameNode,
  options?: { x?: number; y?: number }
): Promise<InstanceNode | null> {
  try {
    console.log(`[Marcel] Importing component: ${componentKey}`);
    const component = await figma.importComponentByKeyAsync(componentKey);
    console.log(`[Marcel] Imported OK: "${component.name}" (${component.id})`);
    const instance = component.createInstance();
    if (options?.x !== undefined) instance.x = options.x;
    if (options?.y !== undefined) instance.y = options.y;
    if (parent) {
      parent.appendChild(instance);
    }
    console.log(`[Marcel] Instance created: "${instance.name}"`);
    return instance;
  } catch (e: any) {
    const msg = e?.message || String(e);
    console.warn(`[Marcel] Skipped import ${componentKey.substring(0, 8)}...: ${msg}`);
    return null;
  }
}

export async function insertTrackingPixel(
  page: PageNode,
  anchorNode: SceneNode
): Promise<void> {
  let pixel: SceneNode | null = await importAndCreateInstance(
    // DS_COMPONENT_KEYS.trackingPixel — raw key to avoid cross-feature import
    "765eaa06057611c1a5e88eac045eff85159116b5",
    page
  );
  if (!pixel) {
    const fallback = createRect({
      name: "Pixels",
      width: 154,
      height: 154,
      fills: solidFill({ r: 0.85, g: 0.85, b: 0.85 }),
      cornerRadius: 122,
      opacity: 0,
    });
    page.appendChild(fallback);
    pixel = fallback;
  }
  pixel.x = anchorNode.x + anchorNode.width + 40;
  pixel.y = anchorNode.y;
  pixel.locked = true;
}

export function setAutoLayoutChild(
  node: SceneNode,
  options: {
    layoutAlign?: "STRETCH" | "INHERIT";
    layoutGrow?: number;
  }
): void {
  if ("layoutAlign" in node && options.layoutAlign) {
    (node as any).layoutAlign = options.layoutAlign;
  }
  if ("layoutGrow" in node && options.layoutGrow !== undefined) {
    (node as any).layoutGrow = options.layoutGrow;
  }
}
