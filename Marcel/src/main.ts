import { createStarterKit, checkTemplateExists, resetAllPages, type TemplateType } from "./features/starter-kit/starter-kit";
import { diagnoseFileStructure, applyStructureUpgrade } from "./features/starter-kit/audit-mode";
import { runLintAsync, runLintFile, LintResult } from "./features/linter/linter-engine";
import { Violation } from "./shared/violation-types";
import { autoFixNode, autoFixAll } from "./features/linter/linter-autofix";
import { LinterConfig, loadLinterConfig, saveLinterConfig, resetLinterConfig } from "./features/linter/linter-config";
import { loadAllowlist, addToAllowlist, removeFromAllowlist, clearAllowlist, filterAllowlisted } from "./features/linter/linter-allowlist";
import { hcFixNode, hcFixAll } from "./features/health-check/hc-autofix";
import { runQualityCheck } from "./shared/quality-check-engine";
import { calculatePenaltyScore } from "./shared/scoring";
import type { ScanAbortToken } from "./shared/node-traversal";
import { generateOrUpdateCover, NO_COVER_ERROR_CODE } from "./features/cover-updater/cover-updater";
import { loadCoverConfig, saveCoverConfig } from "./features/cover-updater/cover-config";
import type { CoverConfig } from "./features/cover-updater/cover-types";
import { PROJECT_PROFILES, DEFAULT_PROFILE_ID } from "./shared/scoring-config";
import { generateDeliveryStamp } from "./features/delivery/delivery-stamp";
import type { DeliveryStampData } from "./features/delivery/delivery-stamp";
import { scanDeadStyles, scanStyleCleaner } from "./features/dead-styles/dead-styles-engine";
import { removeDeadStyle, removeAllDeadStyles } from "./features/dead-styles/dead-styles-actions";
import { detachVariableBinding, detachStyleBinding, replaceVariableBinding, batchDetachForeign, batchReplaceForeign } from "./features/dead-styles/dead-styles-fix";
import { hexToRgb } from "./shared/tokens";

import { createStorage } from "./shared/storage";

// ── i18n support ──
const globalStorage = createStorage("global");

const NOTIF: Record<string, Record<string, string>> = {
  fr: {
    "sk.created": "Starter Kit créé avec succès ✅",
    "sk.error": "Erreur lors de la création du Starter Kit",
    "audit.upgraded": "Mise à niveau appliquée ✅",
    "audit.error": "Erreur lors de la mise à niveau du fichier.",
    "pages.reset": "Pages réinitialisées → COVER",
    "import.success": "Composant importé avec succès",
    "import.not_found": "Composant introuvable. Vérifiez que la clé est valide.",
    "import.library_disabled": "La librairie Marcel DS n'est pas activée dans ce fichier. Activez-la via Assets > Team library.",
    "import.network": "Erreur réseau. Vérifiez votre connexion et réessayez.",
    "import.unknown": "Erreur lors de l'import du composant.",
    "fix.renamed": "Renommé → \"{name}\" ✅",
    "fix.layers": "{fixed} layer{s} renomme{s}",
    "fix.layers.failed": " ({failed} echoue{fs})",
    "fix.none": "Aucun layer n'a pu etre corrige.",
    "hc.fix.ok": "Corrigé ✅",
    "hc.fix.count": "{fixed} violation{s} corrigee{s}",
    "hc.fix.count.failed": " ({failed} echouee{fs})",
    "hc.fix.none": "Aucune violation n'a pu etre corrigee.",
    "hc.fix.fail": "Correction impossible : {detail} — utilisez Ignorer pour l\'exclure du score",
    "hc.fix.detail.noTextStyle": "aucun style de texte Marcel de cette taille n'est utilise dans ce fichier",
    "hc.fix.detail.notText": "ce calque n'est pas un texte",
    "hc.fix.detail.mixed": "valeurs mixtes sur ce calque",
    "hc.fix.detail.font": "police Marcel introuvable",
    "hc.fix.detail.generic": "aucune correction automatique pour cette regle",
    "hc.fix.detail.noSpacingVar": "aucune variable d'espacement Marcel n'est accessible dans ce fichier",
    "hc.fix.detail.siblingName": "un calque frere porte deja ce nom, renommez-le a la main",
    "hc.fix.detail.noSuggestion": "aucun nom ne peut etre propose pour ce calque",
    "hc.error": "Erreur lors de l'audit Health Check.",
    "cover.updated": "Cover mise à jour ✅",
    "cover.error": "Erreur lors de la mise à jour de la cover.",
    "deliver.stamp.done": "Tampon de livraison généré · Cover → Design Done ✅",
    "deliver.stamp.error": "Erreur lors de la génération du tampon de livraison.",
    "deliver.stamp.noCoverSoft": "Carte de livraison posée — aucune Cover trouvée, statut projet non mis à jour.",
    "config.saved": "Paramètres sauvegardés ✅",
    "config.reset": "Paramètres réinitialisés",
    "ds.removed": "Style supprime",
    "ds.batch": "{count} style(s) supprime(s)",
    "ds.detached": "Binding detache",
    "ds.replaced": "Remplace par {name}",
    "ds.batch.detach": "{count} binding(s) detache(s)",
    "ds.batch.replace": "{count} element(s) remplace(s)",
  },
  en: {
    "sk.created": "Starter Kit created successfully ✅",
    "sk.error": "Error creating Starter Kit",
    "audit.upgraded": "Upgrade applied ✅",
    "audit.error": "Error upgrading the file.",
    "pages.reset": "Pages reset → COVER",
    "import.success": "Component imported successfully",
    "import.not_found": "Component not found. Check that the key is valid.",
    "import.library_disabled": "The Marcel DS library is not enabled in this file. Enable it via Assets > Team library.",
    "import.network": "Network error. Check your connection and retry.",
    "import.unknown": "Error importing component.",
    "fix.renamed": "Renamed → \"{name}\" ✅",
    "fix.layers": "{fixed} layer{s} renamed",
    "fix.layers.failed": " ({failed} failed)",
    "fix.none": "No layers could be fixed.",
    "hc.fix.ok": "Fixed ✅",
    "hc.fix.count": "{fixed} violation{s} fixed",
    "hc.fix.count.failed": " ({failed} failed)",
    "hc.fix.none": "No violations could be fixed.",
    "hc.fix.fail": "Cannot fix: {detail} — use Ignore to exclude it from the score",
    "hc.fix.detail.noTextStyle": "no Marcel text style of this size is used in this file",
    "hc.fix.detail.notText": "this layer is not a text layer",
    "hc.fix.detail.mixed": "mixed values on this layer",
    "hc.fix.detail.font": "Marcel font unavailable",
    "hc.fix.detail.generic": "no automatic fix for this rule",
    "hc.fix.detail.noSpacingVar": "no Marcel spacing variable is reachable in this file",
    "hc.fix.detail.siblingName": "a sibling layer already has this name, rename it manually",
    "hc.fix.detail.noSuggestion": "no name can be suggested for this layer",
    "hc.error": "Error during Health Check audit.",
    "cover.updated": "Cover updated ✅",
    "cover.error": "Error updating the cover.",
    "deliver.stamp.done": "Delivery stamp generated · Cover → Design Done ✅",
    "deliver.stamp.error": "Error generating the delivery stamp.",
    "deliver.stamp.noCoverSoft": "Delivery stamp placed — no Cover found, project status not updated.",
    "config.saved": "Settings saved ✅",
    "config.reset": "Settings reset",
    "ds.removed": "Style deleted",
    "ds.batch": "{count} style(s) deleted",
    "ds.detached": "Binding detached",
    "ds.replaced": "Replaced with {name}",
    "ds.batch.detach": "{count} binding(s) detached",
    "ds.batch.replace": "{count} element(s) replaced",
  },
  "pt-BR": {
    "sk.created": "Starter Kit criado com sucesso ✅",
    "sk.error": "Erro ao criar o Starter Kit",
    "audit.upgraded": "Atualização aplicada ✅",
    "audit.error": "Erro ao atualizar o arquivo.",
    "pages.reset": "Páginas resetadas → COVER",
    "import.success": "Componente importado com sucesso",
    "import.not_found": "Componente não encontrado. Verifique se a chave é válida.",
    "import.library_disabled": "A biblioteca Marcel DS não está ativada neste arquivo. Ative-a em Assets > Team library.",
    "import.network": "Erro de rede. Verifique sua conexão e tente novamente.",
    "import.unknown": "Erro ao importar componente.",
    "fix.renamed": "Renomeado → \"{name}\" ✅",
    "fix.layers": "{fixed} layer{s} renomeado{s}",
    "fix.layers.failed": " ({failed} falhou)",
    "fix.none": "Nenhum layer pôde ser corrigido.",
    "hc.fix.ok": "Corrigido ✅",
    "hc.fix.count": "{fixed} violação(ões) corrigida{s}",
    "hc.fix.count.failed": " ({failed} falhou)",
    "hc.fix.none": "Nenhuma violação pôde ser corrigida.",
    "hc.fix.fail": "Não foi possível corrigir: {detail} — use Ignorar para excluí-la da pontuação",
    "hc.fix.detail.noTextStyle": "nenhum estilo de texto Marcel deste tamanho é usado neste arquivo",
    "hc.fix.detail.notText": "esta camada não é um texto",
    "hc.fix.detail.mixed": "valores mistos nesta camada",
    "hc.fix.detail.font": "fonte Marcel indisponível",
    "hc.fix.detail.generic": "nenhuma correção automática para esta regra",
    "hc.fix.detail.noSpacingVar": "nenhuma variável de espaçamento Marcel está acessível neste arquivo",
    "hc.fix.detail.siblingName": "uma camada irmã já tem este nome, renomeie manualmente",
    "hc.fix.detail.noSuggestion": "nenhum nome pode ser sugerido para esta camada",
    "hc.error": "Erro durante a auditoria Health Check.",
    "cover.updated": "Cover atualizada ✅",
    "cover.error": "Erro ao atualizar a cover.",
    "deliver.stamp.done": "Carimbo de entrega gerado · Cover → Design Done ✅",
    "deliver.stamp.error": "Erro ao gerar o carimbo de entrega.",
    "deliver.stamp.noCoverSoft": "Carimbo de entrega colocado — nenhuma Cover encontrada, status do projeto não atualizado.",
    "config.saved": "Configurações salvas ✅",
    "config.reset": "Configurações resetadas",
    "ds.removed": "Estilo excluído",
    "ds.batch": "{count} estilo(s) excluído(s)",
    "ds.detached": "Binding removido",
    "ds.replaced": "Substituido por {name}",
    "ds.batch.detach": "{count} binding(s) removido(s)",
    "ds.batch.replace": "{count} elemento(s) substituido(s)",
  }
};

