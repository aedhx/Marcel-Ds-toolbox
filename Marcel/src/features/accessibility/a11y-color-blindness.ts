import { srgbToLinear, linearToSrgb } from './a11y-contrast';
import { getNodeFills, getNodeStrokes } from '../../shared/figma-helpers';

// ── Simulation types ──

export const SIMULATION_TYPES = ['protanopia', 'deuteranopia', 'tritanopia'] as const;
export type SimulationType = typeof SIMULATION_TYPES[number];

// ── Pre-combined RGB->LMS->simulate->LMS->RGB matrices (Brettel 1997) ──

const SIMULATION_MATRICES: Record<SimulationType, number[][]> = {
  protanopia: [
    [0.152286, 1.052583, -0.204868],
    [0.114503, 0.786281,  0.099216],
    [-0.003882, -0.048116, 1.051998],
  ],
  deuteranopia: [
    [0.367322, 0.860646, -0.227968],
    [0.280085, 0.672501,  0.047413],
    [-0.011820, 0.042940, 0.968881],
  ],
  tritanopia: [
    [1.255528, -0.076749, -0.178779],
    [-0.078411, 0.930809,  0.147602],
    [0.004733,  0.691367,  0.303900],
  ],
};

// ── Color simulation ──

/**
 * Apply a color blindness simulation matrix to a single RGB color.
 * Operates in linear RGB space (linearize -> transform -> gamma compress).
 */
function simulateColor(rgb: RGB, matrix: number[][]): RGB {
  const lr = srgbToLinear(rgb.r);
  const lg = srgbToLinear(rgb.g);
  const lb = srgbToLinear(rgb.b);

  const r = Math.max(0, Math.min(1, matrix[0][0] * lr + matrix[0][1] * lg + matrix[0][2] * lb));
  const g = Math.max(0, Math.min(1, matrix[1][0] * lr + matrix[1][1] * lg + matrix[1][2] * lb));
  const b = Math.max(0, Math.min(1, matrix[2][0] * lr + matrix[2][1] * lg + matrix[2][2] * lb));

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
  };
}

// ── Node recoloring ──

/**
 * Recursively recolor all SOLID fills and strokes on a node tree.
 * Processes in batches to avoid freezing Figma (yields every 100 nodes).
 */
async function recolorTree(
  node: SceneNode,
  matrix: number[][],
): Promise<void> {
  const nodes: SceneNode[] = [];
  collectNodes(node, nodes);

  const BATCH_SIZE = 100;
  for (let i = 0; i < nodes.length; i += BATCH_SIZE) {
    const batch = nodes.slice(i, i + BATCH_SIZE);
    for (const n of batch) {
      recolorNodeFills(n, matrix);
      recolorNodeStrokes(n, matrix);
    }
    // Yield to avoid blocking the event loop (pitfall #5)
    if (i + BATCH_SIZE < nodes.length) {
      await new Promise<void>(resolve => setTimeout(resolve, 0));
    }
  }
}

/**
 * Collect all scene nodes in a subtree (depth-first).
 */
function collectNodes(node: SceneNode, out: SceneNode[]): void {
  out.push(node);
  if ('children' in node) {
    for (const child of (node as ChildrenMixin).children) {
      collectNodes(child as SceneNode, out);
    }
  }
}

/**
 * Replace SOLID fill colors with their simulated equivalents.
 */
function recolorNodeFills(node: SceneNode, matrix: number[][]): void {
  if (!('fills' in node)) return;
  const fills = getNodeFills(node);
  if (fills.length === 0) return;

  let changed = false;
  const newFills = fills.map(paint => {
    if (paint.type === 'SOLID') {
      changed = true;
      return {
        ...paint,
        color: simulateColor((paint as SolidPaint).color, matrix),
      };
    }
    return { ...paint };
  });

  if (changed) {
    (node as GeometryMixin).fills = newFills;
  }
}

/**
 * Replace SOLID stroke colors with their simulated equivalents.
 */
function recolorNodeStrokes(node: SceneNode, matrix: number[][]): void {
  if (!('strokes' in node)) return;
  const strokes = getNodeStrokes(node);
  if (strokes.length === 0) return;

  let changed = false;
  const newStrokes = strokes.map(paint => {
    if (paint.type === 'SOLID') {
      changed = true;
      return {
        ...paint,
        color: simulateColor((paint as SolidPaint).color, matrix),
      };
    }
    return { ...paint };
  });

  if (changed) {
    (node as GeometryMixin).strokes = newStrokes;
  }
}

// ── Public API ──

/**
 * Generate color blindness simulation for all 3 types at once.
 * Clones source nodes and applies LMS color transform to all SOLID fills/strokes.
 *
 * @param scope - 'page' to simulate entire page, 'selection' for selected nodes
 * @param placement - 'new-page' creates separate pages, 'same-page' places clones beside originals
 * @returns Array of created page names for reference
 */
export async function simulateColorBlindness(
  scope: 'page' | 'selection',
  placement: 'new-page' | 'same-page',
): Promise<{ pagesCreated: string[] }> {
  const pagesCreated: string[] = [];
  const sourcePage = figma.currentPage;

  // Determine source nodes
  const sourceNodes: SceneNode[] =
    scope === 'selection' && figma.currentPage.selection.length > 0
      ? [...figma.currentPage.selection]
      : [...sourcePage.children];

  if (sourceNodes.length === 0) {
    return { pagesCreated };
  }

  // Calculate bounding box for same-page offset
  let maxX = 0;
  for (const node of sourceNodes) {
    const right = node.x + node.width;
    if (right > maxX) maxX = right;
  }

  const GAP = 200;
  let offsetX = maxX + GAP;

  for (const simType of SIMULATION_TYPES) {
    const matrix = SIMULATION_MATRICES[simType];

    if (placement === 'new-page') {
      const newPage = figma.createPage();
      newPage.name = `[Simulation] ${simType} - ${sourcePage.name}`;
      pagesCreated.push(newPage.name);

      for (const node of sourceNodes) {
        const clone = node.clone();
        newPage.appendChild(clone);
        await recolorTree(clone, matrix);
      }
    } else {
      // same-page: clone and offset to the right
      const groupWidth = maxX - Math.min(...sourceNodes.map(n => n.x));

      for (const node of sourceNodes) {
        const clone = node.clone();
        clone.x = node.x + offsetX - Math.min(...sourceNodes.map(n => n.x));
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
