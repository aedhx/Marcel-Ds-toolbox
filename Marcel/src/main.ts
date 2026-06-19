import { createStarterKit, checkTemplateExists, resetAllPages } from "./features/starter-kit/starter-kit";
import { runLintAsync, runLintFile, LintResult } from "./features/linter/linter-engine";
import { Violation } from "./shared/violation-types";
import { autoFixNode, autoFixAll } from "./features/linter/linter-autofix";
import { LinterConfig, loadLinterConfig, saveLinterConfig, resetLinterConfig } from "./features/linter/linter-config";
import { loadAllowlist, addToAllowlist, removeFromAllowlist, clearAllowlist, filterAllowlisted } from "./features/linter/linter-allowlist";
import { runHealthCheck } from "./features/health-check/hc-engine";
import { hcFixNode, hcFixAll } from "./features/health-check/hc-autofix";
import { runQualityCheck } from "./shared/quality-check-engine";
import type { ScanAbortToken } from "./shared/node-traversal";
import { generateOrUpdateCover } from "./features/cover-updater/cover-updater";
import { loadCoverConfig, saveCoverConfig } from "./features/cover-updater/cover-config";
import type { CoverConfig } from "./features/cover-updater/cover-types";
import { scanDeadStyles, scanStyleCleaner } from "./features/dead-styles/dead-styles-engine";
import { removeDeadStyle, removeAllDeadStyles } from "./features/dead-styles/dead-styles-actions";
import { detachVariableBinding, detachStyleBinding, replaceVariableBinding, batchDetachForeign, batchReplaceForeign } from "./features/dead-styles/dead-styles-fix";
import { hexToRgb } from "./shared/tokens";
import { runAccessibilityAudit } from "./features/accessibility/a11y-engine";
import { setAltText, getAltText } from "./features/accessibility/a11y-alt-text";
import { createAltTextBadges, cleanupBadges } from "./features/accessibility/a11y-badges";
import { simulateColorBlindness } from "./features/accessibility/a11y-color-blindness";


import { createStorage } from "./shared/storage";

// ── i18n support ──
const globalStorage = createStorage("global");

