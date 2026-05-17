import { getSortedHomePagePosts, postsDirectory } from '@/lib/post';
import { Posts } from '@/app/(home)/Posts';

export default function HomePage() {
  const homePagePosts = getSortedHomePagePosts(postsDirectory);

  return (
    <div className="flex content-center justify-center px-4 sm:px-6">
      <main className="w-full max-w-(--breakpoint-sm)">
        <h1 className="sr-only">toninau&apos;s Dev Blog</h1>
        <article>
          <h2 className="mb-8 mt-6 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
            About
          </h2>
          <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
            Hi! My name is <BoldText>Toni Naumanen</BoldText>, and I&apos;m a{' '}
            <BoldText>Software Engineer/Full Stack Developer</BoldText> based in{' '}
            <BoldText>Helsinki, Finland</BoldText>, currently working at <BoldText>Solita</BoldText>
            . I focus on building web applications that are accessible, functional and easy to use.
          </p>
          <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
            Outside of spending my time building web applications and learning about the web side of
            things, I enjoy creating and playing games, and making and eating pizza 🍕.
          </p>
          <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
            Technologies I tend to use:{' '}
            <BoldText>React, JavaScript, TypeScript, Spring Boot, Java and Kotlin.</BoldText>
          </p>
        </article>
        <article>
          <Posts posts={homePagePosts} />
        </article>
      </main>
    </div>
  );
}

function BoldText({ children }: { children: React.ReactNode }) {
  return <span className="font-bold text-stone-900 dark:text-white">{children}</span>;
}
