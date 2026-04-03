// Marcel Design System tokens — source of truth: Figma "Marcel Semantic" file
// https://www.figma.com/design/QJfqeYmqC6QJRGzud27CqV/Marcel-Semantic

// ── Helpers ──

export function hexToRgb(hex: string): RGB {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.substring(0, 2), 16) / 255,
    g: parseInt(h.substring(2, 4), 16) / 255,
    b: parseInt(h.substring(4, 6), 16) / 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => Math.round(n * 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ── Convenience aliases (used by starter-kit builders and UI) ──

export const colors = {
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
  statusWip: hexToRgb("#f59e0b"),
};

// ── Full Semantic Colors (Light mode) ──

export const semanticColors = {
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
  persistentContentWarningReversed: hexToRgb("#fffaf0"),
};

// ── Spacing ──

export const spacing: Record<string, number> = {
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
  "6xl": 72,
};

// ── Sizing ──

export const sizing: Record<string, number> = {
  "4xs": 2,
  "3xs": 4,
  "2xs": 8,
  xs: 12,
  s: 16,
  m: 24,
  l: 32,
  xl: 40,
  "2xl": 48,
  "3xl": 56,
  "4xl": 72,
};

// ── Border Radius ──

export const borderRadius: Record<string, number> = {
  xs: 2,
  s: 4,
  m: 8,
  l: 16,
  xl: 24,
  "2xl": 32,
  rounded: 100,
};

// ── Border Size ──

export const borderSize: Record<string, number> = {
  s: 1,
  m: 2,
};

// ── Typography ──

export const fonts = {
  family: "Ubuntu",
  weights: {
    regular: "Regular" as const,
    medium: "Medium" as const,
    bold: "Bold" as const,
  },
};

export const fontSizes: Record<string, number> = {
  "body-xs": 12,
  "body-s": 14,
  "body-m": 16,
  "title-2xs": 20,
  "title-xs": 24,
  "title-s": 28,
  "title-m": 32,
  "title-l": 40,
  "title-xl": 48,
  "title-2xl": 56,
};

export const lineHeights: Record<string, number> = {
  "body-xs": 16,
  "body-s": 20,
  "body-m": 24,
  "title-2xs": 24,
  "title-xs": 32,
  "title-s": 36,
  "title-m": 40,
  "title-l": 48,
  "title-xl": 52,
  "title-2xl": 64,
};

export const letterSpacing: Record<string, number> = {
  condensed: -0.4,
};

// ── DSToken database ──
// Used by Health Check for token matching (nearest-color, off-token detection)

export interface DSToken {
  name: string;
  cssVar: string;
  value: string;        // hex for colors, px string for spacing/sizing
  category: "color" | "spacing" | "sizing" | "typography" | "border-radius";
}

export const DS_TOKENS: DSToken[] = [
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
  { name: "Font Size/Title/2XL", cssVar: "--mrcl-font-size-title-2xl", value: "56", category: "typography" },
];
