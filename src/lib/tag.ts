import { Result } from './types';

export type TagId = string & { _brand: 'tagId' };

export const tagId = (t: string) => t as TagId;

export type Tag = {
  name: string;
  id: TagId;
};

/**
 * Normalizes a tag name to an ID.
 * e.g., "Next.js" -> "next-js", "TypeScript" -> "typescript"
 */
export function normalizeTagNameToId(name: string): TagId {
  return tagId(
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '-') // Replace non-alphanumeric/non-space with hyphen
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Collapse multiple hyphens
      .replace(/^-+|-+$/g, '') // Trim hyphens from ends
  );
}

export function parseTags(tags: unknown): Result<Tag[]> {
  const maxTagLength = 15;
  if (!Array.isArray(tags)) {
    return {
      isValid: false,
      message: 'Not an array'
    };
  }

  const processedTags: Tag[] = [];

  for (const tag of tags) {
    if (typeof tag !== 'string') {
      return {
        isValid: false,
        message: `Tag "${tag}" is not a string`
      };
    }

    if (tag.length > maxTagLength) {
      return {
        isValid: false,
        message: `Tag "${tag}" is too long, max tag length is ${maxTagLength}`
      };
    }

    const trimmedTag = tag.trim();

    if (trimmedTag === '') {
      return {
        isValid: false,
        message: 'Tag is empty'
      };
    }

    const id = normalizeTagNameToId(trimmedTag);
    if (id === '') {
      return {
        isValid: false,
        message: `Tag "${tag}" results in an empty ID`
      };
    }

    processedTags.push({
      name: trimmedTag,
      id
    });
  }

  return {
    isValid: true,
    value: processedTags.toSorted((a, b) => a.name.localeCompare(b.name))
  };
}
