// ── Plugin-generated artifacts ──
//
// Nodes the plugin itself writes into the designer's file (today: the delivery stamp).
// They are NOT design content: the scans must never audit them, otherwise the plugin
// penalises its own badge ("Livraison — Quality Check" tripped the special-chars rule).
// Lives in shared/ so both the traversal (shared/) and the feature builders can import it
// without a shared → features dependency (CONVENTIONS.md layering).

/** Current name of the delivery stamp frame — standard characters only. */
export const DELIVERY_STAMP_FRAME_NAME = "Marcel - Livraison Quality Check";

/** Names previous plugin versions gave the stamp; still recognised so re-delivering replaces them. */
export const LEGACY_DELIVERY_STAMP_FRAME_NAMES: readonly string[] = ["Marcel — Livraison Quality Check"];

const ARTIFACT_NAMES = new Set<string>([DELIVERY_STAMP_FRAME_NAME, ...LEGACY_DELIVERY_STAMP_FRAME_NAMES]);

/** True for a node the plugin generated (matched by its exact frame name). */
export function isPluginArtifact(node: { name: string }): boolean {
  return ARTIFACT_NAMES.has(node.name);
}

/** Layer-name sanitiser: keeps the linter's allowed set, replaces everything else with "-". */
export function toStandardLayerName(name: string): string {
  return name.replace(/[^a-zA-Z0-9\s\-_\/.àéèêëïîôùûüçÀÉÈÊËÏÎÔÙÛÜÇ]/g, "-").replace(/\s+/g, " ").trim();
}
