import DateText from '@/components/DateText';
import { BackIcon } from '@/components/icons/BackIcon';
import Link from '@/components/Link';
import { getPost, getPostIds, PostId, postsDirectory } from '@/lib/postUtils';

type PostPageProps = {
  params: { id: PostId };
};

export async function generateStaticParams() {
  return getPostIds(postsDirectory);
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPost(postsDirectory, params.id);
  return {
    title: post?.frontMatter.title,
    description: post?.frontMatter.description
  };
}

export default function PostPage({ params }: PostPageProps) {
  const post = getPost(postsDirectory, params.id);

  return (
    <article>
      <header className="mb-8 mt-6">
        <h1 className="my-2 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          {post.frontMatter.title}
        </h1>
        <dl className="my-1 flex gap-2 text-sm font-normal text-secondary">
          <dt className="sr-only">Published</dt>
          <dd>
            <DateText date={post.frontMatter.published} />
          </dd>
          {post.frontMatter.modified && (
            <>
              <span aria-hidden={true}>|</span>
              <dt className="sr-only">Modified</dt>
              <dd>
                <DateText date={post.frontMatter.modified} />
              </dd>
            </>
          )}
        </dl>
      </header>
      <section
        className="prose prose-stone break-words dark:prose-invert prose-headings:font-semibold prose-headings:tracking-tighter prose-p:font-serif"
        dangerouslySetInnerHTML={{ __html: post.html }}
      ></section>
      <footer className="my-8 border-t-2 border-stone-200 pt-8 dark:border-stone-700">
        <Link
          href={'/'}
          className="inline-flex items-center gap-2 rounded-lg bg-button p-2 text-base font-medium tracking-tighter text-secondary hover:bg-button-hover active:bg-button-active"
        >
          <BackIcon /> Return to front page
        </Link>
      </footer>
    </article>
  );
}
