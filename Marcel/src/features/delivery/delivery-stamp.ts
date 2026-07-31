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

  // D-01/1: place the stamp where the designer is working — on the CURRENT page,
  // next to the selection if any, else at the top-left of the page. Capture the
  // selection BEFORE removing a stale stamp so an old badge isn't targeted.
  const selection = figma.currentPage.selection;

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

  // WR-07: only NOW — with the new badge fully built — remove any previous stamp
  // so re-delivering updates in place (no stacking). A throw during construction
  // above therefore leaves the existing badge intact. The `others` filter below
  // then naturally excludes the just-removed old badge.
  const previous = figma.currentPage.findChild((n) => n.name === STAMP_FRAME_NAME);
  if (previous) previous.remove();

  // Append first so the badge is a top-level page child — its .x/.y are then
  // page-absolute and align with absoluteBoundingBox for selection placement.
  figma.currentPage.appendChild(badge);

  // ── Position (D-01/1) ──
  const margin = spacing["4xl"];
  if (selection.length > 0 && selection[0].absoluteBoundingBox) {
    // Next to the selected frame: to its RIGHT, top-aligned.
    const box = selection[0].absoluteBoundingBox;
    badge.x = box.x + box.width + margin;
    badge.y = box.y;
  } else {
    // No usable selection: top-left, above existing content on the current page.
    const others = figma.currentPage.children.filter((n) => n !== badge);
    if (others.length > 0) {
      let minX = Infinity;
      let minY = Infinity;
      for (const n of others) {
        if (n.x < minX) minX = n.x;
        if (n.y < minY) minY = n.y;
      }
      badge.x = minX;
      badge.y = minY - badge.height - margin;
    } else {
      badge.x = 0;
      badge.y = 0;
    }
  }

  // Already on the current page — just surface it to the designer.
  figma.viewport.scrollAndZoomIntoView([badge]);
}
