# Marcel Toolbox — Backlog UX / bugs (audit plugin)

**Date :** 2026-07-05
**Portée :** `Marcel/src/ui.html` (UI complète — 3 moments + états annexes + design-system transversal)
**Méthode :** 4 relecteurs en parallèle (Je démarre / Je construis / Je livre / transversal). ~60 findings fusionnés et regroupés par cause.

> ⚠️ Les « bugs » ci-dessous sont identifiés par lecture de code (relecteurs). Chaque P1-bug sera **confirmé en debug systématique avant correction** — les numéros de ligne sont indicatifs.

---

## Batch 1 — Bugs fonctionnels (P1, à corriger quoi qu'il arrive)

| ID | Écran | Bug | Preuve | Correction |
|----|-------|-----|--------|-----------|
| B1-01 | Je démarre · Starter Kit | « Open Starter Kit » déclenche le handler global `starter-kit-created` qui mute le DOM de l'**ancien onglet SK** (jamais ouvert) → onglet figé en faux « succès ». | `ui.html:8101–8113` | Ajouter un champ `source` (`"moment"` vs `"sk-tab"`) au message ; ne muter le legacy que si `source==="sk-tab"`. |
| B1-02 | Je démarre · Starter Kit | Bannière « Cover initialized to In Progress » affichée pour **tout** `starter-kit-created`, y compris template DS-library (fausse confirmation). | `ui.html:8112–8113`, `3475`, `6534` | Gater sur `msg.template === "prd"` (ou `coverInitialized:true` renvoyé par le backend). |
| B1-03 | Je livre · gate | `deliver-a11y-launch-btn` + `deliver-stamp-copy-btn` portent `class="btn-secondary"` mais la règle CSS est `.btn.btn-secondary` → **2 boutons non stylés** (rendu natif brut). | `ui.html:3967, 4055` ; CSS `2063` | `class="btn btn-secondary"` (ou classe canonique ghost) + focus-ring. |
| B1-04 | Je livre · gate | `coverReady = !!(coverStatus && coverStatus !== "")` → **n'importe quel** statut non-vide (« Archived », « In Progress ») passe le gate avec « Cover à jour ✓ ». | `ui.html:10307, 10371` | Ne valider que `SOT`/`Design Done` et ajuster la copie. |
| B1-05 | Je livre · gate | Un score qui **passe** (ex. 80/100, seuil 75) affiche une coche **verte au stroke ambre** car `deliverIconMet` hérite de la couleur de bande. Contredit pass=vert. | `ui.html:10339–10345` | Si `scorePass`, forcer `deliverIconMet(var(--success))` ; garder la couleur de bande pour le sous-label seulement. |
| B1-06 | Je construis | `--error-pressed` non défini dans le `:root` actif (défini seulement dans le bloc dark commenté) → `.btn-danger:active` tombe sur `transparent` → **feedback pressé invisible** (Annuler/Supprimer). | `ui.html:23–51`, conso `462` | Ajouter `--error-pressed:#470002` au `:root` clair. |
| B1-07 | Global (tokens) | Variables CSS référencées mais non définies : `--content-subtlest` (texte placeholder → invisible), `--content-primary` (hover icône → indéfini). | `ui.html:200, 579` | Les ajouter au `:root` clair (+ `--bg-hover`, `--border-hover`, `--error-pressed`). |
| B1-08 | Je démarre · Audit | Garde « rien coché » fait `statusEl.textContent = …` → **écrase l'innerHTML du diagnostic** ✓/— ; il faut re-diagnostiquer. | `ui.html:6645–6646` | Écrire le message dans un `#audit-apply-hint` séparé. |
| B1-09 | Je démarre · Audit | « Diagnostiquer » sans état loading/disabled → double-clic = multiples `diagnose-file-structure`, re-render en plein milieu. | `ui.html:6629–6633` | Désactiver au clic, réactiver à la réponse. |
| B1-10 | Je construis · quick-tools | `#qt-naming-fullpanel` / `#qt-clean-fullpanel` sont des `<a role="button">` **sans href** → Space/Enter ne déclenchent pas (clavier). | `ui.html:3659, 3685` | Remplacer par `<button class="moment-secondary-btn">`. |

---

## Batch 2 — Causes systémiques (P1, fort levier : 1 fix ⇒ N bugs par écran)

