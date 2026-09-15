// ============================================================================
// Quality Check scoring — SINGLE CALIBRATION SURFACE
// ============================================================================
//
//  [À CALER — atelier pondération équipe]
//
// This is the ONE place the whole team tunes the penalty scoring model
// (design spec §1.4, §1.7, §1.8, §1.11, §4). Every contested number lives here
// as a named, documented constant so no later 5.2 plan ever has to re-open this
// file to add a knob. Downstream constants (a11y gate, project profiles, HS
// checklist) are defined NOW even though Plans 02–04 consume them, precisely so
// this surface is frozen for the whole phase.
//
// Conventions (per ./CLAUDE.md, shared/*):
//   - named `export const` only — NO default export
//   - const/let only (no `var`) + double quotes
//
// Marker legend:
//   [À CALER]            = value/list to finalize in the weighting workshop
//   [PROPOSITION à valider] = starting point from the spec, to validate
// ============================================================================

// ── Penalty categories — the 5 weighted buckets (spec §1.2/§1.4) ──
//
// [À CALER — atelier pondération équipe]
// The spec's "🧩 Composants / styles morts" bucket = `components` here: it
// absorbs BOTH component violations and dead-styles hygiene findings.
// NOTE (spec §1.11): full component COVERAGE is deliberately out of scope — the
// "coverage" category is NOT one of these five penalty buckets.
export const PENALTY_CATEGORIES = [
  "colors",
  "typography",
  "spacing",
  "components",
  "naming",
] as const;

export type PenaltyCategory = (typeof PENALTY_CATEGORIES)[number];

// ── Category budgets = max penalty per category (spec §1.4) ──
//
// [À CALER — atelier pondération équipe]
// Budgets MUST sum to 100. A category can never cost more than its budget, so
// the cap is automatic and the score floor stays 0.
export const CATEGORY_BUDGETS: Record<PenaltyCategory, number> = {
  colors: 30,
  typography: 30,
  spacing: 15,
  components: 15,
  naming: 10,
};

// ── Severity type + fractions (spec §1.4) ──

export type PenaltySeverity = "grave" | "moyen" | "cosmetique";

// [À CALER — atelier pondération équipe]
// The fraction of a category budget burned by ONE fault of this severity.
// `grave` is THE real dial to settle: at 1/3, THREE grave faults floor a
// category; raise the denominator (e.g. 1/4 or 1/5) if the team prefers 4–5
// faults to floor a category. `moyen` = half of grave, `cosmetique` = 1/30.
export const SEVERITY_FRACTIONS: Record<PenaltySeverity, number> = {
  grave: 1 / 3,
  moyen: 1 / 6,
  cosmetique: 1 / 30,
};

// ── Rule → severity map (spec §1.11) ──
//
// [PROPOSITION à valider — spec §1.11]
// Editable data table: every rule ID the unified Quality Check pass can emit is
// tagged grave / moyen / cosmetique. Unmapped rules default to `cosmetique` in
// the scorer (calculatePenaltyScore) so a new rule never silently tanks a score.
export const RULE_SEVERITY_MAP: Record<string, PenaltySeverity> = {
  // Colors (hc-colors.ts) — off-token, no binding = truly custom → grave
  "off-token-fill": "grave",
  "off-token-stroke": "grave",

  // Typography (hc-typography.ts) — custom text style = "poubelle" → grave;
  // off-DS font/size/weight is close-but-off → moyen
  "missing-text-style": "grave",
  "mixed-text-styles": "grave",
  "off-ds-font": "moyen",
  "mixed-fonts": "moyen",

  // Spacing (hc-spacing.ts) — off DS scale → moyen
  "off-token-spacing": "moyen",
  "missing-spacing-var": "moyen",

  // Components (hc-components.ts) — out of DS, re-implemented in dev → moyen
  "detached-instance": "moyen",
  "custom-component": "moyen",
  "broken-component": "moyen",
  "deprecated-ds-component": "moyen",
  "excessive-overrides": "moyen",

  // Dead styles / foreign bindings (dead-styles-adapter.ts) — file hygiene → cosmetique
  "dead-style": "cosmetique",
  "dead-variable": "cosmetique",
  "foreign-style": "cosmetique",
  "foreign-variable": "cosmetique",

  // Naming (linter-rules.ts) — "faux scoring" (Antoine) → cosmetique
  "vague-names": "cosmetique",
  "component-naming": "cosmetique",
  "long-names": "cosmetique",
  "special-chars": "cosmetique",
  "numbered-suffix": "cosmetique",
  "text-mismatch": "cosmetique",
};

