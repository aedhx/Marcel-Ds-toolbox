// ── Cover Updater Types ──

import { DS_COMPONENT_KEYS } from "../starter-kit/config";
import { DEFAULT_PROFILE_ID } from "../../shared/scoring-config";

export interface CoverConfig {
  projectStatus: string; // "In Progress" | "Design Done" | "Archived" | "SOT" | "Playground"
  // Governed project profile id (spec §1.7) — drives the "Je livre" delivery
  // threshold and is carried into the export stamp. One of PROJECT_PROFILES ids.
  projectProfile?: string;
  // External a11y plugin run attested by the designer (delivery gate, lot 2).
  // Gates "Marquer comme Design Done" and costs A11Y_UNATTESTED_PENALTY on the
  // QC global score while absent. Distinct from the frame-detection gate
  // (A11Y_ABSENT_PENALTY), which stays suppressed per WR-08.
  a11yAttested?: boolean;
  // The designer dismissed the "clean up with Figma Check designs first" card in
  // Je construis. Purely a UI-state flag — it gates NO score and NO delivery condition.
  checkDesignsAck?: boolean;
}

export const PROJECT_STATUSES = [
  "In Progress", "Design Done", "Archived", "SOT", "Playground"
] as const;

/** Maps each project status to its DS library component key */
export const STATUS_TO_KEY: Record<string, string> = {
  "In Progress": DS_COMPONENT_KEYS.coverInProgress,
  "Design Done": DS_COMPONENT_KEYS.coverDesignDone,
  "Archived": DS_COMPONENT_KEYS.coverArchived,
  "SOT": DS_COMPONENT_KEYS.coverSOT,
  "Playground": DS_COMPONENT_KEYS.coverPlayground,
};

export const DEFAULT_COVER_CONFIG: CoverConfig = {
  projectStatus: "In Progress",
  projectProfile: DEFAULT_PROFILE_ID,
  a11yAttested: false,
  checkDesignsAck: false,
};

/**
 * Optional display data threaded into the Cover page builder (`buildCover`).
 * Every field is optional — the builder falls back to placeholder copy when a
 * field is absent. Distinct from {@link CoverConfig} (persisted status/profile).
 */
export interface CoverData {
  status?: string;
  fileName?: string;
  date?: string;
  designer?: string;
}
