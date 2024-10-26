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
    <article className="my-6">
      <header className="my-6">
        <h1 className="my-2 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          {post.frontMatter.title}
        </h1>
        <dl className="my-1 flex gap-2 text-sm font-semibold text-secondary">
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
        className="prose-md prose prose-stone my-6 min-w-full break-words dark:prose-invert prose-headings:my-6 prose-headings:font-semibold prose-headings:tracking-tighter prose-p:font-serif"
        dangerouslySetInnerHTML={{ __html: post.html }}
      ></section>
      <footer>
        <hr className="my-8 h-[2px] border-0 bg-gray-200 dark:bg-gray-700" />
        <Link
          href={'/'}
          className="inline-flex items-start gap-2 text-lg font-medium tracking-tighter text-link-icon hover:text-link-icon-active hover:underline"
        >
          <BackIcon /> Return to front page
        </Link>
      </footer>
    </article>
  );
}
