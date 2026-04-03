import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  createRect,
  solidFill,
  addShadow,
} from "../../../shared/figma-helpers";
import { HELP_CONTENT } from "../config";
import { buildToolkitContent } from "./toolkit-section-builder";

// ── Main builder ──

export async function buildHelp(page: PageNode): Promise<void> {
  const sectionWidth = 2770;
  const sectionPadding = spacing["4xl"];
  const contentWidth = sectionWidth - sectionPadding * 2;

  // ── Main section container (green background like Figma) ──
  const section = createFrame({
    name: "Comment bien organiser son delivery",
    width: sectionWidth,
    height: 1,
    fills: solidFill(colors.helpBackground),
    cornerRadius: borderRadius.xl,
    layoutMode: "VERTICAL",
    paddingTop: sectionPadding,
    paddingBottom: sectionPadding,
    paddingLeft: sectionPadding,
    paddingRight: sectionPadding,
    itemSpacing: spacing["3xl"],
  });
  section.primaryAxisSizingMode = "AUTO";

  // ── Section title ──
  const mainTitle = createText({
    text: "Des exemples pour bien s\u2019organiser",
    fontSize: 36,
    fontStyle: "Bold",
    color: colors.contentDefault,
    width: contentWidth,
    lineHeight: 44,
  });
  mainTitle.layoutAlign = "STRETCH";
  section.appendChild(mainTitle);

  // ── Column headers row ──
  const headersRow = createFrame({
    name: "Headers",
    width: contentWidth,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing["3xl"],
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  headersRow.primaryAxisSizingMode = "FIXED";
  headersRow.counterAxisSizingMode = "AUTO";
  headersRow.layoutAlign = "STRETCH";

  const headerTitles = [
    "Documenter un user flow + lier un prototype",
    "D\u00e9cliner un \u00e9cran",
    "Sp\u00e9cifier un \u00e9cran",
    "Votre toolbox",
    "Documenter ses composants locaux",
  ];
  for (const h of headerTitles) {
    const headerText = createText({
      text: h,
      fontSize: 16,
      fontStyle: "Bold",
      color: colors.contentDefault,
      lineHeight: 22,
    });
    headersRow.appendChild(headerText);
  }
  section.appendChild(headersRow);

  // ── Toolkit card ──
  const toolkitWidth = contentWidth;
  const toolkit = createFrame({
    name: "Toolkit pour annoter ses parcours / \u00e9crans",
    width: toolkitWidth,
    height: 1,
    fills: solidFill(colors.helpBackgroundDark),
    cornerRadius: borderRadius.l,
    layoutMode: "VERTICAL",
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    paddingLeft: spacing["2xl"],
    paddingRight: spacing["2xl"],
    itemSpacing: spacing["2xl"],
  });
  toolkit.primaryAxisSizingMode = "AUTO";

  // Toolkit header
  const toolkitHeader = createText({
    text: "Toolkit pour annoter ses parcours / \u00e9crans",
    fontSize: 16,
    fontStyle: "Bold",
    color: colors.white,
    width: toolkitWidth - spacing["2xl"] * 2,
    lineHeight: 22,
  });
  toolkitHeader.layoutAlign = "STRETCH";
  toolkit.appendChild(toolkitHeader);

  // ── Toolkit content area (white) ──
  const toolkitContent = createFrame({
    name: "Toolkit Content",
    width: toolkitWidth - spacing["2xl"] * 2,
    height: 1,
    fills: solidFill(colors.helpBackground),
    cornerRadius: borderRadius.m,
    layoutMode: "VERTICAL",
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    paddingLeft: spacing["2xl"],
    paddingRight: spacing["2xl"],
    itemSpacing: spacing["2xl"],
  });
  toolkitContent.primaryAxisSizingMode = "AUTO";
  toolkitContent.layoutAlign = "STRETCH";

  // Build shared toolkit sections
  buildToolkitContent(toolkitContent);

  toolkit.appendChild(toolkitContent);
  section.appendChild(toolkit);

  // ── Warning footer ──
  const warningText = createText({
    text: "\u26A0\uFE0F pensez \u00e0 bien mettre les statuts des flows, \u00e9crans et annotations \u00e0 jour, au fur et \u00e0 mesure",
    fontSize: 20,
    fontStyle: "Medium",
    color: colors.contentDefault,
    width: contentWidth,
    lineHeight: 28,
  });
  warningText.layoutAlign = "STRETCH";
  section.appendChild(warningText);

  page.appendChild(section);

  // ── Also add the text help card for reference ──
  const cardWidth = 880;
  const cardPadding = spacing["4xl"];
  const cardContentWidth = cardWidth - cardPadding * 2;

  const card = createFrame({
    name: "Help Guide",
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
  card.x = 0;
  card.y = section.height + spacing["4xl"];
  addShadow(card);

  const cardTitle = createText({
    text: HELP_CONTENT.title,
    fontSize: 28,
    fontStyle: "Bold",
    color: colors.contentDefault,
    width: cardContentWidth,
    lineHeight: 36,
  });
  cardTitle.layoutAlign = "STRETCH";
  card.appendChild(cardTitle);

  const divider = createFrame({
    name: "Divider",
    width: cardContentWidth,
    height: 1,
    fills: solidFill(colors.borderDefault),
  });
  divider.layoutAlign = "STRETCH";
  card.appendChild(divider);

  for (const helpSection of HELP_CONTENT.sections) {
    const sectionFrame = createFrame({
      name: `Help - ${helpSection.heading}`,
      width: cardContentWidth,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      itemSpacing: spacing.s,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
    });
    sectionFrame.primaryAxisSizingMode = "AUTO";
    sectionFrame.counterAxisSizingMode = "FIXED";
    sectionFrame.layoutAlign = "STRETCH";

    const heading = createText({
      text: helpSection.heading,
      fontSize: 18,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: cardContentWidth,
      lineHeight: 26,
    });
    heading.layoutAlign = "STRETCH";
    sectionFrame.appendChild(heading);

    const body = createText({
      text: helpSection.body,
      fontSize: 14,
      fontStyle: "Regular",
      color: colors.contentSubtle,
      width: cardContentWidth,
      lineHeight: 22,
    });
    body.layoutAlign = "STRETCH";
    sectionFrame.appendChild(body);

    card.appendChild(sectionFrame);
  }

  const footer = createText({
    text: "Ce guide fait partie du Marcel Design System. Pour toute question, contacte l\u2019\u00e9quipe DesignOps.",
    fontSize: 12,
    fontStyle: "Regular",
    color: colors.contentSubtler,
    width: cardContentWidth,
    lineHeight: 18,
  });
  footer.layoutAlign = "STRETCH";
  card.appendChild(footer);

  page.appendChild(card);
}
