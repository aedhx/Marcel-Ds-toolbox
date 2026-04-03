# PRD — Marcel Plugin for Figma

## Vision

**Marcel** est un plugin Figma interne concu pour les Product Designers utilisant le Marcel Design System. Il centralise des fonctionnalites DesignOps pour standardiser les pratiques, accelerer le setup de fichiers et garantir la coherence a l'echelle de l'equipe.

---

## Feature 1 : Starter Kit (Ant-Template)

### Probleme

Chaque designer perd du temps a creer manuellement les pages, renommer, organiser son fichier Figma et placer la miniature (Thumbnail/Cover). Les conventions de nommage et la structure de fichier ne sont pas toujours respectees, ce qui nuit a la lisibilite et a la maintenabilite des fichiers.

### Solution

En un clic sur **"Ant-Template"**, le plugin genere automatiquement la structure de pages standardisee du Marcel Design System, incluant :
- Les pages avec les noms et emojis officiels
- La miniature (Thumbnail) issue du composant Design System sur la page Cover
- Un ordre et une hierarchie de pages prets a l'emploi

### Structure de pages cible

D'apres la convention Marcel, voici les pages generees (dans l'ordre) :

| # | Nom de la page | Description |
|---|---------------|-------------|
| 1 | `Cover` | Page contenant la miniature / thumbnail du projet (composant DS) |
| 2 | `Overview` | Vue d'ensemble du projet, contexte, objectifs |
| 3 | `Delivery` | Ecrans prets a livrer aux developpeurs (section indentee) |
| 4 | `UI & Prototype` | Maquettes et prototypes interactifs (section indentee) |
| 5 | `Local components` | Composants specifiques au fichier |
| 6 | `Specs` | Specifications techniques et details |
| 7 | `Archives` | Ecrans archives / anciennes versions |
| 8 | `Need help ? Comment organiser & documenter` | Page guide interne |

> **Note sur les separateurs** : Les separateurs visuels visibles dans Figma (traits horizontaux entre les groupes de pages) sont obtenus via des pages vides nommees avec un caractere special (ex: `───────────`). Trois separateurs sont necessaires :
> - Entre `Overview` et `Delivery`
> - Entre `UI & Prototype` et `Local components`
> - Entre `Specs` et `Archives`

### Thumbnail / Cover

- Sur la page **Cover**, le plugin insere une instance du composant **Thumbnail** issu de la librairie Marcel Design System
- Le composant est redimensionne a **1600x960 px** (taille standard Figma pour les thumbnails de fichier)
- Le designer peut ensuite personnaliser le contenu (nom du projet, equipe, statut, etc.)

### User Flow

```
1. Designer ouvre un fichier Figma (nouveau ou existant)
2. Lance le plugin Marcel
3. Clique sur "Ant-Template" (ou "Starter Kit")
4. Le plugin :
   a. Supprime la page par defaut "Page 1" (si elle existe et est vide)
   b. Cree les 8 pages + 3 separateurs dans l'ordre
   c. Insere le composant Thumbnail sur la page Cover
   d. Definit la page Cover comme thumbnail du fichier (si API disponible)
   e. Navigue vers la page Cover
5. Designer personalise le Thumbnail et commence a travailler
```

### Specifications techniques

#### Stack technique

| Element | Choix |
|---------|-------|
| Runtime | Figma Plugin API (sandbox) |
| UI | HTML/CSS/JS dans un `<iframe>` |
| Bundler | esbuild (rapide, leger) |
| Langage | TypeScript |
| Structure | Monorepo-ready (pour futures features) |

#### Architecture du plugin

```
Marcel/
  manifest.json          # Declaration du plugin Figma
  package.json
  tsconfig.json
  esbuild.config.mjs
  src/
    main.ts              # Code principal (sandbox Figma)
    ui.html              # Interface utilisateur du plugin
    ui.ts                # Logique UI
    features/
      starter-kit/
        starter-kit.ts   # Logique de creation des pages
        config.ts        # Configuration des pages (noms, ordre, emojis)
        thumbnail.ts     # Insertion du composant Thumbnail
    shared/
      constants.ts       # Constantes partagees
      figma-helpers.ts   # Utilitaires Figma API
  assets/
    icon.png             # Icone du plugin (128x128)
```

