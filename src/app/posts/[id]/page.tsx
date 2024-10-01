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
    <div>
      <h1>{post.frontMatter.title}</h1>
    </div>
  );
}
