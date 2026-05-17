import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';

import matter from 'gray-matter';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypePrettyCode from 'rehype-pretty-code';

import { parseIsoDateString } from './date';
import { parseTags, TagId } from './tag';
import { Result } from './types';

export type PostId = string & { _brand: 'postId' };

export type FrontMatter = {
  title: string;
  published: Date;
  updated: Date | null;
  description: string;
  tags: TagId[];
};

export type PostMatter = {
  frontMatter: FrontMatter;
  content: string;
};

export type Post = {
  frontMatter: FrontMatter;
  html: string;
  postId: PostId;
};

export type HomePagePost = Omit<Post, 'html'>;

export function parsePostMatter(fileContent: matter.Input): Result<PostMatter> {
  const matterResult = matter(fileContent);

  const title = matterResult.data.title;
  const published = parseIsoDateString(matterResult.data.published);
  const updated = matterResult.data.updated ? parseIsoDateString(matterResult.data.updated) : null;
  const description = matterResult.data.description;
  const tagsResult = parseTags(matterResult.data.tags);

  if (Number.isNaN(published.getTime())) {
    return {
      isValid: false,
      message: 'Front matter is missing "published" property or "published" is not a valid date.'
    };
  }

  if (updated !== null && Number.isNaN(updated.getTime())) {
    return {
      isValid: false,
      message: 'Front matter property "updated" is not a valid date.'
    };
  }

  if (typeof title !== 'string') {
    return {
      isValid: false,
      message: 'Front matter is missing "title" property or "title" is not a string.'
    };
  }

  if (typeof description !== 'string') {
    return {
      isValid: false,
      message: 'Front matter is missing "description" property or "description" is not a string.'
    };
  }

  if (!tagsResult.isValid) {
    return {
      isValid: false,
      message: `Front matter property "tags" is not valid: "${tagsResult.message}".`
    };
  }

  return {
    isValid: true,
    value: {
      content: matterResult.content,
      frontMatter: {
        title,
        published,
        updated,
        description,
        tags: tagsResult.value
      }
    }
  };
}

export function parsePostId(filename: string): PostId {
  return filename.replace(/\.md$/, '') as PostId;
}

export const postsDirectory = join(cwd(), 'src', 'posts');

export function getPostIds(postsDirectory: string): { postId: PostId }[] {
  return readdirSync(postsDirectory).map((filename) => ({
    postId: parsePostId(filename)
  }));
}

export function getSortedHomePagePosts(postsDirectory: string): HomePagePost[] {
  return readdirSync(postsDirectory)
    .map((filename) => {
      const postId = parsePostId(filename);
      const fileContent = readFileSync(join(postsDirectory, filename));
      const postMatterResult = parsePostMatter(fileContent);

      if (!postMatterResult.isValid) {
        throw new PostMatterError(filename, postMatterResult.message);
      }

      return {
        postId,
        frontMatter: postMatterResult.value.frontMatter
      };
    })
    .sort((a, b) => b.frontMatter.published.getTime() - a.frontMatter.published.getTime());
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeSlug)
  .use(rehypeAutolinkHeadings, {
    behavior: 'wrap',
    properties: { className: 'heading-link' }
  })
  .use(rehypePrettyCode, {
    theme: 'everforest-dark'
  })
  .use(rehypeStringify);

export async function getPost(postsDirectory: string, postId: PostId): Promise<Post> {
  const filename = `${postId}.md`;
  const fileContent = readFileSync(join(postsDirectory, filename));
  const postMatterResult = parsePostMatter(fileContent);

  if (!postMatterResult.isValid) {
    throw new PostMatterError(filename, postMatterResult.message);
  }

  const html = String(await markdownProcessor.process(postMatterResult.value.content));

  return {
    frontMatter: postMatterResult.value.frontMatter,
    html,
    postId
  };
}

export class PostMatterError extends Error {
  constructor(filename: string, message: string) {
    super(`Content in ${filename} is invalid. ${message}`);
  }
}
