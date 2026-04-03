import { colors, borderRadius, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  createRect,
  solidFill,
  addShadow,
  importAndCreateInstance,
} from "../../../shared/figma-helpers";
import { DS_COMPONENT_KEYS } from "../config";

function createScreenPlaceholder(
  name: string,
  width: number,
  height: number
): FrameNode {
  const frame = createFrame({
    name,
    width,
    height,
    fills: solidFill(colors.backgroundSubtle),
    cornerRadius: borderRadius.m,
    layoutMode: "VERTICAL",
    paddingTop: spacing.m,
    paddingBottom: spacing.m,
    paddingLeft: spacing.m,
    paddingRight: spacing.m,
    itemSpacing: spacing.xs,
  });
  frame.primaryAxisSizingMode = "FIXED";
  frame.counterAxisSizingMode = "FIXED";
  frame.primaryAxisAlignItems = "CENTER";
  frame.counterAxisAlignItems = "CENTER";
  addShadow(frame);

  const label = createText({
    text: name,
    fontSize: 12,
    fontStyle: "Regular",
    color: colors.contentSubtler,
  });
  frame.appendChild(label);

  return frame;
}

export async function buildDelivery(page: PageNode): Promise<void> {
  const pageWidth = 1400;

  // Root container
  const container = createFrame({
    name: "Delivery Template",
    width: pageWidth,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    itemSpacing: spacing["3xl"],
    paddingTop: spacing["2xl"],
    paddingBottom: spacing["2xl"],
    paddingLeft: 0,
    paddingRight: 0,
  });
  container.primaryAxisSizingMode = "AUTO";

  // ── [Delivery] Header: try importing real DS component (Black, M) ──
  const headerInstance = await importAndCreateInstance(
    DS_COMPONENT_KEYS.deliveryHeaderBlackM,
    container
  );
  if (!headerInstance) {
    // Fallback: programmatic [Delivery] Header matching the real design
    // Dark background, Poppins Bold 80px, with Design Status pill
    const headerFrame = createFrame({
      name: "[Delivery] Header",
      width: pageWidth,
      height: 1,
      fills: solidFill(colors.backgroundReversed),
      cornerRadius: 24,
      layoutMode: "HORIZONTAL",
      paddingTop: 88,
      paddingBottom: 88,
      paddingLeft: 112,
      paddingRight: 112,
      itemSpacing: spacing.xl,
    });
    headerFrame.primaryAxisSizingMode = "FIXED";
    headerFrame.counterAxisSizingMode = "AUTO";
    headerFrame.layoutAlign = "STRETCH";
    headerFrame.counterAxisAlignItems = "CENTER";

    const flowTitle = createText({
      text: "Titre du user flow",
      fontSize: 80,
      fontStyle: "Bold",
      color: colors.white,
      lineHeight: 72,
    });
    headerFrame.appendChild(flowTitle);

    // Design Status pill
    const designStatus = createFrame({
      name: "Design Status",
      width: 1,
      height: 1,
      fills: solidFill({ r: 0.922, g: 0.922, b: 0.922 }), // #ebebeb
      cornerRadius: borderRadius.rounded,
      layoutMode: "HORIZONTAL",
      paddingTop: spacing.s,
      paddingBottom: spacing.s,
      paddingLeft: spacing.xl,
      paddingRight: spacing.xl,
      itemSpacing: spacing.s,
    });
    designStatus.primaryAxisSizingMode = "AUTO";
    designStatus.counterAxisSizingMode = "AUTO";
    designStatus.clipsContent = true;

    const statusEmoji = createText({
      text: "\u{1F440}",
      fontSize: 32,
      fontStyle: "Regular",
      color: colors.contentDefault,
      lineHeight: 40,
    });
    designStatus.appendChild(statusEmoji);

    const statusLabel = createText({
      text: "Design Not Started",
      fontSize: 20,
      fontStyle: "Bold",
      color: colors.contentDefault,
      lineHeight: 24,
    });
    designStatus.appendChild(statusLabel);

    headerFrame.appendChild(designStatus);
    container.appendChild(headerFrame);
  }

  // ── Storyboard row of placeholder screens ──
  const storyboardRow = createFrame({
    name: "Storyboard",
    width: pageWidth,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.xl,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  storyboardRow.primaryAxisSizingMode = "AUTO";
  storyboardRow.counterAxisSizingMode = "AUTO";
  storyboardRow.layoutAlign = "STRETCH";

  const screenNames = [
    "\u00c9cran 1 — Accueil",
    "\u00c9cran 2 — D\u00e9tail",
    "\u00c9cran 3 — Action",
    "\u00c9cran 4 — Confirmation",
  ];
  for (const screenName of screenNames) {
    const screen = createScreenPlaceholder(screenName, 320, 480);
    storyboardRow.appendChild(screen);
  }
  container.appendChild(storyboardRow);

  // ── Divider ──
  const divider = createFrame({
    name: "Divider",
    width: pageWidth,
    height: 1,
    fills: solidFill(colors.borderDefault),
  });
  divider.layoutAlign = "STRETCH";
  container.appendChild(divider);

  // ── Workspace section ──
  const workspaceHeader = createFrame({
    name: "Workspace Header",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.m,
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  workspaceHeader.primaryAxisSizingMode = "AUTO";
  workspaceHeader.counterAxisSizingMode = "AUTO";

  const workspaceLabel = createText({
    text: "WORKSPACE",
    fontSize: 14,
    fontStyle: "Bold",
    color: colors.contentSubtler,
    letterSpacing: 2,
  });
  workspaceHeader.appendChild(workspaceLabel);

  const workspaceHint = createText({
    text: "\u2014 Glisse tes maquettes ici pour commencer",
    fontSize: 14,
    fontStyle: "Regular",
    color: colors.contentSubtler,
  });
  workspaceHeader.appendChild(workspaceHint);

  container.appendChild(workspaceHeader);

  const workspace = createFrame({
    name: "Workspace Area",
    width: pageWidth,
    height: 600,
    fills: solidFill(colors.backgroundSubtle),
    cornerRadius: borderRadius.m,
  });
  workspace.layoutAlign = "STRETCH";

  // Dashed-style inner hint
  const pad = spacing["4xl"];
  const hintRect = createRect({
    name: "Drop zone",
    width: pageWidth - pad * 2,
    height: 600 - pad * 2,
    x: pad,
    y: pad,
    fills: [],
    cornerRadius: borderRadius.m,
  });
  hintRect.strokes = solidFill(colors.borderSubtle);
  hintRect.strokeWeight = 2;
  hintRect.dashPattern = [8, 8];

  const hintText = createText({
    text: "\u2795  D\u00e9pose tes \u00e9crans ici",
    fontSize: 16,
    fontStyle: "Medium",
    color: colors.contentSubtler,
  });
  hintText.x = pageWidth / 2 - 100;
  hintText.y = 300 - 10;

  workspace.appendChild(hintRect);
  workspace.appendChild(hintText);
  container.appendChild(workspace);

  page.appendChild(container);
}
