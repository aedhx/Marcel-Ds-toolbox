// ── Delivery Stamp (EXPORT-01, spec §2) ──
//
// Generates the in-file "badge" frame that objectifies a delivery at the "Je
// livre" gate. The badge is AGGREGATE-ONLY (DS score, profile/threshold, legacy
// debt %, a11y completeness, file · page, date) — it NEVER contains design
// content or nominative data, and nothing leaves the file (privacy constraint).
//
// Reuses the shared DS builder helpers (createFrame/createText/solidFill/
// addShadow) and DS tokens, exactly like the starter-kit builders. Errors
// propagate to main.ts per convention (no try/catch here).

import { colors, spacing, borderRadius } from "../../shared/tokens";
import {
  createFrame,
  createText,
  solidFill,
  addShadow,
  loadAllFonts,
} from "../../shared/figma-helpers";
import { STARTER_KIT_PAGES } from "../starter-kit/config";

const COVER_PAGE_NAME = STARTER_KIT_PAGES[0].name;

// Standard name of the generated badge frame. Also used to find + replace a
// previous stamp so re-delivering does not stack duplicate badges.
const STAMP_FRAME_NAME = "Marcel — Livraison Quality Check";

// Aggregate-only payload for the badge. NO node references, colors, or any
// design content are ever added here (privacy — threat T-052-11).
export interface DeliveryStampData {
  dsScore: number;
  pass: boolean;
  profileLabel: string;
  threshold: number;
  legacyDebtPercent: number;
  a11yComplete: boolean;
  fileName: string;
  pageName: string;
  date: string;
}

/**
 * Resolve the page the stamp should live on: a "Livraison"/"Delivery" page if
 * present, else the Cover page, else the current page. The target page is loaded
 * async first (dynamic-page manifest) before its children are read.
 */
async function resolveStampPage(): Promise<PageNode> {
  const pages = figma.root.children;

  const deliveryPage = pages.find((p) => {
    const n = p.name.toLowerCase();
    return n.indexOf("livraison") !== -1 || n.indexOf("delivery") !== -1;
  });
  if (deliveryPage) {
    await deliveryPage.loadAsync();
    return deliveryPage;
  }

  const coverPage = pages.find((p) => p.name === COVER_PAGE_NAME);
  if (coverPage) {
    await coverPage.loadAsync();
    return coverPage;
  }

  await figma.currentPage.loadAsync();
  return figma.currentPage;
}

/** One "label : value" row inside the badge body. */
function createStampRow(label: string, value: string): FrameNode {
  const row = createFrame({
    name: label,
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "HORIZONTAL",
    itemSpacing: spacing.s,
    counterAxisSizingMode: "AUTO",
    primaryAxisSizingMode: "AUTO",
  });
  row.counterAxisAlignItems = "CENTER";

  const labelText = createText({
    text: label,
    fontSize: 13,
    fontStyle: "Medium",
    color: colors.contentSubtler,
  });
  row.appendChild(labelText);

  const valueText = createText({
    text: value,
    fontSize: 13,
    fontStyle: "Bold",
    color: colors.contentDefault,
  });
  row.appendChild(valueText);

  return row;
}

/**
 * Build (or replace) the in-file, aggregate-only delivery badge frame.
 * Pass → green header/border (colors.success); fail → red (colors.error).
 */
export async function generateDeliveryStamp(data: DeliveryStampData): Promise<void> {
  await loadAllFonts();

  const page = await resolveStampPage();

  // Replace any previous stamp so re-delivering updates in place (no stacking).
  const previous = page.findChild((n) => n.name === STAMP_FRAME_NAME);
  if (previous) previous.remove();

  const accent = data.pass ? colors.success : colors.error;

  // ── Outer badge frame (auto-layout, DS radius + drop shadow) ──
  const badge = createFrame({
    name: STAMP_FRAME_NAME,
    width: 420,
    height: 1,
    fills: solidFill(colors.backgroundDefault),
    cornerRadius: borderRadius.l,
    layoutMode: "VERTICAL",
    itemSpacing: spacing.m,
    paddingTop: 0,
    paddingBottom: spacing.xl,
    paddingLeft: 0,
    paddingRight: 0,
    primaryAxisSizingMode: "AUTO",
    counterAxisSizingMode: "FIXED",
    clipsContent: true,
  });
  badge.strokes = solidFill(accent);
  badge.strokeWeight = 2;
  addShadow(badge);

  // ── Colored header band (green pass / red fail) ──
  const header = createFrame({
    name: "Header",
    width: 1,
    height: 1,
    fills: solidFill(accent),
    layoutMode: "VERTICAL",
    itemSpacing: spacing["2xs"],
    paddingTop: spacing.l,
    paddingBottom: spacing.l,
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    primaryAxisSizingMode: "AUTO",
    counterAxisSizingMode: "FIXED",
  });
  header.layoutAlign = "STRETCH";

  const title = createText({
    text: "Livraison — Quality Check",
    fontSize: 18,
    fontStyle: "Bold",
    color: colors.white,
  });
  header.appendChild(title);

  const scoreLine = createText({
    text:
      "Conformité DS " +
      data.dsScore +
      "/100 " +
      (data.pass ? "✓" : "✗") +
      " (seuil " +
      data.threshold +
      ")",
    fontSize: 14,
    fontStyle: "Medium",
    color: colors.white,
  });
  header.appendChild(scoreLine);

  badge.appendChild(header);

  // ── Body rows (aggregate fields only) ──
  const body = createFrame({
    name: "Body",
    width: 1,
    height: 1,
    fills: [],
    layoutMode: "VERTICAL",
    itemSpacing: spacing.s,
    paddingTop: spacing.m,
    paddingBottom: 0,
    paddingLeft: spacing.xl,
    paddingRight: spacing.xl,
    primaryAxisSizingMode: "AUTO",
    counterAxisSizingMode: "FIXED",
  });
  body.layoutAlign = "STRETCH";

  body.appendChild(
    createStampRow(
      "Statut",
      data.pass ? "Livrable ✓" : "Sous le seuil ✗"
    )
  );
  body.appendChild(
    createStampRow("Profil", data.profileLabel + " (≥ " + data.threshold + ")")
  );
  body.appendChild(
    createStampRow("Dette legacy", data.legacyDebtPercent + "%")
  );
  body.appendChild(
    createStampRow(
      "Accessibilité",
      data.a11yComplete ? "Complète" : "Incomplète"
    )
  );
  body.appendChild(
    createStampRow("Fichier · Page", data.fileName + " · " + data.pageName)
  );
  body.appendChild(createStampRow("Date", data.date));

  badge.appendChild(body);

  // ── Position near the top-left of the page, offset from existing content ──
  const others = page.children.filter((n) => n !== badge);
  if (others.length > 0) {
    let minX = Infinity;
    let minY = Infinity;
    for (const n of others) {
      if (n.x < minX) minX = n.x;
      if (n.y < minY) minY = n.y;
    }
    badge.x = minX;
    badge.y = minY - badge.height - spacing["4xl"];
  } else {
    badge.x = 0;
    badge.y = 0;
  }

  page.appendChild(badge);

  // Surface it so the designer sees the result immediately.
  figma.currentPage = page;
  figma.viewport.scrollAndZoomIntoView([badge]);
}
