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
    // NOTE: this is a WHITELIST rebuild — any field not listed here is silently
    // dropped on every read. Add new persisted fields to this literal.
    return {
      projectStatus: (stored as CoverConfig).projectStatus,
      projectProfile: (stored as CoverConfig).projectProfile ?? DEFAULT_COVER_CONFIG.projectProfile,
      // T-QA-02: strict boolean coercion — a corrupted/absent stored value
      // degrades to false (fail-closed: unattested, penalty applied).
      a11yAttested: (stored as CoverConfig).a11yAttested === true,
      // T-e4d-02/03: strict boolean coercion — an absent/corrupted stored value
      // degrades to false (fail-open: the Check-designs recommendation is shown
      // again, which is the harmless direction).
      checkDesignsAck: (stored as CoverConfig).checkDesignsAck === true,
    };
  }
  return { ...DEFAULT_COVER_CONFIG };
}

export async function saveCoverConfig(config: CoverConfig): Promise<void> {
  await coverStorage.set("config", config);
}
