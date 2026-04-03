import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  solidFill,
  importAndCreateInstance,
} from "../../../shared/figma-helpers";
import { DS_COMPONENT_KEYS } from "../config";

function hex(h: string): RGB {
  const c = h.replace("#", "");
  return {
    r: parseInt(c.substring(0, 2), 16) / 255,
    g: parseInt(c.substring(2, 4), 16) / 255,
    b: parseInt(c.substring(4, 6), 16) / 255,
  };
}

function createComponentFrame(
  subtitleText: string,
  bodyText: string,
  componentNameText: string,
  width: number
): FrameNode {
  const frame = createFrame({
    name: "Component Frame",
    width,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    itemSpacing: 48,
  });
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";
  frame.layoutAlign = "STRETCH";

  // Subtitle
  const subtitle = createText({
    text: subtitleText,
    fontSize: 32,
    fontStyle: "Bold",
    color: colors.contentDefault,
    lineHeight: 40,
  });
  frame.appendChild(subtitle);

  // Body
  const body = createText({
    text: bodyText,
    fontSize: 20,
    fontStyle: "Bold",
    color: hex("#696969"),
    lineHeight: 24,
  });
  frame.appendChild(body);

  // Container with component name
  const container = createFrame({
    name: "Container",
    width: 1,
    height: 128,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
  });
  container.primaryAxisSizingMode = "FIXED";
  container.counterAxisSizingMode = "FIXED";
  container.layoutAlign = "STRETCH";

  const compName = createText({
    text: componentNameText,
    fontSize: 24,
    fontStyle: "Bold",
    color: hex("#454545"),
    lineHeight: 32,
  });
  container.appendChild(compName);
  frame.appendChild(container);

  return frame;
}

export async function buildLocalComponents(page: PageNode): Promise<void> {
  // [DS] Component Card on the left
  const cardInstance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.dsComponentCard,
    page,
    { x: -1258, y: -8023 }
  );

  if (!cardInstance) {
    // Minimal fallback
    const placeholder = createFrame({
      name: "[DS] Component Card",
      width: 1440,
      height: 716,
      x: -1258,
      y: -8023,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      cornerRadius: borderRadius.m,
      layoutMode: "VERTICAL",
      paddingTop: spacing["4xl"],
      paddingBottom: spacing["4xl"],
      paddingLeft: spacing["4xl"],
      paddingRight: spacing["4xl"],
      itemSpacing: spacing["4xl"],
    });
    placeholder.primaryAxisSizingMode = "AUTO";

    const label = createText({
      text: "[DS] Component Card\n\nCe composant sera import\u00e9 depuis la librairie DS Toolkit.",
      fontSize: 24,
      fontStyle: "Regular",
      color: colors.contentSubtle,
      width: 1340,
      lineHeight: 32,
    });
    placeholder.appendChild(label);
    page.appendChild(placeholder);
  }

  // Local Components template section
  const sectionWidth = 1440;
  const section = createFrame({
    name: "Local Components - Titre du composant",
    width: sectionWidth,
    height: 1,
    x: 300,
    y: -8023,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: 0,
  });
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "FIXED";

  // [DS] Header (dark)
  const headerInstance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.dsHeaderBlackL,
    section
  );
  if (!headerInstance) {
    const header = createFrame({
      name: "[DS] Header",
      width: sectionWidth,
      height: 232,
      fills: solidFill(hex("#121212")),
      cornerRadius: 24,
      layoutMode: "HORIZONTAL",
      paddingTop: 80,
      paddingBottom: 80,
      paddingLeft: 80,
      paddingRight: 80,
      itemSpacing: 16,
    });
    header.primaryAxisSizingMode = "FIXED";
    header.counterAxisSizingMode = "FIXED";
    header.counterAxisAlignItems = "CENTER";
    header.layoutAlign = "STRETCH";

    const titleText = createText({
      text: "Local Components \u2013 [Titre du composant]",
      fontSize: 56,
      fontStyle: "Bold",
      color: { r: 1, g: 1, b: 1 },
      lineHeight: 72,
    });
    header.appendChild(titleText);
    section.appendChild(header);
  }

  // Content area
  const content = createFrame({
    name: "Atoms",
    width: sectionWidth,
    height: 1,
    fills: solidFill({ r: 1, g: 1, b: 1 }),
    layoutMode: "VERTICAL",
    paddingTop: 100,
    paddingBottom: 100,
    paddingLeft: 100,
    paddingRight: 100,
    itemSpacing: 48,
  });
  content.primaryAxisSizingMode = "AUTO";
  content.counterAxisSizingMode = "FIXED";
  content.layoutAlign = "STRETCH";

  const contentWidth = sectionWidth - 200;

  // First component frame
  const cf1 = createComponentFrame(
    "Component",
    "Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.",
    "Component Title",
    contentWidth
  );
  content.appendChild(cf1);

  // "Hide from publishing" sign
  const signFrame = createFrame({
    name: "Sign",
    width: contentWidth,
    height: 40,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: 0,
  });
  signFrame.primaryAxisSizingMode = "FIXED";
  signFrame.counterAxisSizingMode = "FIXED";
  signFrame.layoutAlign = "STRETCH";
  signFrame.primaryAxisAlignItems = "CENTER";
  signFrame.counterAxisAlignItems = "CENTER";

  const signText = createText({
    text: "\u2193 Hide from publishing \u2193",
    fontSize: 20,
    fontStyle: "Regular",
    color: hex("#DC2626"),
    lineHeight: 40,
  });
  signFrame.appendChild(signText);
  content.appendChild(signFrame);

  // Second component frame (Assets)
  const cf2 = createComponentFrame(
    "Assets",
    "Use in component",
    "Properties",
    contentWidth
  );
  content.appendChild(cf2);

  section.appendChild(content);
  page.appendChild(section);
}
