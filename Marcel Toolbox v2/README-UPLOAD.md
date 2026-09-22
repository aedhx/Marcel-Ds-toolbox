# Marcel Toolbox v2 — Package de publication Figma

Build issu du commit `4c0ff5d` du 2026-09-15 (branche main).

## Contenu

| Fichier | Usage |
|---|---|
| `Marcel-Toolbox-v2.zip` | Le plugin : `manifest.json` + `dist/main.js` + `dist/ui.html`. Rien à builder. |
| `DESCRIPTION.md` | Texte à coller dans la fiche Community (nom, tagline, description, tags). |
| `assets/cover-1920x1080.jpg` | Image de couverture de la fiche (format Figma 1920×960 accepté en 16:9, recadrage possible). |
| `assets/icon-marcel.svg` | Logo, à exporter en PNG 128×128 pour l'icône du plugin. |

## Publier une mise à jour du plugin existant (id 1611477883396895317)

1. Dézipper l'archive.
2. Dans l'app Figma desktop : **Plugins → Development → Import plugin from manifest…** puis choisir `Marcel Toolbox/manifest.json`.
3. Tester le plugin depuis **Plugins → Development → Marcel Toolbox**.
4. **Plugins → Development → Manage plugins in development → Marcel Toolbox → Publish**.
5. Coller la description de `DESCRIPTION.md`, mettre à jour la cover si besoin, publier.

Prérequis : le compte Figma utilisé doit être **propriétaire ou éditeur** du plugin. Sinon Figma renvoie une erreur 403 à la publication. Le propriétaire ajoute un éditeur depuis la page Community du plugin, menu **Manage plugin → Editors**.

## Publier comme nouveau plugin (si les droits sur l'id existant sont perdus)

1. Ouvrir `Marcel Toolbox/manifest.json` et supprimer la ligne `"id": "1611477883396895317",`.
2. Reprendre les étapes ci-dessus. Figma attribue un nouvel id à la première publication.
3. Les utilisateurs devront réinstaller le plugin depuis la nouvelle fiche.

## Rappel

Le plugin ne fonctionne que dans l'écosystème Carrefour : il dépend des tokens, librairies et clés de composants internes du Marcel Design System.
