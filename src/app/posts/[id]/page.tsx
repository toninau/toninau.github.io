import DateText from '@/components/DateText';
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
        <h1 className="my-2 text-4xl font-semibold tracking-tighter">{post.frontMatter.title}</h1>
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
        className="prose prose-lg min-w-full prose-headings:font-semibold prose-headings:tracking-tighter prose-h2:my-6 prose-p:font-serif prose-p:text-base"
        dangerouslySetInnerHTML={{ __html: post.html }}
      ></section>
    </article>
  );
}
