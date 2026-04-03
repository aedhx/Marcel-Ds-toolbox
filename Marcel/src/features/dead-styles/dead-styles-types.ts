export type DeadItemType = "PAINT" | "TEXT" | "EFFECT" | "VARIABLE";

export interface StylePreview {
  type: "color" | "gradient" | "text" | "effect" | "variable" | "unknown";
  hex?: string;          // For solid color paint styles
  opacity?: number;      // For paint styles with opacity < 1
  fontFamily?: string;   // For text styles
  fontSize?: number;     // For text styles
  fontStyle?: string;    // For text styles
  description?: string;  // For effects, gradients, variables
  resolvedType?: string; // For variables (COLOR, FLOAT, STRING, BOOLEAN)
}

export interface DeadStyleInfo {
  id: string;
  name: string;
  itemType: DeadItemType;
  preview: StylePreview;
}

export interface DeadStylesResult {
  deadStyles: DeadStyleInfo[];
  totalLocalStyles: number;     // Total local styles scanned
  totalLocalVariables: number;  // Total local variables scanned
  scanDurationMs: number;
}

// ── Foreign detection types ──

export interface ForeignItemSource {
  libraryName: string;       // e.g. "[DS] Foundation (DEPRECATED)"
  variableOrStyleName: string; // original name in the foreign library
}

export interface DSSuggestion {
  tokenName: string;         // DS token name e.g. "Action/Background/Brand/Default"
  tokenHex?: string;         // hex value if color
  variableKey?: string;      // Figma variable key for binding (from team library)
  confidence: "high" | "medium" | null;
}

export interface ForeignItemInfo {
  id: string;                // unique id: `foreign-var-{varId}-{nodeId}-{field}` or `foreign-style-{styleId}-{nodeId}`
  nodeId: string;            // the node where this foreign item is bound
  nodeName: string;          // node.name for display
  itemType: DeadItemType;    // PAINT, TEXT, EFFECT, VARIABLE
  bindingField: string;      // e.g. "fills", "strokes", "textStyleId", "fillStyleId", "paddingLeft", etc.
  paintIndex?: number;       // index in paint array if applicable
  source: ForeignItemSource;
  preview: StylePreview;
  suggestion: DSSuggestion | null;  // null if no DS equivalent found
  foreignId: string;         // the actual variable ID or style ID of the foreign item
}

export type CleanerItemCategory = "foreign" | "dead-local";

export interface StyleCleanerResult {
  foreignItems: ForeignItemInfo[];
  deadStyles: DeadStyleInfo[];      // existing dead local styles
  totalLocalStyles: number;
  totalLocalVariables: number;
  totalForeignVariables: number;
  totalForeignStyles: number;
  scanDurationMs: number;
}
