// ── Cover Updater ──
// Swaps the DS cover component instance to match the selected project status.

import { loadCoverConfig } from "./cover-config";
import { CoverConfig, STATUS_TO_KEY } from "./cover-types";
import { STARTER_KIT_PAGES } from "../starter-kit/config";

const COVER_PAGE_NAME = STARTER_KIT_PAGES[0].name;

// Error code marking a missing Cover page/component precondition. Callers (e.g.
// the generate-delivery-stamp handler) discriminate on this code to surface an
// actionable, i18n-correct "run the Starter Kit first" message instead of the raw
// French string. Mark Design Done is a SOFT gate (AUDIT-01): the stamp handler
// never auto-creates a Cover — it points the designer at Je démarre / Starter Kit.
export const NO_COVER_ERROR_CODE = "NO_COVER";

/** Build a Cover-precondition Error carrying NO_COVER_ERROR_CODE for discrimination. */
function noCoverError(message: string): Error {
  const err = new Error(message);
  (err as any).code = NO_COVER_ERROR_CODE;
  return err;
}

/**
 * Find the cover page, then locate the InstanceNode inside the "Cover" wrapper.
 */
function findCoverInstance(page: PageNode): InstanceNode | null {
  // Look for wrapper frame named "Cover"
  const wrapper = page.findChild(n => n.name === "Cover" && n.type === "FRAME") as FrameNode | null;
  if (wrapper) {
    const instance = wrapper.findChild(n => n.type === "INSTANCE") as InstanceNode | null;
    if (instance) return instance;
  }
  // Maybe the instance is directly on the page (no wrapper)
  return page.findChild(n => n.type === "INSTANCE") as InstanceNode | null;
}

export async function generateOrUpdateCover(config?: CoverConfig): Promise<void> {
  if (!config) {
    config = await loadCoverConfig();
  }

  const componentKey = STATUS_TO_KEY[config.projectStatus] || STATUS_TO_KEY["In Progress"];

  // Find cover page
  const coverPage = figma.root.findChild(n => n.name === COVER_PAGE_NAME) as PageNode | null;
  if (!coverPage) {
    throw noCoverError("Aucune page Cover trouvée. Lance d'abord le Starter Kit.");
  }

  await coverPage.loadAsync();

  const instance = findCoverInstance(coverPage);
  if (!instance) {
    throw noCoverError("Aucun composant Cover trouvé sur la page. Lance d'abord le Starter Kit.");
  }

  // Import the target component and swap
  const targetComponent = await figma.importComponentByKeyAsync(componentKey);
  instance.swapComponent(targetComponent);
}
