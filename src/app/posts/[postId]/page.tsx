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
    <article>
      <header className="mb-8 mt-6">
        <h1 className="my-2 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          {post.frontMatter.title}
        </h1>
        <dl className="my-1 flex items-center gap-2 font-serif text-sm font-normal text-secondary max-[300px]:max-w-min">
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
        className="prose prose-stone break-words dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tighter prose-p:font-serif prose-pre:px-0 prose-ol:font-serif prose-ul:font-serif"
        dangerouslySetInnerHTML={{ __html: post.html }}
      ></section>
      <footer className="my-8 border-t-[1px] border-stone-200 pt-8 dark:border-stone-700">
        <ReturnToFrontPageLink />
      </footer>
    </article>
  );
}