#### API Figma utilisees

| API | Usage |
|-----|-------|
| `figma.createPage()` | Creer les pages |
| `page.name = "..."` | Nommer les pages |
| `figma.root.insertChild(index, page)` | Ordonner les pages |
| `figma.root.children` | Lister les pages existantes |
| `page.remove()` | Supprimer "Page 1" vide |
| `figma.importComponentByKeyAsync(key)` | Importer le composant Thumbnail depuis la librairie |
| `component.createInstance()` | Creer une instance du Thumbnail |
| `figma.currentPage = page` | Naviguer vers la page Cover |
| `figma.setFileThumbnailNodeAsync(node)` | Definir le thumbnail du fichier |

#### Configuration des pages (extensible)

```typescript
interface PageConfig {
  name: string;
  isSeparator?: boolean;
  thumbnail?: {
    componentKey: string;   // Cle du composant DS
    width: number;          // 1600
    height: number;         // 960
  };
}

const STARTER_KIT_PAGES: PageConfig[] = [
  { name: "Cover", thumbnail: { componentKey: "TBD", width: 1600, height: 960 } },
  { name: "Overview" },
  { name: "───────────", isSeparator: true },
  { name: "Delivery" },
  { name: "UI & Prototype" },
  { name: "───────────", isSeparator: true },
  { name: "Local components" },
  { name: "Specs" },
  { name: "───────────", isSeparator: true },
  { name: "Archives" },
  { name: "Need help ? Comment organiser & documenter" },
];
```

### UI du plugin

L'interface est minimaliste pour cette V1 :

```
+--------------------------------------+
|  Marcel                         v1.0 |
+--------------------------------------+
|                                      |
|  [icon] Starter Kit                  |
|                                      |
|  Genere la structure de pages        |
|  standardisee du Marcel DS.          |
|                                      |
|  [ Creer le template ]               |
|                                      |
|  ----------------------------------- |
|                                      |
|  [icon] Plus de features a venir...  |
|                                      |
+--------------------------------------+
```

- Un bouton principal "Creer le template"
- Feedback visuel (spinner + message de succes/erreur)
- Placeholder pour les futures fonctionnalites

### Gestion des cas limites

| Cas | Comportement |
|-----|-------------|
| Fichier avec des pages existantes | Avertissement : "Ce fichier contient deja X pages. Voulez-vous ajouter le template ?" |
| Page "Page 1" vide par defaut | Suppression automatique silencieuse |
| Composant Thumbnail introuvable | Creation d'un placeholder rectangle avec texte "Thumbnail — Activez la librairie Marcel DS" |
| Pas de permission d'edition | Message d'erreur clair |
| Execution sur un fichier FigJam | Message "Ce plugin fonctionne uniquement sur les fichiers Figma Design" |

### Metriques de succes

- **Adoption** : % de nouveaux fichiers utilisant le Starter Kit
- **Temps gagne** : Temps de setup avant/apres (objectif : < 5 secondes vs ~3-5 minutes manuellement)
- **Conformite** : % de fichiers respectant la structure standard

---

## Roadmap plugin Marcel (hors scope V1, pour contexte)

| Feature | Description | Priorite |
|---------|-------------|----------|
| **Starter Kit** | Generation de la structure de pages | **V1 - MVP** |
| Lint de nommage | Verification des conventions de nommage des layers | V2 |
| Export specs | Generation automatique de specs pour les devs | V2 |
| Sync tokens | Synchronisation des design tokens | V3 |
| Health check | Audit de qualite du fichier Figma | V3 |
| Handoff helper | Assistant de passage design > dev | V4 |

---

## Prochaines etapes

1. **Valider le PRD** avec l'equipe Design Ops
2. **Obtenir la component key** du Thumbnail dans la librairie Marcel DS
3. **Developper le MVP** (Starter Kit)
4. **Tester** sur un fichier Figma reel
5. **Publier** en interne (organisation Figma)
