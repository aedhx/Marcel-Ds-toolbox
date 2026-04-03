import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  createRect,
  solidFill,
  addShadow,
} from "../../../shared/figma-helpers";

// ── Helpers ──

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

export function createHighlightChip(
  label: string,
  bgColor: RGB,
  textColor: RGB
): FrameNode {
  const chip = createFrame({
    name: `Highlight - ${label}`,
    width: 1,
    height: 1,
    fills: solidFill(bgColor),
    cornerRadius: borderRadius.s,
    layoutMode: "HORIZONTAL",
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
    paddingLeft: spacing.s,
    paddingRight: spacing.s,
  });
  chip.primaryAxisSizingMode = "AUTO";
  chip.counterAxisSizingMode = "AUTO";

  const text = createText({
    text: label,
    fontSize: 11,
    fontStyle: "Bold",
    color: textColor,
  });
  chip.appendChild(text);
  return chip;
}

export function createPostIt(
  title: string,
  body: string,
  bgColor: RGB
): FrameNode {
  const postit = createFrame({
    name: `Post-it - ${title}`,
    width: 200,
    height: 1,
    fills: solidFill(bgColor),
    cornerRadius: borderRadius.s,
    layoutMode: "VERTICAL",
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    itemSpacing: spacing.s,
  });
  postit.primaryAxisSizingMode = "AUTO";
  addShadow(postit);

  const titleNode = createText({
    text: title,
    fontSize: 12,
    fontStyle: "Bold",
    color: colors.contentDefault,
    width: 176,
    lineHeight: 16,
  });
  titleNode.layoutAlign = "STRETCH";
  postit.appendChild(titleNode);

  const bodyNode = createText({
    text: body,
    fontSize: 11,
    fontStyle: "Regular",
    color: colors.contentSubtle,
    width: 176,
    lineHeight: 16,
  });
  bodyNode.layoutAlign = "STRETCH";
  postit.appendChild(bodyNode);

  return postit;
}

export function createDeviceBadge(emoji: string, label: string, bgColor: RGB): FrameNode {
  const badge = createFrame({
    name: `Device - ${label}`,
    width: 1,
    height: 1,
    fills: solidFill(bgColor),
    cornerRadius: borderRadius.m,
    layoutMode: "HORIZONTAL",
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    itemSpacing: spacing.s,
  });
  badge.primaryAxisSizingMode = "AUTO";
  badge.counterAxisSizingMode = "AUTO";

  const emojiNode = createText({
    text: emoji,
    fontSize: 14,
    fontStyle: "Regular",
    color: colors.white,
  });
  badge.appendChild(emojiNode);

  const labelNode = createText({
    text: label,
    fontSize: 14,
    fontStyle: "Bold",
    color: colors.white,
  });
  badge.appendChild(labelNode);

  return badge;
}

export function createLinkButton(category: string, label: string, bgColor: RGB): FrameNode {
  const btn = createFrame({
    name: `Link - ${label}`,
    width: 1,
    height: 1,
    fills: solidFill(bgColor),
    cornerRadius: borderRadius.m,
    layoutMode: "VERTICAL",
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    paddingLeft: spacing.l,
    paddingRight: spacing.l,
    itemSpacing: spacing.xs,
  });
  btn.primaryAxisSizingMode = "AUTO";
  btn.counterAxisSizingMode = "AUTO";

  const catNode = createText({
    text: category.toUpperCase(),
    fontSize: 9,
    fontStyle: "Bold",
    color: colors.white,
    letterSpacing: 1,
  });
  catNode.opacity = 0.7;
  btn.appendChild(catNode);

  const labelNode = createText({
    text: label,
    fontSize: 14,
    fontStyle: "Bold",
    color: colors.white,
  });
  btn.appendChild(labelNode);

  return btn;
}

