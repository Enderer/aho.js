import { Pattern } from '../';

export const toArray = async <T>(asyncIterable: AsyncIterable<T>): Promise<T[]> => {
  const arr = [];
  for await (const i of asyncIterable) arr.push(i);
  return arr;
};

export const toAsyncIterable = <T>(iterable: Iterable<T>, delay: number = 0) => ({
  [Symbol.asyncIterator] () {
    const iterator = iterable[Symbol.iterator]();
    return {
      async next (): Promise<IteratorResult<T>> {
        if (delay > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
        }
        return iterator.next();
      }
    };
  }
});

export const combinations = function * (max: number, start: number = 0): Iterable<Pattern<number>> {
  for (let s = start; s <= max; s++) {
    for (let e = s; e <= max; e++) {
      const pattern = [];
      for (let i = s; i <= e; i++) {
        pattern.push(i);
      }
      yield pattern;
    }
  }
};

export const sequence = function * (max: number, start: number = 0): Pattern<number> {
  for (let i = start; i <= max; i++) { yield i; }
};

export const patternSort = <T>(a: Pattern<T>, b: Pattern<T>) => {
  const ia = a[Symbol.iterator]();
  const ib = b[Symbol.iterator]();
  let na = ia.next();
  let nb = ib.next();
  while (!(na.done) || !(nb.done)) {
    if (na.done && !(nb.done)) { return -1; }
    if (!(na.done) && (nb.done)) { return 1; }
    if (na.value > nb.value) { return 1; }
    if (na.value < nb.value) { return -1; }
    na = ia.next();
    nb = ib.next();
  }
  return 0;
};

export const evens = function * (s = 0): Pattern<number> {
  while (true) { yield s += 2; }
};

export const powersOf = function * (b: number = 2, n: number = Infinity): Iterable<Pattern<number>> {
  for (let p = 1; p < n; p++) {
    yield [b ** p, (b ** p) + 2];
  }
};
