import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  solidFill,
  importAndCreateInstance,
} from "../../../shared/figma-helpers";
import { DS_COMPONENT_KEYS } from "../config";

interface SectionDef {
  name: string;
  subtitleText: string;
  bodyText: string;
  componentFrameCount: number;
  subsections?: { name: string; color: string }[];
}

const SECTIONS: SectionDef[] = [
  {
    name: "Atoms",
    subtitleText: "This is a subtitle",
    bodyText: "This is a body text",
    componentFrameCount: 5,
  },
  {
    name: "Components",
    subtitleText: "This is a subtitle",
    bodyText: "This is a body text",
    componentFrameCount: 3,
  },
  {
    name: "Specs",
    subtitleText: "This is a subtitle",
    bodyText: "This is a body text",
    componentFrameCount: 2,
  },
  {
    name: "Usecases",
    subtitleText: "This is a subtitle",
    bodyText: "This is a body text",
    componentFrameCount: 0,
    subsections: [
      { name: "Do", color: "#15803D" },
      { name: "Avoid", color: "#CA8A04" },
      { name: "Dont", color: "#DC2626" },
      { name: "Information", color: "#2563EB" },
    ],
  },
  {
    name: "Deprecated",
    subtitleText: "",
    bodyText: "",
    componentFrameCount: 1,
  },
];

function hex(h: string): RGB {
  const c = h.replace("#", "");
  return {
    r: parseInt(c.substring(0, 2), 16) / 255,
    g: parseInt(c.substring(2, 4), 16) / 255,
    b: parseInt(c.substring(4, 6), 16) / 255,
  };
}

