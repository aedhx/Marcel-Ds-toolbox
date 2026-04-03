# PRD V2+ — Marcel Plugin for Figma

## Vision

**Marcel V2+** etend le plugin Figma interne Marcel au-dela du Starter Kit (V1) pour couvrir l'ensemble du cycle de vie DesignOps : qualite des fichiers, conformite au Design System, suivi des statuts, preparation au handoff et productivite au quotidien. Chaque feature renforce la standardisation, accelere les workflows et garantit la coherence a l'echelle de l'equipe.

---

## Table des matieres

1. [Architecture partagee](#architecture-partagee)
2. [Feature 2 : Layer Naming Linter](#feature-2--layer-naming-linter)
3. [Feature 3 : DS Health Check](#feature-3--ds-health-check)
4. [Feature 4 : Library Coverage Report](#feature-4--library-coverage-report)
5. [Feature 5 : Statut Manager](#feature-5--statut-manager)
6. [Feature 6 : Handoff Checklist](#feature-6--handoff-checklist)
7. [Feature 7 : Token Inspector](#feature-7--token-inspector)
8. [Feature 8 : Cover Updater](#feature-8--cover-updater)
9. [Feature 9 : Changelog Generator](#feature-9--changelog-generator)
10. [Feature 10 : DS Component Finder](#feature-10--ds-component-finder)
11. [Roadmap & Planning](#roadmap--planning)
12. [Dependances entre features](#dependances-entre-features)

---

## Architecture partagee

### Structure cible du projet

```
Marcel/
  manifest.json
  package.json
  tsconfig.json
  esbuild.config.mjs
  src/
    main.ts                          # Router principal des messages
    ui.html                          # Interface utilisateur (SPA multi-tabs)
    features/
      starter-kit/                   # V1 - existant
        starter-kit.ts
        config.ts
        builders/
          cover-builder.ts
          overview-builder.ts
          ...
      linter/                        # V2 - Feature 2
        linter-engine.ts             # Moteur de scan et regles
        linter-rules.ts              # Definitions des regles
        linter-autofix.ts            # Heuristiques d'auto-correction
        linter-config.ts             # Config utilisateur
      health-check/                  # V2 - Feature 3
        health-check-engine.ts       # Moteur d'audit DS
        color-checker.ts             # Verification couleurs vs tokens
        typo-checker.ts              # Verification typographies
        spacing-checker.ts           # Verification espacements
        component-checker.ts         # Detached / deprecated
      coverage/                      # V2 - Feature 4
        coverage-engine.ts           # Calcul du taux d'adoption
        coverage-heuristics.ts       # Detection de remplacement possible
        coverage-history.ts          # Snapshots temporels
      statut-manager/                # V3 - Feature 5
        statut-engine.ts             # Gestion des statuts
        statut-kanban.ts             # Vue Kanban
        statut-notifications.ts      # Systeme de notifications
      handoff/                       # V3 - Feature 6
        handoff-checklist.ts         # Moteur de checklist
        handoff-checks.ts            # Verifications automatiques
      token-inspector/               # V3 - Feature 7
        token-matcher.ts             # Matching element -> token
        token-suggestions.ts         # Suggestions de tokens proches
      cover-updater/                 # V3 - Feature 8
        cover-updater.ts             # Mise a jour du cover
      changelog/                     # V4 - Feature 9
        changelog-scanner.ts         # Scan des differences
        changelog-formatter.ts       # Export markdown/JSON
      component-finder/              # V4 - Feature 10
        finder-engine.ts             # Recherche dans la librairie
        finder-preview.ts            # Preview et insertion
    shared/
      figma-helpers.ts               # Utilitaires Figma API (existant)
      tokens.ts                      # Tokens du DS (existant)
      constants.ts                   # Constantes partagees
      node-traversal.ts              # NEW: Parcours recursif de l'arbre
      scoring.ts                     # NEW: Calcul de scores de conformite
      storage.ts                     # NEW: Abstraction clientStorage
      ui-messaging.ts                # NEW: Typage des messages UI <-> sandbox
      violation-types.ts             # NEW: Types partages pour violations
```

### Modules partages (NEW)

#### `shared/node-traversal.ts`

Utilise par : Linter, Health Check, Coverage, Token Inspector

```typescript
interface TraversalOptions {
  includeHidden?: boolean;
  maxDepth?: number;
  nodeTypes?: NodeType[];
  skipPages?: string[];          // ex: ["Archives", "Cover"]
}

type NodeVisitor = (node: SceneNode, depth: number, path: string[]) => void | boolean;

function traverseAll(page: PageNode, visitor: NodeVisitor, options?: TraversalOptions): void;
function traverseCurrentPage(visitor: NodeVisitor, options?: TraversalOptions): void;
function traverseSelection(visitor: NodeVisitor): void;
function getNodePath(node: SceneNode): string[];  // ["Page", "Frame", "Group", "Node"]
```

#### `shared/scoring.ts`

Utilise par : Linter, Health Check, Coverage

```typescript
interface ScoringResult {
  score: number;              // 0-100
  totalChecks: number;
  passed: number;
  failed: number;
  warnings: number;
  breakdown: CategoryScore[];
}

interface CategoryScore {
  category: string;
  score: number;
  weight: number;
  violations: Violation[];
}

function calculateWeightedScore(categories: CategoryScore[]): number;
function formatScoreLabel(score: number): "Excellent" | "Bon" | "A ameliorer" | "Critique";
function getScoreColor(score: number): string;  // vert, jaune, orange, rouge
```

#### `shared/storage.ts`

Utilise par : Linter, Coverage, Statut Manager

```typescript
interface StorageManager {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T): Promise<void>;
  delete(key: string): Promise<void>;
  getWithDefault<T>(key: string, defaultValue: T): Promise<T>;
}

// Basee sur figma.clientStorage.getAsync / setAsync
function createStorage(namespace: string): StorageManager;
```

#### `shared/violation-types.ts`

Utilise par : Linter, Health Check, Coverage, Handoff

```typescript
type Severity = "error" | "warning" | "info";

interface Violation {
  id: string;
  nodeId: string;
  nodeName: string;
  nodePath: string[];
  rule: string;
  severity: Severity;
  message: string;
  suggestion?: string;
  autoFixable?: boolean;
  category: string;
}

interface ViolationReport {
  timestamp: number;
  pageId: string;
  pageName: string;
  violations: Violation[];
  score: number;
  summary: Record<Severity, number>;
}
```

#### `shared/ui-messaging.ts`

Typage exhaustif des messages entre le sandbox et l'UI :

```typescript
// Sandbox -> UI
type PluginMessage =
  | { type: "starter-kit-created" }
  | { type: "linter-results"; report: ViolationReport }
  | { type: "linter-fix-applied"; nodeId: string; newName: string }
  | { type: "health-check-results"; report: HealthCheckReport }
  | { type: "coverage-results"; report: CoverageReport }
  | { type: "statut-updated"; screens: ScreenStatus[] }
  | { type: "handoff-results"; checklist: ChecklistResult }
  | { type: "token-info"; tokens: TokenMatch[] }
  | { type: "cover-updated" }
  | { type: "changelog-generated"; content: string; format: "markdown" | "json" }
  | { type: "component-search-results"; components: DSComponent[] }
  | { type: "error"; feature: string; message: string };

// UI -> Sandbox
type UIMessage =
  | { type: "create-starter-kit"; template: string }
  | { type: "run-linter"; scope: "page" | "selection" | "file" }
  | { type: "fix-violation"; violationId: string }
  | { type: "fix-all-violations"; category?: string }
  | { type: "run-health-check" }
  | { type: "run-coverage" }
  | { type: "update-statut"; screenId: string; status: ScreenStatusValue }
  | { type: "run-handoff-check" }
  | { type: "inspect-token" }
  | { type: "update-cover"; data: CoverUpdateData }
  | { type: "generate-changelog" }
  | { type: "search-components"; query: string }
  | { type: "insert-component"; componentKey: string }
  | { type: "navigate-to-node"; nodeId: string }
  | { type: "open-settings"; feature: string };
```

---

## Feature 2 : Layer Naming Linter

### Probleme

Les fichiers Figma accumulent des centaines de layers avec des noms par defaut (`Frame 427`, `Rectangle 12`, `Group 3`) ou vagues (`container`, `wrapper`, `element`). Cela rend la navigation dans le panneau de layers penible, le handoff aux developpeurs confus, et les fichiers inmaintenables. Il n'existe aucun outil interne pour detecter et corriger ces problemes de nommage a l'echelle.

### Solution

Un linter de nommage integre au plugin Marcel qui scanne toutes les layers de la page courante (ou du fichier entier), detecte les violations de conventions de nommage, attribue un score de conformite (0-100%), et propose des corrections automatiques basees sur des heuristiques intelligentes.

### Regles de linting

| ID | Regle | Severite | Description | Pattern detecte |
|----|-------|----------|-------------|-----------------|
| `DEFAULT_NAME` | Noms par defaut | `error` | Detecte les noms generes automatiquement par Figma | `/^(Frame|Rectangle|Ellipse|Line|Group|Vector|Text|Polygon|Star|Image|Slice|Component|Instance|Boolean)\s*\d*$/i` |
| `VAGUE_NAME` | Noms vagues | `warning` | Noms generiques sans semantique | `container`, `wrapper`, `element`, `item`, `box`, `block`, `content`, `inner`, `outer`, `main`, `div`, `section`, `comp`, `layer` |
| `DUPLICATE_SIBLINGS` | Doublons fratrie | `warning` | Deux layers freres avec le meme nom (hors auto-layout repeaters) | Noms identiques au sein du meme parent |
| `COMPONENT_CONVENTION` | Convention composant | `error` | Les composants doivent utiliser `/` pour la hierarchie | Composant dont le nom ne contient pas `/` (ex: `Button` au lieu de `UI/Button/Primary`) |
| `LONG_NAME` | Nom trop long | `info` | Noms deppassant 60 caracteres | `name.length > 60` |
| `SPECIAL_CHARS` | Caracteres speciaux | `info` | Noms contenant des caracteres non-standard | `/[^a-zA-Z0-9\s\-_\/\.àéèêëïîôùûüçÀÉÈÊËÏÎÔÙÛÜÇ]/` |
| `NUMBERED_SUFFIX` | Suffixe numerique | `warning` | Noms se terminant par un numero (souvent un copier-coller) | `/\s+\d+$/` apres exclusion des noms par defaut |

### Heuristiques d'auto-fix

```typescript
interface AutoFixRule {
  condition: (node: SceneNode) => boolean;
  suggestedName: (node: SceneNode) => string;
  confidence: "high" | "medium" | "low";
}

const AUTO_FIX_RULES: AutoFixRule[] = [
  // Rectangle pleine largeur, 1-2px de haut -> Divider
  {
    condition: (n) => n.type === "RECTANGLE"
      && n.width > n.height * 10
      && n.height <= 2,
    suggestedName: () => "Divider",
    confidence: "high",
  },
  // Frame avec layout VERTICAL -> Column
  {
    condition: (n) => n.type === "FRAME"
      && "layoutMode" in n
      && n.layoutMode === "VERTICAL",
    suggestedName: () => "Column",
    confidence: "medium",
  },
  // Frame avec layout HORIZONTAL -> Row
  {
    condition: (n) => n.type === "FRAME"
      && "layoutMode" in n
      && n.layoutMode === "HORIZONTAL",
    suggestedName: () => "Row",
    confidence: "medium",
  },
  // Rectangle avec fills image -> Image
  {
    condition: (n) => n.type === "RECTANGLE"
      && Array.isArray(n.fills)
      && n.fills.some((f: Paint) => f.type === "IMAGE"),
    suggestedName: () => "Image",
    confidence: "high",
  },
  // Ellipse de petite taille -> Dot / Avatar
  {
    condition: (n) => n.type === "ELLIPSE"
      && n.width === n.height
      && n.width <= 48,
    suggestedName: (n) => n.width <= 12 ? "Dot" : "Avatar",
    confidence: "medium",
  },
  // Text node -> Utilise les premiers mots du contenu
  {
    condition: (n) => n.type === "TEXT",
    suggestedName: (n) => {
      const text = (n as TextNode).characters;
      const words = text.trim().split(/\s+/).slice(0, 3).join(" ");
      return words.length > 30 ? words.substring(0, 27) + "..." : words;
    },
    confidence: "low",
  },
  // Frame sans layout, un seul enfant -> Wrapper de [enfant]
  {
    condition: (n) => n.type === "FRAME"
      && !("layoutMode" in n && n.layoutMode !== "NONE")
      && "children" in n
      && n.children.length === 1,
    suggestedName: (n) => `Wrapper/${(n as FrameNode).children[0].name}`,
    confidence: "low",
  },
  // Rectangle avec cornerRadius > 0 et effects shadow -> Card
  {
    condition: (n) => n.type === "RECTANGLE"
      && "cornerRadius" in n
      && (n.cornerRadius as number) > 0
      && n.effects.some(e => e.type === "DROP_SHADOW"),
    suggestedName: () => "Card",
    confidence: "medium",
  },
  // Groupe -> Prefixe "Group/" + type dominant des enfants
  {
    condition: (n) => n.type === "GROUP",
    suggestedName: (n) => {
      const children = (n as GroupNode).children;
      const types = children.map(c => c.type);
      const dominant = mode(types);
      return `Group/${dominant.toLowerCase()}s`;
    },
    confidence: "low",
  },
];
```

### Configuration utilisateur

```typescript
interface LinterConfig {
  enabledRules: Record<string, boolean>;
  customVagueNames: string[];               // Mots supplementaires a considerer vagues
  ignoredLayers: string[];                   // Noms a ignorer (ex: separateurs)
  ignoredPages: string[];                    // Pages a exclure du scan
  autoFixConfidenceThreshold: "high" | "medium" | "low";
  componentNamingPattern: string;            // Regex custom pour composants
  maxNameLength: number;                     // Default: 60
}

// Stockee dans clientStorage
const DEFAULT_LINTER_CONFIG: LinterConfig = {
  enabledRules: {
    DEFAULT_NAME: true,
    VAGUE_NAME: true,
    DUPLICATE_SIBLINGS: true,
    COMPONENT_CONVENTION: true,
    LONG_NAME: true,
    SPECIAL_CHARS: false,
    NUMBERED_SUFFIX: true,
  },
  customVagueNames: [],
  ignoredLayers: ["───────────"],
  ignoredPages: ["Need help ? Comment organiser & documenter"],
  autoFixConfidenceThreshold: "medium",
  componentNamingPattern: ".+/.+",
  maxNameLength: 60,
};
```

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Linter" dans la navigation du plugin
3. Choisit le scope : "Page courante", "Selection", ou "Fichier entier"
4. Clique sur "Scanner"
5. Le plugin parcourt les layers et affiche :
   a. Score de conformite (ex: 72/100)
   b. Nombre de violations par severite (3 erreurs, 12 warnings, 5 infos)
   c. Liste des violations groupees par regle
6. Pour chaque violation, le designer peut :
   a. Cliquer pour naviguer vers le layer concerne
   b. Voir la suggestion d'auto-fix (si disponible)
   c. Appliquer le fix individuellement
   d. Ignorer la violation
7. Ou utiliser les actions groupees :
   a. "Corriger tout" (applique tous les auto-fix)
   b. "Corriger par categorie" (ex: tous les noms par defaut)
8. Le score se met a jour en temps reel apres chaque correction
9. Le designer peut acceder aux Settings pour configurer les regles
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.currentPage.findAll()` | Scanner tous les nodes de la page |
| `figma.root.findAll()` | Scanner tout le fichier |
| `node.name` | Lire le nom du layer |
| `node.name = "..."` | Renommer un layer (auto-fix) |
| `node.type` | Identifier le type de node |
| `node.parent.children` | Detecter les doublons fratrie |
| `node.layoutMode` | Heuristique Column/Row |
| `node.fills` | Heuristique Image |
| `node.effects` | Heuristique Card |
| `node.cornerRadius` | Heuristique Card |
| `figma.viewport.scrollAndZoomIntoView([node])` | Navigation vers un layer |
| `figma.currentPage.selection = [node]` | Selectionner le layer |
| `figma.clientStorage.setAsync()` | Sauvegarder la config |
| `figma.clientStorage.getAsync()` | Charger la config |

#### Structures de donnees

```typescript
interface LintResult {
  violations: Violation[];
  score: number;
  scanDuration: number;          // en ms
  totalNodesScanned: number;
  summary: {
    error: number;
    warning: number;
    info: number;
  };
  byRule: Record<string, {
    count: number;
    autoFixable: number;
  }>;
}

interface LintViolation extends Violation {
  rule: LintRuleId;
  currentName: string;
  suggestedName?: string;
  fixConfidence?: "high" | "medium" | "low";
}
```

### UI Mockup

```
+----------------------------------------------+
|  Marcel                    [Starter] [Linter] |
+----------------------------------------------+
|                                               |
|  Layer Naming Linter                          |
|                                               |
|  Scope: [Page courante v] [ Scanner ]         |
|                                               |
|  +------------------------------------------+|
|  |  Score de conformite                      ||
|  |                                           ||
|  |     72 / 100                              ||
|  |     ████████████░░░░░  A ameliorer        ||
|  |                                           ||
|  |  3 erreurs  12 warnings  5 infos          ||
|  +------------------------------------------+|
|                                               |
|  [ Corriger tout (15) ] [ Parametres ]        |
|                                               |
|  --- Erreurs (3) --------------------------  |
|                                               |
|  ! Frame 427                                  |
|    Page > Section Hero > Frame 427            |
|    Regle: Nom par defaut                      |
|    Suggestion: "Row" (auto-layout horizontal) |
|    [ Naviguer ] [ Appliquer ] [ Ignorer ]     |
|                                               |
|  ! Rectangle 12                               |
|    Page > Section Hero > Rectangle 12         |
|    Regle: Nom par defaut                      |
|    Suggestion: "Divider" (1px pleine largeur) |
|    [ Naviguer ] [ Appliquer ] [ Ignorer ]     |
|                                               |
|  ! MyButton (composant sans /)                |
|    Page > Local components > MyButton         |
|    Regle: Convention composant                |
|    Suggestion: "UI/MyButton"                  |
|    [ Naviguer ] [ Appliquer ] [ Ignorer ]     |
|                                               |
|  --- Warnings (12) ------------------------  |
|                                               |
|  ~ container                                  |
|    Page > Card > container                    |
|    Regle: Nom vague                           |
|    [ Naviguer ] [ Renommer... ] [ Ignorer ]   |
|                                               |
|  ~ wrapper (x4 doublons)                      |
|    ...                                        |
|                                               |
+----------------------------------------------+
```

### Ecran de configuration

```
+----------------------------------------------+
|  < Retour        Parametres du Linter         |
+----------------------------------------------+
|                                               |
|  Regles actives :                             |
|                                               |
|  [x] Noms par defaut            erreur        |
|  [x] Noms vagues                warning       |
|  [x] Doublons fratrie           warning       |
|  [x] Convention composant (/)   erreur        |
|  [x] Noms trop longs            info          |
|  [ ] Caracteres speciaux        info          |
|  [x] Suffixe numerique          warning       |
|                                               |
|  Longueur max: [ 60 ] caracteres              |
|                                               |
|  Mots vagues supplementaires:                 |
|  [ placeholder, temp, test________ ]          |
|                                               |
|  Seuil auto-fix: [Medium v]                   |
|    high   = fixes tres surs uniquement        |
|    medium = inclut heuristiques moderees       |
|    low    = propose tout (a verifier)          |
|                                               |
|  Pages ignorees:                              |
|  [x] Archives                                 |
|  [x] Need help ?                              |
|  [ ] Cover                                    |
|                                               |
|  [ Sauvegarder ]   [ Reinitialiser ]          |
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Fichier avec > 10 000 nodes | Scan par batch avec barre de progression, yield entre chaque batch pour ne pas bloquer l'UI |
| Aucune violation trouvee | Message de felicitation avec score 100/100 |
| Auto-fix cree un doublon | Ajout automatique d'un suffixe contextuel (`Divider`, `Divider/secondary`) |
| Layer verrouille (locked) | Signale la violation mais desactive le bouton "Appliquer" |
| Composant provenant d'une librairie externe | Ignore (pas editable) |
| Nom vague mais intentionnel (ex: "main" dans un layout) | Option "Ignorer" qui ajoute le node a une allowlist locale |
| Selection vide avec scope "Selection" | Message "Selectionnez des elements pour les scanner" |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| Score moyen de conformite des fichiers | > 85/100 apres 3 mois |
| % de fichiers scannes au moins 1 fois | > 70% de l'equipe |
| Temps moyen de scan (page standard) | < 2 secondes |
| Taux d'acceptation des auto-fix | > 60% |
| Reduction des noms par defaut dans les fichiers | -80% en 3 mois |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P0 - Premiere feature V2 |
| **Complexite** | Moyenne (3-4 jours de dev) |
| **Dependances** | `shared/node-traversal.ts`, `shared/scoring.ts`, `shared/storage.ts` |
| **Risque principal** | Performance sur gros fichiers |

---

## Feature 3 : DS Health Check

### Probleme

Les designers utilisent le Marcel Design System mais s'en ecartent regulierement : couleurs saisies en hexa plutot qu'appliquees depuis les tokens, typographies personnalisees au lieu des styles DS, espacements "a l'oeil" plutot que les valeurs standard, composants detaches pour modifications mineures. Ces ecarts s'accumulent et degradent la coherence du produit. Aucun outil ne permet aujourd'hui de mesurer objectivement la conformite d'un fichier au DS.

### Solution

Un audit automatique qui analyse le fichier Figma en profondeur et verifie la conformite aux tokens et composants du Marcel Design System. Il produit un score de conformite global avec un detail par categorie (couleurs, typographies, espacements, composants) et une liste cliquable de violations permettant la navigation directe.

### Categories d'audit

#### 3.1 Couleurs hors-tokens

```typescript
interface ColorCheckConfig {
  tokenColors: Map<string, {
    hex: string;
    name: string;
    cssVar: string;        // --mrcl-color-*
    category: string;      // brand, neutral, semantic, surface
  }>;
  tolerance: number;        // Delta E (CIE76), default: 3
  ignoreOpacity: boolean;   // Ignorer les fills avec opacity < 100%
}

// Verifie chaque fill/stroke de chaque node contre les tokens
function checkColor(color: RGB, config: ColorCheckConfig): {
  isToken: boolean;
  matchedToken?: TokenColor;
  closestToken?: TokenColor;
  deltaE: number;
}
```

| Verification | Severite | Detail |
|-------------|----------|--------|
| Couleur non-token utilisee en fill | `error` | Couleur hexa ne correspondant a aucun token DS |
| Couleur non-token en stroke | `warning` | Stroke non conforme |
| Couleur proche d'un token (delta E < 10) | `warning` | Probablement une erreur, suggestion du token |
| Gradient non-standard | `info` | Gradient ne correspondant pas aux tokens |

#### 3.2 Typographies non-conformes

```typescript
interface TypoCheckConfig {
  allowedFontFamilies: string[];        // ["Marcel Sans", "Marcel Mono"]
  allowedStyles: TypoStyle[];           // Liste des styles DS
  tolerancePx: number;                  // Tolerance taille en px
}

interface TypoStyle {
  name: string;                         // "Heading/H1"
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number | "AUTO";
  letterSpacing: number;
  cssVar: string;                       // --mrcl-typo-heading-h1
}
```

| Verification | Severite | Detail |
|-------------|----------|--------|
| Font family non autorisee | `error` | Police non presente dans le DS |
| Taille de texte non standard | `warning` | Font size ne correspondant a aucun style DS |
| Line height custom | `warning` | Line height differente du style DS |
| Style texte modifie depuis le style DS | `info` | Override sur un style texte applique |

#### 3.3 Espacements non-standard

```typescript
const DS_SPACING_SCALE = [0, 2, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 120, 160];

interface SpacingCheck {
  property: "padding" | "gap" | "itemSpacing";
  value: number;
  isStandard: boolean;
  closestStandard: number;
}
```

| Verification | Severite | Detail |
|-------------|----------|--------|
| Padding hors echelle DS | `warning` | Padding ne correspondant a aucune valeur de l'echelle |
| Gap hors echelle DS | `warning` | Espacement inter-elements non standard |
| Valeur tres proche d'un standard (1-2px) | `info` | Probablement une erreur d'arrondi |

#### 3.4 Composants detaches

| Verification | Severite | Detail |
|-------------|----------|--------|
| Instance detachee (ex-composant DS) | `error` | Composant de la librairie qui a ete detache |
| Composant deprecated utilise | `error` | Version obsolete d'un composant DS |
| Instance avec overrides excessifs | `warning` | > 5 overrides sur une instance |

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Health Check"
3. Clique sur "Lancer l'audit"
4. Le plugin scanne le fichier (barre de progression)
5. Affichage des resultats :
   a. Score global de conformite (ex: 68/100)
   b. Scores par categorie :
      - Couleurs: 75/100
      - Typographies: 82/100
      - Espacements: 60/100
      - Composants: 55/100
   c. Nombre de violations total et par categorie
6. Le designer clique sur une categorie pour voir le detail
7. Chaque violation est cliquable : navigation vers le node concerne
8. Pour les couleurs et espacements : suggestion du token le plus proche
9. Le designer corrige et peut relancer l'audit pour voir le score evoluer
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.getLocalPaintStyles()` | Lister les styles de couleur locaux |
| `figma.getLocalTextStyles()` | Lister les styles de texte locaux |
| `node.fills` | Inspecter les fills d'un element |
| `node.strokes` | Inspecter les strokes |
| `node.fontName` | Verifier la police de texte |
| `node.fontSize` | Verifier la taille de texte |
| `node.lineHeight` | Verifier le line height |
| `node.letterSpacing` | Verifier le letter spacing |
| `node.paddingLeft/Right/Top/Bottom` | Verifier les paddings |
| `node.itemSpacing` | Verifier le gap |
| `node.type === "INSTANCE"` | Detecter les instances |
| `(node as InstanceNode).mainComponent` | Verifier le composant source |
| `(node as InstanceNode).detachInstance()` | N/A (detection seulement) |
| `node.overriddenProperties` | Compter les overrides |
| `figma.viewport.scrollAndZoomIntoView()` | Navigation vers violation |

#### Structure de donnees

```typescript
interface HealthCheckReport {
  timestamp: number;
  fileId: string;
  globalScore: number;
  categories: {
    colors: CategoryAudit;
    typography: CategoryAudit;
    spacing: CategoryAudit;
    components: CategoryAudit;
  };
  totalViolations: number;
  scanDuration: number;
  nodesScanned: number;
}

interface CategoryAudit {
  score: number;
  weight: number;           // Poids dans le score global
  violations: HealthViolation[];
  summary: string;          // "75% des couleurs utilisent les tokens DS"
}

interface HealthViolation extends Violation {
  currentValue: string;     // ex: "#FF5733"
  expectedValue?: string;   // ex: "--mrcl-color-brand-primary"
  closestMatch?: {
    value: string;
    name: string;
    distance: number;       // Delta E pour couleurs, px pour spacing
  };
}
```

### UI Mockup

```
+----------------------------------------------+
|  Marcel           [Starter] [Linter] [Health] |
+----------------------------------------------+
|                                               |
|  DS Health Check                              |
|                                               |
|  [ Lancer l'audit ]                           |
|                                               |
|  +------------------------------------------+|
|  |  Score global : 68 / 100                  ||
|  |  ████████████████░░░░░░░  A ameliorer     ||
|  +------------------------------------------+|
|                                               |
|  +----------+ +----------+ +--------+ +-----+|
|  | Couleurs | | Typo     | |Spacing | |Comp ||
|  |   75     | |   82     | |  60    | | 55  ||
|  | 12 err   | |  5 err   | | 8 warn | |3 err||
|  +----------+ +----------+ +--------+ +-----+|
|                                               |
|  --- Couleurs (12 violations) -------------- |
|                                               |
|  ! #FF5733 utilise sur "Hero/Title"           |
|    Token le plus proche :                     |
|    --mrcl-color-brand-primary (#FF5500)       |
|    Delta E: 4.2                               |
|    [ Naviguer ]                               |
|                                               |
|  ! #333333 utilise sur "Body text"            |
|    Token le plus proche :                     |
|    --mrcl-color-neutral-900 (#2D2D2D)        |
|    Delta E: 6.1                               |
|    [ Naviguer ]                               |
|                                               |
|  --- Composants (3 violations) ------------- |
|                                               |
|  !! Instance detachee: "Button/Primary"       |
|     Anciennement: UI/Button/Primary           |
|     Page > Section CTA > Frame > element      |
|     [ Naviguer ]                              |
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Aucun token DS configure | Message "Configurez les tokens DS dans les parametres du plugin" |
| Fichier sans styles DS appliques | Score 0/100 avec message explicatif |
| Composant de librairie externe (pas Marcel DS) | Classe en "non-DS" mais n'est pas une erreur |
| Texte avec mixed fonts (plusieurs styles dans un meme text node) | Signale chaque segment individuellement |
| Gradient custom | Compare les stops du gradient aux tokens couleur |
| Node cache (hidden) | Inclus dans le scan par defaut, option pour exclure |
| Fills/strokes avec variables Figma attachees | Considere comme conforme si la variable mappe un token DS |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| Score DS moyen des fichiers de l'equipe | > 80/100 apres 6 mois |
| % de fichiers audites avant livraison | > 90% |
| Temps de scan fichier moyen | < 5 secondes |
| Reduction des couleurs hors-tokens | -70% en 6 mois |
| Reduction des composants detaches | -60% en 6 mois |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P0 - Feature V2 cle |
| **Complexite** | Elevee (5-7 jours de dev) |
| **Dependances** | `shared/node-traversal.ts`, `shared/scoring.ts`, `shared/violation-types.ts`, `shared/tokens.ts` (existant) |
| **Risque principal** | Exactitude du matching tokens, faux positifs |

---

## Feature 4 : Library Coverage Report

### Probleme

L'equipe Design Ops n'a aucune visibilite sur le taux reel d'adoption du Design System. Combien d'elements dans les fichiers proviennent effectivement de la librairie Marcel DS ? Combien sont des composants locaux ou des elements bruts qui pourraient etre remplaces par des composants DS ? Sans ces metriques, impossible de mesurer le ROI du DS ni d'identifier les axes d'amelioration.

### Solution

Un rapport de couverture qui mesure le taux d'adoption du DS dans le fichier, categorise chaque element (DS library / local component / raw element), detecte les elements candidats au remplacement par des composants DS, et permet un suivi temporel via des snapshots.

### Metriques calculees

```typescript
interface CoverageReport {
  timestamp: number;
  fileId: string;
  fileName: string;

  // Metriques principales
  globalCoverage: number;             // 0-100%
  totalElements: number;

  breakdown: {
    dsLibrary: {
      count: number;
      percentage: number;
      components: ComponentUsage[];   // Detail par composant
    };
    localComponents: {
      count: number;
      percentage: number;
      components: ComponentUsage[];
    };
    rawElements: {
      count: number;
      percentage: number;
      replaceable: ReplaceableElement[];
    };
  };

  // Heuristiques de remplacement
  replacementOpportunities: ReplaceableElement[];
  potentialCoverageGain: number;       // % gagnable si tout est remplace

  // Historique
  history: CoverageSnapshot[];
}

interface ComponentUsage {
  componentName: string;
  componentKey?: string;
  count: number;
  pages: string[];
}

interface ReplaceableElement {
  nodeId: string;
  nodeName: string;
  nodePath: string[];
  detectedPattern: string;            // "Card", "Button", "Input", "Avatar"
  confidence: "high" | "medium" | "low";
  suggestedComponent: string;         // "UI/Card/Default"
  reason: string;                     // "Rectangle + border-radius + shadow"
}

interface CoverageSnapshot {
  date: string;                       // ISO date
  globalCoverage: number;
  dsCount: number;
  localCount: number;
  rawCount: number;
}
```

### Heuristiques de detection de remplacement

| Pattern detecte | Composant DS suggere | Condition | Confiance |
|----------------|---------------------|-----------|-----------|
| Rectangle + border-radius + shadow | `UI/Card/Default` | `cornerRadius > 0 && hasDropShadow && children.length > 0` | `medium` |
| Rectangle + border + texte centre | `UI/Button/Primary` | `height 32-56 && hasText && hasFill && hasBorder` | `medium` |
| Ellipse + image fill + taille 24-64 | `UI/Avatar/Default` | `isCircle && hasImageFill && size in [24,32,40,48,64]` | `high` |
| Rectangle + border + texte input | `UI/Input/Default` | `height 36-48 && hasBorder && hasText && width > 120` | `medium` |
| Ligne horizontale + opacite reduite | `UI/Divider` | `height <= 2 && opacity < 0.5` | `high` |
| Frame + icone + texte | `UI/ListItem` | `layoutMode === "HORIZONTAL" && hasIcon && hasText` | `low` |
| Rectangle arrondi + texte court | `UI/Badge` ou `UI/Tag` | `cornerRadius >= height/2 && textLength < 20` | `medium` |

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Coverage"
3. Clique sur "Analyser la couverture"
4. Le plugin scanne le fichier et affiche :
   a. Taux de couverture global (ex: 62%)
   b. Graphique en barres : DS Library / Local / Raw
   c. Top 10 des composants DS les plus utilises
   d. Liste des elements remplacables
5. Le designer clique sur un element remplacable :
   a. Navigation vers l'element
   b. Suggestion du composant DS equivalent
6. Section "Historique" :
   a. Graphique d'evolution du taux de couverture
   b. Comparaison avec le dernier snapshot
   c. Bouton "Sauvegarder un snapshot"
7. Le designer peut exporter le rapport (copier en JSON)
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `node.type === "INSTANCE"` | Detecter les instances de composants |
| `(node as InstanceNode).mainComponent` | Identifier le composant source |
| `mainComponent.remote` | Savoir si le composant vient d'une librairie externe (DS) |
| `mainComponent.parent` | Remonter la hierarchie du composant |
| `mainComponent.key` | Identifier le composant de maniere unique |
| `figma.root.findAll()` | Parcourir tous les elements |
| `node.fills`, `node.strokes`, `node.effects` | Heuristiques de remplacement |
| `node.cornerRadius`, `node.layoutMode` | Heuristiques de remplacement |
| `figma.clientStorage.setAsync()` | Stocker les snapshots historiques |
| `figma.clientStorage.getAsync()` | Recuperer l'historique |

#### Stockage des snapshots

```typescript
// Cle clientStorage: "marcel_coverage_history_{fileId}"
interface CoverageHistory {
  fileId: string;
  fileName: string;
  snapshots: CoverageSnapshot[];   // Max 50 snapshots
  lastUpdated: string;
}

// Un snapshot est sauvegarde manuellement ou automatiquement (1x/semaine si plugin ouvert)
```

### UI Mockup

```
+----------------------------------------------+
|  Marcel       [...] [Linter] [Health] [Cov.]  |
+----------------------------------------------+
|                                               |
|  Library Coverage Report                      |
|                                               |
|  [ Analyser la couverture ]                   |
|                                               |
|  +------------------------------------------+|
|  |  Couverture DS : 62%                      ||
|  |  ██████████████████░░░░░░░░░░░            ||
|  +------------------------------------------+|
|                                               |
|  DS Library      ██████████████  347  (62%)   |
|  Local comp.     █████           89  (16%)    |
|  Raw elements    ██████         124  (22%)    |
|                                               |
|  --- Top composants DS ---                    |
|  1. UI/Button/Primary        x42              |
|  2. UI/Icon/Default          x38              |
|  3. UI/Input/Default         x27              |
|  4. UI/Card/Default          x19              |
|  5. UI/Avatar/Default        x15              |
|                                               |
|  --- Elements remplacables (18) ------------ |
|                                               |
|  ~ "Rectangle 45" -> UI/Card/Default          |
|    Raison: border-radius + shadow + enfants   |
|    Confiance: medium                          |
|    [ Naviguer ] [ Voir le composant DS ]      |
|                                               |
|  --- Historique -----------------------------+|
|                                               |
|  Feb 10: 55% -> Feb 17: 59% -> Feb 24: 62%   |
|       [+4%]        [+3%]                      |
|                                               |
|  [ Sauvegarder un snapshot ]                  |
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Aucune librairie DS activee | Message "Activez la librairie Marcel DS dans Assets > Libraries" |
| Composant DS modifie localement (detached) | Classe en "raw" mais signale l'ancien composant source |
| Nested instances (instance dans instance) | Compte uniquement l'instance de plus haut niveau |
| Pages "Archives" | Exclues du calcul par defaut (configurable) |
| Fichier vide | Score N/A, message "Aucun element a analyser" |
| Premier lancement (pas d'historique) | Section historique masquee, premier snapshot cree automatiquement |
| Heuristique faux positif (element detecte a tort comme Card) | Option "Ce n'est pas un [composant]" pour feedback |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| Taux de couverture DS moyen | > 75% apres 6 mois |
| Nombre de remplacements effectues suite a suggestion | > 100 par mois |
| % de fichiers avec au moins 1 snapshot | > 50% |
| Augmentation trimestrielle du taux de couverture | +5% par trimestre |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P1 - Feature V2 |
| **Complexite** | Elevee (5-6 jours de dev) |
| **Dependances** | `shared/node-traversal.ts`, `shared/scoring.ts`, `shared/storage.ts` |
| **Risque principal** | Qualite des heuristiques, identification correcte de la librairie DS |

---

## Feature 5 : Statut Manager

### Probleme

Le suivi de l'avancement des ecrans/flows dans un fichier Figma est aujourd'hui informel : le designer met a jour un composant "Status" manuellement sur chaque ecran, les PMs doivent ouvrir le fichier et chercher visuellement les statuts, et il n'y a aucune vue d'ensemble de l'avancement. Cela genere de la friction dans la communication et des oublis de mise a jour.

### Solution

Un panneau centralise dans le plugin Marcel qui liste tous les ecrans/flows du fichier avec leur statut actuel (WIP, Review, Ready, Delivered), permet des mises a jour individuelles ou en masse, offre une vue Kanban, et s'interface avec les composants de statut du Marcel DS (Highlight annotations).

### Modele de donnees

```typescript
type ScreenStatusValue = "WIP" | "Review" | "Ready" | "Delivered" | "Archived" | "Blocked";

interface ScreenStatus {
  nodeId: string;
  nodeName: string;
  pageName: string;
  status: ScreenStatusValue;
  lastUpdated: string;           // ISO date
  updatedBy?: string;            // Nom du designer (si disponible)
  flow?: string;                 // Nom du flow parent
  notes?: string;                // Note optionnelle
  statusNodeId?: string;         // ID du composant status DS associe
}

interface FlowStatus {
  name: string;
  screens: ScreenStatus[];
  progress: number;              // % d'ecrans "Ready" ou "Delivered"
  allReady: boolean;             // Notification trigger
}

interface StatutManagerState {
  screens: ScreenStatus[];
  flows: FlowStatus[];
  lastScan: string;
  notifications: StatusNotification[];
}

interface StatusNotification {
  type: "flow-ready" | "status-changed" | "all-delivered";
  message: string;
  timestamp: string;
  flowName?: string;
}

// Couleurs par statut
const STATUS_COLORS: Record<ScreenStatusValue, string> = {
  WIP: "#FFA500",          // Orange
  Review: "#3B82F6",       // Bleu
  Ready: "#22C55E",        // Vert
  Delivered: "#8B5CF6",    // Violet
  Archived: "#6B7280",     // Gris
  Blocked: "#EF4444",      // Rouge
};
```

### Detection automatique des ecrans

```typescript
// Strategie de detection des "ecrans" dans le fichier :
// 1. Top-level frames sur les pages "Delivery" et "UI & Prototype"
// 2. Frames dont le nom ne commence pas par "." (convention hidden)
// 3. Frames avec width >= 320 (exclure les petits elements)
// 4. Exclure les separateurs et annotations

function detectScreens(pages: PageNode[]): ScreenCandidate[] {
  const targetPages = ["Delivery", "UI & Prototype"];
  // ...
}

// Detection des composants Status DS deja presents
function findStatusAnnotation(screen: FrameNode): InstanceNode | null {
  // Cherche un enfant direct ou overlay qui est une instance de "Status/*"
}
```

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Statuts"
3. Le plugin scanne les pages Delivery et UI & Prototype
4. Affichage :
   a. Vue Liste (par defaut) :
      - Tous les ecrans groupes par page/flow
      - Dropdown de statut pour chaque ecran
      - Barre de progression par flow
   b. Vue Kanban :
      - Colonnes : WIP | Review | Ready | Delivered
      - Cartes deplacables (drag conceptuel via boutons)
5. Le designer peut :
   a. Changer le statut d'un ecran (met a jour le composant DS sur le canvas)
   b. Selectionner plusieurs ecrans et changer en masse
   c. Cliquer sur un ecran pour naviguer vers lui
   d. Ajouter une note a un ecran
6. Quand tous les ecrans d'un flow passent en "Ready" :
   - Notification dans le plugin
   - Le flow est marque comme pret
7. Le designer peut filtrer par statut ou par flow
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.root.children` | Lister les pages |
| `page.children` | Lister les top-level frames (ecrans) |
| `node.type === "INSTANCE"` | Detecter les composants Status |
| `(node as InstanceNode).mainComponent.name` | Verifier si c'est un Status DS |
| `(node as InstanceNode).setProperties()` | Mettre a jour le variant du Status |
| `figma.importComponentByKeyAsync()` | Inserer un nouveau composant Status |
| `component.createInstance()` | Creer une instance Status |
| `figma.viewport.scrollAndZoomIntoView()` | Navigation vers ecran |
| `figma.clientStorage.setAsync()` | Sauvegarder l'etat des statuts |
| `figma.currentPage.selection` | Selectionner un ecran |

### UI Mockup — Vue Liste

```
+----------------------------------------------+
|  Marcel                           [Statuts]   |
+----------------------------------------------+
|                                               |
|  Statut Manager                               |
|                                               |
|  [Liste]  [Kanban]     Filtre: [Tous v]       |
|                                               |
|  --- Flow: Onboarding (3/5 Ready) ---------- |
|  ██████████████░░░░░░  60%                    |
|                                               |
|  [ ] Splash Screen         [Ready     v]      |
|  [ ] Login                 [Ready     v]      |
|  [ ] Signup Step 1         [Review    v]      |
|  [ ] Signup Step 2         [WIP       v]      |
|  [ ] Welcome               [Ready     v]      |
|                                               |
|  --- Flow: Dashboard (1/3 Ready) ----------- |
|  ██████░░░░░░░░░░░░░░  33%                   |
|                                               |
|  [ ] Home                  [Ready     v]      |
|  [ ] Profile               [WIP       v]      |
|  [ ] Settings              [WIP       v]      |
|                                               |
|  ------------------------------------------- |
|  Selection: 0 ecran(s)                        |
|  [ Changer le statut en masse: [____v] ]      |
|                                               |
+----------------------------------------------+
```

### UI Mockup — Vue Kanban

```
+----------------------------------------------+
|  Statut Manager            [Liste] [Kanban]   |
+----------------------------------------------+
|                                               |
| WIP (3)    | Review (1) | Ready (4) | Deliv. |
| ---------- | ---------- | --------- | ------ |
| +--------+ | +--------+ | +-------+ |        |
| |Signup 2| | |Signup 1| | |Splash | |        |
| |Onboard.| | |Onboard.| | |Onbrd. | |        |
| |[>][>>] | | |[>][>>] | | |[>>]   | |        |
| +--------+ | +--------+ | +-------+ |        |
| +--------+ |            | +-------+ |        |
| |Profile | |            | |Login  | |        |
| |Dashbrd.| |            | |Onbrd. | |        |
| |[>][>>] | |            | |[>>]   | |        |
| +--------+ |            | +-------+ |        |
| +--------+ |            | +-------+ |        |
| |Settings| |            | |Welcome| |        |
| |Dashbrd.| |            | |Onbrd. | |        |
| |[>][>>] | |            | |[>>]   | |        |
| +--------+ |            | +-------+ |        |
|            |            | +-------+ |        |
|            |            | |Home   | |        |
|            |            | |Dashb. | |        |
|            |            | |[>>]   | |        |
|            |            | +-------+ |        |
+----------------------------------------------+
| [>] = avancer d'un statut                     |
| [>>] = marquer comme Delivered                |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Aucun ecran detecte | Message "Aucun ecran trouve. Verifiez que vos pages Delivery ou UI & Prototype contiennent des frames." |
| Composant Status DS introuvable dans la librairie | Gestion du statut uniquement via le plugin (sans mise a jour visuelle sur le canvas) |
| Ecran supprime apres avoir eu un statut | Retrait automatique de la liste au prochain scan |
| Deux ecrans avec le meme nom | Affichage du chemin complet pour desambiguer |
| Page renommee | Re-scan automatique a l'ouverture de l'onglet |
| Fichier en lecture seule | Affichage des statuts en lecture seule, actions de modification desactivees |
| Drag & drop en Kanban (non supporte par l'iframe) | Boutons [>] pour avancer et [<<] pour reculer |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| % de fichiers avec statuts geres via le plugin | > 60% |
| Temps de mise a jour d'un statut | < 3 secondes (vs ~15s manuellement) |
| Utilisation de la vue Kanban | > 40% des sessions |
| Reduction des oublis de mise a jour de statut | -50% |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P1 - Feature V3 |
| **Complexite** | Moyenne-Elevee (4-5 jours de dev) |
| **Dependances** | `shared/storage.ts`, `shared/node-traversal.ts`, composant Status DS |
| **Risque principal** | Detection fiable des ecrans, synchronisation avec le composant DS |

---

## Feature 6 : Handoff Checklist

### Probleme

Avant de livrer un fichier aux developpeurs, le designer doit verifier manuellement plusieurs criteres de qualite : statuts a jour, nommage correct des layers, composants a jour, annotations presentes, prototype lie, etc. Cette verification est fastidieuse, sujette aux oublis, et il n'y a aucun standard partage sur ce qui constitue un fichier "pret a livrer".

### Solution

Une checklist pre-livraison qui combine des verifications automatiques (resultats du Linter, statuts, version des composants) et des verifications manuelles (confirmees par le designer). La checklist bloque ou avertit si le fichier n'est pas pret, et sert de gate de qualite avant le handoff.

### Items de la checklist

#### Verifications automatiques

```typescript
interface AutoCheck {
  id: string;
  label: string;
  description: string;
  check: () => Promise<CheckResult>;
  severity: "blocker" | "warning" | "info";
  category: "status" | "naming" | "components" | "documentation" | "prototype";
}

const AUTO_CHECKS: AutoCheck[] = [
  {
    id: "all-screens-ready",
    label: "Tous les ecrans ont le statut Ready ou Delivered",
    description: "Verifie que chaque ecran sur la page Delivery a un statut >= Ready",
    severity: "blocker",
    category: "status",
  },
  {
    id: "no-default-names",
    label: "Aucun layer avec un nom par defaut",
    description: "Integre les resultats du Linter (regle DEFAULT_NAME)",
    severity: "warning",
    category: "naming",
  },
  {
    id: "linter-score-above-80",
    label: "Score du Linter >= 80/100",
    description: "Le fichier doit atteindre un score minimum de nommage",
    severity: "warning",
    category: "naming",
  },
  {
    id: "components-latest-version",
    label: "Tous les composants DS sont a jour",
    description: "Verifie qu'aucune instance n'est en version obsolete",
    severity: "blocker",
    category: "components",
  },
  {
    id: "no-detached-components",
    label: "Aucun composant DS detache",
    description: "Integre les resultats du Health Check",
    severity: "warning",
    category: "components",
  },
  {
    id: "annotations-present",
    label: "Annotations presentes sur la page Delivery",
    description: "Detecte les instances de composants Annotation/Note du DS",
    severity: "warning",
    category: "documentation",
  },
  {
    id: "prototype-linked",
    label: "Au moins un prototype lie",
    description: "Verifie que des interactions/prototype connections existent",
    severity: "info",
    category: "prototype",
  },
  {
    id: "cover-status-updated",
    label: "Statut du Cover a jour",
    description: "Le composant Cover affiche 'Design Done' ou plus avance",
    severity: "blocker",
    category: "status",
  },
  {
    id: "health-check-score-above-70",
    label: "Score Health Check >= 70/100",
    description: "Le fichier respecte les standards DS a un niveau acceptable",
    severity: "warning",
    category: "components",
  },
];
```

#### Verifications manuelles

```typescript
interface ManualCheck {
  id: string;
  label: string;
  description: string;
  severity: "blocker" | "warning" | "info";
  category: string;
}

const MANUAL_CHECKS: ManualCheck[] = [
  {
    id: "responsive-variants",
    label: "Les variantes responsive sont couvertes",
    description: "Confirmez que les ecrans Mobile, Tablet et Desktop sont presents si applicable",
    severity: "warning",
    category: "documentation",
  },
  {
    id: "edge-cases-documented",
    label: "Les cas limites sont documentes",
    description: "Etats vides, erreurs, chargement, limites de contenu",
    severity: "warning",
    category: "documentation",
  },
  {
    id: "stakeholder-approval",
    label: "Le design a ete approuve par le stakeholder",
    description: "PM ou Lead a valide les maquettes finales",
    severity: "blocker",
    category: "status",
  },
  {
    id: "specs-page-filled",
    label: "La page Specs est renseignee",
    description: "Specifications techniques, comportements, regles metier",
    severity: "info",
    category: "documentation",
  },
];
```

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Handoff"
3. Le plugin lance automatiquement les verifications automatiques
4. Affichage de la checklist :
   a. Verifications automatiques avec statut (pass/fail/warning)
   b. Verifications manuelles avec checkbox
   c. Score de preparation global
5. Pour chaque check en echec :
   a. Lien "Voir les details" (ouvre le Linter ou Health Check correspondant)
   b. Lien "Naviguer" vers les elements concernes
6. Le designer coche les verifications manuelles au fur et a mesure
7. En bas de la checklist :
   a. Si blockers non resolus : "Fichier non pret pour le handoff" (rouge)
   b. Si warnings seulement : "Fichier pret avec reserves" (jaune)
   c. Si tout est OK : "Fichier pret pour le handoff !" (vert)
8. Option "Copier le rapport" pour partager dans Slack/Jira
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| Toutes les API du Linter | Reutilisation des resultats de scan |
| Toutes les API du Health Check | Reutilisation des scores |
| Toutes les API du Statut Manager | Verification des statuts |
| `node.reactions` | Detecter les prototype connections |
| `figma.getLocalPaintStyles()` | Verifier les styles locaux |
| `(instance as InstanceNode).mainComponent.remote` | Verifier la source du composant |

#### Structure de donnees

```typescript
interface CheckResult {
  checkId: string;
  passed: boolean;
  severity: "blocker" | "warning" | "info";
  message: string;
  details?: string;
  relatedNodeIds?: string[];
  relatedFeature?: "linter" | "health-check" | "statut-manager";
}

interface ChecklistResult {
  timestamp: number;
  autoChecks: CheckResult[];
  manualChecks: ManualCheckResult[];
  overallStatus: "blocked" | "ready-with-warnings" | "ready";
  score: number;                      // 0-100%
  blockerCount: number;
  warningCount: number;
}

interface ManualCheckResult {
  checkId: string;
  confirmed: boolean;
  confirmedAt?: string;
}
```

### UI Mockup

```
+----------------------------------------------+
|  Marcel                          [Handoff]    |
+----------------------------------------------+
|                                               |
|  Handoff Checklist                            |
|                                               |
|  +------------------------------------------+|
|  |  Preparation : 7/11                       ||
|  |  ██████████████████░░░░░░  64%            ||
|  |  2 blockers | 2 warnings                  ||
|  +------------------------------------------+|
|                                               |
|  --- Verifications automatiques ------------ |
|                                               |
|  [x] Tous les ecrans "Ready"       blocker   |
|      -> 2 ecrans encore en WIP               |
|      [ Voir dans Statut Manager ]             |
|                                               |
|  [!] Aucun nom par defaut          warning    |
|      -> 7 noms par defaut detectes            |
|      [ Voir dans Linter ]                     |
|                                               |
|  [x] Score Linter >= 80            warning    |
|      -> Score actuel: 72/100                  |
|      [ Ouvrir le Linter ]                     |
|                                               |
|  [v] Composants DS a jour          blocker    |
|                                               |
|  [v] Aucun composant detache       warning    |
|                                               |
|  [v] Annotations presentes         warning    |
|                                               |
|  [v] Prototype lie                 info       |
|                                               |
|  [x] Cover a jour                  blocker   |
|      -> Statut actuel: "In Progress"          |
|      [ Mettre a jour via Cover Updater ]      |
|                                               |
|  --- Verifications manuelles --------------- |
|                                               |
|  [ ] Variantes responsive couvertes           |
|  [x] Cas limites documentes                   |
|  [ ] Approbation stakeholder                  |
|  [ ] Page Specs renseignee                    |
|                                               |
|  ===========================================  |
|  | !! FICHIER NON PRET POUR LE HANDOFF    |  |
|  | Resolvez les 2 blockers restants       |  |
|  ===========================================  |
|                                               |
|  [ Copier le rapport ]                        |
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Linter jamais execute | Lance un scan rapide automatiquement |
| Health Check jamais execute | Lance un audit automatiquement |
| Statut Manager non configure | Detecte les statuts depuis les composants DS sur le canvas |
| Page Delivery absente | Blocker : "Creez la page Delivery (utilisez le Starter Kit)" |
| Composant annotation non trouve dans le DS | Skip le check avec message "Check non applicable" |
| Fichier en lecture seule | Affiche la checklist en mode lecture (informations seulement) |
| Check manuel deja confirme mais fichier modifie depuis | Reset les confirmations manuelles avec avertissement |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| % de fichiers verifies avant handoff | > 80% |
| Taux de blockers resolus avant livraison | > 95% |
| Reduction des allers-retours dev/design post-handoff | -40% |
| Temps moyen pour completer la checklist | < 5 minutes |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P0 - Feature V3 cle |
| **Complexite** | Moyenne (3-4 jours de dev) |
| **Dependances** | **Feature 2 (Linter)**, **Feature 3 (Health Check)**, **Feature 5 (Statut Manager)** |
| **Risque principal** | Dependances croisees, necessite que les features prerequises soient stables |

---

## Feature 7 : Token Inspector

### Probleme

Lors du handoff, les developpeurs ont besoin de connaitre les tokens DS utilises (variables CSS, spacing tokens, color tokens) mais ils doivent deviner a partir des valeurs brutes. Cote designer, il est difficile de savoir si un element utilise bien un token DS ou une valeur arbitraire sans verifier manuellement chaque propriete.

### Solution

Un inspecteur contextuel qui, pour tout element selectionne, affiche les tokens DS correspondants ou signale les ecarts. Il montre le nom de la variable CSS, suggere le token le plus proche si la valeur est hors-token, et couvre couleurs, espacements, border-radius et typographie.

### Matching des tokens

```typescript
interface TokenMatch {
  property: string;            // "fill", "stroke", "fontSize", "padding-top", etc.
  currentValue: string;        // Valeur brute (#FF5500, 16px, etc.)
  isToken: boolean;            // Correspond exactement a un token ?
  token?: {
    name: string;              // "color-brand-primary"
    cssVar: string;            // "--mrcl-color-brand-primary"
    category: string;          // "color", "spacing", "radius", "typography"
    value: string;             // "#FF5500"
  };
  closestToken?: {
    name: string;
    cssVar: string;
    value: string;
    distance: number;          // Delta E pour couleurs, px pour spacing
  };
  status: "match" | "close" | "off-token";
}

// Categories de tokens supportees
interface TokenDatabase {
  colors: TokenEntry[];        // --mrcl-color-*
  spacing: TokenEntry[];       // --mrcl-spacing-*  (4, 8, 12, 16, 24, 32, 48, 64)
  borderRadius: TokenEntry[];  // --mrcl-radius-*   (0, 2, 4, 8, 12, 16, 9999)
  typography: TypoTokenEntry[];// --mrcl-typo-*
  shadows: ShadowTokenEntry[]; // --mrcl-shadow-*
}

interface TokenEntry {
  name: string;
  cssVar: string;
  value: number | string;
}

interface TypoTokenEntry extends TokenEntry {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number | string;
  letterSpacing: number;
}
```

### User Flow

```
1. Designer selectionne un element sur le canvas
2. Ouvre le plugin Marcel, onglet "Token Inspector"
3. Le plugin analyse l'element selectionne et affiche :
   a. Chaque propriete avec son statut token
   b. Indicateur vert (token exact), jaune (proche), rouge (hors token)
   c. Le nom de la variable CSS pour les devs
4. Si une propriete est hors-token :
   a. Suggestion du token le plus proche
   b. Distance/ecart affiche
5. Le designer peut copier les variables CSS (clic pour copier)
6. Mise a jour en temps reel quand la selection change
7. Vue "Developer mode" : affiche toutes les variables en bloc copiable
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.currentPage.selection` | Obtenir l'element selectionne |
| `figma.on("selectionchange", callback)` | Reagir au changement de selection |
| `node.fills` | Inspecter les couleurs de remplissage |
| `node.strokes` | Inspecter les couleurs de bordure |
| `node.strokeWeight` | Epaisseur de bordure |
| `node.cornerRadius` | Border radius |
| `node.topLeftRadius`, etc. | Border radius individuels |
| `node.paddingLeft/Right/Top/Bottom` | Paddings |
| `node.itemSpacing` | Gap |
| `node.fontName` | Police |
| `node.fontSize` | Taille de texte |
| `node.lineHeight` | Hauteur de ligne |
| `node.letterSpacing` | Espacement des lettres |
| `node.effects` | Shadows, blurs |
| `node.opacity` | Opacite |
| `node.boundVariables` | Variables Figma liees (si utilisees) |

### UI Mockup

```
+----------------------------------------------+
|  Marcel                     [Token Inspector] |
+----------------------------------------------+
|                                               |
|  Token Inspector                              |
|  Selection: "Hero/CTA Button"                 |
|  Type: INSTANCE (UI/Button/Primary)           |
|                                               |
|  --- Couleurs ---                             |
|                                               |
|  Fill   #FF5500                               |
|  [====] --mrcl-color-brand-primary            |
|         Token exact                           |
|                                               |
|  Stroke #E0E0E0                               |
|  [!!!!] Hors token                            |
|         Proche: --mrcl-color-neutral-200      |
|         (#E5E5E5, delta E: 2.1)               |
|                                               |
|  --- Espacements ---                          |
|                                               |
|  Padding H  16px                              |
|  [====] --mrcl-spacing-m                      |
|                                               |
|  Padding V  12px                              |
|  [====] --mrcl-spacing-s                      |
|                                               |
|  Gap  8px                                     |
|  [====] --mrcl-spacing-xs                     |
|                                               |
|  --- Border Radius ---                        |
|                                               |
|  Radius  8px                                  |
|  [====] --mrcl-radius-m                       |
|                                               |
|  --- Typographie ---                          |
|                                               |
|  Font   Marcel Sans / SemiBold / 16px         |
|  [====] --mrcl-typo-button-m                  |
|                                               |
|  --- Shadow ---                               |
|                                               |
|  Drop Shadow  0 2 8 rgba(0,0,0,0.1)          |
|  [====] --mrcl-shadow-sm                      |
|                                               |
|  +------------------------------------------+|
|  |  Copier pour les devs :                   ||
|  |  background: var(--mrcl-color-brand-...); ||
|  |  padding: var(--mrcl-spacing-s) var(...)  ||
|  |  border-radius: var(--mrcl-radius-m);     ||
|  |  [ Copier le CSS ]                        ||
|  +------------------------------------------+|
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Aucune selection | Message "Selectionnez un element pour inspecter ses tokens" |
| Selection multiple | Inspecte le premier element, message "X elements selectionnes, affichage du premier" |
| Element sans fills/strokes (ex: Group) | Affiche uniquement les proprietes applicables |
| Texte avec mixed styles | Affiche "Mixed" avec detail segment par segment |
| Token DB non chargee | Tentative de chargement depuis `shared/tokens.ts`, fallback message d'erreur |
| Valeur "AUTO" pour lineHeight | Affiche "Auto (non tokenise)" |
| Gradient fill | Compare chaque stop de couleur individuellement |
| Variable Figma deja liee | Affiche le nom de la variable + le token DS correspondant |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| Frequence d'utilisation par session | > 5 inspections par session |
| Copies CSS effectuees | > 20 par semaine par designer |
| Reduction du temps de specification token | -60% |
| Satisfaction developpeurs sur la clarte du handoff | > 4/5 |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P1 - Feature V3 |
| **Complexite** | Moyenne (3-4 jours de dev) |
| **Dependances** | `shared/tokens.ts` (existant, a enrichir) |
| **Risque principal** | Completude de la base de tokens, performance du matching en temps reel |

---

## Feature 8 : Cover Updater

### Probleme

Le composant Cover (Thumbnail) du fichier Figma doit refleter l'etat actuel du projet : date de derniere mise a jour, statut (In Progress, Design Done, Archived), nom du designer. Actuellement, le designer doit naviguer manuellement vers la page Cover, trouver les champs a modifier dans le composant, et les editer un par un. C'est fastidieux et souvent oublie, resultant en des covers obsoletes.

### Solution

Un panneau dans le plugin Marcel permettant de mettre a jour les informations du Cover depuis n'importe quelle page, en un clic. Le plugin detecte automatiquement le composant Cover sur la page dediee et expose ses champs editables.

### Modele de donnees

```typescript
type CoverStatus = "In Progress" | "Design Done" | "Review" | "Delivered" | "Archived";

interface CoverUpdateData {
  projectName?: string;
  designerName?: string;
  status?: CoverStatus;
  lastUpdated?: string;        // Date ISO, auto-remplie
  team?: string;
  description?: string;
  version?: string;
}

interface CoverInfo {
  found: boolean;
  nodeId?: string;
  currentData: CoverUpdateData;
  componentName?: string;
  pageId?: string;
}
```

### User Flow

```
1. Designer ouvre le plugin Marcel depuis n'importe quelle page
2. Selectionne l'onglet "Cover"
3. Le plugin detecte automatiquement le composant Cover sur la page "Cover"
4. Affichage des champs editables pre-remplis avec les valeurs actuelles :
   a. Nom du projet (synchro possible avec le nom du fichier Figma)
   b. Designer (pre-rempli avec figma.currentUser.name si disponible)
   c. Statut (dropdown)
   d. Date (auto-remplie avec la date du jour)
   e. Equipe
   f. Description
5. Le designer modifie les champs souhaites
6. Clique sur "Mettre a jour le Cover"
7. Le plugin navigue vers la page Cover, met a jour le composant, et revient
8. Confirmation visuelle
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.root.children` | Trouver la page "Cover" |
| `page.findOne()` | Trouver le composant Cover |
| `node.type === "INSTANCE"` | Verifier que c'est une instance |
| `(node as InstanceNode).componentProperties` | Lire les proprietes du composant |
| `(node as InstanceNode).setProperties()` | Mettre a jour les proprietes |
| `figma.root.name` | Lire le nom du fichier Figma |
| `figma.currentUser` | Obtenir le nom du designer courant |
| `figma.currentPage` | Sauvegarder la page courante |
| `figma.currentPage = coverPage` | Naviguer vers le Cover |
| `figma.setFileThumbnailNodeAsync()` | Mettre a jour le thumbnail |

#### Detection du composant Cover

```typescript
async function findCoverComponent(): Promise<CoverInfo> {
  const coverPage = figma.root.children.find(p => p.name === "Cover");
  if (!coverPage) return { found: false, currentData: {} };

  // Cherche une instance de grande taille (>= 1200px wide) sur la page Cover
  const coverInstance = coverPage.findOne(node =>
    node.type === "INSTANCE"
    && node.width >= 1200
    && node.height >= 800
  ) as InstanceNode | null;

  if (!coverInstance) return { found: false, currentData: {} };

  // Lit les proprietes texte du composant
  const textNodes = coverInstance.findAll(n => n.type === "TEXT") as TextNode[];
  // Mapping par nom de layer vers valeur...

  return {
    found: true,
    nodeId: coverInstance.id,
    currentData: extractCoverData(textNodes),
    componentName: coverInstance.mainComponent?.name,
    pageId: coverPage.id,
  };
}
```

### UI Mockup

```
+----------------------------------------------+
|  Marcel                           [Cover]     |
+----------------------------------------------+
|                                               |
|  Cover Updater                                |
|                                               |
|  +------------------------------------------+|
|  |  Cover detecte : "Thumbnail/Default"      ||
|  |  Page: Cover                              ||
|  +------------------------------------------+|
|                                               |
|  Nom du projet:                               |
|  [ Onboarding Redesign V2_____________ ]      |
|  [ ] Synchroniser avec le nom du fichier      |
|                                               |
|  Designer:                                    |
|  [ Marie Dupont________________________ ]     |
|                                               |
|  Equipe:                                      |
|  [ Product Squad Alpha_________________ ]     |
|                                               |
|  Statut:                                      |
|  [ In Progress  v ]                           |
|    ( ) In Progress                            |
|    ( ) Design Done                            |
|    ( ) Review                                 |
|    ( ) Delivered                              |
|    ( ) Archived                               |
|                                               |
|  Date de mise a jour:                         |
|  [ 2026-02-24 ] (auto)                        |
|                                               |
|  Description (optionnel):                     |
|  [ Refonte du parcours d'inscription___ ]     |
|  [ avec nouveau flow social login______ ]     |
|                                               |
|  [ Mettre a jour le Cover ]                   |
|                                               |
|  [ Voir le Cover ]  (navigue vers la page)    |
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Page Cover absente | Message "Page Cover introuvable. Utilisez le Starter Kit pour la creer." avec bouton |
| Composant Cover non detecte | Message "Aucun composant Cover detecte. Inserez le Thumbnail DS sur la page Cover." |
| Composant Cover non-editable (locked) | Message d'erreur + suggestion de deverrouiller |
| Propriete non trouvee dans le composant | Champ desactive avec message "Propriete non supportee par ce composant" |
| `figma.currentUser` non disponible | Champ Designer vide, saisie manuelle |
| Nom de fichier tres long | Troncature a 50 caracteres avec "..." |
| Mise a jour pendant un mode presentation | Differe la mise a jour, notifie l'utilisateur |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| % de covers a jour (date < 7 jours) | > 80% |
| Temps de mise a jour du cover | < 10 secondes (vs ~45s manuellement) |
| Utilisation par session | > 30% des sessions plugin |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P2 - Feature V3 (quick win) |
| **Complexite** | Faible (1-2 jours de dev) |
| **Dependances** | Composant Cover DS, `shared/figma-helpers.ts` |
| **Risque principal** | Variabilite de la structure du composant Cover selon les versions |

---

## Feature 9 : Changelog Generator

### Probleme

Quand un designer livre une nouvelle iteration, les developpeurs et PMs n'ont pas de visibilite claire sur ce qui a change depuis la derniere livraison. Le designer doit rediger manuellement un changelog, souvent incomplet ou oublie. Les differences entre les pages "Archives" et "Delivery" ne sont pas documentees.

### Solution

Un generateur de changelog qui scanne les pages "Archives" et "Delivery", detecte les ecrans nouveaux, modifies ou archives, et genere un resume structure au format Markdown ou JSON. Le changelog peut etre copie dans le presse-papier, exporte, ou insere dans le fichier.

### Algorithme de detection des differences

```typescript
interface ChangelogEntry {
  type: "added" | "modified" | "archived" | "removed";
  screenName: string;
  pageName: string;
  nodeId: string;
  details?: string;             // Description du changement
  previousVersion?: string;     // Lien vers la version archivee
}

interface Changelog {
  generatedAt: string;
  fileId: string;
  fileName: string;
  version?: string;
  entries: ChangelogEntry[];
  summary: {
    added: number;
    modified: number;
    archived: number;
    removed: number;
  };
}

// Strategie de detection :
// 1. Lister les top-level frames de "Delivery" = ecrans actuels
// 2. Lister les top-level frames de "Archives" = ecrans archives
// 3. Comparer les noms :
//    - Present dans Delivery mais pas dans Archives = "added"
//    - Present dans les deux = "modified" (probablement itere)
//    - Present dans Archives mais pas dans Delivery = "archived"
// 4. Heuristique de matching par nom similaire (Levenshtein) pour detecter
//    les renommages : "Login v1" dans Archives + "Login" dans Delivery = "modified"

function generateChangelog(
  deliveryFrames: FrameNode[],
  archiveFrames: FrameNode[],
  options: ChangelogOptions
): Changelog;

interface ChangelogOptions {
  fuzzyMatchThreshold: number;   // 0-1, default 0.7
  includeSubframes: boolean;     // Comparer aussi les sous-ecrans
  format: "markdown" | "json";
}
```

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Changelog"
3. Le plugin scanne les pages Delivery et Archives
4. Affichage des resultats :
   a. Resume : "3 nouveaux ecrans, 5 modifies, 2 archives"
   b. Liste detaillee par type de changement
5. Le designer peut :
   a. Editer les descriptions de chaque entree
   b. Ajouter des notes manuelles
   c. Exclure des entrees non pertinentes
6. Choix du format d'export : Markdown ou JSON
7. Actions :
   a. "Copier dans le presse-papier"
   b. "Inserer sur la page Overview" (ajoute une section texte)
   c. "Telecharger" (fichier .md ou .json)
8. Le changelog est horodate et peut etre regenere
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.root.children` | Trouver les pages Delivery et Archives |
| `page.children` | Lister les top-level frames |
| `node.name` | Comparer les noms d'ecrans |
| `node.id` | Identifier les ecrans |
| `figma.createText()` | Inserer le changelog sur la page Overview |
| `figma.loadFontAsync()` | Charger la police pour le texte insere |
| `figma.ui.postMessage()` | Envoyer le changelog a l'UI pour copie |

#### Format de sortie Markdown

```markdown
# Changelog — Onboarding Redesign
**Date** : 2026-02-24
**Designer** : Marie Dupont
**Version** : 2.1

## Nouveaux ecrans (3)
- **Social Login** — Nouveau parcours de connexion via Google/Apple
- **Email Verification** — Ecran de verification par code
- **Welcome Personalized** — Ecran d'accueil personnalise post-inscription

## Ecrans modifies (5)
- **Login** — Ajout du bouton Social Login, refonte du layout
- **Signup Step 1** — Nouveau champ "Nom d'usage"
- **Signup Step 2** — Simplification du formulaire (3 champs -> 2)
- **Dashboard Home** — Nouveau widget "Activite recente"
- **Profile** — Section "Preferences" ajoutee

## Ecrans archives (2)
- **Old Login** — Remplace par nouveau Login
- **Signup Legacy** — Remplace par nouveau flow en 2 etapes
```

#### Format de sortie JSON

```json
{
  "generatedAt": "2026-02-24T14:30:00Z",
  "fileId": "abc123",
  "fileName": "Onboarding Redesign",
  "version": "2.1",
  "summary": { "added": 3, "modified": 5, "archived": 2, "removed": 0 },
  "entries": [
    {
      "type": "added",
      "screenName": "Social Login",
      "pageName": "Delivery",
      "nodeId": "123:456",
      "details": "Nouveau parcours de connexion via Google/Apple"
    }
  ]
}
```

### UI Mockup

```
+----------------------------------------------+
|  Marcel                        [Changelog]    |
+----------------------------------------------+
|                                               |
|  Changelog Generator                          |
|                                               |
|  [ Generer le changelog ]                     |
|                                               |
|  Comparaison : Delivery vs Archives           |
|                                               |
|  +------------------------------------------+|
|  |  3 nouveaux | 5 modifies | 2 archives    ||
|  +------------------------------------------+|
|                                               |
|  --- Nouveaux ecrans (3) ------------------- |
|                                               |
|  + Social Login                               |
|    Description: [ Nouveau parcours_______ ]   |
|    [ Naviguer ]                               |
|                                               |
|  + Email Verification                         |
|    Description: [ Ecran de verification__ ]   |
|    [ Naviguer ]                               |
|                                               |
|  + Welcome Personalized                       |
|    Description: [ Accueil personnalise___ ]   |
|    [ Naviguer ]                               |
|                                               |
|  --- Ecrans modifies (5) ------------------- |
|                                               |
|  ~ Login                                      |
|    Description: [ Ajout Social Login_____ ]   |
|    [ Naviguer ] [ Voir l'archive ]            |
|                                               |
|  ...                                          |
|                                               |
|  --- Ecrans archives (2) ------------------- |
|                                               |
|  - Old Login                                  |
|  - Signup Legacy                              |
|                                               |
|  ------------------------------------------- |
|  Format: [Markdown v]  Version: [ 2.1___ ]   |
|                                               |
|  [ Copier ] [ Inserer sur Overview ] [ .md ]  |
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Page Delivery absente | Message "Page Delivery introuvable. Utilisez le Starter Kit." |
| Page Archives absente ou vide | Tous les ecrans Delivery sont marques "added" |
| Noms d'ecrans identiques entre Delivery et Archives | Marques "modified" avec note de matching |
| Ecran renomme (nom different) | Heuristique fuzzy matching, proposition a confirmer |
| Aucune difference trouvee | Message "Aucun changement detecte entre Delivery et Archives" |
| Fichier sans ecrans | Message "Aucun ecran detecte" |
| Insertion sur Overview echoue (page manquante) | Fallback : copie dans le presse-papier |
| Police pour le texte non disponible | Utilise la police systeme par defaut |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| % de livraisons accompagnees d'un changelog | > 70% |
| Temps de generation du changelog | < 30 secondes (vs ~10 minutes manuellement) |
| Satisfaction des PMs/devs sur la visibilite des changements | > 4/5 |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P2 - Feature V4 |
| **Complexite** | Moyenne (3-4 jours de dev) |
| **Dependances** | Structure de pages Starter Kit (Feature 1) |
| **Risque principal** | Qualite du matching entre ecrans (renommages, iterations) |

---

## Feature 10 : DS Component Finder

### Probleme

Les designers doivent naviguer dans le panneau Assets de Figma pour trouver des composants du Design System. Avec une librairie mature contenant des centaines de composants, la recherche native est limitee : pas de preview inline, pas de suggestions contextuelles, et l'insertion requiert plusieurs clics. Cela ralentit le workflow et pousse parfois les designers a recreer des elements existants.

### Solution

Un moteur de recherche integre au plugin Marcel qui permet de trouver, previsualiser et inserer des composants du Marcel DS directement depuis le plugin, avec des suggestions contextuelles basees sur le travail en cours.

### Modele de donnees

```typescript
interface DSComponent {
  key: string;                    // componentKey Figma
  name: string;                   // "UI/Button/Primary"
  description: string;            // Description du composant
  category: string;               // "UI", "Layout", "Navigation", etc.
  tags: string[];                 // ["button", "cta", "action"]
  variants: string[];             // ["Default", "Hover", "Disabled"]
  thumbnailUrl?: string;          // URL du preview (si disponible)
  lastUpdated: string;
  deprecated: boolean;
  replacedBy?: string;            // Si deprecated, le remplacant
}

interface ComponentSearchResult {
  components: DSComponent[];
  totalResults: number;
  query: string;
  suggestions?: string[];         // Suggestions de recherche
}

interface ContextualSuggestion {
  component: DSComponent;
  reason: string;                 // "Vous travaillez sur un formulaire, essayez Input/Default"
  confidence: "high" | "medium" | "low";
}
```

### Index de recherche

```typescript
// L'index est construit au premier lancement et cache dans clientStorage
interface ComponentIndex {
  components: DSComponent[];
  lastBuilt: string;
  libraryName: string;
  libraryVersion: string;
  searchIndex: Map<string, string[]>;  // mot-cle -> [componentKeys]
}

// Construction de l'index
async function buildComponentIndex(): Promise<ComponentIndex> {
  // 1. figma.teamLibrary.getAvailableLibraryComponentsAsync() -- si API disponible
  // 2. Fallback : scan des composants importes dans le fichier
  // 3. Index full-text sur name + description + tags
}

// Recherche
function searchComponents(query: string, index: ComponentIndex): DSComponent[] {
  // 1. Tokenize la query
  // 2. Cherche dans name, description, tags
  // 3. Score de pertinence (exact match > prefix > fuzzy)
  // 4. Trie par score decroissant
}
```

### Suggestions contextuelles

```typescript
// Basees sur le contenu actuel de la page ou de la selection
function getContextualSuggestions(
  currentPage: PageNode,
  selection: readonly SceneNode[],
  index: ComponentIndex
): ContextualSuggestion[] {
  const suggestions: ContextualSuggestion[] = [];

  // Heuristique 1 : Composants deja utilises sur la page -> suggerer les composants associes
  // Ex: Si Button est utilise, suggerer Input, Form, Label
  const usedComponents = findUsedComponents(currentPage);
  const relatedComponents = getRelatedComponents(usedComponents, index);

  // Heuristique 2 : Type de la selection -> suggerer des composants adaptes
  // Ex: Selection d'un Rectangle -> suggerer Card, Banner, Divider
  if (selection.length > 0) {
    const selectionSuggestions = suggestForSelection(selection[0], index);
    suggestions.push(...selectionSuggestions);
  }

  // Heuristique 3 : Nom de la page -> contexte metier
  // Ex: Page "Login" -> suggerer Input, Button, Social Login, etc.
  const pageSuggestions = suggestForPageName(currentPage.name, index);
  suggestions.push(...pageSuggestions);

  return suggestions;
}
```

### User Flow

```
1. Designer ouvre le plugin Marcel
2. Selectionne l'onglet "Components"
3. Affichage initial :
   a. Barre de recherche
   b. Suggestions contextuelles (basees sur la page/selection en cours)
   c. Composants recemment utilises
4. Le designer tape une recherche (ex: "button")
5. Resultats affiches avec :
   a. Nom du composant
   b. Preview miniature
   c. Description courte
   d. Variants disponibles
6. Le designer clique sur un composant :
   a. Preview plus grande
   b. Liste des variants
   c. Bouton "Inserer sur le canvas"
7. Le composant est insere a la position du viewport ou pres de la selection
8. Si le composant est deprecated : avertissement avec lien vers le remplacant
```

### Specifications techniques

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.importComponentByKeyAsync(key)` | Importer un composant depuis la librairie |
| `component.createInstance()` | Creer une instance du composant |
| `figma.viewport.center` | Position d'insertion |
| `figma.viewport.zoom` | Ajuster le zoom |
| `figma.currentPage.appendChild(instance)` | Placer l'instance sur la page |
| `instance.x`, `instance.y` | Positionner l'instance |
| `figma.currentPage.selection = [instance]` | Selectionner l'instance inseree |
| `figma.clientStorage.setAsync()` | Cache de l'index et historique |
| `figma.clientStorage.getAsync()` | Recuperer le cache |
| `figma.currentPage.findAllWithCriteria({ types: ["INSTANCE"] })` | Composants utilises |

### UI Mockup

```
+----------------------------------------------+
|  Marcel                      [Components]     |
+----------------------------------------------+
|                                               |
|  DS Component Finder                          |
|                                               |
|  [ Rechercher un composant...________ ] [Q]   |
|                                               |
|  --- Suggestions pour cette page ----------- |
|                                               |
|  Vous travaillez sur "Login" :                |
|                                               |
|  +--------+  +--------+  +--------+          |
|  | [prev] |  | [prev] |  | [prev] |          |
|  | Input  |  | Button |  | Social |          |
|  | Default|  | Primary|  | Login  |          |
|  |[Inserer]| |[Inserer]| |[Inserer]|         |
|  +--------+  +--------+  +--------+          |
|                                               |
|  --- Recemment utilises -------------------- |
|                                               |
|  UI/Icon/Arrow       il y a 5 min            |
|  UI/Avatar/Default   il y a 12 min           |
|  UI/Card/Default     il y a 30 min           |
|                                               |
|  --- Resultats pour "button" (8) ----------- |
|                                               |
|  +------------------------------------------+|
|  | [preview]  UI/Button/Primary              ||
|  |            Bouton d'action principal       ||
|  |            Variants: Default, Hover,       ||
|  |            Disabled, Loading               ||
|  |            [ Inserer ] [ Details ]         ||
|  +------------------------------------------+|
|  +------------------------------------------+|
|  | [preview]  UI/Button/Secondary            ||
|  |            Bouton d'action secondaire      ||
|  |            Variants: Default, Hover...     ||
|  |            [ Inserer ] [ Details ]         ||
|  +------------------------------------------+|
|  +------------------------------------------+|
|  | [!!]       UI/Button/Tertiary             ||
|  |            DEPRECATED -> UI/Button/Ghost   ||
|  |            [ Voir le remplacant ]          ||
|  +------------------------------------------+|
|                                               |
+----------------------------------------------+
```

### Cas limites / Gestion d'erreurs

| Cas | Comportement |
|-----|-------------|
| Librairie Marcel DS non activee | Message "Activez la librairie Marcel DS" avec instructions |
| Index non construit (premier lancement) | Spinner "Construction de l'index..." (~5-10s) |
| Composant introuvable (supprime de la librairie) | Message d'erreur, retrait de l'index |
| Recherche sans resultats | Suggestions alternatives + "Aucun resultat pour [query]" |
| Insertion sur une page verrouillee | Message d'erreur clair |
| Composant avec des dependances manquantes | Alerte + insertion quand meme (Figma gere les missing) |
| Cache obsolete | Reconstruction automatique si > 7 jours |
| Pas de connexion internet (pour les thumbnails) | Affichage du nom sans preview |

### Metriques de succes

| Metrique | Objectif |
|----------|----------|
| Nombre d'insertions via le plugin vs panneau Assets natif | > 30% via plugin |
| Temps moyen de recherche + insertion | < 5 secondes |
| Utilisation des suggestions contextuelles | > 20% des insertions |
| Reduction des composants locaux dupliquant le DS | -30% |

### Priorite et complexite

| | |
|---|---|
| **Priorite** | P2 - Feature V4 |
| **Complexite** | Moyenne-Elevee (4-5 jours de dev) |
| **Dependances** | Librairie Marcel DS publiee, `shared/storage.ts` |
| **Risque principal** | Limitations de l'API Figma pour lister les composants de librairie externe |

---

## Roadmap & Planning

### Vue d'ensemble

```
V1 (Livre)          V2 (Q1 2026)           V3 (Q2 2026)           V4 (Q3 2026)
==============      ==================     ==================     ==================
Starter Kit         Layer Naming Linter    Statut Manager         Changelog Generator
                    DS Health Check        Handoff Checklist      DS Component Finder
                    Library Coverage       Token Inspector
                                           Cover Updater
```

### Planning detaille

| Phase | Feature | Effort estime | Debut | Fin |
|-------|---------|---------------|-------|-----|
| **V2 - Sprint 1** | Modules partages (`shared/*`) | 3 jours | Mars 2026 W1 | Mars 2026 W1 |
| **V2 - Sprint 1** | Feature 2 : Layer Naming Linter | 4 jours | Mars 2026 W1 | Mars 2026 W2 |
| **V2 - Sprint 2** | Feature 3 : DS Health Check | 6 jours | Mars 2026 W2 | Mars 2026 W4 |
| **V2 - Sprint 3** | Feature 4 : Library Coverage | 5 jours | Avril 2026 W1 | Avril 2026 W2 |
| **V2 - Release** | Tests, polish, documentation | 3 jours | Avril 2026 W2 | Avril 2026 W3 |
| | | | | |
| **V3 - Sprint 1** | Feature 8 : Cover Updater (quick win) | 2 jours | Mai 2026 W1 | Mai 2026 W1 |
| **V3 - Sprint 1** | Feature 7 : Token Inspector | 4 jours | Mai 2026 W1 | Mai 2026 W2 |
| **V3 - Sprint 2** | Feature 5 : Statut Manager | 5 jours | Mai 2026 W2 | Mai 2026 W4 |
| **V3 - Sprint 3** | Feature 6 : Handoff Checklist | 4 jours | Juin 2026 W1 | Juin 2026 W2 |
| **V3 - Release** | Tests, polish, documentation | 3 jours | Juin 2026 W2 | Juin 2026 W3 |
| | | | | |
| **V4 - Sprint 1** | Feature 9 : Changelog Generator | 4 jours | Juillet 2026 W1 | Juillet 2026 W2 |
| **V4 - Sprint 2** | Feature 10 : DS Component Finder | 5 jours | Juillet 2026 W2 | Juillet 2026 W4 |
| **V4 - Release** | Tests, polish, documentation | 3 jours | Aout 2026 W1 | Aout 2026 W1 |

### Resume par version

| Version | Features | Effort total | Theme |
|---------|----------|-------------|-------|
| **V2** | Linter + Health Check + Coverage + shared modules | ~21 jours | **Qualite & Conformite** |
| **V3** | Statut Manager + Handoff + Token Inspector + Cover Updater | ~18 jours | **Workflow & Handoff** |
| **V4** | Changelog + Component Finder | ~12 jours | **Productivite** |

---

## Dependances entre features

```
Feature 1: Starter Kit (V1) ──────────────────────┐
  Fournit la structure de pages que toutes         |
  les autres features exploitent                   |
                                                   |
shared/node-traversal.ts ────────┐                 |
shared/scoring.ts ───────────┐   |                 |
shared/storage.ts ──────┐   |   |                 |
shared/violation-types.ts┐  |   |   |              |
                         |  |   |   |              |
Feature 2: Linter ◄──────┴──┴───┴───┘              |
  |                                                |
  |  (fournit les resultats de nommage)            |
  v                                                |
Feature 6: Handoff Checklist ◄─────────────────────┤
  ^           ^           ^                        |
  |           |           |                        |
Feature 3: Health Check    |                       |
  |  (fournit le score DS) |                       |
  |                        |                       |
  |    Feature 5: Statut Manager                   |
  |      (fournit les statuts des ecrans)          |
  |                                                |
Feature 4: Coverage                                |
  (independant mais enrichi par Health Check)       |
                                                   |
Feature 7: Token Inspector                         |
  (utilise shared/tokens.ts, independant)           |
                                                   |
Feature 8: Cover Updater ◄────────────────────────┘
  (depend de la page Cover du Starter Kit)

Feature 9: Changelog Generator
  (depend de la structure Delivery/Archives du Starter Kit)

Feature 10: Component Finder
  (independant, utilise shared/storage.ts pour le cache)
```

### Matrice de dependances

| Feature | Depend de | Bloque |
|---------|-----------|--------|
| F1 Starter Kit | - | F5, F6, F8, F9 (structure de pages) |
| F2 Linter | shared modules | F6 (resultats linting) |
| F3 Health Check | shared modules, tokens.ts | F6 (score DS) |
| F4 Coverage | shared modules | - |
| F5 Statut Manager | shared/storage, F1 | F6 (statuts ecrans) |
| F6 Handoff Checklist | **F2, F3, F5** | - |
| F7 Token Inspector | tokens.ts | - |
| F8 Cover Updater | F1 (page Cover) | - |
| F9 Changelog | F1 (pages Delivery/Archives) | - |
| F10 Component Finder | shared/storage | - |

---

## Navigation UI du plugin

### Architecture multi-onglets

Avec l'ajout de 9 features, l'UI du plugin evolue vers une navigation par onglets avec un menu lateral ou des tabs scrollables :

```
+----------------------------------------------+
|  Marcel                              v2.0     |
+------+---------------------------------------+
|      |                                       |
| [SK] |  Contenu de la feature active         |
| [LI] |                                       |
| [HC] |                                       |
| [CO] |                                       |
| [ST] |                                       |
| [HO] |                                       |
| [TI] |                                       |
| [CV] |                                       |
| [CL] |                                       |
| [CF] |                                       |
|      |                                       |
| [GE] |  GE = Gear / Settings                |
|      |                                       |
+------+---------------------------------------+

SK = Starter Kit       ST = Statut Manager
LI = Linter            HO = Handoff Checklist
HC = Health Check      TI = Token Inspector
CO = Coverage          CV = Cover Updater
                       CL = Changelog
                       CF = Component Finder
```

### Dimensionnement de la fenetre

| Contexte | Dimensions |
|----------|-----------|
| V1 (actuel) | 400 x 580 px |
| V2+ (navigation laterale) | 480 x 640 px |
| Token Inspector (mode compact) | 320 x 500 px |
| Mode panel (docked) | 100% hauteur x 360 px largeur |

---

## Prochaines etapes

1. **Valider le PRD V2** avec l'equipe Design Ops et les Tech Leads
2. **Prioriser** : confirmer l'ordre des features avec les stakeholders
3. **Developper les modules partages** (`node-traversal`, `scoring`, `storage`, `violation-types`)
4. **Prototype le Linter** (Feature 2) comme premiere feature V2
5. **Documenter les tokens DS** dans `shared/tokens.ts` pour alimenter Health Check et Token Inspector
6. **Obtenir les component keys** des composants Status et Annotation du DS
7. **Tester** chaque feature sur des fichiers Figma reels de l'equipe
8. **Mesurer** : mettre en place le tracking des metriques de succes
9. **Iterer** : recueillir le feedback de l'equipe apres chaque release

---

*Document genere le 2026-02-24 — Marcel Plugin V2+ PRD*
