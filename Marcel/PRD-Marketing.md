# Marcel Toolbox — Product Overview

## Le plugin Figma qui automatise vos DesignOps

Marcel Toolbox est le compagnon Figma des equipes design. Il standardise les fichiers, garantit la conformite au Design System et detecte les problemes d'accessibilite — le tout sans quitter Figma.

> **Un seul plugin. Six features. Zero friction.**

---

## Le probleme

Les equipes design perdent un temps considerable sur des taches repetitives et des verifications manuelles :

- **Fichiers mal structures** — Chaque designer organise ses pages differemment, rendant la collaboration difficile
- **Nommage anarchique** — "Frame 437", "Rectangle 12", "Group Copy 3"... impossible de s'y retrouver
- **Derives du Design System** — Couleurs hardcodees, polices non-standard, spacing approximatif
- **Styles fantomes** — Des dizaines de styles et variables inutilises qui polluent les fichiers
- **Accessibilite oubliee** — Contraste insuffisant, alt-text manquant, zones tactiles trop petites
- **Cover obsolete** — Le statut du projet ne se reflete pas dans la miniature du fichier

**Resultat** : des heures de nettoyage manuel, des revues design interminables, et un Design System qui s'erode silencieusement.

---

## La solution : Marcel Toolbox

### 1. Starter Kit — Demarrez chaque projet sur de bonnes bases

**En un clic**, Marcel genere la structure de fichier complete selon vos conventions.

- **Template PRD** : Cover, Overview, Delivery, Local Components, Archives, Help — tout est la
- **Template DS Library** : Structure dediee pour documenter vos composants (ReadMe, Contributors, Components)
- La cover du projet est inseree automatiquement avec le bon composant DS
- Detection intelligente : Marcel sait si le template existe deja

**Avant** : 5-10 min de setup manuel par fichier | **Apres** : 3 secondes

---

### 2. Layer Naming Linter — Des fichiers lisibles, toujours

Marcel scanne vos layers et identifie **17 types de problemes** de nommage et de structure.

**Ce qu'il detecte :**
- Les noms par defaut Figma ("Frame 1", "Rectangle 2"...)
- Les noms vagues ("container", "wrapper", "box"...)
- Les doublons entre layers freres
- Les composants mal nommes (sans categorie "/")
- Les frames vides, le nesting excessif, les layers orphelins
- Les couleurs utilisees sans token DS

**Ce qu'il corrige automatiquement :**
- Renommage intelligent base sur les proprietes du layer (un rectangle de fond devient "Background", un cercle avec image devient "Avatar"...)
- Suppression des suffixes de copie ("Button Copy 2" → "Button")

**Scope flexible** : page courante, selection, ou fichier entier
**Score de qualite** : une note claire par categorie pour suivre la progression

---

### 3. DS Health Check — Gardez votre Design System intact

L'audit de conformite le plus complet pour votre Design System, structure autour de **4 piliers** :

| Pilier | Ce qui est verifie |
|---|---|
| **Couleurs** | Chaque fill et stroke est compare aux tokens DS. Marcel suggere le token le plus proche si une couleur est hors-DS |
| **Typographie** | Styles texte lies au DS, polices conformes, coherence des styles |
| **Spacing** | Paddings et gaps compares a l'echelle DS, variables correctement liees |
| **Composants** | Instances cassees, composants detaches, overrides excessifs |
| **Couverture DS** | Ratio d'instances DS vs composants custom/locaux — mesure concrete de l'adoption du Design System |

**Autofix intelligent** : Marcel peut corriger automatiquement les ecarts — relier les bonnes variables DS, remplacer les couleurs hors-token, lier les text styles manquants.

**Couverture DS** : Marcel mesure le taux d'adoption reel du Design System en comptant les instances de composants DS vs les composants custom. Les composants deprecies sont signales avec une suggestion de mise a jour. Si un fichier ne contient aucun composant, la categorie s'adapte automatiquement (N/A).

**Score de conformite** pondere par severite sur 5 axes pour prioriser les corrections.

---

### 4. Cover Updater — Un statut projet toujours a jour

La miniature de votre fichier Figma reflète instantanement l'etat du projet.

**5 statuts disponibles** :
- In Progress
- Design Done
- Archived
- Source of Truth (SOT)
- Playground

Marcel importe le bon composant cover depuis le DS, le place sur la page Cover, et le definit comme thumbnail du fichier — en un clic.

