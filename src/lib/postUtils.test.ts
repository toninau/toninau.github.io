import { describe, test, expect, vi, beforeEach, assert } from 'vitest';
import {
  FrontMatter,
  getPostIds,
  getSortedHomePagePosts,
  parsePostMatter,
  ParsePostMatterResult,
  PostMatterError
} from './postUtils';
import { vol } from 'memfs';
import { formatIsoDate } from './dateUtils';

function createPost(frontMatter: Partial<FrontMatter>, content: string) {
  const markdownFrontMatter = {
    date: frontMatter.date ? `'${formatIsoDate(frontMatter.date)}'` : null,
    title: frontMatter.title ? `'${frontMatter.title}'` : null,
    description: frontMatter.description ? `'${frontMatter.description}'` : null
  } satisfies Record<keyof FrontMatter, unknown>;

  const markdownFrontMatterString = Object.entries(markdownFrontMatter)
    .flatMap(([k, v]) => (v ? `${k}: ${v}` : []))
    .join('\n');

  return `---
${markdownFrontMatterString}
---
${content}`.trim();
}

// tell vitest to use fs mock from __mocks__ folder
vi.mock('node:fs');

beforeEach(() => {
  // reset the state of in-memory fs
  vol.reset();
});

describe('postUtils', () => {
  describe('parsePostMatter', () => {
    test('parsing valid post works', () => {
      const validMatter: ParsePostMatterResult = {
        isValid: true,
        value: {
          content: 'This is content',
          frontMatter: {
            title: 'Front Matter Test',
            date: new Date(2024, 8, 29),
            description: 'Front Matter Description'
          }
        }
      };
      const post = createPost(validMatter.value.frontMatter, validMatter.value.content);

      expect(parsePostMatter(post)).toEqual(validMatter);
    });

    test('matter is invalid when date is missing', () => {
      const post = createPost({ title: 'test', description: 'test' }, 'This is content');

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "date" property or "date" is not a valid date.'
      };

      expect(parsePostMatter(post)).toEqual(invalidMatter);
    });

    test('matter is invalid when title is missing', () => {
      const post = createPost(
        { date: new Date(2020, 0, 1), description: 'test' },
        'This is content'
      );

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "title" property or "title" is not a string.'
      };

      expect(parsePostMatter(post)).toEqual(invalidMatter);
    });

    test('matter is invalid when description is missing', () => {
      const post = createPost({ date: new Date(2020, 0, 1), title: 'test' }, 'This is content');
      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "description" property or "description" is not a string.'
      };

      expect(parsePostMatter(post)).toEqual(invalidMatter);
    });
  });

  describe('getPostIds', () => {
    test('returns post ids', () => {
      const directory = '/tmp';

      const frontMatter = {
        date: new Date(2020, 0, 1),
        description: 'This is a test description',
        title: 'This is a test post'
      };

      vol.fromJSON(
        {
          [`./test-post-one.md`]: createPost(frontMatter, 'This is content'),
          [`./test-post-two.md`]: createPost(frontMatter, 'This is content')
        },
        directory
      );

      const postIds = getPostIds(directory);

      expect(postIds).toEqual([{ id: 'test-post-one' }, { id: 'test-post-two' }]);
    });
  });

  describe('getSortedHomePagePosts', () => {
    test('returns home page posts sorted by date', () => {
      const directory = '/tmp';

      const newerPost = {
        id: 'test-post-two',
        frontMatter: {
          date: new Date(2020, 0, 2),
          description: 'This is a test description',
          title: 'This is a test post'
        }
      };

      const olderPost = {
        id: 'test-post-one',
        frontMatter: {
          date: new Date(2020, 0, 1),
          description: 'This is a test description',
          title: 'This is a test post'
        }
      };

      vol.fromJSON(
        {
          [`./${olderPost.id}.md`]: createPost({ ...olderPost.frontMatter }, 'This is content'),
          [`./${newerPost.id}.md`]: createPost({ ...newerPost.frontMatter }, 'This is content')
        },
        directory
      );

      const [post1, post2] = getSortedHomePagePosts(directory);

      expect(post1).toEqual(newerPost);
      expect(post2).toEqual(olderPost);
      expect(post1.frontMatter.date.getTime() > post2.frontMatter.date.getTime()).toBeTruthy();
    });

    test('throws PostMatterError when front matter is not valid', () => {
      const directory = '/tmp';
      const filename = 'super-awesome-blog.md';
      vol.fromJSON(
        {
          [`./${filename}`]: createPost({}, 'This is content')
        },
        directory
      );

      assert.throws(
        () => getSortedHomePagePosts(directory),
        PostMatterError,
        `Content in ${filename} is invalid.`
      );
    });
  });
});
