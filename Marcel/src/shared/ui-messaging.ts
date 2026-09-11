import type { DeadStylesResult, DeadItemType, StyleCleanerResult } from '../features/dead-styles/dead-styles-types';
import type { QualityCheckResult } from './quality-check-types';
import type { Violation } from './violation-types';
import type { DeliveryStampData } from '../features/delivery/delivery-stamp';
import type { FileStructureDiagnosis } from '../features/starter-kit/audit-mode';

// ── Messages from UI to Plugin Sandbox ──

export type UIMessage =
  // Starter Kit
  // `source` (B1-01) tells the UI which create-path fired so only the legacy
  // SK-tab handler mutates the legacy SK-tab DOM. Closed enum (T-053-03-INJ).
  | { type: "create-starter-kit"; template: "prd" | "ds-library"; source: "moment" | "sk-tab" }
  | { type: "check-template-exists"; template: "prd" | "ds-library" }
  | { type: "reset-all-pages" }
  // Je démarre · Audit mode (spec §3 — AUDIT-01): diagnose an existing file's
  // structure, then apply ONLY the consented, non-destructive upgrades.
  | { type: "diagnose-file-structure" }
  | { type: "apply-structure-upgrade"; selections: { generateCover: boolean; replaceLegacyCover: boolean; addMissingPages: string[] } }
  | { type: "import-ds-component"; componentKey: string }
  // Linter
  | { type: "run-linter"; scope: "page" | "selection" | "file" }
  | { type: "fix-violation"; nodeId: string; suggestion?: string }
  | { type: "fix-all-violations"; violations: { nodeId: string; suggestion?: string }[] }
  | { type: "fix-by-category"; category: string; violations: { nodeId: string; suggestion?: string }[] }
  // Unified Quality Check (hidden/dev trigger — Phase 2 wiring, D-06)
  | { type: "run-quality-check"; scope: "page" | "selection" | "file" }
  // Unified Quality Check fix-routing (Phase 4 — QC-08/QC-09)
  | { type: "fix-qc-violation"; nodeId: string; category: string; rule: string; suggestion?: string; metadata?: Record<string, unknown>; violationId?: string }
  | { type: "fix-qc-by-category"; category: string; violations: Violation[] }
  | { type: "fix-qc-all"; violations: Violation[] }
  // i18n (Phase 3 — MIGR-05)
  | { type: "get-language" }
  | { type: "set-language"; language: "fr" | "en" | "pt-BR" }
  // Navigation
  | { type: "navigate-to-node"; nodeId: string }
  // Scan control
  | { type: "cancel-scan" }
  // Settings
  | { type: "load-linter-config" }
  | { type: "save-linter-config"; config: unknown }
  | { type: "reset-linter-config" }
  // Allowlist (LINT-09)
  | { type: "ignore-violation"; nodeId: string; ruleId: string }
  | { type: "unignore-violation"; nodeId: string; ruleId: string }
  | { type: "load-allowlist" }
  | { type: "clear-allowlist" }
  // Cover Updater
  | { type: "generate-cover"; status: string }
  | { type: "load-cover-config" }
  // Governed project profile (spec §1.7 — PROFILE-01): persist the chosen delivery profile
  | { type: "set-project-profile"; profileId: string }
  | { type: "load-delivery-profile-config" }
  // Export delivery stamp (spec §2 — EXPORT-01): generate the in-file badge + flip
  // Cover to Design Done. `data` is aggregate-only (no design content — privacy).
  | { type: "generate-delivery-stamp"; data: DeliveryStampData }
  // External link-out (D-07 — a11y plugin shortcut; fire-and-forget, no reply)
  | { type: "open-external"; url: string }
  // Dead Styles
  | { type: "scan-dead-styles" }
  | { type: "remove-dead-style"; styleId: string; itemType: "PAINT" | "TEXT" | "EFFECT" | "VARIABLE" }
  | { type: "remove-all-dead-styles"; items: Array<{ id: string; itemType: "PAINT" | "TEXT" | "EFFECT" | "VARIABLE" }> }
  // Style Cleaner (extended Dead Styles)
  | { type: "scan-style-cleaner" }
  | { type: "detach-foreign-item"; itemId?: string; nodeId: string; field: string; paintIndex?: number; itemType: DeadItemType; styleType?: "PAINT" | "TEXT" | "EFFECT" }
  | { type: "replace-foreign-item"; itemId?: string; nodeId: string; field: string; paintIndex?: number; itemType: DeadItemType; styleType?: "PAINT" | "TEXT" | "EFFECT"; suggestion: { tokenName: string; tokenHex?: string; variableKey?: string } }
  | { type: "batch-detach-foreign"; items: Array<{ nodeId: string; field: string; paintIndex?: number; itemType: DeadItemType; styleType?: "PAINT" | "TEXT" | "EFFECT" }> }
  | { type: "batch-replace-foreign"; items: Array<{ nodeId: string; field: string; paintIndex?: number; itemType: DeadItemType; suggestion: { tokenName: string; tokenHex?: string; variableKey?: string } }> }
  // Init
  | { type: "ui-ready" };