// Map hcFixNode's internal `detail` strings (English, developer-facing) to the
// i18n reason shown when a single Quality Check fix fails.
function hcFixDetailKey(detail: string): string {
  var d = (detail || "").toLowerCase();
  // Raw Figma refusal (e.g. "bind failed: …"): nt() echoes unknown keys verbatim, so the
  // designer reads the actual reason instead of the generic "no auto-fix" line.
  if (d.indexOf("bind failed") !== -1) return detail;
  if (d.indexOf("text style") !== -1) return "hc.fix.detail.noTextStyle";
  if (d.indexOf("spacing variable") !== -1) return "hc.fix.detail.noSpacingVar";
  if (d.indexOf("sibling") !== -1) return "hc.fix.detail.siblingName";
  if (d.indexOf("no name suggestion") !== -1) return "hc.fix.detail.noSuggestion";
  if (d.indexOf("not a text") !== -1) return "hc.fix.detail.notText";
  if (d.indexOf("mixed") !== -1) return "hc.fix.detail.mixed";
  if (d.indexOf("font") !== -1) return "hc.fix.detail.font";
  return "hc.fix.detail.generic";
}

function nt(key: string, params?: Record<string, string | number>): string {
  let str = (NOTIF[activeLocale] || NOTIF["fr"])[key] || key;
  if (params) {
    for (const k of Object.keys(params)) {
      str = str.replace(new RegExp("\\{" + k + "\\}", "g"), String(params[k]));
    }
  }
  return str;
}

/** Switch to the page owning `node` if it differs from figma.currentPage, then select & zoom. */
async function selectAndZoom(node: SceneNode): Promise<void> {
  let ancestor: BaseNode = node;
  while (ancestor.parent && ancestor.parent.type !== "PAGE") {
    ancestor = ancestor.parent;
  }
  if (ancestor.parent && ancestor.parent.type === "PAGE" && ancestor.parent !== figma.currentPage) {
    await figma.setCurrentPageAsync(ancestor.parent as PageNode);
  }
  figma.currentPage.selection = [node];
  figma.viewport.scrollAndZoomIntoView([node]);
}

figma.showUI(__html__, { width: 480, height: 640, themeColors: true });

// ── Context detection for init-context ──
function hasProjectPages(): boolean {
  const pages = figma.root.children;
  if (pages.length === 0) return false;
  if (pages.length === 1 && pages[0].name === "Page 1") return false;
  return true;
}

// ── Active locale (i18n) ──
var activeLocale: string = "fr";

// ── Cached linter config ──
var linterConfig: LinterConfig | null = null;

// ── Abort token for cancellable scans ──
var currentAbortToken: ScanAbortToken | null = null;

// ── Last QC scan, RAW (pre-allowlist) ──
// Lets ignore/unignore re-score in memory — no second traversal (see quality-check-rescored).
// Null until the first completed Quality Check; a cancelled scan never clobbers it.
var qcLastScan: { violations: Violation[]; a11yGatePenalty: number; hsPenalty: number } | null = null;

// ── In-memory re-score after an ignore/unignore (EVP-02) ──
// Shared by "ignore-violation" and "unignore-violation" so the two paths can never diverge.
// No-op (posts nothing) when there is no cached QC scan — the legacy Linter ignore path is
// unchanged. `overall` posted here is the SANDBOX's best guess, derived from the penalties
// captured at scan time; the UI deliberately re-derives it from its own live a11yGatePenalty
// because the attestation can have been toggled since the scan.
function qcPostRescore(list: Set<string>): void {
  if (!qcLastScan) return;
  var kept = qcLastScan.violations.filter(function (v) {
    return !list.has(v.nodeId + "::" + v.rule);
  });
  var rescore = calculatePenaltyScore(kept);
  figma.ui.postMessage({
    type: "quality-check-rescored",
    overall: Math.max(0, rescore.overall - qcLastScan.a11yGatePenalty - qcLastScan.hsPenalty),
    conformityScore: rescore.overall,
    ignoredCount: qcLastScan.violations.length - kept.length,
    categories: rescore.categories,
  });
}

