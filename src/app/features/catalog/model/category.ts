// A node of the category tree, at any depth. Listings attach to a leaf; filtering by a node
// includes its descendants, so there is no separate "subcategory" type — see docs/domain.md.
export interface CategoryNode {
  readonly id: string;
  readonly label: string;
  readonly children: readonly CategoryNode[];
}

// The path from a root section down to the node, the node included. Empty when the id is
// unknown — a stale link, which the UI treats as "no category" rather than as an error.
export function categoryPath(
  tree: readonly CategoryNode[],
  id: string | null,
): readonly CategoryNode[] {
  if (id === null) {
    return [];
  }

  for (const node of tree) {
    if (node.id === id) {
      return [node];
    }

    const deeper: readonly CategoryNode[] = categoryPath(node.children, id);
    if (deeper.length > 0) {
      return [node, ...deeper];
    }
  }

  return [];
}
