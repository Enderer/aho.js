import { addPattern } from './add-pattern';
import { buildPatterns } from './build-patterns';
import { printToStream, printToString } from './print-to';
import { createRoot, Root } from './trie';

describe('print-to', () => {
  describe('printToString', () => {
    it('should handle null root', () => {
      expect(printToString(null as unknown as Root)).toEqual('');
    });

    it('should print a trie', () => {
      const patterns = [
        ['he', 'she', 'his', 'hers'],
        ['abcd', 'abcdef', 'abcdefz', 'ab', 'bc', 'bd', 'cd', 'cde', 'e', 'f', 'c'],
        ['antioxidant', 'antipathy', 'antivirus', 'antigen']
      ];
      const tries = patterns
        .map(t => t.reduce((r, p) => addPattern(r, p), createRoot()))
        .map(t => buildPatterns(t));

      tries.forEach(t => expect(printToString(t)).toMatchSnapshot());
    });
  });

  describe('printToStream', () => {
    it('should print a trie', async () => {
      const patterns = [
        ['he', 'she', 'his', 'hers'],
        ['abcd', 'abcdef', 'abcdefz', 'ab', 'bc', 'bd', 'cd', 'cde', 'e', 'f', 'c'],
        ['antioxidant', 'antipathy', 'antivirus', 'antigen']
      ];
      const tries = patterns
        .map(t => t.reduce((r, p) => addPattern(r, p), createRoot()))
        .map(t => buildPatterns(t));

      const strings = tries.map(async t => {
        const readable = printToStream(t);
        let result = '';
        for await (const chunk of readable) {
          result += chunk;
        }
        return result;
      });
      for await (const s of strings) {
        expect(s).toMatchSnapshot();
      }
    });
  });
});
