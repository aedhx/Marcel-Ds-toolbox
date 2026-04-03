// ── Cover Config ──
// Persists the selected cover status via createStorage.

import { createStorage } from "../../shared/storage";
import { CoverConfig, DEFAULT_COVER_CONFIG } from "./cover-types";

const coverStorage = createStorage("cover");

export async function loadCoverConfig(): Promise<CoverConfig> {
  const stored = await coverStorage.get<CoverConfig>("config");
  if (stored && typeof stored === "object" && "projectStatus" in stored) {
    return { projectStatus: (stored as CoverConfig).projectStatus };
  }
  return { ...DEFAULT_COVER_CONFIG };
}

export async function saveCoverConfig(config: CoverConfig): Promise<void> {
  await coverStorage.set("config", config);
}
