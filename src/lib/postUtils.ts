import matter from "gray-matter";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { cwd } from "node:process";
import { parseIsoDateString } from "./dateUtils";

export type PostId = string & { _brand: "postId" };

type FrontMatter = {
  title: string;
  date: Date;
  description: string;
};

type Post = {
  id: PostId;
  data: FrontMatter;
  content: unknown;
};

export function parsePostContent(fileContent: Buffer, filename: string) {
  const matterResult = matter(fileContent);

  const title = matterResult.data.title;
  const date = parseIsoDateString(matterResult.data.date);
  const description = matterResult.data.description;

  if (Number.isNaN(date.getTime())) {
    throw new Error(
      `${filename} front matter is missing "date" property or "date" is not a valid date.`
    );
  }

  if (typeof title !== "string") {
    throw new Error(
      `${filename} front matter is missing "title" property or "title" is not a string.`
    );
  }

  if (typeof description !== "string") {
    throw new Error(
      `${filename} front matter is missing "description" property or "description" is not a string.`
    );
  }

  return {
    ...matterResult,
    data: {
      title,
      date,
      description,
    },
  };
}

export function parsePostId(filename: string): PostId {
  return filename.replace(/\.md$/, "") as PostId;
}

const postsDirectory = join(cwd(), "src", "posts");
const postsFilenames = readdirSync(postsDirectory);
const postsContents = createPostMap();

function createPostMap() {
  return postsFilenames.reduce((posts, filename) => {
    const id = parsePostId(filename);
    const fileContent = readFileSync(join(postsDirectory, filename));
    const postContent = parsePostContent(fileContent, filename);
    return posts.set(id, {
      ...postContent,
      id,
    });
  }, new Map<Post["id"], Post>());
}

export function getPostIds() {
  return Array.from(postsContents.keys()).map((postId) => ({ id: postId }));
}

export function getPostsCompact() {
  return Array.from(postsContents.values())
    .map((val) => ({
      data: val.data,
      id: val.id,
    }))
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export function getPost(id: Post["id"]) {
  return postsContents.get(id);
}