// ── Messages from Plugin Sandbox to UI ──

export type PluginMessage =
  // Init
  | { type: "init-context"; hasProjectPages: boolean }
  // Starter Kit
  // `source`/`template` echoed back so the UI can scope the legacy-DOM mutation
  // (B1-01) and PRD-gate the cover-init banner (B1-02). Both closed enums.
  | { type: "starter-kit-created"; source: "moment" | "sk-tab"; template: "prd" | "ds-library" }
  | { type: "starter-kit-error"; message: string }
  | { type: "template-exists-result"; exists: boolean; matchCount: number }
  // Je démarre · Audit mode (spec §3 — AUDIT-01)
  | { type: "file-structure-diagnosis"; diagnosis: FileStructureDiagnosis }
  | { type: "structure-upgrade-applied" }
  | { type: "structure-upgrade-error"; message: string }
  | { type: "pages-reset" }
  | { type: "reset-error"; message: string }
  | { type: "ds-component-imported"; componentKey: string }
  | { type: "ds-component-error"; componentKey: string; message: string }
  // Linter
  | { type: "linter-result"; result: unknown }
  | { type: "linter-error"; message: string }
  | { type: "fix-violation-result"; result: { success: boolean; newName: string } }
  | { type: "fix-all-violations-result"; result: { fixed: number; failed: number; fixedNodeIds: string[] }; updatedLintResult: unknown }
  // Unified Quality Check (hidden/dev trigger — Phase 2 wiring, D-06)
  | { type: "quality-check-result"; result: QualityCheckResult }
  | { type: "quality-check-error"; message: string }
  | { type: "quality-check-progress"; phase: string; processed: number; total: number }
  // Unified Quality Check fix-routing results (Phase 4 — QC-08/QC-09)
  | { type: "fix-qc-violation-result"; result: { success: boolean; detail?: string }; violationId?: string }
  | { type: "fix-qc-bulk-result"; result: { fixed: number; failed: number; fixedNodeIds: string[] } }
  // i18n (Phase 3 — MIGR-05)
  | { type: "language"; language: "fr" | "en" | "pt-BR" }
  // Scan progress
  | { type: "traversal-progress"; processed: number; total: number }
  | { type: "scan-cancelled" }
  // Settings
  | { type: "linter-config-loaded"; config: unknown }
  | { type: "linter-config-saved" }
  // Allowlist
  | { type: "allowlist-updated"; allowlist: string[] }
  | { type: "allowlist-loaded"; allowlist: string[] }
  // Cover Updater
  | { type: "cover-generated" }
  | { type: "cover-error"; message: string }
  // `fileName`/`pageName` are aggregate document identifiers piggy-backed here so
  // the UI can build the delivery stamp WITHOUT reading figma.* (EXPORT-01).
  | { type: "cover-config-loaded"; config: unknown; fileName?: string; pageName?: string }
  // Governed project profile list (spec §1.7 — PROFILE-01): the closed list + current selection
  | { type: "delivery-profile-config"; profiles: Array<{ id: string; label: string; threshold: number }>; selectedProfileId: string }
  // Export delivery stamp (spec §2 — EXPORT-01): badge generated; `coverFlipped`
  // is false when the Cover flip was skipped (no Cover) — the UI must NOT
  // promote its gate state to "Design Done" in that case (CR-01).
  | { type: "delivery-stamp-generated"; coverFlipped: boolean }
  | { type: "delivery-stamp-error"; message: string }
  // Dead Styles
  | { type: "dead-styles-result"; result: DeadStylesResult }
  | { type: "dead-styles-error"; message: string }
  | { type: "dead-style-removed"; styleId: string; success: boolean; error?: string }
  | { type: "dead-styles-batch-removed"; result: { removed: number; failed: number } }
  | { type: "dead-styles-progress"; phase: string; current: number; total: number }
  // Style Cleaner (extended Dead Styles)
  | { type: "style-cleaner-result"; result: StyleCleanerResult }
  | { type: "style-cleaner-error"; message: string }
  | { type: "foreign-item-fixed"; itemId: string; action: "detach" | "replace"; success: boolean; error?: string }
  | { type: "batch-foreign-result"; action: "detach" | "replace"; result: { count: number; failed: number } };
