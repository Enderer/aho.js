import { Pattern, PatternAsync } from './add-pattern';
import { getChild, Node, Root, walkFallback } from './trie';

export interface PatternMatch<T> {
  start: number;
  length: number;
  pattern: Pattern<T>
}

/**
 * Search for predefined matching patterns in a token stream
 * @param root Root node of a search trie containing patterns to look for
 * @param stream Token stream to look for matches in
 */
export function * findPatterns<T = string> (
  root: Root<T>,
  stream: Pattern<T>
): Iterable<PatternMatch<T>> {
  if (root == null) { throw new Error('Root is null'); }
  if (stream == null) { throw new Error('Token stream is null'); }

  let node: Node<T> = root;
  let s = 0;

  for (const token of stream) {
    while (getChild(node, token) == null && node !== root) {
      node = node.fallback!;
    }
    node = getChild(node, token) ?? root;
    for (const t of walkFallback(node)) {
      if (t === root) { break; }
      if (t.pattern) {
        yield {
          start: s - (t.depth - 1),
          length: t.depth,
          pattern: t.pattern
        };
      }
    }
    s++;
  }
}

/**
 * Search for patterns in an asynchronous stream of tokens
 * @param root Root node of a search trie containing patterns to look for
 * @param stream Token stream that returns tokens asynchronously
 */
export async function * findPatternsAsync<T = string> (
  root: Root<T>,
  stream: PatternAsync<T>
): AsyncIterable<PatternMatch<T>> {
  if (root == null) { throw new Error('Root is null'); }
  if (stream == null) { throw new Error('Token stream is null'); }

  let node: Node<T> = root;
  let s = 0;

  for await (const token of stream) {
    while (getChild(node, token) == null && node !== root) {
      node = node.fallback!;
    }
    node = getChild(node, token) ?? root;
    for (const t of walkFallback(node)) {
      if (t === root) { break; }
      if (t.pattern) {
        yield {
          start: s - (t.depth - 1),
          length: t.depth,
          pattern: t.pattern
        };
      }
    }
    s++;
  }
}
