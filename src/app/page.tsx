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
            <h3 className="my-2 text-2xl font-medium tracking-tighter text-stone-900 dark:text-white">
              <Link className="hover:underline" href={`/posts/${post.id}`}>
                {post.frontMatter.title} <ArrowRight />
              </Link>
            </h3>
            <p className="my-1 font-serif text-stone-700 dark:text-stone-300">
              {post.frontMatter.description}
            </p>
            <footer>
              <dl className="my-1 flex items-center gap-2 text-sm font-normal text-secondary max-[300px]:max-w-min">
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
                    <div>
                      <dt className="sr-only">Updated</dt>
                      <dd>
                        <DateText date={post.frontMatter.updated} />
                      </dd>
                    </div>
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

function ArrowRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="inline size-5"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
