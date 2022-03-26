import { Pattern } from './add-pattern';

export interface Node<T = string> {
  pattern?: Pattern<T>;
  children?: Node<T>[];
  token?: T;
  parent?: Node<T>;
  fallback?: Node<T>;
  path?: string;
  depth?: number;
}

export interface Root<T = string> extends Node<T> {}

export const createRoot = <T = string>(): Root<T> => ({ path: '^' });

/**
 * Get the child node that matches a given token value if one exists.
 * If no child has the given token return undefined.
 */
export const getChild = <T = string>(node: Node<T>, token: T): Node<T> | undefined => {
  const children = node?.children;
  if (children == null) { return undefined; }
  const child = children.find(c => c.token === token);
  return child;
};

/** Traverse the trie using bread first search */
export function * walkBFS<T> (n: Node<T>): Iterable<Node<T>> {
  const q = [n];
  while (q.length > 0) {
    const node = q.shift();
    if (node != null) { yield node; }

    const children = node?.children ?? [];
    q.push(...children);
  }
}

/** Traverse the trie following fallback nodes until you get to root */
export function * walkFallback<T> (n?: Node<T>): Iterable<Node<T>> {
  let node: Node<T> | undefined = n;
  while (node != null) {
    yield (node);
    node = node.fallback === node ? undefined : node.fallback;
  }
}
