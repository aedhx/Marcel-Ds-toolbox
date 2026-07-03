# Pondération du Quality Check — comment se calcule le score

> **À lire avant l'atelier de calibration.** Ce document explique le modèle de
> scoring par pénalités du Quality Check de Marcel Toolbox V2 : comment un score
> 0–100 est produit, quels leviers existent, et où les régler.
>
> **Source de vérité unique :** [`Marcel/src/shared/scoring-config.ts`](../Marcel/src/shared/scoring-config.ts).
> Tous les chiffres cités ici y sont des constantes nommées, marquées `[À CALER]`,
> à figer lors de l'atelier de pondération équipe. Les valeurs montrées reflètent
> l'état du fichier à la date de rédaction (**2026-07-03**) et peuvent changer :
> en cas de doute, le fichier source fait foi, pas ce document.

---

## 1. Principe général — `score = 100 − Σ pénalités plafonnées`

Le score de conformité DS part de **100** et **retranche des pénalités** :

```
score = 100 − Σ (pénalités de catégorie, chacune plafonnée à son budget)
```

Cette formule est implémentée par `calculatePenaltyScore` dans
[`Marcel/src/shared/scoring.ts`](../Marcel/src/shared/scoring.ts). Elle **remplace**
l'ancien modèle « % de nœuds propres » (spec §1), qui divisait le nombre de fautes
par le volume de nœuds. Ce vieux modèle diluait les fautes graves : une seule faute
grave au milieu de 500 nœuds propres donnait ~99,6/100 — presque invisible.

**Intuition à retenir :** *une faute grave mord, quel que soit le volume de la page.*
Avec le modèle par pénalités, 1 faute grave de couleur parmi 500 nœuds propres coûte
−10 → score 90, et non 99,6. Le volume ne dilue plus la gravité.

Le score global final compose ensuite trois briques (spec §1.6), toutes plancher 0 :

```
global = score conformité DS − gate accessibilité − checklist HS (livraison)
```

- le **score conformité DS** (§1 à §4 ci-dessous) reste pur et inchangé par les gates ;
- la **gate a11y** (§5) et la **checklist HS** (§6) ne touchent que le score *global*.

---

## 2. Budgets par catégorie (le plafonnement)

Le Quality Check répartit les fautes dans **5 catégories de pénalité**
(constante `PENALTY_CATEGORIES`). Chaque catégorie a un **budget** = pénalité
maximale qu'elle peut coûter (`CATEGORY_BUDGETS`) :

| Catégorie      | Budget (pénalité max) |
| -------------- | --------------------- |
| `colors`       | 30                    |
| `typography`   | 30                    |
| `spacing`      | 15                    |
| `components`   | 15                    |
| `naming`       | 10                    |
| **Total**      | **100**               |

Points clés :

- **La somme des budgets fait exactement 100.** C'est volontaire : le budget d'une
  catégorie est son poids relatif dans le score (spec §1.2 — « le budget EST le poids »).
- **Le budget est un plafond.** Une catégorie ne peut jamais coûter plus que son
  budget, même avec des centaines de fautes. Donc le **plancher de score est 0
  automatiquement**, sans clamp artificiel.
- **`coverage` est EXCLU du scoring.** La couverture composant complète est hors
  périmètre : dans `CATEGORY_OF_RULE`, la catégorie `coverage` est mappée à `null`,
  donc ses violations sont listées dans l'UI mais **ne pénalisent jamais** le score
  (spec §1.11). Les violations `coverage` chevauchent la liste sans compter.

---

## 3. Sévérités — grave / moyen / cosmétique

Chaque faute a une **sévérité** parmi trois (type `PenaltySeverity`), et chaque
sévérité brûle une **fraction** du budget de sa catégorie (`SEVERITY_FRACTIONS`) :

| Sévérité      | Fraction du budget |
| ------------- | ------------------ |
| `grave`       | 1/3                |
| `moyen`       | 1/6                |
| `cosmetique`  | 1/30               |

La pénalité n'est **jamais tapée à la main**. Elle est toujours calculée par le seul
helper `penaltyFor(category, severity) = budget × fraction`. Exemple canonique :
**1 faute grave en `colors` = 30 × 1/3 = 10 points.**

Table complète des pénalités par faute unitaire (budget × fraction) :

