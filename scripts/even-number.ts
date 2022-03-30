import { addPattern, buildPatterns, findPatterns, Pattern, createRoot } from '../src';

/**
 * Look for patterns in an infinite series of even numbers
 * [[2,4], [16,18], ..., [[536870912,536870914]]]  // patterns
 * [2, 4, 6, 8, ...]  // series
 */
(() => {
  const evens = function * (s: number = 0) { 
    while (true) { yield s += 2; } 
  };

  const patterns = function * (n: number, b: number): Iterable<Pattern<number>> {
    for (let p = 1; p < n; p++) { 
      yield [b ** p, (b ** p) + 2];
    }
  };

  const r = Array.from(patterns(50, 2)).reduce(addPattern, createRoot<number>());
  const b = buildPatterns(r);
  const matches = findPatterns(b, evens());
  for (const m of matches) { 
    console.log(`${new Date().toLocaleString()} ${JSON.stringify(m)}`); 
  }
})();