export function createScreenComponent(title: string, status: string, statusColor: RGB): FrameNode {
  const screen = createFrame({
    name: `Screen - ${title}`,
    width: 180,
    height: 1,
    fills: solidFill(colors.backgroundDefault),
    cornerRadius: borderRadius.s,
    layoutMode: "VERTICAL",
    paddingTop: spacing.s,
    paddingBottom: spacing.s,
    paddingLeft: spacing.s,
    paddingRight: spacing.s,
    itemSpacing: spacing.xs,
  });
  screen.primaryAxisSizingMode = "AUTO";
  addShadow(screen);

  // Status dot + label row
  const statusRow = createFrame({
    name: "Status",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.xs,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  statusRow.primaryAxisSizingMode = "AUTO";
  statusRow.counterAxisSizingMode = "AUTO";
  statusRow.counterAxisAlignItems = "CENTER";

  const dot = createRect({
    name: "Dot",
    width: 8,
    height: 8,
    fills: solidFill(statusColor),
    cornerRadius: 100,
  });
  statusRow.appendChild(dot);

  const statusText = createText({
    text: status,
    fontSize: 9,
    fontStyle: "Bold",
    color: statusColor,
    letterSpacing: 0.5,
  });
  statusRow.appendChild(statusText);
  screen.appendChild(statusRow);

  // Title
  const titleNode = createText({
    text: title,
    fontSize: 12,
    fontStyle: "Medium",
    color: colors.contentDefault,
    width: 164,
    lineHeight: 16,
  });
  titleNode.layoutAlign = "STRETCH";
  screen.appendChild(titleNode);

  return screen;
}

// ── Toolkit content data ──

const HIGHLIGHTS = [
  { label: "What has changed?", bg: "#FEF3C7", text: "#92400E" },
  { label: "What\u2019s relevant about accessibility?", bg: "#DBEAFE", text: "#1E40AF" },
  { label: "What needs building?", bg: "#FEE2E2", text: "#991B1B" },
  { label: "What changed?", bg: "#E0E7FF", text: "#3730A3" },
  { label: "What\u2019s new?", bg: "#D1FAE5", text: "#065F46" },
  { label: "What\u2019s up?", bg: "#FCE7F3", text: "#9D174D" },
];

const SCREEN_EXAMPLES = [
  { title: "Title of the screen", status: "WIP", color: colors.statusWip },
  { title: "Title of the screen", status: "READY", color: colors.success },
  { title: "Title of the screen", status: "REVIEW", color: colors.brand },
];

const DEVICES = [
  { emoji: "\u{1F5A5}\uFE0F", label: "Desktop", color: "#1E40AF" },
  { emoji: "\u{1F4F1}", label: "Tablet", color: "#B45309" },
  { emoji: "\u{1F4F1}", label: "Mobile", color: "#065F46" },
  { emoji: "\u{1F534}", label: "IOS", color: "#121212" },
  { emoji: "\u{1F7E3}", label: "Android", color: "#5B21B6" },
];

const LINKS = [
  { cat: "Documentation", label: "Add link here", color: "#1E40AF" },
  { cat: "Workshop", label: "Add link here", color: "#B45309" },
  { cat: "Documentation", label: "Guidelines", color: "#065F46" },
  { cat: "Figma File", label: "Add link here", color: "#7C3AED" },
  { cat: "Figma File", label: "Play prototype", color: "#DC2626" },
  { cat: "FigJam File", label: "Add link here", color: "#121212" },
  { cat: "Research", label: "Add link here", color: "#059669" },
  { cat: "Link", label: "Add link here", color: "#6B7280" },
  { cat: "Figma Make", label: "Play prototype", color: "#7C3AED" },
];

// ── Shared section builder helpers ──

function createToolkitSectionFrame(name: string): FrameNode {
  const section = createFrame({
    name,
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    itemSpacing: spacing.m,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "AUTO";
  return section;
}

function createWrapRow(name: string): FrameNode {
  const row = createFrame({
    name,
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.s,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  row.primaryAxisSizingMode = "AUTO";
  row.counterAxisSizingMode = "AUTO";
  row.layoutWrap = "WRAP";
  return row;
}

/**
 * Builds the toolkit content sections (highlights, post-its, quotes, screens,
 * devices, links) into the given parent container.
 */
export function buildToolkitContent(parent: FrameNode): void {
  // ── 1. Highlights ──
  const highlightsSection = createToolkitSectionFrame("Highlights Section");
  const highlightsLabel = createText({
    text: "J\u2019ai besoin de d\u00e9crire une nouveaut\u00e9, un changement, une r\u00e8gle, un comportement...",
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentDefault,
  });
  highlightsSection.appendChild(highlightsLabel);

  const highlightsRow = createWrapRow("Highlights");
  for (const h of HIGHLIGHTS) {
    highlightsRow.appendChild(
      createHighlightChip(h.label, hexToRgb(h.bg), hexToRgb(h.text))
    );
  }
  highlightsSection.appendChild(highlightsRow);
  parent.appendChild(highlightsSection);

  // ── 2. Post-its ──
  const postitsSection = createToolkitSectionFrame("Post-its Section");
  const postitsLabel = createText({
    text: "J\u2019ai besoin d\u2019ajouter des notes sur les parcours",
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentDefault,
  });
  postitsSection.appendChild(postitsLabel);

  const postit = createPostIt(
    "Title here",
    "Votre green note ici. Use different post-it colors to highlight different topics or areas.",
    hexToRgb("#FEF9C3")
  );
  postitsSection.appendChild(postit);
  parent.appendChild(postitsSection);

  // ── 3. Quote / Verbatim ──
  const quoteSection = createToolkitSectionFrame("Quote Section");
  const quoteLabel = createText({
    text: "J\u2019ai besoin d\u2019illustrer mon flow / \u00e9cran avec un verbatim",
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentDefault,
  });
  quoteSection.appendChild(quoteLabel);

  const quoteBox = createFrame({
    name: "Quote",
    width: 280,
    height: 1,
    fills: solidFill(colors.backgroundDefault),
    cornerRadius: borderRadius.m,
    layoutMode: "HORIZONTAL",
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    paddingLeft: spacing.l,
    paddingRight: spacing.l,
    itemSpacing: spacing.s,
  });
  quoteBox.primaryAxisSizingMode = "FIXED";
  quoteBox.counterAxisSizingMode = "AUTO";
  addShadow(quoteBox);

  const quoteIcon = createText({
    text: "\u{1F4AC}",
    fontSize: 16,
    fontStyle: "Regular",
    color: colors.contentDefault,
  });
  quoteBox.appendChild(quoteIcon);

  const quoteText = createText({
    text: "\u00ab Verbatim utilisateur ici \u00bb",
    fontSize: 13,
    fontStyle: "Regular",
    color: colors.contentSubtle,
    width: 220,
    lineHeight: 20,
  });
  quoteText.layoutAlign = "STRETCH";
  quoteBox.appendChild(quoteText);
  quoteSection.appendChild(quoteBox);
  parent.appendChild(quoteSection);

  // ── 4. Screen descriptions ──
  const screensSection = createToolkitSectionFrame("Screens Section");
  const screensLabel = createText({
    text: "J\u2019ai besoin de d\u00e9crire globalement un \u00e9cran",
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentDefault,
  });
  screensSection.appendChild(screensLabel);

  const screensGrid = createWrapRow("Screens Grid");
  for (const s of SCREEN_EXAMPLES) {
    screensGrid.appendChild(createScreenComponent(s.title, s.status, s.color));
  }
  screensSection.appendChild(screensGrid);
  parent.appendChild(screensSection);

  // ── 5. Device indicators ──
  const deviceSection = createToolkitSectionFrame("Device Section");
  const deviceLabel = createText({
    text: "J\u2019ai besoin de pr\u00e9ciser le device d\u2019usage",
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentDefault,
  });
  deviceSection.appendChild(deviceLabel);

  const deviceRow = createWrapRow("Devices");
  for (const d of DEVICES) {
    deviceRow.appendChild(createDeviceBadge(d.emoji, d.label, hexToRgb(d.color)));
  }
  deviceSection.appendChild(deviceRow);
  parent.appendChild(deviceSection);

  // ── 6. Link buttons ──
  const linksSection = createToolkitSectionFrame("Links Section");
  const linksLabel = createText({
    text: "Ajouter des liens vers vos documents, ateliers, prototypes...",
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentDefault,
  });
  linksSection.appendChild(linksLabel);

  const linksGrid = createWrapRow("Links Grid");
  for (const l of LINKS) {
    linksGrid.appendChild(createLinkButton(l.cat, l.label, hexToRgb(l.color)));
  }
  linksSection.appendChild(linksGrid);
  parent.appendChild(linksSection);
}
