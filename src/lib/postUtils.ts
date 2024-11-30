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

import { parseIsoDateString } from './dateUtils';

export type PostId = string & { _brand: 'postId' };

export type FrontMatter = {
  title: string;
  published: Date;
  updated: Date | null;
  description: string;
};

export type PostMatter = {
  frontMatter: FrontMatter;
  content: string;
};

export type Post = {
  frontMatter: FrontMatter;
  html: string;
  id: PostId;
};

export type FrontPagePost = Omit<Post, 'html'>;

export type ParsePostMatterResult =
  | { isValid: true; value: PostMatter }
  | { isValid: false; message: string };

export function parsePostMatter(fileContent: matter.Input): ParsePostMatterResult {
  const matterResult = matter(fileContent);

  const title = matterResult.data.title;
  const published = parseIsoDateString(matterResult.data.published);
  const updated = matterResult.data.updated ? parseIsoDateString(matterResult.data.updated) : null;
  const description = matterResult.data.description;

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

  return {
    isValid: true,
    value: {
      content: matterResult.content,
      frontMatter: {
        title,
        published,
        updated,
        description
      }
    }
  };
}

export function parsePostId(filename: string): PostId {
  return filename.replace(/\.md$/, '') as PostId;
}

export const postsDirectory = join(cwd(), 'src', 'posts');

export function getPostIds(postsDirectory: string): { id: PostId }[] {
  return readdirSync(postsDirectory).map((filename) => ({
    id: parsePostId(filename)
  }));
}

export function getSortedFrontPagePosts(postsDirectory: string): FrontPagePost[] {
  return readdirSync(postsDirectory)
    .map((filename) => {
      const id = parsePostId(filename);
      const fileContent = readFileSync(join(postsDirectory, filename));
      const postMatterResult = parsePostMatter(fileContent);

      if (!postMatterResult.isValid) {
        throw new PostMatterError(filename, postMatterResult.message);
      }

      return {
        id,
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
    theme: 'kanagawa-wave'
  })
  .use(rehypeStringify);

export async function getPost(postsDirectory: string, id: Post['id']): Promise<Post> {
  const filename = `${id}.md`;
  const fileContent = readFileSync(join(postsDirectory, filename));
  const postMatterResult = parsePostMatter(fileContent);

  if (!postMatterResult.isValid) {
    throw new PostMatterError(filename, postMatterResult.message);
  }

  const html = String(await markdownProcessor.process(postMatterResult.value.content));

  return {
    ...postMatterResult.value,
    html,
    id
  };
}

export class PostMatterError extends Error {
  constructor(filename: string, message: string) {
    super(`Content in ${filename} is invalid. ${message}`);
  }
}
