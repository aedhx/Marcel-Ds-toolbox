import { colors, spacing } from "../../../shared/tokens";
import {
  createFrame,
  createText,
  solidFill,
} from "../../../shared/figma-helpers";

export async function buildArchives(page: PageNode): Promise<void> {
  const frame = createFrame({
    name: "Archives",
    width: 3244,
    height: 1,
    fills: solidFill({ r: 1, g: 1, b: 1 }),
    layoutMode: "VERTICAL",
    paddingTop: 254,
    paddingBottom: spacing["4xl"],
    paddingLeft: 222,
    paddingRight: 222,
    itemSpacing: 48,
  });
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "FIXED";

  // Title
  const titleFrame = createFrame({
    name: "Title",
    width: 2800,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
  });
  titleFrame.primaryAxisSizingMode = "AUTO";
  titleFrame.counterAxisSizingMode = "FIXED";
  titleFrame.layoutAlign = "STRETCH";

  const title = createText({
    text: "\u{1F578}\uFE0F Bienvenue dans les archives",
    fontSize: 64,
    fontStyle: "Bold",
    color: colors.contentDefault,
    width: 2800,
    lineHeight: 80,
  });
  title.layoutAlign = "STRETCH";
  titleFrame.appendChild(title);
  frame.appendChild(titleFrame);

  // Tips
  const tipsFrame = createFrame({
    name: "Tips",
    width: 2290,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: 255,
    paddingRight: 0,
    itemSpacing: 48,
  });
  tipsFrame.primaryAxisSizingMode = "AUTO";
  tipsFrame.counterAxisSizingMode = "FIXED";

  const tips = [
    "Organisez vos archives par section",
    "Expliquez rapidement pourquoi \u00e7a a \u00e9t\u00e9 plac\u00e9 ici",
    "Faites du tri, des fois il faut savoir dire au revoir \u{1F5D1}\uFE0F",
  ];

  for (const tip of tips) {
    const tipText = createText({
      text: tip,
      fontSize: 36,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: 2290,
      lineHeight: 44,
    });
    tipText.layoutAlign = "STRETCH";
    tipsFrame.appendChild(tipText);
  }

  frame.appendChild(tipsFrame);
  page.appendChild(frame);
}
