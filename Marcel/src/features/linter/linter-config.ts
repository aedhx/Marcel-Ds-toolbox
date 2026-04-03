// ── Linter Config ──
// Persistent configuration stored via createStorage (namespaced marcel:linter:).

import { createStorage } from "../../shared/storage";

const linterStorage = createStorage("linter");

export interface LinterConfig {
  enabledRules: Record<string, boolean>;
  customVagueNames: string[];
  ignoredLayers: string[];
  ignoredPages: string[];
  autoFixConfidenceThreshold: "high" | "medium" | "low";
  componentNamingPattern: string;
  maxNameLength: number;
  maxNestingDepth: number;
}

export const DEFAULT_LINTER_CONFIG: LinterConfig = {
  enabledRules: {
    "default-names": true,
    "vague-names": true,
    "duplicate-siblings": true,
    "component-naming": true,
    "long-names": true,
    "special-chars": false,
    "numbered-suffix": true,
    "text-mismatch": true,
    "empty-frames": true,
    "excessive-nesting": true,
    "single-child-groups": true,
    "orphan-layers": true,
    "unused-components": true,
    "non-token-colors": true,
    "inconsistent-radius": true,
    "mixed-fills": false,
    "detached-styles": true,
  },
  customVagueNames: [],
  ignoredLayers: ["───────────"],
  ignoredPages: ["Need help ? Comment organiser & documenter"],
  autoFixConfidenceThreshold: "medium",
  componentNamingPattern: ".+/.+",
  maxNameLength: 60,
  maxNestingDepth: 8,
};

export async function loadLinterConfig(): Promise<LinterConfig> {
  const stored = await linterStorage.get<LinterConfig>("config");
  if (stored && typeof stored === "object") {
    return mergeConfig(DEFAULT_LINTER_CONFIG, stored as Partial<LinterConfig>);
  }
  return { ...DEFAULT_LINTER_CONFIG, enabledRules: { ...DEFAULT_LINTER_CONFIG.enabledRules } };
}

export async function saveLinterConfig(config: LinterConfig): Promise<void> {
  await linterStorage.set("config", config);
}

export async function resetLinterConfig(): Promise<LinterConfig> {
  var fresh: LinterConfig = {
    ...DEFAULT_LINTER_CONFIG,
    enabledRules: { ...DEFAULT_LINTER_CONFIG.enabledRules },
    customVagueNames: [],
    ignoredLayers: [...DEFAULT_LINTER_CONFIG.ignoredLayers],
    ignoredPages: [...DEFAULT_LINTER_CONFIG.ignoredPages],
  };
  await saveLinterConfig(fresh);
  return fresh;
}

function mergeConfig(defaults: LinterConfig, partial: Partial<LinterConfig>): LinterConfig {
  return {
    enabledRules: { ...defaults.enabledRules, ...(partial.enabledRules || {}) },
    customVagueNames: partial.customVagueNames || defaults.customVagueNames,
    ignoredLayers: partial.ignoredLayers || defaults.ignoredLayers,
    ignoredPages: partial.ignoredPages || defaults.ignoredPages,
    autoFixConfidenceThreshold: partial.autoFixConfidenceThreshold || defaults.autoFixConfidenceThreshold,
    componentNamingPattern: partial.componentNamingPattern || defaults.componentNamingPattern,
    maxNameLength: partial.maxNameLength !== undefined ? partial.maxNameLength : defaults.maxNameLength,
    maxNestingDepth: partial.maxNestingDepth !== undefined ? partial.maxNestingDepth : defaults.maxNestingDepth,
  };
}
