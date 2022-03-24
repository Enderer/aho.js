import { addPattern } from './add-pattern';
import { buildAho } from './build-aho';
import { findPatterns } from './find-patterns';
import { Root } from './node';
import { printToStream, printToString } from './print';

describe('aho', () => {
  it('should run a test', () => {
    let root: Root = { path: '^' };
    const patterns = ['abcd', 'abcdef', 'abcdefz', 'ab', 'bc', 'bd', 'cd', 'cde', 'e', 'f', 'c'];
    patterns.forEach(s => addPattern(root, s));
    root = buildAho(root);

    // console.log(printToString(root));
    printToStream(root).pipe(process.stdout);

    const matches = findPatterns(root, 'xabcdexyz');
    const matchesArray = Array.from(matches);
    expect(matchesArray.sort()).toEqual(['abcd', 'ab', 'bc', 'cd', 'cde', 'e', 'c'].sort());
    const children = root.children;
    children?.forEach(c => expect(c.fallback).toBe(root));
  });
});
