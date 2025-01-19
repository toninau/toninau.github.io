import DateText from '@/components/DateText';
import ReturnToFrontPageLink from '@/components/ReturnToFrontPageLink';
import { getPost, getPostIds, PostId, postsDirectory } from '@/lib/post';

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
    <div className="flex content-center justify-center sm:px-6">
      <main className="w-full max-w-screen-sm">
        <article>
          <header className="mb-8 mt-6 max-sm:mx-4">
            <h1 className="my-2 text-3xl font-semibold tracking-tighter text-stone-900 sm:text-4xl dark:text-white">
              {post.frontMatter.title}
            </h1>
            <dl className="my-1 flex items-center gap-2 font-serif text-xs font-normal text-secondary max-[300px]:max-w-min sm:text-sm">
              <div>
                <dt className="sr-only">Published</dt>
                <dd>
                  <DateText date={post.frontMatter.published} />
                </dd>
              </div>
              {post.frontMatter.updated && (
                <>
                  <div>
                    <span aria-hidden={true}>•</span>
                  </div>
                  <div className="flex gap-1">
                    <dt className="max-[360px]:sr-only">Updated</dt>
                    <dd>
                      <DateText date={post.frontMatter.updated} />
                    </dd>
                  </div>
                </>
              )}
            </dl>
          </header>
          <section
            className="prose prose-stone min-w-full break-words dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tighter prose-p:font-serif prose-pre:px-0 prose-ol:font-serif prose-ul:font-serif max-sm:prose-pre:rounded-none max-sm:[&>*:not(figure)]:mx-4"
            dangerouslySetInnerHTML={{ __html: post.html }}
          ></section>
          <footer className="my-8 border-t-[1px] border-stone-200 pt-8 max-sm:mx-4 dark:border-stone-700">
            <ReturnToFrontPageLink />
          </footer>
        </article>
      </main>
    </div>
  );
}
