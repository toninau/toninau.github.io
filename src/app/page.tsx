import { getSortedHomePagePosts, postsDirectory } from '@/lib/postUtils';
import DateText from '@/components/DateText';
import PostLink from '@/components/PostLink';

export default function HomePage() {
  const postsFrontMatter = getSortedHomePagePosts(postsDirectory);

  return (
    <>
      <h1 className="sr-only">toninau&apos;s Dev Blog</h1>
      <article>
        <h2 className="my-6 text-4xl font-semibold tracking-tighter">About</h2>
        <p className="font-serif">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac eros egestas, eleifend
          lectus nec, sagittis elit. Fusce quis purus at ex interdum consequat at eget dui. Duis
          augue augue, luctus eget nunc eget, aliquet mollis lorem. Proin quam ex, auctor id
          placerat et, commodo in nibh.
        </p>
      </article>
      <article>
        <h2 className="my-6 text-4xl font-semibold tracking-tighter">Posts</h2>
        {postsFrontMatter.map((frontMatter) => (
          <article className="my-6" key={frontMatter.id}>
            <PostLink href={`/posts/${frontMatter.id}`}>
              <h3 className="my-2 text-2xl font-medium tracking-tighter hover:underline">
                {frontMatter.frontMatter.title}
              </h3>
            </PostLink>
            <p className="my-1 font-serif">{frontMatter.frontMatter.description}</p>
            <p className="my-1 text-sm font-semibold text-secondary">
              <DateText date={frontMatter.frontMatter.published} />
            </p>
          </article>
        ))}
      </article>
    </>
  );
}
