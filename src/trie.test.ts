import { createRoot, getChild, Root } from './trie';

describe('trie', () => {
  describe('createRoot', () => {
    it('should handle null root', () => {
      expect(createRoot()).toEqual({ path: '^' });
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
      expect(getChild({ path: '^', children: [] }, null)).toBeUndefined();
    });

    it('should be undefined if child doesnt exists', () => {
      expect(getChild({ path: '^', children: [{ token: 'b' }] }, 'a')).toBeUndefined();
    });

    it('should find child', () => {
      const child = { token: 'a' };
      expect(getChild({ path: '^', children: [child] }, 'a')).toBe(child);
    });
  });
});
