export type ViolationSeverity = "error" | "warning" | "info";

export interface ViolationRule {
  id: string;
  name: string;
  category: string;
  severity: ViolationSeverity;
  description: string;
}

export interface Violation {
  id: string;              // Unique violation ID (e.g., "lint-default-name-123:456")
  nodeId: string;          // Figma node ID
  nodeName: string;        // Current node name
  nodePath: string;        // Full path (e.g., "Frame > Group > Rectangle")
  rule: string;            // Rule ID (e.g., "default-name", "off-token-color")
  severity: ViolationSeverity;
  category: string;        // "naming", "color", "typography", "spacing", "component"
  message: string;         // Human-readable description
  suggestion?: string;     // Auto-fix suggestion if available
  confidence?: "high" | "medium" | "low"; // Auto-fix confidence
  metadata?: Record<string, unknown>; // Rule-specific data (e.g., nearestToken for colors)
}

export interface ViolationGroup {
  rule: string;
  category: string;
  severity: ViolationSeverity;
  count: number;
  violations: Violation[];
}

export function groupViolationsByRule(violations: Violation[]): ViolationGroup[] {
  const groups = new Map<string, ViolationGroup>();
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
        violations: [v],
      });
    }
  }
  return Array.from(groups.values());
}
