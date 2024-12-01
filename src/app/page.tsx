import { getSortedFrontPagePosts, postsDirectory } from '@/lib/post';
import DateText from '@/components/DateText';
import Link from '@/components/Link';
import ArrowRight from '@/components/icons/ArrowRight';

export default function FrontPage() {
  const frontPagePosts = getSortedFrontPagePosts(postsDirectory);

  return (
    <>
      <h1 className="sr-only">toninau&apos;s Dev Blog</h1>
      <article>
        <h2 className="mb-8 mt-6 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          About
        </h2>
        <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
          Hi! My name is <BoldText>Toni Naumanen</BoldText> and I&apos;m a{' '}
          <BoldText>Software Engineer/Full Stack Web Developer</BoldText> based in{' '}
          <BoldText>Helsinki, Finland</BoldText>, currently working at <BoldText>Solita</BoldText>.
          I focus on building web applications that are accessible, functional and easy to use.
          Outside of spending my time building web applications and learning about the web side of
          things, I enjoy trying out new things, creating and playing games, and making and eating
          pizza 🍕.
        </p>
        <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
          Some of the technologies I tend to use:{' '}
          <BoldText>React, JavaScript, TypeScript, Spring, Java and Kotlin.</BoldText>
        </p>
      </article>
      <article>
        <h2 className="mb-8 mt-12 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
          Posts
        </h2>
        {frontPagePosts.map((post) => (
          <article className="my-6" key={post.postId}>
            <h3 className="my-2 text-2xl font-medium tracking-tighter text-stone-900 dark:text-white">
              <Link className="group hover:underline" href={`/posts/${post.postId}`}>
                {post.frontMatter.title}
                <span aria-hidden={true} className="inline whitespace-nowrap">
                  &nbsp;
                  <ArrowRight className="inline-block size-5 transition ease-in-out group-hover:translate-x-1" />
                </span>
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

function BoldText({ children }: { children: React.ReactNode }) {
  return <span className="font-bold text-stone-900 dark:text-white">{children}</span>;
}
