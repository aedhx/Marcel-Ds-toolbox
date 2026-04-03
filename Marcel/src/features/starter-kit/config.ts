// ── DS Component Keys (published Marcel DS library) ──

export const DS_COMPONENT_KEYS = {
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
  handoffDevice: "06dea5d62ebf241040170244766d9742ead0cda9",       // Device=Desktop
  handoffButtonLink: "6c6a18fad226a7e02c0b2ca98270125c10fe9a87",   // Link to=Documentation
  handoffShortcut: "b461526bdae8d27dacec0e10009cbb419f895496",      // Colour=Figma
  handoffFlow: "1db53db91bfded6ae5d57d83909818017ad03f5c",          // Status=WIP, Size=S
  handoffQuote: "6093e1b7f37d464e8b63311fa7ce28797107bf66",         // Colour=Grey
  handoffPostIt: "3a875d628b735f6fb510cf09af79984bb6e12e61",        // Colour=Yellow
  handoffHighlight: "20f3fff5cd6da1ed3e32fea602b54f96dd6062d5",     // Highlight=General, Point Left=On
  handoffScreen: "3edd6e6bb99890b2c7512554d8926ba456ca8b3f",        // State=WIP, News=Off
  handoffThoughts: "4fc2f5c167815b20e94265aa8a38087047939711",      // Type=General
  handoffCardLink: "acfc486f29426dbf1707dd6a34967ccf04f15c7d",      // Type=Standard
  handoffCirclePin: "9736b61921f8ec7b7c28b860950bd64e591309d9",     // Line=Right, Color=Error
  handoffSpecsCard: "2c9e9f457199344807520381687dc737c6c85b9d",     // Specs CARD
  // Analytics tracking pixel (invisible component for library analytics)
  trackingPixel: "765eaa06057611c1a5e88eac045eff85159116b5",
};

// Page definitions for the Starter Kit templates

export interface PageDefinition {
  name: string;
  type: "content" | "separator" | "empty";
  builder?: string; // which builder to use
}

// ── PRD Project Starter Kit pages ──

export const STARTER_KIT_PAGES: PageDefinition[] = [
  { name: "Cover", type: "content", builder: "cover" },
  { name: "Overview", type: "content", builder: "overview" },
  { name: "----", type: "separator" },
  { name: "+ Commencer mon projet (à renommer)", type: "content", builder: "delivery" },
  { name: "----", type: "separator" },
  { name: "Local components", type: "content", builder: "local-components" },
  { name: "---", type: "separator" },
  { name: "📦  Archives", type: "content", builder: "archives" },
  { name: "Need help ? Comment organiser & documenter", type: "content", builder: "help" },
];

// ── DS Library pages ──

export const DS_LIBRARY_PAGES: PageDefinition[] = [
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
  { name: "Page Name ", type: "empty" },
];

// ── PRD Overview sections ──

export const OVERVIEW_SECTIONS = [
  {
    emoji: "\u{1F9EA}",
    title: "Probl\u00e9matique",
    bullets: [
      "Remise en contexte, explication synth\u00e9tique de la probl\u00e9matique principale.",
    ],
  },
  {
    emoji: "\u{1F3AF}",
    title: "Objectif",
    bullets: ["OKR et/ou KPIs"],
  },
  {
    emoji: "\u{1F517}",
    title: "Ressources",
    bullets: [
      "Pre-framing (remplacer avec le bon lien)",
      "Discovery (remplacer avec le bon lien)",
      "DP Jira (remplacer avec le bon lien)",
    ],
  },
  {
    emoji: "\u{1F91D}",
    title: "Core team",
    bullets: [
      "Design: @-",
      "Business : @-",
      "Produit : @-",
      "Tech : @-",
      "Autres interlocuteurs :",
    ],
  },
];

// ── PRD Help content ──

export const HELP_CONTENT = {
  title: "Comment organiser & documenter ton fichier",
  sections: [
    {
      heading: "Structure du fichier",
      body: "Ce template te propose une structure standardis\u00e9e pour organiser ton fichier Figma. Chaque page a un r\u00f4le pr\u00e9cis pour faciliter la collaboration et la documentation.",
    },
    {
      heading: "Cover",
      body: "La premi\u00e8re page sert de vignette pour ton fichier. Mets \u00e0 jour le nom du projet et l\u2019\u00e9quipe. Le thumbnail sera automatiquement appliqu\u00e9.",
    },
    {
      heading: "Overview",
      body: "R\u00e9sume le contexte de l\u2019initiative : probl\u00e9matique, objectifs, ressources cl\u00e9s et core team. C\u2019est la page de r\u00e9f\u00e9rence pour toute personne qui d\u00e9couvre le projet.",
    },
    {
      heading: "Delivery & UI/Prototype",
      body: "Organise tes maquettes par user flow. Utilise les sections et les frames de storyboard pour pr\u00e9senter clairement tes \u00e9crans.",
    },
    {
      heading: "Local components & Specs",
      body: "Cr\u00e9e tes composants locaux sp\u00e9cifiques au projet dans \u00ab Local components \u00bb. Documente les sp\u00e9cifications dans \u00ab Specs \u00bb.",
    },
    {
      heading: "Archives",
      body: "D\u00e9place les anciens \u00e9crans et explorations obsol\u00e8tes dans cette page plut\u00f4t que de les supprimer.",
    },
  ],
};

