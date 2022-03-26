import { addPattern } from './add-pattern';
import { createRoot, Root } from './trie';

describe('add-patterns', () => {
  it('should error on null root', () => {
    expect(() => addPattern(null as unknown as Root, 'PATTERN')).toThrowError();
  });

  it('should do nothing with null pattern', () => {
    const root1 = createRoot();
    const root2 = JSON.parse(JSON.stringify(root1));
    const pattern = null as unknown as string;
    const root3 = addPattern(root2, pattern);
    expect(root3).toBe(root2);
    expect(root3).toEqual(root1);
  });

  it('should create a trie', () => {
    [
      ['he', 'she', 'his', 'hers'],
      ['abcd', 'abcdef', 'abcdefz', 'ab', 'bc', 'bd', 'cd', 'cde', 'e', 'f', 'c'],
      ['antioxidant', 'antipathy', 'antivirus', 'antigen']
    ].forEach(p => expect(p.reduce((r, p) => addPattern(r, p), createRoot())).toMatchSnapshot());
  });
});