| Catégorie      | Budget | grave (×1/3) | moyen (×1/6) | cosmétique (×1/30) |
| -------------- | ------ | ------------ | ------------ | ------------------ |
| `colors`       | 30     | 10           | 5            | 1                  |
| `typography`   | 30     | 10           | 5            | 1                  |
| `spacing`      | 15     | 5            | 2,5          | 0,5                |
| `components`   | 15     | 5            | 2,5          | 0,5                |
| `naming`       | 10     | ≈ 3,33       | ≈ 1,67       | ≈ 0,33             |

Le réglage réel de l'atelier, c'est surtout le dénominateur de `grave` : à 1/3, il
faut **3 fautes graves** pour plafonner une catégorie ; passer à 1/4 ou 1/5 exigerait
4–5 fautes. `moyen` vaut la moitié de `grave`, `cosmetique` reste marginal (1/30).

### Mapping règle → sévérité (`RULE_SEVERITY_MAP`)

Chaque règle que la passe unifiée peut émettre est taguée. Exemples représentatifs :

| Catégorie      | Règle (exemples)                                        | Sévérité      |
| -------------- | ------------------------------------------------------- | ------------- |
| Couleurs       | `off-token-fill`, `off-token-stroke`                    | grave         |
| Typographie    | `missing-text-style`, `mixed-text-styles`               | grave         |
| Typographie    | `off-ds-font`, `mixed-fonts`                            | moyen         |
| Espacement     | `off-token-spacing`, `missing-spacing-var`              | moyen         |
| Composants     | `detached-instance`, `custom-component`, `broken-component`, `deprecated-ds-component`, `excessive-overrides` | moyen |
| Dette legacy   | `dead-style`, `dead-variable`, `foreign-style`, `foreign-variable` | cosmétique |
| Nommage        | `vague-names`, `component-naming`, `long-names`, `special-chars`, `numbered-suffix`, `text-mismatch` | cosmétique |

**Garde-fou important :** toute règle **non mappée** retombe sur `cosmetique` par
défaut (dans `calculatePenaltyScore`). Ainsi, une nouvelle règle ajoutée plus tard ne
peut **jamais faire chuter un score en silence** avant qu'on lui ait attribué sa
sévérité.

---

## 4. Dette legacy comptée à part

Une valeur liée à une **ancienne librairie DS gelée** est une *dette legacy*, pas une
faute de conformité active. La détection réutilise le moteur `dead-styles` (bindings de
librairie foreign) via l'adaptateur `dead-styles-adapter.ts`, sans nouvelle traversée.

Les règles `dead-style`, `dead-variable`, `foreign-style`, `foreign-variable` sont :

- classées **`cosmetique`** (poids le plus faible) dans `RULE_SEVERITY_MAP` ;
- repliées dans la catégorie **`components`** (dans `CATEGORY_OF_RULE`, la catégorie
  de violation `dead-styles` mappe vers le bucket `components`).

Conséquence (spec §1.5 / §1.9 / §1.11) : l'hygiène de fichier legacy **pèse peu** et ne
fait pas s'effondrer le score. À l'inverse, une valeur liée à **rien** (couleur codée
en dur) n'est pas un item foreign : elle reste une faute `off-token-fill` /
`off-token-stroke` **grave** dans `colors` — une vraie faute custom, non diluée.

Le moteur dérive aussi un `legacyDebtPercent` (part des nœuds portant ≥ 1 binding
foreign) : c'est une **vue informative** à côté du score, pas une pénalité.

---

## 5. Gate accessibilité (lot 1)

Le Quality Check vérifie la présence d'une **frame accessibilité** dans le fichier,
détectée **par son nom** (le nom standard généré par le starter kit) :

- `A11Y_FRAME_NAME` = `"♿ Accessibilité"` — nom recherché (insensible à la casse).
- `A11Y_ABSENT_PENALTY` = **30** — pénalité fixe **absolue**.

Comportement (spec §1.8) :

- **Frame présente** → aucune pénalité, `global = score conformité DS`.
- **Frame absente** → `global = score DS − 30` (plancher 0), **+ lancement forcé** du
  plugin accessibilité pour que le designer traite le sujet.

La pénalité est retranchée du score **global**, pas du score de conformité DS pur
(qui reste séparé, spec §1.6). En lot 1, la détection se fait par nom ; le lot 2
remplacera cela par une vraie lecture de complétude a11y.

---

## 6. Profils projet & seuils de livraison

Le seuil de livraison du moment « Je livre » dépend d'un **profil projet**, choisi dans
une **liste fermée** maintenue par Design Ops (`PROJECT_PROFILES`) :

| id          | Libellé                   | Seuil de livraison |
| ----------- | ------------------------- | ------------------ |
| `app-ds`    | App DS pure               | 95                 |
| `ecommerce` | E-commerce                | 85                 |
| `legacy`    | Produit legacy magasin    | 75                 |

