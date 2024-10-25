import { describe, test, expect, vi, beforeEach, assert } from 'vitest';
import {
  FrontMatter,
  getPostIds,
  getSortedFrontPagePosts,
  parsePostMatter,
  ParsePostMatterResult,
  PostMatterError
} from './postUtils';
import { vol } from 'memfs';
import { formatIsoDate } from './dateUtils';

function createPostMarkdown(frontMatter: Partial<FrontMatter>, content: string) {
  const markdownFrontMatter = {
    title: frontMatter.title ? `'${frontMatter.title}'` : null,
    published: frontMatter.published ? `'${formatIsoDate(frontMatter.published)}'` : null,
    modified: frontMatter.modified ? `'${formatIsoDate(frontMatter.modified)}'` : null,
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
            published: new Date(2024, 8, 29),
            modified: null,
            description: 'Front Matter Description'
          }
        }
      };
      const postMarkdown = createPostMarkdown(
        validMatter.value.frontMatter,
        validMatter.value.content
      );

      expect(parsePostMatter(postMarkdown)).toEqual(validMatter);
    });

    test('matter is invalid when published property is missing', () => {
      const postMarkdown = createPostMarkdown(
        { title: 'test', description: 'test' },
        'This is content'
      );

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "published" property or "published" is not a valid date.'
      };

      expect(parsePostMatter(postMarkdown)).toEqual(invalidMatter);
    });

    test('matter is invalid when published property is invalid', () => {
      const postMarkdown = "---\ntitle: 'test'\ndescription: 'test'\npublished: 'AAAA-AA-AA'\n---";

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "published" property or "published" is not a valid date.'
      };

      expect(parsePostMatter(postMarkdown)).toEqual(invalidMatter);
    });

    test('matter is invalid when modified property is invalid', () => {
      const postMarkdown =
        "---\ntitle: 'test'\ndescription: 'test'\npublished: '2020-01-01'\nmodified: 'AAAA-AA-AA'\n---";

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter property "modified" is not a valid date.'
      };

      expect(parsePostMatter(postMarkdown)).toEqual(invalidMatter);
    });

    test('matter is invalid when title is missing', () => {
      const postMarkdown = createPostMarkdown(
        { published: new Date(2020, 0, 1), description: 'test' },
        'This is content'
      );

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "title" property or "title" is not a string.'
      };

      expect(parsePostMatter(postMarkdown)).toEqual(invalidMatter);
    });

    test('matter is invalid when description is missing', () => {
      const postMarkdown = createPostMarkdown(
        { published: new Date(2020, 0, 1), title: 'test' },
        'This is content'
      );
      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter is missing "description" property or "description" is not a string.'
      };

      expect(parsePostMatter(postMarkdown)).toEqual(invalidMatter);
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
          [`./test-post-one.md`]: createPostMarkdown(frontMatter, 'This is content'),
          [`./test-post-two.md`]: createPostMarkdown(frontMatter, 'This is content')
        },
        directory
      );

      const postIds = getPostIds(directory);

      expect(postIds).toEqual([{ id: 'test-post-one' }, { id: 'test-post-two' }]);
    });
  });

  describe('getSortedFrontPagePosts', () => {
    test('returns front page posts sorted by date', () => {
      const directory = '/tmp';

      const newerPost = {
        id: 'test-post-two',
        frontMatter: {
          published: new Date(2020, 0, 2),
          modified: null,
          description: 'This is a test description',
          title: 'This is a test post'
        }
      };

      const olderPost = {
        id: 'test-post-one',
        frontMatter: {
          published: new Date(2020, 0, 1),
          modified: null,
          description: 'This is a test description',
          title: 'This is a test post'
        }
      };

      vol.fromJSON(
        {
          [`./${olderPost.id}.md`]: createPostMarkdown(
            { ...olderPost.frontMatter },
            'This is content'
          ),
          [`./${newerPost.id}.md`]: createPostMarkdown(
            { ...newerPost.frontMatter },
            'This is content'
          )
        },
        directory
      );

      const [post1, post2] = getSortedFrontPagePosts(directory);

      expect(post1).toEqual(newerPost);
      expect(post2).toEqual(olderPost);
      expect(
        post1.frontMatter.published.getTime() > post2.frontMatter.published.getTime()
      ).toBeTruthy();
    });

    test('throws PostMatterError when front matter is not valid', () => {
      const directory = '/tmp';
      const filename = 'super-awesome-blog.md';
      vol.fromJSON(
        {
          [`./${filename}`]: createPostMarkdown({}, 'This is content')
        },
        directory
      );

      assert.throws(
        () => getSortedFrontPagePosts(directory),
        PostMatterError,
        `Content in ${filename} is invalid.`
      );
    });
  });
});
