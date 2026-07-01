# Quality Check — Scoring & Delivery — Design Spec (Marcel Toolbox V2)

- **Date** : 2026-07-01
- **Source** : démo toolkit v2 du 19 juin 2026 (Antoine Deshoux, Astrid Crépin, Perrine Croix) + brainstorm de conception.
- **Board FigJam** (source visuelle, sections ⑤→⑧) : https://www.figma.com/board/CJXXgHHz9z5BQ3HVjzxE70/Quality-Check-Design
- **Statut** : décisions de conception prises. Les valeurs chiffrées marquées _« à caler »_ restent à figer en équipe (atelier pondération) avant dev.

> Convention de lecture : **[DÉCIDÉ]** = tranché en brainstorm · **[À CALER]** = valeur/­liste à finaliser en équipe · **[PROPOSITION]** = point de départ à valider.

---

## 0. Contexte & objectif

La V2 remplace les 4 audits redondants (Linter, Health Check, Dead Styles, Coverage) par un **Quality Check unifié** : 1 scan → 1 score → 1 liste → 1 fix. Ce document spécifie **comment le score est calculé**, **comment il conditionne la livraison**, et les fonctions connexes (export, mode audit, checklist livrable).

Enjeu métier : rendre la qualité **mesurable, bloquante et exportable** pour objectiver la dette et forcer le passage QC + accessibilité avant livraison — sans que le score puisse être « arrondi à la baisse » (objection Perrine : _« si ça écrit good à 65%, tout le monde s'arrête »_).

---

## 1. Modèle de scoring (FigJam ⑤)

### 1.1 Mode de calcul — [DÉCIDÉ] Pénalité absolue

```
Score de conformité DS = 100 − Σ pénalités
```

On part de 100 ; chaque violation retire des points selon son poids. **Une faute grave mord réellement, quel que soit le volume de la page** — contrairement au modèle actuel en % de nœuds propres (`scoring.ts`) qui dilue les fautes graves dans le volume (1 style custom parmi 500 nœuds ⇒ 99,6 % ⇒ « Excellent »).

> Remplace le modèle normalisé actuel de `Marcel/src/shared/scoring.ts` (`calculateCategoryScore` / `calculateWeightedCategoryScore`), qui est exactement le « scoring neutre » critiqué en démo.

### 1.2 Granularité — [DÉCIDÉ] Catégorie × sévérité

- **5 catégories pondérées**, chacune dotée d'un **budget** (= pénalité maximale). Les budgets somment à 100.
- Chaque **règle** porte un **tag de sévérité** : `grave` / `moyen` / `cosmétique`.
- Le poids d'une catégorie = son budget max ⇒ **le plafonnement est automatique** : une catégorie ne peut jamais coûter plus que son budget, le score plancher reste 0, et le volume ne peut pas « tout vider » au-delà du budget catégorie.

### 1.3 Progression — [DÉCIDÉ] Linéaire, plafonnée au budget

Chaque faute brûle une part fixe du budget de sa catégorie ; N fautes graves = plancher de la catégorie. Prévisible et explicable (« j'ai perdu 10 pts, pourquoi »).

### 1.4 Tableau de pondération — [À CALER]

| Catégorie | Budget max | Grave | Moyen | Cosmétique |
|---|---|---|---|---|
| 🎨 Couleurs (hors token) | 30 | −10 | −5 | −1 |
| 🔡 Typographie | 30 | −10 | −5 | −1 |
| 📐 Spacing (padding/gap) | 15 | −5 | −2,5 | −0,5 |
| 🧩 Composants / styles morts | 15 | −5 | −2,5 | −0,5 |
| 🔤 Nommage des calques | 10 | −3 | −1,5 | −0,3 |
| **Total** | **100** | | | |

Convention proposée : `grave = 1/3 du budget`, `moyen = 1/6`, `cosmétique = 1/30`. **Le seul vrai réglage à trancher** : faut-il 3 fautes graves pour vider une catégorie, ou plutôt 4–5 ? (ajuste la fraction `grave`).

### 1.5 Sanity-check du barème

| Scénario | Détail | Score |
|---|---|---|
| A · petite page presque propre | 1 couleur hors-token (grave) + 3 nommage (cosmét.) | −10,9 → **89** « Bon » |
| B · typo custom partout | 5 styles texte custom (grave typo) → plafond −30 | **70** « À améliorer » |
| C · fichier saturé | toutes catégories saturées | **0** |
| D · nommage négligé seul | 20 calques mal nommés (cosmét., cap 10) | −6 → **94** « Excellent » |

→ une vraie faute se voit · le nommage seul ne tue pas · le volume plafonne.

### 1.6 Composition du score macro — [DÉCIDÉ]

```
Quality Check (macro) = Conformité DS  ⊕  Accessibilité (gate)  ⊕  HS
```

- **Conformité DS** = « Score de remplissage » (le tableau §1.4), 0–100. C'est LE score affiché au designer dans « Je construis ».
- **Accessibilité** = gate (§1.8).
- **HS** = checklist livrable, faible poids (§4).

### 1.7 Seuils de livraison — [DÉCIDÉ] Par type de projet + profil gouverné

Le **score** dit *à quel point* c'est propre ; le **seuil** dit *si c'est livrable* (barre du gate « Je livre »).

- Seuil **par type de projet** — [À CALER] : `app DS pure ≥ 95` · `produit legacy magasin ≥ 75` · `e-commerce ≥ 85`.
- **Profil gouverné** : choisi dans une **liste fermée maintenue par la Design Ops** [À CALER], **écrit sur le Cover**, et **porté dans le tampon exporté** (§2). Transparent, non modifiable en douce → pas de nivellement par le bas silencieux.

### 1.8 Accessibilité — [DÉCIDÉ] Par étapes

- **Lot 1 (maintenant, sans fusion)** : le QC scanne la page ; **frame a11y absente → gros warning + force le lancement du plugin a11y**, et `score global = score DS − 30` (plancher 0). Frame présente → `score global = score DS` (le détail a11y reste dans le plugin de Perrine).
- **Lot 2 (après fusion / MCP)** : le **% de complétude d'annotations** devient une catégorie pondérée du macro : `global = pondération(DS, %a11y, HS)` — à recaler quand les données a11y seront lisibles.

Détection de présence : le QC repère la **frame d'accessibilité par son nom** (nom standard généré par le starter).

### 1.9 Legacy — [DÉCIDÉ] Vue double + détection par binding

- **Vue double** : `Conformité DS X%` **+** `dette legacy Y%` affichés séparément. Le legacy est compté **à part**, pas noyé → documente la dette dans le temps (vue « Marcel compliance X% + Y% legacy »).
- **Détection par binding de librairie** (réutilise le moteur `dead-styles`) :
  - valeur liée à un **ancien DS (figé)** → **legacy** (comptée dans la dette, pas dans les pénalités) ;
  - valeur liée au **DS actuel** → conforme ;
  - valeur liée à **rien** (custom/hardcode) → **vraie faute** (pénalité).
- **0 registre à maintenir** (contrairement à une base de valeurs legacy).

### 1.10 Philosophie des seuils — [DÉCIDÉ] v1 douce, on resserre

**Double tolérance assumée en v1** : le legacy sort du score (vue double) **ET** le seuil est abaissé (profil legacy). Objectif : favoriser l'adoption — que personne ne « lève la main ». Les seuils sont **pensés pour se resserrer dans le temps**, au rythme du déploiement (pilotes Virginie / Carrefour.com → généralisation e-commerce). ⟳ à réviser une fois l'adoption acquise.

### 1.11 Mapping règle → sévérité — [PROPOSITION à valider]

| Règle détectée | Catégorie | Sévérité | Pourquoi |
|---|---|---|---|
| Style de texte custom (non-DS) | Typo | GRAVE | « poubelle » — hors DS |
| Taille / graisse / line-height off | Typo | MOYEN | proche mais hors style DS |
| Couleur hors-token (aucun binding) | Couleurs | GRAVE | vraiment custom |
| Couleur liée à un ancien DS | Couleurs | LEGACY | dette, comptée à part |
| Couleur hardcodée proche d'un token | Couleurs | MOYEN | token non appliqué |
| Padding / gap hors échelle DS | Spacing | MOYEN | écart d'espacement |
| Composant détaché / custom | Composants | MOYEN | hors DS, réimplémenté en dev |
| Style local mort / binding étranger | Styles morts | COSMÉT. | hygiène de fichier |
| Nom de calque défaut / vague / doublon | Nommage | COSMÉT. | « faux scoring » (Antoine) |

> Note : la **couverture composants complète est volontairement hors périmètre** (usine à gaz de maintenance) — on reste sur les styles. Un composant custom est de toute façon hors-DS et réimplémenté proprement en dev.

### 1.12 Portée du scan — [DÉCIDÉ]

Le Quality Check est **page par page par défaut** (focus page), pas fichier entier — pour éviter que les archives / pages d'exploration ne faussent le score. Le scan fichier reste possible mais non incité.

---

## 2. Export — tampon de livrable (FigJam ⑥)

- **Forme** — [DÉCIDÉ] : **frame « badge » générée à côté du projet** (comme le Cover) **+ bloc texte copiable en 1 clic** (« Copier pour Jira »). Aucune API externe, **aucune donnée ne sort du fichier** (contrainte privacy).
- **Contenu du tampon** : `Conformité DS X/100 (✓/✗ ≥ seuil)` · `Profil (seuil)` · `Dette legacy Y%` · `Accessibilité : complétude %` · `Fichier · Page` · `Date`.
- **Déclencheur** — [DÉCIDÉ] : généré **au passage du gate « Je livre »** (vérif score ≥ seuil + a11y), en même temps que le **Cover passe à « Design Done »**. Le badge reflète **pass/fail** (vert ≥ seuil · rouge sinon). Vit dans la page « Livraison » du starter kit.

> Réutilise le générateur existant `Marcel/src/features/cover-updater/`.

---

## 3. « Je démarre » — mode audit (FigJam ⑦)

« Je démarre » a **2 portes** : (A) fichier vierge → **Starter Kit** ; (B) fichier existant → **Mode audit**. Le plugin détecte le cas.

- **Mode audit** — [DÉCIDÉ] **état des lieux complet** :
  1. **Diagnostic structure** : cover ? pages standard ? cover legacy à remplacer ? archives rangées ?
  2. **Remise à niveau (non destructif)** : génère les manques, remplace la cover legacy → nouvelle.
  3. **Baseline Quality Check** : score de départ du fichier.
- **Sûreté de la remise à niveau** — [DÉCIDÉ] **opt-in avec aperçu** : le diagnostic liste ce qui manque, le designer **coche ce qu'il applique** (☐ générer cover ☐ remplacer cover legacy ☐ ajouter pages standard manquantes). **Rien n'est modifié sans consentement** — cohérent avec le seuil de confiance de l'auto-fix.
- Utile à la reprise **et** quand on hérite du fichier de quelqu'un d'autre.

---

## 4. HS — checklist livrable (FigJam ⑧)

Hygiène de fichier & livrable, **faible poids** (« des trucs qui impactent 2-3 pts mais bien à mettre »).

- **Items proposés** — [PROPOSITION à valider / compléter], tous facilement détectables :

| Item livrable | Détecté comment | Si manquant |
|---|---|---|
| Cover présente & à jour | node cover, statut ≠ legacy | −2 |
| Page « Archives » présente | page nommée Archives | −1 |
| Maquettes obsolètes rangées | pas de page old/explo hors Archives | −1 |
| Fichier nommé (≠ Untitled) | nom du fichier ≠ défaut | −1 |
| Page Specs / handoff présente | page specs existe | −1 |

- **Poids HS** — [DÉCIDÉ] **hybride** :
  - **« Cover à jour » = condition dure du gate** (pas de livraison sans ; la cover se met à jour automatiquement au passage du gate) ;
  - **autres items = petites pénalités** (~ −5 pts max sur le global).
  - Le critique bloque, le reste nudge sans punir.

---

## 5. À caler en équipe avant dev

1. **Chiffres du barème** (§1.4) : budgets `30/30/15/15/10`, points par sévérité, fraction `grave` (3 vs 4–5 fautes pour vider une catégorie).
2. **Pénalité a11y absente** : `−30` (§1.8) — confirmer absolu vs `×0,7`.
3. **Seuils par profil** (§1.7) : `95 / 75 / 85` + **liste fermée des profils** (Design Ops).
4. **Mapping règle → sévérité** (§1.11) : valider les 9 lignes.
5. **Items HS** (§4) : valider / compléter la liste.

---

## 6. Notes d'implémentation (rattachement au code existant)

- **Scoring** : réécrire `Marcel/src/shared/scoring.ts` (passer du modèle % au modèle pénalité plafonnée par budget). Conserver l'interface `CategoryScore` / `ScoreResult` si possible.
- **Legacy** : réutiliser la détection de bindings de librairie étrangère de `Marcel/src/features/dead-styles/dead-styles-engine.ts`.
- **Export / Cover** : réutiliser `Marcel/src/features/cover-updater/`.
- **Mode audit / structure** : réutiliser `Marcel/src/features/starter-kit/` (config des pages standard) pour détecter les manques et générer en opt-in.
- **A11y** : lot 1 = détection de la frame par nom ; lot 2 = pont MCP / fusion du plugin a11y de Perrine.
- **Traversée** : tout passe par `Marcel/src/shared/node-traversal.ts` (un seul parcours async/annulable).
