import { getSortedFrontPagePosts, postsDirectory } from '@/lib/postUtils';
import DateText from '@/components/DateText';
import Link from '@/components/Link';

export default function FrontPage() {
  const frontPagePosts = getSortedFrontPagePosts(postsDirectory);

  return (
    <>
      <h1 className="sr-only">toninau&apos;s Dev Blog</h1>
      <article>
        <h2 className="mb-8 mt-6 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          About
        </h2>
        <p className="font-serif text-stone-700 dark:text-stone-300">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut ac eros egestas, eleifend
          lectus nec, sagittis elit. Fusce quis purus at ex interdum consequat at eget dui. Duis
          augue augue, luctus eget nunc eget, aliquet mollis lorem. Proin quam ex, auctor id
          placerat et, commodo in nibh.
        </p>
      </article>
      <article>
        <h2 className="mb-8 mt-12 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          Posts
        </h2>
        {frontPagePosts.map((post) => (
          <article className="my-6" key={post.id}>
            <Link href={`/posts/${post.id}`}>
              <h3 className="my-2 text-2xl font-medium tracking-tighter text-stone-900 hover:underline dark:text-white">
                {post.frontMatter.title}
              </h3>
            </Link>
            <p className="my-1 font-serif text-stone-700 dark:text-stone-300">
              {post.frontMatter.description}
            </p>
            <footer>
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
            </footer>
          </article>
        ))}
      </article>
    </>
  );
}
