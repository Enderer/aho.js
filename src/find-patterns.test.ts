import { addPattern, Pattern } from './add-pattern';
import { buildPatterns } from './build-patterns';
import { findPatterns, findPatternsAsync } from './find-patterns';
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
      )).toEqual(['she', 'he', 'hers']);
    });

    it('should find tokens', () => {
      expect(find(
        [['one', 'two', 'three'], ['four', 'five', 'six']],
        ['zero', 'one', 'two', 'three', 'four']
      )).toEqual([['one', 'two', 'three']]);
    });

    it('should find numbers', () => {
      expect(find(
        [[0, 2, 1, 3, 2], [4, 4, 1, 4, 3]],
        [1, 2, 3, 4, 4, 1, 4, 3, 5, 1, 2, 3]
      )).toEqual([[4, 4, 1, 4, 3]]);
    });
  });

  describe('findPatternsAsync', () => {
    it('should find patterns', async () => {
      const p = await findAsync(['he', 'she', 'his', 'hers'], 'ushers', 100);
      expect(p).toEqual(['she', 'he', 'hers']);
    });
  });
});

const find = <T>(patterns: Iterable<Pattern<T>>, stream: Pattern<T>): Pattern<T>[] => {
  const t = Array.from(patterns).reduce((r, p) => addPattern(r, p), createRoot<T>());
  const b = buildPatterns(t);
  const r = findPatterns(b, stream);
  return Array.from(r);
};

const findAsync = async <T>(patterns: Iterable<Pattern<T>>, stream: Pattern<T>, delay: number = 0): Promise<Pattern<T>[]> => {
  const t = Array.from(patterns).reduce((r, p) => addPattern(r, p), createRoot<T>());
  const b = buildPatterns(t);
  const s = toAsyncIterable(stream, delay);
  const r = findPatternsAsync(b, s);
  const a = await toArray(r);
  return a;
};

const toArray = async <T>(asyncIterable: AsyncIterable<T>): Promise<T[]> => { 
  const arr = []; 
  for await(const i of asyncIterable) arr.push(i); 
  return arr;
}

const toAsyncIterable = <T>(iterable: Iterable<T>, delay: number = 0) => ({
  [Symbol.asyncIterator]() {
    const iterator = iterable[Symbol.iterator]();
    return {
      async next(): Promise<IteratorResult<T>> {
        if (delay > 0) { 
          await new Promise(resolve => setTimeout(resolve, delay)); 
        }

        return iterator.next();
        // if (this.current <= this.last) {
        //   return { done: false, value: this.current++ };
        // } else {
        //   return { done: true };
        // }
      }
    };
  }
});