// ── Audit door in-flight guard (CR-02) ──
// figma.ui.onmessage does NOT serialize handlers: a second apply-structure-upgrade
// arriving while the first is suspended in an await would build the Cover twice /
// duplicate pages. The UI disables its Apply button, but the sandbox must not
// trust the UI — one structure mutation at a time.
var structureUpgradeInFlight = false;

async function getLinterConfig(): Promise<LinterConfig> {
  if (!linterConfig) {
    linterConfig = await loadLinterConfig();
  }
  return linterConfig;
}

// ── External link-out allowlist (D-07 / T-051-01) ──
// The ONLY URLs open-external may pass to figma.openExternal. A compromised/buggy
// UI could post an arbitrary phishing url; the handler opens an allowlist entry only.
// This is now a CLOSED 3-entry array matched by STRICT EQUALITY (T-e4d-01): no prefix
// matching, no startsWith, no URL parsing. A prefix match on "https://help.figma.com/"
// would let a compromised UI open any Figma help page, and a prefix match on a
// carrefour.design subdomain would let it open any Carrefour page.
const A11Y_PLUGIN_URL = "https://www.figma.com/community/plugin/1625532706318215948";
const FIGMA_CHECK_DESIGNS_URL = "https://help.figma.com/hc/en-us/articles/39592284074263-Check-designs-in-Figma";
const CARREFOUR_DELIVERY_URL = "https://carrefour.design/328eff0d7/p/38d38a-how-to-deliver-a-project";
const EXTERNAL_URL_ALLOWLIST: readonly string[] = [A11Y_PLUGIN_URL, FIGMA_CHECK_DESIGNS_URL, CARREFOUR_DELIVERY_URL];

type UiMsg = {
  type: string;
  lang?: string;
  language?: "fr" | "en" | "pt-BR";
  template?: string;
  source?: "moment" | "sk-tab";
  scope?: "page" | "selection" | "file";
  nodeId?: string;
  ruleId?: string;
  suggestion?: string;
  violations?: any[];
  category?: string;
  config?: LinterConfig;
  componentKey?: string;
  rule?: string;
  metadata?: Record<string, unknown>;
  violationId?: string;
  styleId?: string;
  itemType?: string;
  items?: any[];
  field?: string;
  paintIndex?: number;
  styleType?: string;
  status?: string;
  altText?: string;
  placement?: "new-page" | "same-page";
  url?: string;
  profileId?: string;
  attested?: boolean; // set-a11y-attested (a11y delivery gate) — untrusted, coerced at use
  ack?: boolean; // set-checkdesigns-ack (Je construis card dismissal) — untrusted, coerced at use
  selections?: { generateCover: boolean; replaceLegacyCover: boolean; addMissingPages: string[] };
  data?: DeliveryStampData;
};

type Handler = (msg: UiMsg) => void | Promise<void>;

