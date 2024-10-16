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
    <article>
      <header>
        <h1 className="text-6xl">{post.frontMatter.title}</h1>
        <dl>
          <dt className="sr-only">Published</dt>
          <dd>
            <DateText date={post.frontMatter.published} />
          </dd>
        </dl>
      </header>
      <section
        className="prose py-6 md:prose-lg lg:prose-lg"
        dangerouslySetInnerHTML={{ __html: post.html }}
      ></section>
      <footer>TAGS</footer>
    </article>
  );
}
