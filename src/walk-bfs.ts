import { Node } from './node';

/**
 * Traverse the trie using bread first search starting at the given node
 * @param n Node to begin traversing from
 */
export function *walkBFS <T>(n: Node<T>): Iterable<Node<T>> {
  const q = [n];
  while (q.length > 0) {
    const node = q.shift()
    if (node != null) { yield node; }

    const children = node?.children ?? [];
    q.push(...children);
  }
}
