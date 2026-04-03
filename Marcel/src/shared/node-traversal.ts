// ── Types ──

export interface ScanAbortToken {
  cancelled: boolean;
}

export type TraversalScope = "page" | "selection" | "file";

export interface TraversalOptions {
  scope: TraversalScope;
  chunkSize?: number;         // Default 150 (per user decision: 100-200 range)
  onProgress?: (processed: number, total: number) => void;
  abortToken?: ScanAbortToken;
}

export type NodeVisitor = (
  node: SceneNode,
  depth: number,
  path: string
) => void | false; // Return false to skip children of this node

// ── Helpers ──

function yieldToEventLoop(): Promise<void> {
  return new Promise<void>(resolve => setTimeout(resolve, 0));
}

// ── Main function ──

export async function traverseNodes(
  visitor: NodeVisitor,
  options: TraversalOptions
): Promise<{ processed: number; cancelled: boolean }> {
  const { scope, chunkSize = 150, onProgress, abortToken } = options;

  // Required performance optimization: skip invisible instance children
  figma.skipInvisibleInstanceChildren = true;

  let processed = 0;

  if (scope === "file") {
    // File scope: iterate all pages, loading each before accessing children
    const pages = figma.root.children;
    const totalPages = pages.length;

    for (let pageIndex = 0; pageIndex < pages.length; pageIndex++) {
      // Check cancellation between pages
      if (abortToken?.cancelled) {
        return { processed, cancelled: true };
      }

      const page = pages[pageIndex];

      // Must load page before accessing children
      await page.loadAsync();

      // Process this page's nodes
      const pageResult = await processNodeQueue(
        page.children as SceneNode[],
        visitor,
        chunkSize,
        abortToken,
        (chunkProcessed) => {
          processed += chunkProcessed;
          // Report page-level progress for file scope
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
    // Page scope: traverse currentPage.children
    // Selection scope: traverse figma.currentPage.selection
    const rootNodes: SceneNode[] = scope === "selection"
      ? [...figma.currentPage.selection]
      : [...figma.currentPage.children];

    const result = await processNodeQueue(
      rootNodes,
      visitor,
      chunkSize,
      abortToken,
      (chunkProcessed) => {
        processed += chunkProcessed;
        // Total is -1 (unknown) for page/selection scope — we discover nodes as we go
        if (onProgress) {
          onProgress(processed, -1);
        }
      }
    );

    processed = result.processed;
    return { processed, cancelled: result.cancelled };
  }
}

// ── Internal queue processor ──

interface QueueEntry {
  node: SceneNode;
  depth: number;
  path: string;
}

async function processNodeQueue(
  rootNodes: SceneNode[],
  visitor: NodeVisitor,
  chunkSize: number,
  abortToken: ScanAbortToken | undefined,
  onChunkDone: (chunkProcessed: number) => void
): Promise<{ processed: number; cancelled: boolean }> {
  const queue: QueueEntry[] = rootNodes.map(node => ({
    node,
    depth: 0,
    path: node.name,
  }));

  let processed = 0;

  while (queue.length > 0) {
    // Check cancellation at start of each chunk
    if (abortToken?.cancelled) {
      return { processed, cancelled: true };
    }

    // Process one chunk
    const chunk = queue.splice(0, chunkSize);
    let chunkCount = 0;

    for (const entry of chunk) {
      const { node, depth, path } = entry;

      // Call visitor — if returns false, skip this node's children
      const result = visitor(node, depth, path);
      processed++;
      chunkCount++;

      // Push children to queue unless visitor returned false or node is an instance
      // Instances have their own internal structure; we still recurse into them but
      // the structure is flattened — only skip if visitor explicitly returns false.
      if (result !== false && "children" in node) {
        const parent = node as ChildrenMixin;
        const children = parent.children as SceneNode[];
        for (const child of children) {
          queue.push({
            node: child,
            depth: depth + 1,
            path: `${path} > ${child.name}`,
          });
        }
      }
    }

    // Report progress after chunk
    onChunkDone(chunkCount);

    // Yield to event loop to prevent UI freeze
    if (queue.length > 0) {
      await yieldToEventLoop();
    }
  }

  return { processed, cancelled: false };
}