function createHeaderFallback(title: string, width: number): FrameNode {
  const header = createFrame({
    name: "[DS] Header",
    width,
    height: 224,
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

  const titleNode = createText({
    text: title,
    fontSize: 56,
    fontStyle: "Bold",
    color: { r: 1, g: 1, b: 1 },
    lineHeight: 72,
  });
  header.appendChild(titleNode);

  return header;
}

function createComponentFrame(width: number, containerHeight: number = 156): FrameNode {
  const outer = createFrame({
    name: "Component Frame",
    width,
    height: 1,
    fills: solidFill(hex("#F7F7F7")),
    cornerRadius: 24,
    layoutMode: "VERTICAL",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
  });
  outer.primaryAxisSizingMode = "AUTO";
  outer.counterAxisSizingMode = "FIXED";
  outer.layoutAlign = "STRETCH";

  const inner = createFrame({
    name: "Container",
    width: 1,
    height: 1,
    fills: solidFill({ r: 1, g: 1, b: 1 }),
    cornerRadius: 16,
    layoutMode: "VERTICAL",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
    itemSpacing: 24,
  });
  inner.primaryAxisSizingMode = "AUTO";
  inner.counterAxisSizingMode = "FIXED";
  inner.layoutAlign = "STRETCH";

  const nameLabel = createText({
    text: "This is a component name",
    fontSize: 24,
    fontStyle: "Bold",
    color: hex("#454545"),
    lineHeight: 32,
  });
  inner.appendChild(nameLabel);

  const sep = createFrame({
    name: "separator",
    width: 1,
    height: 1,
    fills: solidFill(hex("#E5E5E5")),
  });
  sep.layoutAlign = "STRETCH";
  inner.appendChild(sep);

  const container = createFrame({
    name: "Container",
    width: 1,
    height: containerHeight,
    fills: [],
  });
  container.layoutAlign = "STRETCH";
  inner.appendChild(container);

  outer.appendChild(inner);
  return outer;
}

function createUsecaseSubsection(name: string, borderColor: string, width: number): FrameNode {
  const frame = createFrame({
    name,
    width,
    height: 224,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.layoutAlign = "STRETCH";

  // Colored top border
  const topBorder = createFrame({
    name: "Border",
    width,
    height: 4,
    fills: solidFill(hex(borderColor)),
  });
  topBorder.layoutAlign = "STRETCH";
  frame.appendChild(topBorder);

  const inner = createFrame({
    name: "Container",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    paddingTop: 48,
    paddingBottom: 48,
    paddingLeft: 48,
    paddingRight: 48,
  });
  inner.primaryAxisSizingMode = "FIXED";
  inner.counterAxisSizingMode = "AUTO";
  inner.layoutAlign = "STRETCH";
  inner.primaryAxisAlignItems = "CENTER";
  inner.counterAxisAlignItems = "CENTER";

  const label = createText({
    text: `${name} component`,
    fontSize: 24,
    fontStyle: "Bold",
    color: hex("#454545"),
    lineHeight: 32,
  });
  inner.appendChild(label);

  frame.appendChild(inner);
  return frame;
}

async function buildSection(
  sectionDef: SectionDef,
  page: PageNode,
  xOffset: number
): Promise<void> {
  const sectionWidth = sectionDef.name === "Specs" ? 1472 : 1440;

  const section = createFrame({
    name: sectionDef.name,
    width: sectionWidth,
    height: 1,
    x: xOffset,
    y: -1624,
    fills: solidFill(hex("#F5FAFF")),
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    itemSpacing: 0,
  });
  section.primaryAxisSizingMode = "AUTO";
  section.counterAxisSizingMode = "FIXED";

  // [DS] Header
  const headerInstance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.dsHeaderBlackL,
    section
  );
  if (!headerInstance) {
    const headerFallback = createHeaderFallback(sectionDef.name, sectionWidth);
    section.appendChild(headerFallback);
  }

  // Content area
  const content = createFrame({
    name: sectionDef.name,
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

  // Subtitle
  if (sectionDef.subtitleText) {
    const subtitleInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsSubtitle,
      content
    );
    if (!subtitleInstance) {
      const subtitle = createText({
        text: sectionDef.subtitleText,
        fontSize: 32,
        fontStyle: "Bold",
        color: colors.contentDefault,
        lineHeight: 40,
      });
      subtitle.layoutAlign = "STRETCH";
      content.appendChild(subtitle);
    }
  }

  // Body
  if (sectionDef.bodyText) {
    const bodyInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsBody,
      content
    );
    if (!bodyInstance) {
      const body = createText({
        text: sectionDef.bodyText,
        fontSize: 20,
        fontStyle: "Bold",
        color: hex("#696969"),
        lineHeight: 24,
      });
      body.layoutAlign = "STRETCH";
      content.appendChild(body);
    }
  }

  // Usecase subsections
  if (sectionDef.subsections) {
    for (const sub of sectionDef.subsections) {
      const subsection = createUsecaseSubsection(sub.name, sub.color, sectionWidth - 200);
      content.appendChild(subsection);
    }
  }

  // Component frames
  for (let i = 0; i < sectionDef.componentFrameCount; i++) {
    const cf = createComponentFrame(sectionWidth - 200);
    content.appendChild(cf);
  }

  section.appendChild(content);
  page.appendChild(section);
}

export async function buildComponentPage(page: PageNode): Promise<void> {
  // [DS] Component Card at far left
  const cardInstance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.dsComponentCard,
    page,
    { x: -4566, y: -1624 }
  );

  if (!cardInstance) {
    const placeholder = createFrame({
      name: "[DS] Component Card",
      width: 1440,
      height: 977,
      x: -4566,
      y: -1624,
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
      text: "[DS] Component Card\n\nCe composant sera import\u00e9 automatiquement depuis la librairie DS Toolkit.",
      fontSize: 24,
      fontStyle: "Regular",
      color: colors.contentSubtle,
      width: 1340,
      lineHeight: 32,
    });
    placeholder.appendChild(label);
    page.appendChild(placeholder);
  }

  // Build sections at matching X offsets
  const sectionOffsets = [
    { index: 0, x: -2726 },  // Atoms
    { index: 1, x: -886 },   // Components
    { index: 2, x: 954 },    // Specs
    { index: 3, x: 2826 },   // Usecases
    { index: 4, x: 4666 },   // Deprecated
  ];

  for (const { index, x } of sectionOffsets) {
    await buildSection(SECTIONS[index], page, x);
  }
}
