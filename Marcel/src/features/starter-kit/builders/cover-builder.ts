import { colors, borderRadius, spacing, fonts } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  createRect,
  solidFill,
  gradientFill,
  addShadow,
  importAndCreateInstance,
  insertTrackingPixel,
} from "../../../shared/figma-helpers";
import { DS_COMPONENT_KEYS } from "../config";
import type { CoverData } from "../../cover-updater/cover-types";

export async function buildCover(page: PageNode, data?: CoverData): Promise<FrameNode> {
  const COVER_W = 1600;
  const COVER_H = 900;

  // Wrapper frame — required because a component instance cannot be a thumbnail
  const wrapper = createFrame({
    name: "Cover",
    width: COVER_W,
    height: COVER_H,
    fills: [],
    clipsContent: true,
  });
  wrapper.primaryAxisSizingMode = "FIXED";
  wrapper.counterAxisSizingMode = "FIXED";
  page.appendChild(wrapper);

  // Try importing real DS component (Cover "Type=In Progress")
  const instance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.coverInProgress,
    wrapper
  );
  if (instance) {
    // Ensure the instance fills the wrapper
    instance.x = 0;
    instance.y = 0;
    instance.resize(COVER_W, COVER_H);
    return wrapper;
  }

  // ── Fallback: build programmatically inside wrapper ──
  const PAD_LEFT = 120;
  const PAD_TOP = 120;

  // Apply gradient + shadow directly on the wrapper
  wrapper.fills = gradientFill(
    colors.coverGradientStart,
    colors.coverGradientEnd,
    245
  );
  addShadow(wrapper);

  // Use wrapper as the "cover" frame from here on
  const cover = wrapper;

  // ── Tags row (NS badge + In Progress pill) ──
  const tagsRow = createFrame({
    name: "Tags",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing["2xl"],
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  tagsRow.primaryAxisSizingMode = "AUTO";
  tagsRow.counterAxisSizingMode = "AUTO";
  tagsRow.x = PAD_LEFT;
  tagsRow.y = PAD_TOP;

  // NS Badge (frosted glass)
  const nsBadge = createFrame({
    name: "NS",
    width: 88,
    height: 88,
    fills: solidFill(colors.white, 0.9),
    cornerRadius: 20,
    layoutMode: "HORIZONTAL",
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
    paddingLeft: spacing.l,
    paddingRight: spacing.l,
  });
  nsBadge.primaryAxisSizingMode = "FIXED";
  nsBadge.counterAxisSizingMode = "FIXED";
  nsBadge.primaryAxisAlignItems = "CENTER";
  nsBadge.counterAxisAlignItems = "CENTER";
  nsBadge.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0, g: 0, b: 0, a: 0.1 },
      offset: { x: 0, y: 20 },
      radius: 40,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const nsText = createText({
    text: "NS",
    fontSize: 40,
    fontStyle: "Bold",
    color: colors.black,
  });
  nsBadge.appendChild(nsText);
  tagsRow.appendChild(nsBadge);

  // "In Progress" status pill
  const statusPill = createFrame({
    name: "Status",
    width: 1,
    height: 88,
    fills: solidFill(colors.white),
    cornerRadius: borderRadius.xl,
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.s,
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
  });
  statusPill.primaryAxisSizingMode = "AUTO";
  statusPill.counterAxisSizingMode = "FIXED";
  statusPill.counterAxisAlignItems = "CENTER";
  statusPill.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 0.07, g: 0.07, b: 0.07, a: 0.16 },
      offset: { x: 0, y: 8 },
      radius: 24,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
    {
      type: "DROP_SHADOW",
      color: { r: 0.07, g: 0.07, b: 0.07, a: 0.12 },
      offset: { x: 0, y: 16 },
      radius: 64,
      spread: 0,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const statusEmoji = createText({
    text: "\u{1F6A7}",
    fontSize: 32,
    fontStyle: "Regular",
    color: colors.contentSubtler,
  });
  const statusLabel = createText({
    text: data?.status ?? "In Progress",
    fontSize: 40,
    fontStyle: "Bold",
    color: colors.contentSubtler,
  });
  statusPill.appendChild(statusEmoji);
  statusPill.appendChild(statusLabel);
  tagsRow.appendChild(statusPill);

  cover.appendChild(tagsRow);

  // ── Content area (File Name + Short Description) ──
  const contentArea = createFrame({
    name: "Content",
    width: 1360,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    itemSpacing: 15,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  contentArea.primaryAxisSizingMode = "AUTO";
  contentArea.counterAxisSizingMode = "FIXED";
  contentArea.x = PAD_LEFT;
  contentArea.y = 257;

  const title = createText({
    text: data?.fileName ?? "File Name",
    fontSize: 100,
    fontStyle: "Bold",
    color: colors.white,
  });
  title.textAutoResize = "WIDTH_AND_HEIGHT";
  contentArea.appendChild(title);

  const subtitle = createText({
    text: "Short Description",
    fontSize: 48,
    fontStyle: "Medium",
    color: colors.white,
  });
  subtitle.textAutoResize = "WIDTH_AND_HEIGHT";
  contentArea.appendChild(subtitle);

  cover.appendChild(contentArea);

  // ── Bottom info bar (Produit | Date | Designer) ──
  const infoBar = createFrame({
    name: "Info",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.xl,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  infoBar.primaryAxisSizingMode = "AUTO";
  infoBar.counterAxisSizingMode = "AUTO";
  infoBar.x = PAD_LEFT;
  infoBar.y = 700;

  // Helper to create an info column
  function createInfoColumn(label: string, value: string): FrameNode {
    const col = createFrame({
      name: label,
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      itemSpacing: spacing.s,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    });
    col.primaryAxisSizingMode = "AUTO";
    col.counterAxisSizingMode = "AUTO";
    col.primaryAxisAlignItems = "MIN";

    const labelNode = createText({
      text: label.toUpperCase(),
      fontSize: 24,
      fontStyle: "Medium",
      color: colors.white,
    });
    labelNode.textAutoResize = "WIDTH_AND_HEIGHT";
    col.appendChild(labelNode);

    const valueNode = createText({
      text: value,
      fontSize: 36,
      fontStyle: "Bold",
      color: colors.white,
    });
    valueNode.textAutoResize = "WIDTH_AND_HEIGHT";
    col.appendChild(valueNode);

    return col;
  }

  // Separator line between info columns
  function createInfoSeparator(): RectangleNode {
    const sep = createRect({
      name: "Separator",
      width: 1,
      height: 80,
      fills: solidFill(colors.white, 0.3),
    });
    return sep;
  }

  infoBar.appendChild(createInfoColumn("Produit", data?.fileName ?? "Product name"));
  infoBar.appendChild(createInfoSeparator());
  infoBar.appendChild(createInfoColumn("Date", data?.date ?? "01/2026"));
  infoBar.appendChild(createInfoSeparator());
  infoBar.appendChild(createInfoColumn("Designer", data?.designer ?? "Pr\u00e9nom Nom"));

  cover.appendChild(infoBar);

  // wrapper is already appended to page above

  // ── Tracking pixel (next to cover, not inside, to avoid detaching) ──
  await insertTrackingPixel(page, wrapper);

  return wrapper;
}