---

### 5. Style Cleaner — Nettoyez vos fichiers en profondeur

Marcel detecte et nettoie deux types de pollution :

**Styles morts**
- Styles locaux (couleurs, textes, effets) que plus aucun element n'utilise
- Variables locales orphelines sans aucune reference

**Styles etrangers**
- Variables provenant de librairies non-DS (imports accidentels, anciennes librairies)
- Styles distants deprecies

**Actions disponibles** :
- **Detacher** : supprime le lien tout en preservant l'apparence visuelle
- **Remplacer** : rebind automatiquement vers le bon token DS (avec suggestion intelligente)
- **Supprimer** : retire les styles morts inutiles
- **Traitement par lot** : nettoyez tout d'un coup

---

### 6. Audit Accessibilite — Concevez pour tous

Un audit WCAG 2.1 complet directement dans Figma, couvrant **3 axes critiques + 1 outil de simulation** :

**Alt-Text**
Detecte toutes les images sans texte alternatif. Permet d'ajouter et gerer les alt-text directement dans le plugin, stockes sur le layer pour le handoff dev.

**Contraste**
Verifie les ratios de contraste selon les niveaux WCAG AA et AAA. Detecte automatiquement la couleur de fond en remontant la hierarchie des layers.

**Zones tactiles**
Identifie les elements interactifs (boutons, inputs, toggles...) dont la zone de tap est inferieure a 44x44px.

**Simulation daltonisme**
Genere des pages de simulation pour 3 types de deficience visuelle (Protanopie, Deuteranopie, Tritanopie) afin de verifier la lisibilite de vos designs.

**Badges visuels** : Marcel peut annoter directement les images sur le canvas avec un indicateur vert/rouge du statut alt-text.

---

## Fonctionnalites transversales

| Capacite | Detail |
|---|---|
| **3 scopes de scan** | Page courante, selection, ou fichier entier |
| **Progression temps reel** | Barre de progression pendant les audits |
| **Navigation instantanee** | Cliquez sur une violation → Marcel zoome directement sur le layer concerne |
| **Scans annulables** | Interrompez un audit long a tout moment |
| **Multilingue** | Interface et notifications en francais, anglais et portugais |
| **Config persistante** | Vos preferences sont sauvegardees par fichier |

---

## Benefices cles

### Pour les designers
- **Moins de taches repetitives** : le setup, le nommage et le nettoyage sont automatises
- **Feedback instantane** : voyez immediatement ce qui ne va pas et corrigez en un clic
- **Montee en competence** : les regles du linter et du health check sont pedagogiques

### Pour les Design Ops
- **Standardisation a l'echelle** : chaque fichier respecte les memes conventions
- **Adoption DS mesurable** : le taux de couverture composants + les scores de conformite donnent une vision claire et chiffree
- **Maintenance facilitee** : le style cleaner evite l'accumulation de dette design

### Pour l'equipe produit
- **Handoff plus propre** : des fichiers bien nommes et structures facilitent le travail des devs
- **Accessibilite by design** : les problemes WCAG sont detectes tot dans le process
- **Qualite constante** : le Design System reste la source de verite, sans derives

---

## Chiffres cles

| Metrique | Impact |
|---|---|
| Setup fichier | ~5 min → **3 sec** |
| Nommage layers | 17 regles avec autofix |
| Conformite DS | 5 axes audites + autofix |
| Accessibilite | 3 axes WCAG + simulation |
| Nettoyage styles | Detection + correction par lot |

---

## Stack technique

| Element | Choix |
|---|---|
| Plateforme | Plugin Figma (sandbox) |
| Langage | TypeScript |
| UI | HTML/CSS inline (iframe) |
| Build | esbuild |
| Architecture | Feature-based (1 dossier = 1 feature) |

---

## Roadmap

| Version | Features | Statut |
|---|---|---|
| **V1** | Starter Kit | Livre |
| **V2** | Layer Linter, DS Health Check, Health Check Autofix | Livre |
| **V3** | Cover Updater, Dead Styles & Style Cleaner | Livre |
| **V4** | Audit Accessibilite (alt-text, contraste, touch targets, daltonisme) | Livre |
| **V5** | Components Coverage (5e axe Health Check) | Livre |
| **V6** | Handoff Checklist | A venir |

---

*Marcel Toolbox — Moins de bruit, plus de design.*
