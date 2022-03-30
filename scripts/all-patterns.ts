import { addPattern, buildPatterns, createRoot, findPatterns } from '../src';
import { combinations, sequence } from '../src/__tests__/utils';

/** 
 * Generate all possible patterns and find them
 * [1] [1,2] [1,2,3] ... [997,998,999] [998,999] [999]
 */
(() => {
  const max = 1000;
  const patterns = combinations(max);
  const root = createRoot<number>();
  for (const p of patterns) { addPattern(root, p); }
  const built = buildPatterns(root);
  const matches = findPatterns(built, sequence(max));
  for (const m of matches) { 
    console.log(JSON.stringify(m)); 
  }
})();