const NOTIF: Record<string, Record<string, string>> = {
  fr: {
    "sk.created": "Starter Kit créé avec succès ✅",
    "sk.error": "Erreur lors de la création du Starter Kit",
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
    "hc.error": "Erreur lors de l'audit Health Check.",
    "cover.updated": "Cover mise à jour ✅",
    "cover.error": "Erreur lors de la mise à jour de la cover.",
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
    "hc.error": "Error during Health Check audit.",
    "cover.updated": "Cover updated ✅",
    "cover.error": "Error updating the cover.",
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
    "hc.error": "Erro durante a auditoria Health Check.",
    "cover.updated": "Cover atualizada ✅",
    "cover.error": "Erro ao atualizar a cover.",
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

async function getLinterConfig(): Promise<LinterConfig> {
  if (!linterConfig) {
    linterConfig = await loadLinterConfig();
  }
  return linterConfig;
}

type UiMsg = {
  type: string;
  lang?: string;
  language?: "fr" | "en" | "pt-BR";
  template?: string;
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
};

type Handler = (msg: UiMsg) => void | Promise<void>;

// ── Message handlers (dispatch table) ──
const handlers: Record<string, Handler> = {
  // ── UI ready: send init-context for tab selection ──
  "ui-ready": async (msg) => {
    activeLocale = await globalStorage.getOrDefault("language", "fr");
    figma.ui.postMessage({ type: "init-context" });
  },

  // ── Starter Kit handlers ──

  "create-starter-kit": async (msg) => {
    try {
      var template = (msg.template === "ds-library") ? "ds-library" : "prd";
      await createStarterKit(template);
      await saveCoverConfig({ projectStatus: "In Progress" });
      figma.ui.postMessage({ type: "starter-kit-created" });
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
    var tpl = (msg.template === "ds-library") ? "ds-library" : "prd";
    var result = checkTemplateExists(tpl);
    figma.ui.postMessage({
      type: "template-exists-result",
      exists: result.exists,
      matchCount: result.matchCount,
    });
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
    try {
      // Cancel any in-progress scan
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = { cancelled: false };

      var config = await getLinterConfig();
      var allowlist = await loadAllowlist();
      var scope = msg.scope || "page";

      if (scope === "file") {
        var pageResults = await runLintFile(
          config,
          currentAbortToken,
          function(pageName, pageIndex, totalPages) {
            figma.ui.postMessage({
              type: "traversal-progress",
              processed: pageIndex + 1,
              total: totalPages,
            });
          }
        );

        if (currentAbortToken.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }

        // Filter allowlisted violations from each page result
        for (var p = 0; p < pageResults.length; p++) {
          pageResults[p].result.violations = filterAllowlisted(pageResults[p].result.violations, allowlist);
        }

        currentAbortToken = null;
        figma.ui.postMessage({ type: "linter-result", result: pageResults, scope: "file" });
      } else {
        var lintResult = await runLintAsync(
          scope as "page" | "selection",
          config,
          currentAbortToken,
          function(processed, total) {
            figma.ui.postMessage({
              type: "traversal-progress",
              processed: processed,
              total: total,
            });
          }
        );

        if (currentAbortToken.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }

        // Filter allowlisted violations
        lintResult.violations = filterAllowlisted(lintResult.violations, allowlist);

        currentAbortToken = null;
        figma.ui.postMessage({ type: "linter-result", result: lintResult, scope: scope });
      }
    } catch (error: any) {
      console.error("Lint error:", error);
      currentAbortToken = null;
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

  // ── Health Check fix handlers ──

  "fix-hc-violation": async (msg) => {
    try {
      var hcNodeId = msg.nodeId || "";
      var hcFixResult = await hcFixNode(hcNodeId, {
        rule: msg.rule,
        metadata: msg.metadata,
      });
      figma.ui.postMessage({
        type: "fix-hc-violation-result",
        result: hcFixResult,
        violationId: msg.violationId,
      });
      if (hcFixResult.success) {
        var hcFixedNode = await figma.getNodeByIdAsync(hcNodeId);
        if (hcFixedNode && "type" in hcFixedNode && hcFixedNode.type !== "DOCUMENT" && hcFixedNode.type !== "PAGE") {
          await selectAndZoom(hcFixedNode as SceneNode);
        }
        figma.notify(nt("hc.fix.ok"), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("HC fix node error:", error);
      figma.ui.postMessage({
        type: "fix-hc-violation-result",
        result: { success: false, detail: "" },
        violationId: msg.violationId || "",
      });
    }
  },

  "fix-all-hc-violations": async (msg) => {
    try {
      var hcAllViolations = msg.violations || [];
      var hcFixAllResult = await hcFixAll(hcAllViolations);

      if (hcFixAllResult.fixed > 0) {
        figma.notify(nt("hc.fix.count", { fixed: hcFixAllResult.fixed, s: hcFixAllResult.fixed > 1 ? "s" : "" }) + (hcFixAllResult.failed > 0 ? nt("hc.fix.count.failed", { failed: hcFixAllResult.failed, fs: hcFixAllResult.failed > 1 ? "s" : "" }) : ""), { timeout: 4000 });
      } else {
        figma.notify(nt("hc.fix.none"), { timeout: 3000 });
      }

      figma.ui.postMessage({
        type: "fix-all-hc-violations-result",
        result: hcFixAllResult,
      });
    } catch (error: any) {
      console.error("HC fix all error:", error);
      figma.ui.postMessage({
        type: "fix-all-hc-violations-result",
        result: { fixed: 0, failed: 0, fixedNodeIds: [], fixedViolationIds: [] },
      });
    }
  },

  "fix-hc-by-category": async (msg) => {
    try {
      var hcCatViolations = msg.violations || [];
      var hcFixCatResult = await hcFixAll(hcCatViolations);

      if (hcFixCatResult.fixed > 0) {
        figma.notify(nt("hc.fix.count", { fixed: hcFixCatResult.fixed, s: hcFixCatResult.fixed > 1 ? "s" : "" }),
          { timeout: 3000 }
        );
      }

      figma.ui.postMessage({
        type: "fix-all-hc-violations-result",
        result: hcFixCatResult,
      });
    } catch (error: any) {
      console.error("HC fix by category error:", error);
      figma.ui.postMessage({
        type: "fix-all-hc-violations-result",
        result: { fixed: 0, failed: 0, fixedNodeIds: [], fixedViolationIds: [] },
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
      if (cat === "naming") {
        var qcNameRes = await autoFixNode(qcNodeId, msg.suggestion);
        qcSuccess = qcNameRes.success;
      } else if (cat === "color" || cat === "colors" || cat === "typography" || cat === "spacing") {
        var qcHcRes = await hcFixNode(qcNodeId, { rule: msg.rule || "", metadata: msg.metadata });
        qcSuccess = qcHcRes.success;
      } else {
        // component / coverage / dead-styles / unknown → non-value-fixable
        qcSuccess = false;
      }
      figma.ui.postMessage({
        type: "fix-qc-violation-result",
        result: { success: qcSuccess },
        violationId: msg.violationId,
      });
      if (qcSuccess) {
        var qcFixedNode = await figma.getNodeByIdAsync(qcNodeId);
        if (qcFixedNode && "type" in qcFixedNode && qcFixedNode.type !== "DOCUMENT" && qcFixedNode.type !== "PAGE") {
          await selectAndZoom(qcFixedNode as SceneNode);
        }
        figma.notify(nt("hc.fix.ok"), { timeout: 2000 });
      }
    } catch (error: any) {
      console.error("QC fix node error:", error);
      figma.ui.postMessage({
        type: "fix-qc-violation-result",
        result: { success: false },
        violationId: msg.violationId || "",
      });
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
    } catch (error: any) {
      console.error("Ignore violation error:", error);
    }
  },

  "unignore-violation": async (msg) => {
    try {
      var updatedList2 = await removeFromAllowlist(msg.nodeId || "", msg.ruleId || "");
      figma.ui.postMessage({ type: "allowlist-updated", allowlist: Array.from(updatedList2) });
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

  // ── Health Check handler ──

  "run-health-check": async (msg) => {
    try {
      // Cancel any in-progress scan
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = { cancelled: false };

      const scope = msg.scope || "page";
      const result = await runHealthCheck(
        scope as "page" | "selection" | "file",
        currentAbortToken,
        (category, processed, total) => {
          figma.ui.postMessage({
            type: "health-check-progress",
            category,
            processed,
            total,
          });
        }
      );

      currentAbortToken = null;

      if (result) {
        figma.ui.postMessage({ type: "health-check-result", result });
      }
    } catch (error: any) {
      console.error("Health Check error:", error);
      currentAbortToken = null;
      figma.ui.postMessage({
        type: "health-check-error",
        message: error?.message || nt("hc.error"),
      });
    }
  },

  // ── Unified Quality Check handler (hidden/dev trigger — D-06/D-09) ──
  // Wires runQualityCheck() into the dispatch so the unified engine is genuinely
  // invocable end-to-end this phase. Mirrors the run-health-check handler above:
  // single currentAbortToken supersede, unified progress post, discard-on-cancel.
  // NOT bound to any tab/UI result view (that is Phase 4).

  "run-quality-check": async (msg) => {
    try {
      // Cancel any in-progress scan (single-token supersede, D-09)
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = { cancelled: false };

      const scope = msg.scope || "page";
      const result = await runQualityCheck(
        scope as "page" | "selection" | "file",
        currentAbortToken,
        (phase, processed, total) => {
          figma.ui.postMessage({
            type: "quality-check-progress",
            phase,
            processed,
            total,
          });
        }
      );

      currentAbortToken = null;

      // Discard-on-cancel (D-09): runQualityCheck returns null on cancel —
      // never post a partial score.
      if (result) {
        // QC-09: filter ignored violations so they stay hidden on rescan
        // (mirror run-linter main.ts:351 — shared family-agnostic nodeId::rule allowlist)
        var qcAllowlist = await loadAllowlist();
        result.violations = filterAllowlisted(result.violations, qcAllowlist);
        figma.ui.postMessage({ type: "quality-check-result", result });
      } else {
        figma.ui.postMessage({ type: "scan-cancelled" });
      }
    } catch (error: any) {
      console.error("Quality Check error:", error);
      currentAbortToken = null;
      figma.ui.postMessage({
        type: "quality-check-error",
        message: error?.message || nt("hc.error"),
      });
    }
  },

  // ── Cover Updater handlers ──

  "generate-cover": async (msg) => {
    try {
      const config: CoverConfig = { projectStatus: msg.status || "In Progress" };
      await saveCoverConfig(config);
      await generateOrUpdateCover(config);
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
      figma.ui.postMessage({ type: "cover-config-loaded", config: coverCfg });
    } catch (error: any) {
      console.error("Load cover config error:", error);
    }
  },

  // ── Dead Styles handlers ──

  "scan-dead-styles": async (msg) => {
    try {
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = { cancelled: false };

      const result = await scanDeadStyles(currentAbortToken, (phase, current, total) => {
        figma.ui.postMessage({ type: "dead-styles-progress", phase, current, total });
      });

      if (currentAbortToken.cancelled) {
        figma.ui.postMessage({ type: "scan-cancelled" });
        return;
      }

      currentAbortToken = null;
      figma.ui.postMessage({ type: "dead-styles-result", result });
    } catch (error: any) {
      console.error("Dead styles scan error:", error);
      currentAbortToken = null;
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
    try {
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = { cancelled: false };

      const result = await scanStyleCleaner(currentAbortToken, (phase, current, total) => {
        figma.ui.postMessage({ type: "dead-styles-progress", phase, current, total });
      });

      if (currentAbortToken.cancelled) {
        figma.ui.postMessage({ type: "scan-cancelled" });
        return;
      }

      currentAbortToken = null;
      figma.ui.postMessage({ type: "style-cleaner-result", result });
    } catch (error: any) {
      console.error("Style cleaner scan error:", error);
      currentAbortToken = null;
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

  // ── Accessibility Audit handlers ──

  "run-a11y-audit": async (msg) => {
    try {
      // Cancel any in-progress scan
      if (currentAbortToken) currentAbortToken.cancelled = true;
      currentAbortToken = { cancelled: false };

      const scope = msg.scope || "page";
      const result = await runAccessibilityAudit(
        scope as "page" | "selection" | "file",
        currentAbortToken,
        (category, processed, total) => {
          figma.ui.postMessage({
            type: "a11y-progress",
            category,
            processed,
            total,
          });
        }
      );

      if (currentAbortToken.cancelled) {
        figma.ui.postMessage({ type: "scan-cancelled" });
        return;
      }

      currentAbortToken = null;

      // Store imageNodes for badge creation, send result without imageNodes
      const { imageNodes, ...a11yResult } = result;
      figma.ui.postMessage({ type: "a11y-result", result: a11yResult });
    } catch (error: any) {
      console.error("A11Y audit error:", error);
      currentAbortToken = null;
      figma.ui.postMessage({
        type: "a11y-error",
        message: error?.message || String(error),
      });
    }
  },

  "save-alt-text": async (msg) => {
    try {
      const nodeId = msg.nodeId || "";
      const node = await figma.getNodeByIdAsync(nodeId);
      if (node && node.type !== "DOCUMENT" && node.type !== "PAGE") {
        setAltText(node as SceneNode, msg.altText || "");
        figma.ui.postMessage({ type: "alt-text-saved", nodeId });
      } else {
        console.warn("save-alt-text: node not found", nodeId);
      }
    } catch (error: any) {
      console.error("Save alt-text error:", error);
    }
  },

  "get-alt-text": async (msg) => {
    try {
      const nodeId = msg.nodeId || "";
      const node = await figma.getNodeByIdAsync(nodeId);
      if (node && node.type !== "DOCUMENT" && node.type !== "PAGE") {
        const altText = getAltText(node as SceneNode);
        figma.ui.postMessage({ type: "alt-text-loaded", nodeId, altText });
      }
    } catch (error: any) {
      console.error("Get alt-text error:", error);
    }
  },

  "create-a11y-badges": async (msg) => {
    try {
      console.log("[a11y-badges] Step 1: running audit...");
      const auditResult = await runAccessibilityAudit("page");
      console.log("[a11y-badges] Step 2: audit done, imageNodes:", auditResult.imageNodes?.length);
      const count = await createAltTextBadges(auditResult.imageNodes);
      console.log("[a11y-badges] Step 3: badges created:", count);
      figma.ui.postMessage({ type: "a11y-badges-created", count });
    } catch (error: any) {
      console.error("Create A11Y badges error:", error?.message || error, error?.stack || "no stack");
      figma.ui.postMessage({
        type: "a11y-error",
        message: error?.message || String(error),
      });
    }
  },

  "cleanup-a11y-badges": (msg) => {
    try {
      cleanupBadges(figma.currentPage);
      figma.ui.postMessage({ type: "a11y-badges-cleaned" });
    } catch (error: any) {
      console.error("Cleanup A11Y badges error:", error);
    }
  },

  "simulate-color-blindness": async (msg) => {
    try {
      const cbScope = (msg.scope || "page") as "page" | "selection";
      const cbPlacement = (msg.placement || "new-page") as "new-page" | "same-page";
      const result = await simulateColorBlindness(cbScope, cbPlacement);
      figma.ui.postMessage({ type: "color-blindness-simulated", pagesCreated: result.pagesCreated });
    } catch (error: any) {
      console.error("Color blindness simulation error:", error);
      figma.ui.postMessage({
        type: "a11y-error",
        message: error?.message || String(error),
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
