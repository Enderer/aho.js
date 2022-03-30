import { createRoot, getChild, Root } from './trie';

describe('trie', () => {
  describe('createRoot', () => {
    it('should handle null root', () => {
      expect(createRoot()).toEqual({ path: '^', depth: 0 });
    });
  });

  describe('getChild', () => {
    it('should handle null root', () => {
      expect(getChild(null as unknown as Root, 't')).toBeUndefined();
    });

    it('should handle null token', () => {
      expect(getChild(createRoot(), null)).toBeUndefined();
    });

    it('should handle empty children', () => {
      expect(getChild({ path: '^', depth: 10, children: [] }, null)).toBeUndefined();
    });

    it('should be undefined if child doesnt exists', () => {
      expect(getChild({ path: '^', depth: 0, children: [{ token: 'b', depth: 1 }] }, 'a')).toBeUndefined();
    });

    it('should find child', () => {
      const child = { token: 'a', depth: 1 };
      expect(getChild({ path: '^', children: [child], depth: 0 }, 'a')).toBe(child);
    });
  });
});