Profil par défaut (`DEFAULT_PROFILE_ID`) : **`ecommerce`** (seuil 85) quand aucun n'est
choisi sur la Cover.

Le seuil est la **barre de livraison** : le profil est écrit sur la Cover et porté dans
le tampon d'export — **pas d'abaissement silencieux** de la barre (spec §1.7).

### Checklist HS (hygiène de livraison)

En plus du score DS, une **checklist de livraison** (`HS_ITEMS`, spec §4) évalue
l'hygiène du fichier livrable. Deux natures d'items :

| Item                       | Pénalité | Nature                          |
| -------------------------- | -------- | ------------------------------- |
| `cover-up-to-date`         | 0        | **Hard gate** — bloque la livraison |
| `archives-page`            | 1        | pénalité douce                  |
| `obsolete-mockups-filed`   | 1        | pénalité douce                  |
| `file-named`               | 1        | pénalité douce                  |
| `specs-page`               | 1        | pénalité douce                  |

- **« Cover à jour »** est le **hard gate** (`hardGate: true`, pénalité **0**) : il ne
  grignote pas le score, il **bloque la livraison** au moment « Je livre ».
- Les autres items appliquent de **petites pénalités** au score global, plafonnées par
  `HS_MAX_PENALTY` = **5**.

Le total de la checklist HS se retranche du score **global** uniquement ; le score de
conformité DS pur n'est pas touché (spec §1.6 : DS ⊕ a11y ⊕ HS).

---

## 7. Exemples chiffrés (bout-en-bout)

Tous les nombres ci-dessous sont dérivés via `penaltyFor(catégorie, sévérité)` =
budget × fraction, puis plafonnés par catégorie.

**Exemple A — 1 grave color + 2 moyens spacing**

```
1 grave  colors  = 30 × 1/3 = 10
2 moyens spacing = 2 × (15 × 1/6) = 2 × 2,5 = 5
score DS = 100 − 10 − 5 = 85
```

**Exemple B — plafonnement d'une catégorie**

```
5 graves colors  = 5 × 10 = 50 en brut
… plafonné au budget colors = 30
score DS = 100 − 30 = 70   (les 2 fautes au-delà de la 3ᵉ ne coûtent plus rien)
```

**Exemple C — la dette legacy pèse peu**

```
10 foreign-variable (cosmétique, bucket components) = 10 × (15 × 1/30) = 10 × 0,5 = 5
… plafonné au budget components = 15  →  pénalité 5
score DS = 100 − 5 = 95
```

**Exemple D — composition du score global (gate a11y absente)**

```
score DS conformité = 85   (ex. A)
frame a11y absente  → − A11Y_ABSENT_PENALTY (30)
checklist HS        → − 0   (tout OK)
global = max(0, 85 − 30 − 0) = 55
```

Rappel des bandes de label (`formatScoreLabel`) : ≥ 90 Excellent, 75–89 Bon,
50–74 À améliorer, < 50 Critique.

---

## 8. Encadré « Chiffres à calibrer » [À CALER]

> **Tous les nombres de ce document sont des constantes calibrables**, centralisées
> dans un **seul** fichier : [`Marcel/src/shared/scoring-config.ts`](../Marcel/src/shared/scoring-config.ts).
>
> Ils sont marqués `[À CALER — atelier pondération équipe]` (ou
> `[PROPOSITION à valider]` pour les propositions issues du spec) et seront **figés
> lors de l'atelier de pondération équipe**. Concrètement, sont à caler :
>
> - les **budgets** `CATEGORY_BUDGETS` (colors/typography/spacing/components/naming) ;
> - les **fractions de sévérité** `SEVERITY_FRACTIONS` (surtout le `grave` = 1/3) ;
> - le **mapping règle → sévérité** `RULE_SEVERITY_MAP` ;
> - la **pénalité a11y** `A11Y_ABSENT_PENALTY` et le nom `A11Y_FRAME_NAME` ;
> - les **profils & seuils** `PROJECT_PROFILES` + `DEFAULT_PROFILE_ID` ;
> - la **checklist HS** `HS_ITEMS` + le plafond `HS_MAX_PENALTY`.
>
> Pour changer une pondération, on **ne modifie que ce fichier** — aucune valeur de
> pénalité n'est codée en dur ailleurs (elles passent toutes par `penaltyFor`).
> Ce document reflète l'état du fichier au **2026-07-03** ; si le fichier change,
> **c'est le fichier qui fait foi.**
