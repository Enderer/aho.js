import { getChild, Root, walkBFS, walkFallback } from './trie';

/**
 * Once all patterns have been added to the trie prepare it for searching.
 * Creates fallback links for each node using BFS to allow moving to the next
 * pattern when a match fails.
 * @param root Root node of a search trie
 */
export const buildPatterns = <T = string>(root: Root<T>): Root<T> => {
  root.fallback = root;
  for (const node of walkBFS(root)) {
    if (node === root) { continue; }

    for (const n of walkFallback(node.parent?.fallback)) {
      const child = getChild(n, node.token!);
      if (child != null) {
        node.fallback = child;
        break;
      }
    }

    if (node.fallback == null) { node.fallback = root; }
    if (node.fallback === node) { node.fallback = root; }
  }
  return root;
};
