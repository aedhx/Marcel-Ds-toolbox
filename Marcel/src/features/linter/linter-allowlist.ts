// ── Linter Allowlist ──
// Ignore allowlist persistence via createStorage (LINT-09).
// Keys stored as "nodeId::ruleId" in a string[] under "ignored".

import { createStorage } from "../../shared/storage";
import { Violation } from "../../shared/violation-types";

const linterStorage = createStorage("linter");
const ALLOWLIST_KEY = "ignored";

export async function loadAllowlist(): Promise<Set<string>> {
  const stored = await linterStorage.get<string[]>(ALLOWLIST_KEY);
  return new Set(stored || []);
}

export async function addToAllowlist(nodeId: string, ruleId: string): Promise<Set<string>> {
  const current = await loadAllowlist();
  current.add(`${nodeId}::${ruleId}`);
  await linterStorage.set(ALLOWLIST_KEY, Array.from(current));
  return current;
}

export async function removeFromAllowlist(nodeId: string, ruleId: string): Promise<Set<string>> {
  const current = await loadAllowlist();
  current.delete(`${nodeId}::${ruleId}`);
  await linterStorage.set(ALLOWLIST_KEY, Array.from(current));
  return current;
}

export async function clearAllowlist(): Promise<void> {
  await linterStorage.delete(ALLOWLIST_KEY);
}

export function filterAllowlisted(
  violations: Violation[],
  allowlist: Set<string>
): Violation[] {
  if (allowlist.size === 0) return violations;
  return violations.filter(v => !allowlist.has(`${v.nodeId}::${v.rule}`));
}