// ── Violation category → penalty bucket (spec §1.11) ──
//
// [PROPOSITION à valider — spec §1.11]
// Maps the `category` string each engine stamps on a Violation onto one of the
// five penalty buckets. `coverage` maps to null = EXCLUDED from penalties
// (component coverage is out of scope). Dead-styles fold INTO `components`.
export const CATEGORY_OF_RULE: Record<string, PenaltyCategory | null> = {
  color: "colors",
  typography: "typography",
  spacing: "spacing",
  component: "components",
  "dead-styles": "components",
  naming: "naming",
  coverage: null, // EXCLUDED — full component coverage out of scope (spec §1.11)
};

// ── penaltyFor helper — the ONLY way a penalty number is produced ──
//
// budget × fraction, so no penalty value is ever hand-typed anywhere.
export function penaltyFor(category: PenaltyCategory, severity: PenaltySeverity): number {
  return CATEGORY_BUDGETS[category] * SEVERITY_FRACTIONS[severity];
}

// ============================================================================
// DOWNSTREAM CALIBRATION — consumed by Plans 02–04, defined here now so this
// module is never re-opened (frozen calibration surface).
// ============================================================================

// ── Accessibility gate — lot 1 (spec §1.8, consumed by Plan 03) ──
//
// [À CALER — atelier pondération équipe]
// The QC detects the accessibility frame BY NAME (standard name generated by the
// starter kit). Absent frame → global = DS score − A11Y_ABSENT_PENALTY (floor 0)
// + a forced launch of the a11y plugin.
export const A11Y_FRAME_NAME = "♿ Accessibilité"; // [À CALER] confirm exact starter-generated name
export const A11Y_ABSENT_PENALTY = 30; // [À CALER] spec §1.8 / §5.2 — confirm absolute −30 vs ×0.7

// ── Accessibility ATTESTATION gate — lot 2 (delivery hard requirement) ──
// Distinct from A11Y_ABSENT_PENALTY above: that one is the FRAME-DETECTION gate and
// stays suppressed by WR-08 (no builder emits A11Y_FRAME_NAME). THIS one is the
// designer ATTESTATION gate — the a11y checkbox in "Je livre", persisted on the Cover
// config (CoverConfig.a11yAttested) and read by the engine at scan time. While the
// attestation is absent the GLOBAL score pays this penalty (conformityScore is never
// touched) and "Marquer comme Design Done" is hard-blocked.
export const A11Y_UNATTESTED_PENALTY = 15; // [À CALER] delivery gate — designer attestation absent

// ── Governed project profiles + delivery thresholds (spec §1.7, Plan 04) ──
//
// [À CALER — Design Ops maintains this closed list]
// The profile is chosen from THIS closed list, written on the Cover, and carried
// into the export stamp — so no silent lowering of the bar. `threshold` = the
// delivery gate for "Je livre".
export interface ProjectProfile {
  id: string;
  label: string;
  threshold: number;
}

export const PROJECT_PROFILES: ProjectProfile[] = [
  { id: "app-ds", label: "App DS pure", threshold: 95 },
  { id: "ecommerce", label: "E-commerce", threshold: 85 },
  { id: "legacy", label: "Produit legacy magasin", threshold: 75 },
];

export const DEFAULT_PROFILE_ID = "ecommerce"; // [À CALER] default when none chosen on the Cover

// ── HS delivery checklist (spec §4, consumed by Plan 04) ──
//
// [PROPOSITION à valider — spec §4]
// File-hygiene / deliverable items, low weight. "Cover à jour" is the HARD GATE
// (hardGate: true, penalty 0 — it blocks delivery rather than nudging the score);
// the others are small penalties capped by HS_MAX_PENALTY.
export interface HSItem {
  id: string;
  penalty: number;
  hardGate?: boolean;
}

export const HS_ITEMS: HSItem[] = [
  { id: "cover-up-to-date", penalty: 0, hardGate: true }, // hard gate — blocks delivery, no soft penalty
  { id: "archives-page", penalty: 1 },
  { id: "obsolete-mockups-filed", penalty: 1 },
  { id: "file-named", penalty: 1 },
  { id: "specs-page", penalty: 1 },
];

// [À CALER — atelier pondération équipe] total soft-penalty cap the HS block can apply
export const HS_MAX_PENALTY = 5;
