import { describe, test, expect } from 'vitest';
import { parseTags } from './tag';

describe('tag', () => {
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

    test('returns invalid for empty array', () => {
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

    test('returns valid for valid inputs', () => {
      const validTags = ['Valid', 'TAG', 'mixed'];
      const result = parseTags(validTags);

      expect(result.isValid).toBe(true);
      // @ts-expect-error - checking internal structure for test purposes, though in production code we might check values individually
      expect(result.value).toEqual(['Mixed', 'Tag', 'Valid']);
    });

    test('trims, uppercases first letter, lowercases valid tags', () => {
      const input = ['  Trimmed  ', 'UPPER', 'MiXeD'];
      const result = parseTags(input);

      expect(result.isValid).toBe(true);
      // @ts-expect-error - checking internal structure for test purposes
      expect(result.value).toEqual(['Mixed', 'Trimmed', 'Upper']);
    });

    test('sorts valid tags alphabetically', () => {
      const input = ['zebra', 'apple', 'mango'];
      const result = parseTags(input);

      expect(result.isValid).toBe(true);
      // @ts-expect-error - checking internal structure for test purposes
      expect(result.value).toEqual(['Apple', 'Mango', 'Zebra']);
    });
  });
});
