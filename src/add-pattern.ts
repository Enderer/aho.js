import { getChild, Node, Root } from './trie';

export interface Pattern<T = string>
    extends Iterable<T> {};

export interface PatternAsync<T =string>
    extends AsyncIterable<T>{};

/**
 * Add a pattern to the search trie
 * @param root Root node of an aho-corasick trie
 * @param pattern Pattern that should be matched
 */
export const addPattern = <T = string>(root: Root<T>, pattern: Pattern<T>): Root<T> => {
  if (root == null) { throw new Error('Root is null'); }
  if (pattern == null) { return root; }

  let node: Node<T> = root;
  for (const token of pattern) {
    let child = getChild(node, token);
    if (child == null) {
      node.children = node.children ?? [];
      child = {
        token,
        parent: node,
        path: node.path + String(token),
        depth: node.depth + 1
      };
      node.children.push(child);
    }
    node = child;
  }
  node.pattern = pattern;
  return root;
};