| ID | Thème | Problème | Correction |
|----|-------|----------|-----------|
| S-01 | **Système de boutons** | Deux systèmes CSS incompatibles cohabitent : legacy `.btn.btn-primary/.btn-secondary/.btn-sm` (14 instances linter/HC/a11y) vs nouveau `.btn-primary`(40px)/`.btn-ghost`/`.btn-danger`/`.moment-secondary-btn`(36px). + `btn-secondary` orphelin (cf. B1-03). | Définir **UN** set canonique (primaire / secondaire-outlined / ghost / danger / **tertiaire-lien**) ; migrer les 14 instances legacy ; résout aussi B1-03 et S-02. `SYS-01, SYS-02` |
| S-02 | **Focus clavier** | `:focus-visible` présent seulement sur `.btn-primary` + `.btn-danger`. Absent sur **~20 contrôles** (nav-tabs, `.moment-secondary-btn`, `.lang-opt`, `.qc-*-btn`, `.hc-back-btn`, `.template/hub-card`, selects, checkboxes…). Navigation clavier invisible. | Une règle de focus partagée (`:focus-visible` reset) + overrides ciblés. Résout START-03/04, BUILD-05/09, DELIVER-08. `SYS-05` |
| S-03 | **Couleurs hors tokens** | Couleurs hardcodées en JS/HTML : 3 rouges (`--error` vs `#dc3545`), 2 ambres (`--warning-text #8a5f00` vs `#f59e0b`/`#bd8400`), 2 bleus (`--brand` vs `#3b82f6`), strokes verts `#2c815e`. Permanent light-mode, divergent des tokens. | Ajouter tokens `--info`, `--warning-fill`, `--score-*` ; helper JS `resolveToken(var)` (lecture `getComputedStyle`) ; `stroke="currentColor"`. Résout B1-05, DELIVER-04/05/11, START-11. `SYS-04, SYS-08, SYS-13` |
| S-04 | **Contrôles natifs** | `accent-color` appliqué aux radios `.hc-scope-select` seulement. Checkboxes (audit-fix, `#deliver-a11y-attest`) + selects natifs non stylés → cases système peu visibles (la **coche verte** demandée). | `input[type=checkbox]{accent-color:var(--success)}` + indicateur custom ; classe `.select` unifiée (Ubuntu, radius, focus). `SYS-09` |
| S-05 | **i18n FR/PT-BR** | FR & PT-BR = 126 clés ; EN = 315 → **190 clés manquantes** en FR (locale par défaut !). Chaîne `fr→en→key` ⇒ toute la moitié legacy (sk/hc/linter/ds/cover/dialog…) s'affiche en anglais en FR. + labels de scope hardcodés (HC re-scan, a11y, threshold, cleanstyles). | Auteur FR d'abord, miroirs EN/PT complets ; check CI de parité de clés ; `data-i18n` sur les labels hardcodés. Résout BUILD-10/11, SYS-07. `SYS-03` |
| S-06 | **Typo/heading inline** | Nombreux `style="font-size:16px;font-weight:700…"` dupliquant `.moment-heading`/`.moment-body`/`.moment-meta` (deliver + cover + banners). | Remplacer par les classes sémantiques ; modifieur si besoin de niveau. Résout START-13/15, DELIVER-13. `SYS-10` |

---

## Batch 3 — Hiérarchie / structure d'écran (P1–P2)

| ID | Écran | Problème | Correction |
|----|-------|----------|-----------|
| H-01 | Je démarre · Audit | **Refonte déjà cadrée** : flux séquentiel, 1 primaire/étape (Diagnostiquer→lien après coup ; Appliquer=seul bleu ; QC=tertiaire) ; aligner statut/checklist ; coche verte ; padding. + 2 intros contradictoires (`:3442` vs `:3486`). | Redesign complet (spec dédiée). START-01…14 + diagnostic initial. |
| H-02 | Tous moments | Titre de panel = **exactement** le label de l'onglet (« Je démarre » ×2), répété dans les 3 moments. Dans Je construis, **3 `.moment-heading` identiques visibles simultanément**. | Sous-titre orienté action (« Vérifiez la qualité »…) ou suppression ; hiérarchiser les niveaux. START-13, BUILD-01 |
| H-03 | Je construis · empty | Carte secondaire = fourre-tout (Import + cover-status + lien a11y) sans regroupement ni sous-labels. | Séparer en cartes / sous-titres 12px ; isoler le lien externe. BUILD-02 |
| H-04 | Je construis | `.btn-danger` rouge-erreur pour « Annuler » (non destructif) → sémantique inversée. | `.moment-secondary-btn` ; réserver danger aux suppressions. BUILD-03 |
| H-05 | Je construis · dashboard | État le plus riche = le moins structuré (rescan/ring/grid hors carte). | Envelopper dans `.qc-card`. BUILD-13 |
| H-06 | Je livre · gate | 3 lignes de checklist, **2 grammaires** : SVG tick (score/cover) vs checkbox natif (a11y). | Checkbox custom `--success` alignée sur la grammaire SVG. DELIVER-07 |
| H-07 | Je livre · noscan | État « pas encore de scan » bordé en **rouge-erreur** (état neutre). | Ambre ou neutre. DELIVER-09 |

