import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  solidFill,
  importAndCreateInstance,
} from "../../../shared/figma-helpers";
import { DS_COMPONENT_KEYS } from "../config";

// Checklist data matching the real DS Library starter kit
const CHECKLIST_SECTIONS = [
  {
    heading: "Starter",
    items: [
      "Duplicate the **Figma library starter kit**",
      "Name your libraries using the **following convention [DS][DEVICE][TEAM] Name** (ex : [DS][APP][RETAIL FR] Product Listing)",
      "Update my cover **with all the necessary informations** (Library name, country, device)",
      "Update the \u{1F469}\u200D\u{1F4BB} **Contributors** page with the people working on the library",
    ],
  },
  {
    heading: "Components organization",
    items: [
      "Name it properly and **the same in designers' libraries as developers'** ones. ( https://component.gallery / https://designsystems.surf/)",
      "Complete the **[DS] Description Component Card** description (Use description from other design system)",
      "Change the **status** in the **[DS] Description Component Card** description (Use description from other design system)",
      "Organize components in **dedicated sections** (atoms, components, specs, usecase)",
      "I'v **annotated my variants / components** with [DS] Toolkit libraries",
      "Generate **EightShapes Specs** with the Figma Plugin and place it the the specs section",
    ],
  },
  {
    heading: "Documentation",
    items: [
      "Add Link to **Zeroheight Documentation** in the Component Description (If it exists)",
      "Add Link to **Storybook** (If it exists)",
      "Display **Use Case and Examples**",
      "Display **UX Writing rules**",
    ],
  },
];

function createCheckboxRow(text: string, width: number): FrameNode {
  const row = createFrame({
    name: "Checkbox Row",
    width,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: spacing.l,
  });
  row.primaryAxisSizingMode = "FIXED";
  row.counterAxisSizingMode = "AUTO";
  row.layoutAlign = "STRETCH";
  row.counterAxisAlignItems = "MIN";

  // Checkbox placeholder (empty square)
  const checkbox = createFrame({
    name: "Checkbox",
    width: 32,
    height: 32,
    fills: solidFill({ r: 1, g: 1, b: 1 }),
    cornerRadius: 4,
  });
  checkbox.strokes = solidFill({ r: 0.85, g: 0.85, b: 0.85 });
  checkbox.strokeWeight = 1.333;
  row.appendChild(checkbox);

  // Text (strip markdown bold markers for Figma text)
  const cleanText = text.replace(/\*\*/g, "");
  const label = createText({
    text: cleanText,
    fontSize: 24,
    fontStyle: "Regular",
    color: colors.contentDefault,
    width: width - 32 - spacing.l,
    lineHeight: 32,
  });
  label.layoutAlign = "INHERIT";
  row.appendChild(label);

  return row;
}

function createSectionHeader(text: string, width: number): FrameNode {
  const header = createFrame({
    name: "Section Header",
    width,
    height: 1,
    fills: solidFill({ r: 0.957, g: 0.957, b: 0.957 }), // #f4f4f4
    cornerRadius: borderRadius.m,
    layoutMode: "VERTICAL",
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
  });
  header.primaryAxisSizingMode = "AUTO";
  header.counterAxisSizingMode = "FIXED";
  header.layoutAlign = "STRETCH";
  header.clipsContent = true;

  const label = createText({
    text,
    fontSize: 24,
    fontStyle: "Bold",
    color: { r: 0.22, g: 0.235, b: 0.255 }, // #383c41
    lineHeight: 32,
  });
  header.appendChild(label);

  return header;
}

export async function buildReadme(page: PageNode): Promise<void> {
  // Try importing the real DS Checklist (Subject=Figma Libraries)
  const instance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.checklistFigmaLibraries,
    page
  );
  if (instance) {
    return;
  }

  // Fallback: build programmatically matching the real design
  const cardWidth = 1386;

  const card = createFrame({
    name: "Checklist",
    width: cardWidth,
    height: 1,
    fills: solidFill({ r: 1, g: 1, b: 1 }),
    cornerRadius: borderRadius.m,
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: 0,
    clipsContent: true,
  });
  card.primaryAxisSizingMode = "AUTO";
  card.strokes = solidFill({ r: 0.85, g: 0.85, b: 0.85 });
  card.strokeWeight = 1;

  // Blue header
  const header = createFrame({
    name: "Title",
    width: cardWidth,
    height: 1,
    fills: solidFill({ r: 0.035, g: 0.439, b: 0.902 }), // #0970e6
    layoutMode: "HORIZONTAL",
    paddingTop: spacing["4xl"],
    paddingBottom: spacing["4xl"],
    paddingLeft: spacing["4xl"],
    paddingRight: spacing["4xl"],
    itemSpacing: spacing["4xl"],
  });
  header.primaryAxisSizingMode = "FIXED";
  header.counterAxisSizingMode = "AUTO";
  header.layoutAlign = "STRETCH";
  header.counterAxisAlignItems = "CENTER";
  header.primaryAxisAlignItems = "CENTER";

  // Content column (title + subtitle)
  const contentCol = createFrame({
    name: "Content",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: spacing.l,
  });
  contentCol.primaryAxisSizingMode = "AUTO";
  contentCol.counterAxisSizingMode = "AUTO";

  const titleText = createText({
    text: "Figma Libraries",
    fontSize: 56,
    fontStyle: "Bold",
    color: { r: 1, g: 1, b: 1 },
    lineHeight: 64,
  });
  contentCol.appendChild(titleText);

  const subtitleText = createText({
    text: "This checklist will help you to manage your local figma libraries",
    fontSize: 24,
    fontStyle: "Regular",
    color: { r: 1, g: 1, b: 1 },
    width: 856,
    lineHeight: 32,
  });
  contentCol.appendChild(subtitleText);

  header.appendChild(contentCol);

  // Marcel branding placeholder in header
  const marcelBrand = createText({
    text: "marcel",
    fontSize: 32,
    fontStyle: "Bold",
    color: { r: 1, g: 1, b: 1 },
  });
  header.appendChild(marcelBrand);

  card.appendChild(header);

  // Checklist body
  const body = createFrame({
    name: "Checklist",
    width: cardWidth,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: spacing["4xl"],
    paddingBottom: spacing["4xl"],
    paddingLeft: spacing["4xl"],
    paddingRight: spacing["4xl"],
    itemSpacing: 24,
  });
  body.primaryAxisSizingMode = "AUTO";
  body.counterAxisSizingMode = "FIXED";
  body.layoutAlign = "STRETCH";

  const contentWidth = cardWidth - spacing["4xl"] * 2;

  for (const section of CHECKLIST_SECTIONS) {
    const sectionHeader = createSectionHeader(section.heading, contentWidth);
    body.appendChild(sectionHeader);

    for (const item of section.items) {
      const row = createCheckboxRow(item, contentWidth);
      body.appendChild(row);
    }
  }

  card.appendChild(body);
  page.appendChild(card);
}
