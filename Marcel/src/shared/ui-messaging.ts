import type { HCResult } from '../features/health-check/hc-types';
import type { DeadStylesResult, DeadItemType, StyleCleanerResult } from '../features/dead-styles/dead-styles-types';
import type { A11YResult } from '../features/accessibility/a11y-types';
import type { QualityCheckResult } from './quality-check-types';
import type { Violation } from './violation-types';

// ── Messages from UI to Plugin Sandbox ──

export type UIMessage =
  // Starter Kit
  | { type: "create-starter-kit"; template: "prd" | "ds-library" }
  | { type: "check-template-exists"; template: "prd" | "ds-library" }
  | { type: "reset-all-pages" }
  | { type: "import-ds-component"; componentKey: string }
  // Linter
  | { type: "run-linter"; scope: "page" | "selection" | "file" }
  | { type: "fix-violation"; nodeId: string; suggestion?: string }
  | { type: "fix-all-violations"; violations: { nodeId: string; suggestion?: string }[] }
  | { type: "fix-by-category"; category: string; violations: { nodeId: string; suggestion?: string }[] }
  // Health Check (placeholder — Phase 3)
  | { type: "run-health-check"; scope: "page" | "selection" | "file" }
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
  // Accessibility Audit
  | { type: "run-a11y-audit"; scope: "page" | "selection" | "file" }
  | { type: "save-alt-text"; nodeId: string; altText: string }
  | { type: "get-alt-text"; nodeId: string }
  | { type: "create-a11y-badges" }
  | { type: "cleanup-a11y-badges" }
  | { type: "simulate-color-blindness"; scope: "page" | "selection"; placement: "new-page" | "same-page" }
  | { type: "copy-a11y-report" }
  // Init
  | { type: "ui-ready" };

// ── Messages from Plugin Sandbox to UI ──

export type PluginMessage =
  // Init
  | { type: "init-context"; hasProjectPages: boolean }
  // Starter Kit
  | { type: "starter-kit-created" }
  | { type: "starter-kit-error"; message: string }
  | { type: "template-exists-result"; exists: boolean; matchCount: number }
  | { type: "pages-reset" }
  | { type: "reset-error"; message: string }
  | { type: "ds-component-imported"; componentKey: string }
  | { type: "ds-component-error"; componentKey: string; message: string }
  // Linter
  | { type: "linter-result"; result: unknown }
  | { type: "linter-error"; message: string }
  | { type: "fix-violation-result"; result: { success: boolean; newName: string } }
  | { type: "fix-all-violations-result"; result: { fixed: number; failed: number; fixedNodeIds: string[] }; updatedLintResult: unknown }
  // Health Check
  | { type: "health-check-result"; result: HCResult }
  | { type: "health-check-error"; message: string }
  | { type: "health-check-progress"; category: string; processed: number; total: number }
  // Unified Quality Check (hidden/dev trigger — Phase 2 wiring, D-06)
  | { type: "quality-check-result"; result: QualityCheckResult }
  | { type: "quality-check-error"; message: string }
  | { type: "quality-check-progress"; phase: string; processed: number; total: number }
  // Unified Quality Check fix-routing results (Phase 4 — QC-08/QC-09)
  | { type: "fix-qc-violation-result"; result: { success: boolean }; violationId?: string }
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
  | { type: "cover-config-loaded"; config: unknown }
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
  | { type: "batch-foreign-result"; action: "detach" | "replace"; result: { count: number; failed: number } }
  // Accessibility Audit
  | { type: "a11y-result"; result: A11YResult }
  | { type: "a11y-error"; message: string }
  | { type: "a11y-progress"; category: string; processed: number; total: number }
  | { type: "alt-text-saved"; nodeId: string }
  | { type: "alt-text-loaded"; nodeId: string; altText: string }
  | { type: "a11y-badges-created"; count: number }
  | { type: "a11y-badges-cleaned" }
  | { type: "color-blindness-simulated"; pagesCreated: string[] }
  | { type: "a11y-report-copied" };
