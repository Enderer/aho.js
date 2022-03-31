import { addPattern, buildPatterns, findPatternsAsync, createRoot } from '../src';
import { powersOf, toAsyncIterable, evens } from '../src/__tests__/utils';

/**
 * Look for patterns in an asynchronously generated series of even numbers
 */
(async () => {
  const patterns = Array.from(powersOf(2, 50));
  const root = patterns.reduce(addPattern, createRoot<number>());
  const built = buildPatterns(root);

  const stream = toAsyncIterable(evens(), 1000);
  const matches = findPatternsAsync(built, stream);

  for await (const m of matches) {
    console.log(`${new Date().toLocaleString()} ${JSON.stringify(m)}`);
  }
})();
