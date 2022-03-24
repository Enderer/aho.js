import { Readable } from 'stream';
import { Node } from './node';

/**
 * Prints the structure of a trie to a list of strings
 * with one string per node
 * @param n Root node of the trie to print
 * @param d Depth if indenting at the root node
 */
export function *printToIterable<T>(n: Node<T>, d = 0): Iterable<string> {
  const token = n.token ?? '';
  const fallback = n.fallback?.path ?? '';
  const pattern = n.pattern ? '*' : '';

  const pre = '  '.repeat(d);
  yield `${pre}[${token}]${pattern} ${fallback}\n`;
  const children = n.children ?? [];
  for(const [i, child] of children.entries()){
    yield * printToIterable(child, d + 1);
  }
};

/**
 * Prints the structure of a trie to stream
 * @param n Root node of the trie to print
 * @param d Depth if indenting at the root node
 */
export const printToStream = <T>(n: Node<T>, d: number = 0) => {
  return Readable.from(printToIterable(n, d));
};

/**
 * Prints the structure of a trie to a string
 * @param n Root node of the trie to print
 * @param d Depth if indenting at the root node
 */
export const printToString = <T>(n: Node<T>, d: number = 0) => {
  return Array.from(printToIterable(n, d)).join('');
};

