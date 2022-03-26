import { addPattern } from './add-pattern';
import { buildPatterns } from './build-patterns';
import { findPatterns } from './find-patterns';
import { createRoot } from './trie';
import { printToStream } from './print';

describe('find-patterns', () => {
  it('should run a test', () => {
    let root = createRoot();
    const patterns = ['abcd', 'abcdef', 'abcdefz', 'ab', 'bc', 'bd', 'cd', 'cde', 'e', 'f', 'c'];
    patterns.forEach(s => addPattern(root, s));
    root = buildPatterns(root);

    // console.log(printToString(root));
    printToStream(root).pipe(process.stdout);

    const matches = findPatterns(root, 'xabcdexyz');
    const matchesArray = Array.from(matches);
    expect(matchesArray.sort()).toEqual(['abcd', 'ab', 'bc', 'cd', 'cde', 'e', 'c'].sort());
    const children = root.children;
    children?.forEach(c => expect(c.fallback).toBe(root));
  });
});
