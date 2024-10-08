import matter from 'gray-matter';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { cwd } from 'node:process';
import { parseIsoDateString } from './dateUtils';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

export type PostId = string & { _brand: 'postId' };

export type FrontMatter = {
  title: string;
  date: Date;
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

export type HomePagePost = Omit<Post, 'html'>;

export type ParsePostMatterResult =
  | { isValid: true; value: PostMatter }
  | { isValid: false; message: string };

export function parsePostMatter(fileContent: matter.Input): ParsePostMatterResult {
  const matterResult = matter(fileContent);

  const title = matterResult.data.title;
  const date = parseIsoDateString(matterResult.data.date);
  const description = matterResult.data.description;

  if (Number.isNaN(date.getTime())) {
    return {
      isValid: false,
      message: 'Front matter is missing "date" property or "date" is not a valid date.'
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
        date,
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

export function getSortedHomePagePosts(postsDirectory: string): HomePagePost[] {
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
    .sort((a, b) => b.frontMatter.date.getTime() - a.frontMatter.date.getTime());
}

const markdownProcessor = unified()
  .use(remarkParse)
  .use(remarkRehype, { allowDangerousHtml: false })
  .use(rehypeStringify);

export function getPost(postsDirectory: string, id: Post['id']): Post {
  const filename = `${id}.md`;
  const fileContent = readFileSync(join(postsDirectory, filename));
  const postMatterResult = parsePostMatter(fileContent);

  if (!postMatterResult.isValid) {
    throw new PostMatterError(filename, postMatterResult.message);
  }

  const html = String(markdownProcessor.processSync(postMatterResult.value.content));

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
