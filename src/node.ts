import { Pattern } from './pattern';

export interface Node<T = string> {
  pattern?: Pattern<T>;
  children?: Node<T>[];
  token?: T;
  parent?: Node<T>;
  fallback?: Node<T>;
  path?: string;
  depth?: number;
}

export interface Root<T = string>
  extends Node<T> {}

/**
 * Get the child node that matches a given token value if one exists.
 * If no child has the given token return undefined.
 * @param node Node to look for child nodes for
 * @param token Look for a child with this token
 * @returns Child node that matches the given token
 */
export const getChild = <T = string>(node: Node<T>, token: T): Node<T> | undefined => {
  const children = node?.children;
  if (children == null) { return undefined; }
  let child = children.find(c => c.token === token);
  return child;
};

/** Initializes a root node of an aho corasick trie */
export const createRoot = <T = string>(): Root<T> => ({ path: '^' });
