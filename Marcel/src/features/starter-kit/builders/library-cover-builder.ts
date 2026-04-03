import { borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  createRect,
  solidFill,
  addShadow,
  importAndCreateInstance,
  insertTrackingPixel,
} from "../../../shared/figma-helpers";
import { DS_COMPONENT_KEYS } from "../config";

// DS Library specific colors (RGB 0-1)
function hex(h: string): RGB {
  const c = h.replace("#", "");
  return {
    r: parseInt(c.substring(0, 2), 16) / 255,
    g: parseInt(c.substring(2, 4), 16) / 255,
    b: parseInt(c.substring(4, 6), 16) / 255,
  };
}

const purple = hex("#8B5CF6");
const orange = hex("#F97316");
const white: RGB = { r: 1, g: 1, b: 1 };

function createBadge(text: string): FrameNode {
  const badge = createFrame({
    name: `Badge - ${text}`,
    width: 1,
    height: 1,
    fills: solidFill(white),
    cornerRadius: borderRadius.xl,
    layoutMode: "HORIZONTAL",
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 14,
    paddingRight: 14,
  });
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";

  const label = createText({
    text,
    fontSize: 14,
    fontStyle: "Medium",
    color: { r: 0.07, g: 0.07, b: 0.07 },
  });
  badge.appendChild(label);
  return badge;
}

export async function buildLibraryCover(page: PageNode): Promise<FrameNode> {
  // Try importing real DS component ([DS] Library CORE Cover - Domaine-local)
  const instance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.dsLibraryCoverDomaine,
    page
  );
  if (instance) {
    // Insert tracking pixel for library analytics
    await insertTrackingPixel(page, instance);
    return instance as unknown as FrameNode;
  }

  // Fallback: build programmatically
  const cover = createFrame({
    name: "Library Cover",
    width: 1600,
    height: 960,
    fills: [],
    cornerRadius: borderRadius.l,
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: 0,
    clipsContent: true,
  });
  cover.primaryAxisSizingMode = "FIXED";
  cover.counterAxisSizingMode = "FIXED";
  addShadow(cover);

  // Gradient background
  cover.fills = [
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: [
        [0.7, 0.7, 0],
        [-0.7, 0.7, 0.3],
      ],
      gradientStops: [
        { position: 0, color: { r: purple.r, g: purple.g, b: purple.b, a: 1 } },
        { position: 1, color: { r: orange.r, g: orange.g, b: orange.b, a: 1 } },
      ],
    },
  ];

  // Top bar: "Local Library" label + badges
  const topBar = createFrame({
    name: "Top Bar",
    width: 1600,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: spacing["3xl"],
    paddingBottom: 0,
    paddingLeft: spacing["4xl"],
    paddingRight: spacing["4xl"],
    itemSpacing: spacing.l,
  });
  topBar.primaryAxisSizingMode = "FIXED";
  topBar.counterAxisSizingMode = "AUTO";
  topBar.layoutAlign = "STRETCH";
  topBar.primaryAxisAlignItems = "SPACE_BETWEEN";
  topBar.counterAxisAlignItems = "CENTER";

  const localLibLabel = createText({
    text: "Local Library",
    fontSize: 20,
    fontStyle: "Bold",
    color: white,
  });
  topBar.appendChild(localLibLabel);

  // Badges row
  const badgesRow = createFrame({
    name: "Badges",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: spacing.s,
  });
  badgesRow.primaryAxisSizingMode = "AUTO";
  badgesRow.counterAxisSizingMode = "AUTO";

  const flagBadge = createBadge("\u{1F1EB}\u{1F1F7}");
  const webBadge = createBadge("Web \u{1F5A5}");
  const appBadge = createBadge("App \u{1F4F1}");
  badgesRow.appendChild(flagBadge);
  badgesRow.appendChild(webBadge);
  badgesRow.appendChild(appBadge);

  topBar.appendChild(badgesRow);
  cover.appendChild(topBar);

  // Center content area
  const centerArea = createFrame({
    name: "Center Content",
    width: 1600,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: spacing["4xl"],
    paddingRight: spacing["4xl"],
    itemSpacing: spacing.xl,
  });
  centerArea.layoutAlign = "STRETCH";
  centerArea.layoutGrow = 1;
  centerArea.primaryAxisSizingMode = "FIXED";
  centerArea.counterAxisSizingMode = "FIXED";
  centerArea.primaryAxisAlignItems = "CENTER";
  centerArea.counterAxisAlignItems = "MIN";

  // Title
  const title = createText({
    text: "[STARTER] LIBRARY NAME",
    fontSize: 56,
    fontStyle: "Bold",
    color: white,
    width: 1504,
    lineHeight: 64,
  });
  title.layoutAlign = "STRETCH";
  centerArea.appendChild(title);

  // Subtitle
  const subtitle = createText({
    text: "Please duplicate me, I'm a starter kit that will save you time and bring consistency to another level",
    fontSize: 20,
    fontStyle: "Regular",
    color: white,
    width: 960,
    lineHeight: 30,
    opacity: 0.7,
  });
  subtitle.layoutAlign = "INHERIT";
  centerArea.appendChild(subtitle);

  cover.appendChild(centerArea);

  // Bottom bar: Marcel branding + Carrefour logo
  const bottomBar = createFrame({
    name: "Bottom Bar",
    width: 1600,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: 0,
    paddingBottom: spacing["3xl"],
    paddingLeft: spacing["4xl"],
    paddingRight: spacing["4xl"],
    itemSpacing: spacing.l,
  });
  bottomBar.primaryAxisSizingMode = "FIXED";
  bottomBar.counterAxisSizingMode = "AUTO";
  bottomBar.layoutAlign = "STRETCH";
  bottomBar.primaryAxisAlignItems = "SPACE_BETWEEN";
  bottomBar.counterAxisAlignItems = "MAX";

  // Marcel branding (left)
  const brandingBlock = createFrame({
    name: "Branding",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: spacing.xs,
  });
  brandingBlock.primaryAxisSizingMode = "AUTO";
  brandingBlock.counterAxisSizingMode = "AUTO";

  const marcelText = createText({
    text: "marcel",
    fontSize: 24,
    fontStyle: "Bold",
    color: white,
  });
  brandingBlock.appendChild(marcelText);

  const dsLabel = createText({
    text: "CARREFOUR DESIGN SYSTEM",
    fontSize: 11,
    fontStyle: "Medium",
    color: white,
    letterSpacing: 2,
    opacity: 0.6,
  });
  brandingBlock.appendChild(dsLabel);

  bottomBar.appendChild(brandingBlock);

  // Carrefour "C" logo placeholder (right)
  const logoFrame = createFrame({
    name: "Carrefour Logo",
    width: 48,
    height: 48,
    fills: [],
    cornerRadius: borderRadius.rounded,
    layoutMode: "HORIZONTAL",
  });
  logoFrame.primaryAxisSizingMode = "FIXED";
  logoFrame.counterAxisSizingMode = "FIXED";
  logoFrame.primaryAxisAlignItems = "CENTER";
  logoFrame.counterAxisAlignItems = "CENTER";

  const logoC = createText({
    text: "C",
    fontSize: 32,
    fontStyle: "Bold",
    color: white,
  });
  logoFrame.appendChild(logoC);

  bottomBar.appendChild(logoFrame);
  cover.appendChild(bottomBar);

  page.appendChild(cover);

  // ── Tracking pixel (invisible DS component for library analytics) ──
  await insertTrackingPixel(page, cover);

  return cover;
}

