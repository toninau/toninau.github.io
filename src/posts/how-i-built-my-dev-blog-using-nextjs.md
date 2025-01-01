---
title: 'How I built my dev blog using Next.js'
published: '2025-01-01'
description: 'Building a dev blog using Next.js App Router.'
---

So, for a while now I've wanted to try out blogging (mainly for practice), and because I'm a software engineer, I opted to build my own dev blog instead of using some already existing blogging platform.

There were a couple of things I especially wanted from the blog site I was about to build:

1. I want hosting to be completely **free**.
2. I want to be able to write blog posts using **Markdown**, and maybe switch to `mdx` in the future.

For hosting, **GitHub Pages** seemed to be the most obvious option. It's free, but it's only for static site hosting, which isn't really a problem for a simple blog site, though it does impose some limitations on what can be done and how.

Another thing that I also wanted was to build the site using **React**, mainly because I like using it. Since GitHub Pages is only for static site hosting, building a static site with **Next.js** using _static site generation_ felt like a good option. This means that individual blog pages (HTML files) can be generated from the Markdown posts during the build process.

## Initializing Next.js project

The easiest way to get started with Next.js is to initialize the project using `create-next-app`:

```console
npx create-next-app@latest
```

Once the project has been initialized, _static export_ needs to enabled by changing the output mode to `export` in `next.config.js`:

```js {3}
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export'
};

export default nextConfig;
```

This will enable Next.js to generate a static site, which is required for GitHub Pages.

## Adding blog posts

Since I wanted to keep things simple, I decided to just create a directory called `/posts` where I will add blog posts as individual Markdown files:

```console
foo@bar:~/blog-app$ mkdir posts
foo@bar:~/blog-app$ echo "Hello world!" > posts/hello-world.md
```

This way, when parsing the Markdown posts, they can be read directly from the `/posts` directory instead of calling some external service that holds the posts.

Also, it's pretty simple workflow wise. Whenever I want to add a new post, I just need to add a new file to that directory, edit it, and push it to version control when it's done.

As a side note, the location of the `/posts` directory won't matter too much, except if it's created within a `/public` directory. In that case, the raw Markdown files will also be served as is. This is something I won't need.

### Metadata

In addition to the actual text content, blog posts typically have metadata associated with them, such as title or when they were first published. This can be achieved by adding a YAML front matter block at the top of the Markdown file. Here's a basic example:

```markdown
---
title: 'Hello world!'
published: '2025-01-01'
description: 'First test post...'
---

Hello world!
```

## Transforming Markdown into HTML

