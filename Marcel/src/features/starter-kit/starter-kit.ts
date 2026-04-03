import { STARTER_KIT_PAGES, DS_LIBRARY_PAGES, PageDefinition } from "./config";
import { loadAllFonts } from "../../shared/figma-helpers";
import { buildCover } from "./builders/cover-builder";
import { buildOverview } from "./builders/overview-builder";
import { buildDelivery } from "./builders/delivery-builder";
import { buildHelp } from "./builders/help-builder";
import { buildArchives } from "./builders/archives-builder";
import { buildLocalComponents } from "./builders/local-components-builder";
import { buildLibraryCover } from "./builders/library-cover-builder";
import { buildReadme } from "./builders/readme-builder";
import { buildContributors } from "./builders/contributors-builder";
import { buildComponentPage } from "./builders/component-page-builder";

export type TemplateType = "prd" | "ds-library";

/**
 * Check if pages from a given template already exist in the file.
 * Returns { exists: boolean, matchCount: number }
 */
export function checkTemplateExists(template: TemplateType): { exists: boolean; matchCount: number } {
  const pages: PageDefinition[] = template === "ds-library" ? DS_LIBRARY_PAGES : STARTER_KIT_PAGES;
  const existingPageNames = new Set(figma.root.children.map((p) => p.name));

  // Only check content and empty pages, not separators (since separators have generic names)
  const contentPageNames = pages
    .filter((p) => p.type !== "separator")
    .map((p) => p.name);

  let matchCount = 0;
  for (const name of contentPageNames) {
    if (existingPageNames.has(name)) {
      matchCount++;
    }
  }

  // Consider it "exists" if at least 3 content pages match (not just Cover which is common)
  return {
    exists: matchCount >= 3,
    matchCount,
  };
}

/**
 * Reset all pages in the file — remove everything except a single "COVER" page with cover built.
 */
export async function resetAllPages(): Promise<void> {
  const pages = [...figma.root.children];
  const keepPage = pages[0];

  // Navigate to the keep page FIRST — Figma blocks removing the current page
  await figma.setCurrentPageAsync(keepPage);

  // Remove all other pages
  for (let i = pages.length - 1; i >= 1; i--) {
    pages[i].remove();
  }

  // Clear the kept page content and rename
  await keepPage.loadAsync();
  for (const child of [...keepPage.children]) {
    child.remove();
  }
  keepPage.name = "Page 1";
}

export async function createStarterKit(template: TemplateType = "prd"): Promise<void> {
  // Load all fonts upfront
  await loadAllFonts();

  // Select the right page definitions
  const pages: PageDefinition[] = template === "ds-library" ? DS_LIBRARY_PAGES : STARTER_KIT_PAGES;

  // Check for existing pages
  const existingPages = figma.root.children;

  // Detect empty "Page 1" that we can reuse as the first page (Cover)
  let reusablePage: PageNode | null = null;
  if (
    existingPages.length === 1 &&
    existingPages[0].name === "Page 1"
  ) {
    await existingPages[0].loadAsync();
  }
  if (
    existingPages.length === 1 &&
    existingPages[0].name === "Page 1" &&
    existingPages[0].children.length === 0
  ) {
    reusablePage = existingPages[0];
  } else if (existingPages.length > 1 || (existingPages.length === 1 && existingPages[0].name !== "Page 1")) {
    figma.notify(
      "Starter Kit ajout\u00e9 aux pages existantes.",
      { timeout: 3000 }
    );
  }

  // Create all pages in order
  const createdPages: PageNode[] = [];
  let coverNode: FrameNode | null = null;

  for (let i = 0; i < pages.length; i++) {
    const pageDef = pages[i];

    // Reuse "Page 1" for the first page (Cover) to avoid duplicates
    let page: PageNode;
    if (i === 0 && reusablePage) {
      page = reusablePage;
      page.name = pageDef.name;
    } else {
      page = figma.createPage();
      page.name = pageDef.name;
    }
    createdPages.push(page);

    // Build content based on page type and builder
    if (pageDef.type === "content" && pageDef.builder) {
      switch (pageDef.builder) {
        case "cover":
          coverNode = await buildCover(page);
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
        case "library-cover":
          coverNode = await buildLibraryCover(page);
          break;
        case "readme":
          await buildReadme(page);
          break;
        case "contributors":
          await buildContributors(page);
          break;
        case "component-page":
          await buildComponentPage(page);
          break;
        case "archives":
          await buildArchives(page);
          break;
        case "local-components":
          await buildLocalComponents(page);
          break;
      }
    }
  }

  // Set the cover as file thumbnail
  if (coverNode) {
    try {
      await figma.setFileThumbnailNodeAsync(coverNode);
    } catch (e) {
      // Thumbnail setting may fail in some contexts, that's okay
      console.log("Could not set file thumbnail:", e);
    }
  }

  // Navigate to the first page (Cover)
  if (createdPages.length > 0) {
    await figma.setCurrentPageAsync(createdPages[0]);
    // Zoom to fit the cover
    if (coverNode) {
      figma.viewport.scrollAndZoomIntoView([coverNode]);
    }
  }
}
