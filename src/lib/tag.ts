import { Result } from './types';

export type TagId = string & { _brand: 'tagId' };

export const tagId = (t: string) => t as TagId;

export function parseTags(tags: unknown): Result<TagId[]> {
  const maxTagLength = 15;
  if (!Array.isArray(tags)) {
    return {
      isValid: false,
      message: 'Not an array'
    };
  }

  for (const tag of tags) {
    if (typeof tag !== 'string') {
      return {
        isValid: false,
        message: `Tag "${tag}" is not a string`
      };
    }
    if (tag.trim() === '') {
      return {
        isValid: false,
        message: `Tag is empty`
      };
    }
    if (tag.length > maxTagLength) {
      return {
        isValid: false,
        message: `Tag "${tag}" is too long, max tag length is ${maxTagLength}`
      };
    }
  }

  return {
    isValid: true,
    value: tags
      .map((tag) => {
        const trimmedTag = tag.trim();
        return trimmedTag.charAt(0).toUpperCase() + trimmedTag.slice(1).toLowerCase();
      })
      .toSorted() as TagId[]
  };
}
