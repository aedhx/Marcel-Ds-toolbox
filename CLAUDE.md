<!-- GSD:project-start source:PROJECT.md -->
## Project

**Marcel Toolbox V2**

Marcel Toolbox is a Carrefour-internal Figma plugin (TypeScript + esbuild, i18n FR/EN/PT-BR) that helps designers keep files clean and aligned with the Carrefour Design System. **V2 keeps every existing capability but reorganizes the plugin around the designer's actual workflow — three moments: "Je démarre · Je construis · Je livre" — and collapses the four redundant audit tools (Linter, Health Check, Dead Styles, Coverage) into a single unified Quality Check engine.**

**Core Value:** A designer opens the plugin to the moment they're in, runs **one** Quality Check scan, and gets **one** 0–100 score with **one** actionable, fixable violation list — replacing today's eight flat tabs and four duplicated scan engines, with zero capability lost.

### Constraints

- **Tech stack**: TypeScript + esbuild, Figma Plugin API (manifest `api: 1.0.0`), single runtime dep `culori`. No framework mandated. Must keep UI ⇄ sandbox `postMessage` architecture.
- **Compatibility**: Carrefour ecosystem only — depends on internal DS tokens, libraries, and component keys; will not function outside it.
- **i18n**: FR / EN / PT-BR must be preserved (and the language switch should finally be wired).
- **Migration safety**: each step must be independently shippable and reversible; users never lose a tool mid-transition.
- **Privacy**: metrics must remain anonymous, aggregated, action-only — no design content or nominative data leaves the file.
- **Performance**: single traversal must stay async/cancellable/batched to avoid freezing the UI on large files (10,000+ nodes noted as a risk).
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- TypeScript 5.9.x - Plugin main process (`Marcel/src/main.ts`, `Marcel/src/**/*.ts`)
- HTML/CSS - Plugin UI (`Marcel/src/ui.html`, inline `<style>` block, ~2600 lines)
- JavaScript (ESM) - Build configuration (`Marcel/esbuild.config.mjs`)
## Runtime
- Figma Plugin sandbox — browser-like JS runtime with restricted global scope (no Node APIs, no DOM APIs except those Figma exposes)
- UI iframe runs standard browser context (HTML/CSS/JS)
- Main thread runs in Figma's worker-like sandbox (`figma.*` globals available)
- Version: v20.9.0 (system-installed; no `.nvmrc` / `.node-version` pin in repo)
- npm
- Lockfile: `Marcel/package-lock.json` present (lockfileVersion 3)
## Frameworks
- None — vanilla TypeScript + HTML/CSS; no UI framework (no React, Vue, Svelte)
- None detected — no test framework present, no test files
- esbuild 0.27.3 — bundles `src/main.ts` → `dist/main.js` as IIFE (`Marcel/esbuild.config.mjs`)
- TypeScript 5.9.x — type-checks sources, no emit (esbuild handles transpilation)
## Key Dependencies
- `culori` 4.0.2 — CIE Delta E color-difference calculations for nearest-DS-token matching in health check (`Marcel/src/features/health-check/hc-colors.ts`). Uses `nearest`, `differenceCiede2000`, `parse` APIs.
- `@figma/plugin-typings` 1.123.x — TypeScript type definitions for the entire Figma Plugin API. Referenced as `typeRoots: ["node_modules/@figma"]` in tsconfig. Dev-dependency only; no runtime bundle.
- `esbuild` 0.27.3 — build & watch (`node esbuild.config.mjs --watch`)
## Configuration
- `target`: ES2017
- `module`: ESNext
- `moduleResolution`: bundler
- `strict`: true
- `esModuleInterop`: true
- `typeRoots`: `["node_modules/@figma"]` (exposes Figma globals — `figma`, `SceneNode`, etc.)
- `rootDir`: `src/`, `outDir`: `dist/` (esbuild ignores outDir; tsconfig used for type-checking only)
- Entry: `src/main.ts`
- Output: `dist/main.js` (IIFE format, target ES2017)
- `bundle: true` — all imports resolved and inlined
- `dist/ui.html` is a file copy of `src/ui.html` (not bundled)
- Watch mode activated with `--watch` CLI flag
- No `.env` files — zero environment variables used at runtime
- All DS tokens are hard-coded TypeScript constants in `Marcel/src/shared/tokens.ts`
- Plugin ID `1611477883396895317` is defined in `Marcel/manifest.json`
## i18n
- `fr` (French) — default fallback locale used in `nt()` function
- `en` (English)
- `pt-BR` (Brazilian Portuguese)
## Platform Requirements
- Node.js ≥ 18 (lockfile v3 requires npm 7+; tested on v20.9.0)
- `npm install` from `Marcel/` directory
- `npm run build` — single build
- `npm run watch` — incremental rebuild on save
- Figma desktop or web app
- Plugin loaded from `Marcel/manifest.json`
- Requires Figma API version `1.0.0`
- Targets `figma` editor type only (not FigJam, not Slides)
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- Feature modules: `{feature-prefix}-{responsibility}.ts` — e.g., `linter-engine.ts`, `linter-config.ts`, `hc-autofix.ts`, `a11y-contrast.ts`
- Feature prefix abbreviation: `hc-` for health-check, `a11y-` for accessibility, `linter-` for linter, `ds-` for dead-styles
- Starter-kit builder files: `{page-name}-builder.ts` — e.g., `cover-builder.ts`, `delivery-builder.ts`
- Type-only files: `{feature}-types.ts` — e.g., `hc-types.ts`, `a11y-types.ts`, `dead-styles-types.ts`
- Config files: `{feature}-config.ts` — e.g., `linter-config.ts`, `cover-config.ts`
- All filenames are kebab-case
- camelCase throughout: `runLintAsync`, `autoFixNode`, `loadAllowlist`, `findNearestColorToken`
- Verb-first naming: `load*`, `save*`, `run*`, `build*`, `check*`, `create*`, `scan*`, `reset*`
- Boolean predicates: `should*`, `has*`, `is*` — e.g., `shouldSkipNode`, `hasProjectPages`, `isLargeText`
- Internal helpers: not exported, declared with `function` keyword at module scope
- Public API: `export function` or `export async function` at bottom or scattered through file
- camelCase for all locals
- SCREAMING_SNAKE_CASE for module-level constants/regex: `DEFAULT_NAME_REGEX`, `DS_LINTER_COLOR_SET`, `CONFIDENCE_ORDER`, `ALLOWLIST_KEY`
- Prefixed temporaries in `main.ts` use feature-abbreviation prefix to avoid variable shadowing: `hcNodeId`, `hcFixResult`, `hcAllViolations`, `fixCatResult`
- PascalCase: `Violation`, `LinterConfig`, `HCResult`, `A11YResult`, `DeadStylesResult`
- Type unions: lowercase string literals — `"error" | "warning" | "info"`, `"page" | "selection" | "file"`
- Category type aliases: `HCCategory`, `A11YCategory`, `ViolationSeverity`, `DeadItemType`
- Dot-namespaced lowercase: `"sk.created"`, `"import.not_found"`, `"hc.fix.count"`, `"ds.batch.detach"`
- Feature prefix before dot: `sk.` (starter-kit), `hc.` (health-check), `fix.` (linter autofix), `import.`, `cover.`, `config.`, `ds.` (dead-styles)
## Code Style
- No Prettier or ESLint config present — no enforced formatter
- Indentation: 2 spaces (consistent across all files)
- Strings: double-quotes in most files, single-quotes in health-check and accessibility feature files — mixed, no enforced rule
- Trailing commas: present in most object/array literals
- TypeScript `strict: true` in `tsconfig.json` — strict null checks, no implicit any
- `skipLibCheck: true` (Figma plugin typings are large)
- Target: ES2017 — no optional chaining `?.` in older files, but used in newer ones
- No ESLint config
## var vs const/let
- `main.ts`: uses `var` for ~60 locals and loop variables inside `figma.ui.onmessage`
- `src/features/linter/linter-engine.ts` (993 lines): uses `var` exclusively (140 occurrences, 0 `const`/`let`)
- `src/features/linter/linter-autofix.ts`: uses `var` exclusively
- `src/features/health-check/hc-autofix.ts`: uses `var` exclusively (63 occurrences)
- `src/shared/` modules: use `const`/`let` exclusively (0 `var`)
- `src/features/health-check/` (engine, colors, spacing, coverage, components): use `const`/`let` exclusively
- `src/features/accessibility/` all files: use `const`/`let` exclusively
- `src/features/dead-styles/dead-styles-engine.ts` and `dead-styles-fix.ts`: use `const`/`let` exclusively
## Import Organization
## Section Comments
## JSDoc / TSDoc
- Complex public utility functions in `shared/` (e.g., `createStorage`, `traverseNodes`, `buildScoreResult`)
- Mathematical/algorithmic functions: contrast ratio helpers in `a11y-contrast.ts`
- Public batch operations in `dead-styles-fix.ts`
## Error Handling
- All `catch` clauses type `error` as `any` to safely access `.message`
- Error access pattern: `error?.message || "fallback string"`
- Every handler posts both a success message and an error message to the UI
- `console.error` is always called in catch blocks — it appears in Figma's plugin console
- Do not use try/catch internally — let errors propagate to `main.ts`
- Exception: `hc-autofix.ts` wraps team library calls in try/catch because `figma.teamLibrary` may be unavailable
## Logging
- Main handler catch blocks: `console.error("Feature/action description:", error)`
- Storage utility: `console.error("[Marcel] Storage operation failed for key:", e)` — prefixed with `[Marcel]`
- Team library unavailability: caught and silently skipped (`// teamLibrary may not be available`)
- No `console.log` for debug output in committed code
## i18n Convention
## Module Design
- Named exports only — no `export default` anywhere
- Types exported from their own `*-types.ts` file or alongside their module
- `DEFAULT_*` constants exported alongside their type (e.g., `DEFAULT_LINTER_CONFIG`, `DEFAULT_COVER_CONFIG`)
- All feature modules import from `../../shared/` — never from sibling features, with one exception: `dead-styles-engine.ts` imports `findNearestColorToken` from `../health-check/hc-colors` (cross-feature dependency).
## TypeScript Patterns
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## System Overview
```text
```
## Component Responsibilities
| Component | Responsibility | File |
|-----------|----------------|------|
| Main thread dispatcher | Receives all UI messages, dispatches to feature modules, posts results back | `Marcel/src/main.ts` |
| UI thread | All user interface, tab routing, state, result rendering | `Marcel/src/ui.html` |
| Message contract | Typed union of every UIMessage and PluginMessage | `Marcel/src/shared/ui-messaging.ts` |
| Node traversal | Chunked async BFS with abort token and progress callbacks | `Marcel/src/shared/node-traversal.ts` |
| Storage adapter | Namespaced `figma.clientStorage` wrapper (`marcel:{ns}:key`) | `Marcel/src/shared/storage.ts` |
| Design tokens | DS color/spacing/sizing/typography values + `DS_TOKENS[]` database | `Marcel/src/shared/tokens.ts` |
| Figma helpers | `createText`, `createFrame`, `createRect`, font loading, `figma.mixed` guards | `Marcel/src/shared/figma-helpers.ts` |
| Scoring | `calculateWeightedScore`, `buildScoreResult`, `CategoryScore` | `Marcel/src/shared/scoring.ts` |
| Violation types | `Violation`, `ViolationGroup`, `groupViolationsByRule` | `Marcel/src/shared/violation-types.ts` |
| Linter engine | 17-rule layer naming + style scan, produces `LintResult` | `Marcel/src/features/linter/linter-engine.ts` |
| Linter autofix | Renames nodes to heuristic suggestions | `Marcel/src/features/linter/linter-autofix.ts` |
| Linter config | `LinterConfig` schema, persist/load via `createStorage("linter")` | `Marcel/src/features/linter/linter-config.ts` |
| Linter allowlist | Per-node per-rule ignore list, persisted in clientStorage | `Marcel/src/features/linter/linter-allowlist.ts` |
| Health check engine | 5-category DS-token audit (colors, typography, spacing, components, coverage) | `Marcel/src/features/health-check/hc-engine.ts` |
| Health check colors | Off-token color detection, nearest-color suggestion | `Marcel/src/features/health-check/hc-colors.ts` |
| Health check typography | Off-token font size/weight/line-height violations | `Marcel/src/features/health-check/hc-typography.ts` |
| Health check spacing | Off-token padding/gap violations on auto-layout frames | `Marcel/src/features/health-check/hc-spacing.ts` |
| Health check components | Detached instance detection, async main-component resolution | `Marcel/src/features/health-check/hc-components.ts` |
| Health check coverage | DS library usage coverage classification | `Marcel/src/features/health-check/hc-coverage.ts` |
| HC autofix | Applies DS token values to violating nodes | `Marcel/src/features/health-check/hc-autofix.ts` |
| Starter kit | Orchestrates page creation for PRD and DS-library templates | `Marcel/src/features/starter-kit/starter-kit.ts` |
| Starter kit config | DS component keys + `PageDefinition` arrays for both templates | `Marcel/src/features/starter-kit/config.ts` |
| Starter kit builders | 10 individual page builders (cover, overview, delivery, …) | `Marcel/src/features/starter-kit/builders/` |
| Cover updater | Generates/updates the COVER page node from a `CoverConfig` | `Marcel/src/features/cover-updater/cover-updater.ts` |
| Dead styles engine | Two-pass scan: unused local styles + foreign variable/style bindings | `Marcel/src/features/dead-styles/dead-styles-engine.ts` |
| Dead styles actions | Deletes unused local styles/variables | `Marcel/src/features/dead-styles/dead-styles-actions.ts` |
| Dead styles fix | Detaches or replaces foreign variable/style bindings on nodes | `Marcel/src/features/dead-styles/dead-styles-fix.ts` |
| A11Y engine | Accessibility audit: alt-text, contrast, touch targets | `Marcel/src/features/accessibility/a11y-engine.ts` |
| A11Y alt text | Sets/gets `pluginData` alt text on image nodes | `Marcel/src/features/accessibility/a11y-alt-text.ts` |
| A11Y badges | Creates visual badge overlays for images missing alt text | `Marcel/src/features/accessibility/a11y-badges.ts` |
| A11Y contrast | WCAG contrast ratio checks on text/background pairs | `Marcel/src/features/accessibility/a11y-contrast.ts` |
| A11Y color blindness | Creates simulated duplicate pages for color-blindness modes | `Marcel/src/features/accessibility/a11y-color-blindness.ts` |
| A11Y touch targets | Interactive element minimum-size checks | `Marcel/src/features/accessibility/a11y-touch-targets.ts` |
## Pattern Overview
- All Figma API access is confined to the main thread (`Marcel/src/main.ts`)
- The UI thread has no direct access to `figma.*`; it communicates exclusively via `postMessage`
- The message contract is fully typed in `Marcel/src/shared/ui-messaging.ts` (`UIMessage` | `PluginMessage` discriminated unions)
- Scans are cancellable via a shared `ScanAbortToken` (`{ cancelled: boolean }`) checked between BFS chunks
- A single `traverseNodes()` in `Marcel/src/shared/node-traversal.ts` is the only traversal primitive; all feature engines call it
- Scoring is decoupled from rule execution; `Marcel/src/shared/scoring.ts` computes weighted 0–100 scores from raw violation counts
## Layers
- Purpose: Plugin panel rendered in Figma's iframe; handles all user interaction
- Location: `Marcel/src/ui.html`
- Contains: CSS custom properties (design tokens), HTML tab panels, vanilla JS event handlers and `window.onmessage` handler
- Depends on: Nothing — single self-contained file
- Used by: Figma iframe runtime
- Purpose: Single entry point for all plugin logic; routes messages to feature modules
- Location: `Marcel/src/main.ts`
- Contains: `figma.ui.onmessage` handler, i18n `NOTIF` map, cached `linterConfig`, single shared `currentAbortToken`
- Depends on: All feature modules and `Marcel/src/shared/`
- Used by: Figma plugin sandbox runtime
- Purpose: Self-contained feature implementations; each owns its engine, types, and optional config/autofix
- Location: `Marcel/src/features/{feature-name}/`
- Contains: Engine (main scan logic), types, config/storage, autofix, and (for accessibility) sub-checkers
- Depends on: `Marcel/src/shared/` utilities; some features cross-import (dead-styles-engine imports `hc-colors.ts` for token matching)
- Used by: `Marcel/src/main.ts`
- Purpose: Utilities consumed by all features; no feature-specific logic
- Location: `Marcel/src/shared/`
- Contains: Traversal, storage, design tokens, Figma helpers, scoring, violation types, message type contracts
- Depends on: `figma.*` globals (sandbox only)
- Used by: All feature modules and `Marcel/src/main.ts`
## Data Flow
### Typical Scan Request (e.g., run-linter)
### Progress Reporting
### Fix Request (e.g., fix-violation)
### Cancellation Flow
- Main thread: `linterConfig` cached in module-level `var` (re-loaded only once per session); `currentAbortToken` is a single module-level `var` replaced on each new scan
- UI thread: All UI state (current tab, scan results, config panels) managed in vanilla JS variables inside `<script>` tags in `Marcel/src/ui.html`
- Persistent state: Stored via `figma.clientStorage` through `createStorage(namespace)` wrappers; namespaced `marcel:{namespace}:{key}`
## Key Abstractions
- Purpose: Cooperative cancellation token shared between `main.ts` and any in-progress async traversal
- Examples: `Marcel/src/shared/node-traversal.ts` (checked every chunk), `Marcel/src/main.ts` (set on cancel or new scan)
- Pattern: Mutable object `{ cancelled: boolean }` — both sides hold a reference; setting `cancelled = true` stops the scan after the current chunk
- Purpose: Unified audit finding type used by linter, health-check, and accessibility features
- Examples: `Marcel/src/shared/violation-types.ts`, produced by all engine files
- Pattern: `{ id, nodeId, nodeName, nodePath, rule, severity, category, message, suggestion?, confidence?, metadata? }`
- Purpose: Namespaced wrapper over `figma.clientStorage` with quota-safe try/catch
- Examples: Used in `Marcel/src/features/linter/linter-config.ts`, `Marcel/src/features/linter/linter-allowlist.ts`, `Marcel/src/features/cover-updater/cover-config.ts`
- Pattern: `createStorage("linter")` → prefixes all keys with `marcel:linter:`
- Purpose: Single shared BFS engine for all scans; handles page/selection/file scope, chunking, and abort
- Examples: Called by `linter-engine.ts`, `hc-engine.ts`, `a11y-engine.ts`, `dead-styles-engine.ts`
- Pattern: Visitor returns `void` to recurse into children or `false` to skip children
- Purpose: Authoritative design token database (colors, spacing, sizing, typography, border-radius) keyed to the Marcel Semantic Figma file
- Examples: `Marcel/src/shared/tokens.ts`, imported by `linter-engine.ts` and `dead-styles-engine.ts`
- Pattern: `DSToken[]` array with `{ name, cssVar, value, category }` — engines build lookup Sets from this at module load
## Entry Points
- Location: `Marcel/src/main.ts` (line 141 — `figma.showUI(__html__, { width: 480, height: 640, themeColors: true })`)
- Triggers: Figma plugin launch
- Responsibilities: Show UI, register `figma.ui.onmessage`, initialize i18n and storage
- Location: `Marcel/src/ui.html` — inline `<script>` block at bottom of file
- Triggers: iframe load
- Responsibilities: Register `window.onmessage`, bind sidebar buttons, send `{ type: "ui-ready" }` to main thread
- Location: `Marcel/esbuild.config.mjs`
- Triggers: `npm run build` / `npm run watch`
- Responsibilities: Bundles `Marcel/src/main.ts` → `Marcel/dist/main.js` (IIFE, ES2017); copies `Marcel/src/ui.html` to `Marcel/dist/ui.html` unchanged
## Architectural Constraints
- **Threading:** Two isolated JS runtimes — Figma sandbox (main thread) and browser iframe (UI thread). They share no memory; all communication is `postMessage` serialization. `figma.*` is only available in the sandbox.
- **Global state:** Two module-level `var` singletons in `Marcel/src/main.ts`: `linterConfig` (cached `LinterConfig | null`) and `currentAbortToken` (`ScanAbortToken | null`). Font loading cache is a `Set` in `Marcel/src/shared/figma-helpers.ts`.
- **Circular imports:** `dead-styles-engine.ts` imports `findNearestColorToken` from `Marcel/src/features/health-check/hc-colors.ts` — a cross-feature dependency.
- **Storage quota:** `figma.clientStorage` is limited to 5MB per plugin. All storage calls are wrapped in try/catch in `Marcel/src/shared/storage.ts`.
- **Dynamic page access:** `manifest.json` declares `"documentAccess": "dynamic-page"` — pages must be loaded with `page.loadAsync()` before accessing their children in file-scope scans.
- **Font requirement:** The Ubuntu font family must be loaded with `figma.loadFontAsync` before any text creation; `Marcel/src/shared/figma-helpers.ts` caches loaded fonts in a module-level `Set`.
## Anti-Patterns
### Bypassing the message contract
### Writing a custom node traversal loop in a feature
### Using `figma.clientStorage` directly
## Error Handling
- Main thread: `try { ... } catch (error: any) { figma.ui.postMessage({ type: "feature-error", message: error?.message || "Error" }) }`
- Notifications: `figma.notify(message, { timeout, error: true })` for user-visible feedback
- Storage: `Marcel/src/shared/storage.ts` wraps all `clientStorage` calls in try/catch with `console.error` fallback; operations return `undefined` on failure, never throw
## Cross-Cutting Concerns
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, `.github/skills/`, or `.codex/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
