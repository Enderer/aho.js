import { combinations, patternSort, sequence, toArray, toAsyncIterable } from './__tests__/utils';
import { findPatterns, findPatternsAsync, PatternMatch } from './find-patterns';
import { addPattern, Pattern } from './add-pattern';
import { buildPatterns } from './build-patterns';
import { createRoot, Root } from './trie';

describe('find-patterns', () => {
  describe('findPatterns', () => {
    it('should handle null root', () => {
      expect(() => Array.from(findPatterns(null as unknown as Root, '123456789'))).toThrowError();
    });

    it('should error on null stream', () => {
      expect(() => Array.from(findPatterns(createRoot(), null as unknown as Pattern))).toThrowError();
    });

    it('should find strings', () => {
      expect(find(
        ['he', 'she', 'his', 'hers'],
        'ushers'
      )).toEqual([
        { pattern: 'she', start: 1, length: 3 },
        { pattern: 'he', start: 2, length: 2 },
        { pattern: 'hers', start: 2, length: 4 }
      ]);
    });

    it('should find tokens', () => {
      expect(find(
        [['one', 'two', 'three'], ['four', 'five', 'six']],
        ['zero', 'one', 'two', 'three', 'four']
      )).toEqual([{ pattern: ['one', 'two', 'three'], start: 1, length: 3 }]);
    });

    it('should find numbers', () => {
      expect(find(
        [[0, 2, 1, 3, 2], [4, 4, 1, 4, 3]],
        [1, 2, 3, 4, 4, 1, 4, 3, 5, 1, 2, 3]
      )).toEqual([
        { pattern: [4, 4, 1, 4, 3], start: 3, length: 5 }
      ]);
    });

    it('should find all possible patterns', () => {
      const max = 10;
      const patterns = Array.from(combinations(max));
      const root = createRoot<number>();
      for (const p of patterns) { addPattern(root, p); }
      buildPatterns(root);
      const seq = Array.from(sequence(max));
      const results = Array.from(findPatterns(root, seq));
      const matches = results.map(r => r.pattern);
      matches.sort(patternSort);
      patterns.sort(patternSort);
      expect(matches).toEqual(patterns);
    });
  });

  describe('findPatternsAsync', () => {
    it('should find patterns', async () => {
      const p = await findAsync(
        ['he', 'she', 'his', 'hers'],
        'ushers',
        100
      );
      expect(p).toEqual([
        { pattern: 'she', start: 1, length: 3 },
        { pattern: 'he', start: 2, length: 2 },
        { pattern: 'hers', start: 2, length: 4 }
      ]);
    });
  });
});

export const find = <T>(patterns: Iterable<Pattern<T>>, stream: Pattern<T>): PatternMatch<T>[] => {
  const t = Array.from(patterns).reduce(addPattern, createRoot<T>());
  const b = buildPatterns(t);
  const r = findPatterns(b, stream);
  return Array.from(r);
};

export const findAsync = async <T>(
  patterns: Iterable<Pattern<T>>,
  stream: Pattern<T>, delay: number = 0
): Promise<PatternMatch<T>[]> => {
  const t = Array.from(patterns).reduce(addPattern, createRoot<T>());
  const b = buildPatterns(t);
  const s = toAsyncIterable(stream, delay);
  const r = findPatternsAsync(b, s);
  const a = await toArray(r);
  return a;
};
