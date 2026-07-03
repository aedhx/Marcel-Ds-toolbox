// ── HS delivery checklist evaluator (spec §4, HS-01) ──
//
// File-hygiene / deliverable checklist. Detection is PAGE-LEVEL only: it reads
// `figma.root.children` page names + the Cover node/status — there is deliberately NO
// scene-node BFS here (page-name + cover-instance inspection only, per ./CLAUDE.md: no new
// traversal loops in feature modules).
//
// "Cover up to date" is the HARD GATE (surfaced as `coverUpToDate`, never a soft penalty —
// the Je livre gate enforces it). The other items apply the small penalties configured in
// scoring-config's HS_ITEMS, summed and clamped to HS_MAX_PENALTY. Every item id + penalty
// number is read from that ONE calibration module — nothing is hard-coded here.
//
// Errors propagate to main.ts (feature-module convention), EXCEPT a missing/absent cover,
// which is tolerated as `coverUpToDate = false` (mirrors cover-updater's missing-cover path).

import { HS_ITEMS, HS_MAX_PENALTY } from "../../shared/scoring-config";
import { STARTER_KIT_PAGES } from "../starter-kit/config";
import { loadCoverConfig } from "../cover-updater/cover-config";

const COVER_PAGE_NAME = STARTER_KIT_PAGES[0].name;

// Cover statuses that mean the cover is legacy/archived (NOT up to date). Every other
// status (In Progress / SOT / Design Done / Playground) counts as a fresh, up-to-date cover.
const LEGACY_COVER_STATUSES = new Set<string>(["Archived"]);

export interface HSChecklistItem {
  id: string;
  ok: boolean;
  penalty: number;
}

export interface HSChecklistResult {
  items: HSChecklistItem[];
  penalty: number;
  coverUpToDate: boolean;
}

/** Locate the Cover instance inside the "Cover" wrapper (mirrors cover-updater). */
function findCoverInstance(page: PageNode): InstanceNode | null {
  const wrapper = page.findChild(n => n.name === "Cover" && n.type === "FRAME") as FrameNode | null;
  if (wrapper) {
    const instance = wrapper.findChild(n => n.type === "INSTANCE") as InstanceNode | null;
    if (instance) return instance;
  }
  // Maybe the instance sits directly on the page (no wrapper).
  return page.findChild(n => n.type === "INSTANCE") as InstanceNode | null;
}

/**
 * Hard-gate condition: the Cover page exists, carries a Cover instance, and its persisted
 * status is not legacy/archived. A missing cover or a legacy cover → false (tolerated,
 * not thrown — this is a checklist read, not the Starter Kit).
 */
async function evaluateCoverUpToDate(): Promise<boolean> {
  const coverPage = figma.root.findChild(n => n.name === COVER_PAGE_NAME) as PageNode | null;
  if (!coverPage) return false;
  await coverPage.loadAsync();
  const instance = findCoverInstance(coverPage);
  if (!instance) return false;
  // Reuse the persisted cover status read — legacy/archived is not "up to date".
  const config = await loadCoverConfig();
  return !LEGACY_COVER_STATUSES.has(config.projectStatus);
}

/**
 * Evaluate the HS delivery checklist against document structure.
 * Returns the per-item breakdown, the clamped total soft penalty, and the cover hard-gate
 * flag. Items + penalties come from scoring-config (HS_ITEMS / HS_MAX_PENALTY).
 */
export async function evaluateDeliveryChecklist(): Promise<HSChecklistResult> {
  // Page names are metadata on the root's page stubs — readable without loadAsync().
  const pageNames = figma.root.children.map(p => p.name.toLowerCase());

  const isArchivesPage = (n: string) => n.includes("archives");
  const hasArchives = pageNames.some(isArchivesPage);
  // Stray obsolete page = a page named old/explo that is NOT the Archives page itself.
  const hasStrayObsolete = pageNames.some(
    n => (/\bold\b/.test(n) || n.includes("explo")) && !isArchivesPage(n)
  );
  const fileName = (figma.root.name || "").trim();
  const isFileNamed = fileName.length > 0 && fileName.toLowerCase() !== "untitled";
  const hasSpecs = pageNames.some(n => n.includes("spec") || n.includes("handoff"));

  const coverUpToDate = await evaluateCoverUpToDate();

  // Per-item pass/fail, keyed by the HS_ITEMS ids (single source of truth for the list).
  const okById: Record<string, boolean> = {
    "cover-up-to-date": coverUpToDate,
    "archives-page": hasArchives,
    "obsolete-mockups-filed": !hasStrayObsolete,
    "file-named": isFileNamed,
    "specs-page": hasSpecs,
  };

  const items: HSChecklistItem[] = [];
  let softTotal = 0;
  for (const hsItem of HS_ITEMS) {
    const ok = okById[hsItem.id] ?? true;
    // Hard-gate item (cover) never contributes a soft penalty — it surfaces via coverUpToDate.
    const penalty = !ok && !hsItem.hardGate ? hsItem.penalty : 0;
    if (penalty > 0) softTotal += penalty;
    items.push({ id: hsItem.id, ok, penalty });
  }

  // Clamp the total soft penalty to the calibrated cap.
  const penalty = Math.min(softTotal, HS_MAX_PENALTY);

  return { items, penalty, coverUpToDate };
}
