// ── Je démarre · Audit mode (AUDIT-01, spec §3) ──
// For an EXISTING file, diagnose the structure (cover? standard pages? legacy
// cover? archives? file named?) and offer a NON-DESTRUCTIVE, opt-in upgrade.
//
// Safety posture (spec §3, threat T-052-13/14): every mutation in
// applyStructureUpgrade is individually gated on an explicit selection flag.
// Nothing is created or replaced without consent. Existing user content is
// NEVER deleted — the only replacement is swapping a flagged legacy cover
// component to the current DS cover, and only when replaceLegacyCover is set.

import { STARTER_KIT_PAGES } from "./config";
import { loadAllFonts } from "../../shared/figma-helpers";
import { buildCover } from "./builders/cover-builder";
import { buildOverview } from "./builders/overview-builder";
import { buildDelivery } from "./builders/delivery-builder";
import { buildHelp } from "./builders/help-builder";
import { buildArchives } from "./builders/archives-builder";
import { buildLocalComponents } from "./builders/local-components-builder";
// Cross-feature reuse (sanctioned by plan): the cover generator + the current
// DS cover component keys live in cover-updater. Reusing them keeps the audit's
// cover replacement consistent with the rest of the plugin (spec §6).
import { generateOrUpdateCover } from "../cover-updater/cover-updater";
import { STATUS_TO_KEY } from "../cover-updater/cover-types";

// ── Structure diagnosis shape (posted to the UI as a checklist) ──
export interface FileStructureDiagnosis {
  hasCover: boolean;
  coverIsLegacy: boolean;
  missingStandardPages: string[];
  hasArchives: boolean;
  fileNamed: boolean;
}

// The cover page is always the first standard page in STARTER_KIT_PAGES.
const COVER_PAGE_NAME = STARTER_KIT_PAGES[0].name;

// The set of DS cover component keys considered "current". A cover instance
// whose main component key is NOT in this set is treated as legacy.
const CURRENT_COVER_KEYS = new Set<string>(Object.values(STATUS_TO_KEY));

/**
 * Locate the cover InstanceNode on the cover page — mirrors cover-updater's
 * private findCoverInstance (wrapper frame "Cover" → INSTANCE, else direct).
 */
function findCoverInstance(page: PageNode): InstanceNode | null {
  const wrapper = page.findChild((n) => n.name === "Cover" && n.type === "FRAME") as FrameNode | null;
  if (wrapper) {
    const instance = wrapper.findChild((n) => n.type === "INSTANCE") as InstanceNode | null;
    if (instance) return instance;
  }
  return page.findChild((n) => n.type === "INSTANCE") as InstanceNode | null;
}

/**
 * Diagnose the file's structure against the standard PRD starter pages.
 * Read-only — performs no mutation.
 */
export async function diagnoseFileStructure(): Promise<FileStructureDiagnosis> {
  const pages = figma.root.children;
  const existingNames = new Set(pages.map((p) => p.name));

  // ── Cover: present? legacy? ──
  let hasCover = false;
  let coverIsLegacy = false;
  const coverPage = pages.find((p) => p.name === COVER_PAGE_NAME) as PageNode | undefined;
  if (coverPage) {
    await coverPage.loadAsync();
    const instance = findCoverInstance(coverPage);
    if (instance) {
      hasCover = true;
      const main = await instance.getMainComponentAsync();
      const mainKey = main ? main.key : "";
      // A component set variant may carry the shared key on its parent set.
      const parentKey =
        main && main.parent && main.parent.type === "COMPONENT_SET"
          ? (main.parent as ComponentSetNode).key
          : "";
      coverIsLegacy = !CURRENT_COVER_KEYS.has(mainKey) && !CURRENT_COVER_KEYS.has(parentKey);
    }
  }

  // ── Missing standard pages (excluding Cover — its own flag drives it) ──
  // Reuse the same "content page" filter as checkTemplateExists (skip separators).
  const missingStandardPages = STARTER_KIT_PAGES.filter(
    (p) => p.type !== "separator" && p.name !== COVER_PAGE_NAME
  )
    .map((p) => p.name)
    .filter((name) => !existingNames.has(name));

  // ── Archives page present? (name-based, matches the "📦  Archives" starter page) ──
  const hasArchives = pages.some((p) => /archive/i.test(p.name));

  // ── File named (≠ default "Untitled")? ──
  const rootName = (figma.root.name || "").trim();
  const fileNamed = rootName !== "" && rootName.toLowerCase() !== "untitled";

  return { hasCover, coverIsLegacy, missingStandardPages, hasArchives, fileNamed };
}

/**
 * Dispatch a starter-kit builder by its config builder key. Only the keys used
 * by STARTER_KIT_PAGES are handled (audit mode upgrades the PRD structure).
 */
async function buildPageByBuilderKey(page: PageNode, builderKey: string): Promise<void> {
  switch (builderKey) {
    case "cover":
      await buildCover(page);
      break;
    case "overview":
      await buildOverview(page);
      break;
    case "delivery":
      await buildDelivery(page);
      break;
    case "help":
      await buildHelp(page);
      break;
    case "archives":
      await buildArchives(page);
      break;
    case "local-components":
      await buildLocalComponents(page);
      break;
  }
}

/**
 * Apply ONLY the consented upgrades. Non-destructive:
 * - addMissingPages: create + build each named standard page that is absent
 *   (never duplicates an existing page, never touches other pages);
 * - generateCover: create/build the Cover page only if requested;
 * - replaceLegacyCover: swap the legacy cover instance to the current DS cover.
 * Every branch is guarded by its selection flag — nothing runs without consent.
 * Errors propagate to main.ts (no internal try/catch).
 */
export async function applyStructureUpgrade(selections: {
  generateCover: boolean;
  replaceLegacyCover: boolean;
  addMissingPages: string[];
}): Promise<void> {
  await loadAllFonts();

  const existingNames = new Set(figma.root.children.map((p) => p.name));

  // ── Add missing standard pages (consent-gated, never duplicates) ──
  if (selections.addMissingPages && selections.addMissingPages.length > 0) {
    for (const pageDef of STARTER_KIT_PAGES) {
      if (pageDef.type === "separator") continue;
      if (!selections.addMissingPages.includes(pageDef.name)) continue;
      // Safety: never recreate a page that already exists.
      if (existingNames.has(pageDef.name)) continue;
      const page = figma.createPage();
      page.name = pageDef.name;
      if (pageDef.builder) {
        await buildPageByBuilderKey(page, pageDef.builder);
      }
      existingNames.add(pageDef.name);
    }
  }

  // ── Generate a missing cover (consent-gated) ──
  if (selections.generateCover) {
    let coverPage = figma.root.findChild((n) => n.name === COVER_PAGE_NAME) as PageNode | null;
    if (coverPage) {
      await coverPage.loadAsync();
    } else {
      coverPage = figma.createPage();
      coverPage.name = COVER_PAGE_NAME;
    }
    await buildCover(coverPage);
  }

  // ── Replace a flagged legacy cover with the current DS cover (consent-gated) ──
  if (selections.replaceLegacyCover) {
    await generateOrUpdateCover();
  }
}