---

## Batch 4 — Accessibilité (au-delà du focus, P1–P2)

| ID | Écran | Problème | Correction |
|----|-------|----------|-----------|
| A-01 | Je construis · dashboard | Category cards = `<div onclick>` sans `role/tabindex/keydown` → **drilldown inatteignable au clavier** / opaque lecteur d'écran. | `<button>` ou `role="button" tabindex=0` + keydown Enter/Space. BUILD-06 |
| A-02 | Tous moments | Tabs sans `aria-controls` ; panels sans `aria-labelledby`. | Lier tab↔panel. START-10 |
| A-03 | Je construis / Je livre | `aria-live` absent : `#qc-scanning-label`, `#qc-error-msg` (role=alert), `#deliver-done` (role=status). | Ajouter live-regions. BUILD-12, DELIVER-14 |
| A-04 | Global | Cibles < 24–28px : `.qc-fix/ignore-btn`, `.hc-back-btn`, `.lang-opt`, `.ds-filter-btn`, `.qc-back-btn` (padding:0). | `min-height:28px` sur boutons inline. SYS-11, BUILD-09 |
| A-05 | Je démarre | `.moment-secondary-btn` 36px vs `.btn-primary` 40px dans la même porte. | Harmoniser (40px) ou tiers explicites. START-06 |

---

## Batch 5 — Espacement / polish / dead-code (P2–P3)

| ID | Écran | Problème | Correction |
|----|-------|----------|-----------|
| P-01 | Je démarre | Marges inline ad-hoc (`margin-top` xs/s/l) + `margin:6px` hors token ; panels sans flex-gap. | `display:flex;gap:var(--spacing-m)` ; tokens. START-05/07/14 |
| P-02 | Je livre · CTA | `deliver-markdone-btn` à 8px du dernier row (vs rythme 16px). | `margin-top:var(--spacing-l)`. DELIVER-12 |
| P-03 | Je construis | Ordre inversé scope↔action dans quick-tool naming (bouton avant radios). | Réordonner scope→action. BUILD-14 |
| P-04 | Global | Bloc CSS `.sk-category*` **dupliqué** (L479–507 mort, écrasé par L786–814). | Supprimer le 1er bloc. SYS-12 |
| P-05 | Je livre · stamp | `<textarea readonly>` sans affordance (ressemble à éditable). | `cursor:default;user-select:all`. DELIVER-15 |
| P-06 | Je construis | Clé i18n morte `build.tool.naming.scope` (jamais référencée). | Supprimer. BUILD-16 |
| P-07 | Je construis | `#build-cover-status` select sans font Ubuntu/couleur/focus (≠ `.qc-threshold-select`). | Classe `.select` unifiée (voir S-04). BUILD-08 |
| P-08 | Je démarre | Bannière succès : `class="hidden"` + inline `display:flex` en conflit ; span stylé inline = `.moment-meta`. | Classe CSS dédiée. START-12/15 |

---

## Séquence recommandée

1. **Batch 1** (bugs P1) — défauts réels, correctifs ciblés, gros retour sur investissement.
2. **Batch 2** (systémiques) — fonde le reste (boutons, focus, tokens couleur, contrôles, i18n).
3. **Batch 3 · H-01** — refonte « Je démarre · Audit » (déjà cadrée en flux séquentiel).
4. Reste de Batch 3 + Batch 4 (a11y) au fil des écrans.
5. **Batch 5** — polish en fin de passe.
