import { Node } from './node';

/**
 * Traverse the search trie starting from the given node and
 * walking up the fallbacks until you get to the root.
 * @param n Node to start traversing
 */
export function *walkFallback <T>(n?: Node<T>): Iterable<Node<T>> {
  let node: Node<T> | undefined = n;
  while(node != null) {
    yield(node);
    node = node.fallback == node ? undefined : node.fallback;
  }
}
