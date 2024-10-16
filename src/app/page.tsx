import { getSortedHomePagePosts, postsDirectory } from '@/lib/postUtils';
import DateText from '@/components/DateText';
import PostLink from '@/components/PostLink';

export default function HomePage() {
  const postsFrontMatter = getSortedHomePagePosts(postsDirectory);

  return (
    <>
      <h1 className="sr-only">toninau&apos;s Dev Blog</h1>
      <article>
        <h2 className="my-4 text-6xl font-semibold tracking-tighter">About</h2>
        <p className="font-serif">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac eros egestas, eleifend
          lectus nec, sagittis elit. Fusce quis purus at ex interdum consequat at eget dui. Duis
          augue augue, luctus eget nunc eget, aliquet mollis lorem. Proin quam ex, auctor id
          placerat et, commodo in nibh. Donec vitae est lobortis, luctus elit ut, sodales est.
          Vivamus blandit lorem laoreet mi faucibus pretium. Nam pulvinar ipsum a massa pharetra
          blandit. Etiam in lectus a est dictum mollis. Cras diam arcu, interdum eu elit eget,
          blandit hendrerit ex. Maecenas quis sodales massa. Cras ac risus fermentum, rutrum neque
          quis, mattis sapien. Morbi ornare mi commodo, lobortis risus et, tincidunt lorem. Nam in
          viverra dolor.
        </p>
      </article>
      <article>
        <h2 className="my-4 text-6xl font-semibold tracking-tighter">Posts</h2>
        <aside>
          <h3>Tags</h3>
          <ul className="flex flex-row flex-wrap gap-2">
            <Tag name="Java" />
            <Tag name="Testing" />
          </ul>
        </aside>
        {postsFrontMatter.map((frontMatter) => (
          <article key={frontMatter.id}>
            <PostLink href={`/posts/${frontMatter.id}`}>
              <h3>{frontMatter.frontMatter.title}</h3>
            </PostLink>
            <p>{frontMatter.frontMatter.description}</p>
            <DateText date={frontMatter.frontMatter.date} />
          </article>
        ))}
      </article>
    </>
  );
}

function Tag({ name }: { name: string }) {
  return (
    <span className="w-fit rounded-full bg-button-bg px-2 py-1 text-sm font-semibold text-secondary">
      {name}
    </span>
  );
}
