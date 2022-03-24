import { getChild, Node, Root } from './node';
import { Pattern } from './pattern';

/**
 * Add a pattern to the search trie
 * @param root Root node of an aho-corasick trie
 * @param pattern Pattern that should be matched
 */
export const addPattern = <T = string>(root: Root<T>, pattern: Pattern<T>): Root<T> => {
  let node: Node<T> = root;
  for (const token of pattern) {
    let child = getChild(node, token);
    if (child == null) {
      node.children = node.children ?? [];
      child = { token, parent: node, path: node.path + String(token) };
      node.children.push(child);
    }
    node = child;
  }
  node.pattern = pattern;
  return root;
};
