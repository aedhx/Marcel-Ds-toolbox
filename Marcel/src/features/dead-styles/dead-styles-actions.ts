import type { DeadItemType } from "./dead-styles-types";

export async function removeDeadStyle(
  styleId: string,
  itemType: DeadItemType
): Promise<{ success: boolean; error?: string }> {
  try {
    if (itemType === "VARIABLE") {
      const variable = await figma.variables.getVariableByIdAsync(styleId);
      if (!variable) {
        return { success: false, error: "Variable introuvable" };
      }
      variable.remove();
      return { success: true };
    }

    // PAINT, TEXT, or EFFECT
    const style = await figma.getStyleByIdAsync(styleId);
    if (!style) {
      return { success: false, error: "Style introuvable" };
    }
    style.remove();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error?.message || "Echec de la suppression" };
  }
}

export async function removeAllDeadStyles(
  items: Array<{ id: string; itemType: DeadItemType }>
): Promise<{ removed: number; failed: number }> {
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