// ── Message handlers (dispatch table) ──
const handlers: Record<string, Handler> = {
  // ── UI ready: send init-context for tab selection ──
  "ui-ready": async (msg) => {
    activeLocale = await globalStorage.getOrDefault("language", "fr");
    // Convey blank-vs-existing so Je démarre can pick its door (AUDIT-01):
    // blank file → Starter Kit ; existing file → Audit mode.
    figma.ui.postMessage({ type: "init-context", hasProjectPages: hasProjectPages() });
  },

  // ── Starter Kit handlers ──

  "create-starter-kit": async (msg) => {
    try {
      var template: TemplateType = (msg.template === "ds-library") ? "ds-library" : "prd";
      // Default unknown source to "moment" (T-053-03-INJ — closed-enum guard).
      var source = (msg.source === "sk-tab") ? "sk-tab" : "moment";
      await createStarterKit(template);
      // A fresh Starter Kit is a NEW project, so this INTENTIONALLY resets the cover
      // config to the governed default profile (DEFAULT_COVER_CONFIG) — unlike
      // generate-cover, which load-mutate-saves to preserve the chosen projectProfile.
      await saveCoverConfig({ projectStatus: "In Progress" });
      figma.ui.postMessage({ type: "starter-kit-created", source: source, template: template });
      figma.notify(nt("sk.created"), { timeout: 4000 });
    } catch (error: any) {
      console.error("Starter Kit error:", error);
      figma.ui.postMessage({
        type: "starter-kit-error",
        message: error?.message || nt("sk.error"),
      });
      figma.notify(nt("sk.error"), {
        timeout: 4000,
        error: true,
      });
    }
  },

  "check-template-exists": (msg) => {
    var tpl: TemplateType = (msg.template === "ds-library") ? "ds-library" : "prd";
    var result = checkTemplateExists(tpl);
    figma.ui.postMessage({
      type: "template-exists-result",
      exists: result.exists,
      matchCount: result.matchCount,
    });
  },

  // ── Je démarre · Audit mode handlers (spec §3 — AUDIT-01) ──

  "diagnose-file-structure": async (msg) => {
    try {
      var diagnosis = await diagnoseFileStructure();
      figma.ui.postMessage({ type: "file-structure-diagnosis", diagnosis });
    } catch (error: any) {
      console.error("Audit diagnose error:", error);
      figma.ui.postMessage({
        type: "structure-upgrade-error",
        message: error?.message || nt("audit.error"),
      });
      // WR-01: match the apply catch — a failed diagnose must never be silent.
      figma.notify(nt("audit.error"), { timeout: 4000, error: true });
    }
  },

  "apply-structure-upgrade": async (msg) => {
    // CR-02: drop duplicates while a mutation is in flight. The pending
    // request's own reply (applied OR error) re-arms the UI, so a silent
    // early return is enough — no second reply, no second mutation.
    if (structureUpgradeInFlight) return;
    structureUpgradeInFlight = true;
    try {
      var selections = msg.selections || {
        generateCover: false,
        replaceLegacyCover: false,
        addMissingPages: [],
      };
      await applyStructureUpgrade(selections);
      figma.ui.postMessage({ type: "structure-upgrade-applied" });
      figma.notify(nt("audit.upgraded"), { timeout: 4000 });
    } catch (error: any) {
      console.error("Audit upgrade error:", error);
      figma.ui.postMessage({
        type: "structure-upgrade-error",
        message: error?.message || nt("audit.error"),
      });
      figma.notify(nt("audit.error"), { timeout: 4000, error: true });
    } finally {
      structureUpgradeInFlight = false;
    }
  },

  "reset-all-pages": async (msg) => {
    try {
      await resetAllPages();
      figma.ui.postMessage({ type: "pages-reset" });
      figma.notify(nt("pages.reset"), { timeout: 4000 });
    } catch (error: any) {
      console.error("Reset error:", error);
      figma.ui.postMessage({
        type: "reset-error",
        message: error?.message || "Error",
      });
    }
  },

  // ── DS Component Import handler ──

  "import-ds-component": async (msg) => {
    try {
      const componentKey = msg.componentKey || "";
      const component = await figma.importComponentByKeyAsync(componentKey);
      const instance = component.createInstance();
      const viewportCenter = figma.viewport.center;
      instance.x = viewportCenter.x - instance.width / 2;
      instance.y = viewportCenter.y - instance.height / 2;
      await selectAndZoom(instance);
      figma.ui.postMessage({
        type: "ds-component-imported",
        componentKey: componentKey,
      });
      figma.notify(nt("import.success"), { timeout: 3000 });
    } catch (error: any) {
      console.error("Import DS component error:", error);
      const errorMsg = error?.message || String(error);

      let errorCategory: "not_found" | "library_disabled" | "network" | "unknown" = "unknown";
      let userMessage = nt("import.unknown");

      if (errorMsg.includes("not found") || errorMsg.includes("Could not find")) {
        errorCategory = "not_found";
        userMessage = nt("import.not_found");
      } else if (errorMsg.includes("library") || errorMsg.includes("not enabled") || errorMsg.includes("not published")) {
        errorCategory = "library_disabled";
        userMessage = nt("import.library_disabled");
      } else if (errorMsg.includes("network") || errorMsg.includes("timeout") || errorMsg.includes("fetch")) {
        errorCategory = "network";
        userMessage = nt("import.network");
      }

      figma.ui.postMessage({
        type: "ds-component-error",
        componentKey: msg.componentKey || "",
        message: userMessage,
        errorCategory: errorCategory,
      });
      figma.notify(userMessage, { timeout: 4000, error: true });
    }
  },

  // ── Linter handlers (PRD V2) ──

  "run-linter": async (msg) => {
    // Capture THIS scan's token in a local so a later superseding scan can never
    // clobber it or be read in our post-await checks (WR-03). Declared outside the
    // try so the catch can guard its null-out with the same identity check.
    const token: ScanAbortToken = { cancelled: false };
    try {
      // Cancel any in-progress scan.
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = token;

      var config = await getLinterConfig();
      var allowlist = await loadAllowlist();
      var scope = msg.scope || "page";

      if (scope === "file") {
        var pageResults = await runLintFile(
          config,
          token,
          function(pageName, pageIndex, totalPages) {
            figma.ui.postMessage({
              type: "traversal-progress",
              processed: pageIndex + 1,
              total: totalPages,
            });
          }
        );

        if (token.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }

        // Filter allowlisted violations from each page result
        for (var p = 0; p < pageResults.length; p++) {
          pageResults[p].result.violations = filterAllowlisted(pageResults[p].result.violations, allowlist);
        }

        if (currentAbortToken === token) currentAbortToken = null;
        figma.ui.postMessage({ type: "linter-result", result: pageResults, scope: "file" });
      } else {
        var lintResult = await runLintAsync(
          scope as "page" | "selection",
          config,
          token,
          function(processed, total) {
            figma.ui.postMessage({
              type: "traversal-progress",
              processed: processed,
              total: total,
            });
          }
        );

        if (token.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }

        // Filter allowlisted violations
        lintResult.violations = filterAllowlisted(lintResult.violations, allowlist);

        if (currentAbortToken === token) currentAbortToken = null;
        figma.ui.postMessage({ type: "linter-result", result: lintResult, scope: scope });
      }
    } catch (error: any) {
      console.error("Lint error:", error);
      if (currentAbortToken === token) currentAbortToken = null;
      figma.ui.postMessage({
        type: "linter-error",
        message: error?.message || "Error",
      });
    }
  },

  "fix-violation": async (msg) => {
    try {
      var nodeId = msg.nodeId || "";
      var suggestion = msg.suggestion;
      var fixResult = await autoFixNode(nodeId, suggestion);
      figma.ui.postMessage({ type: "fix-violation-result", result: fixResult });
      if (fixResult.success) {
        var fixedNode = await figma.getNodeByIdAsync(nodeId);
        if (fixedNode && "type" in fixedNode && fixedNode.type !== "DOCUMENT" && fixedNode.type !== "PAGE") {
          var sceneNode = fixedNode as SceneNode;
          await selectAndZoom(sceneNode);
        }
        figma.notify(nt("fix.renamed", { name: fixResult.newName }), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("Fix node error:", error);
      figma.ui.postMessage({
        type: "fix-violation-result",
        result: { success: false, newName: "" },
      });
    }
  },

  "fix-all-violations": async (msg) => {
    try {
      var allViolations = msg.violations || [];
      var fixAllResult = await autoFixAll(allViolations);

      if (fixAllResult.fixed > 0) {
        figma.notify(nt("fix.layers", { fixed: fixAllResult.fixed, s: fixAllResult.fixed > 1 ? "s" : "" }) + (fixAllResult.failed > 0 ? nt("fix.layers.failed", { failed: fixAllResult.failed, fs: fixAllResult.failed > 1 ? "s" : "" }) : ""), { timeout: 4000 });
      } else {
        figma.notify(nt("fix.none"), { timeout: 3000 });
      }

      figma.ui.postMessage({
        type: "fix-all-violations-result",
        result: fixAllResult,
        updatedLintResult: null, // No re-scan — UI handles score update via fixedNodeIds
      });
    } catch (error: any) {
      console.error("Fix all error:", error);
      figma.ui.postMessage({
        type: "fix-all-violations-result",
        result: { fixed: 0, failed: 0, fixedNodeIds: [] },
        updatedLintResult: null,
      });
    }
  },

  "fix-by-category": async (msg) => {
    try {
      var categoryViolations = msg.violations || [];
      var fixCatResult = await autoFixAll(categoryViolations);

      if (fixCatResult.fixed > 0) {
        figma.notify(nt("fix.layers", { fixed: fixCatResult.fixed, s: fixCatResult.fixed > 1 ? "s" : "" }),
          { timeout: 3000 }
        );
      }

      figma.ui.postMessage({
        type: "fix-all-violations-result",
        result: fixCatResult,
        updatedLintResult: null,
      });
    } catch (error: any) {
      console.error("Fix by category error:", error);
      figma.ui.postMessage({
        type: "fix-all-violations-result",
        result: { fixed: 0, failed: 0, fixedNodeIds: [] },
        updatedLintResult: null,
      });
    }
  },

  // ── Unified Quality Check fix-routing (Phase 4 — QC-08) ──
  // Pure routing over the proven per-family fixers; dispatch on Violation.category.
  // naming → linter autoFix*; color/colors/typography/spacing → hc Fix*.
  // component/coverage/dead-styles are non-value-fixable this phase (Pitfall 2 / RESEARCH A1).

  "fix-qc-violation": async (msg) => {
    try {
      var qcNodeId = msg.nodeId || "";
      var cat = msg.category || "";
      var qcSuccess = false;
      var qcDetail = "";
      if (cat === "naming") {
        var qcNameRes = await autoFixNode(qcNodeId, msg.suggestion);
        qcSuccess = qcNameRes.success;
        qcDetail = qcNameRes.detail || "";
      } else if (cat === "color" || cat === "colors" || cat === "typography" || cat === "spacing") {
        var qcHcRes = await hcFixNode(qcNodeId, { rule: msg.rule || "", metadata: msg.metadata });
        qcSuccess = qcHcRes.success;
        qcDetail = qcHcRes.detail || "";
      } else {
        // component / coverage / dead-styles / unknown → non-value-fixable
        qcSuccess = false;
      }
      figma.ui.postMessage({
        type: "fix-qc-violation-result",
        result: { success: qcSuccess, detail: qcDetail },
        violationId: msg.violationId,
      });
      if (qcSuccess) {
        var qcFixedNode = await figma.getNodeByIdAsync(qcNodeId);
        if (qcFixedNode && "type" in qcFixedNode && qcFixedNode.type !== "DOCUMENT" && qcFixedNode.type !== "PAGE") {
          await selectAndZoom(qcFixedNode as SceneNode);
        }
        figma.notify(nt("hc.fix.ok"), { timeout: 2000 });
      } else {
        // A failed single fix must never be silent: the UI only re-arms the button,
        // so the sandbox is the one place that can tell the designer WHY.
        figma.notify(nt("hc.fix.fail", { detail: nt(hcFixDetailKey(qcDetail)) }), {
          timeout: 4000,
          error: true,
        });
      }
    } catch (error: any) {
      // An exception (e.g. Figma refusing a rename/bind on this node) was the
      // last silent failure path: log every field and NOTIFY, never just re-arm.
      var qcErrMsg = String(error?.message || error || "unknown error");
      console.error("QC fix node error:", qcErrMsg, error?.code || "", error?.stack || error);
      figma.ui.postMessage({
        type: "fix-qc-violation-result",
        result: { success: false, detail: qcErrMsg },
        violationId: msg.violationId || "",
      });
      figma.notify(nt("hc.fix.fail", { detail: qcErrMsg }), { timeout: 5000, error: true });
    }
  },

  "fix-qc-all": async (msg) => {
    try {
      var qcAllVs = msg.violations || [];
      var qcAllNaming = qcAllVs.filter((v) => v.category === "naming");
      var qcAllHc = qcAllVs.filter((v) => v.category === "color" || v.category === "colors" || v.category === "typography" || v.category === "spacing");
      var qcAllNameRes = await autoFixAll(qcAllNaming);
      var qcAllHcRes = await hcFixAll(qcAllHc);
      var qcAllFixed = qcAllNameRes.fixed + qcAllHcRes.fixed;

      if (qcAllFixed > 0) {
        figma.notify(nt("hc.fix.count", { fixed: qcAllFixed, s: qcAllFixed > 1 ? "s" : "" }), { timeout: 4000 });
      } else {
        figma.notify(nt("hc.fix.none"), { timeout: 3000 });
      }

      figma.ui.postMessage({
        type: "fix-qc-bulk-result",
        result: {
          fixed: qcAllFixed,
          failed: qcAllNameRes.failed + qcAllHcRes.failed,
          fixedNodeIds: qcAllNameRes.fixedNodeIds.concat(qcAllHcRes.fixedNodeIds),
        },
      });
    } catch (error: any) {
      console.error("QC fix all error:", error);
      figma.ui.postMessage({
        type: "fix-qc-bulk-result",
        result: { fixed: 0, failed: 0, fixedNodeIds: [] },
      });
    }
  },

  "fix-qc-by-category": async (msg) => {
    try {
      var qcCatVs = msg.violations || [];
      var qcCatNaming = qcCatVs.filter((v) => v.category === "naming");
      var qcCatHc = qcCatVs.filter((v) => v.category === "color" || v.category === "colors" || v.category === "typography" || v.category === "spacing");
      var qcCatNameRes = await autoFixAll(qcCatNaming);
      var qcCatHcRes = await hcFixAll(qcCatHc);
      var qcCatFixed = qcCatNameRes.fixed + qcCatHcRes.fixed;

      if (qcCatFixed > 0) {
        figma.notify(nt("hc.fix.count", { fixed: qcCatFixed, s: qcCatFixed > 1 ? "s" : "" }), { timeout: 3000 });
      } else {
        // Same contract as fix-qc-all: a no-op bulk fix is reported, never silent.
        figma.notify(nt("hc.fix.none"), { timeout: 3000 });
      }

      figma.ui.postMessage({
        type: "fix-qc-bulk-result",
        result: {
          fixed: qcCatFixed,
          failed: qcCatNameRes.failed + qcCatHcRes.failed,
          fixedNodeIds: qcCatNameRes.fixedNodeIds.concat(qcCatHcRes.fixedNodeIds),
        },
      });
    } catch (error: any) {
      console.error("QC fix by category error:", error);
      figma.ui.postMessage({
        type: "fix-qc-bulk-result",
        result: { fixed: 0, failed: 0, fixedNodeIds: [] },
      });
    }
  },

  "ignore-violation": async (msg) => {
    try {
      var updatedList = await addToAllowlist(msg.nodeId || "", msg.ruleId || "");
      figma.ui.postMessage({ type: "allowlist-updated", allowlist: Array.from(updatedList) });
      qcPostRescore(updatedList);
    } catch (error: any) {
      console.error("Ignore violation error:", error);
    }
  },

  "unignore-violation": async (msg) => {
    try {
      var updatedList2 = await removeFromAllowlist(msg.nodeId || "", msg.ruleId || "");
      figma.ui.postMessage({ type: "allowlist-updated", allowlist: Array.from(updatedList2) });
      qcPostRescore(updatedList2);
    } catch (error: any) {
      console.error("Unignore violation error:", error);
    }
  },

  "load-allowlist": async (msg) => {
    try {
      var list = await loadAllowlist();
      figma.ui.postMessage({ type: "allowlist-loaded", allowlist: Array.from(list) });
    } catch (error: any) {
      console.error("Load allowlist error:", error);
    }
  },

  "clear-allowlist": async (msg) => {
    try {
      await clearAllowlist();
      figma.ui.postMessage({ type: "allowlist-updated", allowlist: [] });
    } catch (error: any) {
      console.error("Clear allowlist error:", error);
    }
  },

  // ── Unified Quality Check handler (D-06/D-09) ──
  // Wires runQualityCheck() into the dispatch so the unified engine is genuinely
  // invocable end-to-end. Uses the former HC scan handler pattern:
  // single currentAbortToken supersede, unified progress post, discard-on-cancel.

  "run-quality-check": async (msg) => {
    // Capture THIS scan's token in a local so a superseding scan can't clobber it (WR-03).
    const token: ScanAbortToken = { cancelled: false };
    try {
      // Cancel any in-progress scan (single-token supersede, D-09)
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = token;

      const scope = msg.scope || "page";
      // QC-09 / EVP-01: the ignore allowlist is loaded BEFORE the scan and handed to the
      // engine, which filters it out UPSTREAM of calculatePenaltyScore — an ignored
      // violation is hidden AND stops burning penalty points.
      var qcAllowlist = await loadAllowlist();
      const result = await runQualityCheck(
        scope as "page" | "selection" | "file",
        token,
        (phase, processed, total) => {
          figma.ui.postMessage({
            type: "quality-check-progress",
            phase,
            processed,
            total,
          });
        },
        qcAllowlist
      );

      if (currentAbortToken === token) currentAbortToken = null;

      // Discard-on-cancel (D-09): runQualityCheck returns null on cancel —
      // never post a partial score.
      if (result) {
        // Cache the RAW (pre-allowlist) scan so ignore/unignore can re-score in memory.
        qcLastScan = {
          violations: result.violations.concat(result.ignoredViolations),
          a11yGatePenalty: result.a11yGatePenalty || 0,
          hsPenalty: result.hsPenalty || 0,
        };
        figma.ui.postMessage({ type: "quality-check-result", result });
      } else {
        figma.ui.postMessage({ type: "scan-cancelled" });
      }
    } catch (error: any) {
      console.error("Quality Check error:", error);
      if (currentAbortToken === token) currentAbortToken = null;
      figma.ui.postMessage({
        type: "quality-check-error",
        message: error?.message || nt("hc.error"),
      });
    }
  },

  // ── Cover Updater handlers ──

  "generate-cover": async (msg) => {
    try {
      // Load-mutate-save so the governed projectProfile (set via set-project-profile,
      // 05.2-05) survives the round-trip. saveCoverConfig OVERWRITES the whole stored
      // object, so a fresh { projectStatus } would silently drop projectProfile and
      // reset the Je livre gate to DEFAULT_PROFILE_ID behind the designer's back (CR-02).
      const config: CoverConfig = await loadCoverConfig();
      config.projectStatus = msg.status || "In Progress";
      // Generate FIRST, persist only once the Cover really changed — keeps
      // clientStorage consistent with the file when the flip fails (CR-01).
      await generateOrUpdateCover(config);
      await saveCoverConfig(config);
      figma.ui.postMessage({ type: "cover-generated" });
      figma.notify(nt("cover.updated"), { timeout: 3000 });
    } catch (error: any) {
      console.error("Cover error:", error);
      figma.ui.postMessage({ type: "cover-error", message: error?.message || nt("cover.error") });
    }
  },

  "load-cover-config": async (msg) => {
    try {
      const coverCfg = await loadCoverConfig();
      // Piggy-back aggregate document identifiers so the UI can build the delivery
      // stamp WITHOUT reading figma.* (EXPORT-01). No design content — just the
      // file + current page name (privacy-safe).
      figma.ui.postMessage({
        type: "cover-config-loaded",
        config: coverCfg,
        fileName: figma.root.name,
        pageName: figma.currentPage.name,
      });
    } catch (error: any) {
      console.error("Load cover config error:", error);
    }
  },

  // ── Governed project profile (spec §1.7 — PROFILE-01) ──
  // Forward the closed profile list from the single calibration source (scoring-config)
  // + the currently selected profile so the UI never hardcodes thresholds.
  "load-delivery-profile-config": async (msg) => {
    try {
      const coverCfg = await loadCoverConfig();
      const selectedProfileId =
        coverCfg.projectProfile && PROJECT_PROFILES.some((p) => p.id === coverCfg.projectProfile)
          ? coverCfg.projectProfile
          : DEFAULT_PROFILE_ID;
      figma.ui.postMessage({
        type: "delivery-profile-config",
        profiles: PROJECT_PROFILES,
        selectedProfileId,
      });
    } catch (error: any) {
      console.error("Load delivery profile config error:", error);
    }
  },

  // Persist the chosen delivery profile on the cover config. The profileId is
  // untrusted (UI → sandbox): reject anything not in the governed closed list
  // before saving (threat T-052-09).
  "set-project-profile": async (msg) => {
    try {
      const isGoverned = PROJECT_PROFILES.some((p) => p.id === msg.profileId);
      if (!isGoverned) {
        console.error("set-project-profile: rejected non-governed profileId");
        return;
      }
      const coverCfg = await loadCoverConfig();
      coverCfg.projectProfile = msg.profileId;
      await saveCoverConfig(coverCfg);
      figma.ui.postMessage({
        type: "delivery-profile-config",
        profiles: PROJECT_PROFILES,
        selectedProfileId: msg.profileId,
      });
    } catch (error: any) {
      console.error("Set project profile error:", error);
    }
  },

  // Persist the designer's accessibility attestation on the cover config (a11y
  // delivery gate, lot 2). `msg.attested` is untrusted UI input (threat T-QA-01):
  // boolean-coerce it and read no other field. Load-mutate-save so projectStatus /
  // projectProfile cannot be clobbered. No reply is posted — the UI updates
  // optimistically and re-reads on the next `load-cover-config`.
  "set-a11y-attested": async (msg) => {
    try {
      const coverCfg = await loadCoverConfig();
      coverCfg.a11yAttested = msg.attested === true;
      await saveCoverConfig(coverCfg);
    } catch (error: any) {
      console.error("Set a11y attested error:", error);
    }
  },

  // ── Je construis Check-designs card dismissal (CD-03) ──
  // `msg.ack` is untrusted UI input (threat T-e4d-02): boolean-coerce it and read no
  // other field. Load-mutate-save so projectStatus / projectProfile / a11yAttested
  // cannot be clobbered. No reply and no notification — a card dismissal is not an
  // action worth a toast; the UI re-reads on the next `load-cover-config`.
  "set-checkdesigns-ack": async (msg) => {
    try {
      const coverCfg = await loadCoverConfig();
      coverCfg.checkDesignsAck = msg.ack === true;
      await saveCoverConfig(coverCfg);
    } catch (error: any) {
      console.error("Set check-designs ack error:", error);
    }
  },

  // ── Export delivery stamp (spec §2 — EXPORT-01) ──
  // At the "Je livre" gate: generate the in-file aggregate-only badge AND flip the
  // Cover to "Design Done" in one action (spec §2: stamp + Design Done happen
  // simultaneously). The stamp data is untrusted (UI → sandbox) but carries only
  // aggregate numeric/label fields — no node references (threat T-052-11). The Cover
  // flip goes through the existing validated generateOrUpdateCover path (T-052-12).
  "generate-delivery-stamp": async (msg) => {
    try {
      // Validate the untrusted UI payload BEFORE any destructive work (WR-07):
      // a malformed message must never delete the existing badge. The outer catch
      // posts delivery-stamp-error + notifies.
      const d = msg.data;
      if (
        !d ||
        typeof d.dsScore !== "number" ||
        typeof d.pass !== "boolean" ||
        typeof d.threshold !== "number" ||
        typeof d.legacyDebtPercent !== "number"
      ) {
        throw new Error("invalid stamp data");
      }

      // STAMP FIRST (D-01/2): the badge is ALWAYS placed. Only a stamp failure
      // is a hard error — the outer catch handles it below.
      await generateDeliveryStamp(d as DeliveryStampData);

      // Cover flip is best-effort (AUDIT-01 soft gate): flip the Cover to Design
      // Done in its OWN try/catch so a missing/broken Cover never blocks delivery.
      try {
        var coverCfg = await loadCoverConfig();
        coverCfg.projectStatus = "Design Done";
        // Flip FIRST, persist ONLY on success: generateOrUpdateCover throws
        // NO_COVER before any mutation, so saving beforehand would leave
        // clientStorage at "Design Done" for a file that has no Cover (CR-01).
        await generateOrUpdateCover(coverCfg);
        await saveCoverConfig(coverCfg);

        figma.ui.postMessage({ type: "delivery-stamp-generated", coverFlipped: true });
        figma.notify(nt("deliver.stamp.done"), { timeout: 3000 });
      } catch (coverErr: any) {
        // No Cover (or any other Cover error): the stamp IS placed, so the
        // "done" view must still show. Notify SOFTLY (no error:true) — the Cover
        // flip is non-blocking; only the stamp itself is a hard gate.
        if (coverErr?.code !== NO_COVER_ERROR_CODE) {
          console.error("Delivery cover flip error:", coverErr);
        }
        // coverFlipped:false tells the UI NOT to promote its local gate state —
        // the notification says the status was not updated, so nothing may
        // claim "Design Done" (CR-01).
        figma.ui.postMessage({ type: "delivery-stamp-generated", coverFlipped: false });
        figma.notify(nt("deliver.stamp.noCoverSoft"), { timeout: 4000 });
      }
    } catch (error: any) {
      // Figma's console prints a bare "Error" for some API rejections — spell out
      // every field we have so the next report is actionable.
      console.error(
        "Delivery stamp error:",
        error?.message || "(no message)",
        error?.code || "",
        error?.stack || error
      );
      figma.ui.postMessage({
        type: "delivery-stamp-error",
        message: nt("deliver.stamp.error"),
      });
      figma.notify(nt("deliver.stamp.error"), { timeout: 4000, error: true });
    }
  },

  // ── External link-out (D-07 / SC-5) — hardened against arbitrary urls (T-051-01) ──
  "open-external": async (msg) => {
    try {
      // Strict-equality membership (indexOf === ES2017-safe). The value handed to
      // figma.openExternal is the MATCHED ALLOWLIST ENTRY, never the untrusted msg.url.
      // `msg.url` is optional on the flat UiMsg type; a missing/non-string value
      // narrows to "" which is never an allowlist entry → rejected.
      const requestedUrl = typeof msg.url === "string" ? msg.url : "";
      const allowed = EXTERNAL_URL_ALLOWLIST.indexOf(requestedUrl);
      if (allowed !== -1) {
        figma.openExternal(EXTERNAL_URL_ALLOWLIST[allowed]);
      } else {
        console.error("open-external: rejected non-allowlisted url");
      }
    } catch (error: any) {
      console.error("Open external error:", error);
    }
  },

  // ── Dead Styles handlers ──

  "scan-dead-styles": async (msg) => {
    // Capture THIS scan's token in a local so a superseding scan can't clobber it (WR-03).
    const token: ScanAbortToken = { cancelled: false };
    try {
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = token;

      const result = await scanDeadStyles(token, (phase, current, total) => {
        figma.ui.postMessage({ type: "dead-styles-progress", phase, current, total });
      });

      if (token.cancelled) {
        figma.ui.postMessage({ type: "scan-cancelled" });
        return;
      }

      if (currentAbortToken === token) currentAbortToken = null;
      figma.ui.postMessage({ type: "dead-styles-result", result });
    } catch (error: any) {
      console.error("Dead styles scan error:", error);
      if (currentAbortToken === token) currentAbortToken = null;
      figma.ui.postMessage({
        type: "dead-styles-error",
        message: error?.message || "Error",
      });
    }
  },

  "remove-dead-style": async (msg) => {
    try {
      const result = await removeDeadStyle(
        msg.styleId || "",
        (msg.itemType || "PAINT") as "PAINT" | "TEXT" | "EFFECT" | "VARIABLE"
      );
      figma.ui.postMessage({
        type: "dead-style-removed",
        styleId: msg.styleId || "",
        success: result.success,
        error: result.error,
      });
      if (result.success) {
        figma.notify(nt("ds.removed"), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("Remove dead style error:", error);
      figma.ui.postMessage({
        type: "dead-style-removed",
        styleId: msg.styleId || "",
        success: false,
        error: error?.message || "Erreur lors de la suppression.",
      });
    }
  },

  "remove-all-dead-styles": async (msg) => {
    try {
      const result = await removeAllDeadStyles(msg.items || []);
      figma.ui.postMessage({ type: "dead-styles-batch-removed", result });
      if (result.removed > 0) {
        figma.notify(nt("ds.batch", { count: result.removed }), { timeout: 3000 });
      }
    } catch (error: any) {
      console.error("Remove all dead styles error:", error);
      figma.ui.postMessage({
        type: "dead-styles-batch-removed",
        result: { removed: 0, failed: 0 },
      });
    }
  },

  // ── Style Cleaner handlers (extended Dead Styles) ──

  "scan-style-cleaner": async (msg) => {
    // Capture THIS scan's token in a local so a superseding scan can't clobber it (WR-03).
    const token: ScanAbortToken = { cancelled: false };
    try {
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = token;

      const result = await scanStyleCleaner(token, (phase, current, total) => {
        figma.ui.postMessage({ type: "dead-styles-progress", phase, current, total });
      });

      if (token.cancelled) {
        figma.ui.postMessage({ type: "scan-cancelled" });
        return;
      }

      if (currentAbortToken === token) currentAbortToken = null;
      figma.ui.postMessage({ type: "style-cleaner-result", result });
    } catch (error: any) {
      console.error("Style cleaner scan error:", error);
      if (currentAbortToken === token) currentAbortToken = null;
      figma.ui.postMessage({
        type: "style-cleaner-error",
        message: error?.message || "Error",
      });
    }
  },

  "detach-foreign-item": async (msg) => {
    try {
      var detachNodeId = msg.nodeId || "";
      var detachField = msg.field || "";
      var detachPaintIndex = msg.paintIndex;
      var detachItemId = (msg as any).itemId || "";
      var detachStyleType = msg.styleType as "PAINT" | "TEXT" | "EFFECT" | undefined;
      var detachResult;

      if (detachStyleType) {
        // Style binding (fillStyleId, strokeStyleId, textStyleId, effectStyleId)
        detachResult = await detachStyleBinding(detachNodeId, detachStyleType, detachField);
      } else {
        // Variable binding (fills, strokes, paddingLeft, etc.)
        detachResult = await detachVariableBinding(detachNodeId, detachField, detachPaintIndex);
      }

      figma.ui.postMessage({
        type: "foreign-item-fixed",
        itemId: detachItemId,
        action: "detach",
        success: detachResult.success,
        error: detachResult.success ? undefined : detachResult.detail,
      });

      if (detachResult.success) {
        figma.notify(nt("ds.detached"), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("Detach foreign item error:", error);
      figma.ui.postMessage({
        type: "foreign-item-fixed",
        itemId: "",
        action: "detach",
        success: false,
        error: error?.message || "Detach failed",
      });
    }
  },

  "replace-foreign-item": async (msg) => {
    try {
      var replaceNodeId = msg.nodeId || "";
      var replaceField = msg.field || "";
      var replacePaintIndex = msg.paintIndex;
      var replaceItemId = (msg as any).itemId || "";
      var replaceStyleType = msg.styleType as "PAINT" | "TEXT" | "EFFECT" | undefined;
      var replaceSuggestion = (msg as any).suggestion as { tokenName: string; tokenHex?: string; variableKey?: string } | undefined;
      var replaceResult = { success: false, detail: "No suggestion" };

      if (replaceSuggestion) {
        // For style bindings, detach the style first
        if (replaceStyleType) {
          await detachStyleBinding(replaceNodeId, replaceStyleType, replaceField);
        }

        // Determine the paint field for color replacement
        var colorField = replaceField;
        if (replaceField === "fillStyleId") colorField = "fills";
        else if (replaceField === "strokeStyleId") colorField = "strokes";

        // Strategy 1: Bind the DS variable directly (preferred — preserves variable binding)
        if (replaceSuggestion.variableKey && (colorField === "fills" || colorField === "strokes")) {
          replaceResult = await replaceVariableBinding(replaceNodeId, colorField, replaceSuggestion.variableKey, replacePaintIndex);
        }

        // Strategy 2: Fallback to hex color if variable binding failed or no key
        if (!replaceResult.success && replaceSuggestion.tokenHex && (colorField === "fills" || colorField === "strokes")) {
          var targetRgb = hexToRgb(replaceSuggestion.tokenHex);
          var rNode = await figma.getNodeByIdAsync(replaceNodeId);

          if (rNode && rNode.type !== "DOCUMENT" && rNode.type !== "PAGE") {
            var rScene = rNode as SceneNode;

            if (colorField === "fills" && "fills" in rScene) {
              var rFills = (rScene as MinimalFillsMixin).fills;
              if (rFills !== figma.mixed) {
                var newFills: Paint[] = [];
                for (var fi = 0; fi < rFills.length; fi++) {
                  if (replacePaintIndex !== undefined && fi !== replacePaintIndex) {
                    newFills.push(rFills[fi]);
                  } else if (rFills[fi].type === "SOLID") {
                    var dPaint = figma.variables.setBoundVariableForPaint(rFills[fi] as SolidPaint, "color", null as any);
                    newFills.push({ type: "SOLID", color: targetRgb, opacity: (dPaint as SolidPaint).opacity, visible: dPaint.visible, blendMode: dPaint.blendMode });
                  } else {
                    newFills.push(rFills[fi]);
                  }
                }
                (rScene as MinimalFillsMixin).fills = newFills;
                replaceResult = { success: true, detail: replaceSuggestion.tokenHex };
              }
            } else if (colorField === "strokes" && "strokes" in rScene) {
              var rStrokes = (rScene as MinimalStrokesMixin).strokes;
              var newStrokes: Paint[] = [];
              for (var si = 0; si < rStrokes.length; si++) {
                if (replacePaintIndex !== undefined && si !== replacePaintIndex) {
                  newStrokes.push(rStrokes[si]);
                } else if (rStrokes[si].type === "SOLID") {
                  var dStroke = figma.variables.setBoundVariableForPaint(rStrokes[si] as SolidPaint, "color", null as any);
                  newStrokes.push({ type: "SOLID", color: targetRgb, opacity: (dStroke as SolidPaint).opacity, visible: dStroke.visible, blendMode: dStroke.blendMode });
                } else {
                  newStrokes.push(rStrokes[si]);
                }
              }
              (rScene as MinimalStrokesMixin).strokes = newStrokes;
              replaceResult = { success: true, detail: replaceSuggestion.tokenHex };
            }
          }
        }
      }

      figma.ui.postMessage({
        type: "foreign-item-fixed",
        itemId: replaceItemId,
        action: "replace",
        success: replaceResult.success,
        error: replaceResult.success ? undefined : replaceResult.detail,
      });

      if (replaceResult.success && replaceSuggestion) {
        figma.notify(nt("ds.replaced", { name: replaceSuggestion.tokenName }), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("Replace foreign item error:", error);
      figma.ui.postMessage({
        type: "foreign-item-fixed",
        itemId: "",
        action: "replace",
        success: false,
        error: error?.message || "Replace failed",
      });
    }
  },

  "batch-detach-foreign": async (msg) => {
    try {
      var batchDetachItems = msg.items || [];
      var batchDetachResult = await batchDetachForeign(batchDetachItems);
      figma.ui.postMessage({
        type: "batch-foreign-result",
        action: "detach",
        result: { count: batchDetachResult.detached, failed: batchDetachResult.failed },
      });
      if (batchDetachResult.detached > 0) {
        figma.notify(nt("ds.batch.detach", { count: batchDetachResult.detached }), { timeout: 3000 });
      }
    } catch (error: any) {
      console.error("Batch detach error:", error);
      figma.ui.postMessage({
        type: "batch-foreign-result",
        action: "detach",
        result: { count: 0, failed: 0 },
      });
    }
  },

  "batch-replace-foreign": async (msg) => {
    try {
      var batchReplaceItems = msg.items || [];
      var batchReplaceResult = await batchReplaceForeign(batchReplaceItems);
      figma.ui.postMessage({
        type: "batch-foreign-result",
        action: "replace",
        result: { count: batchReplaceResult.replaced, failed: batchReplaceResult.failed },
      });
      if (batchReplaceResult.replaced > 0) {
        figma.notify(nt("ds.batch.replace", { count: batchReplaceResult.replaced }), { timeout: 3000 });
      }
    } catch (error: any) {
      console.error("Batch replace error:", error);
      figma.ui.postMessage({
        type: "batch-foreign-result",
        action: "replace",
        result: { count: 0, failed: 0 },
      });
    }
  },

  "cancel-scan": (msg) => {
    if (currentAbortToken) {
      currentAbortToken.cancelled = true;
      currentAbortToken = null;
    }
    figma.ui.postMessage({ type: "scan-cancelled" });
  },

  "navigate-to-node": async (msg) => {
    try {
      var navNodeId = msg.nodeId || "";
      var navNode = await figma.getNodeByIdAsync(navNodeId);
      if (navNode && "type" in navNode && navNode.type !== "DOCUMENT" && navNode.type !== "PAGE") {
        var navScene = navNode as SceneNode;
        await selectAndZoom(navScene);
      }
    } catch (error: any) {
      console.error("Navigate error:", error);
    }
  },

  // ── Linter settings handlers ──

  "load-linter-config": async (msg) => {
    var loadedConfig = await getLinterConfig();
    figma.ui.postMessage({ type: "linter-config-loaded", config: loadedConfig });
  },

  "save-linter-config": async (msg) => {
    try {
      if (msg.config) {
        linterConfig = msg.config;
        await saveLinterConfig(msg.config);
        figma.ui.postMessage({ type: "linter-config-saved" });
        figma.notify(nt("config.saved"), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("Save config error:", error);
    }
  },

  "reset-linter-config": async (msg) => {
    try {
      linterConfig = await resetLinterConfig();
      figma.ui.postMessage({ type: "linter-config-loaded", config: linterConfig });
      figma.notify(nt("config.reset"), { timeout: 2000 });
    } catch (error: any) {
      console.error("Reset config error:", error);
    }
  },

  // ── i18n language handlers (MIGR-05) ──

  "get-language": (msg) => {
    figma.ui.postMessage({ type: "language", language: activeLocale });
  },

  "set-language": async (msg) => {
    try {
      var lang = (msg.language === "en" || msg.language === "pt-BR") ? msg.language : "fr";
      activeLocale = lang;
      await globalStorage.set("language", lang);
      figma.ui.postMessage({ type: "language", language: lang });
    } catch (error: any) {
      console.error("Set language error:", error);
    }
  },
};

figma.ui.onmessage = async (msg: UiMsg) => {
  const handler = handlers[msg.type];
  if (handler) await handler(msg);
};