Transforming Markdown into HTML can be straightforward with Next.js. The `@next/mdx` and related packages can be used to create pages directly from Markdown files in the `/app` directory. The [Next.js documentation](https://nextjs.org/docs/app/building-your-application/configuring/mdx) covers this in more detail.

However, I ended up not using that method, and instead opted to create my own functions for generating blog post pages, which will hopefully allow me to switch frameworks more easily in the future if the need arises.

There are a couple functions that are essential for generating a blog post page:

```ts
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

// returns all the post ids (filenames from posts directory)
export function getPostIds(postsDirectory: string): { postId: PostId }[] {
  return readdirSync(postsDirectory).map((filename) => ({
    postId: parsePostId(filename)
  }));
}

// returns blog post front matter data and markdown content as html
export async function getPost(
  postsDirectory: string,
  postId: PostId
): Promise<Post> {
  const filename = `${postId}.md`;
  const fileContent = readFileSync(join(postsDirectory, filename));
  // validates front matter, and returns front matter and markdown content
  // uses `gray-matter` to parse front matter
  const postMatterResult = parsePostMatter(fileContent);

  if (!postMatterResult.isValid) {
    throw new PostMatterError(filename, postMatterResult.message);
  }

  // transforms markdown into HTML using remark
  const html = String(
    await markdownProcessor.process(postMatterResult.value.content)
  );

  return {
    frontMatter: postMatterResult.value.frontMatter,
    html,
    postId
  };
}
```

## Creating pages from blog posts

To generate individual routes/pages at build time from the Markdown files, a _dynamic segment_ needs to be created by adding a `page.tsx` file in the `/app/posts/[postId]/` subdirectory.

The `/app` directory structure will look like this:

```console
app
|
+-- layout.tsx
+-- page.tsx
+-- posts/[postId]
    |
    +-- page.tsx
```

Since the pages are going to be prerendered at build time, a `generateStaticParams` function is needed to statically generate the routes. This function will use the previously defined `getPostIds` function to generate the routes. The `page.tsx` file also needs to contain the actual React component that is rendered, which uses the `getPost` function to retrieve post-specific front matter data and Markdown content as HTML, and optionally a `generateMetadata` function to add route-specific metadata:

```tsx
import { getPost, getPostIds, PostId, postsDirectory } from '@/lib/post';
import DateText from '@/components/DateText';

type PostPageProps = {
  params: Promise<{ postId: PostId }>;
};

export async function generateStaticParams() {
  return getPostIds(postsDirectory);
}

export async function generateMetadata(props: PostPageProps) {
  const params = await props.params;
  const post = await getPost(postsDirectory, params.postId);
  return {
    title: post?.frontMatter.title,
    description: post?.frontMatter.description
  };
}

export default async function PostPage(props: PostPageProps) {
  const params = await props.params;
  const post = await getPost(postsDirectory, params.postId);

  return (
    <article>
      <header>
        <h1>{post.frontMatter.title}</h1>
        <dl>
          <dt>Published</dt>
          <dd>
            <DateText date={post.frontMatter.published} />
          </dd>
        </dl>
      </header>
      <section dangerouslySetInnerHTML={{ __html: post.html }}></section>
    </article>
  );
}
```

Now when the app is run with `npm run dev`, the first blog post created earlier should be accessible at `http://localhost:3000/posts/hello-world`.

At this point, the index/front page (`/app/page.tsx`) should also be edited to include links to all available blog posts:

```tsx
import { getSortedFrontPagePosts, postsDirectory } from '@/lib/post';
import DateText from '@/components/DateText';
import Link from '@/components/Link';

export default function FrontPage() {
  // returns postId and front matter for all the posts
  const frontPagePosts = getSortedFrontPagePosts(postsDirectory);

  return (
    <article>
      <h1>Posts</h1>
      {frontPagePosts.map((post) => (
        <article key={post.postId}>
          <h2>
            <Link>{post.frontMatter.title}</Link>
          </h2>
          <p>{post.frontMatter.description}</p>
          <footer>
            <dl>
              <dt>Published</dt>
              <dd>
                <DateText date={post.frontMatter.published} />
              </dd>
            </dl>
          </footer>
        </article>
      ))}
    </article>
  );
}
```

## Deploying site to GitHub Pages

Now that pages are being generated from the Markdown files, there are a few GitHub Pages and Next.js specific things that are good to go over.

Since the site will be hosted using GitHub Pages, the **GitHub repository** should be named `*username*.github.io`, where `*username*` is your GitHub account's username. Although you can name the repository in any way you like and still host the site using GitHub Pages, naming the repository anything other than `*username*.github.io` will cause the repository name to be visible in the URL. For example, if the repository name is `my-awesome-blog`, the URL for the site will be `https://*username*.github.io/my-awesome-blog/`. This also means you must add `basePath: "/my-awesome-blog"` to `next.config.js`. Otherwise linking/navigating won't work.

Naming the repository `*username*.github.io` will trigger GitHub to run the default `github-pages` GitHub Actions workflow, which won't work in this case because the site is built using a static site generator.

The default workflow can be disabled from the repository settings by changing the "Build and deployment" source to "GitHub Actions" in the "Pages" settings. Now the repository will only use a custom GitHub Actions workflow.

Here's an example of a custom GitHub Actions workflow that contains all the essential steps to build and deploy Next.js site to GitHub Pages:

```yml
name: Deploy Next.js site to Pages

on:
  push:
    branches: ['main']

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: false

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version-file: '.nvmrc'
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v5
      - name: Install dependencies
        run: npm ci
      - name: Build with Next.js
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './out'

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: [build]
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

As a side note, this workflow uses `.nvmrc` file to set a specific version of Node.js.

Once code changes have been pushed to the GitHub repository, this new workflow runs, building the Next.js application and deploying the site to GitHub Pages. Afterwards, the site should be visible at `https://*username*.github.io/`.

## Other things

The main purpose of this post is to display all the **essentials** for building a Next.js blog application and hosting it on GitHub Pages. This is not a step-by-step tutorial covering every line of code. Because of this, I have not included every detail, such as testing or styling. Additionally, some code examples are simplified to highlight only the most important parts.

But to quickly cover some of those "other things":

- I used Vitest for testing and for component tests I used React Testing Library.
- I added some basic end-to-end tests using Playwright to ensure that navigation works correctly and that there are no major accessibility issues.
- For styling, I opted for Tailwind CSS, mainly because it's gotten pretty popular, and I hadn't had the chance to test it out yet.
- Additionally, I used ESLint and Prettier for linting and code formatting.

If you want to see how some of these "other things" were actually done, feel free to dig around the [source code for this site](https://github.com/toninau/toninau.github.io).

## Conclusion

In conclusion, I'm happy with the end result and I did end up meeting the initial requirements. But of course, there's still room for improvement, and I will most likely end up building a `v2` of this site at some point.

Due to time constraints, I had to cut some features, such as tags for the posts. Since there aren't that many blog posts yet, this isn't a significant loss, but it could be something to look forward to in the next version 😄.
