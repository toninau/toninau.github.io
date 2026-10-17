import { describe, test, expect } from 'vitest';
import { parseTags, normalizeTagNameToId } from './tag';

describe('tag', () => {
  describe('normalizeTagNameToId', () => {
    test('converts names to slug-like IDs', () => {
      expect(normalizeTagNameToId('Next.js')).toBe('next-js');
      expect(normalizeTagNameToId('TypeScript')).toBe('typescript');
      expect(normalizeTagNameToId('  Space Test  ')).toBe('space-test');
    });

    test('handles special characters and multiple spaces', () => {
      expect(normalizeTagNameToId('Hello... World!!!')).toBe('hello-world');
      expect(normalizeTagNameToId('Multiple---Hyphens---')).toBe('multiple-hyphens');
      expect(normalizeTagNameToId('  Leading and Trailing  ')).toBe('leading-and-trailing');
    });

    test('handles empty strings or only special characters', () => {
      // Since the regex replaces non-alphanumeric with hyphens and trims them,
      // a string of just symbols results in an empty string.
      expect(normalizeTagNameToId('!!!')).toBe('');
    });
  });

  describe('parseTags', () => {
    test('returns invalid for non-array input', () => {
      expect(parseTags('string')).toEqual({
        isValid: false,
        message: 'Not an array'
      });
      expect(parseTags(123)).toEqual({
        isValid: false,
        message: 'Not an array'
      });
      expect(parseTags(null)).toEqual({
        isValid: false,
        message: 'Not an array'
      });
      expect(parseTags(undefined)).toEqual({
        isValid: false,
        message: 'Not an array'
      });
    });

    test('returns valid for empty array', () => {
      expect(parseTags([])).toEqual({
        isValid: true,
        value: []
      });
    });

    test('returns invalid for non-string items', () => {
      expect(parseTags(['valid', 123])).toEqual({
        isValid: false,
        message: 'Tag "123" is not a string'
      });
      expect(parseTags([null])).toEqual({
        isValid: false,
        message: 'Tag "null" is not a string'
      });
    });

    test('returns invalid for empty strings', () => {
      expect(parseTags([''])).toEqual({
        isValid: false,
        message: 'Tag is empty'
      });
      expect(parseTags(['valid', ''])).toEqual({
        isValid: false,
        message: 'Tag is empty'
      });
    });

    test('returns invalid for whitespace-only strings', () => {
      expect(parseTags(['   '])).toEqual({
        isValid: false,
        message: 'Tag is empty'
      });
    });

    test('returns invalid for strings exceeding max length', () => {
      const longTag = 'a'.repeat(16);
      expect(parseTags([longTag])).toEqual({
        isValid: false,
        message: `Tag "${longTag}" is too long, max tag length is 15`
      });
    });

    test('returns invalid if the normalized ID is empty (e.g. symbols only)', () => {
      const result = parseTags(['!!!']);
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.message).toBe('Tag "!!!" results in an empty ID');
      }

      const result2 = parseTags(['---']);
      expect(result2.isValid).toBe(false);
      if (!result2.isValid) {
        expect(result2.message).toBe('Tag "---" results in an empty ID');
      }
    });

    test('returns valid and maps to Tag objects', () => {
      const input = ['Next.js', 'TypeScript'];
      const result = parseTags(input);

      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.value).toEqual([
          { name: 'Next.js', id: 'next-js' },
          { name: 'TypeScript', id: 'typescript' }
        ]);
      }
    });

    test('preserves original casing in name but normalizes the id', () => {
      const input = ['  UPPER  ', 'mixedCase'];
      const result = parseTags(input);

      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.value).toEqual([
          { name: 'mixedCase', id: 'mixedcase' },
          { name: 'UPPER', id: 'upper' }
        ]);
      }
    });

    test('sorts valid tags alphabetically by the name property', () => {
      // Note: localeCompare order can vary slightly by environment,
      // but standard alphabetical usually puts A-Z first.
      const input = ['zebra', 'apple', 'mango'];
      const result = parseTags(input);

      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.value[0].name).toBe('apple');
        expect(result.value[1].name).toBe('mango');
        expect(result.value[2].name).toBe('zebra');
      }
    });
  });
});
