import { join } from 'node:path';
import { cwd } from 'node:process';
import { describe, test, expect, assert } from 'vitest';
import {
  FrontMatter,
  getPost,
  getPostIds,
  getSortedFrontPagePosts,
  parsePostId,
  parsePostMatter,
  ParsePostMatterResult,
  PostMatterError
} from './post';
import { formatIsoDate } from './date';

function createPostMarkdown(frontMatter: Partial<FrontMatter>, content: string) {
  const markdownFrontMatter = {
    title: frontMatter.title ? `'${frontMatter.title}'` : null,
    published: frontMatter.published ? `'${formatIsoDate(frontMatter.published)}'` : null,
    updated: frontMatter.updated ? `'${formatIsoDate(frontMatter.updated)}'` : null,
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

const testPostsDirectory = join(cwd(), 'src', 'lib', 'test', 'posts');
const testBrokenPostsDirectory = join(cwd(), 'src', 'lib', 'test', 'broken_posts');

describe('post', () => {
  describe('parsePostMatter', () => {
    test('parsing valid post works', () => {
      const validMatter: ParsePostMatterResult = {
        isValid: true,
        value: {
          content: 'This is content',
          frontMatter: {
            title: 'Front Matter Test',
            published: new Date(2024, 8, 29),
            updated: null,
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

    test('matter is invalid when updated property is invalid', () => {
      const postMarkdown =
        "---\ntitle: 'test'\ndescription: 'test'\npublished: '2020-01-01'\nupdated: 'AAAA-AA-AA'\n---";

      const invalidMatter: ParsePostMatterResult = {
        isValid: false,
        message: 'Front matter property "updated" is not a valid date.'
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
      const postIds = getPostIds(testPostsDirectory);

      expect(postIds).toEqual([{ id: 'test-post-one' }, { id: 'test-post-two' }]);
    });
  });

  describe('getSortedFrontPagePosts', () => {
    test('returns front page posts sorted by date', () => {
      const [newerPost, olderPost] = getSortedFrontPagePosts(testPostsDirectory);

      expect(
        newerPost.frontMatter.published.getTime() > olderPost.frontMatter.published.getTime()
      ).toBeTruthy();
    });

    test('throws PostMatterError when front matter is not valid', () => {
      assert.throws(
        () => getSortedFrontPagePosts(testBrokenPostsDirectory),
        PostMatterError,
        'Content in broken-post-one.md is invalid. Front matter is missing "published" property or "published" is not a valid date.'
      );
    });
  });

  describe('getPost', () => {
    test('returns post matter and html content', async () => {
      const expectedFrontMatter = {
        published: new Date(2020, 0, 1),
        description: 'This is a test description',
        title: 'This is a test post',
        updated: null
      };

      const post = await getPost(testPostsDirectory, parsePostId('test-post-one.md'));

      expect(post.frontMatter).toEqual(expectedFrontMatter);
      // https://vitest.dev/guide/snapshot#file-snapshots
      // use the --update or -u flag in the CLI to make Vitest update snapshots (`vitest -u`).
      await expect(post.html).toMatchFileSnapshot('./test/test-post-one.output.html');
    });

    test('throws PostMatterError when front matter is not valid', () => {
      expect(async () => {
        await getPost(testBrokenPostsDirectory, parsePostId('broken-post-one.md'));
      }).rejects.toThrow(
        'Content in broken-post-one.md is invalid. Front matter is missing "published" property or "published" is not a valid date.'
      );
    });
  });
});
