import { getPost, getPostIds, PostId } from "@/lib/postUtils";

type PostPageProps = {
  params: { id: PostId };
};

export async function generateStaticParams() {
  return getPostIds();
}

export async function generateMetadata({ params }: PostPageProps) {
  const post = getPost(params.id);
  return {
    title: post?.data.title,
    description: post?.data.description,
  };
}

export default function PostPage({ params }: PostPageProps) {
  return <div>My Post: {params.id}</div>;
}
