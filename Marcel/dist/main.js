"use strict";
(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __objRest = (source, exclude) => {
    var target = {};
    for (var prop in source)
      if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
        target[prop] = source[prop];
    if (source != null && __getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(source)) {
        if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
          target[prop] = source[prop];
      }
    return target;
  };

  // src/features/starter-kit/config.ts
  var DS_COMPONENT_KEYS = {
    // PRD covers
    coverInProgress: "b1f6a334c74a368c1dd2a4a61218f481825bd01c",
    coverDesignDone: "7c4b2c88d940c666b5f3dab33274d14eb094eb8e",
    coverArchived: "358bf3bddaa613a7ad704ca678dc46ec71f41b83",
    coverSOT: "0b5cf827b2e2fa9316850602b62ab4bb94b041f4",
    coverPlayground: "bb61909327a966c75ebd08bfd2866a86235f294e",
    // DS Library covers
    dsLibraryCoverCORE: "a1886c1322db1dd40babde87f2124010aff0064b",
    dsLibraryCoverLocal: "68f095fe8b042bc707c5da6b72b15adcdaeded8e",
    dsLibraryCoverDomaine: "9dd5b92526644846f3b8e8da931c498aedd96427",
    dsLibraryCoverDocThumbnail: "81c7b57e6ec90033dcc9637490fc30deddbc24fc",
    dsFileCover: "4cac66d05e8b5865cc4be8516342b9909a916cbf",
    // DS Toolkit components
    dsComponentCard: "5a38e84834566983a322f84551c0952904e96b13",
    dsHeaderBlackL: "15504ed191c7ab035a2d8634d391fcce1c98acdc",
    dsSubtitle: "3153eb2c4b7864c78991b691e022a5953d0e8998",
    dsBody: "c758ac117e21bbf37c6cd0cbdad9de780dcffe84",
    dsComponentName: "bfcc2d75b453286ff091b55852bccc1776739e2e",
    dsComponentTitle: "336d4a9589ecc74ec54ed2ba298d510b6fec01d3",
    dsDeprecatedSign: "3c9f58f60d0f678e0e70fb42fcc97a520c2110fd",
    // Checklists
    checklistFigmaLibraries: "dfb1c8765f5ead8855827b51cab052d320c21193",
    // Delivery
    deliveryOverviewLight: "0b702161cfd7aabd474ab59c8beec9dc86f721cf",
    deliveryOverviewDark: "24b8476683f267af323096ec7f686f9ea810139d",
    deliveryHeaderWhiteL: "1386a107ea3f5111724a6564c132ee4701e517b4",
    deliveryHeaderBlackM: "f6bfb1a2bb55aa20cd1e458ce10b2a6fb6f8ebf5",
    deliveryProjectCard: "177560faa13ce1109ceca7ca579a5addda1bcf79",
    // Handoff toolkit components (keys from Figma REST API)
    handoffDevice: "06dea5d62ebf241040170244766d9742ead0cda9",
    // Device=Desktop
    handoffButtonLink: "6c6a18fad226a7e02c0b2ca98270125c10fe9a87",
    // Link to=Documentation
    handoffShortcut: "b461526bdae8d27dacec0e10009cbb419f895496",
    // Colour=Figma
    handoffFlow: "1db53db91bfded6ae5d57d83909818017ad03f5c",
    // Status=WIP, Size=S
    handoffQuote: "6093e1b7f37d464e8b63311fa7ce28797107bf66",
    // Colour=Grey
    handoffPostIt: "3a875d628b735f6fb510cf09af79984bb6e12e61",
    // Colour=Yellow
    handoffHighlight: "20f3fff5cd6da1ed3e32fea602b54f96dd6062d5",
    // Highlight=General, Point Left=On
    handoffScreen: "3edd6e6bb99890b2c7512554d8926ba456ca8b3f",
    // State=WIP, News=Off
    handoffThoughts: "4fc2f5c167815b20e94265aa8a38087047939711",
    // Type=General
    handoffCardLink: "acfc486f29426dbf1707dd6a34967ccf04f15c7d",
    // Type=Standard
    handoffCirclePin: "9736b61921f8ec7b7c28b860950bd64e591309d9",
    // Line=Right, Color=Error
    handoffSpecsCard: "2c9e9f457199344807520381687dc737c6c85b9d",
    // Specs CARD
    // Analytics tracking pixel (invisible component for library analytics)
    trackingPixel: "765eaa06057611c1a5e88eac045eff85159116b5"
  };
  var STARTER_KIT_PAGES = [
    { name: "Cover", type: "content", builder: "cover" },
    { name: "Overview", type: "content", builder: "overview" },
    { name: "----", type: "separator" },
    { name: "+ Commencer mon projet (\xE0 renommer)", type: "content", builder: "delivery" },
    { name: "----", type: "separator" },
    { name: "Local components", type: "content", builder: "local-components" },
    { name: "---", type: "separator" },
    { name: "\u{1F4E6}  Archives", type: "content", builder: "archives" },
    { name: "Need help ? Comment organiser & documenter", type: "content", builder: "help" }
  ];
  var DS_LIBRARY_PAGES = [
    { name: "\u{1F3C1}  Cover", type: "content", builder: "library-cover" },
    { name: "\u{1F4D6}  Read Me", type: "content", builder: "readme" },
    { name: "\u{1F469}\u200D\u{1F4BB} Contributors", type: "empty" },
    { name: "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014", type: "separator" },
    { name: "Components \u25BC", type: "empty" },
    { name: "Components #1", type: "content", builder: "component-page" },
    { name: "Components #2", type: "empty" },
    { name: "Components #3", type: "empty" },
    { name: "\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014\u2014", type: "separator" },
    { name: "Archive \u25BC", type: "empty" },
    { name: "Page Name ", type: "empty" }
  ];
  var OVERVIEW_SECTIONS = [
    {
      emoji: "\u{1F9EA}",
      title: "Probl\xE9matique",
      bullets: [
        "Remise en contexte, explication synth\xE9tique de la probl\xE9matique principale."
      ]
    },
    {
      emoji: "\u{1F3AF}",
      title: "Objectif",
      bullets: ["OKR et/ou KPIs"]
    },
    {
      emoji: "\u{1F517}",
      title: "Ressources",
      bullets: [
        "Pre-framing (remplacer avec le bon lien)",
        "Discovery (remplacer avec le bon lien)",
        "DP Jira (remplacer avec le bon lien)"
      ]
    },
    {
      emoji: "\u{1F91D}",
      title: "Core team",
      bullets: [
        "Design: @-",
        "Business : @-",
        "Produit : @-",
        "Tech : @-",
        "Autres interlocuteurs :"
      ]
    }
  ];
  var HELP_CONTENT = {
    title: "Comment organiser & documenter ton fichier",
    sections: [
      {
        heading: "Structure du fichier",
        body: "Ce template te propose une structure standardis\xE9e pour organiser ton fichier Figma. Chaque page a un r\xF4le pr\xE9cis pour faciliter la collaboration et la documentation."
      },
      {
        heading: "Cover",
        body: "La premi\xE8re page sert de vignette pour ton fichier. Mets \xE0 jour le nom du projet et l\u2019\xE9quipe. Le thumbnail sera automatiquement appliqu\xE9."
      },
      {
        heading: "Overview",
        body: "R\xE9sume le contexte de l\u2019initiative : probl\xE9matique, objectifs, ressources cl\xE9s et core team. C\u2019est la page de r\xE9f\xE9rence pour toute personne qui d\xE9couvre le projet."
      },
      {
        heading: "Delivery & UI/Prototype",
        body: "Organise tes maquettes par user flow. Utilise les sections et les frames de storyboard pour pr\xE9senter clairement tes \xE9crans."
      },
      {
        heading: "Local components & Specs",
        body: "Cr\xE9e tes composants locaux sp\xE9cifiques au projet dans \xAB Local components \xBB. Documente les sp\xE9cifications dans \xAB Specs \xBB."
      },
      {
        heading: "Archives",
        body: "D\xE9place les anciens \xE9crans et explorations obsol\xE8tes dans cette page plut\xF4t que de les supprimer."
      }
    ]
  };

  // src/shared/tokens.ts
  function hexToRgb(hex5) {
    const h = hex5.replace("#", "");
    return {
      r: parseInt(h.substring(0, 2), 16) / 255,
      g: parseInt(h.substring(2, 4), 16) / 255,
      b: parseInt(h.substring(4, 6), 16) / 255
    };
  }
  function rgbToHex(r, g, b) {
    const toHex = (n) => Math.round(n * 255).toString(16).padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  var colors = {
    // Legacy flat keys → mapped to semantic tokens
    brand: hexToRgb("#0970e6"),
    brandHover: hexToRgb("#004e9b"),
    brandPressed: hexToRgb("#003161"),
    backgroundDefault: hexToRgb("#ffffff"),
    backgroundSubtle: hexToRgb("#f7f7f7"),
    backgroundSubtler: hexToRgb("#f5faff"),
    backgroundReversed: hexToRgb("#121212"),
    contentDefault: hexToRgb("#121212"),
    contentSubtle: hexToRgb("#454545"),
    contentSubtler: hexToRgb("#696969"),
    borderDefault: hexToRgb("#ebebeb"),
    borderSubtle: hexToRgb("#d9d9d9"),
    error: hexToRgb("#df1116"),
    success: hexToRgb("#2c815e"),
    promo: hexToRgb("#d30d1f"),
    white: hexToRgb("#ffffff"),
    black: hexToRgb("#000000"),
    coverGradientStart: hexToRgb("#c71c33"),
    coverGradientEnd: hexToRgb("#ffd54b"),
    helpBackground: hexToRgb("#c8e6c4"),
    helpBackgroundDark: hexToRgb("#3d6e38"),
    statusWip: hexToRgb("#f59e0b")
  };
  var semanticColors = {
    // Action / Background
    actionBackgroundDisabled: hexToRgb("#ebebeb"),
    actionBackgroundBrandDefault: hexToRgb("#0970e6"),
    actionBackgroundBrandHover: hexToRgb("#004e9b"),
    actionBackgroundBrandPressed: hexToRgb("#003161"),
    actionBackgroundErrorDefault: hexToRgb("#df1116"),
    actionBackgroundErrorHover: hexToRgb("#8f0004"),
    actionBackgroundErrorPressed: hexToRgb("#470002"),
    actionBackgroundNeutralDefault: hexToRgb("#121212"),
    actionBackgroundNeutralHover: hexToRgb("#454545"),
    actionBackgroundNeutralPressed: hexToRgb("#696969"),
    actionBackgroundSubtleDefault: hexToRgb("#ffffff"),
    actionBackgroundSubtleHover: hexToRgb("#f5faff"),
    actionBackgroundSubtlePressed: hexToRgb("#ebf4fe"),
    actionBackgroundSuccessDefault: hexToRgb("#2c815e"),
    actionBackgroundSuccessHover: hexToRgb("#155138"),
    actionBackgroundSuccessPressed: hexToRgb("#051e14"),
    // Action / Border
    actionBorderDefault: hexToRgb("#d9d9d9"),
    actionBorderHover: hexToRgb("#b8b8b8"),
    actionBorderPressed: hexToRgb("#878787"),
    actionBorderBrandDefault: hexToRgb("#0970e6"),
    actionBorderBrandHover: hexToRgb("#004e9b"),
    actionBorderBrandPressed: hexToRgb("#003161"),
    actionBorderErrorDefault: hexToRgb("#df1116"),
    actionBorderErrorHover: hexToRgb("#8f0004"),
    actionBorderErrorPressed: hexToRgb("#470002"),
    actionBorderInfoDefault: hexToRgb("#173eb4"),
    actionBorderNeutralDefault: hexToRgb("#696969"),
    actionBorderNeutralHover: hexToRgb("#454545"),
    actionBorderNeutralPressed: hexToRgb("#121212"),
    actionBorderReversedDefault: hexToRgb("#ffffff"),
    actionBorderReversedHover: hexToRgb("#ffffff"),
    actionBorderReversedPressed: hexToRgb("#ffffff"),
    actionBorderSubtleDefault: hexToRgb("#121212"),
    actionBorderSubtleHover: hexToRgb("#121212"),
    actionBorderSubtlePressed: hexToRgb("#121212"),
    actionBorderSuccessDefault: hexToRgb("#2c815e"),
    actionBorderSuccessHover: hexToRgb("#155138"),
    actionBorderSuccessPressed: hexToRgb("#051e14"),
    actionBorderWarningDefault: hexToRgb("#df1116"),
    // Action / Content
    actionContentDisabled: hexToRgb("#696969"),
    actionContentBrandDefault: hexToRgb("#0970e6"),
    actionContentBrandHover: hexToRgb("#004e9b"),
    actionContentBrandPressed: hexToRgb("#003161"),
    actionContentContrastDefault: hexToRgb("#ffffff"),
    actionContentContrastHover: hexToRgb("#ffffff"),
    actionContentContrastPressed: hexToRgb("#ffffff"),
    actionContentErrorDefault: hexToRgb("#df1116"),
    actionContentErrorHover: hexToRgb("#8f0004"),
    actionContentErrorPressed: hexToRgb("#470002"),
    actionContentNeutralDefault: hexToRgb("#121212"),
    actionContentNeutralHover: hexToRgb("#454545"),
    actionContentNeutralPressed: hexToRgb("#696969"),
    actionContentReversedDefault: hexToRgb("#ffffff"),
    actionContentReversedHover: hexToRgb("#ffffff"),
    actionContentReversedPressed: hexToRgb("#ffffff"),
    actionContentSubtleDefault: hexToRgb("#121212"),
    actionContentSubtleHover: hexToRgb("#121212"),
    actionContentSubtlePressed: hexToRgb("#121212"),
    actionContentSuccessDefault: hexToRgb("#2c815e"),
    actionContentSuccessHover: hexToRgb("#155138"),
    actionContentSuccessPressed: hexToRgb("#051e14"),
    // Persistent / Background
    persistentBackgroundDefault: hexToRgb("#ffffff"),
    persistentBackgroundSubtle: hexToRgb("#f7f7f7"),
    persistentBackgroundSubtler: hexToRgb("#f5faff"),
    persistentBackgroundErrorDefault: hexToRgb("#8f0004"),
    persistentBackgroundErrorReversed: hexToRgb("#ffefef"),
    persistentBackgroundInfoDefault: hexToRgb("#173eb4"),
    persistentBackgroundInfoReversed: hexToRgb("#e8f8ff"),
    persistentBackgroundReversedDefault: hexToRgb("#121212"),
    persistentBackgroundReversedSubtle: hexToRgb("#454545"),
    persistentBackgroundReversedSubtler: hexToRgb("#696969"),
    persistentBackgroundSpecificPromo: hexToRgb("#d30d1f"),
    persistentBackgroundSuccessDefault: hexToRgb("#2c815e"),
    persistentBackgroundSuccessReversed: hexToRgb("#f0faf6"),
    persistentBackgroundWarningDefault: hexToRgb("#8a5f00"),
    persistentBackgroundWarningReversed: hexToRgb("#fffaf0"),
    // Persistent / Border
    persistentBorderSubtle: hexToRgb("#d9d9d9"),
    persistentBorderDefault: hexToRgb("#ebebeb"),
    persistentBorderDarker: hexToRgb("#121212"),
    persistentBorderErrorDefault: hexToRgb("#8f0004"),
    persistentBorderErrorReversed: hexToRgb("#ffefef"),
    persistentBorderInfoDefault: hexToRgb("#173eb4"),
    persistentBorderInfoReversed: hexToRgb("#e8f8ff"),
    persistentBorderSuccessDefault: hexToRgb("#2c815e"),
    persistentBorderSuccessReversed: hexToRgb("#f0faf6"),
    persistentBorderWarningDefault: hexToRgb("#8a5f00"),
    persistentBorderWarningReversed: hexToRgb("#fffaf0"),
    // Persistent / Content
    persistentContentDefault: hexToRgb("#121212"),
    persistentContentSubtle: hexToRgb("#454545"),
    persistentContentSubtler: hexToRgb("#696969"),
    persistentContentBrandDefault: hexToRgb("#0970e6"),
    persistentContentContrastDefault: hexToRgb("#ffffff"),
    persistentContentErrorDefault: hexToRgb("#8f0004"),
    persistentContentErrorReversed: hexToRgb("#ffefef"),
    persistentContentInfoDefault: hexToRgb("#173eb4"),
    persistentContentInfoReversed: hexToRgb("#e8f8ff"),
    persistentContentReversedDefault: hexToRgb("#ffffff"),
    persistentContentReversedSubtle: hexToRgb("#f2f2f2"),
    persistentContentReversedSubtler: hexToRgb("#ebebeb"),
    persistentContentSuccessDefault: hexToRgb("#2c815e"),
    persistentContentSuccessReversed: hexToRgb("#f0faf6"),
    persistentContentWarningDefault: hexToRgb("#8a5f00"),
    persistentContentWarningReversed: hexToRgb("#fffaf0")
  };
  var spacing = {
    "2xs": 2,
    xs: 4,
    s: 8,
    m: 12,
    l: 16,
    xl: 24,
    "2xl": 32,
    "3xl": 40,
    "4xl": 48,
    "5xl": 56,
    "6xl": 72
  };
  var borderRadius = {
    xs: 2,
    s: 4,
    m: 8,
    l: 16,
    xl: 24,
    "2xl": 32,
    rounded: 100
  };
  var fonts = {
    family: "Ubuntu",
    weights: {
      regular: "Regular",
      medium: "Medium",
      bold: "Bold"
    }
  };
  var DS_TOKENS = [
    // ── Colors (semantic, Light mode) ──
    // Action / Background
    { name: "Action/Background/Disabled", cssVar: "--mrcl-action-background-disabled", value: "#ebebeb", category: "color" },
    { name: "Action/Background/Brand/Default", cssVar: "--mrcl-action-background-brand-default", value: "#0970e6", category: "color" },
    { name: "Action/Background/Brand/Hover", cssVar: "--mrcl-action-background-brand-hover", value: "#004e9b", category: "color" },
    { name: "Action/Background/Brand/Pressed", cssVar: "--mrcl-action-background-brand-pressed", value: "#003161", category: "color" },
    { name: "Action/Background/Error/Default", cssVar: "--mrcl-action-background-error-default", value: "#df1116", category: "color" },
    { name: "Action/Background/Error/Hover", cssVar: "--mrcl-action-background-error-hover", value: "#8f0004", category: "color" },
    { name: "Action/Background/Error/Pressed", cssVar: "--mrcl-action-background-error-pressed", value: "#470002", category: "color" },
    { name: "Action/Background/Neutral/Default", cssVar: "--mrcl-action-background-neutral-default", value: "#121212", category: "color" },
    { name: "Action/Background/Neutral/Hover", cssVar: "--mrcl-action-background-neutral-hover", value: "#454545", category: "color" },
    { name: "Action/Background/Neutral/Pressed", cssVar: "--mrcl-action-background-neutral-pressed", value: "#696969", category: "color" },
    { name: "Action/Background/Subtle/Default", cssVar: "--mrcl-action-background-subtle-default", value: "#ffffff", category: "color" },
    { name: "Action/Background/Subtle/Hover", cssVar: "--mrcl-action-background-subtle-hover", value: "#f5faff", category: "color" },
    { name: "Action/Background/Subtle/Pressed", cssVar: "--mrcl-action-background-subtle-pressed", value: "#ebf4fe", category: "color" },
    { name: "Action/Background/Success/Default", cssVar: "--mrcl-action-background-success-default", value: "#2c815e", category: "color" },
    { name: "Action/Background/Success/Hover", cssVar: "--mrcl-action-background-success-hover", value: "#155138", category: "color" },
    { name: "Action/Background/Success/Pressed", cssVar: "--mrcl-action-background-success-pressed", value: "#051e14", category: "color" },
    // Action / Border
    { name: "Action/Border/Default", cssVar: "--mrcl-action-border-default", value: "#d9d9d9", category: "color" },
    { name: "Action/Border/Hover", cssVar: "--mrcl-action-border-hover", value: "#b8b8b8", category: "color" },
    { name: "Action/Border/Pressed", cssVar: "--mrcl-action-border-pressed", value: "#878787", category: "color" },
    { name: "Action/Border/Brand/Default", cssVar: "--mrcl-action-border-brand-default", value: "#0970e6", category: "color" },
    { name: "Action/Border/Brand/Hover", cssVar: "--mrcl-action-border-brand-hover", value: "#004e9b", category: "color" },
    { name: "Action/Border/Brand/Pressed", cssVar: "--mrcl-action-border-brand-pressed", value: "#003161", category: "color" },
    { name: "Action/Border/Error/Default", cssVar: "--mrcl-action-border-error-default", value: "#df1116", category: "color" },
    { name: "Action/Border/Error/Hover", cssVar: "--mrcl-action-border-error-hover", value: "#8f0004", category: "color" },
    { name: "Action/Border/Error/Pressed", cssVar: "--mrcl-action-border-error-pressed", value: "#470002", category: "color" },
    { name: "Action/Border/Info/Default", cssVar: "--mrcl-action-border-info-default", value: "#173eb4", category: "color" },
    { name: "Action/Border/Neutral/Default", cssVar: "--mrcl-action-border-neutral-default", value: "#696969", category: "color" },
    { name: "Action/Border/Neutral/Hover", cssVar: "--mrcl-action-border-neutral-hover", value: "#454545", category: "color" },
    { name: "Action/Border/Neutral/Pressed", cssVar: "--mrcl-action-border-neutral-pressed", value: "#121212", category: "color" },
    { name: "Action/Border/Reversed/Default", cssVar: "--mrcl-action-border-reversed-default", value: "#ffffff", category: "color" },
    { name: "Action/Border/Reversed/Hover", cssVar: "--mrcl-action-border-reversed-hover", value: "#ffffff", category: "color" },
    { name: "Action/Border/Reversed/Pressed", cssVar: "--mrcl-action-border-reversed-pressed", value: "#ffffff", category: "color" },
    { name: "Action/Border/Subtle/Default", cssVar: "--mrcl-action-border-subtle-default", value: "#121212", category: "color" },
    { name: "Action/Border/Subtle/Hover", cssVar: "--mrcl-action-border-subtle-hover", value: "#121212", category: "color" },
    { name: "Action/Border/Subtle/Pressed", cssVar: "--mrcl-action-border-subtle-pressed", value: "#121212", category: "color" },
    { name: "Action/Border/Success/Default", cssVar: "--mrcl-action-border-success-default", value: "#2c815e", category: "color" },
    { name: "Action/Border/Success/Hover", cssVar: "--mrcl-action-border-success-hover", value: "#155138", category: "color" },
    { name: "Action/Border/Success/Pressed", cssVar: "--mrcl-action-border-success-pressed", value: "#051e14", category: "color" },
    { name: "Action/Border/Warning/Default", cssVar: "--mrcl-action-border-warning-default", value: "#df1116", category: "color" },
    // Action / Content
    { name: "Action/Content/Disabled", cssVar: "--mrcl-action-content-disabled", value: "#696969", category: "color" },
    { name: "Action/Content/Brand/Default", cssVar: "--mrcl-action-content-brand-default", value: "#0970e6", category: "color" },
    { name: "Action/Content/Brand/Hover", cssVar: "--mrcl-action-content-brand-hover", value: "#004e9b", category: "color" },
    { name: "Action/Content/Brand/Pressed", cssVar: "--mrcl-action-content-brand-pressed", value: "#003161", category: "color" },
    { name: "Action/Content/Contrast/Default", cssVar: "--mrcl-action-content-contrast-default", value: "#ffffff", category: "color" },
    { name: "Action/Content/Contrast/Hover", cssVar: "--mrcl-action-content-contrast-hover", value: "#ffffff", category: "color" },
    { name: "Action/Content/Contrast/Pressed", cssVar: "--mrcl-action-content-contrast-pressed", value: "#ffffff", category: "color" },
    { name: "Action/Content/Error/Default", cssVar: "--mrcl-action-content-error-default", value: "#df1116", category: "color" },
    { name: "Action/Content/Error/Hover", cssVar: "--mrcl-action-content-error-hover", value: "#8f0004", category: "color" },
    { name: "Action/Content/Error/Pressed", cssVar: "--mrcl-action-content-error-pressed", value: "#470002", category: "color" },
    { name: "Action/Content/Neutral/Default", cssVar: "--mrcl-action-content-neutral-default", value: "#121212", category: "color" },
    { name: "Action/Content/Neutral/Hover", cssVar: "--mrcl-action-content-neutral-hover", value: "#454545", category: "color" },
    { name: "Action/Content/Neutral/Pressed", cssVar: "--mrcl-action-content-neutral-pressed", value: "#696969", category: "color" },
    { name: "Action/Content/Reversed/Default", cssVar: "--mrcl-action-content-reversed-default", value: "#ffffff", category: "color" },
    { name: "Action/Content/Reversed/Hover", cssVar: "--mrcl-action-content-reversed-hover", value: "#ffffff", category: "color" },
    { name: "Action/Content/Reversed/Pressed", cssVar: "--mrcl-action-content-reversed-pressed", value: "#ffffff", category: "color" },
    { name: "Action/Content/Subtle/Default", cssVar: "--mrcl-action-content-subtle-default", value: "#121212", category: "color" },
    { name: "Action/Content/Subtle/Hover", cssVar: "--mrcl-action-content-subtle-hover", value: "#121212", category: "color" },
    { name: "Action/Content/Subtle/Pressed", cssVar: "--mrcl-action-content-subtle-pressed", value: "#121212", category: "color" },
    { name: "Action/Content/Success/Default", cssVar: "--mrcl-action-content-success-default", value: "#2c815e", category: "color" },
    { name: "Action/Content/Success/Hover", cssVar: "--mrcl-action-content-success-hover", value: "#155138", category: "color" },
    { name: "Action/Content/Success/Pressed", cssVar: "--mrcl-action-content-success-pressed", value: "#051e14", category: "color" },
    // Persistent / Background
    { name: "Persistent/Background/Default", cssVar: "--mrcl-persistent-background-default", value: "#ffffff", category: "color" },
    { name: "Persistent/Background/Subtle", cssVar: "--mrcl-persistent-background-subtle", value: "#f7f7f7", category: "color" },
    { name: "Persistent/Background/Subtler", cssVar: "--mrcl-persistent-background-subtler", value: "#f5faff", category: "color" },
    { name: "Persistent/Background/Error/Default", cssVar: "--mrcl-persistent-background-error-default", value: "#8f0004", category: "color" },
    { name: "Persistent/Background/Error/Reversed", cssVar: "--mrcl-persistent-background-error-reversed", value: "#ffefef", category: "color" },
    { name: "Persistent/Background/Info/Default", cssVar: "--mrcl-persistent-background-info-default", value: "#173eb4", category: "color" },
    { name: "Persistent/Background/Info/Reversed", cssVar: "--mrcl-persistent-background-info-reversed", value: "#e8f8ff", category: "color" },
    { name: "Persistent/Background/Reversed/Default", cssVar: "--mrcl-persistent-background-reversed-default", value: "#121212", category: "color" },
    { name: "Persistent/Background/Reversed/Subtle", cssVar: "--mrcl-persistent-background-reversed-subtle", value: "#454545", category: "color" },
    { name: "Persistent/Background/Reversed/Subtler", cssVar: "--mrcl-persistent-background-reversed-subtler", value: "#696969", category: "color" },
    { name: "Persistent/Background/Specific/Promo", cssVar: "--mrcl-persistent-background-specific-promo", value: "#d30d1f", category: "color" },
    { name: "Persistent/Background/Success/Default", cssVar: "--mrcl-persistent-background-success-default", value: "#2c815e", category: "color" },
    { name: "Persistent/Background/Success/Reversed", cssVar: "--mrcl-persistent-background-success-reversed", value: "#f0faf6", category: "color" },
    { name: "Persistent/Background/Warning/Default", cssVar: "--mrcl-persistent-background-warning-default", value: "#8a5f00", category: "color" },
    { name: "Persistent/Background/Warning/Reversed", cssVar: "--mrcl-persistent-background-warning-reversed", value: "#fffaf0", category: "color" },
    // Persistent / Border
    { name: "Persistent/Border/Subtle", cssVar: "--mrcl-persistent-border-subtle", value: "#d9d9d9", category: "color" },
    { name: "Persistent/Border/Default", cssVar: "--mrcl-persistent-border-default", value: "#ebebeb", category: "color" },
    { name: "Persistent/Border/Darker", cssVar: "--mrcl-persistent-border-darker", value: "#121212", category: "color" },
    { name: "Persistent/Border/Error/Default", cssVar: "--mrcl-persistent-border-error-default", value: "#8f0004", category: "color" },
    { name: "Persistent/Border/Error/Reversed", cssVar: "--mrcl-persistent-border-error-reversed", value: "#ffefef", category: "color" },
    { name: "Persistent/Border/Info/Default", cssVar: "--mrcl-persistent-border-info-default", value: "#173eb4", category: "color" },
    { name: "Persistent/Border/Info/Reversed", cssVar: "--mrcl-persistent-border-info-reversed", value: "#e8f8ff", category: "color" },
    { name: "Persistent/Border/Success/Default", cssVar: "--mrcl-persistent-border-success-default", value: "#2c815e", category: "color" },
    { name: "Persistent/Border/Success/Reversed", cssVar: "--mrcl-persistent-border-success-reversed", value: "#f0faf6", category: "color" },
    { name: "Persistent/Border/Warning/Default", cssVar: "--mrcl-persistent-border-warning-default", value: "#8a5f00", category: "color" },
    { name: "Persistent/Border/Warning/Reversed", cssVar: "--mrcl-persistent-border-warning-reversed", value: "#fffaf0", category: "color" },
    // Persistent / Content
    { name: "Persistent/Content/Default", cssVar: "--mrcl-persistent-content-default", value: "#121212", category: "color" },
    { name: "Persistent/Content/Subtle", cssVar: "--mrcl-persistent-content-subtle", value: "#454545", category: "color" },
    { name: "Persistent/Content/Subtler", cssVar: "--mrcl-persistent-content-subtler", value: "#696969", category: "color" },
    { name: "Persistent/Content/Brand/Default", cssVar: "--mrcl-persistent-content-brand-default", value: "#0970e6", category: "color" },
    { name: "Persistent/Content/Contrast/Default", cssVar: "--mrcl-persistent-content-contrast-default", value: "#ffffff", category: "color" },
    { name: "Persistent/Content/Error/Default", cssVar: "--mrcl-persistent-content-error-default", value: "#8f0004", category: "color" },
    { name: "Persistent/Content/Error/Reversed", cssVar: "--mrcl-persistent-content-error-reversed", value: "#ffefef", category: "color" },
    { name: "Persistent/Content/Info/Default", cssVar: "--mrcl-persistent-content-info-default", value: "#173eb4", category: "color" },
    { name: "Persistent/Content/Info/Reversed", cssVar: "--mrcl-persistent-content-info-reversed", value: "#e8f8ff", category: "color" },
    { name: "Persistent/Content/Reversed/Default", cssVar: "--mrcl-persistent-content-reversed-default", value: "#ffffff", category: "color" },
    { name: "Persistent/Content/Reversed/Subtle", cssVar: "--mrcl-persistent-content-reversed-subtle", value: "#f2f2f2", category: "color" },
    { name: "Persistent/Content/Reversed/Subtler", cssVar: "--mrcl-persistent-content-reversed-subtler", value: "#ebebeb", category: "color" },
    { name: "Persistent/Content/Success/Default", cssVar: "--mrcl-persistent-content-success-default", value: "#2c815e", category: "color" },
    { name: "Persistent/Content/Success/Reversed", cssVar: "--mrcl-persistent-content-success-reversed", value: "#f0faf6", category: "color" },
    { name: "Persistent/Content/Warning/Default", cssVar: "--mrcl-persistent-content-warning-default", value: "#8a5f00", category: "color" },
    { name: "Persistent/Content/Warning/Reversed", cssVar: "--mrcl-persistent-content-warning-reversed", value: "#fffaf0", category: "color" },
    // ── Spacing ──
    { name: "Spacing/2XS", cssVar: "--mrcl-spacing-2xs", value: "2", category: "spacing" },
    { name: "Spacing/XS", cssVar: "--mrcl-spacing-xs", value: "4", category: "spacing" },
    { name: "Spacing/S", cssVar: "--mrcl-spacing-s", value: "8", category: "spacing" },
    { name: "Spacing/M", cssVar: "--mrcl-spacing-m", value: "12", category: "spacing" },
    { name: "Spacing/L", cssVar: "--mrcl-spacing-l", value: "16", category: "spacing" },
    { name: "Spacing/XL", cssVar: "--mrcl-spacing-xl", value: "24", category: "spacing" },
    { name: "Spacing/2XL", cssVar: "--mrcl-spacing-2xl", value: "32", category: "spacing" },
    { name: "Spacing/3XL", cssVar: "--mrcl-spacing-3xl", value: "40", category: "spacing" },
    { name: "Spacing/4XL", cssVar: "--mrcl-spacing-4xl", value: "48", category: "spacing" },
    { name: "Spacing/5XL", cssVar: "--mrcl-spacing-5xl", value: "56", category: "spacing" },
    { name: "Spacing/6XL", cssVar: "--mrcl-spacing-6xl", value: "72", category: "spacing" },
    // ── Sizing ──
    { name: "Sizing/4XS", cssVar: "--mrcl-sizing-4xs", value: "2", category: "sizing" },
    { name: "Sizing/3XS", cssVar: "--mrcl-sizing-3xs", value: "4", category: "sizing" },
    { name: "Sizing/2XS", cssVar: "--mrcl-sizing-2xs", value: "8", category: "sizing" },
    { name: "Sizing/XS", cssVar: "--mrcl-sizing-xs", value: "12", category: "sizing" },
    { name: "Sizing/S", cssVar: "--mrcl-sizing-s", value: "16", category: "sizing" },
    { name: "Sizing/M", cssVar: "--mrcl-sizing-m", value: "24", category: "sizing" },
    { name: "Sizing/L", cssVar: "--mrcl-sizing-l", value: "32", category: "sizing" },
    { name: "Sizing/XL", cssVar: "--mrcl-sizing-xl", value: "40", category: "sizing" },
    { name: "Sizing/2XL", cssVar: "--mrcl-sizing-2xl", value: "48", category: "sizing" },
    { name: "Sizing/3XL", cssVar: "--mrcl-sizing-3xl", value: "56", category: "sizing" },
    { name: "Sizing/4XL", cssVar: "--mrcl-sizing-4xl", value: "72", category: "sizing" },
    // ── Border Radius ──
    { name: "Border/Radius/XS", cssVar: "--mrcl-border-radius-xs", value: "2", category: "border-radius" },
    { name: "Border/Radius/S", cssVar: "--mrcl-border-radius-s", value: "4", category: "border-radius" },
    { name: "Border/Radius/M", cssVar: "--mrcl-border-radius-m", value: "8", category: "border-radius" },
    { name: "Border/Radius/L", cssVar: "--mrcl-border-radius-l", value: "16", category: "border-radius" },
    { name: "Border/Radius/XL", cssVar: "--mrcl-border-radius-xl", value: "24", category: "border-radius" },
    { name: "Border/Radius/2XL", cssVar: "--mrcl-border-radius-2xl", value: "32", category: "border-radius" },
    { name: "Border/Radius/Rounded", cssVar: "--mrcl-border-radius-round", value: "100", category: "border-radius" },
    // ── Typography ──
    { name: "Font Family/Default", cssVar: "--mrcl-font-family-default", value: "Ubuntu", category: "typography" },
    { name: "Font Weight/Regular", cssVar: "--mrcl-font-weight-regular", value: "Regular", category: "typography" },
    { name: "Font Weight/Bold", cssVar: "--mrcl-font-weight-bold", value: "Bold", category: "typography" },
    { name: "Font Size/Body/XS", cssVar: "--mrcl-font-size-body-xs", value: "12", category: "typography" },
    { name: "Font Size/Body/S", cssVar: "--mrcl-font-size-body-s", value: "14", category: "typography" },
    { name: "Font Size/Body/M", cssVar: "--mrcl-font-size-body-m", value: "16", category: "typography" },
    { name: "Font Size/Title/2XS", cssVar: "--mrcl-font-size-title-2xs", value: "20", category: "typography" },
    { name: "Font Size/Title/XS", cssVar: "--mrcl-font-size-title-xs", value: "24", category: "typography" },
    { name: "Font Size/Title/S", cssVar: "--mrcl-font-size-title-s", value: "28", category: "typography" },
    { name: "Font Size/Title/M", cssVar: "--mrcl-font-size-title-m", value: "32", category: "typography" },
    { name: "Font Size/Title/L", cssVar: "--mrcl-font-size-title-l", value: "40", category: "typography" },
    { name: "Font Size/Title/XL", cssVar: "--mrcl-font-size-title-xl", value: "48", category: "typography" },
    { name: "Font Size/Title/2XL", cssVar: "--mrcl-font-size-title-2xl", value: "56", category: "typography" }
  ];

  // src/shared/figma-helpers.ts
  function resolveOrMixed(value, fallback) {
    return value === figma.mixed ? fallback : value;
  }
  function getNodeFills(node) {
    if (!("fills" in node)) return [];
    const fills = node.fills;
    if (fills === figma.mixed) return [];
    return fills;
  }
  function getNodeStrokes(node) {
    if (!("strokes" in node)) return [];
    return node.strokes;
  }
  var loadedFonts = /* @__PURE__ */ new Set();
  async function loadFont(family = fonts.family, style = fonts.weights.regular) {
    const key = `${family}::${style}`;
    if (loadedFonts.has(key)) return;
    await figma.loadFontAsync({ family, style });
    loadedFonts.add(key);
  }
  async function loadAllFonts() {
    await Promise.all([
      loadFont(fonts.family, fonts.weights.regular),
      loadFont(fonts.family, fonts.weights.medium),
      loadFont(fonts.family, fonts.weights.bold)
    ]);
  }
  function createText(options) {
    const node = figma.createText();
    node.fontName = {
      family: fonts.family,
      style: options.fontStyle || fonts.weights.regular
    };
    node.characters = options.text;
    node.fontSize = options.fontSize;
    node.fills = [{ type: "SOLID", color: options.color || colors.contentDefault }];
    if (options.x !== void 0) node.x = options.x;
    if (options.y !== void 0) node.y = options.y;
    if (options.width !== void 0) {
      node.resize(options.width, node.height);
      node.textAutoResize = "HEIGHT";
    }
    if (options.lineHeight !== void 0) {
      node.lineHeight = { value: options.lineHeight, unit: "PIXELS" };
    }
    if (options.letterSpacing !== void 0) {
      node.letterSpacing = { value: options.letterSpacing, unit: "PIXELS" };
    }
    if (options.opacity !== void 0) {
      node.opacity = options.opacity;
    }
    return node;
  }
  function createFrame(options) {
    const frame = figma.createFrame();
    frame.name = options.name;
    frame.resize(options.width, options.height);
    if (options.x !== void 0) frame.x = options.x;
    if (options.y !== void 0) frame.y = options.y;
    if (options.fills !== void 0) frame.fills = options.fills;
    if (options.cornerRadius !== void 0) frame.cornerRadius = options.cornerRadius;
    if (options.layoutMode && options.layoutMode !== "NONE") {
      frame.layoutMode = options.layoutMode;
    }
    if (options.paddingTop !== void 0) frame.paddingTop = options.paddingTop;
    if (options.paddingBottom !== void 0) frame.paddingBottom = options.paddingBottom;
    if (options.paddingLeft !== void 0) frame.paddingLeft = options.paddingLeft;
    if (options.paddingRight !== void 0) frame.paddingRight = options.paddingRight;
    if (options.itemSpacing !== void 0) frame.itemSpacing = options.itemSpacing;
    if (options.primaryAxisSizingMode !== void 0) {
      frame.primaryAxisSizingMode = options.primaryAxisSizingMode;
    }
    if (options.counterAxisSizingMode !== void 0) {
      frame.counterAxisSizingMode = options.counterAxisSizingMode;
    }
    if (options.clipsContent !== void 0) frame.clipsContent = options.clipsContent;
    return frame;
  }
  function createRect(options) {
    const rect = figma.createRectangle();
    rect.name = options.name;
    rect.resize(options.width, options.height);
    if (options.x !== void 0) rect.x = options.x;
    if (options.y !== void 0) rect.y = options.y;
    if (options.fills !== void 0) rect.fills = options.fills;
    if (options.cornerRadius !== void 0) rect.cornerRadius = options.cornerRadius;
    if (options.opacity !== void 0) rect.opacity = options.opacity;
    return rect;
  }
  function solidFill(color, opacity) {
    return [{ type: "SOLID", color, opacity: opacity != null ? opacity : 1 }];
  }
  function gradientFill(colorStart, colorEnd, angleDeg = 245) {
    const angleRad = angleDeg * Math.PI / 180;
    const cos = Math.cos(angleRad);
    const sin = Math.sin(angleRad);
    return [
      {
        type: "GRADIENT_LINEAR",
        gradientStops: [
          { position: 0.1, color: __spreadProps(__spreadValues({}, colorEnd), { a: 1 }) },
          { position: 0.57, color: __spreadProps(__spreadValues({}, colorStart), { a: 1 }) }
        ],
        gradientTransform: [
          [cos, sin, 0.5 - (cos + sin) * 0.5],
          [-sin, cos, 0.5 - (-sin + cos) * 0.5]
        ]
      }
    ];
  }
  function addShadow(node) {
    node.effects = [
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 2 },
        radius: 12,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      }
    ];
  }
  async function importAndCreateInstance(componentKey, parent, options) {
    try {
      console.log(`[Marcel] Importing component: ${componentKey}`);
      const component = await figma.importComponentByKeyAsync(componentKey);
      console.log(`[Marcel] Imported OK: "${component.name}" (${component.id})`);
      const instance = component.createInstance();
      if ((options == null ? void 0 : options.x) !== void 0) instance.x = options.x;
      if ((options == null ? void 0 : options.y) !== void 0) instance.y = options.y;
      if (parent) {
        parent.appendChild(instance);
      }
      console.log(`[Marcel] Instance created: "${instance.name}"`);
      return instance;
    } catch (e4) {
      const msg = (e4 == null ? void 0 : e4.message) || String(e4);
      console.warn(`[Marcel] Skipped import ${componentKey.substring(0, 8)}...: ${msg}`);
      return null;
    }
  }
  async function insertTrackingPixel(page, anchorNode) {
    let pixel = await importAndCreateInstance(
      // DS_COMPONENT_KEYS.trackingPixel — raw key to avoid cross-feature import
      "765eaa06057611c1a5e88eac045eff85159116b5",
      page
    );
    if (!pixel) {
      const fallback = createRect({
        name: "Pixels",
        width: 154,
        height: 154,
        fills: solidFill({ r: 0.85, g: 0.85, b: 0.85 }),
        cornerRadius: 122,
        opacity: 0
      });
      page.appendChild(fallback);
      pixel = fallback;
    }
    pixel.x = anchorNode.x + anchorNode.width + 40;
    pixel.y = anchorNode.y;
    pixel.locked = true;
  }

  // src/features/starter-kit/builders/cover-builder.ts
  async function buildCover(page, data) {
    var _a, _b, _c, _d, _e;
    const COVER_W = 1600;
    const COVER_H = 900;
    const wrapper = createFrame({
      name: "Cover",
      width: COVER_W,
      height: COVER_H,
      fills: [],
      clipsContent: true
    });
    wrapper.primaryAxisSizingMode = "FIXED";
    wrapper.counterAxisSizingMode = "FIXED";
    page.appendChild(wrapper);
    const instance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.coverInProgress,
      wrapper
    );
    if (instance) {
      instance.x = 0;
      instance.y = 0;
      instance.resize(COVER_W, COVER_H);
      return wrapper;
    }
    const PAD_LEFT = 120;
    const PAD_TOP = 120;
    wrapper.fills = gradientFill(
      colors.coverGradientStart,
      colors.coverGradientEnd,
      245
    );
    addShadow(wrapper);
    const cover = wrapper;
    const tagsRow = createFrame({
      name: "Tags",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing["2xl"],
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    tagsRow.primaryAxisSizingMode = "AUTO";
    tagsRow.counterAxisSizingMode = "AUTO";
    tagsRow.x = PAD_LEFT;
    tagsRow.y = PAD_TOP;
    const nsBadge = createFrame({
      name: "NS",
      width: 88,
      height: 88,
      fills: solidFill(colors.white, 0.9),
      cornerRadius: 20,
      layoutMode: "HORIZONTAL",
      paddingTop: spacing.l,
      paddingBottom: spacing.l,
      paddingLeft: spacing.l,
      paddingRight: spacing.l
    });
    nsBadge.primaryAxisSizingMode = "FIXED";
    nsBadge.counterAxisSizingMode = "FIXED";
    nsBadge.primaryAxisAlignItems = "CENTER";
    nsBadge.counterAxisAlignItems = "CENTER";
    nsBadge.effects = [
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 20 },
        radius: 40,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      }
    ];
    const nsText = createText({
      text: "NS",
      fontSize: 40,
      fontStyle: "Bold",
      color: colors.black
    });
    nsBadge.appendChild(nsText);
    tagsRow.appendChild(nsBadge);
    const statusPill = createFrame({
      name: "Status",
      width: 1,
      height: 88,
      fills: solidFill(colors.white),
      cornerRadius: borderRadius.xl,
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.s,
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      paddingLeft: spacing.xl,
      paddingRight: spacing.xl
    });
    statusPill.primaryAxisSizingMode = "AUTO";
    statusPill.counterAxisSizingMode = "FIXED";
    statusPill.counterAxisAlignItems = "CENTER";
    statusPill.effects = [
      {
        type: "DROP_SHADOW",
        color: { r: 0.07, g: 0.07, b: 0.07, a: 0.16 },
        offset: { x: 0, y: 8 },
        radius: 24,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      },
      {
        type: "DROP_SHADOW",
        color: { r: 0.07, g: 0.07, b: 0.07, a: 0.12 },
        offset: { x: 0, y: 16 },
        radius: 64,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      }
    ];
    const statusEmoji = createText({
      text: "\u{1F6A7}",
      fontSize: 32,
      fontStyle: "Regular",
      color: colors.contentSubtler
    });
    const statusLabel = createText({
      text: (_a = data == null ? void 0 : data.status) != null ? _a : "In Progress",
      fontSize: 40,
      fontStyle: "Bold",
      color: colors.contentSubtler
    });
    statusPill.appendChild(statusEmoji);
    statusPill.appendChild(statusLabel);
    tagsRow.appendChild(statusPill);
    cover.appendChild(tagsRow);
    const contentArea = createFrame({
      name: "Content",
      width: 1360,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      itemSpacing: 15,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    contentArea.primaryAxisSizingMode = "AUTO";
    contentArea.counterAxisSizingMode = "FIXED";
    contentArea.x = PAD_LEFT;
    contentArea.y = 257;
    const title = createText({
      text: (_b = data == null ? void 0 : data.fileName) != null ? _b : "File Name",
      fontSize: 100,
      fontStyle: "Bold",
      color: colors.white
    });
    title.textAutoResize = "WIDTH_AND_HEIGHT";
    contentArea.appendChild(title);
    const subtitle = createText({
      text: "Short Description",
      fontSize: 48,
      fontStyle: "Medium",
      color: colors.white
    });
    subtitle.textAutoResize = "WIDTH_AND_HEIGHT";
    contentArea.appendChild(subtitle);
    cover.appendChild(contentArea);
    const infoBar = createFrame({
      name: "Info",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.xl,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    infoBar.primaryAxisSizingMode = "AUTO";
    infoBar.counterAxisSizingMode = "AUTO";
    infoBar.x = PAD_LEFT;
    infoBar.y = 700;
    function createInfoColumn(label, value) {
      const col = createFrame({
        name: label,
        width: 1,
        height: 1,
        fills: [],
        layoutMode: "VERTICAL",
        itemSpacing: spacing.s,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
      });
      col.primaryAxisSizingMode = "AUTO";
      col.counterAxisSizingMode = "AUTO";
      col.primaryAxisAlignItems = "MIN";
      const labelNode = createText({
        text: label.toUpperCase(),
        fontSize: 24,
        fontStyle: "Medium",
        color: colors.white
      });
      labelNode.textAutoResize = "WIDTH_AND_HEIGHT";
      col.appendChild(labelNode);
      const valueNode = createText({
        text: value,
        fontSize: 36,
        fontStyle: "Bold",
        color: colors.white
      });
      valueNode.textAutoResize = "WIDTH_AND_HEIGHT";
      col.appendChild(valueNode);
      return col;
    }
    function createInfoSeparator() {
      const sep = createRect({
        name: "Separator",
        width: 1,
        height: 80,
        fills: solidFill(colors.white, 0.3)
      });
      return sep;
    }
    infoBar.appendChild(createInfoColumn("Produit", (_c = data == null ? void 0 : data.fileName) != null ? _c : "Product name"));
    infoBar.appendChild(createInfoSeparator());
    infoBar.appendChild(createInfoColumn("Date", (_d = data == null ? void 0 : data.date) != null ? _d : "01/2026"));
    infoBar.appendChild(createInfoSeparator());
    infoBar.appendChild(createInfoColumn("Designer", (_e = data == null ? void 0 : data.designer) != null ? _e : "Pr\xE9nom Nom"));
    cover.appendChild(infoBar);
    await insertTrackingPixel(page, wrapper);
    return wrapper;
  }

  // src/features/starter-kit/builders/overview-builder.ts
  function createBulletText(text, width) {
    const node = createText({
      text: `\u2022  ${text}`,
      fontSize: 14,
      fontStyle: "Regular",
      color: colors.contentSubtle,
      width,
      lineHeight: 22
    });
    return node;
  }
  function createSectionBlock(section, contentWidth) {
    const block = createFrame({
      name: `Section - ${section.title}`,
      width: contentWidth,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      itemSpacing: spacing.s,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    block.primaryAxisSizingMode = "AUTO";
    block.counterAxisSizingMode = "FIXED";
    block.layoutAlign = "STRETCH";
    const heading = createText({
      text: `${section.emoji}  ${section.title}`,
      fontSize: 20,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: contentWidth,
      lineHeight: 28
    });
    heading.layoutAlign = "STRETCH";
    block.appendChild(heading);
    for (const bullet of section.bullets) {
      const bulletNode = createBulletText(bullet, contentWidth);
      bulletNode.layoutAlign = "STRETCH";
      block.appendChild(bulletNode);
    }
    return block;
  }
  async function buildOverview(page) {
    const instance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.deliveryOverviewLight,
      page
    );
    if (instance) {
      return;
    }
    const cardWidth = 960;
    const cardPadding = spacing["4xl"];
    const contentWidth = cardWidth - cardPadding * 2;
    const card = createFrame({
      name: "Initiative Overview",
      width: cardWidth,
      height: 1,
      fills: solidFill(colors.backgroundDefault),
      cornerRadius: borderRadius.l,
      layoutMode: "VERTICAL",
      paddingTop: cardPadding,
      paddingBottom: cardPadding,
      paddingLeft: cardPadding,
      paddingRight: cardPadding,
      itemSpacing: spacing["2xl"]
    });
    card.primaryAxisSizingMode = "AUTO";
    addShadow(card);
    const headerRow = createFrame({
      name: "Header",
      width: contentWidth,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.m,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    headerRow.primaryAxisSizingMode = "AUTO";
    headerRow.counterAxisSizingMode = "AUTO";
    headerRow.counterAxisAlignItems = "CENTER";
    headerRow.layoutAlign = "STRETCH";
    const headerEmoji = createText({
      text: "\u{1F4CB}",
      fontSize: 32,
      fontStyle: "Regular",
      color: colors.contentDefault
    });
    headerRow.appendChild(headerEmoji);
    const title = createText({
      text: "Initiative Overview",
      fontSize: 32,
      fontStyle: "Bold",
      color: colors.contentDefault,
      lineHeight: 40
    });
    headerRow.appendChild(title);
    card.appendChild(headerRow);
    const divider = createFrame({
      name: "Divider",
      width: contentWidth,
      height: 1,
      fills: solidFill(colors.borderDefault)
    });
    divider.layoutAlign = "STRETCH";
    card.appendChild(divider);
    const grid = createFrame({
      name: "Sections Grid",
      width: contentWidth,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing["2xl"],
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    grid.primaryAxisSizingMode = "FIXED";
    grid.counterAxisSizingMode = "AUTO";
    grid.layoutAlign = "STRETCH";
    grid.layoutWrap = "WRAP";
    const colWidth = (contentWidth - spacing["2xl"]) / 2;
    for (const section of OVERVIEW_SECTIONS) {
      const sectionBlock = createSectionBlock(section, colWidth);
      sectionBlock.counterAxisSizingMode = "FIXED";
      sectionBlock.resize(colWidth, sectionBlock.height);
      grid.appendChild(sectionBlock);
    }
    card.appendChild(grid);
    page.appendChild(card);
  }

  // src/features/starter-kit/builders/delivery-builder.ts
  function createScreenPlaceholder(name, width, height) {
    const frame = createFrame({
      name,
      width,
      height,
      fills: solidFill(colors.backgroundSubtle),
      cornerRadius: borderRadius.m,
      layoutMode: "VERTICAL",
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      paddingLeft: spacing.m,
      paddingRight: spacing.m,
      itemSpacing: spacing.xs
    });
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "FIXED";
    frame.primaryAxisAlignItems = "CENTER";
    frame.counterAxisAlignItems = "CENTER";
    addShadow(frame);
    const label = createText({
      text: name,
      fontSize: 12,
      fontStyle: "Regular",
      color: colors.contentSubtler
    });
    frame.appendChild(label);
    return frame;
  }
  async function buildDelivery(page) {
    const pageWidth = 1400;
    const container = createFrame({
      name: "Delivery Template",
      width: pageWidth,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      itemSpacing: spacing["3xl"],
      paddingTop: spacing["2xl"],
      paddingBottom: spacing["2xl"],
      paddingLeft: 0,
      paddingRight: 0
    });
    container.primaryAxisSizingMode = "AUTO";
    const headerInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.deliveryHeaderBlackM,
      container
    );
    if (!headerInstance) {
      const headerFrame = createFrame({
        name: "[Delivery] Header",
        width: pageWidth,
        height: 1,
        fills: solidFill(colors.backgroundReversed),
        cornerRadius: 24,
        layoutMode: "HORIZONTAL",
        paddingTop: 88,
        paddingBottom: 88,
        paddingLeft: 112,
        paddingRight: 112,
        itemSpacing: spacing.xl
      });
      headerFrame.primaryAxisSizingMode = "FIXED";
      headerFrame.counterAxisSizingMode = "AUTO";
      headerFrame.layoutAlign = "STRETCH";
      headerFrame.counterAxisAlignItems = "CENTER";
      const flowTitle = createText({
        text: "Titre du user flow",
        fontSize: 80,
        fontStyle: "Bold",
        color: colors.white,
        lineHeight: 72
      });
      headerFrame.appendChild(flowTitle);
      const designStatus = createFrame({
        name: "Design Status",
        width: 1,
        height: 1,
        fills: solidFill({ r: 0.922, g: 0.922, b: 0.922 }),
        // #ebebeb
        cornerRadius: borderRadius.rounded,
        layoutMode: "HORIZONTAL",
        paddingTop: spacing.s,
        paddingBottom: spacing.s,
        paddingLeft: spacing.xl,
        paddingRight: spacing.xl,
        itemSpacing: spacing.s
      });
      designStatus.primaryAxisSizingMode = "AUTO";
      designStatus.counterAxisSizingMode = "AUTO";
      designStatus.clipsContent = true;
      const statusEmoji = createText({
        text: "\u{1F440}",
        fontSize: 32,
        fontStyle: "Regular",
        color: colors.contentDefault,
        lineHeight: 40
      });
      designStatus.appendChild(statusEmoji);
      const statusLabel = createText({
        text: "Design Not Started",
        fontSize: 20,
        fontStyle: "Bold",
        color: colors.contentDefault,
        lineHeight: 24
      });
      designStatus.appendChild(statusLabel);
      headerFrame.appendChild(designStatus);
      container.appendChild(headerFrame);
    }
    const storyboardRow = createFrame({
      name: "Storyboard",
      width: pageWidth,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.xl,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    storyboardRow.primaryAxisSizingMode = "AUTO";
    storyboardRow.counterAxisSizingMode = "AUTO";
    storyboardRow.layoutAlign = "STRETCH";
    const screenNames = [
      "\xC9cran 1 \u2014 Accueil",
      "\xC9cran 2 \u2014 D\xE9tail",
      "\xC9cran 3 \u2014 Action",
      "\xC9cran 4 \u2014 Confirmation"
    ];
    for (const screenName of screenNames) {
      const screen = createScreenPlaceholder(screenName, 320, 480);
      storyboardRow.appendChild(screen);
    }
    container.appendChild(storyboardRow);
    const divider = createFrame({
      name: "Divider",
      width: pageWidth,
      height: 1,
      fills: solidFill(colors.borderDefault)
    });
    divider.layoutAlign = "STRETCH";
    container.appendChild(divider);
    const workspaceHeader = createFrame({
      name: "Workspace Header",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.m,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    workspaceHeader.primaryAxisSizingMode = "AUTO";
    workspaceHeader.counterAxisSizingMode = "AUTO";
    const workspaceLabel = createText({
      text: "WORKSPACE",
      fontSize: 14,
      fontStyle: "Bold",
      color: colors.contentSubtler,
      letterSpacing: 2
    });
    workspaceHeader.appendChild(workspaceLabel);
    const workspaceHint = createText({
      text: "\u2014 Glisse tes maquettes ici pour commencer",
      fontSize: 14,
      fontStyle: "Regular",
      color: colors.contentSubtler
    });
    workspaceHeader.appendChild(workspaceHint);
    container.appendChild(workspaceHeader);
    const workspace = createFrame({
      name: "Workspace Area",
      width: pageWidth,
      height: 600,
      fills: solidFill(colors.backgroundSubtle),
      cornerRadius: borderRadius.m
    });
    workspace.layoutAlign = "STRETCH";
    const pad = spacing["4xl"];
    const hintRect = createRect({
      name: "Drop zone",
      width: pageWidth - pad * 2,
      height: 600 - pad * 2,
      x: pad,
      y: pad,
      fills: [],
      cornerRadius: borderRadius.m
    });
    hintRect.strokes = solidFill(colors.borderSubtle);
    hintRect.strokeWeight = 2;
    hintRect.dashPattern = [8, 8];
    const hintText = createText({
      text: "\u2795  D\xE9pose tes \xE9crans ici",
      fontSize: 16,
      fontStyle: "Medium",
      color: colors.contentSubtler
    });
    hintText.x = pageWidth / 2 - 100;
    hintText.y = 300 - 10;
    workspace.appendChild(hintRect);
    workspace.appendChild(hintText);
    container.appendChild(workspace);
    page.appendChild(container);
  }

  // src/features/starter-kit/builders/toolkit-section-builder.ts
  function hexToRgb2(hex5) {
    const h = hex5.replace("#", "");
    return {
      r: parseInt(h.substring(0, 2), 16) / 255,
      g: parseInt(h.substring(2, 4), 16) / 255,
      b: parseInt(h.substring(4, 6), 16) / 255
    };
  }
  function createHighlightChip(label, bgColor, textColor) {
    const chip = createFrame({
      name: `Highlight - ${label}`,
      width: 1,
      height: 1,
      fills: solidFill(bgColor),
      cornerRadius: borderRadius.s,
      layoutMode: "HORIZONTAL",
      paddingTop: spacing.xs,
      paddingBottom: spacing.xs,
      paddingLeft: spacing.s,
      paddingRight: spacing.s
    });
    chip.primaryAxisSizingMode = "AUTO";
    chip.counterAxisSizingMode = "AUTO";
    const text = createText({
      text: label,
      fontSize: 11,
      fontStyle: "Bold",
      color: textColor
    });
    chip.appendChild(text);
    return chip;
  }
  function createPostIt(title, body, bgColor) {
    const postit = createFrame({
      name: `Post-it - ${title}`,
      width: 200,
      height: 1,
      fills: solidFill(bgColor),
      cornerRadius: borderRadius.s,
      layoutMode: "VERTICAL",
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      paddingLeft: spacing.m,
      paddingRight: spacing.m,
      itemSpacing: spacing.s
    });
    postit.primaryAxisSizingMode = "AUTO";
    addShadow(postit);
    const titleNode = createText({
      text: title,
      fontSize: 12,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: 176,
      lineHeight: 16
    });
    titleNode.layoutAlign = "STRETCH";
    postit.appendChild(titleNode);
    const bodyNode = createText({
      text: body,
      fontSize: 11,
      fontStyle: "Regular",
      color: colors.contentSubtle,
      width: 176,
      lineHeight: 16
    });
    bodyNode.layoutAlign = "STRETCH";
    postit.appendChild(bodyNode);
    return postit;
  }
  function createDeviceBadge(emoji, label, bgColor) {
    const badge = createFrame({
      name: `Device - ${label}`,
      width: 1,
      height: 1,
      fills: solidFill(bgColor),
      cornerRadius: borderRadius.m,
      layoutMode: "HORIZONTAL",
      paddingTop: spacing.s,
      paddingBottom: spacing.s,
      paddingLeft: spacing.m,
      paddingRight: spacing.m,
      itemSpacing: spacing.s
    });
    badge.primaryAxisSizingMode = "AUTO";
    badge.counterAxisSizingMode = "AUTO";
    const emojiNode = createText({
      text: emoji,
      fontSize: 14,
      fontStyle: "Regular",
      color: colors.white
    });
    badge.appendChild(emojiNode);
    const labelNode = createText({
      text: label,
      fontSize: 14,
      fontStyle: "Bold",
      color: colors.white
    });
    badge.appendChild(labelNode);
    return badge;
  }
  function createLinkButton(category, label, bgColor) {
    const btn = createFrame({
      name: `Link - ${label}`,
      width: 1,
      height: 1,
      fills: solidFill(bgColor),
      cornerRadius: borderRadius.m,
      layoutMode: "VERTICAL",
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      paddingLeft: spacing.l,
      paddingRight: spacing.l,
      itemSpacing: spacing.xs
    });
    btn.primaryAxisSizingMode = "AUTO";
    btn.counterAxisSizingMode = "AUTO";
    const catNode = createText({
      text: category.toUpperCase(),
      fontSize: 9,
      fontStyle: "Bold",
      color: colors.white,
      letterSpacing: 1
    });
    catNode.opacity = 0.7;
    btn.appendChild(catNode);
    const labelNode = createText({
      text: label,
      fontSize: 14,
      fontStyle: "Bold",
      color: colors.white
    });
    btn.appendChild(labelNode);
    return btn;
  }
  function createScreenComponent(title, status, statusColor) {
    const screen = createFrame({
      name: `Screen - ${title}`,
      width: 180,
      height: 1,
      fills: solidFill(colors.backgroundDefault),
      cornerRadius: borderRadius.s,
      layoutMode: "VERTICAL",
      paddingTop: spacing.s,
      paddingBottom: spacing.s,
      paddingLeft: spacing.s,
      paddingRight: spacing.s,
      itemSpacing: spacing.xs
    });
    screen.primaryAxisSizingMode = "AUTO";
    addShadow(screen);
    const statusRow = createFrame({
      name: "Status",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.xs,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    statusRow.primaryAxisSizingMode = "AUTO";
    statusRow.counterAxisSizingMode = "AUTO";
    statusRow.counterAxisAlignItems = "CENTER";
    const dot = createRect({
      name: "Dot",
      width: 8,
      height: 8,
      fills: solidFill(statusColor),
      cornerRadius: 100
    });
    statusRow.appendChild(dot);
    const statusText = createText({
      text: status,
      fontSize: 9,
      fontStyle: "Bold",
      color: statusColor,
      letterSpacing: 0.5
    });
    statusRow.appendChild(statusText);
    screen.appendChild(statusRow);
    const titleNode = createText({
      text: title,
      fontSize: 12,
      fontStyle: "Medium",
      color: colors.contentDefault,
      width: 164,
      lineHeight: 16
    });
    titleNode.layoutAlign = "STRETCH";
    screen.appendChild(titleNode);
    return screen;
  }
  var HIGHLIGHTS = [
    { label: "What has changed?", bg: "#FEF3C7", text: "#92400E" },
    { label: "What\u2019s relevant about accessibility?", bg: "#DBEAFE", text: "#1E40AF" },
    { label: "What needs building?", bg: "#FEE2E2", text: "#991B1B" },
    { label: "What changed?", bg: "#E0E7FF", text: "#3730A3" },
    { label: "What\u2019s new?", bg: "#D1FAE5", text: "#065F46" },
    { label: "What\u2019s up?", bg: "#FCE7F3", text: "#9D174D" }
  ];
  var SCREEN_EXAMPLES = [
    { title: "Title of the screen", status: "WIP", color: colors.statusWip },
    { title: "Title of the screen", status: "READY", color: colors.success },
    { title: "Title of the screen", status: "REVIEW", color: colors.brand }
  ];
  var DEVICES = [
    { emoji: "\u{1F5A5}\uFE0F", label: "Desktop", color: "#1E40AF" },
    { emoji: "\u{1F4F1}", label: "Tablet", color: "#B45309" },
    { emoji: "\u{1F4F1}", label: "Mobile", color: "#065F46" },
    { emoji: "\u{1F534}", label: "IOS", color: "#121212" },
    { emoji: "\u{1F7E3}", label: "Android", color: "#5B21B6" }
  ];
  var LINKS = [
    { cat: "Documentation", label: "Add link here", color: "#1E40AF" },
    { cat: "Workshop", label: "Add link here", color: "#B45309" },
    { cat: "Documentation", label: "Guidelines", color: "#065F46" },
    { cat: "Figma File", label: "Add link here", color: "#7C3AED" },
    { cat: "Figma File", label: "Play prototype", color: "#DC2626" },
    { cat: "FigJam File", label: "Add link here", color: "#121212" },
    { cat: "Research", label: "Add link here", color: "#059669" },
    { cat: "Link", label: "Add link here", color: "#6B7280" },
    { cat: "Figma Make", label: "Play prototype", color: "#7C3AED" }
  ];
  function createToolkitSectionFrame(name) {
    const section = createFrame({
      name,
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      itemSpacing: spacing.m,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    section.primaryAxisSizingMode = "AUTO";
    section.counterAxisSizingMode = "AUTO";
    return section;
  }
  function createWrapRow(name) {
    const row = createFrame({
      name,
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing.s,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    row.primaryAxisSizingMode = "AUTO";
    row.counterAxisSizingMode = "AUTO";
    row.layoutWrap = "WRAP";
    return row;
  }
  function buildToolkitContent(parent) {
    const highlightsSection = createToolkitSectionFrame("Highlights Section");
    const highlightsLabel = createText({
      text: "J\u2019ai besoin de d\xE9crire une nouveaut\xE9, un changement, une r\xE8gle, un comportement...",
      fontSize: 13,
      fontStyle: "Medium",
      color: colors.contentDefault
    });
    highlightsSection.appendChild(highlightsLabel);
    const highlightsRow = createWrapRow("Highlights");
    for (const h of HIGHLIGHTS) {
      highlightsRow.appendChild(
        createHighlightChip(h.label, hexToRgb2(h.bg), hexToRgb2(h.text))
      );
    }
    highlightsSection.appendChild(highlightsRow);
    parent.appendChild(highlightsSection);
    const postitsSection = createToolkitSectionFrame("Post-its Section");
    const postitsLabel = createText({
      text: "J\u2019ai besoin d\u2019ajouter des notes sur les parcours",
      fontSize: 13,
      fontStyle: "Medium",
      color: colors.contentDefault
    });
    postitsSection.appendChild(postitsLabel);
    const postit = createPostIt(
      "Title here",
      "Votre green note ici. Use different post-it colors to highlight different topics or areas.",
      hexToRgb2("#FEF9C3")
    );
    postitsSection.appendChild(postit);
    parent.appendChild(postitsSection);
    const quoteSection = createToolkitSectionFrame("Quote Section");
    const quoteLabel = createText({
      text: "J\u2019ai besoin d\u2019illustrer mon flow / \xE9cran avec un verbatim",
      fontSize: 13,
      fontStyle: "Medium",
      color: colors.contentDefault
    });
    quoteSection.appendChild(quoteLabel);
    const quoteBox = createFrame({
      name: "Quote",
      width: 280,
      height: 1,
      fills: solidFill(colors.backgroundDefault),
      cornerRadius: borderRadius.m,
      layoutMode: "HORIZONTAL",
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      paddingLeft: spacing.l,
      paddingRight: spacing.l,
      itemSpacing: spacing.s
    });
    quoteBox.primaryAxisSizingMode = "FIXED";
    quoteBox.counterAxisSizingMode = "AUTO";
    addShadow(quoteBox);
    const quoteIcon = createText({
      text: "\u{1F4AC}",
      fontSize: 16,
      fontStyle: "Regular",
      color: colors.contentDefault
    });
    quoteBox.appendChild(quoteIcon);
    const quoteText = createText({
      text: "\xAB Verbatim utilisateur ici \xBB",
      fontSize: 13,
      fontStyle: "Regular",
      color: colors.contentSubtle,
      width: 220,
      lineHeight: 20
    });
    quoteText.layoutAlign = "STRETCH";
    quoteBox.appendChild(quoteText);
    quoteSection.appendChild(quoteBox);
    parent.appendChild(quoteSection);
    const screensSection = createToolkitSectionFrame("Screens Section");
    const screensLabel = createText({
      text: "J\u2019ai besoin de d\xE9crire globalement un \xE9cran",
      fontSize: 13,
      fontStyle: "Medium",
      color: colors.contentDefault
    });
    screensSection.appendChild(screensLabel);
    const screensGrid = createWrapRow("Screens Grid");
    for (const s of SCREEN_EXAMPLES) {
      screensGrid.appendChild(createScreenComponent(s.title, s.status, s.color));
    }
    screensSection.appendChild(screensGrid);
    parent.appendChild(screensSection);
    const deviceSection = createToolkitSectionFrame("Device Section");
    const deviceLabel = createText({
      text: "J\u2019ai besoin de pr\xE9ciser le device d\u2019usage",
      fontSize: 13,
      fontStyle: "Medium",
      color: colors.contentDefault
    });
    deviceSection.appendChild(deviceLabel);
    const deviceRow = createWrapRow("Devices");
    for (const d of DEVICES) {
      deviceRow.appendChild(createDeviceBadge(d.emoji, d.label, hexToRgb2(d.color)));
    }
    deviceSection.appendChild(deviceRow);
    parent.appendChild(deviceSection);
    const linksSection = createToolkitSectionFrame("Links Section");
    const linksLabel = createText({
      text: "Ajouter des liens vers vos documents, ateliers, prototypes...",
      fontSize: 13,
      fontStyle: "Medium",
      color: colors.contentDefault
    });
    linksSection.appendChild(linksLabel);
    const linksGrid = createWrapRow("Links Grid");
    for (const l of LINKS) {
      linksGrid.appendChild(createLinkButton(l.cat, l.label, hexToRgb2(l.color)));
    }
    linksSection.appendChild(linksGrid);
    parent.appendChild(linksSection);
  }

  // src/features/starter-kit/builders/help-builder.ts
  async function buildHelp(page) {
    const sectionWidth = 2770;
    const sectionPadding = spacing["4xl"];
    const contentWidth = sectionWidth - sectionPadding * 2;
    const section = createFrame({
      name: "Comment bien organiser son delivery",
      width: sectionWidth,
      height: 1,
      fills: solidFill(colors.helpBackground),
      cornerRadius: borderRadius.xl,
      layoutMode: "VERTICAL",
      paddingTop: sectionPadding,
      paddingBottom: sectionPadding,
      paddingLeft: sectionPadding,
      paddingRight: sectionPadding,
      itemSpacing: spacing["3xl"]
    });
    section.primaryAxisSizingMode = "AUTO";
    const mainTitle = createText({
      text: "Des exemples pour bien s\u2019organiser",
      fontSize: 36,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: contentWidth,
      lineHeight: 44
    });
    mainTitle.layoutAlign = "STRETCH";
    section.appendChild(mainTitle);
    const headersRow = createFrame({
      name: "Headers",
      width: contentWidth,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      itemSpacing: spacing["3xl"],
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    headersRow.primaryAxisSizingMode = "FIXED";
    headersRow.counterAxisSizingMode = "AUTO";
    headersRow.layoutAlign = "STRETCH";
    const headerTitles = [
      "Documenter un user flow + lier un prototype",
      "D\xE9cliner un \xE9cran",
      "Sp\xE9cifier un \xE9cran",
      "Votre toolbox",
      "Documenter ses composants locaux"
    ];
    for (const h of headerTitles) {
      const headerText = createText({
        text: h,
        fontSize: 16,
        fontStyle: "Bold",
        color: colors.contentDefault,
        lineHeight: 22
      });
      headersRow.appendChild(headerText);
    }
    section.appendChild(headersRow);
    const toolkitWidth = contentWidth;
    const toolkit = createFrame({
      name: "Toolkit pour annoter ses parcours / \xE9crans",
      width: toolkitWidth,
      height: 1,
      fills: solidFill(colors.helpBackgroundDark),
      cornerRadius: borderRadius.l,
      layoutMode: "VERTICAL",
      paddingTop: spacing["2xl"],
      paddingBottom: spacing["2xl"],
      paddingLeft: spacing["2xl"],
      paddingRight: spacing["2xl"],
      itemSpacing: spacing["2xl"]
    });
    toolkit.primaryAxisSizingMode = "AUTO";
    const toolkitHeader = createText({
      text: "Toolkit pour annoter ses parcours / \xE9crans",
      fontSize: 16,
      fontStyle: "Bold",
      color: colors.white,
      width: toolkitWidth - spacing["2xl"] * 2,
      lineHeight: 22
    });
    toolkitHeader.layoutAlign = "STRETCH";
    toolkit.appendChild(toolkitHeader);
    const toolkitContent = createFrame({
      name: "Toolkit Content",
      width: toolkitWidth - spacing["2xl"] * 2,
      height: 1,
      fills: solidFill(colors.helpBackground),
      cornerRadius: borderRadius.m,
      layoutMode: "VERTICAL",
      paddingTop: spacing["2xl"],
      paddingBottom: spacing["2xl"],
      paddingLeft: spacing["2xl"],
      paddingRight: spacing["2xl"],
      itemSpacing: spacing["2xl"]
    });
    toolkitContent.primaryAxisSizingMode = "AUTO";
    toolkitContent.layoutAlign = "STRETCH";
    buildToolkitContent(toolkitContent);
    toolkit.appendChild(toolkitContent);
    section.appendChild(toolkit);
    const warningText = createText({
      text: "\u26A0\uFE0F pensez \xE0 bien mettre les statuts des flows, \xE9crans et annotations \xE0 jour, au fur et \xE0 mesure",
      fontSize: 20,
      fontStyle: "Medium",
      color: colors.contentDefault,
      width: contentWidth,
      lineHeight: 28
    });
    warningText.layoutAlign = "STRETCH";
    section.appendChild(warningText);
    page.appendChild(section);
    const cardWidth = 880;
    const cardPadding = spacing["4xl"];
    const cardContentWidth = cardWidth - cardPadding * 2;
    const card = createFrame({
      name: "Help Guide",
      width: cardWidth,
      height: 1,
      fills: solidFill(colors.backgroundDefault),
      cornerRadius: borderRadius.l,
      layoutMode: "VERTICAL",
      paddingTop: cardPadding,
      paddingBottom: cardPadding,
      paddingLeft: cardPadding,
      paddingRight: cardPadding,
      itemSpacing: spacing["2xl"]
    });
    card.primaryAxisSizingMode = "AUTO";
    card.x = 0;
    card.y = section.height + spacing["4xl"];
    addShadow(card);
    const cardTitle = createText({
      text: HELP_CONTENT.title,
      fontSize: 28,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: cardContentWidth,
      lineHeight: 36
    });
    cardTitle.layoutAlign = "STRETCH";
    card.appendChild(cardTitle);
    const divider = createFrame({
      name: "Divider",
      width: cardContentWidth,
      height: 1,
      fills: solidFill(colors.borderDefault)
    });
    divider.layoutAlign = "STRETCH";
    card.appendChild(divider);
    for (const helpSection of HELP_CONTENT.sections) {
      const sectionFrame = createFrame({
        name: `Help - ${helpSection.heading}`,
        width: cardContentWidth,
        height: 1,
        fills: [],
        layoutMode: "VERTICAL",
        itemSpacing: spacing.s,
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
      });
      sectionFrame.primaryAxisSizingMode = "AUTO";
      sectionFrame.counterAxisSizingMode = "FIXED";
      sectionFrame.layoutAlign = "STRETCH";
      const heading = createText({
        text: helpSection.heading,
        fontSize: 18,
        fontStyle: "Bold",
        color: colors.contentDefault,
        width: cardContentWidth,
        lineHeight: 26
      });
      heading.layoutAlign = "STRETCH";
      sectionFrame.appendChild(heading);
      const body = createText({
        text: helpSection.body,
        fontSize: 14,
        fontStyle: "Regular",
        color: colors.contentSubtle,
        width: cardContentWidth,
        lineHeight: 22
      });
      body.layoutAlign = "STRETCH";
      sectionFrame.appendChild(body);
      card.appendChild(sectionFrame);
    }
    const footer = createText({
      text: "Ce guide fait partie du Marcel Design System. Pour toute question, contacte l\u2019\xE9quipe DesignOps.",
      fontSize: 12,
      fontStyle: "Regular",
      color: colors.contentSubtler,
      width: cardContentWidth,
      lineHeight: 18
    });
    footer.layoutAlign = "STRETCH";
    card.appendChild(footer);
    page.appendChild(card);
  }

  // src/features/starter-kit/builders/archives-builder.ts
  async function buildArchives(page) {
    const frame = createFrame({
      name: "Archives",
      width: 3244,
      height: 1,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      layoutMode: "VERTICAL",
      paddingTop: 254,
      paddingBottom: spacing["4xl"],
      paddingLeft: 222,
      paddingRight: 222,
      itemSpacing: 48
    });
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "FIXED";
    const titleFrame = createFrame({
      name: "Title",
      width: 2800,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    titleFrame.primaryAxisSizingMode = "AUTO";
    titleFrame.counterAxisSizingMode = "FIXED";
    titleFrame.layoutAlign = "STRETCH";
    const title = createText({
      text: "\u{1F578}\uFE0F Bienvenue dans les archives",
      fontSize: 64,
      fontStyle: "Bold",
      color: colors.contentDefault,
      width: 2800,
      lineHeight: 80
    });
    title.layoutAlign = "STRETCH";
    titleFrame.appendChild(title);
    frame.appendChild(titleFrame);
    const tipsFrame = createFrame({
      name: "Tips",
      width: 2290,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 255,
      paddingRight: 0,
      itemSpacing: 48
    });
    tipsFrame.primaryAxisSizingMode = "AUTO";
    tipsFrame.counterAxisSizingMode = "FIXED";
    const tips = [
      "Organisez vos archives par section",
      "Expliquez rapidement pourquoi \xE7a a \xE9t\xE9 plac\xE9 ici",
      "Faites du tri, des fois il faut savoir dire au revoir \u{1F5D1}\uFE0F"
    ];
    for (const tip of tips) {
      const tipText = createText({
        text: tip,
        fontSize: 36,
        fontStyle: "Bold",
        color: colors.contentDefault,
        width: 2290,
        lineHeight: 44
      });
      tipText.layoutAlign = "STRETCH";
      tipsFrame.appendChild(tipText);
    }
    frame.appendChild(tipsFrame);
    page.appendChild(frame);
  }

  // src/features/starter-kit/builders/local-components-builder.ts
  function hex(h) {
    const c2 = h.replace("#", "");
    return {
      r: parseInt(c2.substring(0, 2), 16) / 255,
      g: parseInt(c2.substring(2, 4), 16) / 255,
      b: parseInt(c2.substring(4, 6), 16) / 255
    };
  }
  function createComponentFrame(subtitleText, bodyText, componentNameText, width) {
    const frame = createFrame({
      name: "Component Frame",
      width,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48,
      itemSpacing: 48
    });
    frame.primaryAxisSizingMode = "AUTO";
    frame.counterAxisSizingMode = "FIXED";
    frame.layoutAlign = "STRETCH";
    const subtitle = createText({
      text: subtitleText,
      fontSize: 32,
      fontStyle: "Bold",
      color: colors.contentDefault,
      lineHeight: 40
    });
    frame.appendChild(subtitle);
    const body = createText({
      text: bodyText,
      fontSize: 20,
      fontStyle: "Bold",
      color: hex("#696969"),
      lineHeight: 24
    });
    frame.appendChild(body);
    const container = createFrame({
      name: "Container",
      width: 1,
      height: 128,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48
    });
    container.primaryAxisSizingMode = "FIXED";
    container.counterAxisSizingMode = "FIXED";
    container.layoutAlign = "STRETCH";
    const compName = createText({
      text: componentNameText,
      fontSize: 24,
      fontStyle: "Bold",
      color: hex("#454545"),
      lineHeight: 32
    });
    container.appendChild(compName);
    frame.appendChild(container);
    return frame;
  }
  async function buildLocalComponents(page) {
    const cardInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsComponentCard,
      page,
      { x: -1258, y: -8023 }
    );
    if (!cardInstance) {
      const placeholder = createFrame({
        name: "[DS] Component Card",
        width: 1440,
        height: 716,
        x: -1258,
        y: -8023,
        fills: solidFill({ r: 1, g: 1, b: 1 }),
        cornerRadius: borderRadius.m,
        layoutMode: "VERTICAL",
        paddingTop: spacing["4xl"],
        paddingBottom: spacing["4xl"],
        paddingLeft: spacing["4xl"],
        paddingRight: spacing["4xl"],
        itemSpacing: spacing["4xl"]
      });
      placeholder.primaryAxisSizingMode = "AUTO";
      const label = createText({
        text: "[DS] Component Card\n\nCe composant sera import\xE9 depuis la librairie DS Toolkit.",
        fontSize: 24,
        fontStyle: "Regular",
        color: colors.contentSubtle,
        width: 1340,
        lineHeight: 32
      });
      placeholder.appendChild(label);
      page.appendChild(placeholder);
    }
    const sectionWidth = 1440;
    const section = createFrame({
      name: "Local Components - Titre du composant",
      width: sectionWidth,
      height: 1,
      x: 300,
      y: -8023,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: 0
    });
    section.primaryAxisSizingMode = "AUTO";
    section.counterAxisSizingMode = "FIXED";
    const headerInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsHeaderBlackL,
      section
    );
    if (!headerInstance) {
      const header = createFrame({
        name: "[DS] Header",
        width: sectionWidth,
        height: 232,
        fills: solidFill(hex("#121212")),
        cornerRadius: 24,
        layoutMode: "HORIZONTAL",
        paddingTop: 80,
        paddingBottom: 80,
        paddingLeft: 80,
        paddingRight: 80,
        itemSpacing: 16
      });
      header.primaryAxisSizingMode = "FIXED";
      header.counterAxisSizingMode = "FIXED";
      header.counterAxisAlignItems = "CENTER";
      header.layoutAlign = "STRETCH";
      const titleText = createText({
        text: "Local Components \u2013 [Titre du composant]",
        fontSize: 56,
        fontStyle: "Bold",
        color: { r: 1, g: 1, b: 1 },
        lineHeight: 72
      });
      header.appendChild(titleText);
      section.appendChild(header);
    }
    const content = createFrame({
      name: "Atoms",
      width: sectionWidth,
      height: 1,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      layoutMode: "VERTICAL",
      paddingTop: 100,
      paddingBottom: 100,
      paddingLeft: 100,
      paddingRight: 100,
      itemSpacing: 48
    });
    content.primaryAxisSizingMode = "AUTO";
    content.counterAxisSizingMode = "FIXED";
    content.layoutAlign = "STRETCH";
    const contentWidth = sectionWidth - 200;
    const cf1 = createComponentFrame(
      "Component",
      "Components are elements you can reuse across your designs. They help to create and manage consistent designs across projects.",
      "Component Title",
      contentWidth
    );
    content.appendChild(cf1);
    const signFrame = createFrame({
      name: "Sign",
      width: contentWidth,
      height: 40,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: 0
    });
    signFrame.primaryAxisSizingMode = "FIXED";
    signFrame.counterAxisSizingMode = "FIXED";
    signFrame.layoutAlign = "STRETCH";
    signFrame.primaryAxisAlignItems = "CENTER";
    signFrame.counterAxisAlignItems = "CENTER";
    const signText = createText({
      text: "\u2193 Hide from publishing \u2193",
      fontSize: 20,
      fontStyle: "Regular",
      color: hex("#DC2626"),
      lineHeight: 40
    });
    signFrame.appendChild(signText);
    content.appendChild(signFrame);
    const cf2 = createComponentFrame(
      "Assets",
      "Use in component",
      "Properties",
      contentWidth
    );
    content.appendChild(cf2);
    section.appendChild(content);
    page.appendChild(section);
  }

  // src/features/starter-kit/builders/library-cover-builder.ts
  function hex2(h) {
    const c2 = h.replace("#", "");
    return {
      r: parseInt(c2.substring(0, 2), 16) / 255,
      g: parseInt(c2.substring(2, 4), 16) / 255,
      b: parseInt(c2.substring(4, 6), 16) / 255
    };
  }
  var purple = hex2("#8B5CF6");
  var orange = hex2("#F97316");
  var white = { r: 1, g: 1, b: 1 };
  function createBadge(text) {
    const badge = createFrame({
      name: `Badge - ${text}`,
      width: 1,
      height: 1,
      fills: solidFill(white),
      cornerRadius: borderRadius.xl,
      layoutMode: "HORIZONTAL",
      paddingTop: 6,
      paddingBottom: 6,
      paddingLeft: 14,
      paddingRight: 14
    });
    badge.primaryAxisSizingMode = "AUTO";
    badge.counterAxisSizingMode = "AUTO";
    const label = createText({
      text,
      fontSize: 14,
      fontStyle: "Medium",
      color: { r: 0.07, g: 0.07, b: 0.07 }
    });
    badge.appendChild(label);
    return badge;
  }
  async function buildLibraryCover(page) {
    const instance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsLibraryCoverDomaine,
      page
    );
    if (instance) {
      await insertTrackingPixel(page, instance);
      return instance;
    }
    const cover = createFrame({
      name: "Library Cover",
      width: 1600,
      height: 960,
      fills: [],
      cornerRadius: borderRadius.l,
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: 0,
      clipsContent: true
    });
    cover.primaryAxisSizingMode = "FIXED";
    cover.counterAxisSizingMode = "FIXED";
    addShadow(cover);
    cover.fills = [
      {
        type: "GRADIENT_LINEAR",
        gradientTransform: [
          [0.7, 0.7, 0],
          [-0.7, 0.7, 0.3]
        ],
        gradientStops: [
          { position: 0, color: { r: purple.r, g: purple.g, b: purple.b, a: 1 } },
          { position: 1, color: { r: orange.r, g: orange.g, b: orange.b, a: 1 } }
        ]
      }
    ];
    const topBar = createFrame({
      name: "Top Bar",
      width: 1600,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: spacing["3xl"],
      paddingBottom: 0,
      paddingLeft: spacing["4xl"],
      paddingRight: spacing["4xl"],
      itemSpacing: spacing.l
    });
    topBar.primaryAxisSizingMode = "FIXED";
    topBar.counterAxisSizingMode = "AUTO";
    topBar.layoutAlign = "STRETCH";
    topBar.primaryAxisAlignItems = "SPACE_BETWEEN";
    topBar.counterAxisAlignItems = "CENTER";
    const localLibLabel = createText({
      text: "Local Library",
      fontSize: 20,
      fontStyle: "Bold",
      color: white
    });
    topBar.appendChild(localLibLabel);
    const badgesRow = createFrame({
      name: "Badges",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: spacing.s
    });
    badgesRow.primaryAxisSizingMode = "AUTO";
    badgesRow.counterAxisSizingMode = "AUTO";
    const flagBadge = createBadge("\u{1F1EB}\u{1F1F7}");
    const webBadge = createBadge("Web \u{1F5A5}");
    const appBadge = createBadge("App \u{1F4F1}");
    badgesRow.appendChild(flagBadge);
    badgesRow.appendChild(webBadge);
    badgesRow.appendChild(appBadge);
    topBar.appendChild(badgesRow);
    cover.appendChild(topBar);
    const centerArea = createFrame({
      name: "Center Content",
      width: 1600,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: spacing["4xl"],
      paddingRight: spacing["4xl"],
      itemSpacing: spacing.xl
    });
    centerArea.layoutAlign = "STRETCH";
    centerArea.layoutGrow = 1;
    centerArea.primaryAxisSizingMode = "FIXED";
    centerArea.counterAxisSizingMode = "FIXED";
    centerArea.primaryAxisAlignItems = "CENTER";
    centerArea.counterAxisAlignItems = "MIN";
    const title = createText({
      text: "[STARTER] LIBRARY NAME",
      fontSize: 56,
      fontStyle: "Bold",
      color: white,
      width: 1504,
      lineHeight: 64
    });
    title.layoutAlign = "STRETCH";
    centerArea.appendChild(title);
    const subtitle = createText({
      text: "Please duplicate me, I'm a starter kit that will save you time and bring consistency to another level",
      fontSize: 20,
      fontStyle: "Regular",
      color: white,
      width: 960,
      lineHeight: 30,
      opacity: 0.7
    });
    subtitle.layoutAlign = "INHERIT";
    centerArea.appendChild(subtitle);
    cover.appendChild(centerArea);
    const bottomBar = createFrame({
      name: "Bottom Bar",
      width: 1600,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: 0,
      paddingBottom: spacing["3xl"],
      paddingLeft: spacing["4xl"],
      paddingRight: spacing["4xl"],
      itemSpacing: spacing.l
    });
    bottomBar.primaryAxisSizingMode = "FIXED";
    bottomBar.counterAxisSizingMode = "AUTO";
    bottomBar.layoutAlign = "STRETCH";
    bottomBar.primaryAxisAlignItems = "SPACE_BETWEEN";
    bottomBar.counterAxisAlignItems = "MAX";
    const brandingBlock = createFrame({
      name: "Branding",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: spacing.xs
    });
    brandingBlock.primaryAxisSizingMode = "AUTO";
    brandingBlock.counterAxisSizingMode = "AUTO";
    const marcelText = createText({
      text: "marcel",
      fontSize: 24,
      fontStyle: "Bold",
      color: white
    });
    brandingBlock.appendChild(marcelText);
    const dsLabel = createText({
      text: "CARREFOUR DESIGN SYSTEM",
      fontSize: 11,
      fontStyle: "Medium",
      color: white,
      letterSpacing: 2,
      opacity: 0.6
    });
    brandingBlock.appendChild(dsLabel);
    bottomBar.appendChild(brandingBlock);
    const logoFrame = createFrame({
      name: "Carrefour Logo",
      width: 48,
      height: 48,
      fills: [],
      cornerRadius: borderRadius.rounded,
      layoutMode: "HORIZONTAL"
    });
    logoFrame.primaryAxisSizingMode = "FIXED";
    logoFrame.counterAxisSizingMode = "FIXED";
    logoFrame.primaryAxisAlignItems = "CENTER";
    logoFrame.counterAxisAlignItems = "CENTER";
    const logoC = createText({
      text: "C",
      fontSize: 32,
      fontStyle: "Bold",
      color: white
    });
    logoFrame.appendChild(logoC);
    bottomBar.appendChild(logoFrame);
    cover.appendChild(bottomBar);
    page.appendChild(cover);
    await insertTrackingPixel(page, cover);
    return cover;
  }

  // src/features/starter-kit/builders/readme-builder.ts
  var CHECKLIST_SECTIONS = [
    {
      heading: "Starter",
      items: [
        "Duplicate the **Figma library starter kit**",
        "Name your libraries using the **following convention [DS][DEVICE][TEAM] Name** (ex : [DS][APP][RETAIL FR] Product Listing)",
        "Update my cover **with all the necessary informations** (Library name, country, device)",
        "Update the \u{1F469}\u200D\u{1F4BB} **Contributors** page with the people working on the library"
      ]
    },
    {
      heading: "Components organization",
      items: [
        "Name it properly and **the same in designers' libraries as developers'** ones. ( https://component.gallery / https://designsystems.surf/)",
        "Complete the **[DS] Description Component Card** description (Use description from other design system)",
        "Change the **status** in the **[DS] Description Component Card** description (Use description from other design system)",
        "Organize components in **dedicated sections** (atoms, components, specs, usecase)",
        "I'v **annotated my variants / components** with [DS] Toolkit libraries",
        "Generate **EightShapes Specs** with the Figma Plugin and place it the the specs section"
      ]
    },
    {
      heading: "Documentation",
      items: [
        "Add Link to **Zeroheight Documentation** in the Component Description (If it exists)",
        "Add Link to **Storybook** (If it exists)",
        "Display **Use Case and Examples**",
        "Display **UX Writing rules**"
      ]
    }
  ];
  function createCheckboxRow(text, width) {
    const row = createFrame({
      name: "Checkbox Row",
      width,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: spacing.l
    });
    row.primaryAxisSizingMode = "FIXED";
    row.counterAxisSizingMode = "AUTO";
    row.layoutAlign = "STRETCH";
    row.counterAxisAlignItems = "MIN";
    const checkbox = createFrame({
      name: "Checkbox",
      width: 32,
      height: 32,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      cornerRadius: 4
    });
    checkbox.strokes = solidFill({ r: 0.85, g: 0.85, b: 0.85 });
    checkbox.strokeWeight = 1.333;
    row.appendChild(checkbox);
    const cleanText = text.replace(/\*\*/g, "");
    const label = createText({
      text: cleanText,
      fontSize: 24,
      fontStyle: "Regular",
      color: colors.contentDefault,
      width: width - 32 - spacing.l,
      lineHeight: 32
    });
    label.layoutAlign = "INHERIT";
    row.appendChild(label);
    return row;
  }
  function createSectionHeader(text, width) {
    const header = createFrame({
      name: "Section Header",
      width,
      height: 1,
      fills: solidFill({ r: 0.957, g: 0.957, b: 0.957 }),
      // #f4f4f4
      cornerRadius: borderRadius.m,
      layoutMode: "VERTICAL",
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      paddingLeft: spacing.m,
      paddingRight: spacing.m
    });
    header.primaryAxisSizingMode = "AUTO";
    header.counterAxisSizingMode = "FIXED";
    header.layoutAlign = "STRETCH";
    header.clipsContent = true;
    const label = createText({
      text,
      fontSize: 24,
      fontStyle: "Bold",
      color: { r: 0.22, g: 0.235, b: 0.255 },
      // #383c41
      lineHeight: 32
    });
    header.appendChild(label);
    return header;
  }
  async function buildReadme(page) {
    const instance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.checklistFigmaLibraries,
      page
    );
    if (instance) {
      return;
    }
    const cardWidth = 1386;
    const card = createFrame({
      name: "Checklist",
      width: cardWidth,
      height: 1,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      cornerRadius: borderRadius.m,
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: 0,
      clipsContent: true
    });
    card.primaryAxisSizingMode = "AUTO";
    card.strokes = solidFill({ r: 0.85, g: 0.85, b: 0.85 });
    card.strokeWeight = 1;
    const header = createFrame({
      name: "Title",
      width: cardWidth,
      height: 1,
      fills: solidFill({ r: 0.035, g: 0.439, b: 0.902 }),
      // #0970e6
      layoutMode: "HORIZONTAL",
      paddingTop: spacing["4xl"],
      paddingBottom: spacing["4xl"],
      paddingLeft: spacing["4xl"],
      paddingRight: spacing["4xl"],
      itemSpacing: spacing["4xl"]
    });
    header.primaryAxisSizingMode = "FIXED";
    header.counterAxisSizingMode = "AUTO";
    header.layoutAlign = "STRETCH";
    header.counterAxisAlignItems = "CENTER";
    header.primaryAxisAlignItems = "CENTER";
    const contentCol = createFrame({
      name: "Content",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: spacing.l
    });
    contentCol.primaryAxisSizingMode = "AUTO";
    contentCol.counterAxisSizingMode = "AUTO";
    const titleText = createText({
      text: "Figma Libraries",
      fontSize: 56,
      fontStyle: "Bold",
      color: { r: 1, g: 1, b: 1 },
      lineHeight: 64
    });
    contentCol.appendChild(titleText);
    const subtitleText = createText({
      text: "This checklist will help you to manage your local figma libraries",
      fontSize: 24,
      fontStyle: "Regular",
      color: { r: 1, g: 1, b: 1 },
      width: 856,
      lineHeight: 32
    });
    contentCol.appendChild(subtitleText);
    header.appendChild(contentCol);
    const marcelBrand = createText({
      text: "marcel",
      fontSize: 32,
      fontStyle: "Bold",
      color: { r: 1, g: 1, b: 1 }
    });
    header.appendChild(marcelBrand);
    card.appendChild(header);
    const body = createFrame({
      name: "Checklist",
      width: cardWidth,
      height: 1,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: spacing["4xl"],
      paddingBottom: spacing["4xl"],
      paddingLeft: spacing["4xl"],
      paddingRight: spacing["4xl"],
      itemSpacing: 24
    });
    body.primaryAxisSizingMode = "AUTO";
    body.counterAxisSizingMode = "FIXED";
    body.layoutAlign = "STRETCH";
    const contentWidth = cardWidth - spacing["4xl"] * 2;
    for (const section of CHECKLIST_SECTIONS) {
      const sectionHeader = createSectionHeader(section.heading, contentWidth);
      body.appendChild(sectionHeader);
      for (const item of section.items) {
        const row = createCheckboxRow(item, contentWidth);
        body.appendChild(row);
      }
    }
    card.appendChild(body);
    page.appendChild(card);
  }

  // src/features/starter-kit/builders/contributors-builder.ts
  async function buildContributors(_page) {
  }

  // src/features/starter-kit/builders/component-page-builder.ts
  var SECTIONS = [
    {
      name: "Atoms",
      subtitleText: "This is a subtitle",
      bodyText: "This is a body text",
      componentFrameCount: 5
    },
    {
      name: "Components",
      subtitleText: "This is a subtitle",
      bodyText: "This is a body text",
      componentFrameCount: 3
    },
    {
      name: "Specs",
      subtitleText: "This is a subtitle",
      bodyText: "This is a body text",
      componentFrameCount: 2
    },
    {
      name: "Usecases",
      subtitleText: "This is a subtitle",
      bodyText: "This is a body text",
      componentFrameCount: 0,
      subsections: [
        { name: "Do", color: "#15803D" },
        { name: "Avoid", color: "#CA8A04" },
        { name: "Dont", color: "#DC2626" },
        { name: "Information", color: "#2563EB" }
      ]
    },
    {
      name: "Deprecated",
      subtitleText: "",
      bodyText: "",
      componentFrameCount: 1
    }
  ];
  function hex3(h) {
    const c2 = h.replace("#", "");
    return {
      r: parseInt(c2.substring(0, 2), 16) / 255,
      g: parseInt(c2.substring(2, 4), 16) / 255,
      b: parseInt(c2.substring(4, 6), 16) / 255
    };
  }
  function createHeaderFallback(title, width) {
    const header = createFrame({
      name: "[DS] Header",
      width,
      height: 224,
      fills: solidFill(hex3("#121212")),
      cornerRadius: 24,
      layoutMode: "HORIZONTAL",
      paddingTop: 80,
      paddingBottom: 80,
      paddingLeft: 80,
      paddingRight: 80,
      itemSpacing: 16
    });
    header.primaryAxisSizingMode = "FIXED";
    header.counterAxisSizingMode = "FIXED";
    header.counterAxisAlignItems = "CENTER";
    header.layoutAlign = "STRETCH";
    const titleNode = createText({
      text: title,
      fontSize: 56,
      fontStyle: "Bold",
      color: { r: 1, g: 1, b: 1 },
      lineHeight: 72
    });
    header.appendChild(titleNode);
    return header;
  }
  function createComponentFrame2(width, containerHeight = 156) {
    const outer = createFrame({
      name: "Component Frame",
      width,
      height: 1,
      fills: solidFill(hex3("#F7F7F7")),
      cornerRadius: 24,
      layoutMode: "VERTICAL",
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48
    });
    outer.primaryAxisSizingMode = "AUTO";
    outer.counterAxisSizingMode = "FIXED";
    outer.layoutAlign = "STRETCH";
    const inner = createFrame({
      name: "Container",
      width: 1,
      height: 1,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      cornerRadius: 16,
      layoutMode: "VERTICAL",
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48,
      itemSpacing: 24
    });
    inner.primaryAxisSizingMode = "AUTO";
    inner.counterAxisSizingMode = "FIXED";
    inner.layoutAlign = "STRETCH";
    const nameLabel = createText({
      text: "This is a component name",
      fontSize: 24,
      fontStyle: "Bold",
      color: hex3("#454545"),
      lineHeight: 32
    });
    inner.appendChild(nameLabel);
    const sep = createFrame({
      name: "separator",
      width: 1,
      height: 1,
      fills: solidFill(hex3("#E5E5E5"))
    });
    sep.layoutAlign = "STRETCH";
    inner.appendChild(sep);
    const container = createFrame({
      name: "Container",
      width: 1,
      height: containerHeight,
      fills: []
    });
    container.layoutAlign = "STRETCH";
    inner.appendChild(container);
    outer.appendChild(inner);
    return outer;
  }
  function createUsecaseSubsection(name, borderColor, width) {
    const frame = createFrame({
      name,
      width,
      height: 224,
      fills: [],
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "FIXED";
    frame.layoutAlign = "STRETCH";
    const topBorder = createFrame({
      name: "Border",
      width,
      height: 4,
      fills: solidFill(hex3(borderColor))
    });
    topBorder.layoutAlign = "STRETCH";
    frame.appendChild(topBorder);
    const inner = createFrame({
      name: "Container",
      width: 1,
      height: 1,
      fills: [],
      layoutMode: "HORIZONTAL",
      paddingTop: 48,
      paddingBottom: 48,
      paddingLeft: 48,
      paddingRight: 48
    });
    inner.primaryAxisSizingMode = "FIXED";
    inner.counterAxisSizingMode = "AUTO";
    inner.layoutAlign = "STRETCH";
    inner.primaryAxisAlignItems = "CENTER";
    inner.counterAxisAlignItems = "CENTER";
    const label = createText({
      text: `${name} component`,
      fontSize: 24,
      fontStyle: "Bold",
      color: hex3("#454545"),
      lineHeight: 32
    });
    inner.appendChild(label);
    frame.appendChild(inner);
    return frame;
  }
  async function buildSection(sectionDef, page, xOffset) {
    const sectionWidth = sectionDef.name === "Specs" ? 1472 : 1440;
    const section = createFrame({
      name: sectionDef.name,
      width: sectionWidth,
      height: 1,
      x: xOffset,
      y: -1624,
      fills: solidFill(hex3("#F5FAFF")),
      layoutMode: "VERTICAL",
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: 0
    });
    section.primaryAxisSizingMode = "AUTO";
    section.counterAxisSizingMode = "FIXED";
    const headerInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsHeaderBlackL,
      section
    );
    if (!headerInstance) {
      const headerFallback = createHeaderFallback(sectionDef.name, sectionWidth);
      section.appendChild(headerFallback);
    }
    const content = createFrame({
      name: sectionDef.name,
      width: sectionWidth,
      height: 1,
      fills: solidFill({ r: 1, g: 1, b: 1 }),
      layoutMode: "VERTICAL",
      paddingTop: 100,
      paddingBottom: 100,
      paddingLeft: 100,
      paddingRight: 100,
      itemSpacing: 48
    });
    content.primaryAxisSizingMode = "AUTO";
    content.counterAxisSizingMode = "FIXED";
    content.layoutAlign = "STRETCH";
    if (sectionDef.subtitleText) {
      const subtitleInstance = await importAndCreateInstance(
        DS_COMPONENT_KEYS.dsSubtitle,
        content
      );
      if (!subtitleInstance) {
        const subtitle = createText({
          text: sectionDef.subtitleText,
          fontSize: 32,
          fontStyle: "Bold",
          color: colors.contentDefault,
          lineHeight: 40
        });
        subtitle.layoutAlign = "STRETCH";
        content.appendChild(subtitle);
      }
    }
    if (sectionDef.bodyText) {
      const bodyInstance = await importAndCreateInstance(
        DS_COMPONENT_KEYS.dsBody,
        content
      );
      if (!bodyInstance) {
        const body = createText({
          text: sectionDef.bodyText,
          fontSize: 20,
          fontStyle: "Bold",
          color: hex3("#696969"),
          lineHeight: 24
        });
        body.layoutAlign = "STRETCH";
        content.appendChild(body);
      }
    }
    if (sectionDef.subsections) {
      for (const sub of sectionDef.subsections) {
        const subsection = createUsecaseSubsection(sub.name, sub.color, sectionWidth - 200);
        content.appendChild(subsection);
      }
    }
    for (let i = 0; i < sectionDef.componentFrameCount; i++) {
      const cf = createComponentFrame2(sectionWidth - 200);
      content.appendChild(cf);
    }
    section.appendChild(content);
    page.appendChild(section);
  }
  async function buildComponentPage(page) {
    const cardInstance = await importAndCreateInstance(
      DS_COMPONENT_KEYS.dsComponentCard,
      page,
      { x: -4566, y: -1624 }
    );
    if (!cardInstance) {
      const placeholder = createFrame({
        name: "[DS] Component Card",
        width: 1440,
        height: 977,
        x: -4566,
        y: -1624,
        fills: solidFill({ r: 1, g: 1, b: 1 }),
        cornerRadius: borderRadius.m,
        layoutMode: "VERTICAL",
        paddingTop: spacing["4xl"],
        paddingBottom: spacing["4xl"],
        paddingLeft: spacing["4xl"],
        paddingRight: spacing["4xl"],
        itemSpacing: spacing["4xl"]
      });
      placeholder.primaryAxisSizingMode = "AUTO";
      const label = createText({
        text: "[DS] Component Card\n\nCe composant sera import\xE9 automatiquement depuis la librairie DS Toolkit.",
        fontSize: 24,
        fontStyle: "Regular",
        color: colors.contentSubtle,
        width: 1340,
        lineHeight: 32
      });
      placeholder.appendChild(label);
      page.appendChild(placeholder);
    }
    const sectionOffsets = [
      { index: 0, x: -2726 },
      // Atoms
      { index: 1, x: -886 },
      // Components
      { index: 2, x: 954 },
      // Specs
      { index: 3, x: 2826 },
      // Usecases
      { index: 4, x: 4666 }
      // Deprecated
    ];
    for (const { index, x } of sectionOffsets) {
      await buildSection(SECTIONS[index], page, x);
    }
  }

  // src/features/starter-kit/starter-kit.ts
  function checkTemplateExists(template) {
    const pages = template === "ds-library" ? DS_LIBRARY_PAGES : STARTER_KIT_PAGES;
    const existingPageNames = new Set(figma.root.children.map((p4) => p4.name));
    const contentPageNames = pages.filter((p4) => p4.type !== "separator").map((p4) => p4.name);
    let matchCount = 0;
    for (const name of contentPageNames) {
      if (existingPageNames.has(name)) {
        matchCount++;
      }
    }
    return {
      exists: matchCount >= 3,
      matchCount
    };
  }
  async function resetAllPages() {
    const pages = [...figma.root.children];
    const keepPage = pages[0];
    await figma.setCurrentPageAsync(keepPage);
    for (let i = pages.length - 1; i >= 1; i--) {
      pages[i].remove();
    }
    await keepPage.loadAsync();
    for (const child of [...keepPage.children]) {
      child.remove();
    }
    keepPage.name = "Page 1";
  }
  async function createStarterKit(template = "prd") {
    await loadAllFonts();
    const pages = template === "ds-library" ? DS_LIBRARY_PAGES : STARTER_KIT_PAGES;
    const existingPages = figma.root.children;
    let reusablePage = null;
    if (existingPages.length === 1 && existingPages[0].name === "Page 1") {
      await existingPages[0].loadAsync();
    }
    if (existingPages.length === 1 && existingPages[0].name === "Page 1" && existingPages[0].children.length === 0) {
      reusablePage = existingPages[0];
    } else if (existingPages.length > 1 || existingPages.length === 1 && existingPages[0].name !== "Page 1") {
      figma.notify(
        "Starter Kit ajout\xE9 aux pages existantes.",
        { timeout: 3e3 }
      );
    }
    const createdPages = [];
    let coverNode = null;
    for (let i = 0; i < pages.length; i++) {
      const pageDef = pages[i];
      let page;
      if (i === 0 && reusablePage) {
        page = reusablePage;
        page.name = pageDef.name;
      } else {
        page = figma.createPage();
        page.name = pageDef.name;
      }
      createdPages.push(page);
      if (pageDef.type === "content" && pageDef.builder) {
        switch (pageDef.builder) {
          case "cover":
            coverNode = await buildCover(page);
            break;
          case "overview":
            await buildOverview(page);
            break;
          case "delivery":
            await buildDelivery(page);
            break;
          case "help":
            await buildHelp(page);
            break;
          case "library-cover":
            coverNode = await buildLibraryCover(page);
            break;
          case "readme":
            await buildReadme(page);
            break;
          case "contributors":
            await buildContributors(page);
            break;
          case "component-page":
            await buildComponentPage(page);
            break;
          case "archives":
            await buildArchives(page);
            break;
          case "local-components":
            await buildLocalComponents(page);
            break;
        }
      }
    }
    if (coverNode) {
      try {
        await figma.setFileThumbnailNodeAsync(coverNode);
      } catch (e4) {
        console.log("Could not set file thumbnail:", e4);
      }
    }
    if (createdPages.length > 0) {
      await figma.setCurrentPageAsync(createdPages[0]);
      if (coverNode) {
        figma.viewport.scrollAndZoomIntoView([coverNode]);
      }
    }
  }

  // src/shared/node-traversal.ts
  function yieldToEventLoop() {
    return new Promise((resolve) => setTimeout(resolve, 0));
  }
  async function traverseNodes(visitor, options) {
    const { scope, chunkSize = 150, onProgress, abortToken } = options;
    figma.skipInvisibleInstanceChildren = true;
    let processed = 0;
    if (scope === "file") {
      const pages = figma.root.children;
      const totalPages = pages.length;
      for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
        if (abortToken == null ? void 0 : abortToken.cancelled) {
          return { processed, cancelled: true };
        }
        const page = pages[pageIndex];
        await page.loadAsync();
        const pageResult = await processNodeQueue(
          page.children,
          visitor,
          chunkSize,
          abortToken,
          (chunkProcessed) => {
            processed += chunkProcessed;
            if (onProgress) {
              onProgress(pageIndex + 1, totalPages);
            }
          }
        );
        if (pageResult.cancelled) {
          return { processed, cancelled: true };
        }
      }
      return { processed, cancelled: false };
    } else {
      const rootNodes = scope === "selection" ? [...figma.currentPage.selection] : [...figma.currentPage.children];
      const result = await processNodeQueue(
        rootNodes,
        visitor,
        chunkSize,
        abortToken,
        (chunkProcessed) => {
          processed += chunkProcessed;
          if (onProgress) {
            onProgress(processed, -1);
          }
        }
      );
      processed = result.processed;
      return { processed, cancelled: result.cancelled };
    }
  }
  async function processNodeQueue(rootNodes, visitor, chunkSize, abortToken, onChunkDone) {
    const queue = rootNodes.map((node) => ({
      node,
      depth: 0,
      path: node.name
    }));
    let processed = 0;
    while (queue.length > 0) {
      if (abortToken == null ? void 0 : abortToken.cancelled) {
        return { processed, cancelled: true };
      }
      const chunk = queue.splice(0, chunkSize);
      let chunkCount = 0;
      for (const entry of chunk) {
        const { node, depth, path } = entry;
        const result = visitor(node, depth, path);
        processed++;
        chunkCount++;
        if (result !== false && "children" in node) {
          const parent = node;
          const children = parent.children;
          for (const child of children) {
            queue.push({
              node: child,
              depth: depth + 1,
              path: `${path} > ${child.name}`
            });
          }
        }
      }
      onChunkDone(chunkCount);
      if (queue.length > 0) {
        await yieldToEventLoop();
      }
    }
    return { processed, cancelled: false };
  }

  // src/shared/scoring.ts
  function calculateWeightedScore(categories) {
    const totalWeight = categories.reduce((sum, c2) => sum + c2.weight, 0);
    if (totalWeight === 0) return 100;
    const weighted = categories.reduce((sum, c2) => sum + c2.score * c2.weight, 0);
    return Math.max(0, Math.min(100, Math.round(weighted / totalWeight)));
  }
  function formatScoreLabel(score) {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Bon";
    if (score >= 50) return "A ameliorer";
    return "Critique";
  }
  function getScoreColor(score) {
    if (score >= 90) return "var(--success)";
    if (score >= 75) return "#f59e0b";
    if (score >= 50) return "#f97316";
    return "var(--error)";
  }
  function buildScoreResult(categories) {
    const overall = calculateWeightedScore(categories);
    return {
      overall,
      label: formatScoreLabel(overall),
      color: getScoreColor(overall),
      categories,
      totalViolations: categories.reduce((sum, c2) => sum + c2.violationCount, 0),
      totalChecked: categories.reduce((sum, c2) => sum + c2.totalChecked, 0)
    };
  }
  function calculateCategoryScore(category, violationCount, totalChecked, weight = 1) {
    const score = totalChecked === 0 ? 100 : Math.max(0, Math.round(100 - violationCount / totalChecked * 100));
    return { category, score, weight, violationCount, totalChecked };
  }

  // src/features/linter/linter-engine.ts
  var DEFAULT_NAME_REGEX = /^(Frame|Rectangle|Ellipse|Line|Group|Vector|Text|Polygon|Star|Image|Slice|Component|Instance|Boolean|Section)\s*\d*$/i;
  var BASE_VAGUE_NAMES = [
    "container",
    "wrapper",
    "element",
    "item",
    "box",
    "block",
    "content",
    "inner",
    "outer",
    "main",
    "div",
    "section",
    "comp",
    "layer"
  ];
  var SPECIAL_CHARS_REGEX = /[^a-zA-Z0-9\s\-_\/\.àéèêëïîôùûüçÀÉÈÊËÏÎÔÙÛÜÇ]/;
  var NUMBERED_SUFFIX_REGEX = /\s+\d+$/;
  var DS_LINTER_COLOR_SET = /* @__PURE__ */ new Set();
  (function() {
    var colorTokens = DS_TOKENS.filter(function(t) {
      return t.category === "color";
    });
    for (var i = 0; i < colorTokens.length; i++) {
      DS_LINTER_COLOR_SET.add(colorTokens[i].value.toLowerCase());
    }
  })();
  function shouldSkipNode(node, config) {
    if ("visible" in node && !node.visible) return true;
    if (node.name.startsWith("_") || node.name.startsWith(".")) return true;
    for (var i = 0; i < config.ignoredLayers.length; i++) {
      if (node.name === config.ignoredLayers[i]) return true;
    }
    return false;
  }
  function getNodeDepth(node) {
    var depth = 0;
    var current = node.parent;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      depth++;
      current = current.parent;
    }
    return depth;
  }
  function isOnIgnoredPage(config, pageName) {
    for (var i = 0; i < config.ignoredPages.length; i++) {
      if (pageName === config.ignoredPages[i]) return true;
    }
    return false;
  }
  function extractNodeColors(node) {
    var colors3 = [];
    if ("fills" in node) {
      var fills = node.fills;
      if (Array.isArray(fills)) {
        for (var i = 0; i < fills.length; i++) {
          if (fills[i].type === "SOLID" && fills[i].visible !== false) {
            var c2 = fills[i].color;
            colors3.push(rgbToHex(c2.r, c2.g, c2.b).toLowerCase());
          }
        }
      }
    }
    if ("strokes" in node) {
      var strokes = node.strokes;
      if (Array.isArray(strokes)) {
        for (var j = 0; j < strokes.length; j++) {
          if (strokes[j].type === "SOLID" && strokes[j].visible !== false) {
            var sc = strokes[j].color;
            colors3.push(rgbToHex(sc.r, sc.g, sc.b).toLowerCase());
          }
        }
      }
    }
    return colors3;
  }
  async function suggestAutoFix(node) {
    if (!DEFAULT_NAME_REGEX.test(node.name)) return null;
    if (node.type === "RECTANGLE") {
      var rParent = node.parent;
      if (rParent && "width" in rParent && "height" in rParent) {
        var rnW = node.width;
        var rnH = node.height;
        if (rnW > rnH * 10 && rnH <= 2) {
          return { name: "Divider", confidence: "high" };
        }
        var rpW = rParent.width;
        var rpH = rParent.height;
        if (Math.abs(rnW - rpW) < 2 && Math.abs(rnH - rpH) < 2) {
          return { name: "Background", confidence: "medium" };
        }
      }
      var rFills = node.fills;
      if (Array.isArray(rFills)) {
        for (var rf = 0; rf < rFills.length; rf++) {
          if (rFills[rf].type === "IMAGE") return { name: "Image", confidence: "high" };
        }
      }
      if ("cornerRadius" in node && typeof node.cornerRadius === "number" && node.cornerRadius > 0) {
        var rHasShadow = false;
        for (var re = 0; re < node.effects.length; re++) {
          if (node.effects[re].type === "DROP_SHADOW") {
            rHasShadow = true;
            break;
          }
        }
        if (rHasShadow) return { name: "Card", confidence: "medium" };
        return { name: "Shape", confidence: "medium" };
      }
      return { name: "Shape", confidence: "medium" };
    }
    if (node.type === "FRAME") {
      var frame = node;
      if (frame.layoutMode === "VERTICAL") return { name: "Column", confidence: "medium" };
      if (frame.layoutMode === "HORIZONTAL") return { name: "Row", confidence: "medium" };
      if ("children" in frame && frame.children.length === 1) {
        var fChild = frame.children[0];
        if (fChild.type === "TEXT") {
          var fText = fChild.characters.trim();
          if (fText.length > 0) {
            var fLabel = fText.length > 30 ? fText.substring(0, 27) + "..." : fText;
            return { name: fLabel, confidence: "low" };
          }
        }
        if (fChild.type === "INSTANCE") {
          var fInst = fChild;
          var fMain = await fInst.getMainComponentAsync();
          if (fMain) return { name: fMain.name, confidence: "medium" };
        }
        return { name: "Wrapper/" + fChild.name, confidence: "low" };
      }
      if ("children" in frame && frame.children.length === 0) {
        return { name: "Empty Frame", confidence: "low" };
      }
      return { name: "Container", confidence: "medium" };
    }
    if (node.type === "ELLIPSE") {
      if (node.width === node.height && node.width <= 48) {
        return { name: node.width <= 12 ? "Dot" : "Avatar", confidence: "medium" };
      }
      return { name: "Ellipse Shape", confidence: "low" };
    }
    if (node.type === "TEXT") {
      var txContent = node.characters.trim();
      if (txContent.length > 0) {
        var txWords = txContent.split(/\s+/).slice(0, 3).join(" ");
        var txLabel = txWords.length > 30 ? txWords.substring(0, 27) + "..." : txWords;
        return { name: txLabel, confidence: "high" };
      }
      return { name: "Text", confidence: "low" };
    }
    if (node.type === "LINE") return { name: "Separator", confidence: "medium" };
    if (node.type === "VECTOR") return { name: "Icon", confidence: "medium" };
    if (node.type === "POLYGON") return { name: "Polygon Shape", confidence: "low" };
    if (node.type === "STAR") return { name: "Star Shape", confidence: "low" };
    if (node.type === "SLICE") return { name: "Slice", confidence: "low" };
    if (node.type === "BOOLEAN_OPERATION") return { name: "Boolean Shape", confidence: "low" };
    if (node.type === "GROUP") {
      var grpChildren = node.children;
      if (grpChildren.length > 0) {
        var grpCounts = {};
        for (var g = 0; g < grpChildren.length; g++) {
          var gct = grpChildren[g].type;
          grpCounts[gct] = (grpCounts[gct] || 0) + 1;
        }
        var grpDominant = grpChildren[0].type;
        var grpMax = 0;
        for (var gk in grpCounts) {
          if (grpCounts[gk] > grpMax) {
            grpMax = grpCounts[gk];
            grpDominant = gk;
          }
        }
        return { name: "Group/" + grpDominant.toLowerCase() + "s", confidence: "low" };
      }
      return { name: "Empty Group", confidence: "low" };
    }
    if (node.type === "SECTION") return { name: "Section", confidence: "low" };
    return { name: "Layer", confidence: "low" };
  }
  async function runRulesOnNodes(collectedNodes, config) {
    var violations = [];
    var usedComponentIds = /* @__PURE__ */ new Set();
    if (config.enabledRules["unused-components"] !== false) {
      for (var uc = 0; uc < collectedNodes.length; uc++) {
        var ucNode = collectedNodes[uc].node;
        if (ucNode.type === "INSTANCE") {
          var mainComp = await ucNode.getMainComponentAsync();
          if (mainComp) usedComponentIds.add(mainComp.id);
        }
      }
    }
    var vagueNames = new Set(BASE_VAGUE_NAMES);
    for (var cv = 0; cv < config.customVagueNames.length; cv++) {
      var custom = config.customVagueNames[cv].trim().toLowerCase();
      if (custom.length > 0) vagueNames.add(custom);
    }
    var threshold = config.autoFixConfidenceThreshold;
    var maxLen = config.maxNameLength || 60;
    if (config.enabledRules["default-names"] !== false) {
      for (var i = 0; i < collectedNodes.length; i++) {
        var node = collectedNodes[i].node;
        var nodePath = collectedNodes[i].path;
        if (DEFAULT_NAME_REGEX.test(node.name)) {
          var fix = await suggestAutoFix(node);
          violations.push({
            id: "lint-default-names-" + node.id,
            nodeId: node.id,
            nodeName: node.name,
            nodePath,
            rule: "default-names",
            severity: "error",
            category: "naming",
            message: '"' + node.name + '" est un nom par d\xE9faut Figma.',
            suggestion: fix ? fix.name : void 0,
            confidence: fix ? fix.confidence : void 0,
            metadata: { ruleName: "Noms par d\xE9faut", nodeType: node.type }
          });
        }
      }
    }
    if (config.enabledRules["vague-names"] !== false) {
      for (var i2 = 0; i2 < collectedNodes.length; i2++) {
        var node2 = collectedNodes[i2].node;
        var nodePath2 = collectedNodes[i2].path;
        if (vagueNames.has(node2.name.toLowerCase())) {
          violations.push({
            id: "lint-vague-names-" + node2.id,
            nodeId: node2.id,
            nodeName: node2.name,
            nodePath: nodePath2,
            rule: "vague-names",
            severity: "warning",
            category: "naming",
            message: '"' + node2.name + '" est un nom trop g\xE9n\xE9rique.',
            metadata: { ruleName: "Noms vagues", nodeType: node2.type }
          });
        }
      }
    }
    if (config.enabledRules["duplicate-siblings"] !== false) {
      var parentMap = {};
      for (var i3 = 0; i3 < collectedNodes.length; i3++) {
        var node3 = collectedNodes[i3].node;
        if (node3.parent && "id" in node3.parent) {
          var parentId = node3.parent.id;
          if (!parentMap[parentId]) parentMap[parentId] = [];
          parentMap[parentId].push(collectedNodes[i3]);
        }
      }
      for (var pid in parentMap) {
        var siblings = parentMap[pid];
        var nameCount = {};
        for (var s = 0; s < siblings.length; s++) {
          nameCount[siblings[s].node.name] = (nameCount[siblings[s].node.name] || 0) + 1;
        }
        for (var dupName in nameCount) {
          if (nameCount[dupName] > 1) {
            for (var s2 = 0; s2 < siblings.length; s2++) {
              if (siblings[s2].node.name === dupName) {
                violations.push({
                  id: "lint-duplicate-siblings-" + siblings[s2].node.id,
                  nodeId: siblings[s2].node.id,
                  nodeName: siblings[s2].node.name,
                  nodePath: siblings[s2].path,
                  rule: "duplicate-siblings",
                  severity: "warning",
                  category: "naming",
                  message: '"' + dupName + '" appara\xEEt ' + nameCount[dupName] + " fois au m\xEAme niveau.",
                  metadata: { ruleName: "Doublons fr\xE8res", nodeType: siblings[s2].node.type }
                });
              }
            }
          }
        }
      }
    }
    if (config.enabledRules["component-naming"] !== false) {
      for (var i4 = 0; i4 < collectedNodes.length; i4++) {
        var node4 = collectedNodes[i4].node;
        var nodePath4 = collectedNodes[i4].path;
        if (node4.type === "COMPONENT" || node4.type === "COMPONENT_SET") {
          if (!node4.name.includes("/")) {
            violations.push({
              id: "lint-component-naming-" + node4.id,
              nodeId: node4.id,
              nodeName: node4.name,
              nodePath: nodePath4,
              rule: "component-naming",
              severity: "error",
              category: "naming",
              message: 'Le composant "' + node4.name + `" n'est pas cat\xE9goris\xE9 (pas de "/").`,
              metadata: { ruleName: "Nommage composant", nodeType: node4.type }
            });
          }
        }
      }
    }
    if (config.enabledRules["long-names"] !== false) {
      for (var i5 = 0; i5 < collectedNodes.length; i5++) {
        var node5 = collectedNodes[i5].node;
        var nodePath5 = collectedNodes[i5].path;
        if (node5.name.length > maxLen) {
          violations.push({
            id: "lint-long-names-" + node5.id,
            nodeId: node5.id,
            nodeName: node5.name,
            nodePath: nodePath5,
            rule: "long-names",
            severity: "info",
            category: "naming",
            message: "Le nom fait " + node5.name.length + " caract\xE8res (max recommand\xE9 : " + maxLen + ").",
            metadata: { ruleName: "Noms trop longs", nodeType: node5.type }
          });
        }
      }
    }
    if (config.enabledRules["special-chars"] !== false) {
      for (var i6 = 0; i6 < collectedNodes.length; i6++) {
        var node6 = collectedNodes[i6].node;
        var nodePath6 = collectedNodes[i6].path;
        if (SPECIAL_CHARS_REGEX.test(node6.name)) {
          violations.push({
            id: "lint-special-chars-" + node6.id,
            nodeId: node6.id,
            nodeName: node6.name,
            nodePath: nodePath6,
            rule: "special-chars",
            severity: "info",
            category: "naming",
            message: '"' + node6.name + '" contient des caract\xE8res non-standard.',
            metadata: { ruleName: "Caract\xE8res sp\xE9ciaux", nodeType: node6.type }
          });
        }
      }
    }
    if (config.enabledRules["numbered-suffix"] !== false) {
      for (var i7 = 0; i7 < collectedNodes.length; i7++) {
        var node7 = collectedNodes[i7].node;
        var nodePath7 = collectedNodes[i7].path;
        if (DEFAULT_NAME_REGEX.test(node7.name)) continue;
        if (NUMBERED_SUFFIX_REGEX.test(node7.name)) {
          var baseName = node7.name.replace(NUMBERED_SUFFIX_REGEX, "");
          violations.push({
            id: "lint-numbered-suffix-" + node7.id,
            nodeId: node7.id,
            nodeName: node7.name,
            nodePath: nodePath7,
            rule: "numbered-suffix",
            severity: "warning",
            category: "naming",
            message: '"' + node7.name + '" se termine par un suffixe num\xE9rique (copier-coller probable).',
            suggestion: baseName,
            confidence: "high",
            metadata: { ruleName: "Suffixe num\xE9rique", nodeType: node7.type }
          });
        }
      }
    }
    if (config.enabledRules["text-mismatch"] !== false) {
      for (var i8 = 0; i8 < collectedNodes.length; i8++) {
        var node8 = collectedNodes[i8].node;
        var nodePath8 = collectedNodes[i8].path;
        if (node8.type !== "TEXT") continue;
        if (DEFAULT_NAME_REGEX.test(node8.name)) continue;
        var textContent = node8.characters.trim();
        if (textContent.length === 0) continue;
        var textPreview = textContent.split(/\s+/).slice(0, 5).join(" ");
        if (textPreview.length > 40) textPreview = textPreview.substring(0, 37) + "...";
        var nameLower = node8.name.toLowerCase().trim();
        var contentLower = textContent.toLowerCase();
        if (contentLower.indexOf(nameLower) !== -1 || nameLower.indexOf(contentLower.substring(0, 20)) !== -1) continue;
        var nameFirstWord = nameLower.split(/[\s\-_\/]/)[0];
        var contentFirstWord = contentLower.split(/\s+/)[0];
        if (nameFirstWord.length > 2 && contentFirstWord.indexOf(nameFirstWord) !== -1) continue;
        var suggestedName = textContent.split(/\s+/).slice(0, 3).join(" ");
        if (suggestedName.length > 30) suggestedName = suggestedName.substring(0, 27) + "...";
        violations.push({
          id: "lint-text-mismatch-" + node8.id,
          nodeId: node8.id,
          nodeName: node8.name,
          nodePath: nodePath8,
          rule: "text-mismatch",
          severity: "warning",
          category: "naming",
          message: 'Le nom "' + node8.name + '" ne correspond pas au contenu visible "' + textPreview + '".',
          suggestion: suggestedName,
          confidence: "high",
          metadata: { ruleName: "Texte incoh\xE9rent", nodeType: node8.type }
        });
      }
    }
    if (config.enabledRules["empty-frames"] !== false) {
      for (var i9 = 0; i9 < collectedNodes.length; i9++) {
        var node9 = collectedNodes[i9].node;
        var nodePath9 = collectedNodes[i9].path;
        if (node9.type === "FRAME" && node9.children.length === 0 || node9.type === "GROUP" && node9.children.length === 0) {
          violations.push({
            id: "lint-empty-frames-" + node9.id,
            nodeId: node9.id,
            nodeName: node9.name,
            nodePath: nodePath9,
            rule: "empty-frames",
            severity: "warning",
            category: "structure",
            message: '"' + node9.name + '" est un frame/groupe vide sans contenu.',
            metadata: { ruleName: "Frames vides", nodeType: node9.type }
          });
        }
      }
    }
    if (config.enabledRules["excessive-nesting"] !== false) {
      var maxNesting = config.maxNestingDepth || 8;
      for (var i10 = 0; i10 < collectedNodes.length; i10++) {
        var node10 = collectedNodes[i10].node;
        var nodePath10 = collectedNodes[i10].path;
        var depth = getNodeDepth(node10);
        if (depth > maxNesting) {
          violations.push({
            id: "lint-excessive-nesting-" + node10.id,
            nodeId: node10.id,
            nodeName: node10.name,
            nodePath: nodePath10,
            rule: "excessive-nesting",
            severity: "warning",
            category: "structure",
            message: '"' + node10.name + '" est imbrique a ' + depth + " niveaux (max recommande : " + maxNesting + ").",
            metadata: { ruleName: "Imbrication excessive", nodeType: node10.type, depth }
          });
        }
      }
    }
    if (config.enabledRules["single-child-groups"] !== false) {
      for (var i11 = 0; i11 < collectedNodes.length; i11++) {
        var node11 = collectedNodes[i11].node;
        var nodePath11 = collectedNodes[i11].path;
        var isSingleChildGroup = node11.type === "GROUP" && node11.children.length === 1;
        var isSingleChildFrame = node11.type === "FRAME" && node11.layoutMode === "NONE" && node11.children.length === 1;
        if (isSingleChildGroup || isSingleChildFrame) {
          var childName = "children" in node11 ? node11.children[0].name : void 0;
          violations.push({
            id: "lint-single-child-groups-" + node11.id,
            nodeId: node11.id,
            nodeName: node11.name,
            nodePath: nodePath11,
            rule: "single-child-groups",
            severity: "info",
            category: "structure",
            message: '"' + node11.name + '" est un groupe/frame avec un seul enfant (wrapper inutile potentiel).',
            suggestion: childName,
            confidence: "low",
            metadata: { ruleName: "Groupes a enfant unique", nodeType: node11.type }
          });
        }
      }
    }
    if (config.enabledRules["orphan-layers"] !== false) {
      for (var i12 = 0; i12 < collectedNodes.length; i12++) {
        var node12 = collectedNodes[i12].node;
        var nodePath12 = collectedNodes[i12].path;
        if (node12.parent && node12.parent.type === "PAGE" && node12.type !== "FRAME" && node12.type !== "SECTION" && node12.type !== "COMPONENT_SET") {
          violations.push({
            id: "lint-orphan-layers-" + node12.id,
            nodeId: node12.id,
            nodeName: node12.name,
            nodePath: nodePath12,
            rule: "orphan-layers",
            severity: "info",
            category: "structure",
            message: '"' + node12.name + '" est directement sur la page, en dehors de tout frame.',
            metadata: { ruleName: "Layers orphelins", nodeType: node12.type }
          });
        }
      }
    }
    if (config.enabledRules["unused-components"] !== false) {
      for (var i13 = 0; i13 < collectedNodes.length; i13++) {
        var node13 = collectedNodes[i13].node;
        var nodePath13 = collectedNodes[i13].path;
        if (node13.type === "COMPONENT" && !usedComponentIds.has(node13.id)) {
          violations.push({
            id: "lint-unused-components-" + node13.id,
            nodeId: node13.id,
            nodeName: node13.name,
            nodePath: nodePath13,
            rule: "unused-components",
            severity: "info",
            category: "structure",
            message: 'Le composant "' + node13.name + `" n'a aucune instance dans ce scope.`,
            metadata: { ruleName: "Composants inutilises", nodeType: node13.type }
          });
        }
      }
    }
    if (config.enabledRules["non-token-colors"] !== false) {
      for (var i14 = 0; i14 < collectedNodes.length; i14++) {
        var node14 = collectedNodes[i14].node;
        var nodePath14 = collectedNodes[i14].path;
        if (node14.type === "TEXT") continue;
        var nodeColors = extractNodeColors(node14);
        var offTokenColors = [];
        for (var ci14 = 0; ci14 < nodeColors.length; ci14++) {
          if (!DS_LINTER_COLOR_SET.has(nodeColors[ci14])) {
            offTokenColors.push(nodeColors[ci14]);
          }
        }
        if (offTokenColors.length > 0) {
          violations.push({
            id: "lint-non-token-colors-" + node14.id,
            nodeId: node14.id,
            nodeName: node14.name,
            nodePath: nodePath14,
            rule: "non-token-colors",
            severity: "warning",
            category: "style",
            message: '"' + node14.name + '" utilise des couleurs hors tokens DS : ' + offTokenColors.join(", ") + ".",
            metadata: { ruleName: "Couleurs hors tokens", nodeType: node14.type, offTokenColors }
          });
        }
      }
    }
    if (config.enabledRules["inconsistent-radius"] !== false) {
      var parentRadiusMap = {};
      for (var i15 = 0; i15 < collectedNodes.length; i15++) {
        var node15 = collectedNodes[i15].node;
        if ("cornerRadius" in node15 && typeof node15.cornerRadius === "number") {
          var parentNode15 = node15.parent;
          if (parentNode15 && "id" in parentNode15) {
            var pid15 = parentNode15.id;
            if (!parentRadiusMap[pid15]) {
              parentRadiusMap[pid15] = { radii: /* @__PURE__ */ new Set(), nodes: [] };
            }
            parentRadiusMap[pid15].radii.add(node15.cornerRadius);
            parentRadiusMap[pid15].nodes.push({ cn: collectedNodes[i15], radius: node15.cornerRadius });
          }
        }
      }
      for (var prk in parentRadiusMap) {
        var prGroup = parentRadiusMap[prk];
        if (prGroup.radii.size > 1) {
          var siblingRadii = Array.from(prGroup.radii);
          for (var pr = 0; pr < prGroup.nodes.length; pr++) {
            var prEntry = prGroup.nodes[pr];
            violations.push({
              id: "lint-inconsistent-radius-" + prEntry.cn.node.id,
              nodeId: prEntry.cn.node.id,
              nodeName: prEntry.cn.node.name,
              nodePath: prEntry.cn.path,
              rule: "inconsistent-radius",
              severity: "warning",
              category: "style",
              message: '"' + prEntry.cn.node.name + '" a un border-radius de ' + prEntry.radius + "px, different de ses voisins.",
              metadata: { ruleName: "Border-radius incoherent", nodeType: prEntry.cn.node.type, radius: prEntry.radius, siblingRadii }
            });
          }
        }
      }
    }
    if (config.enabledRules["mixed-fills"] !== false) {
      for (var i16 = 0; i16 < collectedNodes.length; i16++) {
        var node16 = collectedNodes[i16].node;
        var nodePath16 = collectedNodes[i16].path;
        if ("fills" in node16) {
          var fills16 = node16.fills;
          if (Array.isArray(fills16)) {
            var visibleTypes = [];
            for (var f16 = 0; f16 < fills16.length; f16++) {
              if (fills16[f16].visible !== false) {
                visibleTypes.push(fills16[f16].type);
              }
            }
            var uniqueTypes = Array.from(new Set(visibleTypes));
            if (uniqueTypes.length > 1) {
              violations.push({
                id: "lint-mixed-fills-" + node16.id,
                nodeId: node16.id,
                nodeName: node16.name,
                nodePath: nodePath16,
                rule: "mixed-fills",
                severity: "info",
                category: "style",
                message: '"' + node16.name + '" combine des types de remplissage differents (' + uniqueTypes.join(", ") + ").",
                metadata: { ruleName: "Fills mixtes", nodeType: node16.type, fillTypes: uniqueTypes }
              });
            }
          }
        }
      }
    }
    if (config.enabledRules["detached-styles"] !== false) {
      for (var i17 = 0; i17 < collectedNodes.length; i17++) {
        var node17 = collectedNodes[i17].node;
        var nodePath17 = collectedNodes[i17].path;
        if ("fillStyleId" in node17) {
          var fillSid = node17.fillStyleId;
          if (fillSid === figma.mixed) {
            violations.push({
              id: "lint-detached-styles-fill-" + node17.id,
              nodeId: node17.id,
              nodeName: node17.name,
              nodePath: nodePath17,
              rule: "detached-styles",
              severity: "warning",
              category: "style",
              message: '"' + node17.name + '" a des styles de remplissage partiellement detaches (mixed).',
              metadata: { ruleName: "Styles detaches", nodeType: node17.type, detachedProperty: "fillStyleId" }
            });
          }
        }
        if (node17.type === "TEXT" && "textStyleId" in node17) {
          var textSid = node17.textStyleId;
          if (textSid === figma.mixed) {
            violations.push({
              id: "lint-detached-styles-text-" + node17.id,
              nodeId: node17.id,
              nodeName: node17.name,
              nodePath: nodePath17,
              rule: "detached-styles",
              severity: "warning",
              category: "style",
              message: '"' + node17.name + '" a des styles de texte partiellement detaches (mixed).',
              metadata: { ruleName: "Styles detaches", nodeType: node17.type, detachedProperty: "textStyleId" }
            });
          }
        }
      }
    }
    return violations;
  }
  function buildLintResult(violations, totalNodes, startTime) {
    var seen = {};
    var uniqueViolations = [];
    for (var d = 0; d < violations.length; d++) {
      var v = violations[d];
      var key = v.nodeId + "::" + v.rule;
      if (!seen[key]) {
        seen[key] = true;
        uniqueViolations.push(v);
      }
    }
    var errorCount = 0, warningCount = 0, infoCount = 0;
    for (var c2 = 0; c2 < uniqueViolations.length; c2++) {
      if (uniqueViolations[c2].severity === "error") errorCount++;
      else if (uniqueViolations[c2].severity === "warning") warningCount++;
      else infoCount++;
    }
    var namingViolations = 0;
    var structureViolations = 0;
    var styleViolations = 0;
    for (var cat = 0; cat < uniqueViolations.length; cat++) {
      var catV = uniqueViolations[cat];
      if (catV.category === "naming") namingViolations++;
      else if (catV.category === "structure") structureViolations++;
      else if (catV.category === "style") styleViolations++;
    }
    var categoryScores = [
      calculateCategoryScore("naming", namingViolations, totalNodes),
      calculateCategoryScore("structure", structureViolations, totalNodes),
      calculateCategoryScore("style", styleViolations, totalNodes)
    ];
    var score = buildScoreResult(categoryScores);
    var byRule = {};
    for (var b = 0; b < uniqueViolations.length; b++) {
      var rv = uniqueViolations[b];
      if (!byRule[rv.rule]) byRule[rv.rule] = { count: 0, fixableCount: 0 };
      byRule[rv.rule].count++;
      if (rv.confidence !== void 0 && rv.confidence !== "low") {
        byRule[rv.rule].fixableCount++;
      }
    }
    return {
      totalNodes,
      violations: uniqueViolations,
      score,
      scanDuration: Date.now() - startTime,
      errorCount,
      warningCount,
      infoCount,
      byRule
    };
  }
  function emptyResult(startTime) {
    return {
      totalNodes: 0,
      violations: [],
      score: buildScoreResult([
        calculateCategoryScore("naming", 0, 0),
        calculateCategoryScore("structure", 0, 0),
        calculateCategoryScore("style", 0, 0)
      ]),
      scanDuration: Date.now() - startTime,
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      byRule: {}
    };
  }
  async function runLintAsync(scope, config, abortToken, onProgress, pageName) {
    var startTime = Date.now();
    var currentPageName = pageName !== void 0 ? pageName : figma.currentPage.name;
    if (isOnIgnoredPage(config, currentPageName)) {
      return emptyResult(startTime);
    }
    if (scope === "selection" && figma.currentPage.selection.length === 0) {
      return emptyResult(startTime);
    }
    var collectedNodes = [];
    await traverseNodes(
      function(node, depth, path) {
        if (!shouldSkipNode(node, config)) {
          collectedNodes.push({ node, path });
        }
      },
      {
        scope,
        onProgress,
        abortToken
      }
    );
    if (abortToken && abortToken.cancelled) {
      return emptyResult(startTime);
    }
    var violations = await runRulesOnNodes(collectedNodes, config);
    return buildLintResult(violations, collectedNodes.length, startTime);
  }
  async function runLintFile(config, abortToken, onPageProgress) {
    figma.skipInvisibleInstanceChildren = true;
    var results = [];
    var pages = figma.root.children;
    var totalPages = pages.length;
    for (var pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      if (abortToken.cancelled) break;
      var page = pages[pageIndex];
      await page.loadAsync();
      if (isOnIgnoredPage(config, page.name)) {
        if (onPageProgress) onPageProgress(page.name, pageIndex + 1, totalPages);
        continue;
      }
      var startTime = Date.now();
      var collectedNodes = [];
      var queue = [];
      var pageChildren = page.children;
      for (var ci = 0; ci < pageChildren.length; ci++) {
        queue.push({ node: pageChildren[ci], depth: 0, path: pageChildren[ci].name });
      }
      while (queue.length > 0) {
        if (abortToken.cancelled) break;
        var entry = queue.shift();
        var node = entry.node;
        var path = entry.path;
        if (!shouldSkipNode(node, config)) {
          collectedNodes.push({ node, path });
        }
        if ("children" in node) {
          var children = node.children;
          for (var k4 = 0; k4 < children.length; k4++) {
            queue.push({
              node: children[k4],
              depth: entry.depth + 1,
              path: path + " > " + children[k4].name
            });
          }
        }
      }
      if (abortToken.cancelled) break;
      var violations = await runRulesOnNodes(collectedNodes, config);
      var result = buildLintResult(violations, collectedNodes.length, startTime);
      results.push({
        pageId: page.id,
        pageName: page.name,
        result
      });
      if (onPageProgress) onPageProgress(page.name, pageIndex + 1, totalPages);
    }
    return results;
  }

  // src/features/linter/linter-autofix.ts
  var DEFAULT_NAME_REGEX2 = /^(Frame|Rectangle|Ellipse|Line|Group|Vector|Text|Polygon|Star|Image|Slice|Component|Instance|Boolean|Section)\s*\d*$/i;
  var NUMBERED_SUFFIX_REGEX2 = /\s+\d+$/;
  function deduplicateSiblingName(node, desiredName) {
    var parent = node.parent;
    if (!parent || !("children" in parent)) return desiredName;
    var siblings = parent.children;
    var existingNames = {};
    for (var i = 0; i < siblings.length; i++) {
      if (siblings[i].id !== node.id) {
        existingNames[siblings[i].name] = true;
      }
    }
    if (!existingNames[desiredName]) return desiredName;
    var counter = 2;
    while (existingNames[desiredName + " " + counter]) {
      counter++;
    }
    return desiredName + " " + counter;
  }
  async function computeAutoFixName(node) {
    if (node.type === "RECTANGLE") {
      var rParent = node.parent;
      if (rParent && "width" in rParent && "height" in rParent) {
        var rnW = node.width;
        var rnH = node.height;
        if (rnW > rnH * 10 && rnH <= 2) return "Divider";
        var rpW = rParent.width;
        var rpH = rParent.height;
        if (Math.abs(rnW - rpW) < 2 && Math.abs(rnH - rpH) < 2) return "Background";
      }
      var rFills = node.fills;
      if (Array.isArray(rFills)) {
        for (var rf = 0; rf < rFills.length; rf++) {
          if (rFills[rf].type === "IMAGE") return "Image";
        }
      }
      var rect = node;
      if (typeof rect.cornerRadius === "number" && rect.cornerRadius > 0) {
        var rHasShadow = false;
        for (var re = 0; re < rect.effects.length; re++) {
          if (rect.effects[re].type === "DROP_SHADOW") {
            rHasShadow = true;
            break;
          }
        }
        if (rHasShadow) return "Card";
      }
      return "Shape";
    }
    if (node.type === "FRAME") {
      var frame = node;
      if (frame.layoutMode === "VERTICAL") return "Column";
      if (frame.layoutMode === "HORIZONTAL") return "Row";
      if ("children" in frame && frame.children.length === 1) {
        var fChild = frame.children[0];
        if (fChild.type === "TEXT") {
          var fText = fChild.characters.trim();
          if (fText.length > 0) {
            return fText.length > 30 ? fText.substring(0, 27) + "..." : fText;
          }
        }
        if (fChild.type === "INSTANCE") {
          var fInst = fChild;
          var fMainComp = await fInst.getMainComponentAsync();
          if (fMainComp) return fMainComp.name;
        }
        return "Wrapper/" + fChild.name;
      }
      if ("children" in frame && frame.children.length === 0) return "Empty Frame";
      return "Container";
    }
    if (node.type === "ELLIPSE") {
      if (node.width === node.height && node.width <= 48) {
        return node.width <= 12 ? "Dot" : "Avatar";
      }
      return "Ellipse Shape";
    }
    if (node.type === "TEXT") {
      var txContent = node.characters.trim();
      if (txContent.length > 0) {
        var txWords = txContent.split(/\s+/).slice(0, 3).join(" ");
        return txWords.length > 30 ? txWords.substring(0, 27) + "..." : txWords;
      }
      return "Text";
    }
    if (node.type === "LINE") return "Separator";
    if (node.type === "VECTOR") return "Icon";
    if (node.type === "GROUP") {
      var grpNode = node;
      if (grpNode.children.length > 0) {
        var grpCounts = {};
        for (var j = 0; j < grpNode.children.length; j++) {
          var gt = grpNode.children[j].type;
          grpCounts[gt] = (grpCounts[gt] || 0) + 1;
        }
        var grpDom = grpNode.children[0].type;
        var grpMax = 0;
        for (var gk in grpCounts) {
          if (grpCounts[gk] > grpMax) {
            grpMax = grpCounts[gk];
            grpDom = gk;
          }
        }
        return "Group/" + grpDom.toLowerCase() + "s";
      }
      return "Empty Group";
    }
    return "Layer";
  }
  async function autoFixNode(nodeId, suggestion) {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || !("name" in node)) {
      return { success: false, newName: "" };
    }
    var sceneNode = node;
    var currentName = sceneNode.name;
    var newName = null;
    if (suggestion && suggestion.length > 0) {
      newName = suggestion;
    } else if (NUMBERED_SUFFIX_REGEX2.test(currentName) && !DEFAULT_NAME_REGEX2.test(currentName)) {
      newName = currentName.replace(NUMBERED_SUFFIX_REGEX2, "");
    } else if (DEFAULT_NAME_REGEX2.test(currentName)) {
      newName = await computeAutoFixName(sceneNode);
    }
    if (newName && newName !== currentName) {
      var finalName = deduplicateSiblingName(sceneNode, newName);
      sceneNode.name = finalName;
      return { success: true, newName: finalName };
    }
    return { success: false, newName: currentName };
  }
  async function autoFixAll(violations) {
    var fixed = 0;
    var failed = 0;
    var fixedNodeIds = [];
    var fixable = [];
    for (var i = 0; i < violations.length; i++) {
      if (violations[i].confidence !== void 0 && violations[i].confidence !== "low") {
        fixable.push(violations[i]);
      }
    }
    if (fixable.length === 0) {
      return { fixed: 0, failed: 0, fixedNodeIds: [] };
    }
    var allFixableNodes = [];
    for (var s = 0; s < fixable.length; s++) {
      var sn = await figma.getNodeByIdAsync(fixable[s].nodeId);
      if (sn && "type" in sn && sn.type !== "DOCUMENT" && sn.type !== "PAGE") {
        allFixableNodes.push(sn);
      }
    }
    if (allFixableNodes.length > 0) {
      figma.currentPage.selection = allFixableNodes;
    }
    for (var j = 0; j < fixable.length; j++) {
      var v = fixable[j];
      var result = await autoFixNode(v.nodeId, v.suggestion);
      if (result.success) {
        fixed++;
        fixedNodeIds.push(v.nodeId);
      } else {
        failed++;
      }
    }
    if (fixedNodeIds.length > 0) {
      var fixedNodes = [];
      for (var k4 = 0; k4 < fixedNodeIds.length; k4++) {
        var fn5 = await figma.getNodeByIdAsync(fixedNodeIds[k4]);
        if (fn5 && "type" in fn5 && fn5.type !== "DOCUMENT" && fn5.type !== "PAGE") {
          fixedNodes.push(fn5);
        }
      }
      if (fixedNodes.length > 0) {
        figma.currentPage.selection = fixedNodes;
        figma.viewport.scrollAndZoomIntoView(fixedNodes);
      }
    }
    return { fixed, failed, fixedNodeIds };
  }

  // src/shared/storage.ts
  function createStorage(namespace) {
    const prefix = `marcel:${namespace}:`;
    return {
      async get(key) {
        try {
          const value = await figma.clientStorage.getAsync(prefix + key);
          return value;
        } catch (e4) {
          console.error(`[Marcel] Storage get failed for ${prefix + key}:`, e4);
          return void 0;
        }
      },
      async set(key, value) {
        try {
          await figma.clientStorage.setAsync(prefix + key, value);
        } catch (e4) {
          console.error(`[Marcel] Storage set failed for ${prefix + key}:`, e4);
        }
      },
      async delete(key) {
        try {
          await figma.clientStorage.deleteAsync(prefix + key);
        } catch (e4) {
          console.error(`[Marcel] Storage delete failed for ${prefix + key}:`, e4);
        }
      },
      async getOrDefault(key, defaultValue) {
        const value = await this.get(key);
        return value !== void 0 ? value : defaultValue;
      },
      async keys() {
        try {
          const allKeys = await figma.clientStorage.keysAsync();
          return allKeys.filter((k4) => k4.startsWith(prefix)).map((k4) => k4.slice(prefix.length));
        } catch (e4) {
          console.error(`[Marcel] Storage keys failed for ${namespace}:`, e4);
          return [];
        }
      }
    };
  }

  // src/features/linter/linter-config.ts
  var linterStorage = createStorage("linter");
  var DEFAULT_LINTER_CONFIG = {
    enabledRules: {
      "default-names": true,
      "vague-names": true,
      "duplicate-siblings": true,
      "component-naming": true,
      "long-names": true,
      "special-chars": false,
      "numbered-suffix": true,
      "text-mismatch": true,
      "empty-frames": true,
      "excessive-nesting": true,
      "single-child-groups": true,
      "orphan-layers": true,
      "unused-components": true,
      "non-token-colors": true,
      "inconsistent-radius": true,
      "mixed-fills": false,
      "detached-styles": true
    },
    customVagueNames: [],
    ignoredLayers: ["\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500"],
    ignoredPages: ["Need help ? Comment organiser & documenter"],
    autoFixConfidenceThreshold: "medium",
    componentNamingPattern: ".+/.+",
    maxNameLength: 60,
    maxNestingDepth: 8
  };
  async function loadLinterConfig() {
    const stored = await linterStorage.get("config");
    if (stored && typeof stored === "object") {
      return mergeConfig(DEFAULT_LINTER_CONFIG, stored);
    }
    return __spreadProps(__spreadValues({}, DEFAULT_LINTER_CONFIG), { enabledRules: __spreadValues({}, DEFAULT_LINTER_CONFIG.enabledRules) });
  }
  async function saveLinterConfig(config) {
    await linterStorage.set("config", config);
  }
  async function resetLinterConfig() {
    var fresh = __spreadProps(__spreadValues({}, DEFAULT_LINTER_CONFIG), {
      enabledRules: __spreadValues({}, DEFAULT_LINTER_CONFIG.enabledRules),
      customVagueNames: [],
      ignoredLayers: [...DEFAULT_LINTER_CONFIG.ignoredLayers],
      ignoredPages: [...DEFAULT_LINTER_CONFIG.ignoredPages]
    });
    await saveLinterConfig(fresh);
    return fresh;
  }
  function mergeConfig(defaults, partial) {
    return {
      enabledRules: __spreadValues(__spreadValues({}, defaults.enabledRules), partial.enabledRules || {}),
      customVagueNames: partial.customVagueNames || defaults.customVagueNames,
      ignoredLayers: partial.ignoredLayers || defaults.ignoredLayers,
      ignoredPages: partial.ignoredPages || defaults.ignoredPages,
      autoFixConfidenceThreshold: partial.autoFixConfidenceThreshold || defaults.autoFixConfidenceThreshold,
      componentNamingPattern: partial.componentNamingPattern || defaults.componentNamingPattern,
      maxNameLength: partial.maxNameLength !== void 0 ? partial.maxNameLength : defaults.maxNameLength,
      maxNestingDepth: partial.maxNestingDepth !== void 0 ? partial.maxNestingDepth : defaults.maxNestingDepth
    };
  }

  // src/features/linter/linter-allowlist.ts
  var linterStorage2 = createStorage("linter");
  var ALLOWLIST_KEY = "ignored";
  async function loadAllowlist() {
    const stored = await linterStorage2.get(ALLOWLIST_KEY);
    return new Set(stored || []);
  }
  async function addToAllowlist(nodeId, ruleId) {
    const current = await loadAllowlist();
    current.add(`${nodeId}::${ruleId}`);
    await linterStorage2.set(ALLOWLIST_KEY, Array.from(current));
    return current;
  }
  async function removeFromAllowlist(nodeId, ruleId) {
    const current = await loadAllowlist();
    current.delete(`${nodeId}::${ruleId}`);
    await linterStorage2.set(ALLOWLIST_KEY, Array.from(current));
    return current;
  }
  async function clearAllowlist() {
    await linterStorage2.delete(ALLOWLIST_KEY);
  }
  function filterAllowlisted(violations, allowlist) {
    if (allowlist.size === 0) return violations;
    return violations.filter((v) => !allowlist.has(`${v.nodeId}::${v.rule}`));
  }

  // src/shared/violation-types.ts
  function groupViolationsByRule(violations) {
    const groups = /* @__PURE__ */ new Map();
    for (const v of violations) {
      const existing = groups.get(v.rule);
      if (existing) {
        existing.count++;
        existing.violations.push(v);
      } else {
        groups.set(v.rule, {
          rule: v.rule,
          category: v.category,
          severity: v.severity,
          count: 1,
          violations: [v]
        });
      }
    }
    return Array.from(groups.values());
  }

  // node_modules/culori/src/rgb/parseNumber.js
  var parseNumber = (color, len) => {
    if (typeof color !== "number") return;
    if (len === 3) {
      return {
        mode: "rgb",
        r: (color >> 8 & 15 | color >> 4 & 240) / 255,
        g: (color >> 4 & 15 | color & 240) / 255,
        b: (color & 15 | color << 4 & 240) / 255
      };
    }
    if (len === 4) {
      return {
        mode: "rgb",
        r: (color >> 12 & 15 | color >> 8 & 240) / 255,
        g: (color >> 8 & 15 | color >> 4 & 240) / 255,
        b: (color >> 4 & 15 | color & 240) / 255,
        alpha: (color & 15 | color << 4 & 240) / 255
      };
    }
    if (len === 6) {
      return {
        mode: "rgb",
        r: (color >> 16 & 255) / 255,
        g: (color >> 8 & 255) / 255,
        b: (color & 255) / 255
      };
    }
    if (len === 8) {
      return {
        mode: "rgb",
        r: (color >> 24 & 255) / 255,
        g: (color >> 16 & 255) / 255,
        b: (color >> 8 & 255) / 255,
        alpha: (color & 255) / 255
      };
    }
  };
  var parseNumber_default = parseNumber;

  // node_modules/culori/src/colors/named.js
  var named = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    // Added in CSS Colors Level 4:
    // https://drafts.csswg.org/css-color/#changes-from-3
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074
  };
  var named_default = named;

  // node_modules/culori/src/rgb/parseNamed.js
  var parseNamed = (color) => {
    return parseNumber_default(named_default[color.toLowerCase()], 6);
  };
  var parseNamed_default = parseNamed;

  // node_modules/culori/src/rgb/parseHex.js
  var hex4 = /^#?([0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{4}|[0-9a-f]{3})$/i;
  var parseHex = (color) => {
    let match;
    return (match = color.match(hex4)) ? parseNumber_default(parseInt(match[1], 16), match[1].length) : void 0;
  };
  var parseHex_default = parseHex;

  // node_modules/culori/src/util/regex.js
  var num = "([+-]?\\d*\\.?\\d+(?:[eE][+-]?\\d+)?)";
  var num_none = `(?:${num}|none)`;
  var per = `${num}%`;
  var per_none = `(?:${num}%|none)`;
  var num_per = `(?:${num}%|${num})`;
  var num_per_none = `(?:${num}%|${num}|none)`;
  var hue = `(?:${num}(deg|grad|rad|turn)|${num})`;
  var hue_none = `(?:${num}(deg|grad|rad|turn)|${num}|none)`;
  var c = `\\s*,\\s*`;
  var rx_num_per_none = new RegExp("^" + num_per_none + "$");

  // node_modules/culori/src/rgb/parseRgbLegacy.js
  var rgb_num_old = new RegExp(
    `^rgba?\\(\\s*${num}${c}${num}${c}${num}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
  );
  var rgb_per_old = new RegExp(
    `^rgba?\\(\\s*${per}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
  );
  var parseRgbLegacy = (color) => {
    let res = { mode: "rgb" };
    let match;
    if (match = color.match(rgb_num_old)) {
      if (match[1] !== void 0) {
        res.r = match[1] / 255;
      }
      if (match[2] !== void 0) {
        res.g = match[2] / 255;
      }
      if (match[3] !== void 0) {
        res.b = match[3] / 255;
      }
    } else if (match = color.match(rgb_per_old)) {
      if (match[1] !== void 0) {
        res.r = match[1] / 100;
      }
      if (match[2] !== void 0) {
        res.g = match[2] / 100;
      }
      if (match[3] !== void 0) {
        res.b = match[3] / 100;
      }
    } else {
      return void 0;
    }
    if (match[4] !== void 0) {
      res.alpha = Math.max(0, Math.min(1, match[4] / 100));
    } else if (match[5] !== void 0) {
      res.alpha = Math.max(0, Math.min(1, +match[5]));
    }
    return res;
  };
  var parseRgbLegacy_default = parseRgbLegacy;

  // node_modules/culori/src/_prepare.js
  var prepare = (color, mode) => color === void 0 ? void 0 : typeof color !== "object" ? parse_default(color) : color.mode !== void 0 ? color : mode ? __spreadProps(__spreadValues({}, color), { mode }) : void 0;
  var prepare_default = prepare;

  // node_modules/culori/src/converter.js
  var converter = (target_mode = "rgb") => (color) => (color = prepare_default(color, target_mode)) !== void 0 ? (
    // if the color's mode corresponds to our target mode
    color.mode === target_mode ? (
      // then just return the color
      color
    ) : (
      // otherwise check to see if we have a dedicated
      // converter for the target mode
      converters[color.mode][target_mode] ? (
        // and return its result...
        converters[color.mode][target_mode](color)
      ) : (
        // ...otherwise pass through RGB as an intermediary step.
        // if the target mode is RGB...
        target_mode === "rgb" ? (
          // just return the RGB
          converters[color.mode].rgb(color)
        ) : (
          // otherwise convert color.mode -> RGB -> target_mode
          converters.rgb[target_mode](converters[color.mode].rgb(color))
        )
      )
    )
  ) : void 0;
  var converter_default = converter;

  // node_modules/culori/src/modes.js
  var converters = {};
  var modes = {};
  var parsers = [];
  var colorProfiles = {};
  var identity = (v) => v;
  var useMode = (definition29) => {
    converters[definition29.mode] = __spreadValues(__spreadValues({}, converters[definition29.mode]), definition29.toMode);
    Object.keys(definition29.fromMode || {}).forEach((k4) => {
      if (!converters[k4]) {
        converters[k4] = {};
      }
      converters[k4][definition29.mode] = definition29.fromMode[k4];
    });
    if (!definition29.ranges) {
      definition29.ranges = {};
    }
    if (!definition29.difference) {
      definition29.difference = {};
    }
    definition29.channels.forEach((channel) => {
      if (definition29.ranges[channel] === void 0) {
        definition29.ranges[channel] = [0, 1];
      }
      if (!definition29.interpolate[channel]) {
        throw new Error(`Missing interpolator for: ${channel}`);
      }
      if (typeof definition29.interpolate[channel] === "function") {
        definition29.interpolate[channel] = {
          use: definition29.interpolate[channel]
        };
      }
      if (!definition29.interpolate[channel].fixup) {
        definition29.interpolate[channel].fixup = identity;
      }
    });
    modes[definition29.mode] = definition29;
    (definition29.parse || []).forEach((parser) => {
      useParser(parser, definition29.mode);
    });
    return converter_default(definition29.mode);
  };
  var getMode = (mode) => modes[mode];
  var useParser = (parser, mode) => {
    if (typeof parser === "string") {
      if (!mode) {
        throw new Error(`'mode' required when 'parser' is a string`);
      }
      colorProfiles[parser] = mode;
    } else if (typeof parser === "function") {
      if (parsers.indexOf(parser) < 0) {
        parsers.push(parser);
      }
    }
  };

  // node_modules/culori/src/parse.js
  var IdentStartCodePoint = /[^\x00-\x7F]|[a-zA-Z_]/;
  var IdentCodePoint = /[^\x00-\x7F]|[-\w]/;
  var Tok = {
    Function: "function",
    Ident: "ident",
    Number: "number",
    Percentage: "percentage",
    ParenClose: ")",
    None: "none",
    Hue: "hue",
    Alpha: "alpha"
  };
  var _i = 0;
  function is_num(chars) {
    let ch = chars[_i];
    let ch1 = chars[_i + 1];
    if (ch === "-" || ch === "+") {
      return /\d/.test(ch1) || ch1 === "." && /\d/.test(chars[_i + 2]);
    }
    if (ch === ".") {
      return /\d/.test(ch1);
    }
    return /\d/.test(ch);
  }
  function is_ident(chars) {
    if (_i >= chars.length) {
      return false;
    }
    let ch = chars[_i];
    if (IdentStartCodePoint.test(ch)) {
      return true;
    }
    if (ch === "-") {
      if (chars.length - _i < 2) {
        return false;
      }
      let ch1 = chars[_i + 1];
      if (ch1 === "-" || IdentStartCodePoint.test(ch1)) {
        return true;
      }
      return false;
    }
    return false;
  }
  var huenits = {
    deg: 1,
    rad: 180 / Math.PI,
    grad: 9 / 10,
    turn: 360
  };
  function num2(chars) {
    let value = "";
    if (chars[_i] === "-" || chars[_i] === "+") {
      value += chars[_i++];
    }
    value += digits(chars);
    if (chars[_i] === "." && /\d/.test(chars[_i + 1])) {
      value += chars[_i++] + digits(chars);
    }
    if (chars[_i] === "e" || chars[_i] === "E") {
      if ((chars[_i + 1] === "-" || chars[_i + 1] === "+") && /\d/.test(chars[_i + 2])) {
        value += chars[_i++] + chars[_i++] + digits(chars);
      } else if (/\d/.test(chars[_i + 1])) {
        value += chars[_i++] + digits(chars);
      }
    }
    if (is_ident(chars)) {
      let id = ident(chars);
      if (id === "deg" || id === "rad" || id === "turn" || id === "grad") {
        return { type: Tok.Hue, value: value * huenits[id] };
      }
      return void 0;
    }
    if (chars[_i] === "%") {
      _i++;
      return { type: Tok.Percentage, value: +value };
    }
    return { type: Tok.Number, value: +value };
  }
  function digits(chars) {
    let v = "";
    while (/\d/.test(chars[_i])) {
      v += chars[_i++];
    }
    return v;
  }
  function ident(chars) {
    let v = "";
    while (_i < chars.length && IdentCodePoint.test(chars[_i])) {
      v += chars[_i++];
    }
    return v;
  }
  function identlike(chars) {
    let v = ident(chars);
    if (chars[_i] === "(") {
      _i++;
      return { type: Tok.Function, value: v };
    }
    if (v === "none") {
      return { type: Tok.None, value: void 0 };
    }
    return { type: Tok.Ident, value: v };
  }
  function tokenize(str = "") {
    let chars = str.trim();
    let tokens = [];
    let ch;
    _i = 0;
    while (_i < chars.length) {
      ch = chars[_i++];
      if (ch === "\n" || ch === "	" || ch === " ") {
        while (_i < chars.length && (chars[_i] === "\n" || chars[_i] === "	" || chars[_i] === " ")) {
          _i++;
        }
        continue;
      }
      if (ch === ",") {
        return void 0;
      }
      if (ch === ")") {
        tokens.push({ type: Tok.ParenClose });
        continue;
      }
      if (ch === "+") {
        _i--;
        if (is_num(chars)) {
          tokens.push(num2(chars));
          continue;
        }
        return void 0;
      }
      if (ch === "-") {
        _i--;
        if (is_num(chars)) {
          tokens.push(num2(chars));
          continue;
        }
        if (is_ident(chars)) {
          tokens.push({ type: Tok.Ident, value: ident(chars) });
          continue;
        }
        return void 0;
      }
      if (ch === ".") {
        _i--;
        if (is_num(chars)) {
          tokens.push(num2(chars));
          continue;
        }
        return void 0;
      }
      if (ch === "/") {
        while (_i < chars.length && (chars[_i] === "\n" || chars[_i] === "	" || chars[_i] === " ")) {
          _i++;
        }
        let alpha;
        if (is_num(chars)) {
          alpha = num2(chars);
          if (alpha.type !== Tok.Hue) {
            tokens.push({ type: Tok.Alpha, value: alpha });
            continue;
          }
        }
        if (is_ident(chars)) {
          if (ident(chars) === "none") {
            tokens.push({
              type: Tok.Alpha,
              value: { type: Tok.None, value: void 0 }
            });
            continue;
          }
        }
        return void 0;
      }
      if (/\d/.test(ch)) {
        _i--;
        tokens.push(num2(chars));
        continue;
      }
      if (IdentStartCodePoint.test(ch)) {
        _i--;
        tokens.push(identlike(chars));
        continue;
      }
      return void 0;
    }
    return tokens;
  }
  function parseColorSyntax(tokens) {
    tokens._i = 0;
    let token = tokens[tokens._i++];
    if (!token || token.type !== Tok.Function || token.value !== "color") {
      return void 0;
    }
    token = tokens[tokens._i++];
    if (token.type !== Tok.Ident) {
      return void 0;
    }
    const mode = colorProfiles[token.value];
    if (!mode) {
      return void 0;
    }
    const res = { mode };
    const coords = consumeCoords(tokens, false);
    if (!coords) {
      return void 0;
    }
    const channels = getMode(mode).channels;
    for (let ii = 0, c2, ch; ii < channels.length; ii++) {
      c2 = coords[ii];
      ch = channels[ii];
      if (c2.type !== Tok.None) {
        res[ch] = c2.type === Tok.Number ? c2.value : c2.value / 100;
        if (ch === "alpha") {
          res[ch] = Math.max(0, Math.min(1, res[ch]));
        }
      }
    }
    return res;
  }
  function consumeCoords(tokens, includeHue) {
    const coords = [];
    let token;
    while (tokens._i < tokens.length) {
      token = tokens[tokens._i++];
      if (token.type === Tok.None || token.type === Tok.Number || token.type === Tok.Alpha || token.type === Tok.Percentage || includeHue && token.type === Tok.Hue) {
        coords.push(token);
        continue;
      }
      if (token.type === Tok.ParenClose) {
        if (tokens._i < tokens.length) {
          return void 0;
        }
        continue;
      }
      return void 0;
    }
    if (coords.length < 3 || coords.length > 4) {
      return void 0;
    }
    if (coords.length === 4) {
      if (coords[3].type !== Tok.Alpha) {
        return void 0;
      }
      coords[3] = coords[3].value;
    }
    if (coords.length === 3) {
      coords.push({ type: Tok.None, value: void 0 });
    }
    return coords.every((c2) => c2.type !== Tok.Alpha) ? coords : void 0;
  }
  function parseModernSyntax(tokens, includeHue) {
    tokens._i = 0;
    let token = tokens[tokens._i++];
    if (!token || token.type !== Tok.Function) {
      return void 0;
    }
    let coords = consumeCoords(tokens, includeHue);
    if (!coords) {
      return void 0;
    }
    coords.unshift(token.value);
    return coords;
  }
  var parse = (color) => {
    if (typeof color !== "string") {
      return void 0;
    }
    const tokens = tokenize(color);
    const parsed = tokens ? parseModernSyntax(tokens, true) : void 0;
    let result = void 0;
    let i = 0;
    let len = parsers.length;
    while (i < len) {
      if ((result = parsers[i++](color, parsed)) !== void 0) {
        return result;
      }
    }
    return tokens ? parseColorSyntax(tokens) : void 0;
  };
  var parse_default = parse;

  // node_modules/culori/src/rgb/parseRgb.js
  function parseRgb(color, parsed) {
    if (!parsed || parsed[0] !== "rgb" && parsed[0] !== "rgba") {
      return void 0;
    }
    const res = { mode: "rgb" };
    const [, r, g, b, alpha] = parsed;
    if (r.type === Tok.Hue || g.type === Tok.Hue || b.type === Tok.Hue) {
      return void 0;
    }
    if (r.type !== Tok.None) {
      res.r = r.type === Tok.Number ? r.value / 255 : r.value / 100;
    }
    if (g.type !== Tok.None) {
      res.g = g.type === Tok.Number ? g.value / 255 : g.value / 100;
    }
    if (b.type !== Tok.None) {
      res.b = b.type === Tok.Number ? b.value / 255 : b.value / 100;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseRgb_default = parseRgb;

  // node_modules/culori/src/rgb/parseTransparent.js
  var parseTransparent = (c2) => c2 === "transparent" ? { mode: "rgb", r: 0, g: 0, b: 0, alpha: 0 } : void 0;
  var parseTransparent_default = parseTransparent;

  // node_modules/culori/src/interpolate/lerp.js
  var lerp = (a, b, t) => a + t * (b - a);

  // node_modules/culori/src/interpolate/piecewise.js
  var get_classes = (arr) => {
    let classes = [];
    for (let i = 0; i < arr.length - 1; i++) {
      let a = arr[i];
      let b = arr[i + 1];
      if (a === void 0 && b === void 0) {
        classes.push(void 0);
      } else if (a !== void 0 && b !== void 0) {
        classes.push([a, b]);
      } else {
        classes.push(a !== void 0 ? [a, a] : [b, b]);
      }
    }
    return classes;
  };
  var interpolatorPiecewise = (interpolator) => (arr) => {
    let classes = get_classes(arr);
    return (t) => {
      let cls = t * classes.length;
      let idx = t >= 1 ? classes.length - 1 : Math.max(Math.floor(cls), 0);
      let pair = classes[idx];
      return pair === void 0 ? void 0 : interpolator(pair[0], pair[1], cls - idx);
    };
  };

  // node_modules/culori/src/interpolate/linear.js
  var interpolatorLinear = interpolatorPiecewise(lerp);

  // node_modules/culori/src/fixup/alpha.js
  var fixupAlpha = (arr) => {
    let some_defined = false;
    let res = arr.map((v) => {
      if (v !== void 0) {
        some_defined = true;
        return v;
      }
      return 1;
    });
    return some_defined ? res : arr;
  };

  // node_modules/culori/src/rgb/definition.js
  var definition = {
    mode: "rgb",
    channels: ["r", "g", "b", "alpha"],
    parse: [
      parseRgb_default,
      parseHex_default,
      parseRgbLegacy_default,
      parseNamed_default,
      parseTransparent_default,
      "srgb"
    ],
    serialize: "srgb",
    interpolate: {
      r: interpolatorLinear,
      g: interpolatorLinear,
      b: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    gamut: true,
    white: { r: 1, g: 1, b: 1 },
    black: { r: 0, g: 0, b: 0 }
  };
  var definition_default = definition;

  // node_modules/culori/src/a98/convertA98ToXyz65.js
  var linearize = (v = 0) => Math.pow(Math.abs(v), 563 / 256) * Math.sign(v);
  var convertA98ToXyz65 = (a982) => {
    let r = linearize(a982.r);
    let g = linearize(a982.g);
    let b = linearize(a982.b);
    let res = {
      mode: "xyz65",
      x: 0.5766690429101305 * r + 0.1855582379065463 * g + 0.1882286462349947 * b,
      y: 0.297344975250536 * r + 0.6273635662554661 * g + 0.0752914584939979 * b,
      z: 0.0270313613864123 * r + 0.0706888525358272 * g + 0.9913375368376386 * b
    };
    if (a982.alpha !== void 0) {
      res.alpha = a982.alpha;
    }
    return res;
  };
  var convertA98ToXyz65_default = convertA98ToXyz65;

  // node_modules/culori/src/a98/convertXyz65ToA98.js
  var gamma = (v) => Math.pow(Math.abs(v), 256 / 563) * Math.sign(v);
  var convertXyz65ToA98 = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = {
      mode: "a98",
      r: gamma(
        x * 2.0415879038107465 - y * 0.5650069742788597 - 0.3447313507783297 * z
      ),
      g: gamma(
        x * -0.9692436362808798 + y * 1.8759675015077206 + 0.0415550574071756 * z
      ),
      b: gamma(
        x * 0.0134442806320312 - y * 0.1183623922310184 + 1.0151749943912058 * z
      )
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToA98_default = convertXyz65ToA98;

  // node_modules/culori/src/lrgb/convertRgbToLrgb.js
  var fn = (c2 = 0) => {
    const abs2 = Math.abs(c2);
    if (abs2 <= 0.04045) {
      return c2 / 12.92;
    }
    return (Math.sign(c2) || 1) * Math.pow((abs2 + 0.055) / 1.055, 2.4);
  };
  var convertRgbToLrgb = ({ r, g, b, alpha }) => {
    let res = {
      mode: "lrgb",
      r: fn(r),
      g: fn(g),
      b: fn(b)
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertRgbToLrgb_default = convertRgbToLrgb;

  // node_modules/culori/src/xyz65/convertRgbToXyz65.js
  var convertRgbToXyz65 = (rgb2) => {
    let { r, g, b, alpha } = convertRgbToLrgb_default(rgb2);
    let res = {
      mode: "xyz65",
      x: 0.4123907992659593 * r + 0.357584339383878 * g + 0.1804807884018343 * b,
      y: 0.2126390058715102 * r + 0.715168678767756 * g + 0.0721923153607337 * b,
      z: 0.0193308187155918 * r + 0.119194779794626 * g + 0.9505321522496607 * b
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertRgbToXyz65_default = convertRgbToXyz65;

  // node_modules/culori/src/lrgb/convertLrgbToRgb.js
  var fn2 = (c2 = 0) => {
    const abs2 = Math.abs(c2);
    if (abs2 > 31308e-7) {
      return (Math.sign(c2) || 1) * (1.055 * Math.pow(abs2, 1 / 2.4) - 0.055);
    }
    return c2 * 12.92;
  };
  var convertLrgbToRgb = ({ r, g, b, alpha }, mode = "rgb") => {
    let res = {
      mode,
      r: fn2(r),
      g: fn2(g),
      b: fn2(b)
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertLrgbToRgb_default = convertLrgbToRgb;

  // node_modules/culori/src/xyz65/convertXyz65ToRgb.js
  var convertXyz65ToRgb = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = convertLrgbToRgb_default({
      r: x * 3.2409699419045226 - y * 1.537383177570094 - 0.4986107602930034 * z,
      g: x * -0.9692436362808796 + y * 1.8759675015077204 + 0.0415550574071756 * z,
      b: x * 0.0556300796969936 - y * 0.2039769588889765 + 1.0569715142428784 * z
    });
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToRgb_default = convertXyz65ToRgb;

  // node_modules/culori/src/a98/definition.js
  var definition2 = __spreadProps(__spreadValues({}, definition_default), {
    mode: "a98",
    parse: ["a98-rgb"],
    serialize: "a98-rgb",
    fromMode: {
      rgb: (color) => convertXyz65ToA98_default(convertRgbToXyz65_default(color)),
      xyz65: convertXyz65ToA98_default
    },
    toMode: {
      rgb: (color) => convertXyz65ToRgb_default(convertA98ToXyz65_default(color)),
      xyz65: convertA98ToXyz65_default
    }
  });
  var definition_default2 = definition2;

  // node_modules/culori/src/util/normalizeHue.js
  var normalizeHue = (hue3) => (hue3 = hue3 % 360) < 0 ? hue3 + 360 : hue3;
  var normalizeHue_default = normalizeHue;

  // node_modules/culori/src/fixup/hue.js
  var hue2 = (hues, fn5) => {
    return hues.map((hue3, idx, arr) => {
      if (hue3 === void 0) {
        return hue3;
      }
      let normalized = normalizeHue_default(hue3);
      if (idx === 0 || hues[idx - 1] === void 0) {
        return normalized;
      }
      return fn5(normalized - normalizeHue_default(arr[idx - 1]));
    }).reduce((acc, curr) => {
      if (!acc.length || curr === void 0 || acc[acc.length - 1] === void 0) {
        acc.push(curr);
        return acc;
      }
      acc.push(curr + acc[acc.length - 1]);
      return acc;
    }, []);
  };
  var fixupHueShorter = (arr) => hue2(arr, (d) => Math.abs(d) <= 180 ? d : d - 360 * Math.sign(d));

  // node_modules/culori/src/cubehelix/constants.js
  var M = [-0.14861, 1.78277, -0.29227, -0.90649, 1.97294, 0];
  var degToRad = Math.PI / 180;
  var radToDeg = 180 / Math.PI;

  // node_modules/culori/src/cubehelix/convertRgbToCubehelix.js
  var DE = M[3] * M[4];
  var BE = M[1] * M[4];
  var BCAD = M[1] * M[2] - M[0] * M[3];
  var convertRgbToCubehelix = ({ r, g, b, alpha }) => {
    if (r === void 0) r = 0;
    if (g === void 0) g = 0;
    if (b === void 0) b = 0;
    let l = (BCAD * b + r * DE - g * BE) / (BCAD + DE - BE);
    let x = b - l;
    let y = (M[4] * (g - l) - M[2] * x) / M[3];
    let res = {
      mode: "cubehelix",
      l,
      s: l === 0 || l === 1 ? void 0 : Math.sqrt(x * x + y * y) / (M[4] * l * (1 - l))
    };
    if (res.s) res.h = Math.atan2(y, x) * radToDeg - 120;
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertRgbToCubehelix_default = convertRgbToCubehelix;

  // node_modules/culori/src/cubehelix/convertCubehelixToRgb.js
  var convertCubehelixToRgb = ({ h, s, l, alpha }) => {
    let res = { mode: "rgb" };
    h = (h === void 0 ? 0 : h + 120) * degToRad;
    if (l === void 0) l = 0;
    let amp = s === void 0 ? 0 : s * l * (1 - l);
    let cosh = Math.cos(h);
    let sinh = Math.sin(h);
    res.r = l + amp * (M[0] * cosh + M[1] * sinh);
    res.g = l + amp * (M[2] * cosh + M[3] * sinh);
    res.b = l + amp * (M[4] * cosh + M[5] * sinh);
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertCubehelixToRgb_default = convertCubehelixToRgb;

  // node_modules/culori/src/difference.js
  var differenceHueSaturation = (std, smp) => {
    if (std.h === void 0 || smp.h === void 0 || !std.s || !smp.s) {
      return 0;
    }
    let std_h = normalizeHue_default(std.h);
    let smp_h = normalizeHue_default(smp.h);
    let dH = Math.sin((smp_h - std_h + 360) / 2 * Math.PI / 180);
    return 2 * Math.sqrt(std.s * smp.s) * dH;
  };
  var differenceHueNaive = (std, smp) => {
    if (std.h === void 0 || smp.h === void 0) {
      return 0;
    }
    let std_h = normalizeHue_default(std.h);
    let smp_h = normalizeHue_default(smp.h);
    if (Math.abs(smp_h - std_h) > 180) {
      return std_h - (smp_h - 360 * Math.sign(smp_h - std_h));
    }
    return smp_h - std_h;
  };
  var differenceHueChroma = (std, smp) => {
    if (std.h === void 0 || smp.h === void 0 || !std.c || !smp.c) {
      return 0;
    }
    let std_h = normalizeHue_default(std.h);
    let smp_h = normalizeHue_default(smp.h);
    let dH = Math.sin((smp_h - std_h + 360) / 2 * Math.PI / 180);
    return 2 * Math.sqrt(std.c * smp.c) * dH;
  };
  var differenceEuclidean = (mode = "rgb", weights = [1, 1, 1, 0]) => {
    let def = getMode(mode);
    let channels = def.channels;
    let diffs = def.difference;
    let conv = converter_default(mode);
    return (std, smp) => {
      let ConvStd = conv(std);
      let ConvSmp = conv(smp);
      return Math.sqrt(
        channels.reduce((sum, k4, idx) => {
          let delta = diffs[k4] ? diffs[k4](ConvStd, ConvSmp) : ConvStd[k4] - ConvSmp[k4];
          return sum + (weights[idx] || 0) * Math.pow(isNaN(delta) ? 0 : delta, 2);
        }, 0)
      );
    };
  };
  var differenceCiede2000 = (Kl = 1, Kc = 1, Kh = 1) => {
    let lab2 = converter_default("lab65");
    return (std, smp) => {
      let LabStd = lab2(std);
      let LabSmp = lab2(smp);
      let lStd = LabStd.l;
      let aStd = LabStd.a;
      let bStd = LabStd.b;
      let cStd = Math.sqrt(aStd * aStd + bStd * bStd);
      let lSmp = LabSmp.l;
      let aSmp = LabSmp.a;
      let bSmp = LabSmp.b;
      let cSmp = Math.sqrt(aSmp * aSmp + bSmp * bSmp);
      let cAvg = (cStd + cSmp) / 2;
      let G = 0.5 * (1 - Math.sqrt(
        Math.pow(cAvg, 7) / (Math.pow(cAvg, 7) + Math.pow(25, 7))
      ));
      let apStd = aStd * (1 + G);
      let apSmp = aSmp * (1 + G);
      let cpStd = Math.sqrt(apStd * apStd + bStd * bStd);
      let cpSmp = Math.sqrt(apSmp * apSmp + bSmp * bSmp);
      let hpStd = Math.abs(apStd) + Math.abs(bStd) === 0 ? 0 : Math.atan2(bStd, apStd);
      hpStd += (hpStd < 0) * 2 * Math.PI;
      let hpSmp = Math.abs(apSmp) + Math.abs(bSmp) === 0 ? 0 : Math.atan2(bSmp, apSmp);
      hpSmp += (hpSmp < 0) * 2 * Math.PI;
      let dL = lSmp - lStd;
      let dC = cpSmp - cpStd;
      let dhp = cpStd * cpSmp === 0 ? 0 : hpSmp - hpStd;
      dhp -= (dhp > Math.PI) * 2 * Math.PI;
      dhp += (dhp < -Math.PI) * 2 * Math.PI;
      let dH = 2 * Math.sqrt(cpStd * cpSmp) * Math.sin(dhp / 2);
      let Lp = (lStd + lSmp) / 2;
      let Cp = (cpStd + cpSmp) / 2;
      let hp;
      if (cpStd * cpSmp === 0) {
        hp = hpStd + hpSmp;
      } else {
        hp = (hpStd + hpSmp) / 2;
        hp -= (Math.abs(hpStd - hpSmp) > Math.PI) * Math.PI;
        hp += (hp < 0) * 2 * Math.PI;
      }
      let Lpm50 = Math.pow(Lp - 50, 2);
      let T = 1 - 0.17 * Math.cos(hp - Math.PI / 6) + 0.24 * Math.cos(2 * hp) + 0.32 * Math.cos(3 * hp + Math.PI / 30) - 0.2 * Math.cos(4 * hp - 63 * Math.PI / 180);
      let Sl = 1 + 0.015 * Lpm50 / Math.sqrt(20 + Lpm50);
      let Sc = 1 + 0.045 * Cp;
      let Sh = 1 + 0.015 * Cp * T;
      let deltaTheta = 30 * Math.PI / 180 * Math.exp(-1 * Math.pow((180 / Math.PI * hp - 275) / 25, 2));
      let Rc = 2 * Math.sqrt(Math.pow(Cp, 7) / (Math.pow(Cp, 7) + Math.pow(25, 7)));
      let Rt = -1 * Math.sin(2 * deltaTheta) * Rc;
      return Math.sqrt(
        Math.pow(dL / (Kl * Sl), 2) + Math.pow(dC / (Kc * Sc), 2) + Math.pow(dH / (Kh * Sh), 2) + Rt * dC / (Kc * Sc) * dH / (Kh * Sh)
      );
    };
  };

  // node_modules/culori/src/average.js
  var averageAngle = (val) => {
    let sum = val.reduce(
      (sum2, val2) => {
        if (val2 !== void 0) {
          let rad = val2 * Math.PI / 180;
          sum2.sin += Math.sin(rad);
          sum2.cos += Math.cos(rad);
        }
        return sum2;
      },
      { sin: 0, cos: 0 }
    );
    let angle = Math.atan2(sum.sin, sum.cos) * 180 / Math.PI;
    return angle < 0 ? 360 + angle : angle;
  };

  // node_modules/culori/src/cubehelix/definition.js
  var definition3 = {
    mode: "cubehelix",
    channels: ["h", "s", "l", "alpha"],
    parse: ["--cubehelix"],
    serialize: "--cubehelix",
    ranges: {
      h: [0, 360],
      s: [0, 4.614],
      l: [0, 1]
    },
    fromMode: {
      rgb: convertRgbToCubehelix_default
    },
    toMode: {
      rgb: convertCubehelixToRgb_default
    },
    interpolate: {
      h: {
        use: interpolatorLinear,
        fixup: fixupHueShorter
      },
      s: interpolatorLinear,
      l: interpolatorLinear,
      alpha: {
        use: interpolatorLinear,
        fixup: fixupAlpha
      }
    },
    difference: {
      h: differenceHueSaturation
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default3 = definition3;

  // node_modules/culori/src/lch/convertLabToLch.js
  var convertLabToLch = ({ l, a, b, alpha }, mode = "lch") => {
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let c2 = Math.sqrt(a * a + b * b);
    let res = { mode, l, c: c2 };
    if (c2) res.h = normalizeHue_default(Math.atan2(b, a) * 180 / Math.PI);
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertLabToLch_default = convertLabToLch;

  // node_modules/culori/src/lch/convertLchToLab.js
  var convertLchToLab = ({ l, c: c2, h, alpha }, mode = "lab") => {
    if (h === void 0) h = 0;
    let res = {
      mode,
      l,
      a: c2 ? c2 * Math.cos(h / 180 * Math.PI) : 0,
      b: c2 ? c2 * Math.sin(h / 180 * Math.PI) : 0
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertLchToLab_default = convertLchToLab;

  // node_modules/culori/src/xyz65/constants.js
  var k = Math.pow(29, 3) / Math.pow(3, 3);
  var e = Math.pow(6, 3) / Math.pow(29, 3);

  // node_modules/culori/src/constants.js
  var D50 = {
    X: 0.3457 / 0.3585,
    Y: 1,
    Z: (1 - 0.3457 - 0.3585) / 0.3585
  };
  var D65 = {
    X: 0.3127 / 0.329,
    Y: 1,
    Z: (1 - 0.3127 - 0.329) / 0.329
  };
  var k2 = Math.pow(29, 3) / Math.pow(3, 3);
  var e2 = Math.pow(6, 3) / Math.pow(29, 3);

  // node_modules/culori/src/lab65/convertLab65ToXyz65.js
  var fn3 = (v) => Math.pow(v, 3) > e ? Math.pow(v, 3) : (116 * v - 16) / k;
  var convertLab65ToXyz65 = ({ l, a, b, alpha }) => {
    if (l === void 0) l = 0;
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let fy = (l + 16) / 116;
    let fx = a / 500 + fy;
    let fz = fy - b / 200;
    let res = {
      mode: "xyz65",
      x: fn3(fx) * D65.X,
      y: fn3(fy) * D65.Y,
      z: fn3(fz) * D65.Z
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertLab65ToXyz65_default = convertLab65ToXyz65;

  // node_modules/culori/src/lab65/convertLab65ToRgb.js
  var convertLab65ToRgb = (lab2) => convertXyz65ToRgb_default(convertLab65ToXyz65_default(lab2));
  var convertLab65ToRgb_default = convertLab65ToRgb;

  // node_modules/culori/src/lab65/convertXyz65ToLab65.js
  var f = (value) => value > e ? Math.cbrt(value) : (k * value + 16) / 116;
  var convertXyz65ToLab65 = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let f0 = f(x / D65.X);
    let f1 = f(y / D65.Y);
    let f22 = f(z / D65.Z);
    let res = {
      mode: "lab65",
      l: 116 * f1 - 16,
      a: 500 * (f0 - f1),
      b: 200 * (f1 - f22)
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToLab65_default = convertXyz65ToLab65;

  // node_modules/culori/src/lab65/convertRgbToLab65.js
  var convertRgbToLab65 = (rgb2) => {
    let res = convertXyz65ToLab65_default(convertRgbToXyz65_default(rgb2));
    if (rgb2.r === rgb2.b && rgb2.b === rgb2.g) {
      res.a = res.b = 0;
    }
    return res;
  };
  var convertRgbToLab65_default = convertRgbToLab65;

  // node_modules/culori/src/dlch/constants.js
  var kE = 1;
  var kCH = 1;
  var \u03B8 = 26 / 180 * Math.PI;
  var cos\u03B8 = Math.cos(\u03B8);
  var sin\u03B8 = Math.sin(\u03B8);
  var factor = 100 / Math.log(139 / 100);

  // node_modules/culori/src/dlch/convertDlchToLab65.js
  var convertDlchToLab65 = ({ l, c: c2, h, alpha }) => {
    if (l === void 0) l = 0;
    if (c2 === void 0) c2 = 0;
    if (h === void 0) h = 0;
    let res = {
      mode: "lab65",
      l: (Math.exp(l * kE / factor) - 1) / 39e-4
    };
    let G = (Math.exp(0.0435 * c2 * kCH * kE) - 1) / 0.075;
    let e4 = G * Math.cos(h / 180 * Math.PI - \u03B8);
    let f3 = G * Math.sin(h / 180 * Math.PI - \u03B8);
    res.a = e4 * cos\u03B8 - f3 / 0.83 * sin\u03B8;
    res.b = e4 * sin\u03B8 + f3 / 0.83 * cos\u03B8;
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertDlchToLab65_default = convertDlchToLab65;

  // node_modules/culori/src/dlch/convertLab65ToDlch.js
  var convertLab65ToDlch = ({ l, a, b, alpha }) => {
    if (l === void 0) l = 0;
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let e4 = a * cos\u03B8 + b * sin\u03B8;
    let f3 = 0.83 * (b * cos\u03B8 - a * sin\u03B8);
    let G = Math.sqrt(e4 * e4 + f3 * f3);
    let res = {
      mode: "dlch",
      l: factor / kE * Math.log(1 + 39e-4 * l),
      c: Math.log(1 + 0.075 * G) / (0.0435 * kCH * kE)
    };
    if (res.c) {
      res.h = normalizeHue_default((Math.atan2(f3, e4) + \u03B8) / Math.PI * 180);
    }
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertLab65ToDlch_default = convertLab65ToDlch;

  // node_modules/culori/src/dlab/definition.js
  var convertDlabToLab65 = (c2) => convertDlchToLab65_default(convertLabToLch_default(c2, "dlch"));
  var convertLab65ToDlab = (c2) => convertLchToLab_default(convertLab65ToDlch_default(c2), "dlab");
  var definition4 = {
    mode: "dlab",
    parse: ["--din99o-lab"],
    serialize: "--din99o-lab",
    toMode: {
      lab65: convertDlabToLab65,
      rgb: (c2) => convertLab65ToRgb_default(convertDlabToLab65(c2))
    },
    fromMode: {
      lab65: convertLab65ToDlab,
      rgb: (c2) => convertLab65ToDlab(convertRgbToLab65_default(c2))
    },
    channels: ["l", "a", "b", "alpha"],
    ranges: {
      l: [0, 100],
      a: [-40.09, 45.501],
      b: [-40.469, 44.344]
    },
    interpolate: {
      l: interpolatorLinear,
      a: interpolatorLinear,
      b: interpolatorLinear,
      alpha: {
        use: interpolatorLinear,
        fixup: fixupAlpha
      }
    }
  };
  var definition_default4 = definition4;

  // node_modules/culori/src/dlch/definition.js
  var definition5 = {
    mode: "dlch",
    parse: ["--din99o-lch"],
    serialize: "--din99o-lch",
    toMode: {
      lab65: convertDlchToLab65_default,
      dlab: (c2) => convertLchToLab_default(c2, "dlab"),
      rgb: (c2) => convertLab65ToRgb_default(convertDlchToLab65_default(c2))
    },
    fromMode: {
      lab65: convertLab65ToDlch_default,
      dlab: (c2) => convertLabToLch_default(c2, "dlch"),
      rgb: (c2) => convertLab65ToDlch_default(convertRgbToLab65_default(c2))
    },
    channels: ["l", "c", "h", "alpha"],
    ranges: {
      l: [0, 100],
      c: [0, 51.484],
      h: [0, 360]
    },
    interpolate: {
      l: interpolatorLinear,
      c: interpolatorLinear,
      h: {
        use: interpolatorLinear,
        fixup: fixupHueShorter
      },
      alpha: {
        use: interpolatorLinear,
        fixup: fixupAlpha
      }
    },
    difference: {
      h: differenceHueChroma
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default5 = definition5;

  // node_modules/culori/src/hsi/convertHsiToRgb.js
  function convertHsiToRgb({ h, s, i, alpha }) {
    h = normalizeHue_default(h !== void 0 ? h : 0);
    if (s === void 0) s = 0;
    if (i === void 0) i = 0;
    let f3 = Math.abs(h / 60 % 2 - 1);
    let res;
    switch (Math.floor(h / 60)) {
      case 0:
        res = {
          r: i * (1 + s * (3 / (2 - f3) - 1)),
          g: i * (1 + s * (3 * (1 - f3) / (2 - f3) - 1)),
          b: i * (1 - s)
        };
        break;
      case 1:
        res = {
          r: i * (1 + s * (3 * (1 - f3) / (2 - f3) - 1)),
          g: i * (1 + s * (3 / (2 - f3) - 1)),
          b: i * (1 - s)
        };
        break;
      case 2:
        res = {
          r: i * (1 - s),
          g: i * (1 + s * (3 / (2 - f3) - 1)),
          b: i * (1 + s * (3 * (1 - f3) / (2 - f3) - 1))
        };
        break;
      case 3:
        res = {
          r: i * (1 - s),
          g: i * (1 + s * (3 * (1 - f3) / (2 - f3) - 1)),
          b: i * (1 + s * (3 / (2 - f3) - 1))
        };
        break;
      case 4:
        res = {
          r: i * (1 + s * (3 * (1 - f3) / (2 - f3) - 1)),
          g: i * (1 - s),
          b: i * (1 + s * (3 / (2 - f3) - 1))
        };
        break;
      case 5:
        res = {
          r: i * (1 + s * (3 / (2 - f3) - 1)),
          g: i * (1 - s),
          b: i * (1 + s * (3 * (1 - f3) / (2 - f3) - 1))
        };
        break;
      default:
        res = { r: i * (1 - s), g: i * (1 - s), b: i * (1 - s) };
    }
    res.mode = "rgb";
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  }

  // node_modules/culori/src/hsi/convertRgbToHsi.js
  function convertRgbToHsi({ r, g, b, alpha }) {
    if (r === void 0) r = 0;
    if (g === void 0) g = 0;
    if (b === void 0) b = 0;
    let M3 = Math.max(r, g, b), m = Math.min(r, g, b);
    let res = {
      mode: "hsi",
      s: r + g + b === 0 ? 0 : 1 - 3 * m / (r + g + b),
      i: (r + g + b) / 3
    };
    if (M3 - m !== 0)
      res.h = (M3 === r ? (g - b) / (M3 - m) + (g < b) * 6 : M3 === g ? (b - r) / (M3 - m) + 2 : (r - g) / (M3 - m) + 4) * 60;
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  }

  // node_modules/culori/src/hsi/definition.js
  var definition6 = {
    mode: "hsi",
    toMode: {
      rgb: convertHsiToRgb
    },
    parse: ["--hsi"],
    serialize: "--hsi",
    fromMode: {
      rgb: convertRgbToHsi
    },
    channels: ["h", "s", "i", "alpha"],
    ranges: {
      h: [0, 360]
    },
    gamut: "rgb",
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      s: interpolatorLinear,
      i: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueSaturation
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default6 = definition6;

  // node_modules/culori/src/hsl/convertHslToRgb.js
  function convertHslToRgb({ h, s, l, alpha }) {
    h = normalizeHue_default(h !== void 0 ? h : 0);
    if (s === void 0) s = 0;
    if (l === void 0) l = 0;
    let m1 = l + s * (l < 0.5 ? l : 1 - l);
    let m2 = m1 - (m1 - l) * 2 * Math.abs(h / 60 % 2 - 1);
    let res;
    switch (Math.floor(h / 60)) {
      case 0:
        res = { r: m1, g: m2, b: 2 * l - m1 };
        break;
      case 1:
        res = { r: m2, g: m1, b: 2 * l - m1 };
        break;
      case 2:
        res = { r: 2 * l - m1, g: m1, b: m2 };
        break;
      case 3:
        res = { r: 2 * l - m1, g: m2, b: m1 };
        break;
      case 4:
        res = { r: m2, g: 2 * l - m1, b: m1 };
        break;
      case 5:
        res = { r: m1, g: 2 * l - m1, b: m2 };
        break;
      default:
        res = { r: 2 * l - m1, g: 2 * l - m1, b: 2 * l - m1 };
    }
    res.mode = "rgb";
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  }

  // node_modules/culori/src/hsl/convertRgbToHsl.js
  function convertRgbToHsl({ r, g, b, alpha }) {
    if (r === void 0) r = 0;
    if (g === void 0) g = 0;
    if (b === void 0) b = 0;
    let M3 = Math.max(r, g, b), m = Math.min(r, g, b);
    let res = {
      mode: "hsl",
      s: M3 === m ? 0 : (M3 - m) / (1 - Math.abs(M3 + m - 1)),
      l: 0.5 * (M3 + m)
    };
    if (M3 - m !== 0)
      res.h = (M3 === r ? (g - b) / (M3 - m) + (g < b) * 6 : M3 === g ? (b - r) / (M3 - m) + 2 : (r - g) / (M3 - m) + 4) * 60;
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  }

  // node_modules/culori/src/util/hue.js
  var hueToDeg = (val, unit) => {
    switch (unit) {
      case "deg":
        return +val;
      case "rad":
        return val / Math.PI * 180;
      case "grad":
        return val / 10 * 9;
      case "turn":
        return val * 360;
    }
  };
  var hue_default = hueToDeg;

  // node_modules/culori/src/hsl/parseHslLegacy.js
  var hsl_old = new RegExp(
    `^hsla?\\(\\s*${hue}${c}${per}${c}${per}\\s*(?:,\\s*${num_per}\\s*)?\\)$`
  );
  var parseHslLegacy = (color) => {
    let match = color.match(hsl_old);
    if (!match) return;
    let res = { mode: "hsl" };
    if (match[3] !== void 0) {
      res.h = +match[3];
    } else if (match[1] !== void 0 && match[2] !== void 0) {
      res.h = hue_default(match[1], match[2]);
    }
    if (match[4] !== void 0) {
      res.s = Math.min(Math.max(0, match[4] / 100), 1);
    }
    if (match[5] !== void 0) {
      res.l = Math.min(Math.max(0, match[5] / 100), 1);
    }
    if (match[6] !== void 0) {
      res.alpha = Math.max(0, Math.min(1, match[6] / 100));
    } else if (match[7] !== void 0) {
      res.alpha = Math.max(0, Math.min(1, +match[7]));
    }
    return res;
  };
  var parseHslLegacy_default = parseHslLegacy;

  // node_modules/culori/src/hsl/parseHsl.js
  function parseHsl(color, parsed) {
    if (!parsed || parsed[0] !== "hsl" && parsed[0] !== "hsla") {
      return void 0;
    }
    const res = { mode: "hsl" };
    const [, h, s, l, alpha] = parsed;
    if (h.type !== Tok.None) {
      if (h.type === Tok.Percentage) {
        return void 0;
      }
      res.h = h.value;
    }
    if (s.type !== Tok.None) {
      if (s.type === Tok.Hue) {
        return void 0;
      }
      res.s = s.value / 100;
    }
    if (l.type !== Tok.None) {
      if (l.type === Tok.Hue) {
        return void 0;
      }
      res.l = l.value / 100;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseHsl_default = parseHsl;

  // node_modules/culori/src/hsl/definition.js
  var definition7 = {
    mode: "hsl",
    toMode: {
      rgb: convertHslToRgb
    },
    fromMode: {
      rgb: convertRgbToHsl
    },
    channels: ["h", "s", "l", "alpha"],
    ranges: {
      h: [0, 360]
    },
    gamut: "rgb",
    parse: [parseHsl_default, parseHslLegacy_default],
    serialize: (c2) => `hsl(${c2.h !== void 0 ? c2.h : "none"} ${c2.s !== void 0 ? c2.s * 100 + "%" : "none"} ${c2.l !== void 0 ? c2.l * 100 + "%" : "none"}${c2.alpha < 1 ? ` / ${c2.alpha}` : ""})`,
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      s: interpolatorLinear,
      l: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueSaturation
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default7 = definition7;

  // node_modules/culori/src/hsv/convertHsvToRgb.js
  function convertHsvToRgb({ h, s, v, alpha }) {
    h = normalizeHue_default(h !== void 0 ? h : 0);
    if (s === void 0) s = 0;
    if (v === void 0) v = 0;
    let f3 = Math.abs(h / 60 % 2 - 1);
    let res;
    switch (Math.floor(h / 60)) {
      case 0:
        res = { r: v, g: v * (1 - s * f3), b: v * (1 - s) };
        break;
      case 1:
        res = { r: v * (1 - s * f3), g: v, b: v * (1 - s) };
        break;
      case 2:
        res = { r: v * (1 - s), g: v, b: v * (1 - s * f3) };
        break;
      case 3:
        res = { r: v * (1 - s), g: v * (1 - s * f3), b: v };
        break;
      case 4:
        res = { r: v * (1 - s * f3), g: v * (1 - s), b: v };
        break;
      case 5:
        res = { r: v, g: v * (1 - s), b: v * (1 - s * f3) };
        break;
      default:
        res = { r: v * (1 - s), g: v * (1 - s), b: v * (1 - s) };
    }
    res.mode = "rgb";
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  }

  // node_modules/culori/src/hsv/convertRgbToHsv.js
  function convertRgbToHsv({ r, g, b, alpha }) {
    if (r === void 0) r = 0;
    if (g === void 0) g = 0;
    if (b === void 0) b = 0;
    let M3 = Math.max(r, g, b), m = Math.min(r, g, b);
    let res = {
      mode: "hsv",
      s: M3 === 0 ? 0 : 1 - m / M3,
      v: M3
    };
    if (M3 - m !== 0)
      res.h = (M3 === r ? (g - b) / (M3 - m) + (g < b) * 6 : M3 === g ? (b - r) / (M3 - m) + 2 : (r - g) / (M3 - m) + 4) * 60;
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  }

  // node_modules/culori/src/hsv/definition.js
  var definition8 = {
    mode: "hsv",
    toMode: {
      rgb: convertHsvToRgb
    },
    parse: ["--hsv"],
    serialize: "--hsv",
    fromMode: {
      rgb: convertRgbToHsv
    },
    channels: ["h", "s", "v", "alpha"],
    ranges: {
      h: [0, 360]
    },
    gamut: "rgb",
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      s: interpolatorLinear,
      v: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueSaturation
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default8 = definition8;

  // node_modules/culori/src/hwb/convertHwbToRgb.js
  function convertHwbToRgb({ h, w, b, alpha }) {
    if (w === void 0) w = 0;
    if (b === void 0) b = 0;
    if (w + b > 1) {
      let s = w + b;
      w /= s;
      b /= s;
    }
    return convertHsvToRgb({
      h,
      s: b === 1 ? 1 : 1 - w / (1 - b),
      v: 1 - b,
      alpha
    });
  }

  // node_modules/culori/src/hwb/convertRgbToHwb.js
  function convertRgbToHwb(rgba) {
    let hsv2 = convertRgbToHsv(rgba);
    if (hsv2 === void 0) return void 0;
    let s = hsv2.s !== void 0 ? hsv2.s : 0;
    let v = hsv2.v !== void 0 ? hsv2.v : 0;
    let res = {
      mode: "hwb",
      w: (1 - s) * v,
      b: 1 - v
    };
    if (hsv2.h !== void 0) res.h = hsv2.h;
    if (hsv2.alpha !== void 0) res.alpha = hsv2.alpha;
    return res;
  }

  // node_modules/culori/src/hwb/parseHwb.js
  function ParseHwb(color, parsed) {
    if (!parsed || parsed[0] !== "hwb") {
      return void 0;
    }
    const res = { mode: "hwb" };
    const [, h, w, b, alpha] = parsed;
    if (h.type !== Tok.None) {
      if (h.type === Tok.Percentage) {
        return void 0;
      }
      res.h = h.value;
    }
    if (w.type !== Tok.None) {
      if (w.type === Tok.Hue) {
        return void 0;
      }
      res.w = w.value / 100;
    }
    if (b.type !== Tok.None) {
      if (b.type === Tok.Hue) {
        return void 0;
      }
      res.b = b.value / 100;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseHwb_default = ParseHwb;

  // node_modules/culori/src/hwb/definition.js
  var definition9 = {
    mode: "hwb",
    toMode: {
      rgb: convertHwbToRgb
    },
    fromMode: {
      rgb: convertRgbToHwb
    },
    channels: ["h", "w", "b", "alpha"],
    ranges: {
      h: [0, 360]
    },
    gamut: "rgb",
    parse: [parseHwb_default],
    serialize: (c2) => `hwb(${c2.h !== void 0 ? c2.h : "none"} ${c2.w !== void 0 ? c2.w * 100 + "%" : "none"} ${c2.b !== void 0 ? c2.b * 100 + "%" : "none"}${c2.alpha < 1 ? ` / ${c2.alpha}` : ""})`,
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      w: interpolatorLinear,
      b: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueNaive
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default9 = definition9;

  // node_modules/culori/src/hdr/constants.js
  var YW = 203;

  // node_modules/culori/src/hdr/transfer.js
  var M1 = 0.1593017578125;
  var M2 = 78.84375;
  var C1 = 0.8359375;
  var C2 = 18.8515625;
  var C3 = 18.6875;
  function transferPqDecode(v) {
    if (v < 0) return 0;
    const c2 = Math.pow(v, 1 / M2);
    return 1e4 * Math.pow(Math.max(0, c2 - C1) / (C2 - C3 * c2), 1 / M1);
  }
  function transferPqEncode(v) {
    if (v < 0) return 0;
    const c2 = Math.pow(v / 1e4, M1);
    return Math.pow((C1 + C2 * c2) / (1 + C3 * c2), M2);
  }

  // node_modules/culori/src/itp/convertItpToXyz65.js
  var toRel = (c2) => Math.max(c2 / YW, 0);
  var convertItpToXyz65 = ({ i, t, p: p4, alpha }) => {
    if (i === void 0) i = 0;
    if (t === void 0) t = 0;
    if (p4 === void 0) p4 = 0;
    const l = transferPqDecode(
      i + 0.008609037037932761 * t + 0.11102962500302593 * p4
    );
    const m = transferPqDecode(
      i - 0.00860903703793275 * t - 0.11102962500302599 * p4
    );
    const s = transferPqDecode(
      i + 0.5600313357106791 * t - 0.32062717498731885 * p4
    );
    const res = {
      mode: "xyz65",
      x: toRel(
        2.070152218389422 * l - 1.3263473389671556 * m + 0.2066510476294051 * s
      ),
      y: toRel(
        0.3647385209748074 * l + 0.680566024947227 * m - 0.0453045459220346 * s
      ),
      z: toRel(
        -0.049747207535812 * l - 0.0492609666966138 * m + 1.1880659249923042 * s
      )
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertItpToXyz65_default = convertItpToXyz65;

  // node_modules/culori/src/itp/convertXyz65ToItp.js
  var toAbs = (c2 = 0) => Math.max(c2 * YW, 0);
  var convertXyz65ToItp = ({ x, y, z, alpha }) => {
    const absX = toAbs(x);
    const absY = toAbs(y);
    const absZ = toAbs(z);
    const l = transferPqEncode(
      0.3592832590121217 * absX + 0.6976051147779502 * absY - 0.0358915932320289 * absZ
    );
    const m = transferPqEncode(
      -0.1920808463704995 * absX + 1.1004767970374323 * absY + 0.0753748658519118 * absZ
    );
    const s = transferPqEncode(
      0.0070797844607477 * absX + 0.0748396662186366 * absY + 0.8433265453898765 * absZ
    );
    const i = 0.5 * l + 0.5 * m;
    const t = 1.61376953125 * l - 3.323486328125 * m + 1.709716796875 * s;
    const p4 = 4.378173828125 * l - 4.24560546875 * m - 0.132568359375 * s;
    const res = { mode: "itp", i, t, p: p4 };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToItp_default = convertXyz65ToItp;

  // node_modules/culori/src/itp/definition.js
  var definition10 = {
    mode: "itp",
    channels: ["i", "t", "p", "alpha"],
    parse: ["--ictcp"],
    serialize: "--ictcp",
    toMode: {
      xyz65: convertItpToXyz65_default,
      rgb: (color) => convertXyz65ToRgb_default(convertItpToXyz65_default(color))
    },
    fromMode: {
      xyz65: convertXyz65ToItp_default,
      rgb: (color) => convertXyz65ToItp_default(convertRgbToXyz65_default(color))
    },
    ranges: {
      i: [0, 0.581],
      t: [-0.369, 0.272],
      p: [-0.164, 0.331]
    },
    interpolate: {
      i: interpolatorLinear,
      t: interpolatorLinear,
      p: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default10 = definition10;

  // node_modules/culori/src/jab/convertXyz65ToJab.js
  var p = 134.03437499999998;
  var d0 = 16295499532821565e-27;
  var jabPqEncode = (v) => {
    if (v < 0) return 0;
    let vn3 = Math.pow(v / 1e4, M1);
    return Math.pow((C1 + C2 * vn3) / (1 + C3 * vn3), p);
  };
  var abs = (v = 0) => Math.max(v * 203, 0);
  var convertXyz65ToJab = ({ x, y, z, alpha }) => {
    x = abs(x);
    y = abs(y);
    z = abs(z);
    let xp = 1.15 * x - 0.15 * z;
    let yp = 0.66 * y + 0.34 * x;
    let l = jabPqEncode(0.41478972 * xp + 0.579999 * yp + 0.014648 * z);
    let m = jabPqEncode(-0.20151 * xp + 1.120649 * yp + 0.0531008 * z);
    let s = jabPqEncode(-0.0166008 * xp + 0.2648 * yp + 0.6684799 * z);
    let i = (l + m) / 2;
    let res = {
      mode: "jab",
      j: 0.44 * i / (1 - 0.56 * i) - d0,
      a: 3.524 * l - 4.066708 * m + 0.542708 * s,
      b: 0.199076 * l + 1.096799 * m - 1.295875 * s
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToJab_default = convertXyz65ToJab;

  // node_modules/culori/src/jab/convertJabToXyz65.js
  var p2 = 134.03437499999998;
  var d02 = 16295499532821565e-27;
  var jabPqDecode = (v) => {
    if (v < 0) return 0;
    let vp = Math.pow(v, 1 / p2);
    return 1e4 * Math.pow((C1 - vp) / (C3 * vp - C2), 1 / M1);
  };
  var rel = (v) => v / 203;
  var convertJabToXyz65 = ({ j, a, b, alpha }) => {
    if (j === void 0) j = 0;
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let i = (j + d02) / (0.44 + 0.56 * (j + d02));
    let l = jabPqDecode(i + 0.13860504 * a + 0.058047316 * b);
    let m = jabPqDecode(i - 0.13860504 * a - 0.058047316 * b);
    let s = jabPqDecode(i - 0.096019242 * a - 0.8118919 * b);
    let res = {
      mode: "xyz65",
      x: rel(
        1.661373024652174 * l - 0.914523081304348 * m + 0.23136208173913045 * s
      ),
      y: rel(
        -0.3250758611844533 * l + 1.571847026732543 * m - 0.21825383453227928 * s
      ),
      z: rel(-0.090982811 * l - 0.31272829 * m + 1.5227666 * s)
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertJabToXyz65_default = convertJabToXyz65;

  // node_modules/culori/src/jab/convertRgbToJab.js
  var convertRgbToJab = (rgb2) => {
    let res = convertXyz65ToJab_default(convertRgbToXyz65_default(rgb2));
    if (rgb2.r === rgb2.b && rgb2.b === rgb2.g) {
      res.a = res.b = 0;
    }
    return res;
  };
  var convertRgbToJab_default = convertRgbToJab;

  // node_modules/culori/src/jab/convertJabToRgb.js
  var convertJabToRgb = (color) => convertXyz65ToRgb_default(convertJabToXyz65_default(color));
  var convertJabToRgb_default = convertJabToRgb;

  // node_modules/culori/src/jab/definition.js
  var definition11 = {
    mode: "jab",
    channels: ["j", "a", "b", "alpha"],
    parse: ["--jzazbz"],
    serialize: "--jzazbz",
    fromMode: {
      rgb: convertRgbToJab_default,
      xyz65: convertXyz65ToJab_default
    },
    toMode: {
      rgb: convertJabToRgb_default,
      xyz65: convertJabToXyz65_default
    },
    ranges: {
      j: [0, 0.222],
      a: [-0.109, 0.129],
      b: [-0.185, 0.134]
    },
    interpolate: {
      j: interpolatorLinear,
      a: interpolatorLinear,
      b: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default11 = definition11;

  // node_modules/culori/src/jch/convertJabToJch.js
  var convertJabToJch = ({ j, a, b, alpha }) => {
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let c2 = Math.sqrt(a * a + b * b);
    let res = {
      mode: "jch",
      j,
      c: c2
    };
    if (c2) {
      res.h = normalizeHue_default(Math.atan2(b, a) * 180 / Math.PI);
    }
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertJabToJch_default = convertJabToJch;

  // node_modules/culori/src/jch/convertJchToJab.js
  var convertJchToJab = ({ j, c: c2, h, alpha }) => {
    if (h === void 0) h = 0;
    let res = {
      mode: "jab",
      j,
      a: c2 ? c2 * Math.cos(h / 180 * Math.PI) : 0,
      b: c2 ? c2 * Math.sin(h / 180 * Math.PI) : 0
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertJchToJab_default = convertJchToJab;

  // node_modules/culori/src/jch/definition.js
  var definition12 = {
    mode: "jch",
    parse: ["--jzczhz"],
    serialize: "--jzczhz",
    toMode: {
      jab: convertJchToJab_default,
      rgb: (c2) => convertJabToRgb_default(convertJchToJab_default(c2))
    },
    fromMode: {
      rgb: (c2) => convertJabToJch_default(convertRgbToJab_default(c2)),
      jab: convertJabToJch_default
    },
    channels: ["j", "c", "h", "alpha"],
    ranges: {
      j: [0, 0.221],
      c: [0, 0.19],
      h: [0, 360]
    },
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      c: interpolatorLinear,
      j: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueChroma
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default12 = definition12;

  // node_modules/culori/src/xyz50/constants.js
  var k3 = Math.pow(29, 3) / Math.pow(3, 3);
  var e3 = Math.pow(6, 3) / Math.pow(29, 3);

  // node_modules/culori/src/lab/convertLabToXyz50.js
  var fn4 = (v) => Math.pow(v, 3) > e3 ? Math.pow(v, 3) : (116 * v - 16) / k3;
  var convertLabToXyz50 = ({ l, a, b, alpha }) => {
    if (l === void 0) l = 0;
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let fy = (l + 16) / 116;
    let fx = a / 500 + fy;
    let fz = fy - b / 200;
    let res = {
      mode: "xyz50",
      x: fn4(fx) * D50.X,
      y: fn4(fy) * D50.Y,
      z: fn4(fz) * D50.Z
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertLabToXyz50_default = convertLabToXyz50;

  // node_modules/culori/src/xyz50/convertXyz50ToRgb.js
  var convertXyz50ToRgb = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = convertLrgbToRgb_default({
      r: x * 3.1341359569958707 - y * 1.6173863321612538 - 0.4906619460083532 * z,
      g: x * -0.978795502912089 + y * 1.916254567259524 + 0.03344273116131949 * z,
      b: x * 0.07195537988411677 - y * 0.2289768264158322 + 1.405386058324125 * z
    });
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz50ToRgb_default = convertXyz50ToRgb;

  // node_modules/culori/src/lab/convertLabToRgb.js
  var convertLabToRgb = (lab2) => convertXyz50ToRgb_default(convertLabToXyz50_default(lab2));
  var convertLabToRgb_default = convertLabToRgb;

  // node_modules/culori/src/xyz50/convertRgbToXyz50.js
  var convertRgbToXyz50 = (rgb2) => {
    let { r, g, b, alpha } = convertRgbToLrgb_default(rgb2);
    let res = {
      mode: "xyz50",
      x: 0.436065742824811 * r + 0.3851514688337912 * g + 0.14307845442264197 * b,
      y: 0.22249319175623702 * r + 0.7168870538238823 * g + 0.06061979053616537 * b,
      z: 0.013923904500943465 * r + 0.09708128566574634 * g + 0.7140993584005155 * b
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertRgbToXyz50_default = convertRgbToXyz50;

  // node_modules/culori/src/lab/convertXyz50ToLab.js
  var f2 = (value) => value > e3 ? Math.cbrt(value) : (k3 * value + 16) / 116;
  var convertXyz50ToLab = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let f0 = f2(x / D50.X);
    let f1 = f2(y / D50.Y);
    let f22 = f2(z / D50.Z);
    let res = {
      mode: "lab",
      l: 116 * f1 - 16,
      a: 500 * (f0 - f1),
      b: 200 * (f1 - f22)
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz50ToLab_default = convertXyz50ToLab;

  // node_modules/culori/src/lab/convertRgbToLab.js
  var convertRgbToLab = (rgb2) => {
    let res = convertXyz50ToLab_default(convertRgbToXyz50_default(rgb2));
    if (rgb2.r === rgb2.b && rgb2.b === rgb2.g) {
      res.a = res.b = 0;
    }
    return res;
  };
  var convertRgbToLab_default = convertRgbToLab;

  // node_modules/culori/src/lab/parseLab.js
  function parseLab(color, parsed) {
    if (!parsed || parsed[0] !== "lab") {
      return void 0;
    }
    const res = { mode: "lab" };
    const [, l, a, b, alpha] = parsed;
    if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) {
      return void 0;
    }
    if (l.type !== Tok.None) {
      res.l = Math.min(Math.max(0, l.value), 100);
    }
    if (a.type !== Tok.None) {
      res.a = a.type === Tok.Number ? a.value : a.value * 125 / 100;
    }
    if (b.type !== Tok.None) {
      res.b = b.type === Tok.Number ? b.value : b.value * 125 / 100;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseLab_default = parseLab;

  // node_modules/culori/src/lab/definition.js
  var definition13 = {
    mode: "lab",
    toMode: {
      xyz50: convertLabToXyz50_default,
      rgb: convertLabToRgb_default
    },
    fromMode: {
      xyz50: convertXyz50ToLab_default,
      rgb: convertRgbToLab_default
    },
    channels: ["l", "a", "b", "alpha"],
    ranges: {
      l: [0, 100],
      a: [-125, 125],
      b: [-125, 125]
    },
    parse: [parseLab_default],
    serialize: (c2) => `lab(${c2.l !== void 0 ? c2.l : "none"} ${c2.a !== void 0 ? c2.a : "none"} ${c2.b !== void 0 ? c2.b : "none"}${c2.alpha < 1 ? ` / ${c2.alpha}` : ""})`,
    interpolate: {
      l: interpolatorLinear,
      a: interpolatorLinear,
      b: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default13 = definition13;

  // node_modules/culori/src/lab65/definition.js
  var definition14 = __spreadProps(__spreadValues({}, definition_default13), {
    mode: "lab65",
    parse: ["--lab-d65"],
    serialize: "--lab-d65",
    toMode: {
      xyz65: convertLab65ToXyz65_default,
      rgb: convertLab65ToRgb_default
    },
    fromMode: {
      xyz65: convertXyz65ToLab65_default,
      rgb: convertRgbToLab65_default
    },
    ranges: {
      l: [0, 100],
      a: [-125, 125],
      b: [-125, 125]
    }
  });
  var definition_default14 = definition14;

  // node_modules/culori/src/lch/parseLch.js
  function parseLch(color, parsed) {
    if (!parsed || parsed[0] !== "lch") {
      return void 0;
    }
    const res = { mode: "lch" };
    const [, l, c2, h, alpha] = parsed;
    if (l.type !== Tok.None) {
      if (l.type === Tok.Hue) {
        return void 0;
      }
      res.l = Math.min(Math.max(0, l.value), 100);
    }
    if (c2.type !== Tok.None) {
      res.c = Math.max(
        0,
        c2.type === Tok.Number ? c2.value : c2.value * 150 / 100
      );
    }
    if (h.type !== Tok.None) {
      if (h.type === Tok.Percentage) {
        return void 0;
      }
      res.h = h.value;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseLch_default = parseLch;

  // node_modules/culori/src/lch/definition.js
  var definition15 = {
    mode: "lch",
    toMode: {
      lab: convertLchToLab_default,
      rgb: (c2) => convertLabToRgb_default(convertLchToLab_default(c2))
    },
    fromMode: {
      rgb: (c2) => convertLabToLch_default(convertRgbToLab_default(c2)),
      lab: convertLabToLch_default
    },
    channels: ["l", "c", "h", "alpha"],
    ranges: {
      l: [0, 100],
      c: [0, 150],
      h: [0, 360]
    },
    parse: [parseLch_default],
    serialize: (c2) => `lch(${c2.l !== void 0 ? c2.l : "none"} ${c2.c !== void 0 ? c2.c : "none"} ${c2.h !== void 0 ? c2.h : "none"}${c2.alpha < 1 ? ` / ${c2.alpha}` : ""})`,
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      c: interpolatorLinear,
      l: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueChroma
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default15 = definition15;

  // node_modules/culori/src/lch65/definition.js
  var definition16 = __spreadProps(__spreadValues({}, definition_default15), {
    mode: "lch65",
    parse: ["--lch-d65"],
    serialize: "--lch-d65",
    toMode: {
      lab65: (c2) => convertLchToLab_default(c2, "lab65"),
      rgb: (c2) => convertLab65ToRgb_default(convertLchToLab_default(c2, "lab65"))
    },
    fromMode: {
      rgb: (c2) => convertLabToLch_default(convertRgbToLab65_default(c2), "lch65"),
      lab65: (c2) => convertLabToLch_default(c2, "lch65")
    },
    ranges: {
      l: [0, 100],
      c: [0, 150],
      h: [0, 360]
    }
  });
  var definition_default16 = definition16;

  // node_modules/culori/src/lchuv/convertLuvToLchuv.js
  var convertLuvToLchuv = ({ l, u, v, alpha }) => {
    if (u === void 0) u = 0;
    if (v === void 0) v = 0;
    let c2 = Math.sqrt(u * u + v * v);
    let res = {
      mode: "lchuv",
      l,
      c: c2
    };
    if (c2) {
      res.h = normalizeHue_default(Math.atan2(v, u) * 180 / Math.PI);
    }
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertLuvToLchuv_default = convertLuvToLchuv;

  // node_modules/culori/src/lchuv/convertLchuvToLuv.js
  var convertLchuvToLuv = ({ l, c: c2, h, alpha }) => {
    if (h === void 0) h = 0;
    let res = {
      mode: "luv",
      l,
      u: c2 ? c2 * Math.cos(h / 180 * Math.PI) : 0,
      v: c2 ? c2 * Math.sin(h / 180 * Math.PI) : 0
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertLchuvToLuv_default = convertLchuvToLuv;

  // node_modules/culori/src/luv/convertXyz50ToLuv.js
  var u_fn = (x, y, z) => 4 * x / (x + 15 * y + 3 * z);
  var v_fn = (x, y, z) => 9 * y / (x + 15 * y + 3 * z);
  var un = u_fn(D50.X, D50.Y, D50.Z);
  var vn = v_fn(D50.X, D50.Y, D50.Z);
  var l_fn = (value) => value <= e3 ? k3 * value : 116 * Math.cbrt(value) - 16;
  var convertXyz50ToLuv = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let l = l_fn(y / D50.Y);
    let u = u_fn(x, y, z);
    let v = v_fn(x, y, z);
    if (!isFinite(u) || !isFinite(v)) {
      l = u = v = 0;
    } else {
      u = 13 * l * (u - un);
      v = 13 * l * (v - vn);
    }
    let res = {
      mode: "luv",
      l,
      u,
      v
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz50ToLuv_default = convertXyz50ToLuv;

  // node_modules/culori/src/luv/convertLuvToXyz50.js
  var u_fn2 = (x, y, z) => 4 * x / (x + 15 * y + 3 * z);
  var v_fn2 = (x, y, z) => 9 * y / (x + 15 * y + 3 * z);
  var un2 = u_fn2(D50.X, D50.Y, D50.Z);
  var vn2 = v_fn2(D50.X, D50.Y, D50.Z);
  var convertLuvToXyz50 = ({ l, u, v, alpha }) => {
    if (l === void 0) l = 0;
    if (l === 0) {
      return { mode: "xyz50", x: 0, y: 0, z: 0 };
    }
    if (u === void 0) u = 0;
    if (v === void 0) v = 0;
    let up = u / (13 * l) + un2;
    let vp = v / (13 * l) + vn2;
    let y = D50.Y * (l <= 8 ? l / k3 : Math.pow((l + 16) / 116, 3));
    let x = y * (9 * up) / (4 * vp);
    let z = y * (12 - 3 * up - 20 * vp) / (4 * vp);
    let res = { mode: "xyz50", x, y, z };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertLuvToXyz50_default = convertLuvToXyz50;

  // node_modules/culori/src/lchuv/definition.js
  var convertRgbToLchuv = (rgb2) => convertLuvToLchuv_default(convertXyz50ToLuv_default(convertRgbToXyz50_default(rgb2)));
  var convertLchuvToRgb = (lchuv2) => convertXyz50ToRgb_default(convertLuvToXyz50_default(convertLchuvToLuv_default(lchuv2)));
  var definition17 = {
    mode: "lchuv",
    toMode: {
      luv: convertLchuvToLuv_default,
      rgb: convertLchuvToRgb
    },
    fromMode: {
      rgb: convertRgbToLchuv,
      luv: convertLuvToLchuv_default
    },
    channels: ["l", "c", "h", "alpha"],
    parse: ["--lchuv"],
    serialize: "--lchuv",
    ranges: {
      l: [0, 100],
      c: [0, 176.956],
      h: [0, 360]
    },
    interpolate: {
      h: { use: interpolatorLinear, fixup: fixupHueShorter },
      c: interpolatorLinear,
      l: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    },
    difference: {
      h: differenceHueChroma
    },
    average: {
      h: averageAngle
    }
  };
  var definition_default17 = definition17;

  // node_modules/culori/src/lrgb/definition.js
  var definition18 = __spreadProps(__spreadValues({}, definition_default), {
    mode: "lrgb",
    toMode: {
      rgb: convertLrgbToRgb_default
    },
    fromMode: {
      rgb: convertRgbToLrgb_default
    },
    parse: ["srgb-linear"],
    serialize: "srgb-linear"
  });
  var definition_default18 = definition18;

  // node_modules/culori/src/luv/definition.js
  var definition19 = {
    mode: "luv",
    toMode: {
      xyz50: convertLuvToXyz50_default,
      rgb: (luv2) => convertXyz50ToRgb_default(convertLuvToXyz50_default(luv2))
    },
    fromMode: {
      xyz50: convertXyz50ToLuv_default,
      rgb: (rgb2) => convertXyz50ToLuv_default(convertRgbToXyz50_default(rgb2))
    },
    channels: ["l", "u", "v", "alpha"],
    parse: ["--luv"],
    serialize: "--luv",
    ranges: {
      l: [0, 100],
      u: [-84.936, 175.042],
      v: [-125.882, 87.243]
    },
    interpolate: {
      l: interpolatorLinear,
      u: interpolatorLinear,
      v: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default19 = definition19;

  // node_modules/culori/src/oklab/convertLrgbToOklab.js
  var convertLrgbToOklab = ({ r, g, b, alpha }) => {
    if (r === void 0) r = 0;
    if (g === void 0) g = 0;
    if (b === void 0) b = 0;
    let L = Math.cbrt(
      0.412221469470763 * r + 0.5363325372617348 * g + 0.0514459932675022 * b
    );
    let M3 = Math.cbrt(
      0.2119034958178252 * r + 0.6806995506452344 * g + 0.1073969535369406 * b
    );
    let S = Math.cbrt(
      0.0883024591900564 * r + 0.2817188391361215 * g + 0.6299787016738222 * b
    );
    let res = {
      mode: "oklab",
      l: 0.210454268309314 * L + 0.7936177747023054 * M3 - 0.0040720430116193 * S,
      a: 1.9779985324311684 * L - 2.42859224204858 * M3 + 0.450593709617411 * S,
      b: 0.0259040424655478 * L + 0.7827717124575296 * M3 - 0.8086757549230774 * S
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertLrgbToOklab_default = convertLrgbToOklab;

  // node_modules/culori/src/oklab/convertRgbToOklab.js
  var convertRgbToOklab = (rgb2) => {
    let res = convertLrgbToOklab_default(convertRgbToLrgb_default(rgb2));
    if (rgb2.r === rgb2.b && rgb2.b === rgb2.g) {
      res.a = res.b = 0;
    }
    return res;
  };
  var convertRgbToOklab_default = convertRgbToOklab;

  // node_modules/culori/src/oklab/convertOklabToLrgb.js
  var convertOklabToLrgb = ({ l, a, b, alpha }) => {
    if (l === void 0) l = 0;
    if (a === void 0) a = 0;
    if (b === void 0) b = 0;
    let L = Math.pow(l + 0.3963377773761749 * a + 0.2158037573099136 * b, 3);
    let M3 = Math.pow(l - 0.1055613458156586 * a - 0.0638541728258133 * b, 3);
    let S = Math.pow(l - 0.0894841775298119 * a - 1.2914855480194092 * b, 3);
    let res = {
      mode: "lrgb",
      r: 4.076741636075957 * L - 3.3077115392580616 * M3 + 0.2309699031821044 * S,
      g: -1.2684379732850317 * L + 2.6097573492876887 * M3 - 0.3413193760026573 * S,
      b: -0.0041960761386756 * L - 0.7034186179359362 * M3 + 1.7076146940746117 * S
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertOklabToLrgb_default = convertOklabToLrgb;

  // node_modules/culori/src/oklab/convertOklabToRgb.js
  var convertOklabToRgb = (c2) => convertLrgbToRgb_default(convertOklabToLrgb_default(c2));
  var convertOklabToRgb_default = convertOklabToRgb;

  // node_modules/culori/src/okhsl/helpers.js
  function toe(x) {
    const k_1 = 0.206;
    const k_2 = 0.03;
    const k_3 = (1 + k_1) / (1 + k_2);
    return 0.5 * (k_3 * x - k_1 + Math.sqrt((k_3 * x - k_1) * (k_3 * x - k_1) + 4 * k_2 * k_3 * x));
  }
  function toe_inv(x) {
    const k_1 = 0.206;
    const k_2 = 0.03;
    const k_3 = (1 + k_1) / (1 + k_2);
    return (x * x + k_1 * x) / (k_3 * (x + k_2));
  }
  function compute_max_saturation(a, b) {
    let k0, k1, k22, k32, k4, wl, wm, ws;
    if (-1.88170328 * a - 0.80936493 * b > 1) {
      k0 = 1.19086277;
      k1 = 1.76576728;
      k22 = 0.59662641;
      k32 = 0.75515197;
      k4 = 0.56771245;
      wl = 4.0767416621;
      wm = -3.3077115913;
      ws = 0.2309699292;
    } else if (1.81444104 * a - 1.19445276 * b > 1) {
      k0 = 0.73956515;
      k1 = -0.45954404;
      k22 = 0.08285427;
      k32 = 0.1254107;
      k4 = 0.14503204;
      wl = -1.2684380046;
      wm = 2.6097574011;
      ws = -0.3413193965;
    } else {
      k0 = 1.35733652;
      k1 = -915799e-8;
      k22 = -1.1513021;
      k32 = -0.50559606;
      k4 = 692167e-8;
      wl = -0.0041960863;
      wm = -0.7034186147;
      ws = 1.707614701;
    }
    let S = k0 + k1 * a + k22 * b + k32 * a * a + k4 * a * b;
    let k_l = 0.3963377774 * a + 0.2158037573 * b;
    let k_m = -0.1055613458 * a - 0.0638541728 * b;
    let k_s = -0.0894841775 * a - 1.291485548 * b;
    {
      let l_ = 1 + S * k_l;
      let m_ = 1 + S * k_m;
      let s_ = 1 + S * k_s;
      let l = l_ * l_ * l_;
      let m = m_ * m_ * m_;
      let s = s_ * s_ * s_;
      let l_dS = 3 * k_l * l_ * l_;
      let m_dS = 3 * k_m * m_ * m_;
      let s_dS = 3 * k_s * s_ * s_;
      let l_dS2 = 6 * k_l * k_l * l_;
      let m_dS2 = 6 * k_m * k_m * m_;
      let s_dS2 = 6 * k_s * k_s * s_;
      let f3 = wl * l + wm * m + ws * s;
      let f1 = wl * l_dS + wm * m_dS + ws * s_dS;
      let f22 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;
      S = S - f3 * f1 / (f1 * f1 - 0.5 * f3 * f22);
    }
    return S;
  }
  function find_cusp(a, b) {
    let S_cusp = compute_max_saturation(a, b);
    let rgb2 = convertOklabToLrgb_default({ l: 1, a: S_cusp * a, b: S_cusp * b });
    let L_cusp = Math.cbrt(1 / Math.max(rgb2.r, rgb2.g, rgb2.b));
    let C_cusp = L_cusp * S_cusp;
    return [L_cusp, C_cusp];
  }
  function find_gamut_intersection(a, b, L1, C12, L0, cusp = null) {
    if (!cusp) {
      cusp = find_cusp(a, b);
    }
    let t;
    if ((L1 - L0) * cusp[1] - (cusp[0] - L0) * C12 <= 0) {
      t = cusp[1] * L0 / (C12 * cusp[0] + cusp[1] * (L0 - L1));
    } else {
      t = cusp[1] * (L0 - 1) / (C12 * (cusp[0] - 1) + cusp[1] * (L0 - L1));
      {
        let dL = L1 - L0;
        let dC = C12;
        let k_l = 0.3963377774 * a + 0.2158037573 * b;
        let k_m = -0.1055613458 * a - 0.0638541728 * b;
        let k_s = -0.0894841775 * a - 1.291485548 * b;
        let l_dt = dL + dC * k_l;
        let m_dt = dL + dC * k_m;
        let s_dt = dL + dC * k_s;
        {
          let L = L0 * (1 - t) + t * L1;
          let C = t * C12;
          let l_ = L + C * k_l;
          let m_ = L + C * k_m;
          let s_ = L + C * k_s;
          let l = l_ * l_ * l_;
          let m = m_ * m_ * m_;
          let s = s_ * s_ * s_;
          let ldt = 3 * l_dt * l_ * l_;
          let mdt = 3 * m_dt * m_ * m_;
          let sdt = 3 * s_dt * s_ * s_;
          let ldt2 = 6 * l_dt * l_dt * l_;
          let mdt2 = 6 * m_dt * m_dt * m_;
          let sdt2 = 6 * s_dt * s_dt * s_;
          let r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s - 1;
          let r1 = 4.0767416621 * ldt - 3.3077115913 * mdt + 0.2309699292 * sdt;
          let r2 = 4.0767416621 * ldt2 - 3.3077115913 * mdt2 + 0.2309699292 * sdt2;
          let u_r = r1 / (r1 * r1 - 0.5 * r * r2);
          let t_r = -r * u_r;
          let g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s - 1;
          let g1 = -1.2684380046 * ldt + 2.6097574011 * mdt - 0.3413193965 * sdt;
          let g2 = -1.2684380046 * ldt2 + 2.6097574011 * mdt2 - 0.3413193965 * sdt2;
          let u_g = g1 / (g1 * g1 - 0.5 * g * g2);
          let t_g = -g * u_g;
          let b2 = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s - 1;
          let b1 = -0.0041960863 * ldt - 0.7034186147 * mdt + 1.707614701 * sdt;
          let b22 = -0.0041960863 * ldt2 - 0.7034186147 * mdt2 + 1.707614701 * sdt2;
          let u_b = b1 / (b1 * b1 - 0.5 * b2 * b22);
          let t_b = -b2 * u_b;
          t_r = u_r >= 0 ? t_r : 1e6;
          t_g = u_g >= 0 ? t_g : 1e6;
          t_b = u_b >= 0 ? t_b : 1e6;
          t += Math.min(t_r, Math.min(t_g, t_b));
        }
      }
    }
    return t;
  }
  function get_ST_max(a_, b_, cusp = null) {
    if (!cusp) {
      cusp = find_cusp(a_, b_);
    }
    let L = cusp[0];
    let C = cusp[1];
    return [C / L, C / (1 - L)];
  }
  function get_Cs(L, a_, b_) {
    let cusp = find_cusp(a_, b_);
    let C_max = find_gamut_intersection(a_, b_, L, 1, L, cusp);
    let ST_max = get_ST_max(a_, b_, cusp);
    let S_mid = 0.11516993 + 1 / (7.4477897 + 4.1590124 * b_ + a_ * (-2.19557347 + 1.75198401 * b_ + a_ * (-2.13704948 - 10.02301043 * b_ + a_ * (-4.24894561 + 5.38770819 * b_ + 4.69891013 * a_))));
    let T_mid = 0.11239642 + 1 / (1.6132032 - 0.68124379 * b_ + a_ * (0.40370612 + 0.90148123 * b_ + a_ * (-0.27087943 + 0.6122399 * b_ + a_ * (299215e-8 - 0.45399568 * b_ - 0.14661872 * a_))));
    let k4 = C_max / Math.min(L * ST_max[0], (1 - L) * ST_max[1]);
    let C_a = L * S_mid;
    let C_b = (1 - L) * T_mid;
    let C_mid = 0.9 * k4 * Math.sqrt(
      Math.sqrt(
        1 / (1 / (C_a * C_a * C_a * C_a) + 1 / (C_b * C_b * C_b * C_b))
      )
    );
    C_a = L * 0.4;
    C_b = (1 - L) * 0.8;
    let C_0 = Math.sqrt(1 / (1 / (C_a * C_a) + 1 / (C_b * C_b)));
    return [C_0, C_mid, C_max];
  }

  // node_modules/culori/src/okhsl/convertOklabToOkhsl.js
  function convertOklabToOkhsl(lab2) {
    const l = lab2.l !== void 0 ? lab2.l : 0;
    const a = lab2.a !== void 0 ? lab2.a : 0;
    const b = lab2.b !== void 0 ? lab2.b : 0;
    const ret = { mode: "okhsl", l: toe(l) };
    if (lab2.alpha !== void 0) {
      ret.alpha = lab2.alpha;
    }
    let c2 = Math.sqrt(a * a + b * b);
    if (!c2) {
      ret.s = 0;
      return ret;
    }
    let [C_0, C_mid, C_max] = get_Cs(l, a / c2, b / c2);
    let s;
    if (c2 < C_mid) {
      let k_0 = 0;
      let k_1 = 0.8 * C_0;
      let k_2 = 1 - k_1 / C_mid;
      let t = (c2 - k_0) / (k_1 + k_2 * (c2 - k_0));
      s = t * 0.8;
    } else {
      let k_0 = C_mid;
      let k_1 = 0.2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
      let k_2 = 1 - k_1 / (C_max - C_mid);
      let t = (c2 - k_0) / (k_1 + k_2 * (c2 - k_0));
      s = 0.8 + 0.2 * t;
    }
    if (s) {
      ret.s = s;
      ret.h = normalizeHue_default(Math.atan2(b, a) * 180 / Math.PI);
    }
    return ret;
  }

  // node_modules/culori/src/okhsl/convertOkhslToOklab.js
  function convertOkhslToOklab(hsl2) {
    let h = hsl2.h !== void 0 ? hsl2.h : 0;
    let s = hsl2.s !== void 0 ? hsl2.s : 0;
    let l = hsl2.l !== void 0 ? hsl2.l : 0;
    const ret = { mode: "oklab", l: toe_inv(l) };
    if (hsl2.alpha !== void 0) {
      ret.alpha = hsl2.alpha;
    }
    if (!s || l === 1) {
      ret.a = ret.b = 0;
      return ret;
    }
    let a_ = Math.cos(h / 180 * Math.PI);
    let b_ = Math.sin(h / 180 * Math.PI);
    let [C_0, C_mid, C_max] = get_Cs(ret.l, a_, b_);
    let t, k_0, k_1, k_2;
    if (s < 0.8) {
      t = 1.25 * s;
      k_0 = 0;
      k_1 = 0.8 * C_0;
      k_2 = 1 - k_1 / C_mid;
    } else {
      t = 5 * (s - 0.8);
      k_0 = C_mid;
      k_1 = 0.2 * C_mid * C_mid * 1.25 * 1.25 / C_0;
      k_2 = 1 - k_1 / (C_max - C_mid);
    }
    let C = k_0 + t * k_1 / (1 - k_2 * t);
    ret.a = C * a_;
    ret.b = C * b_;
    return ret;
  }

  // node_modules/culori/src/okhsl/modeOkhsl.js
  var modeOkhsl = __spreadProps(__spreadValues({}, definition_default7), {
    mode: "okhsl",
    channels: ["h", "s", "l", "alpha"],
    parse: ["--okhsl"],
    serialize: "--okhsl",
    fromMode: {
      oklab: convertOklabToOkhsl,
      rgb: (c2) => convertOklabToOkhsl(convertRgbToOklab_default(c2))
    },
    toMode: {
      oklab: convertOkhslToOklab,
      rgb: (c2) => convertOklabToRgb_default(convertOkhslToOklab(c2))
    }
  });
  var modeOkhsl_default = modeOkhsl;

  // node_modules/culori/src/okhsv/convertOklabToOkhsv.js
  function convertOklabToOkhsv(lab2) {
    let l = lab2.l !== void 0 ? lab2.l : 0;
    let a = lab2.a !== void 0 ? lab2.a : 0;
    let b = lab2.b !== void 0 ? lab2.b : 0;
    let c2 = Math.sqrt(a * a + b * b);
    let a_ = c2 ? a / c2 : 1;
    let b_ = c2 ? b / c2 : 1;
    let [S_max, T] = get_ST_max(a_, b_);
    let S_0 = 0.5;
    let k4 = 1 - S_0 / S_max;
    let t = T / (c2 + l * T);
    let L_v = t * l;
    let C_v = t * c2;
    let L_vt = toe_inv(L_v);
    let C_vt = C_v * L_vt / L_v;
    let rgb_scale = convertOklabToLrgb_default({ l: L_vt, a: a_ * C_vt, b: b_ * C_vt });
    let scale_L = Math.cbrt(
      1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0)
    );
    l = l / scale_L;
    c2 = c2 / scale_L * toe(l) / l;
    l = toe(l);
    const ret = {
      mode: "okhsv",
      s: c2 ? (S_0 + T) * C_v / (T * S_0 + T * k4 * C_v) : 0,
      v: l ? l / L_v : 0
    };
    if (ret.s) {
      ret.h = normalizeHue_default(Math.atan2(b, a) * 180 / Math.PI);
    }
    if (lab2.alpha !== void 0) {
      ret.alpha = lab2.alpha;
    }
    return ret;
  }

  // node_modules/culori/src/okhsv/convertOkhsvToOklab.js
  function convertOkhsvToOklab(hsv2) {
    const ret = { mode: "oklab" };
    if (hsv2.alpha !== void 0) {
      ret.alpha = hsv2.alpha;
    }
    const h = hsv2.h !== void 0 ? hsv2.h : 0;
    const s = hsv2.s !== void 0 ? hsv2.s : 0;
    const v = hsv2.v !== void 0 ? hsv2.v : 0;
    const a_ = Math.cos(h / 180 * Math.PI);
    const b_ = Math.sin(h / 180 * Math.PI);
    const [S_max, T] = get_ST_max(a_, b_);
    const S_0 = 0.5;
    const k4 = 1 - S_0 / S_max;
    const L_v = 1 - s * S_0 / (S_0 + T - T * k4 * s);
    const C_v = s * T * S_0 / (S_0 + T - T * k4 * s);
    const L_vt = toe_inv(L_v);
    const C_vt = C_v * L_vt / L_v;
    const rgb_scale = convertOklabToLrgb_default({
      l: L_vt,
      a: a_ * C_vt,
      b: b_ * C_vt
    });
    const scale_L = Math.cbrt(
      1 / Math.max(rgb_scale.r, rgb_scale.g, rgb_scale.b, 0)
    );
    const L_new = toe_inv(v * L_v);
    const C = C_v * L_new / L_v;
    ret.l = L_new * scale_L;
    ret.a = C * a_ * scale_L;
    ret.b = C * b_ * scale_L;
    return ret;
  }

  // node_modules/culori/src/okhsv/modeOkhsv.js
  var modeOkhsv = __spreadProps(__spreadValues({}, definition_default8), {
    mode: "okhsv",
    channels: ["h", "s", "v", "alpha"],
    parse: ["--okhsv"],
    serialize: "--okhsv",
    fromMode: {
      oklab: convertOklabToOkhsv,
      rgb: (c2) => convertOklabToOkhsv(convertRgbToOklab_default(c2))
    },
    toMode: {
      oklab: convertOkhsvToOklab,
      rgb: (c2) => convertOklabToRgb_default(convertOkhsvToOklab(c2))
    }
  });
  var modeOkhsv_default = modeOkhsv;

  // node_modules/culori/src/oklab/parseOklab.js
  function parseOklab(color, parsed) {
    if (!parsed || parsed[0] !== "oklab") {
      return void 0;
    }
    const res = { mode: "oklab" };
    const [, l, a, b, alpha] = parsed;
    if (l.type === Tok.Hue || a.type === Tok.Hue || b.type === Tok.Hue) {
      return void 0;
    }
    if (l.type !== Tok.None) {
      res.l = Math.min(
        Math.max(0, l.type === Tok.Number ? l.value : l.value / 100),
        1
      );
    }
    if (a.type !== Tok.None) {
      res.a = a.type === Tok.Number ? a.value : a.value * 0.4 / 100;
    }
    if (b.type !== Tok.None) {
      res.b = b.type === Tok.Number ? b.value : b.value * 0.4 / 100;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseOklab_default = parseOklab;

  // node_modules/culori/src/oklab/definition.js
  var definition20 = __spreadProps(__spreadValues({}, definition_default13), {
    mode: "oklab",
    toMode: {
      lrgb: convertOklabToLrgb_default,
      rgb: convertOklabToRgb_default
    },
    fromMode: {
      lrgb: convertLrgbToOklab_default,
      rgb: convertRgbToOklab_default
    },
    ranges: {
      l: [0, 1],
      a: [-0.4, 0.4],
      b: [-0.4, 0.4]
    },
    parse: [parseOklab_default],
    serialize: (c2) => `oklab(${c2.l !== void 0 ? c2.l : "none"} ${c2.a !== void 0 ? c2.a : "none"} ${c2.b !== void 0 ? c2.b : "none"}${c2.alpha < 1 ? ` / ${c2.alpha}` : ""})`
  });
  var definition_default20 = definition20;

  // node_modules/culori/src/oklch/parseOklch.js
  function parseOklch(color, parsed) {
    if (!parsed || parsed[0] !== "oklch") {
      return void 0;
    }
    const res = { mode: "oklch" };
    const [, l, c2, h, alpha] = parsed;
    if (l.type !== Tok.None) {
      if (l.type === Tok.Hue) {
        return void 0;
      }
      res.l = Math.min(
        Math.max(0, l.type === Tok.Number ? l.value : l.value / 100),
        1
      );
    }
    if (c2.type !== Tok.None) {
      res.c = Math.max(
        0,
        c2.type === Tok.Number ? c2.value : c2.value * 0.4 / 100
      );
    }
    if (h.type !== Tok.None) {
      if (h.type === Tok.Percentage) {
        return void 0;
      }
      res.h = h.value;
    }
    if (alpha.type !== Tok.None) {
      res.alpha = Math.min(
        1,
        Math.max(
          0,
          alpha.type === Tok.Number ? alpha.value : alpha.value / 100
        )
      );
    }
    return res;
  }
  var parseOklch_default = parseOklch;

  // node_modules/culori/src/oklch/definition.js
  var definition21 = __spreadProps(__spreadValues({}, definition_default15), {
    mode: "oklch",
    toMode: {
      oklab: (c2) => convertLchToLab_default(c2, "oklab"),
      rgb: (c2) => convertOklabToRgb_default(convertLchToLab_default(c2, "oklab"))
    },
    fromMode: {
      rgb: (c2) => convertLabToLch_default(convertRgbToOklab_default(c2), "oklch"),
      oklab: (c2) => convertLabToLch_default(c2, "oklch")
    },
    parse: [parseOklch_default],
    serialize: (c2) => `oklch(${c2.l !== void 0 ? c2.l : "none"} ${c2.c !== void 0 ? c2.c : "none"} ${c2.h !== void 0 ? c2.h : "none"}${c2.alpha < 1 ? ` / ${c2.alpha}` : ""})`,
    ranges: {
      l: [0, 1],
      c: [0, 0.4],
      h: [0, 360]
    }
  });
  var definition_default21 = definition21;

  // node_modules/culori/src/p3/convertP3ToXyz65.js
  var convertP3ToXyz65 = (rgb2) => {
    let { r, g, b, alpha } = convertRgbToLrgb_default(rgb2);
    let res = {
      mode: "xyz65",
      x: 0.486570948648216 * r + 0.265667693169093 * g + 0.1982172852343625 * b,
      y: 0.2289745640697487 * r + 0.6917385218365062 * g + 0.079286914093745 * b,
      z: 0 * r + 0.0451133818589026 * g + 1.043944368900976 * b
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertP3ToXyz65_default = convertP3ToXyz65;

  // node_modules/culori/src/p3/convertXyz65ToP3.js
  var convertXyz65ToP3 = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = convertLrgbToRgb_default(
      {
        r: x * 2.4934969119414263 - y * 0.9313836179191242 - 0.402710784450717 * z,
        g: x * -0.8294889695615749 + y * 1.7626640603183465 + 0.0236246858419436 * z,
        b: x * 0.0358458302437845 - y * 0.0761723892680418 + 0.9568845240076871 * z
      },
      "p3"
    );
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToP3_default = convertXyz65ToP3;

  // node_modules/culori/src/p3/definition.js
  var definition22 = __spreadProps(__spreadValues({}, definition_default), {
    mode: "p3",
    parse: ["display-p3"],
    serialize: "display-p3",
    fromMode: {
      rgb: (color) => convertXyz65ToP3_default(convertRgbToXyz65_default(color)),
      xyz65: convertXyz65ToP3_default
    },
    toMode: {
      rgb: (color) => convertXyz65ToRgb_default(convertP3ToXyz65_default(color)),
      xyz65: convertP3ToXyz65_default
    }
  });
  var definition_default22 = definition22;

  // node_modules/culori/src/prophoto/convertXyz50ToProphoto.js
  var gamma2 = (v) => {
    let abs2 = Math.abs(v);
    if (abs2 >= 1 / 512) {
      return Math.sign(v) * Math.pow(abs2, 1 / 1.8);
    }
    return 16 * v;
  };
  var convertXyz50ToProphoto = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = {
      mode: "prophoto",
      r: gamma2(
        x * 1.3457868816471585 - y * 0.2555720873797946 - 0.0511018649755453 * z
      ),
      g: gamma2(
        x * -0.5446307051249019 + y * 1.5082477428451466 + 0.0205274474364214 * z
      ),
      b: gamma2(x * 0 + y * 0 + 1.2119675456389452 * z)
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz50ToProphoto_default = convertXyz50ToProphoto;

  // node_modules/culori/src/prophoto/convertProphotoToXyz50.js
  var linearize2 = (v = 0) => {
    let abs2 = Math.abs(v);
    if (abs2 >= 16 / 512) {
      return Math.sign(v) * Math.pow(abs2, 1.8);
    }
    return v / 16;
  };
  var convertProphotoToXyz50 = (prophoto2) => {
    let r = linearize2(prophoto2.r);
    let g = linearize2(prophoto2.g);
    let b = linearize2(prophoto2.b);
    let res = {
      mode: "xyz50",
      x: 0.7977666449006423 * r + 0.1351812974005331 * g + 0.0313477341283922 * b,
      y: 0.2880748288194013 * r + 0.7118352342418731 * g + 899369387256e-16 * b,
      z: 0 * r + 0 * g + 0.8251046025104602 * b
    };
    if (prophoto2.alpha !== void 0) {
      res.alpha = prophoto2.alpha;
    }
    return res;
  };
  var convertProphotoToXyz50_default = convertProphotoToXyz50;

  // node_modules/culori/src/prophoto/definition.js
  var definition23 = __spreadProps(__spreadValues({}, definition_default), {
    mode: "prophoto",
    parse: ["prophoto-rgb"],
    serialize: "prophoto-rgb",
    fromMode: {
      xyz50: convertXyz50ToProphoto_default,
      rgb: (color) => convertXyz50ToProphoto_default(convertRgbToXyz50_default(color))
    },
    toMode: {
      xyz50: convertProphotoToXyz50_default,
      rgb: (color) => convertXyz50ToRgb_default(convertProphotoToXyz50_default(color))
    }
  });
  var definition_default23 = definition23;

  // node_modules/culori/src/rec2020/convertXyz65ToRec2020.js
  var \u03B1 = 1.09929682680944;
  var \u03B2 = 0.018053968510807;
  var gamma3 = (v) => {
    const abs2 = Math.abs(v);
    if (abs2 > \u03B2) {
      return (Math.sign(v) || 1) * (\u03B1 * Math.pow(abs2, 0.45) - (\u03B1 - 1));
    }
    return 4.5 * v;
  };
  var convertXyz65ToRec2020 = ({ x, y, z, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = {
      mode: "rec2020",
      r: gamma3(
        x * 1.7166511879712683 - y * 0.3556707837763925 - 0.2533662813736599 * z
      ),
      g: gamma3(
        x * -0.6666843518324893 + y * 1.6164812366349395 + 0.0157685458139111 * z
      ),
      b: gamma3(
        x * 0.0176398574453108 - y * 0.0427706132578085 + 0.9421031212354739 * z
      )
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToRec2020_default = convertXyz65ToRec2020;

  // node_modules/culori/src/rec2020/convertRec2020ToXyz65.js
  var \u03B12 = 1.09929682680944;
  var \u03B22 = 0.018053968510807;
  var linearize3 = (v = 0) => {
    let abs2 = Math.abs(v);
    if (abs2 < \u03B22 * 4.5) {
      return v / 4.5;
    }
    return (Math.sign(v) || 1) * Math.pow((abs2 + \u03B12 - 1) / \u03B12, 1 / 0.45);
  };
  var convertRec2020ToXyz65 = (rec20202) => {
    let r = linearize3(rec20202.r);
    let g = linearize3(rec20202.g);
    let b = linearize3(rec20202.b);
    let res = {
      mode: "xyz65",
      x: 0.6369580483012911 * r + 0.1446169035862083 * g + 0.1688809751641721 * b,
      y: 0.262700212011267 * r + 0.6779980715188708 * g + 0.059301716469862 * b,
      z: 0 * r + 0.0280726930490874 * g + 1.0609850577107909 * b
    };
    if (rec20202.alpha !== void 0) {
      res.alpha = rec20202.alpha;
    }
    return res;
  };
  var convertRec2020ToXyz65_default = convertRec2020ToXyz65;

  // node_modules/culori/src/rec2020/definition.js
  var definition24 = __spreadProps(__spreadValues({}, definition_default), {
    mode: "rec2020",
    fromMode: {
      xyz65: convertXyz65ToRec2020_default,
      rgb: (color) => convertXyz65ToRec2020_default(convertRgbToXyz65_default(color))
    },
    toMode: {
      xyz65: convertRec2020ToXyz65_default,
      rgb: (color) => convertXyz65ToRgb_default(convertRec2020ToXyz65_default(color))
    },
    parse: ["rec2020"],
    serialize: "rec2020"
  });
  var definition_default24 = definition24;

  // node_modules/culori/src/xyb/constants.js
  var bias = 0.0037930732552754493;
  var bias_cbrt = Math.cbrt(bias);

  // node_modules/culori/src/xyb/convertRgbToXyb.js
  var transfer = (v) => Math.cbrt(v) - bias_cbrt;
  var convertRgbToXyb = (color) => {
    const { r, g, b, alpha } = convertRgbToLrgb_default(color);
    const l = transfer(0.3 * r + 0.622 * g + 0.078 * b + bias);
    const m = transfer(0.23 * r + 0.692 * g + 0.078 * b + bias);
    const s = transfer(
      0.2434226892454782 * r + 0.2047674442449682 * g + 0.5518098665095535 * b + bias
    );
    const res = {
      mode: "xyb",
      x: (l - m) / 2,
      y: (l + m) / 2,
      /* Apply default chroma from luma (subtract Y from B) */
      b: s - (l + m) / 2
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertRgbToXyb_default = convertRgbToXyb;

  // node_modules/culori/src/xyb/convertXybToRgb.js
  var transfer2 = (v) => Math.pow(v + bias_cbrt, 3);
  var convertXybToRgb = ({ x, y, b, alpha }) => {
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (b === void 0) b = 0;
    const l = transfer2(x + y) - bias;
    const m = transfer2(y - x) - bias;
    const s = transfer2(b + y) - bias;
    const res = convertLrgbToRgb_default({
      r: 11.031566904639861 * l - 9.866943908131562 * m - 0.16462299650829934 * s,
      g: -3.2541473810744237 * l + 4.418770377582723 * m - 0.16462299650829934 * s,
      b: -3.6588512867136815 * l + 2.7129230459360922 * m + 1.9459282407775895 * s
    });
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertXybToRgb_default = convertXybToRgb;

  // node_modules/culori/src/xyb/definition.js
  var definition25 = {
    mode: "xyb",
    channels: ["x", "y", "b", "alpha"],
    parse: ["--xyb"],
    serialize: "--xyb",
    toMode: {
      rgb: convertXybToRgb_default
    },
    fromMode: {
      rgb: convertRgbToXyb_default
    },
    ranges: {
      x: [-0.0154, 0.0281],
      y: [0, 0.8453],
      b: [-0.2778, 0.388]
    },
    interpolate: {
      x: interpolatorLinear,
      y: interpolatorLinear,
      b: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default25 = definition25;

  // node_modules/culori/src/xyz50/definition.js
  var definition26 = {
    mode: "xyz50",
    parse: ["xyz-d50"],
    serialize: "xyz-d50",
    toMode: {
      rgb: convertXyz50ToRgb_default,
      lab: convertXyz50ToLab_default
    },
    fromMode: {
      rgb: convertRgbToXyz50_default,
      lab: convertLabToXyz50_default
    },
    channels: ["x", "y", "z", "alpha"],
    ranges: {
      x: [0, 0.964],
      y: [0, 0.999],
      z: [0, 0.825]
    },
    interpolate: {
      x: interpolatorLinear,
      y: interpolatorLinear,
      z: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default26 = definition26;

  // node_modules/culori/src/xyz65/convertXyz65ToXyz50.js
  var convertXyz65ToXyz50 = (xyz652) => {
    let { x, y, z, alpha } = xyz652;
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = {
      mode: "xyz50",
      x: 1.0479298208405488 * x + 0.0229467933410191 * y - 0.0501922295431356 * z,
      y: 0.0296278156881593 * x + 0.990434484573249 * y - 0.0170738250293851 * z,
      z: -0.0092430581525912 * x + 0.0150551448965779 * y + 0.7518742899580008 * z
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz65ToXyz50_default = convertXyz65ToXyz50;

  // node_modules/culori/src/xyz65/convertXyz50ToXyz65.js
  var convertXyz50ToXyz65 = (xyz502) => {
    let { x, y, z, alpha } = xyz502;
    if (x === void 0) x = 0;
    if (y === void 0) y = 0;
    if (z === void 0) z = 0;
    let res = {
      mode: "xyz65",
      x: 0.9554734527042182 * x - 0.0230985368742614 * y + 0.0632593086610217 * z,
      y: -0.0283697069632081 * x + 1.0099954580058226 * y + 0.021041398966943 * z,
      z: 0.0123140016883199 * x - 0.0205076964334779 * y + 1.3303659366080753 * z
    };
    if (alpha !== void 0) {
      res.alpha = alpha;
    }
    return res;
  };
  var convertXyz50ToXyz65_default = convertXyz50ToXyz65;

  // node_modules/culori/src/xyz65/definition.js
  var definition27 = {
    mode: "xyz65",
    toMode: {
      rgb: convertXyz65ToRgb_default,
      xyz50: convertXyz65ToXyz50_default
    },
    fromMode: {
      rgb: convertRgbToXyz65_default,
      xyz50: convertXyz50ToXyz65_default
    },
    ranges: {
      x: [0, 0.95],
      y: [0, 1],
      z: [0, 1.088]
    },
    channels: ["x", "y", "z", "alpha"],
    parse: ["xyz", "xyz-d65"],
    serialize: "xyz-d65",
    interpolate: {
      x: interpolatorLinear,
      y: interpolatorLinear,
      z: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default27 = definition27;

  // node_modules/culori/src/yiq/convertRgbToYiq.js
  var convertRgbToYiq = ({ r, g, b, alpha }) => {
    if (r === void 0) r = 0;
    if (g === void 0) g = 0;
    if (b === void 0) b = 0;
    const res = {
      mode: "yiq",
      y: 0.29889531 * r + 0.58662247 * g + 0.11448223 * b,
      i: 0.59597799 * r - 0.2741761 * g - 0.32180189 * b,
      q: 0.21147017 * r - 0.52261711 * g + 0.31114694 * b
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertRgbToYiq_default = convertRgbToYiq;

  // node_modules/culori/src/yiq/convertYiqToRgb.js
  var convertYiqToRgb = ({ y, i, q, alpha }) => {
    if (y === void 0) y = 0;
    if (i === void 0) i = 0;
    if (q === void 0) q = 0;
    const res = {
      mode: "rgb",
      r: y + 0.95608445 * i + 0.6208885 * q,
      g: y - 0.27137664 * i - 0.6486059 * q,
      b: y - 1.10561724 * i + 1.70250126 * q
    };
    if (alpha !== void 0) res.alpha = alpha;
    return res;
  };
  var convertYiqToRgb_default = convertYiqToRgb;

  // node_modules/culori/src/yiq/definition.js
  var definition28 = {
    mode: "yiq",
    toMode: {
      rgb: convertYiqToRgb_default
    },
    fromMode: {
      rgb: convertRgbToYiq_default
    },
    channels: ["y", "i", "q", "alpha"],
    parse: ["--yiq"],
    serialize: "--yiq",
    ranges: {
      i: [-0.595, 0.595],
      q: [-0.522, 0.522]
    },
    interpolate: {
      y: interpolatorLinear,
      i: interpolatorLinear,
      q: interpolatorLinear,
      alpha: { use: interpolatorLinear, fixup: fixupAlpha }
    }
  };
  var definition_default28 = definition28;

  // node_modules/culori/src/nearest.js
  var nearest = (colors3, metric = differenceEuclidean(), accessor = (d) => d) => {
    let arr = colors3.map((c2, idx) => ({ color: accessor(c2), i: idx }));
    return (color, n = 1, \u03C4 = Infinity) => {
      if (isFinite(n)) {
        n = Math.max(1, Math.min(n, arr.length - 1));
      }
      arr.forEach((c2) => {
        c2.d = metric(color, c2.color);
      });
      return arr.sort((a, b) => a.d - b.d).slice(0, n).filter((c2) => c2.d < \u03C4).map((c2) => colors3[c2.i]);
    };
  };
  var nearest_default = nearest;

  // node_modules/culori/src/index.js
  var a98 = useMode(definition_default2);
  var cubehelix = useMode(definition_default3);
  var dlab = useMode(definition_default4);
  var dlch = useMode(definition_default5);
  var hsi = useMode(definition_default6);
  var hsl = useMode(definition_default7);
  var hsv = useMode(definition_default8);
  var hwb = useMode(definition_default9);
  var itp = useMode(definition_default10);
  var jab = useMode(definition_default11);
  var jch = useMode(definition_default12);
  var lab = useMode(definition_default13);
  var lab65 = useMode(definition_default14);
  var lch = useMode(definition_default15);
  var lch65 = useMode(definition_default16);
  var lchuv = useMode(definition_default17);
  var lrgb = useMode(definition_default18);
  var luv = useMode(definition_default19);
  var okhsl = useMode(modeOkhsl_default);
  var okhsv = useMode(modeOkhsv_default);
  var oklab = useMode(definition_default20);
  var oklch = useMode(definition_default21);
  var p3 = useMode(definition_default22);
  var prophoto = useMode(definition_default23);
  var rec2020 = useMode(definition_default24);
  var rgb = useMode(definition_default);
  var xyb = useMode(definition_default25);
  var xyz50 = useMode(definition_default26);
  var xyz65 = useMode(definition_default27);
  var yiq = useMode(definition_default28);

  // src/features/health-check/hc-types.ts
  var HC_SEVERITY_WEIGHTS = {
    error: 1,
    warning: 0.5,
    info: 0.1
  };
  var DELTA_E_THRESHOLDS = {
    highConfidence: 5,
    mediumConfidence: 15
  };
  var EXCESSIVE_OVERRIDES_THRESHOLD = 5;

  // src/features/health-check/hc-colors.ts
  var DS_COLOR_TOKENS = DS_TOKENS.filter((t) => t.category === "color");
  var dsColorMap = {};
  for (const token of DS_COLOR_TOKENS) {
    dsColorMap[token.name] = token.value.toLowerCase();
  }
  var DS_COLOR_HEX_SET = new Set(Object.values(dsColorMap));
  var findNearestToken = nearest_default(
    Object.keys(dsColorMap),
    differenceCiede2000(),
    (name) => dsColorMap[name]
  );
  var computeDeltaE = differenceCiede2000();
  function findNearestColorToken(hex5) {
    const results = findNearestToken(hex5, 1, Infinity);
    if (!results || results.length === 0) return null;
    const tokenName = results[0];
    const tokenHex = dsColorMap[tokenName];
    if (!tokenHex) return null;
    const parsedInput = parse_default(hex5);
    const parsedToken = parse_default(tokenHex);
    if (!parsedInput || !parsedToken) return null;
    const deltaE = computeDeltaE(parsedInput, parsedToken);
    let confidence;
    if (deltaE < DELTA_E_THRESHOLDS.highConfidence) {
      confidence = "high";
    } else if (deltaE < DELTA_E_THRESHOLDS.mediumConfidence) {
      confidence = "medium";
    } else {
      confidence = null;
    }
    return { name: tokenName, hex: tokenHex, confidence };
  }
  function checkNodeColors(node, nodePath) {
    var _a;
    const violations = [];
    const fills = getNodeFills(node);
    for (let i = 0; i < fills.length; i++) {
      const paint = fills[i];
      if (paint.type !== "SOLID") continue;
      if (paint.visible === false) continue;
      if ((_a = paint.boundVariables) == null ? void 0 : _a.color) continue;
      const solidPaint = paint;
      const hex5 = rgbToHex(solidPaint.color.r, solidPaint.color.g, solidPaint.color.b).toLowerCase();
      if (DS_COLOR_HEX_SET.has(hex5)) continue;
      const nearest2 = findNearestColorToken(hex5);
      const suggestion = nearest2 && nearest2.confidence !== null ? `${nearest2.name} (${nearest2.hex})` : void 0;
      violations.push({
        id: `hc-color-fill-${node.id}-${i}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "off-token-fill",
        severity: "error",
        category: "color",
        message: `Fill color ${hex5} is not a DS token`,
        suggestion,
        metadata: {
          currentValue: hex5,
          nearestToken: nearest2 == null ? void 0 : nearest2.name,
          nearestHex: nearest2 == null ? void 0 : nearest2.hex,
          confidence: nearest2 == null ? void 0 : nearest2.confidence
        }
      });
    }
    return violations;
  }
  function checkNodeStrokes(node, nodePath) {
    var _a;
    const violations = [];
    const strokes = getNodeStrokes(node);
    for (let i = 0; i < strokes.length; i++) {
      const paint = strokes[i];
      if (paint.type !== "SOLID") continue;
      if (paint.visible === false) continue;
      if ((_a = paint.boundVariables) == null ? void 0 : _a.color) continue;
      const solidPaint = paint;
      const hex5 = rgbToHex(solidPaint.color.r, solidPaint.color.g, solidPaint.color.b).toLowerCase();
      if (DS_COLOR_HEX_SET.has(hex5)) continue;
      const nearestColor = findNearestColorToken(hex5);
      const suggestion = nearestColor && nearestColor.confidence !== null ? `${nearestColor.name} (${nearestColor.hex})` : void 0;
      violations.push({
        id: `hc-color-stroke-${node.id}-${i}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "off-token-stroke",
        severity: "error",
        category: "color",
        message: `Stroke color ${hex5} is not a DS token`,
        suggestion,
        metadata: {
          currentValue: hex5,
          nearestToken: nearestColor == null ? void 0 : nearestColor.name,
          nearestHex: nearestColor == null ? void 0 : nearestColor.hex,
          confidence: nearestColor == null ? void 0 : nearestColor.confidence
        }
      });
    }
    return violations;
  }

  // src/features/health-check/hc-typography.ts
  function checkNodeTypography(node, nodePath) {
    if (node.type !== "TEXT") return [];
    const textNode = node;
    const violations = [];
    const textStyleId = textNode.textStyleId;
    if (textStyleId === figma.mixed) {
      violations.push({
        id: `hc-typography-mixed-style-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "mixed-text-styles",
        severity: "info",
        category: "typography",
        message: "Text has mixed styles across ranges"
      });
    } else if (textStyleId === "" || textStyleId === null || textStyleId === void 0) {
      violations.push({
        id: `hc-typography-no-style-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "missing-text-style",
        severity: "warning",
        category: "typography",
        message: "Text node has no linked text style",
        suggestion: "Link to a DS text style"
      });
    }
    const fontName = textNode.fontName;
    if (fontName === figma.mixed) {
      violations.push({
        id: `hc-typography-mixed-font-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "mixed-fonts",
        severity: "info",
        category: "typography",
        message: "Text has mixed font families \u2014 check each segment manually"
      });
    } else {
      if (fontName.family !== fonts.family) {
        violations.push({
          id: `hc-typography-off-ds-font-${node.id}`,
          nodeId: node.id,
          nodeName: node.name,
          nodePath,
          rule: "off-ds-font",
          severity: "error",
          category: "typography",
          message: `Font '${fontName.family}' is not the DS font (${fonts.family})`,
          suggestion: fonts.family,
          metadata: {
            currentFont: fontName.family,
            dsFont: fonts.family
          }
        });
      }
    }
    return violations;
  }

  // src/features/health-check/hc-spacing.ts
  var DS_SPACING_VALUES = DS_TOKENS.filter((t) => t.category === "spacing").map(
    (t) => parseInt(t.value, 10)
  );
  var DS_SPACING_SET = /* @__PURE__ */ new Set([0, ...DS_SPACING_VALUES]);
  var spacingValueToName = {};
  for (const token of DS_TOKENS.filter((t) => t.category === "spacing")) {
    const val = parseInt(token.value, 10);
    spacingValueToName[val] = token.name;
  }
  function findNearestSpacing(value) {
    var _a;
    let nearest2 = DS_SPACING_VALUES[0];
    let minDist = Math.abs(value - nearest2);
    for (const sv of DS_SPACING_VALUES) {
      const dist = Math.abs(value - sv);
      if (dist < minDist) {
        minDist = dist;
        nearest2 = sv;
      }
    }
    const name = (_a = spacingValueToName[nearest2]) != null ? _a : `spacing (${nearest2}px)`;
    return { label: `${name} (${nearest2}px)`, value: nearest2 };
  }
  function checkNodeSpacing(node, nodePath) {
    var _a;
    if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "COMPONENT_SET" && node.type !== "INSTANCE") {
      return [];
    }
    const frame = node;
    if (frame.layoutMode === "NONE") return [];
    const violations = [];
    const propsToCheck = [
      { key: "paddingTop", label: "paddingTop" },
      { key: "paddingBottom", label: "paddingBottom" },
      { key: "paddingLeft", label: "paddingLeft" },
      { key: "paddingRight", label: "paddingRight" },
      { key: "itemSpacing", label: "itemSpacing" }
    ];
    for (const { key, label } of propsToCheck) {
      const value = frame[key];
      if (value === 0) continue;
      if (DS_SPACING_SET.has(value)) {
        const bv = frame.boundVariables;
        if (!bv || !bv[key]) {
          const tokenName = (_a = spacingValueToName[value]) != null ? _a : `Spacing (${value}px)`;
          violations.push({
            id: `hc-spacing-unbound-${node.id}-${label}`,
            nodeId: node.id,
            nodeName: node.name,
            nodePath,
            rule: "missing-spacing-var",
            severity: "info",
            category: "spacing",
            message: `${label}: ${value}px is not bound to a DS variable`,
            suggestion: tokenName,
            metadata: {
              property: label,
              currentValue: value,
              nearestValue: value
            }
          });
        }
        continue;
      }
      var nearestSpacing = findNearestSpacing(value);
      violations.push({
        id: `hc-spacing-${node.id}-${label}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "off-token-spacing",
        severity: "warning",
        category: "spacing",
        message: `${label}: ${value}px is not on the DS spacing scale`,
        suggestion: nearestSpacing.label,
        metadata: {
          property: label,
          currentValue: value,
          nearestValue: nearestSpacing.value
        }
      });
    }
    return violations;
  }

  // src/features/health-check/hc-components.ts
  function collectInstanceIds(node) {
    if (node.type === "INSTANCE") return node.id;
    return null;
  }
  function checkDetachedInstances(node, nodePath) {
    if (node.type !== "FRAME") return [];
    const frame = node;
    const violations = [];
    if (frame.detachedInfo !== null && frame.detachedInfo !== void 0) {
      violations.push({
        id: `hc-component-detached-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath,
        rule: "detached-instance",
        severity: "error",
        category: "component",
        message: "Detached instance (was previously a component instance)"
      });
    }
    return violations;
  }
  async function resolveComponentViolations(instanceIds) {
    const violations = [];
    for (const nodeId of instanceIds) {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type !== "INSTANCE") continue;
      const instance = node;
      const main = await instance.getMainComponentAsync();
      if (main && main.remote) continue;
      if (main === null) {
        violations.push({
          id: `hc-component-broken-${nodeId}`,
          nodeId,
          nodeName: instance.name,
          nodePath: instance.name,
          rule: "broken-component",
          severity: "error",
          category: "component",
          message: "Component reference is broken (source component missing or deleted)"
        });
      }
      if (instance.overrides && instance.overrides.length >= EXCESSIVE_OVERRIDES_THRESHOLD) {
        violations.push({
          id: `hc-component-overrides-${nodeId}`,
          nodeId,
          nodeName: instance.name,
          nodePath: instance.name,
          rule: "excessive-overrides",
          severity: "info",
          category: "component",
          message: `Instance has ${instance.overrides.length} overrides (threshold: ${EXCESSIVE_OVERRIDES_THRESHOLD}) \u2014 consider if a new component variant is needed`,
          metadata: {
            overrideCount: instance.overrides.length,
            threshold: EXCESSIVE_OVERRIDES_THRESHOLD
          }
        });
      }
    }
    return violations;
  }

  // src/features/health-check/hc-coverage.ts
  async function classifyCoverageInstances(instanceIds) {
    let dsCount = 0;
    let customCount = 0;
    let deprecatedDSCount = 0;
    const violations = [];
    const customGroups = /* @__PURE__ */ new Map();
    for (const nodeId of instanceIds) {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type !== "INSTANCE") continue;
      const instance = node;
      let main = null;
      try {
        main = await instance.getMainComponentAsync();
      } catch (_) {
        main = null;
      }
      if (main === null) {
        customCount++;
        const groupName = instance.name || "_broken";
        const group = customGroups.get(groupName);
        if (group) {
          group.count++;
          group.nodeIds.push(nodeId);
        } else {
          customGroups.set(groupName, { count: 1, nodeIds: [nodeId] });
        }
        continue;
      }
      if (main.remote) {
        dsCount++;
        const nameLC = main.name.toLowerCase();
        const descLC = (main.description || "").toLowerCase();
        if (nameLC.includes("deprecated") || descLC.includes("deprecated")) {
          deprecatedDSCount++;
          violations.push({
            id: `hc-coverage-deprecated-${nodeId}`,
            nodeId,
            nodeName: instance.name,
            nodePath: instance.name,
            rule: "deprecated-ds-component",
            severity: "warning",
            category: "coverage",
            message: `Deprecated DS component: ${main.name}`,
            metadata: {
              componentName: main.name,
              componentDescription: main.description || ""
            }
          });
        }
      } else {
        customCount++;
        const groupName = main.name || instance.name;
        const group = customGroups.get(groupName);
        if (group) {
          group.count++;
          group.nodeIds.push(nodeId);
        } else {
          customGroups.set(groupName, { count: 1, nodeIds: [nodeId] });
        }
      }
    }
    for (const [name, group] of customGroups) {
      violations.push({
        id: `hc-coverage-custom-${name}`,
        nodeId: group.nodeIds[0],
        nodeName: name,
        nodePath: name,
        rule: "custom-component",
        severity: "info",
        category: "coverage",
        message: `${name} (${group.count} instance(s))`,
        metadata: {
          instanceCount: group.count,
          nodeIds: group.nodeIds
        }
      });
    }
    const totalCount = dsCount + customCount;
    const score = totalCount === 0 ? -1 : Math.round(dsCount / totalCount * 100);
    return {
      dsCount,
      customCount,
      totalCount,
      score,
      deprecatedDSCount,
      violations
    };
  }

  // src/features/health-check/hc-engine.ts
  function hasVisibleFillsOrStrokes(node) {
    const fills = getNodeFills(node);
    for (const paint of fills) {
      if (paint.type === "SOLID" && paint.visible !== false) return true;
    }
    const strokes = getNodeStrokes(node);
    for (const paint of strokes) {
      if (paint.type === "SOLID" && paint.visible !== false) return true;
    }
    return false;
  }
  function isAutoLayout(node) {
    if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "COMPONENT_SET" && node.type !== "INSTANCE") {
      return false;
    }
    return node.layoutMode !== "NONE";
  }
  function calculateHCCategoryScore(category, violations, totalChecked) {
    if (totalChecked === 0) {
      return { category, score: 100, weight: 1, violationCount: 0, totalChecked: 0 };
    }
    const weightedCount = violations.reduce((sum, v) => {
      var _a;
      return sum + ((_a = HC_SEVERITY_WEIGHTS[v.severity]) != null ? _a : 1);
    }, 0);
    const score = Math.max(0, Math.round(100 - weightedCount / totalChecked * 100));
    return { category, score, weight: 1, violationCount: violations.length, totalChecked };
  }
  function buildCategoryResult(violations, totalChecked, score) {
    return {
      score,
      violationGroups: groupViolationsByRule(violations),
      totalChecked,
      totalViolations: violations.length
    };
  }
  async function runHealthCheck(scope, abortToken, onProgress) {
    const startTime = Date.now();
    const colorViolations = [];
    const typographyViolations = [];
    const spacingViolations = [];
    const componentViolations = [];
    const instanceIds = [];
    const coverageInstanceIds = [];
    let colorNodesChecked = 0;
    let textNodesChecked = 0;
    let layoutNodesChecked = 0;
    let componentNodesChecked = 0;
    const traversalResult = await traverseNodes((node, _depth, path) => {
      if (node.type === "INSTANCE") {
        coverageInstanceIds.push(node.id);
      }
      if (node.type === "INSTANCE") {
        try {
          const main = await(node).getMainComponentAsync();
          if (main && main.remote) return false;
        } catch (_) {
          return false;
        }
      }
      const fillViolations = checkNodeColors(node, path);
      const strokeViolations = checkNodeStrokes(node, path);
      if (fillViolations.length > 0 || strokeViolations.length > 0 || hasVisibleFillsOrStrokes(node)) {
        colorNodesChecked++;
      }
      colorViolations.push(...fillViolations, ...strokeViolations);
      if (node.type === "TEXT") {
        textNodesChecked++;
        typographyViolations.push(...checkNodeTypography(node, path));
      }
      if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "COMPONENT_SET" || node.type === "INSTANCE") {
        const spacingResult = checkNodeSpacing(node, path);
        if (spacingResult.length > 0 || isAutoLayout(node)) {
          layoutNodesChecked++;
        }
        spacingViolations.push(...spacingResult);
      }
      const instanceId = collectInstanceIds(node);
      if (instanceId) instanceIds.push(instanceId);
      const detached = checkDetachedInstances(node, path);
      componentViolations.push(...detached);
      if (node.type === "INSTANCE" || node.type === "FRAME" && detached.length > 0) {
        componentNodesChecked++;
      }
    }, {
      scope,
      chunkSize: 150,
      abortToken,
      onProgress: (processed, total) => {
        if (onProgress) onProgress("Scanning nodes", processed, total);
      }
    });
    if (onProgress) onProgress("Checking components", 0, instanceIds.length);
    const asyncComponentViolations = await resolveComponentViolations(instanceIds);
    componentViolations.push(...asyncComponentViolations);
    componentNodesChecked += instanceIds.length;
    if (onProgress) onProgress("Checking coverage", 0, coverageInstanceIds.length);
    const coverageResult = await classifyCoverageInstances(coverageInstanceIds);
    const coverageCatScore = {
      category: "coverage",
      score: coverageResult.score === -1 ? 100 : coverageResult.score,
      weight: coverageResult.score === -1 ? 0 : 1,
      violationCount: coverageResult.violations.length,
      totalChecked: coverageResult.totalCount
    };
    const categoryScores = [
      calculateHCCategoryScore("colors", colorViolations, colorNodesChecked),
      calculateHCCategoryScore("typography", typographyViolations, textNodesChecked),
      calculateHCCategoryScore("spacing", spacingViolations, layoutNodesChecked),
      calculateHCCategoryScore("components", componentViolations, componentNodesChecked),
      coverageCatScore
    ];
    const scoreResult = buildScoreResult(categoryScores);
    return {
      scoreResult,
      categories: {
        color: buildCategoryResult(colorViolations, colorNodesChecked, categoryScores[0].score),
        typography: buildCategoryResult(typographyViolations, textNodesChecked, categoryScores[1].score),
        spacing: buildCategoryResult(spacingViolations, layoutNodesChecked, categoryScores[2].score),
        component: buildCategoryResult(componentViolations, componentNodesChecked, categoryScores[3].score),
        coverage: buildCategoryResult(coverageResult.violations, coverageResult.totalCount, coverageCatScore.score)
      },
      scanDuration: Date.now() - startTime,
      totalNodesScanned: traversalResult.processed,
      scope
    };
  }

  // src/features/health-check/hc-autofix.ts
  var STYLE_MAP = {
    Thin: "Light",
    ExtraLight: "Light",
    Light: "Light",
    Regular: "Regular",
    Medium: "Medium",
    SemiBold: "Bold",
    Bold: "Bold",
    ExtraBold: "Bold",
    Black: "Bold",
    Italic: "Italic"
  };
  var _spacingVarsCache = null;
  var _textStylesCache = null;
  function resetResolutionCache() {
    _spacingVarsCache = null;
    _textStylesCache = null;
  }
  async function resolveSpacingVariable(value) {
    if (!_spacingVarsCache) {
      var allVars = await figma.variables.getLocalVariablesAsync("FLOAT");
      try {
        var libCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
        for (var c2 = 0; c2 < libCollections.length; c2++) {
          var col = libCollections[c2];
          if (!col.libraryName.toLowerCase().includes("marcel")) continue;
          var libVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(
            col.key
          );
          for (var lv = 0; lv < libVars.length; lv++) {
            var imported = await figma.variables.importVariableByKeyAsync(
              libVars[lv].key
            );
            allVars.push(imported);
          }
        }
      } catch (_e) {
      }
      _spacingVarsCache = allVars;
    }
    for (var i = 0; i < _spacingVarsCache.length; i++) {
      var v = _spacingVarsCache[i];
      if (!v.name.toLowerCase().includes("spacing")) continue;
      var modeIds = Object.keys(v.valuesByMode);
      if (modeIds.length === 0) continue;
      var raw = v.valuesByMode[modeIds[0]];
      var val = raw;
      if (typeof raw === "object" && raw !== null && "id" in raw) {
        try {
          var aliased = await figma.variables.getVariableByIdAsync(raw.id);
          if (aliased) {
            var aModes = Object.keys(aliased.valuesByMode);
            if (aModes.length > 0) val = aliased.valuesByMode[aModes[0]];
          }
        } catch (_e2) {
        }
      }
      if (typeof val === "number" && val === value) return v;
    }
    return null;
  }
  async function resolveTextStyle(textNode) {
    if (!_textStylesCache) {
      var allStyles = await figma.getLocalTextStylesAsync();
      try {
        var libStyles = await figma.teamLibrary.getAvailableLibraryTextStylesAsync();
        for (var ls = 0; ls < libStyles.length; ls++) {
          var libStyle = libStyles[ls];
          if (!libStyle.libraryName.toLowerCase().includes("marcel")) continue;
          var imported = await figma.importStyleByKeyAsync(
            libStyle.key
          );
          allStyles.push(imported);
        }
      } catch (_e) {
      }
      _textStylesCache = allStyles;
    }
    var fontName = textNode.fontName;
    if (fontName === figma.mixed) return null;
    var nodeFontSize = textNode.fontSize;
    if (nodeFontSize === figma.mixed) return null;
    var nodeWeight = fontName.style;
    var bestMatch = null;
    for (var i = 0; i < _textStylesCache.length; i++) {
      var style = _textStylesCache[i];
      if (style.fontName.family !== fonts.family) continue;
      if (style.fontSize !== nodeFontSize) continue;
      if (style.fontName.style === nodeWeight) return style;
      if (!bestMatch) bestMatch = style;
    }
    return bestMatch;
  }
  async function hcFixNode(nodeId, violation) {
    var node = await figma.getNodeByIdAsync(nodeId);
    if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
      return { success: false, detail: "Node not found" };
    }
    var sceneNode = node;
    switch (violation.rule) {
      case "off-token-fill":
        return fixFillColor(sceneNode, violation.metadata);
      case "off-token-stroke":
        return fixStrokeColor(sceneNode, violation.metadata);
      case "off-token-spacing":
      case "missing-spacing-var":
        return await fixSpacing(sceneNode, violation.metadata);
      case "off-ds-font":
        return await fixTypography(sceneNode, violation.metadata);
      case "missing-text-style":
        return await fixMissingTextStyle(sceneNode);
      default:
        return { success: false, detail: "Not fixable" };
    }
  }
  function fixFillColor(node, meta) {
    if (!(meta == null ? void 0 : meta.nearestHex) || !("fills" in node)) {
      return { success: false, detail: "Missing metadata or fills" };
    }
    var fills = node.fills;
    if (fills === figma.mixed) {
      return { success: false, detail: "Mixed fills" };
    }
    var currentHex = String(meta.currentValue).toLowerCase();
    var targetHex = String(meta.nearestHex).toLowerCase();
    var targetRgb = hexToRgb(targetHex);
    var newFills = [];
    var matched = false;
    for (var i = 0; i < fills.length; i++) {
      var paint = fills[i];
      if (!matched && paint.type === "SOLID") {
        var paintHex = rgbToHex(paint.color.r, paint.color.g, paint.color.b).toLowerCase();
        if (paintHex === currentHex) {
          var newPaint = {
            type: "SOLID",
            color: targetRgb,
            opacity: paint.opacity,
            visible: paint.visible,
            blendMode: paint.blendMode
          };
          newFills.push(newPaint);
          matched = true;
          continue;
        }
      }
      newFills.push(paint);
    }
    if (!matched) {
      return { success: false, detail: "Paint not found" };
    }
    node.fills = newFills;
    return { success: true, detail: targetHex };
  }
  function fixStrokeColor(node, meta) {
    if (!(meta == null ? void 0 : meta.nearestHex) || !("strokes" in node)) {
      return { success: false, detail: "Missing metadata or strokes" };
    }
    var strokes = node.strokes;
    var currentHex = String(meta.currentValue).toLowerCase();
    var targetHex = String(meta.nearestHex).toLowerCase();
    var targetRgb = hexToRgb(targetHex);
    var newStrokes = [];
    var matched = false;
    for (var i = 0; i < strokes.length; i++) {
      var paint = strokes[i];
      if (!matched && paint.type === "SOLID") {
        var paintHex = rgbToHex(paint.color.r, paint.color.g, paint.color.b).toLowerCase();
        if (paintHex === currentHex) {
          var newPaint = {
            type: "SOLID",
            color: targetRgb,
            opacity: paint.opacity,
            visible: paint.visible,
            blendMode: paint.blendMode
          };
          newStrokes.push(newPaint);
          matched = true;
          continue;
        }
      }
      newStrokes.push(paint);
    }
    if (!matched) {
      return { success: false, detail: "Stroke paint not found" };
    }
    node.strokes = newStrokes;
    return { success: true, detail: targetHex };
  }
  async function fixSpacing(node, meta) {
    if (!(meta == null ? void 0 : meta.property) || (meta == null ? void 0 : meta.nearestValue) === void 0) {
      return { success: false, detail: "Missing metadata" };
    }
    var property = String(meta.property);
    var nearestValue = Number(meta.nearestValue);
    var variable = await resolveSpacingVariable(nearestValue);
    if (variable) {
      try {
        node.setBoundVariable(property, variable);
      } catch (_e) {
        node[property] = nearestValue;
      }
    } else {
      node[property] = nearestValue;
    }
    return { success: true, detail: String(nearestValue) };
  }
  async function fixTypography(node, meta) {
    if (node.type !== "TEXT") {
      return { success: false, detail: "Not a text node" };
    }
    var textNode = node;
    var fontName = textNode.fontName;
    if (fontName === figma.mixed) {
      return { success: false, detail: "Mixed fonts" };
    }
    var currentStyle = fontName.style;
    var targetStyle = STYLE_MAP[currentStyle] || "Regular";
    try {
      await loadFont(fonts.family, targetStyle);
      textNode.fontName = { family: fonts.family, style: targetStyle };
    } catch (_e) {
      try {
        await loadFont(fonts.family, "Regular");
        textNode.fontName = { family: fonts.family, style: "Regular" };
      } catch (_e2) {
        return { success: false, detail: "Font load failed" };
      }
    }
    var textStyle = await resolveTextStyle(textNode);
    if (textStyle) await textNode.setTextStyleIdAsync(textStyle.id);
    return { success: true, detail: fonts.family };
  }
  async function fixMissingTextStyle(node) {
    if (node.type !== "TEXT") {
      return { success: false, detail: "Not a text node" };
    }
    var textNode = node;
    var textStyle = await resolveTextStyle(textNode);
    if (textStyle) {
      await textNode.setTextStyleIdAsync(textStyle.id);
      return { success: true, detail: textStyle.name };
    }
    return { success: false, detail: "No matching DS text style" };
  }
  async function hcFixAll(violations) {
    resetResolutionCache();
    var fixed = 0;
    var failed = 0;
    var fixedNodeIds = [];
    var fixedViolationIds = [];
    var fixable = [];
    for (var i = 0; i < violations.length; i++) {
      var v = violations[i];
      if (v.category === "component") continue;
      if (v.confidence !== void 0 && v.confidence === "low") continue;
      fixable.push(v);
    }
    if (fixable.length === 0) {
      return { fixed: 0, failed: 0, fixedNodeIds: [], fixedViolationIds: [] };
    }
    for (var j = 0; j < fixable.length; j++) {
      var fv = fixable[j];
      var result = await hcFixNode(fv.nodeId, { rule: fv.rule, metadata: fv.metadata });
      if (result.success) {
        fixed++;
        fixedNodeIds.push(fv.nodeId);
        fixedViolationIds.push(fv.id);
      } else {
        failed++;
      }
    }
    if (fixedNodeIds.length > 0) {
      var fixedNodes = [];
      for (var k4 = 0; k4 < fixedNodeIds.length; k4++) {
        var fn5 = await figma.getNodeByIdAsync(fixedNodeIds[k4]);
        if (fn5 && "type" in fn5 && fn5.type !== "DOCUMENT" && fn5.type !== "PAGE") {
          fixedNodes.push(fn5);
        }
      }
      if (fixedNodes.length > 0) {
        figma.currentPage.selection = fixedNodes;
        figma.viewport.scrollAndZoomIntoView(fixedNodes);
      }
    }
    return { fixed, failed, fixedNodeIds, fixedViolationIds };
  }

  // src/features/cover-updater/cover-types.ts
  var STATUS_TO_KEY = {
    "In Progress": DS_COMPONENT_KEYS.coverInProgress,
    "Design Done": DS_COMPONENT_KEYS.coverDesignDone,
    "Archived": DS_COMPONENT_KEYS.coverArchived,
    "SOT": DS_COMPONENT_KEYS.coverSOT,
    "Playground": DS_COMPONENT_KEYS.coverPlayground
  };
  var DEFAULT_COVER_CONFIG = {
    projectStatus: "In Progress"
  };

  // src/features/cover-updater/cover-config.ts
  var coverStorage = createStorage("cover");
  async function loadCoverConfig() {
    const stored = await coverStorage.get("config");
    if (stored && typeof stored === "object" && "projectStatus" in stored) {
      return { projectStatus: stored.projectStatus };
    }
    return __spreadValues({}, DEFAULT_COVER_CONFIG);
  }
  async function saveCoverConfig(config) {
    await coverStorage.set("config", config);
  }

  // src/features/cover-updater/cover-updater.ts
  var COVER_PAGE_NAME = STARTER_KIT_PAGES[0].name;
  function findCoverInstance(page) {
    const wrapper = page.findChild((n) => n.name === "Cover" && n.type === "FRAME");
    if (wrapper) {
      const instance = wrapper.findChild((n) => n.type === "INSTANCE");
      if (instance) return instance;
    }
    return page.findChild((n) => n.type === "INSTANCE");
  }
  async function generateOrUpdateCover(config) {
    if (!config) {
      config = await loadCoverConfig();
    }
    const componentKey = STATUS_TO_KEY[config.projectStatus] || STATUS_TO_KEY["In Progress"];
    const coverPage = figma.root.findChild((n) => n.name === COVER_PAGE_NAME);
    if (!coverPage) {
      throw new Error("Aucune page Cover trouv\xE9e. Lance d'abord le Starter Kit.");
    }
    await coverPage.loadAsync();
    const instance = findCoverInstance(coverPage);
    if (!instance) {
      throw new Error("Aucun composant Cover trouv\xE9 sur la page. Lance d'abord le Starter Kit.");
    }
    const targetComponent = await figma.importComponentByKeyAsync(componentKey);
    instance.swapComponent(targetComponent);
  }

  // src/features/dead-styles/dead-styles-engine.ts
  var variableCache = /* @__PURE__ */ new Map();
  var styleCache = /* @__PURE__ */ new Map();
  function collectVariableIds(bv, usedIds) {
    for (const key in bv) {
      const val = bv[key];
      if (!val) continue;
      if (val.type === "VARIABLE_ALIAS" && val.id) {
        usedIds.add(val.id);
      }
      if (Array.isArray(val)) {
        for (const item of val) {
          if (item && item.type === "VARIABLE_ALIAS" && item.id) {
            usedIds.add(item.id);
          }
        }
      }
      if (typeof val === "object" && !Array.isArray(val) && val.type !== "VARIABLE_ALIAS") {
        collectVariableIds(val, usedIds);
      }
    }
  }
  function collectPaintVariableIds(node, usedIds) {
    if ("fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
      for (const paint of node.fills) {
        if (paint.boundVariables) {
          collectVariableIds(paint.boundVariables, usedIds);
        }
        if (paint.gradientStops) {
          for (const stop of paint.gradientStops) {
            if (stop.boundVariables) {
              collectVariableIds(stop.boundVariables, usedIds);
            }
          }
        }
      }
    }
    if ("strokes" in node && Array.isArray(node.strokes)) {
      for (const paint of node.strokes) {
        if (paint.boundVariables) {
          collectVariableIds(paint.boundVariables, usedIds);
        }
      }
    }
    if ("effects" in node && node.effects !== figma.mixed && Array.isArray(node.effects)) {
      for (const effect of node.effects) {
        if (effect.boundVariables) {
          collectVariableIds(effect.boundVariables, usedIds);
        }
      }
    }
  }
  function collectRawVarBindings(node, bindings, seenKeys) {
    var _a, _b;
    if (node.boundVariables) {
      const bv = node.boundVariables;
      for (const field in bv) {
        const val = bv[field];
        if (!val) continue;
        if (val.type === "VARIABLE_ALIAS" && val.id) {
          const key = `${val.id}-${node.id}-${field}`;
          if (!seenKeys.has(key)) {
            seenKeys.add(key);
            bindings.push({ varId: val.id, nodeId: node.id, nodeName: node.name, field });
          }
        }
        if (Array.isArray(val)) {
          for (let idx = 0; idx < val.length; idx++) {
            const item = val[idx];
            if (item && item.type === "VARIABLE_ALIAS" && item.id) {
              const key = `${item.id}-${node.id}-${field}-${idx}`;
              if (!seenKeys.has(key)) {
                seenKeys.add(key);
                bindings.push({ varId: item.id, nodeId: node.id, nodeName: node.name, field, paintIndex: idx });
              }
            }
          }
        }
      }
    }
    if ("fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills)) {
      const fills = node.fills;
      for (let i = 0; i < fills.length; i++) {
        const paint = fills[i];
        if ((_a = paint.boundVariables) == null ? void 0 : _a.color) {
          const alias = paint.boundVariables.color;
          if (alias.type === "VARIABLE_ALIAS" && alias.id) {
            const key = `${alias.id}-${node.id}-fills-${i}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              bindings.push({ varId: alias.id, nodeId: node.id, nodeName: node.name, field: "fills", paintIndex: i });
            }
          }
        }
      }
    }
    if ("strokes" in node && Array.isArray(node.strokes)) {
      const strokes = node.strokes;
      for (let i = 0; i < strokes.length; i++) {
        const paint = strokes[i];
        if ((_b = paint.boundVariables) == null ? void 0 : _b.color) {
          const alias = paint.boundVariables.color;
          if (alias.type === "VARIABLE_ALIAS" && alias.id) {
            const key = `${alias.id}-${node.id}-strokes-${i}`;
            if (!seenKeys.has(key)) {
              seenKeys.add(key);
              bindings.push({ varId: alias.id, nodeId: node.id, nodeName: node.name, field: "strokes", paintIndex: i });
            }
          }
        }
      }
    }
  }
  function collectRawStyleBindings(node, bindings, seenKeys) {
    const styleFields = [
      { prop: "fillStyleId", itemType: "PAINT" },
      { prop: "strokeStyleId", itemType: "PAINT" },
      { prop: "textStyleId", itemType: "TEXT" },
      { prop: "effectStyleId", itemType: "EFFECT" }
    ];
    for (const { prop, itemType } of styleFields) {
      if (!(prop in node)) continue;
      const styleId = node[prop];
      if (styleId === figma.mixed || typeof styleId !== "string" || !styleId) continue;
      const key = `${styleId}-${node.id}-${prop}`;
      if (seenKeys.has(key)) continue;
      seenKeys.add(key);
      bindings.push({ styleId, nodeId: node.id, nodeName: node.name, prop, itemType });
    }
  }
  function extractStylePreview(style) {
    if (style.type === "PAINT") {
      const ps = style;
      const paint = ps.paints[0];
      if (paint && paint.type === "SOLID") {
        return {
          type: "color",
          hex: rgbToHex(paint.color.r, paint.color.g, paint.color.b),
          opacity: paint.opacity !== void 0 && paint.opacity < 1 ? paint.opacity : void 0
        };
      }
      return { type: "gradient", description: "Gradient" };
    }
    if (style.type === "TEXT") {
      const ts = style;
      return {
        type: "text",
        fontFamily: ts.fontName.family,
        fontSize: ts.fontSize,
        fontStyle: ts.fontName.style
      };
    }
    if (style.type === "EFFECT") {
      const es = style;
      const effectTypes = es.effects.map((e4) => e4.type).join(", ");
      return { type: "effect", description: effectTypes || "No effects" };
    }
    return { type: "unknown" };
  }
  var APPROVED_COLLECTIONS = ["Layout", "Semantics", "Text Styles", "Themes", "Decorative"];
  function isApprovedCollection(name) {
    return APPROVED_COLLECTIONS.some(
      (approved) => name.toLowerCase() === approved.toLowerCase()
    );
  }
  async function classifyAndCacheVariable(varId) {
    if (variableCache.has(varId)) {
      return variableCache.get(varId);
    }
    try {
      const variable = await figma.variables.getVariableByIdAsync(varId);
      if (!variable) {
        const entry2 = {
          name: varId,
          remote: true,
          collectionName: "Unknown (inaccessible)",
          isForeign: true,
          resolvedType: "UNKNOWN",
          key: ""
        };
        variableCache.set(varId, entry2);
        return entry2;
      }
      if (!variable.remote) {
        const entry2 = {
          name: variable.name,
          remote: false,
          collectionName: "",
          isForeign: false,
          resolvedType: variable.resolvedType,
          key: variable.key
        };
        variableCache.set(varId, entry2);
        return entry2;
      }
      let collectionName = "";
      try {
        const collection = await figma.variables.getVariableCollectionByIdAsync(
          variable.variableCollectionId
        );
        collectionName = collection ? collection.name : "";
      } catch (e4) {
        collectionName = "";
      }
      const isForeign = !collectionName || !isApprovedCollection(collectionName);
      const entry = {
        name: variable.name,
        remote: true,
        collectionName,
        isForeign,
        resolvedType: variable.resolvedType,
        key: variable.key
      };
      variableCache.set(varId, entry);
      return entry;
    } catch (e4) {
      const entry = {
        name: varId,
        remote: true,
        collectionName: "Unknown (error)",
        isForeign: true,
        resolvedType: "UNKNOWN",
        key: ""
      };
      variableCache.set(varId, entry);
      return entry;
    }
  }
  async function classifyStyle(styleId) {
    if (styleCache.has(styleId)) {
      return styleCache.get(styleId);
    }
    try {
      const style = await figma.getStyleByIdAsync(styleId);
      if (!style) {
        styleCache.set(styleId, null);
        return null;
      }
      if (!style.remote) {
        const entry2 = {
          isForeign: false,
          libraryName: "",
          styleName: style.name,
          styleType: style.type
        };
        styleCache.set(styleId, entry2);
        return entry2;
      }
      const stylePath = style.name.toUpperCase();
      const isForeign = stylePath.includes("DEPRECATED") || stylePath.includes("[DS] FOUNDATION") || stylePath.includes("DO NOT USE");
      const entry = {
        isForeign,
        libraryName: style.description || "Remote library",
        styleName: style.name,
        styleType: style.type
      };
      styleCache.set(styleId, entry);
      return entry;
    } catch (e4) {
      styleCache.set(styleId, null);
      return null;
    }
  }
  var dsVariableKeyMap = /* @__PURE__ */ new Map();
  async function buildDSVariableKeyMap() {
    dsVariableKeyMap = /* @__PURE__ */ new Map();
    try {
      const libCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      for (const col of libCollections) {
        if (!col.libraryName.toLowerCase().includes("marcel")) continue;
        const libVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(col.key);
        for (const lv of libVars) {
          if (lv.resolvedType === "COLOR") {
            dsVariableKeyMap.set(lv.name, lv.key);
          }
        }
      }
    } catch (e4) {
    }
  }
  function suggestDSColorReplacement(color) {
    const hex5 = rgbToHex(color.r, color.g, color.b);
    const nearest2 = findNearestColorToken(hex5);
    if (!nearest2 || nearest2.confidence === null) return null;
    return {
      tokenName: nearest2.name,
      tokenHex: nearest2.hex,
      variableKey: dsVariableKeyMap.get(nearest2.name),
      confidence: nearest2.confidence
    };
  }
  async function resolveVariableColorPreview(varId, cached) {
    if (cached.resolvedType === "COLOR") {
      try {
        const variable = await figma.variables.getVariableByIdAsync(varId);
        if (variable) {
          const collection = await figma.variables.getVariableCollectionByIdAsync(
            variable.variableCollectionId
          );
          if (collection) {
            const defaultModeId = collection.defaultModeId;
            const value = variable.valuesByMode[defaultModeId];
            if (value && typeof value === "object" && "r" in value) {
              const rgb2 = value;
              const hex5 = rgbToHex(rgb2.r, rgb2.g, rgb2.b);
              return {
                preview: { type: "color", hex: hex5, resolvedType: "COLOR" },
                suggestion: suggestDSColorReplacement(rgb2)
              };
            }
          }
        }
      } catch (e4) {
      }
    }
    return {
      preview: {
        type: "variable",
        resolvedType: cached.resolvedType,
        description: cached.name
      },
      suggestion: null
    };
  }
  async function processForeignVariableBindings(rawBindings, foreignItems) {
    for (const binding of rawBindings) {
      const cached = await classifyAndCacheVariable(binding.varId);
      if (!cached || !cached.isForeign) continue;
      const { preview, suggestion } = await resolveVariableColorPreview(binding.varId, cached);
      const source = {
        libraryName: cached.collectionName || "Unknown library",
        variableOrStyleName: cached.name
      };
      const itemType = cached.resolvedType === "COLOR" ? "PAINT" : "VARIABLE";
      foreignItems.push({
        id: `foreign-var-${binding.varId}-${binding.nodeId}-${binding.field}`,
        nodeId: binding.nodeId,
        nodeName: binding.nodeName,
        itemType,
        bindingField: binding.field,
        paintIndex: binding.paintIndex,
        source,
        preview,
        suggestion,
        foreignId: binding.varId
      });
    }
  }
  async function processForeignStyleBindings(rawBindings, foreignItems) {
    for (const binding of rawBindings) {
      const cached = await classifyStyle(binding.styleId);
      if (!cached || !cached.isForeign) continue;
      let preview = { type: "unknown" };
      let suggestion = null;
      try {
        const style = await figma.getStyleByIdAsync(binding.styleId);
        if (style) {
          preview = extractStylePreview(style);
          if (style.type === "PAINT") {
            const ps = style;
            const paint = ps.paints[0];
            if (paint && paint.type === "SOLID") {
              suggestion = suggestDSColorReplacement(paint.color);
            }
          }
        }
      } catch (e4) {
      }
      const source = {
        libraryName: cached.libraryName,
        variableOrStyleName: cached.styleName
      };
      foreignItems.push({
        id: `foreign-style-${binding.styleId}-${binding.nodeId}`,
        nodeId: binding.nodeId,
        nodeName: binding.nodeName,
        itemType: binding.itemType,
        bindingField: binding.prop,
        source,
        preview,
        suggestion,
        foreignId: binding.styleId
      });
    }
  }
  async function scanDeadStyles(abortToken, onProgress) {
    const result = await scanStyleCleaner(abortToken, onProgress);
    return {
      deadStyles: result.deadStyles,
      totalLocalStyles: result.totalLocalStyles,
      totalLocalVariables: result.totalLocalVariables,
      scanDurationMs: result.scanDurationMs
    };
  }
  async function scanStyleCleaner(abortToken, onProgress) {
    const startTime = Date.now();
    variableCache = /* @__PURE__ */ new Map();
    styleCache = /* @__PURE__ */ new Map();
    await buildDSVariableKeyMap();
    const paintStyles = await figma.getLocalPaintStylesAsync();
    const textStyles = await figma.getLocalTextStylesAsync();
    const effectStyles = await figma.getLocalEffectStylesAsync();
    const allStyles = [...paintStyles, ...textStyles, ...effectStyles];
    const totalLocalStyles = allStyles.length;
    if (abortToken.cancelled) {
      return emptyResult2(totalLocalStyles, 0, startTime);
    }
    const deadStyles = [];
    for (let i = 0; i < allStyles.length; i++) {
      if (abortToken.cancelled) {
        return emptyResult2(totalLocalStyles, 0, startTime);
      }
      const style = allStyles[i];
      const consumers = await style.getStyleConsumersAsync();
      if (consumers.length === 0) {
        const itemType = style.type;
        deadStyles.push({
          id: style.id,
          name: style.name,
          itemType,
          preview: extractStylePreview(style)
        });
      }
      if (onProgress) {
        onProgress("styles", i + 1, totalLocalStyles);
      }
    }
    if (abortToken.cancelled) {
      return emptyResult2(totalLocalStyles, 0, startTime);
    }
    const localVars = await figma.variables.getLocalVariablesAsync();
    const totalLocalVariables = localVars.length;
    const usedVarIds = /* @__PURE__ */ new Set();
    const rawVarBindings = [];
    const rawStyleBindings = [];
    const varSeenKeys = /* @__PURE__ */ new Set();
    const styleSeenKeys = /* @__PURE__ */ new Set();
    await traverseNodes(
      (node) => {
        if (node.boundVariables) {
          collectVariableIds(node.boundVariables, usedVarIds);
        }
        collectPaintVariableIds(node, usedVarIds);
        collectRawVarBindings(node, rawVarBindings, varSeenKeys);
        collectRawStyleBindings(node, rawStyleBindings, styleSeenKeys);
      },
      {
        scope: "file",
        chunkSize: 150,
        abortToken,
        onProgress: (current, total) => {
          if (onProgress) {
            onProgress("variables", current, total);
          }
        }
      }
    );
    if (abortToken.cancelled) {
      return emptyResult2(totalLocalStyles, totalLocalVariables, startTime);
    }
    for (const ps of paintStyles) {
      if (ps.boundVariables) {
        collectVariableIds(ps.boundVariables, usedVarIds);
      }
      for (const paint of ps.paints) {
        if ("boundVariables" in paint && paint.boundVariables) {
          collectVariableIds(paint.boundVariables, usedVarIds);
        }
      }
    }
    for (const es of effectStyles) {
      if (es.boundVariables) {
        collectVariableIds(es.boundVariables, usedVarIds);
      }
      for (const effect of es.effects) {
        if ("boundVariables" in effect && effect.boundVariables) {
          collectVariableIds(effect.boundVariables, usedVarIds);
        }
      }
    }
    for (const ts of textStyles) {
      if (ts.boundVariables) {
        collectVariableIds(ts.boundVariables, usedVarIds);
      }
    }
    for (const v of localVars) {
      if (!usedVarIds.has(v.id)) {
        deadStyles.push({
          id: v.id,
          name: v.name,
          itemType: "VARIABLE",
          preview: {
            type: "variable",
            resolvedType: v.resolvedType,
            description: v.name
          }
        });
      }
    }
    if (abortToken.cancelled) {
      return emptyResult2(totalLocalStyles, totalLocalVariables, startTime);
    }
    const foreignItems = [];
    if (onProgress) {
      onProgress("foreign-variables", 0, rawVarBindings.length);
    }
    await processForeignVariableBindings(rawVarBindings, foreignItems);
    if (onProgress) {
      onProgress("foreign-variables", rawVarBindings.length, rawVarBindings.length);
    }
    if (abortToken.cancelled) {
      return emptyResult2(totalLocalStyles, totalLocalVariables, startTime);
    }
    if (onProgress) {
      onProgress("foreign-styles", 0, rawStyleBindings.length);
    }
    await processForeignStyleBindings(rawStyleBindings, foreignItems);
    if (onProgress) {
      onProgress("foreign-styles", rawStyleBindings.length, rawStyleBindings.length);
    }
    const totalForeignVariables = foreignItems.filter(
      (f3) => f3.id.startsWith("foreign-var-")
    ).length;
    const totalForeignStyles = foreignItems.filter(
      (f3) => f3.id.startsWith("foreign-style-")
    ).length;
    return {
      foreignItems,
      deadStyles,
      totalLocalStyles,
      totalLocalVariables,
      totalForeignVariables,
      totalForeignStyles,
      scanDurationMs: Date.now() - startTime
    };
  }
  function emptyResult2(totalLocalStyles, totalLocalVariables, startTime) {
    return {
      foreignItems: [],
      deadStyles: [],
      totalLocalStyles,
      totalLocalVariables,
      totalForeignVariables: 0,
      totalForeignStyles: 0,
      scanDurationMs: Date.now() - startTime
    };
  }

  // src/features/dead-styles/dead-styles-actions.ts
  async function removeDeadStyle(styleId, itemType) {
    try {
      if (itemType === "VARIABLE") {
        const variable = await figma.variables.getVariableByIdAsync(styleId);
        if (!variable) {
          return { success: false, error: "Variable introuvable" };
        }
        variable.remove();
        return { success: true };
      }
      const style = await figma.getStyleByIdAsync(styleId);
      if (!style) {
        return { success: false, error: "Style introuvable" };
      }
      style.remove();
      return { success: true };
    } catch (error) {
      return { success: false, error: (error == null ? void 0 : error.message) || "Echec de la suppression" };
    }
  }
  async function removeAllDeadStyles(items) {
    let removed = 0;
    let failed = 0;
    for (const item of items) {
      const result = await removeDeadStyle(item.id, item.itemType);
      if (result.success) {
        removed++;
      } else {
        failed++;
      }
    }
    return { removed, failed };
  }

  // src/features/dead-styles/dead-styles-fix.ts
  async function detachVariableBinding(nodeId, field, paintIndex) {
    try {
      var node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
        return { success: false, detail: "Node not found" };
      }
      var sceneNode = node;
      if ((field === "fills" || field === "strokes") && paintIndex !== void 0) {
        var paintArray;
        if (field === "fills" && "fills" in sceneNode) {
          paintArray = sceneNode.fills;
        } else if (field === "strokes" && "strokes" in sceneNode) {
          paintArray = sceneNode.strokes;
        } else {
          return { success: false, detail: "Node has no " + field };
        }
        if (paintArray === figma.mixed) {
          return { success: false, detail: "Mixed " + field };
        }
        if (paintIndex < 0 || paintIndex >= paintArray.length) {
          return { success: false, detail: "Paint index out of range" };
        }
        var newPaints = [];
        for (var i = 0; i < paintArray.length; i++) {
          if (i === paintIndex) {
            var detachedPaint = figma.variables.setBoundVariableForPaint(
              paintArray[i],
              "color",
              null
            );
            newPaints.push(detachedPaint);
          } else {
            newPaints.push(paintArray[i]);
          }
        }
        if (field === "fills") {
          sceneNode.fills = newPaints;
        } else {
          sceneNode.strokes = newPaints;
        }
        return { success: true, detail: "Variable binding detached from " + field + "[" + paintIndex + "]" };
      }
      try {
        sceneNode.setBoundVariable(field, null);
        return { success: true, detail: "Variable binding detached from " + field };
      } catch (e4) {
        return { success: false, detail: "Cannot detach " + field + ": " + ((e4 == null ? void 0 : e4.message) || "unknown error") };
      }
    } catch (error) {
      return { success: false, detail: (error == null ? void 0 : error.message) || "Detach failed" };
    }
  }
  async function replaceVariableBinding(nodeId, field, dsVariableKey, paintIndex) {
    try {
      var node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
        return { success: false, detail: "Node not found" };
      }
      var sceneNode = node;
      var dsVariable;
      try {
        dsVariable = await figma.variables.importVariableByKeyAsync(dsVariableKey);
      } catch (e4) {
        return { success: false, detail: "Cannot import DS variable: " + ((e4 == null ? void 0 : e4.message) || "key not found") };
      }
      if ((field === "fills" || field === "strokes") && paintIndex !== void 0) {
        var paintArray;
        if (field === "fills" && "fills" in sceneNode) {
          paintArray = sceneNode.fills;
        } else if (field === "strokes" && "strokes" in sceneNode) {
          paintArray = sceneNode.strokes;
        } else {
          return { success: false, detail: "Node has no " + field };
        }
        if (paintArray === figma.mixed) {
          return { success: false, detail: "Mixed " + field };
        }
        if (paintIndex < 0 || paintIndex >= paintArray.length) {
          return { success: false, detail: "Paint index out of range" };
        }
        var newPaints = [];
        for (var i = 0; i < paintArray.length; i++) {
          if (i === paintIndex) {
            var boundPaint = figma.variables.setBoundVariableForPaint(
              paintArray[i],
              "color",
              dsVariable
            );
            newPaints.push(boundPaint);
          } else {
            newPaints.push(paintArray[i]);
          }
        }
        if (field === "fills") {
          sceneNode.fills = newPaints;
        } else {
          sceneNode.strokes = newPaints;
        }
        return { success: true, detail: "Variable replaced in " + field + "[" + paintIndex + "]" };
      }
      try {
        sceneNode.setBoundVariable(field, dsVariable);
        return { success: true, detail: "Variable replaced on " + field };
      } catch (e4) {
        return { success: false, detail: "Cannot replace " + field + ": " + ((e4 == null ? void 0 : e4.message) || "unknown error") };
      }
    } catch (error) {
      return { success: false, detail: (error == null ? void 0 : error.message) || "Replace failed" };
    }
  }
  async function detachStyleBinding(nodeId, styleType, bindingField) {
    try {
      var node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
        return { success: false, detail: "Node not found" };
      }
      var sceneNode = node;
      if (styleType === "PAINT" && bindingField === "fillStyleId") {
        await sceneNode.setFillStyleIdAsync("");
        return { success: true, detail: "Fill style detached" };
      }
      if (styleType === "PAINT" && bindingField === "strokeStyleId") {
        await sceneNode.setStrokeStyleIdAsync("");
        return { success: true, detail: "Stroke style detached" };
      }
      if (styleType === "TEXT") {
        await sceneNode.setTextStyleIdAsync("");
        return { success: true, detail: "Text style detached" };
      }
      if (styleType === "EFFECT") {
        await sceneNode.setEffectStyleIdAsync("");
        return { success: true, detail: "Effect style detached" };
      }
      return { success: false, detail: "Unknown style type/field: " + styleType + "/" + bindingField };
    } catch (error) {
      return { success: false, detail: (error == null ? void 0 : error.message) || "Detach style failed" };
    }
  }
  async function batchDetachForeign(items) {
    var detached = 0;
    var failed = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var result;
      if (item.itemType === "VARIABLE" || item.itemType === "PAINT" && !item.styleType) {
        result = await detachVariableBinding(item.nodeId, item.field, item.paintIndex);
      } else {
        var styleType = item.styleType || item.itemType;
        var bindingField = item.bindingField || item.field;
        result = await detachStyleBinding(item.nodeId, styleType, bindingField);
      }
      if (result.success) {
        detached++;
      } else {
        failed++;
      }
    }
    return { detached, failed };
  }
  async function batchReplaceForeign(items) {
    var replaced = 0;
    var failed = 0;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      if (!item.suggestion) {
        continue;
      }
      var result;
      if (item.styleType) {
        var styleType = item.styleType || item.itemType;
        var bindingField = item.bindingField || item.field;
        await detachStyleBinding(item.nodeId, styleType, bindingField);
      }
      var paintField = item.field;
      if (item.field === "fillStyleId") paintField = "fills";
      else if (item.field === "strokeStyleId") paintField = "strokes";
      if (item.bindingField === "fillStyleId") paintField = "fills";
      else if (item.bindingField === "strokeStyleId") paintField = "strokes";
      if (item.suggestion.variableKey && (paintField === "fills" || paintField === "strokes")) {
        result = await replaceVariableBinding(item.nodeId, paintField, item.suggestion.variableKey, item.paintIndex);
      } else if (item.suggestion.tokenHex && (paintField === "fills" || paintField === "strokes")) {
        result = await replaceWithDSColor(item.nodeId, paintField, item.suggestion.tokenHex, item.paintIndex);
      } else {
        if (!item.styleType) {
          result = await detachVariableBinding(item.nodeId, item.field, item.paintIndex);
        } else {
          result = { success: true, detail: "Style detached (no color replacement)" };
        }
      }
      if (result.success) {
        replaced++;
      } else {
        failed++;
      }
    }
    return { replaced, failed };
  }
  async function replaceWithDSColor(nodeId, field, targetHex, paintIndex) {
    try {
      var node = await figma.getNodeByIdAsync(nodeId);
      if (!node || node.type === "DOCUMENT" || node.type === "PAGE") {
        return { success: false, detail: "Node not found" };
      }
      var sceneNode = node;
      var targetRgb = hexToRgb(targetHex);
      if (field === "fills" && "fills" in sceneNode) {
        var fills = sceneNode.fills;
        if (fills === figma.mixed) {
          return { success: false, detail: "Mixed fills" };
        }
        var newFills = [];
        for (var i = 0; i < fills.length; i++) {
          if (paintIndex !== void 0 && i !== paintIndex) {
            newFills.push(fills[i]);
            continue;
          }
          if (fills[i].type === "SOLID") {
            var detachedPaint = figma.variables.setBoundVariableForPaint(
              fills[i],
              "color",
              null
            );
            var newPaint = {
              type: "SOLID",
              color: targetRgb,
              opacity: detachedPaint.opacity,
              visible: detachedPaint.visible,
              blendMode: detachedPaint.blendMode
            };
            newFills.push(newPaint);
          } else {
            newFills.push(fills[i]);
          }
        }
        sceneNode.fills = newFills;
        return { success: true, detail: "Replaced with " + targetHex };
      }
      if (field === "strokes" && "strokes" in sceneNode) {
        var strokes = sceneNode.strokes;
        var newStrokes = [];
        for (var j = 0; j < strokes.length; j++) {
          if (paintIndex !== void 0 && j !== paintIndex) {
            newStrokes.push(strokes[j]);
            continue;
          }
          if (strokes[j].type === "SOLID") {
            var detachedStroke = figma.variables.setBoundVariableForPaint(
              strokes[j],
              "color",
              null
            );
            var newStroke = {
              type: "SOLID",
              color: targetRgb,
              opacity: detachedStroke.opacity,
              visible: detachedStroke.visible,
              blendMode: detachedStroke.blendMode
            };
            newStrokes.push(newStroke);
          } else {
            newStrokes.push(strokes[j]);
          }
        }
        sceneNode.strokes = newStrokes;
        return { success: true, detail: "Replaced with " + targetHex };
      }
      return { success: false, detail: "Cannot apply color to " + field };
    } catch (error) {
      return { success: false, detail: (error == null ? void 0 : error.message) || "Replace color failed" };
    }
  }

  // src/features/accessibility/a11y-alt-text.ts
  function isImageNode(node) {
    const fills = getNodeFills(node);
    for (const paint of fills) {
      if (paint.type === "IMAGE" && paint.visible !== false) return true;
    }
    return false;
  }
  function isImageComponentInstance(node) {
    if (node.type !== "INSTANCE") return false;
    const name = node.name.toLowerCase();
    return name.includes("image") || name.includes("avatar") || name.includes("photo") || name.includes("thumbnail") || name.includes("picture");
  }
  var ALT_TAG_RE = /\s*\[ALT=([^\]]*)\]/;
  function getAltText(node) {
    const match = node.name.match(ALT_TAG_RE);
    if (match) return match[1];
    return node.getPluginData("alt-text") || "";
  }
  function setAltText(node, altText) {
    const baseName = node.name.replace(ALT_TAG_RE, "").trimEnd();
    if (altText) {
      node.name = `${baseName} [ALT=${altText}]`;
    } else {
      node.name = baseName;
    }
    if (node.getPluginData("alt-text")) {
      node.setPluginData("alt-text", "");
    }
  }
  function hasAltText(node) {
    return getAltText(node).length > 0;
  }
  function checkAltText(node, path) {
    const isImage = isImageNode(node) || isImageComponentInstance(node);
    if (!isImage) {
      return { isImage: false, violation: null };
    }
    const altTextPresent = hasAltText(node);
    if (altTextPresent) {
      return { isImage: true, violation: null };
    }
    return {
      isImage: true,
      violation: {
        id: `a11y-alt-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath: path,
        rule: "missing-alt-text",
        severity: "error",
        category: "alt-text",
        message: `Image "${node.name}" is missing alt-text`,
        suggestion: "Add descriptive alt-text for this image",
        metadata: { hasAltText: false }
      }
    };
  }

  // src/features/accessibility/a11y-contrast.ts
  function srgbToLinear(c2) {
    return c2 <= 0.04045 ? c2 / 12.92 : Math.pow((c2 + 0.055) / 1.055, 2.4);
  }
  function linearToSrgb(c2) {
    return c2 <= 31308e-7 ? c2 * 12.92 : 1.055 * Math.pow(c2, 1 / 2.4) - 0.055;
  }
  function relativeLuminance(color) {
    return 0.2126 * srgbToLinear(color.r) + 0.7152 * srgbToLinear(color.g) + 0.0722 * srgbToLinear(color.b);
  }
  function contrastRatio(fg, bg) {
    const l1 = relativeLuminance(fg);
    const l2 = relativeLuminance(bg);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }
  function isLargeText(node) {
    const fontSize = resolveOrMixed(node.fontSize, 14);
    const fontWeight = resolveOrMixed(node.fontWeight, 400);
    return fontSize >= 24 || fontSize >= 18.66 && fontWeight >= 700;
  }
  function resolveBackgroundColor(node) {
    var _a;
    let current = node.parent;
    while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
      if ("fills" in current) {
        const fills = getNodeFills(current);
        for (let i = fills.length - 1; i >= 0; i--) {
          const paint = fills[i];
          if (paint.visible === false) continue;
          if (paint.type === "SOLID" && ((_a = paint.opacity) != null ? _a : 1) >= 0.99) {
            return { color: paint.color, isReliable: true };
          }
          if (paint.type === "GRADIENT_LINEAR" || paint.type === "GRADIENT_RADIAL" || paint.type === "GRADIENT_ANGULAR" || paint.type === "GRADIENT_DIAMOND" || paint.type === "IMAGE") {
            return null;
          }
        }
      }
      current = current.parent;
    }
    return { color: { r: 1, g: 1, b: 1 }, isReliable: false };
  }
  function checkContrast(node, path) {
    const violations = [];
    const fills = getNodeFills(node);
    let fgColor = null;
    for (const paint of fills) {
      if (paint.visible === false) continue;
      if (paint.type === "SOLID") {
        fgColor = paint.color;
        break;
      }
    }
    if (!fgColor) return violations;
    const bg = resolveBackgroundColor(node);
    if (bg === null) {
      violations.push({
        id: `a11y-contrast-manual-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath: path,
        rule: "contrast-manual-check",
        severity: "info",
        category: "contrast",
        message: `"${node.name}" has a gradient or image background \u2014 manual contrast check needed`,
        metadata: { fgColor }
      });
      return violations;
    }
    const ratio = contrastRatio(fgColor, bg.color);
    const ratioRounded = Math.round(ratio * 100) / 100;
    const ratioText = `${ratioRounded}:1`;
    const largeText = isLargeText(node);
    const aaThreshold = largeText ? 3 : 4.5;
    const aaaThreshold = largeText ? 4.5 : 7;
    const aa = ratio >= aaThreshold;
    const aaa = ratio >= aaaThreshold;
    const contrastMeta = {
      ratio: ratioRounded,
      ratioText,
      aa,
      aaa,
      isLargeText: largeText,
      isReliable: bg.isReliable
    };
    if (!aa) {
      violations.push({
        id: `a11y-contrast-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath: path,
        rule: "insufficient-contrast",
        severity: "error",
        category: "contrast",
        message: `Contrast ratio ${ratioText} fails WCAG AA (minimum ${aaThreshold}:1${largeText ? " for large text" : ""})`,
        metadata: __spreadProps(__spreadValues({}, contrastMeta), { fgColor, bgColor: bg.color })
      });
    } else if (!aaa) {
      violations.push({
        id: `a11y-contrast-${node.id}`,
        nodeId: node.id,
        nodeName: node.name,
        nodePath: path,
        rule: "insufficient-contrast",
        severity: "warning",
        category: "contrast",
        message: `Contrast ratio ${ratioText} passes AA but fails AAA (minimum ${aaaThreshold}:1${largeText ? " for large text" : ""})`,
        metadata: __spreadProps(__spreadValues({}, contrastMeta), { fgColor, bgColor: bg.color })
      });
    }
    return violations;
  }

  // src/features/accessibility/a11y-touch-targets.ts
  function isInteractiveElement(node) {
    if (node.type === "INSTANCE") {
      const name = node.name.toLowerCase();
      return name.includes("button") || name.includes("btn") || name.includes("link") || name.includes("input") || name.includes("checkbox") || name.includes("radio") || name.includes("switch") || name.includes("toggle") || name.includes("tab") || name.includes("chip") || name.includes("icon-button") || name.includes("fab");
    }
    if (node.type === "FRAME" || node.type === "GROUP" || node.type === "COMPONENT" || node.type === "COMPONENT_SET") {
      const name = node.name.toLowerCase();
      return name.includes("button") || name.includes("cta") || name.includes("clickable");
    }
    return false;
  }
  function checkTouchTarget(node, path) {
    const width = node.width;
    const height = node.height;
    if (width >= 44 && height >= 44) return null;
    return {
      id: `a11y-touch-${node.id}`,
      nodeId: node.id,
      nodeName: node.name,
      nodePath: path,
      rule: "undersized-touch-target",
      severity: "error",
      category: "touch-targets",
      message: `Touch target is ${Math.round(width)}x${Math.round(height)}px (minimum 44x44px)`,
      metadata: { width, height, minSize: 44 }
    };
  }

  // src/features/accessibility/a11y-types.ts
  var A11Y_SEVERITY_WEIGHTS = {
    error: 1,
    warning: 0.5,
    info: 0.1
  };

  // src/features/accessibility/a11y-engine.ts
  function calculateA11YCategoryScore(category, violations, totalChecked) {
    if (totalChecked === 0) {
      return { category, score: 100, weight: 1, violationCount: 0, totalChecked: 0 };
    }
    const weightedCount = violations.reduce((sum, v) => {
      var _a;
      return sum + ((_a = A11Y_SEVERITY_WEIGHTS[v.severity]) != null ? _a : 1);
    }, 0);
    const score = Math.max(0, Math.round(100 - weightedCount / totalChecked * 100));
    return { category, score, weight: 1, violationCount: violations.length, totalChecked };
  }
  function buildCategoryResult2(violations, totalChecked, score) {
    return {
      score,
      violationGroups: groupViolationsByRule(violations),
      totalChecked,
      totalViolations: violations.length
    };
  }
  async function runAccessibilityAudit(scope, abortToken, onProgress) {
    const startTime = Date.now();
    const altTextViolations = [];
    const contrastViolations = [];
    const touchTargetViolations = [];
    let imageNodesChecked = 0;
    let textNodesChecked = 0;
    let interactiveNodesChecked = 0;
    const imageNodes = [];
    const traversalResult = await traverseNodes((node, _depth, path) => {
      const altResult = checkAltText(node, path);
      if (altResult.isImage) {
        imageNodesChecked++;
        imageNodes.push({
          nodeId: node.id,
          nodeName: node.name,
          hasAlt: altResult.violation === null,
          altText: getAltText(node),
          x: node.absoluteTransform[0][2],
          y: node.absoluteTransform[1][2],
          width: node.width,
          height: node.height
        });
        if (altResult.violation) {
          altTextViolations.push(altResult.violation);
        }
      }
      if (node.type === "TEXT") {
        textNodesChecked++;
        contrastViolations.push(...checkContrast(node, path));
      }
      if (isInteractiveElement(node)) {
        interactiveNodesChecked++;
        const touchViolation = checkTouchTarget(node, path);
        if (touchViolation) {
          touchTargetViolations.push(touchViolation);
        }
      }
    }, {
      scope,
      chunkSize: 150,
      abortToken,
      onProgress: (processed, total) => {
        if (onProgress) onProgress("Scanning nodes", processed, total);
      }
    });
    const categoryScores = [
      calculateA11YCategoryScore("alt-text", altTextViolations, imageNodesChecked),
      calculateA11YCategoryScore("contrast", contrastViolations, textNodesChecked),
      calculateA11YCategoryScore("touch-targets", touchTargetViolations, interactiveNodesChecked)
    ];
    const scoreResult = buildScoreResult(categoryScores);
    return {
      scoreResult,
      categories: {
        "alt-text": buildCategoryResult2(altTextViolations, imageNodesChecked, categoryScores[0].score),
        "contrast": buildCategoryResult2(contrastViolations, textNodesChecked, categoryScores[1].score),
        "touch-targets": buildCategoryResult2(touchTargetViolations, interactiveNodesChecked, categoryScores[2].score)
      },
      scanDuration: Date.now() - startTime,
      totalNodesScanned: traversalResult.processed,
      scope,
      checklist: null,
      imageNodes
    };
  }

  // src/features/accessibility/a11y-badges.ts
  var BADGE_PREFIX = "_a11y-badge-";
  var COLOR_OK = { r: 0.13, g: 0.69, b: 0.3 };
  var COLOR_MISSING = { r: 0.9, g: 0.22, b: 0.21 };
  var COLOR_WHITE = { r: 1, g: 1, b: 1 };
  var COLOR_DARK = { r: 0.07, g: 0.07, b: 0.07 };
  var COLOR_SUBTLE = { r: 0.27, g: 0.27, b: 0.27 };
  var ANNOTATION_WIDTH = 240;
  var ANNOTATION_GAP = 8;
  var CONNECTOR_LENGTH = 24;
  function cleanupBadges(page) {
    const badges = page.findAll((n) => n.name.startsWith(BADGE_PREFIX));
    for (const badge of badges) {
      badge.remove();
    }
  }
  function createConnectorLine(x, y1, y2, color) {
    const line = figma.createLine();
    line.x = x;
    line.y = y1;
    line.rotation = -90;
    line.resize(Math.abs(y2 - y1), 0);
    line.strokes = solidFill(color);
    line.strokeWeight = 1.5;
    line.dashPattern = [4, 4];
    return line;
  }
  async function createAltTextAnnotation(img, node) {
    const statusColor = img.hasAlt ? COLOR_OK : COLOR_MISSING;
    const altValue = img.hasAlt ? img.altText : "Manquant";
    const annotation = createFrame({
      name: `${BADGE_PREFIX}${img.nodeId}`,
      width: ANNOTATION_WIDTH,
      height: 1,
      // auto-sized
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      fills: solidFill(COLOR_WHITE),
      cornerRadius: borderRadius.m,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0,
      itemSpacing: 0,
      clipsContent: true
    });
    const topBar = figma.createRectangle();
    topBar.name = "status-bar";
    topBar.resize(ANNOTATION_WIDTH, 4);
    topBar.fills = solidFill(statusColor);
    annotation.appendChild(topBar);
    topBar.layoutAlign = "STRETCH";
    const content = createFrame({
      name: "content",
      width: ANNOTATION_WIDTH,
      height: 1,
      layoutMode: "VERTICAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "FIXED",
      fills: [],
      paddingTop: 10,
      paddingBottom: 12,
      paddingLeft: 12,
      paddingRight: 12,
      itemSpacing: 8
    });
    annotation.appendChild(content);
    content.layoutAlign = "STRETCH";
    const header = createFrame({
      name: "header",
      width: 1,
      height: 1,
      layoutMode: "HORIZONTAL",
      primaryAxisSizingMode: "AUTO",
      counterAxisSizingMode: "AUTO",
      fills: [],
      itemSpacing: 6,
      paddingTop: 0,
      paddingBottom: 0,
      paddingLeft: 0,
      paddingRight: 0
    });
    content.appendChild(header);
    const dot = figma.createEllipse();
    dot.name = "status-dot";
    dot.resize(8, 8);
    dot.fills = solidFill(statusColor);
    header.appendChild(dot);
    const headerLabel = createText({
      text: "Texte alternatif",
      fontSize: 11,
      fontStyle: fonts.weights.bold,
      color: COLOR_DARK
    });
    header.appendChild(headerLabel);
    const nameLabel = createText({
      text: img.nodeName,
      fontSize: 10,
      color: COLOR_SUBTLE
    });
    content.appendChild(nameLabel);
    nameLabel.layoutAlign = "STRETCH";
    nameLabel.textTruncation = "ENDING";
    const separator = figma.createRectangle();
    separator.name = "separator";
    separator.resize(ANNOTATION_WIDTH - 24, 1);
    separator.fills = solidFill({ r: 0.92, g: 0.92, b: 0.92 });
    content.appendChild(separator);
    separator.layoutAlign = "STRETCH";
    const altLabel = createText({
      text: img.hasAlt ? `alt="${altValue}"` : "alt manquant \u2014 ajouter un texte descriptif",
      fontSize: 12,
      fontStyle: img.hasAlt ? fonts.weights.regular : fonts.weights.medium,
      color: img.hasAlt ? COLOR_DARK : COLOR_MISSING,
      width: ANNOTATION_WIDTH - 24,
      lineHeight: 16
    });
    content.appendChild(altLabel);
    altLabel.layoutAlign = "STRETCH";
    annotation.effects = [
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 2 },
        radius: 8,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      },
      {
        type: "DROP_SHADOW",
        color: { r: 0, g: 0, b: 0, a: 0.04 },
        offset: { x: 0, y: 0 },
        radius: 1,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      }
    ];
    annotation.x = img.x + img.width + CONNECTOR_LENGTH + ANNOTATION_GAP;
    annotation.y = img.y;
    return annotation;
  }
  async function createAltTextBadges(imageNodes) {
    cleanupBadges(figma.currentPage);
    if (imageNodes.length === 0) return 0;
    await Promise.all([
      loadFont(fonts.family, fonts.weights.regular),
      loadFont(fonts.family, fonts.weights.medium),
      loadFont(fonts.family, fonts.weights.bold)
    ]);
    let badgesCreated = 0;
    for (const img of imageNodes) {
      const node = await figma.getNodeByIdAsync(img.nodeId);
      if (!node || node.removed) continue;
      const statusColor = img.hasAlt ? COLOR_OK : COLOR_MISSING;
      const lineX = img.x + img.width + ANNOTATION_GAP;
      const lineY = img.y + Math.min(img.height / 2, 20);
      const connector = createConnectorLine(
        lineX,
        lineY,
        lineY,
        statusColor
      );
      connector.resize(CONNECTOR_LENGTH, 0);
      connector.name = `${BADGE_PREFIX}line-${img.nodeId}`;
      figma.currentPage.appendChild(connector);
      const annotation = await createAltTextAnnotation(img, node);
      figma.currentPage.appendChild(annotation);
      badgesCreated++;
    }
    return badgesCreated;
  }

  // src/features/accessibility/a11y-color-blindness.ts
  var SIMULATION_TYPES = ["protanopia", "deuteranopia", "tritanopia"];
  var SIMULATION_MATRICES = {
    protanopia: [
      [0.152286, 1.052583, -0.204868],
      [0.114503, 0.786281, 0.099216],
      [-3882e-6, -0.048116, 1.051998]
    ],
    deuteranopia: [
      [0.367322, 0.860646, -0.227968],
      [0.280085, 0.672501, 0.047413],
      [-0.01182, 0.04294, 0.968881]
    ],
    tritanopia: [
      [1.255528, -0.076749, -0.178779],
      [-0.078411, 0.930809, 0.147602],
      [4733e-6, 0.691367, 0.3039]
    ]
  };
  function simulateColor(rgb2, matrix) {
    const lr = srgbToLinear(rgb2.r);
    const lg = srgbToLinear(rgb2.g);
    const lb = srgbToLinear(rgb2.b);
    const r = Math.max(0, Math.min(1, matrix[0][0] * lr + matrix[0][1] * lg + matrix[0][2] * lb));
    const g = Math.max(0, Math.min(1, matrix[1][0] * lr + matrix[1][1] * lg + matrix[1][2] * lb));
    const b = Math.max(0, Math.min(1, matrix[2][0] * lr + matrix[2][1] * lg + matrix[2][2] * lb));
    return {
      r: linearToSrgb(r),
      g: linearToSrgb(g),
      b: linearToSrgb(b)
    };
  }
  async function recolorTree(node, matrix) {
    const nodes = [];
    collectNodes(node, nodes);
    const BATCH_SIZE = 100;
    for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
      const batch = nodes.slice(i, i + BATCH_SIZE);
      for (const n of batch) {
        recolorNodeFills(n, matrix);
        recolorNodeStrokes(n, matrix);
      }
      if (i + BATCH_SIZE < nodes.length) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }
  }
  function collectNodes(node, out) {
    out.push(node);
    if ("children" in node) {
      for (const child of node.children) {
        collectNodes(child, out);
      }
    }
  }
  function recolorNodeFills(node, matrix) {
    if (!("fills" in node)) return;
    const fills = getNodeFills(node);
    if (fills.length === 0) return;
    let changed = false;
    const newFills = fills.map((paint) => {
      if (paint.type === "SOLID") {
        changed = true;
        return __spreadProps(__spreadValues({}, paint), {
          color: simulateColor(paint.color, matrix)
        });
      }
      return __spreadValues({}, paint);
    });
    if (changed) {
      node.fills = newFills;
    }
  }
  function recolorNodeStrokes(node, matrix) {
    if (!("strokes" in node)) return;
    const strokes = getNodeStrokes(node);
    if (strokes.length === 0) return;
    let changed = false;
    const newStrokes = strokes.map((paint) => {
      if (paint.type === "SOLID") {
        changed = true;
        return __spreadProps(__spreadValues({}, paint), {
          color: simulateColor(paint.color, matrix)
        });
      }
      return __spreadValues({}, paint);
    });
    if (changed) {
      node.strokes = newStrokes;
    }
  }
  async function simulateColorBlindness(scope, placement) {
    const pagesCreated = [];
    const sourcePage = figma.currentPage;
    const sourceNodes = scope === "selection" && figma.currentPage.selection.length > 0 ? [...figma.currentPage.selection] : [...sourcePage.children];
    if (sourceNodes.length === 0) {
      return { pagesCreated };
    }
    let maxX = 0;
    for (const node of sourceNodes) {
      const right = node.x + node.width;
      if (right > maxX) maxX = right;
    }
    const GAP = 200;
    let offsetX = maxX + GAP;
    for (const simType of SIMULATION_TYPES) {
      const matrix = SIMULATION_MATRICES[simType];
      if (placement === "new-page") {
        const newPage = figma.createPage();
        newPage.name = `[Simulation] ${simType} - ${sourcePage.name}`;
        pagesCreated.push(newPage.name);
        for (const node of sourceNodes) {
          const clone = node.clone();
          newPage.appendChild(clone);
          await recolorTree(clone, matrix);
        }
      } else {
        const groupWidth = maxX - Math.min(...sourceNodes.map((n) => n.x));
        for (const node of sourceNodes) {
          const clone = node.clone();
          clone.x = node.x + offsetX - Math.min(...sourceNodes.map((n) => n.x));
          clone.y = node.y;
          clone.name = `[${simType}] ${node.name}`;
          sourcePage.appendChild(clone);
          await recolorTree(clone, matrix);
        }
        offsetX += groupWidth + GAP;
      }
    }
    return { pagesCreated };
  }

  // src/main.ts
  var globalStorage = createStorage("global");
  var NOTIF = {
    fr: {
      "sk.created": "Starter Kit cr\xE9\xE9 avec succ\xE8s \u2705",
      "sk.error": "Erreur lors de la cr\xE9ation du Starter Kit",
      "pages.reset": "Pages r\xE9initialis\xE9es \u2192 COVER",
      "import.success": "Composant import\xE9 avec succ\xE8s",
      "import.not_found": "Composant introuvable. V\xE9rifiez que la cl\xE9 est valide.",
      "import.library_disabled": "La librairie Marcel DS n'est pas activ\xE9e dans ce fichier. Activez-la via Assets > Team library.",
      "import.network": "Erreur r\xE9seau. V\xE9rifiez votre connexion et r\xE9essayez.",
      "import.unknown": "Erreur lors de l'import du composant.",
      "fix.renamed": 'Renomm\xE9 \u2192 "{name}" \u2705',
      "fix.layers": "{fixed} layer{s} renomme{s}",
      "fix.layers.failed": " ({failed} echoue{fs})",
      "fix.none": "Aucun layer n'a pu etre corrige.",
      "hc.fix.ok": "Corrig\xE9 \u2705",
      "hc.fix.count": "{fixed} violation{s} corrigee{s}",
      "hc.fix.count.failed": " ({failed} echouee{fs})",
      "hc.fix.none": "Aucune violation n'a pu etre corrigee.",
      "hc.error": "Erreur lors de l'audit Health Check.",
      "cover.updated": "Cover mise \xE0 jour \u2705",
      "cover.error": "Erreur lors de la mise \xE0 jour de la cover.",
      "config.saved": "Param\xE8tres sauvegard\xE9s \u2705",
      "config.reset": "Param\xE8tres r\xE9initialis\xE9s",
      "ds.removed": "Style supprime",
      "ds.batch": "{count} style(s) supprime(s)",
      "ds.detached": "Binding detache",
      "ds.replaced": "Remplace par {name}",
      "ds.batch.detach": "{count} binding(s) detache(s)",
      "ds.batch.replace": "{count} element(s) remplace(s)"
    },
    en: {
      "sk.created": "Starter Kit created successfully \u2705",
      "sk.error": "Error creating Starter Kit",
      "pages.reset": "Pages reset \u2192 COVER",
      "import.success": "Component imported successfully",
      "import.not_found": "Component not found. Check that the key is valid.",
      "import.library_disabled": "The Marcel DS library is not enabled in this file. Enable it via Assets > Team library.",
      "import.network": "Network error. Check your connection and retry.",
      "import.unknown": "Error importing component.",
      "fix.renamed": 'Renamed \u2192 "{name}" \u2705',
      "fix.layers": "{fixed} layer{s} renamed",
      "fix.layers.failed": " ({failed} failed)",
      "fix.none": "No layers could be fixed.",
      "hc.fix.ok": "Fixed \u2705",
      "hc.fix.count": "{fixed} violation{s} fixed",
      "hc.fix.count.failed": " ({failed} failed)",
      "hc.fix.none": "No violations could be fixed.",
      "hc.error": "Error during Health Check audit.",
      "cover.updated": "Cover updated \u2705",
      "cover.error": "Error updating the cover.",
      "config.saved": "Settings saved \u2705",
      "config.reset": "Settings reset",
      "ds.removed": "Style deleted",
      "ds.batch": "{count} style(s) deleted",
      "ds.detached": "Binding detached",
      "ds.replaced": "Replaced with {name}",
      "ds.batch.detach": "{count} binding(s) detached",
      "ds.batch.replace": "{count} element(s) replaced"
    },
    "pt-BR": {
      "sk.created": "Starter Kit criado com sucesso \u2705",
      "sk.error": "Erro ao criar o Starter Kit",
      "pages.reset": "P\xE1ginas resetadas \u2192 COVER",
      "import.success": "Componente importado com sucesso",
      "import.not_found": "Componente n\xE3o encontrado. Verifique se a chave \xE9 v\xE1lida.",
      "import.library_disabled": "A biblioteca Marcel DS n\xE3o est\xE1 ativada neste arquivo. Ative-a em Assets > Team library.",
      "import.network": "Erro de rede. Verifique sua conex\xE3o e tente novamente.",
      "import.unknown": "Erro ao importar componente.",
      "fix.renamed": 'Renomeado \u2192 "{name}" \u2705',
      "fix.layers": "{fixed} layer{s} renomeado{s}",
      "fix.layers.failed": " ({failed} falhou)",
      "fix.none": "Nenhum layer p\xF4de ser corrigido.",
      "hc.fix.ok": "Corrigido \u2705",
      "hc.fix.count": "{fixed} viola\xE7\xE3o(\xF5es) corrigida{s}",
      "hc.fix.count.failed": " ({failed} falhou)",
      "hc.fix.none": "Nenhuma viola\xE7\xE3o p\xF4de ser corrigida.",
      "hc.error": "Erro durante a auditoria Health Check.",
      "cover.updated": "Cover atualizada \u2705",
      "cover.error": "Erro ao atualizar a cover.",
      "config.saved": "Configura\xE7\xF5es salvas \u2705",
      "config.reset": "Configura\xE7\xF5es resetadas",
      "ds.removed": "Estilo exclu\xEDdo",
      "ds.batch": "{count} estilo(s) exclu\xEDdo(s)",
      "ds.detached": "Binding removido",
      "ds.replaced": "Substituido por {name}",
      "ds.batch.detach": "{count} binding(s) removido(s)",
      "ds.batch.replace": "{count} elemento(s) substituido(s)"
    }
  };
  function nt(key, params) {
    let str = NOTIF["fr"][key] || key;
    if (params) {
      for (const k4 of Object.keys(params)) {
        str = str.replace(new RegExp("\\{" + k4 + "\\}", "g"), String(params[k4]));
      }
    }
    return str;
  }
  async function selectAndZoom(node) {
    let ancestor = node;
    while (ancestor.parent && ancestor.parent.type !== "PAGE") {
      ancestor = ancestor.parent;
    }
    if (ancestor.parent && ancestor.parent.type === "PAGE" && ancestor.parent !== figma.currentPage) {
      await figma.setCurrentPageAsync(ancestor.parent);
    }
    figma.currentPage.selection = [node];
    figma.viewport.scrollAndZoomIntoView([node]);
  }
  figma.showUI(__html__, { width: 480, height: 640, themeColors: true });
  var linterConfig = null;
  var currentAbortToken = null;
  async function getLinterConfig() {
    if (!linterConfig) {
      linterConfig = await loadLinterConfig();
    }
    return linterConfig;
  }
  figma.ui.onmessage = async (msg) => {
    var _b;
    if (msg.type === "ui-ready") {
      figma.ui.postMessage({ type: "init-context" });
    }
    if (msg.type === "create-starter-kit") {
      try {
        var template = msg.template === "ds-library" ? "ds-library" : "prd";
        await createStarterKit(template);
        figma.ui.postMessage({ type: "starter-kit-created" });
        figma.notify(nt("sk.created"), { timeout: 4e3 });
      } catch (error) {
        console.error("Starter Kit error:", error);
        figma.ui.postMessage({
          type: "starter-kit-error",
          message: (error == null ? void 0 : error.message) || nt("sk.error")
        });
        figma.notify(nt("sk.error"), {
          timeout: 4e3,
          error: true
        });
      }
    }
    if (msg.type === "check-template-exists") {
      var tpl = msg.template === "ds-library" ? "ds-library" : "prd";
      var result = checkTemplateExists(tpl);
      figma.ui.postMessage({
        type: "template-exists-result",
        exists: result.exists,
        matchCount: result.matchCount
      });
    }
    if (msg.type === "reset-all-pages") {
      try {
        await resetAllPages();
        figma.ui.postMessage({ type: "pages-reset" });
        figma.notify(nt("pages.reset"), { timeout: 4e3 });
      } catch (error) {
        console.error("Reset error:", error);
        figma.ui.postMessage({
          type: "reset-error",
          message: (error == null ? void 0 : error.message) || "Error"
        });
      }
    }
    if (msg.type === "import-ds-component") {
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
          componentKey
        });
        figma.notify(nt("import.success"), { timeout: 3e3 });
      } catch (error) {
        console.error("Import DS component error:", error);
        const errorMsg = (error == null ? void 0 : error.message) || String(error);
        let errorCategory = "unknown";
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
          errorCategory
        });
        figma.notify(userMessage, { timeout: 4e3, error: true });
      }
    }
    if (msg.type === "run-linter") {
      try {
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
                total: totalPages
              });
            }
          );
          if (currentAbortToken.cancelled) {
            figma.ui.postMessage({ type: "scan-cancelled" });
            return;
          }
          for (var p4 = 0; p4 < pageResults.length; p4++) {
            pageResults[p4].result.violations = filterAllowlisted(pageResults[p4].result.violations, allowlist);
          }
          currentAbortToken = null;
          figma.ui.postMessage({ type: "linter-result", result: pageResults, scope: "file" });
        } else {
          var lintResult = await runLintAsync(
            scope,
            config,
            currentAbortToken,
            function(processed, total) {
              figma.ui.postMessage({
                type: "traversal-progress",
                processed,
                total
              });
            }
          );
          if (currentAbortToken.cancelled) {
            figma.ui.postMessage({ type: "scan-cancelled" });
            return;
          }
          lintResult.violations = filterAllowlisted(lintResult.violations, allowlist);
          currentAbortToken = null;
          figma.ui.postMessage({ type: "linter-result", result: lintResult, scope });
        }
      } catch (error) {
        console.error("Lint error:", error);
        currentAbortToken = null;
        figma.ui.postMessage({
          type: "linter-error",
          message: (error == null ? void 0 : error.message) || "Error"
        });
      }
    }
    if (msg.type === "fix-violation") {
      try {
        var nodeId = msg.nodeId || "";
        var suggestion = msg.suggestion;
        var fixResult = await autoFixNode(nodeId, suggestion);
        figma.ui.postMessage({ type: "fix-violation-result", result: fixResult });
        if (fixResult.success) {
          var fixedNode = await figma.getNodeByIdAsync(nodeId);
          if (fixedNode && "type" in fixedNode && fixedNode.type !== "DOCUMENT" && fixedNode.type !== "PAGE") {
            var sceneNode = fixedNode;
            await selectAndZoom(sceneNode);
          }
          figma.notify(nt("fix.renamed", { name: fixResult.newName }), { timeout: 2e3 });
        }
      } catch (error) {
        console.error("Fix node error:", error);
        figma.ui.postMessage({
          type: "fix-violation-result",
          result: { success: false, newName: "" }
        });
      }
    }
    if (msg.type === "fix-all-violations") {
      try {
        var allViolations = msg.violations || [];
        var fixAllResult = await autoFixAll(allViolations);
        if (fixAllResult.fixed > 0) {
          figma.notify(nt("fix.layers", { fixed: fixAllResult.fixed, s: fixAllResult.fixed > 1 ? "s" : "" }) + (fixAllResult.failed > 0 ? nt("fix.layers.failed", { failed: fixAllResult.failed, fs: fixAllResult.failed > 1 ? "s" : "" }) : ""), { timeout: 4e3 });
        } else {
          figma.notify(nt("fix.none"), { timeout: 3e3 });
        }
        figma.ui.postMessage({
          type: "fix-all-violations-result",
          result: fixAllResult,
          updatedLintResult: null
          // No re-scan — UI handles score update via fixedNodeIds
        });
      } catch (error) {
        console.error("Fix all error:", error);
        figma.ui.postMessage({
          type: "fix-all-violations-result",
          result: { fixed: 0, failed: 0, fixedNodeIds: [] },
          updatedLintResult: null
        });
      }
    }
    if (msg.type === "fix-by-category") {
      try {
        var categoryViolations = msg.violations || [];
        var fixCatResult = await autoFixAll(categoryViolations);
        if (fixCatResult.fixed > 0) {
          figma.notify(
            nt("fix.layers", { fixed: fixCatResult.fixed, s: fixCatResult.fixed > 1 ? "s" : "" }),
            { timeout: 3e3 }
          );
        }
        figma.ui.postMessage({
          type: "fix-all-violations-result",
          result: fixCatResult,
          updatedLintResult: null
        });
      } catch (error) {
        console.error("Fix by category error:", error);
        figma.ui.postMessage({
          type: "fix-all-violations-result",
          result: { fixed: 0, failed: 0, fixedNodeIds: [] },
          updatedLintResult: null
        });
      }
    }
    if (msg.type === "fix-hc-violation") {
      try {
        var hcNodeId = msg.nodeId || "";
        var hcFixResult = await hcFixNode(hcNodeId, {
          rule: msg.rule,
          metadata: msg.metadata
        });
        figma.ui.postMessage({
          type: "fix-hc-violation-result",
          result: hcFixResult,
          violationId: msg.violationId
        });
        if (hcFixResult.success) {
          var hcFixedNode = await figma.getNodeByIdAsync(hcNodeId);
          if (hcFixedNode && "type" in hcFixedNode && hcFixedNode.type !== "DOCUMENT" && hcFixedNode.type !== "PAGE") {
            await selectAndZoom(hcFixedNode);
          }
          figma.notify(nt("hc.fix.ok"), { timeout: 2e3 });
        }
      } catch (error) {
        console.error("HC fix node error:", error);
        figma.ui.postMessage({
          type: "fix-hc-violation-result",
          result: { success: false, detail: "" },
          violationId: msg.violationId || ""
        });
      }
    }
    if (msg.type === "fix-all-hc-violations") {
      try {
        var hcAllViolations = msg.violations || [];
        var hcFixAllResult = await hcFixAll(hcAllViolations);
        if (hcFixAllResult.fixed > 0) {
          figma.notify(nt("hc.fix.count", { fixed: hcFixAllResult.fixed, s: hcFixAllResult.fixed > 1 ? "s" : "" }) + (hcFixAllResult.failed > 0 ? nt("hc.fix.count.failed", { failed: hcFixAllResult.failed, fs: hcFixAllResult.failed > 1 ? "s" : "" }) : ""), { timeout: 4e3 });
        } else {
          figma.notify(nt("hc.fix.none"), { timeout: 3e3 });
        }
        figma.ui.postMessage({
          type: "fix-all-hc-violations-result",
          result: hcFixAllResult
        });
      } catch (error) {
        console.error("HC fix all error:", error);
        figma.ui.postMessage({
          type: "fix-all-hc-violations-result",
          result: { fixed: 0, failed: 0, fixedNodeIds: [], fixedViolationIds: [] }
        });
      }
    }
    if (msg.type === "fix-hc-by-category") {
      try {
        var hcCatViolations = msg.violations || [];
        var hcFixCatResult = await hcFixAll(hcCatViolations);
        if (hcFixCatResult.fixed > 0) {
          figma.notify(
            nt("hc.fix.count", { fixed: hcFixCatResult.fixed, s: hcFixCatResult.fixed > 1 ? "s" : "" }),
            { timeout: 3e3 }
          );
        }
        figma.ui.postMessage({
          type: "fix-all-hc-violations-result",
          result: hcFixCatResult
        });
      } catch (error) {
        console.error("HC fix by category error:", error);
        figma.ui.postMessage({
          type: "fix-all-hc-violations-result",
          result: { fixed: 0, failed: 0, fixedNodeIds: [], fixedViolationIds: [] }
        });
      }
    }
    if (msg.type === "ignore-violation") {
      try {
        var updatedList = await addToAllowlist(msg.nodeId || "", msg.ruleId || "");
        figma.ui.postMessage({ type: "allowlist-updated", allowlist: Array.from(updatedList) });
      } catch (error) {
        console.error("Ignore violation error:", error);
      }
    }
    if (msg.type === "unignore-violation") {
      try {
        var updatedList2 = await removeFromAllowlist(msg.nodeId || "", msg.ruleId || "");
        figma.ui.postMessage({ type: "allowlist-updated", allowlist: Array.from(updatedList2) });
      } catch (error) {
        console.error("Unignore violation error:", error);
      }
    }
    if (msg.type === "load-allowlist") {
      try {
        var list = await loadAllowlist();
        figma.ui.postMessage({ type: "allowlist-loaded", allowlist: Array.from(list) });
      } catch (error) {
        console.error("Load allowlist error:", error);
      }
    }
    if (msg.type === "clear-allowlist") {
      try {
        await clearAllowlist();
        figma.ui.postMessage({ type: "allowlist-updated", allowlist: [] });
      } catch (error) {
        console.error("Clear allowlist error:", error);
      }
    }
    if (msg.type === "run-health-check") {
      try {
        if (currentAbortToken) currentAbortToken.cancelled = true;
        currentAbortToken = { cancelled: false };
        const scope2 = msg.scope || "page";
        const result2 = await runHealthCheck(
          scope2,
          currentAbortToken,
          (category, processed, total) => {
            figma.ui.postMessage({
              type: "health-check-progress",
              category,
              processed,
              total
            });
          }
        );
        currentAbortToken = null;
        if (result2) {
          figma.ui.postMessage({ type: "health-check-result", result: result2 });
        }
      } catch (error) {
        console.error("Health Check error:", error);
        currentAbortToken = null;
        figma.ui.postMessage({
          type: "health-check-error",
          message: (error == null ? void 0 : error.message) || nt("hc.error")
        });
      }
    }
    if (msg.type === "generate-cover") {
      try {
        const config2 = { projectStatus: msg.status || "In Progress" };
        await saveCoverConfig(config2);
        await generateOrUpdateCover(config2);
        figma.ui.postMessage({ type: "cover-generated" });
        figma.notify(nt("cover.updated"), { timeout: 3e3 });
      } catch (error) {
        console.error("Cover error:", error);
        figma.ui.postMessage({ type: "cover-error", message: (error == null ? void 0 : error.message) || nt("cover.error") });
      }
    }
    if (msg.type === "load-cover-config") {
      try {
        const coverCfg = await loadCoverConfig();
        figma.ui.postMessage({ type: "cover-config-loaded", config: coverCfg });
      } catch (error) {
        console.error("Load cover config error:", error);
      }
    }
    if (msg.type === "scan-dead-styles") {
      try {
        if (currentAbortToken) currentAbortToken.cancelled = true;
        currentAbortToken = { cancelled: false };
        const result2 = await scanDeadStyles(currentAbortToken, (phase, current, total) => {
          figma.ui.postMessage({ type: "dead-styles-progress", phase, current, total });
        });
        if (currentAbortToken.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }
        currentAbortToken = null;
        figma.ui.postMessage({ type: "dead-styles-result", result: result2 });
      } catch (error) {
        console.error("Dead styles scan error:", error);
        currentAbortToken = null;
        figma.ui.postMessage({
          type: "dead-styles-error",
          message: (error == null ? void 0 : error.message) || "Error"
        });
      }
    }
    if (msg.type === "remove-dead-style") {
      try {
        const result2 = await removeDeadStyle(
          msg.styleId || "",
          msg.itemType || "PAINT"
        );
        figma.ui.postMessage({
          type: "dead-style-removed",
          styleId: msg.styleId || "",
          success: result2.success,
          error: result2.error
        });
        if (result2.success) {
          figma.notify(nt("ds.removed"), { timeout: 2e3 });
        }
      } catch (error) {
        console.error("Remove dead style error:", error);
        figma.ui.postMessage({
          type: "dead-style-removed",
          styleId: msg.styleId || "",
          success: false,
          error: (error == null ? void 0 : error.message) || "Erreur lors de la suppression."
        });
      }
    }
    if (msg.type === "remove-all-dead-styles") {
      try {
        const result2 = await removeAllDeadStyles(msg.items || []);
        figma.ui.postMessage({ type: "dead-styles-batch-removed", result: result2 });
        if (result2.removed > 0) {
          figma.notify(nt("ds.batch", { count: result2.removed }), { timeout: 3e3 });
        }
      } catch (error) {
        console.error("Remove all dead styles error:", error);
        figma.ui.postMessage({
          type: "dead-styles-batch-removed",
          result: { removed: 0, failed: 0 }
        });
      }
    }
    if (msg.type === "scan-style-cleaner") {
      try {
        if (currentAbortToken) currentAbortToken.cancelled = true;
        currentAbortToken = { cancelled: false };
        const result2 = await scanStyleCleaner(currentAbortToken, (phase, current, total) => {
          figma.ui.postMessage({ type: "dead-styles-progress", phase, current, total });
        });
        if (currentAbortToken.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }
        currentAbortToken = null;
        figma.ui.postMessage({ type: "style-cleaner-result", result: result2 });
      } catch (error) {
        console.error("Style cleaner scan error:", error);
        currentAbortToken = null;
        figma.ui.postMessage({
          type: "style-cleaner-error",
          message: (error == null ? void 0 : error.message) || "Error"
        });
      }
    }
    if (msg.type === "detach-foreign-item") {
      try {
        var detachNodeId = msg.nodeId || "";
        var detachField = msg.field || "";
        var detachPaintIndex = msg.paintIndex;
        var detachItemId = msg.itemId || "";
        var detachStyleType = msg.styleType;
        var detachResult;
        if (detachStyleType) {
          detachResult = await detachStyleBinding(detachNodeId, detachStyleType, detachField);
        } else {
          detachResult = await detachVariableBinding(detachNodeId, detachField, detachPaintIndex);
        }
        figma.ui.postMessage({
          type: "foreign-item-fixed",
          itemId: detachItemId,
          action: "detach",
          success: detachResult.success,
          error: detachResult.success ? void 0 : detachResult.detail
        });
        if (detachResult.success) {
          figma.notify(nt("ds.detached"), { timeout: 2e3 });
        }
      } catch (error) {
        console.error("Detach foreign item error:", error);
        figma.ui.postMessage({
          type: "foreign-item-fixed",
          itemId: "",
          action: "detach",
          success: false,
          error: (error == null ? void 0 : error.message) || "Detach failed"
        });
      }
    }
    if (msg.type === "replace-foreign-item") {
      try {
        var replaceNodeId = msg.nodeId || "";
        var replaceField = msg.field || "";
        var replacePaintIndex = msg.paintIndex;
        var replaceItemId = msg.itemId || "";
        var replaceStyleType = msg.styleType;
        var replaceSuggestion = msg.suggestion;
        var replaceResult = { success: false, detail: "No suggestion" };
        if (replaceSuggestion) {
          if (replaceStyleType) {
            await detachStyleBinding(replaceNodeId, replaceStyleType, replaceField);
          }
          var colorField = replaceField;
          if (replaceField === "fillStyleId") colorField = "fills";
          else if (replaceField === "strokeStyleId") colorField = "strokes";
          if (replaceSuggestion.variableKey && (colorField === "fills" || colorField === "strokes")) {
            replaceResult = await replaceVariableBinding(replaceNodeId, colorField, replaceSuggestion.variableKey, replacePaintIndex);
          }
          if (!replaceResult.success && replaceSuggestion.tokenHex && (colorField === "fills" || colorField === "strokes")) {
            var targetRgb = hexToRgb(replaceSuggestion.tokenHex);
            var rNode = await figma.getNodeByIdAsync(replaceNodeId);
            if (rNode && rNode.type !== "DOCUMENT" && rNode.type !== "PAGE") {
              var rScene = rNode;
              if (colorField === "fills" && "fills" in rScene) {
                var rFills = rScene.fills;
                if (rFills !== figma.mixed) {
                  var newFills = [];
                  for (var fi = 0; fi < rFills.length; fi++) {
                    if (replacePaintIndex !== void 0 && fi !== replacePaintIndex) {
                      newFills.push(rFills[fi]);
                    } else if (rFills[fi].type === "SOLID") {
                      var dPaint = figma.variables.setBoundVariableForPaint(rFills[fi], "color", null);
                      newFills.push({ type: "SOLID", color: targetRgb, opacity: dPaint.opacity, visible: dPaint.visible, blendMode: dPaint.blendMode });
                    } else {
                      newFills.push(rFills[fi]);
                    }
                  }
                  rScene.fills = newFills;
                  replaceResult = { success: true, detail: replaceSuggestion.tokenHex };
                }
              } else if (colorField === "strokes" && "strokes" in rScene) {
                var rStrokes = rScene.strokes;
                var newStrokes = [];
                for (var si = 0; si < rStrokes.length; si++) {
                  if (replacePaintIndex !== void 0 && si !== replacePaintIndex) {
                    newStrokes.push(rStrokes[si]);
                  } else if (rStrokes[si].type === "SOLID") {
                    var dStroke = figma.variables.setBoundVariableForPaint(rStrokes[si], "color", null);
                    newStrokes.push({ type: "SOLID", color: targetRgb, opacity: dStroke.opacity, visible: dStroke.visible, blendMode: dStroke.blendMode });
                  } else {
                    newStrokes.push(rStrokes[si]);
                  }
                }
                rScene.strokes = newStrokes;
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
          error: replaceResult.success ? void 0 : replaceResult.detail
        });
        if (replaceResult.success && replaceSuggestion) {
          figma.notify(nt("ds.replaced", { name: replaceSuggestion.tokenName }), { timeout: 2e3 });
        }
      } catch (error) {
        console.error("Replace foreign item error:", error);
        figma.ui.postMessage({
          type: "foreign-item-fixed",
          itemId: "",
          action: "replace",
          success: false,
          error: (error == null ? void 0 : error.message) || "Replace failed"
        });
      }
    }
    if (msg.type === "batch-detach-foreign") {
      try {
        var batchDetachItems = msg.items || [];
        var batchDetachResult = await batchDetachForeign(batchDetachItems);
        figma.ui.postMessage({
          type: "batch-foreign-result",
          action: "detach",
          result: { count: batchDetachResult.detached, failed: batchDetachResult.failed }
        });
        if (batchDetachResult.detached > 0) {
          figma.notify(nt("ds.batch.detach", { count: batchDetachResult.detached }), { timeout: 3e3 });
        }
      } catch (error) {
        console.error("Batch detach error:", error);
        figma.ui.postMessage({
          type: "batch-foreign-result",
          action: "detach",
          result: { count: 0, failed: 0 }
        });
      }
    }
    if (msg.type === "batch-replace-foreign") {
      try {
        var batchReplaceItems = msg.items || [];
        var batchReplaceResult = await batchReplaceForeign(batchReplaceItems);
        figma.ui.postMessage({
          type: "batch-foreign-result",
          action: "replace",
          result: { count: batchReplaceResult.replaced, failed: batchReplaceResult.failed }
        });
        if (batchReplaceResult.replaced > 0) {
          figma.notify(nt("ds.batch.replace", { count: batchReplaceResult.replaced }), { timeout: 3e3 });
        }
      } catch (error) {
        console.error("Batch replace error:", error);
        figma.ui.postMessage({
          type: "batch-foreign-result",
          action: "replace",
          result: { count: 0, failed: 0 }
        });
      }
    }
    if (msg.type === "run-a11y-audit") {
      try {
        if (currentAbortToken) currentAbortToken.cancelled = true;
        currentAbortToken = { cancelled: false };
        const scope2 = msg.scope || "page";
        const result2 = await runAccessibilityAudit(
          scope2,
          currentAbortToken,
          (category, processed, total) => {
            figma.ui.postMessage({
              type: "a11y-progress",
              category,
              processed,
              total
            });
          }
        );
        if (currentAbortToken.cancelled) {
          figma.ui.postMessage({ type: "scan-cancelled" });
          return;
        }
        currentAbortToken = null;
        const _a = result2, { imageNodes } = _a, a11yResult = __objRest(_a, ["imageNodes"]);
        figma.ui.postMessage({ type: "a11y-result", result: a11yResult });
      } catch (error) {
        console.error("A11Y audit error:", error);
        currentAbortToken = null;
        figma.ui.postMessage({
          type: "a11y-error",
          message: (error == null ? void 0 : error.message) || String(error)
        });
      }
    }
    if (msg.type === "save-alt-text") {
      try {
        const nodeId2 = msg.nodeId || "";
        const node = await figma.getNodeByIdAsync(nodeId2);
        if (node && node.type !== "DOCUMENT" && node.type !== "PAGE") {
          setAltText(node, msg.altText || "");
          figma.ui.postMessage({ type: "alt-text-saved", nodeId: nodeId2 });
        } else {
          console.warn("save-alt-text: node not found", nodeId2);
        }
      } catch (error) {
        console.error("Save alt-text error:", error);
      }
    }
    if (msg.type === "get-alt-text") {
      try {
        const nodeId2 = msg.nodeId || "";
        const node = await figma.getNodeByIdAsync(nodeId2);
        if (node && node.type !== "DOCUMENT" && node.type !== "PAGE") {
          const altText = getAltText(node);
          figma.ui.postMessage({ type: "alt-text-loaded", nodeId: nodeId2, altText });
        }
      } catch (error) {
        console.error("Get alt-text error:", error);
      }
    }
    if (msg.type === "create-a11y-badges") {
      try {
        console.log("[a11y-badges] Step 1: running audit...");
        const auditResult = await runAccessibilityAudit("page");
        console.log("[a11y-badges] Step 2: audit done, imageNodes:", (_b = auditResult.imageNodes) == null ? void 0 : _b.length);
        const count = await createAltTextBadges(auditResult.imageNodes);
        console.log("[a11y-badges] Step 3: badges created:", count);
        figma.ui.postMessage({ type: "a11y-badges-created", count });
      } catch (error) {
        console.error("Create A11Y badges error:", (error == null ? void 0 : error.message) || error, (error == null ? void 0 : error.stack) || "no stack");
        figma.ui.postMessage({
          type: "a11y-error",
          message: (error == null ? void 0 : error.message) || String(error)
        });
      }
    }
    if (msg.type === "cleanup-a11y-badges") {
      try {
        cleanupBadges(figma.currentPage);
        figma.ui.postMessage({ type: "a11y-badges-cleaned" });
      } catch (error) {
        console.error("Cleanup A11Y badges error:", error);
      }
    }
    if (msg.type === "simulate-color-blindness") {
      try {
        const cbScope = msg.scope || "page";
        const cbPlacement = msg.placement || "new-page";
        const result2 = await simulateColorBlindness(cbScope, cbPlacement);
        figma.ui.postMessage({ type: "color-blindness-simulated", pagesCreated: result2.pagesCreated });
      } catch (error) {
        console.error("Color blindness simulation error:", error);
        figma.ui.postMessage({
          type: "a11y-error",
          message: (error == null ? void 0 : error.message) || String(error)
        });
      }
    }
    if (msg.type === "cancel-scan") {
      if (currentAbortToken) {
        currentAbortToken.cancelled = true;
        currentAbortToken = null;
      }
      figma.ui.postMessage({ type: "scan-cancelled" });
    }
    if (msg.type === "navigate-to-node") {
      try {
        var navNodeId = msg.nodeId || "";
        var navNode = await figma.getNodeByIdAsync(navNodeId);
        if (navNode && "type" in navNode && navNode.type !== "DOCUMENT" && navNode.type !== "PAGE") {
          var navScene = navNode;
          await selectAndZoom(navScene);
        }
      } catch (error) {
        console.error("Navigate error:", error);
      }
    }
    if (msg.type === "load-linter-config") {
      var loadedConfig = await getLinterConfig();
      figma.ui.postMessage({ type: "linter-config-loaded", config: loadedConfig });
    }
    if (msg.type === "save-linter-config") {
      try {
        if (msg.config) {
          linterConfig = msg.config;
          await saveLinterConfig(msg.config);
          figma.ui.postMessage({ type: "linter-config-saved" });
          figma.notify(nt("config.saved"), { timeout: 2e3 });
        }
      } catch (error) {
        console.error("Save config error:", error);
      }
    }
    if (msg.type === "reset-linter-config") {
      try {
        linterConfig = await resetLinterConfig();
        figma.ui.postMessage({ type: "linter-config-loaded", config: linterConfig });
        figma.notify(nt("config.reset"), { timeout: 2e3 });
      } catch (error) {
        console.error("Reset config error:", error);
      }
    }
  };
})();
