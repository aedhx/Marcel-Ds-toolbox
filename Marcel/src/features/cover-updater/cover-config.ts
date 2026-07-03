// ── Cover Config ──
// Persists the selected cover status via createStorage.

import { createStorage } from "../../shared/storage";
import { CoverConfig, DEFAULT_COVER_CONFIG } from "./cover-types";

const coverStorage = createStorage("cover");

export async function loadCoverConfig(): Promise<CoverConfig> {
  const stored = await coverStorage.get<CoverConfig>("config");
  if (stored && typeof stored === "object" && "projectStatus" in stored) {
    // Backward compat: an old stored config without projectProfile falls back
    // to the governed default (DEFAULT_PROFILE_ID from DEFAULT_COVER_CONFIG).
    return {
      projectStatus: (stored as CoverConfig).projectStatus,
      projectProfile: (stored as CoverConfig).projectProfile ?? DEFAULT_COVER_CONFIG.projectProfile,
    };
  }
  return { ...DEFAULT_COVER_CONFIG };
}

export async function saveCoverConfig(config: CoverConfig): Promise<void> {
  await coverStorage.set("config", config);
}
