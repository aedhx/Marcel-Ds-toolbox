import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  solidFill,
  addShadow,
  importAndCreateInstance,
} from "../../../shared/figma-helpers";
import { OVERVIEW_SECTIONS, DS_COMPONENT_KEYS } from "../config";

function createBulletText(text: string, width: number): TextNode {
  const node = createText({
    text: `\u2022  ${text}`,
    fontSize: 14,
    fontStyle: "Regular",
    color: colors.contentSubtle,
    width,
    lineHeight: 22,
  });
  return node;
}

function createSectionBlock(
  section: (typeof OVERVIEW_SECTIONS)[number],
  contentWidth: number
): FrameNode {
  const block = createFrame({
    name: `Section - ${section.title}`,
    width: contentWidth,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    itemSpacing: spacing.s,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  block.primaryAxisSizingMode = "AUTO";
  block.counterAxisSizingMode = "FIXED";
  block.layoutAlign = "STRETCH";

  // Section heading with emoji
  const heading = createText({
    text: `${section.emoji}  ${section.title}`,
    fontSize: 20,
    fontStyle: "Bold",
    color: colors.contentDefault,
    width: contentWidth,
    lineHeight: 28,
  });
  heading.layoutAlign = "STRETCH";
  block.appendChild(heading);

  // Bullets
  for (const bullet of section.bullets) {
    const bulletNode = createBulletText(bullet, contentWidth);
    bulletNode.layoutAlign = "STRETCH";
    block.appendChild(bulletNode);
  }

  return block;
}

export async function buildOverview(page: PageNode): Promise<void> {
  // Try importing real DS component ([Delivery] Overview rework - Light)
  const instance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.deliveryOverviewLight,
    page
  );
  if (instance) {
    return;
  }

  // ── Fallback: build programmatically ──
  const cardWidth = 960;
  const cardPadding = spacing["4xl"];
  const contentWidth = cardWidth - cardPadding * 2;

  // Outer card frame
  const card = createFrame({
    name: "Initiative Overview",
    width: cardWidth,
    height: 1,
    fills: solidFill(colors.backgroundDefault),
    cornerRadius: borderRadius.l,
    layoutMode: "VERTICAL",
    paddingTop: cardPadding,
    paddingBottom: cardPadding,
    paddingLeft: cardPadding,
    paddingRight: cardPadding,
    itemSpacing: spacing["2xl"],
  });
  card.primaryAxisSizingMode = "AUTO";
  addShadow(card);

  // Header row with emoji and title
  const headerRow = createFrame({
    name: "Header",
    width: contentWidth,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.m,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  headerRow.primaryAxisSizingMode = "AUTO";
  headerRow.counterAxisSizingMode = "AUTO";
  headerRow.counterAxisAlignItems = "CENTER";
  headerRow.layoutAlign = "STRETCH";

  const headerEmoji = createText({
    text: "\u{1F4CB}",
    fontSize: 32,
    fontStyle: "Regular",
    color: colors.contentDefault,
  });
  headerRow.appendChild(headerEmoji);

  const title = createText({
    text: "Initiative Overview",
    fontSize: 32,
    fontStyle: "Bold",
    color: colors.contentDefault,
    lineHeight: 40,
  });
  headerRow.appendChild(title);
  card.appendChild(headerRow);

  // Divider
  const divider = createFrame({
    name: "Divider",
    width: contentWidth,
    height: 1,
    fills: solidFill(colors.borderDefault),
  });
  divider.layoutAlign = "STRETCH";
  card.appendChild(divider);

  // Sections in a 2-column grid
  const grid = createFrame({
    name: "Sections Grid",
    width: contentWidth,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing["2xl"],
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  grid.primaryAxisSizingMode = "FIXED";
  grid.counterAxisSizingMode = "AUTO";
  grid.layoutAlign = "STRETCH";
  grid.layoutWrap = "WRAP";

  const colWidth = (contentWidth - spacing["2xl"]) / 2;

  for (const section of OVERVIEW_SECTIONS) {
    const sectionBlock = createSectionBlock(section, colWidth);
    sectionBlock.counterAxisSizingMode = "FIXED";
    sectionBlock.resize(colWidth, sectionBlock.height);
    grid.appendChild(sectionBlock);
  }

  card.appendChild(grid);

  page.appendChild(card);
}
