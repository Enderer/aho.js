import { Pattern, PatternAsync } from './add-pattern';
import { getChild, Node, Root, walkFallback } from './trie';

/**
 * Search for predefined matching patterns in a token stream
 * @param root Root node of a search trie containing patterns to look for
 * @param stream Token stream to look for matches in
 */
export function * findPatterns<T = string> (
  root: Root<T>,
  stream: Pattern<T>
): Iterable<Pattern<T>> {
  let node: Node<T> = root;
  for (const token of stream) {
    while (getChild(node, token) == null && node !== root) {
      node = node.fallback!;
    }
    node = getChild(node, token) ?? root;
    for (const t of walkFallback(node)) {
      if (t === root) { break; }
      if (t.pattern) { yield t.pattern; }
    }
  }
}

/**
 * Search for patterns in an asyncronous stream of tokens
 * @param root Root node of a search trie containing patterns to look for
 * @param stream Token stream that returns tokens asynchronously
 */
export async function * findPatternsAsync<T = string> (
  root: Root<T>,
  stream: PatternAsync<T>
): AsyncIterable<Pattern<T>> {
  let node: Node<T> = root;
  for await (const token of stream) {
    while (getChild(node, token) == null && node !== root) {
      node = node.fallback!;
    }
    node = getChild(node, token) ?? root;
    for (const t of walkFallback(node)) {
      if (t === root) { break; }
      if (t.pattern) { yield t.pattern; }
    }
  }
}
