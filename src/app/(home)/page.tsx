import { getSortedHomePagePosts, postsDirectory } from '@/lib/post';
import { Posts } from '@/app/(home)/Posts';

export default function HomePage() {
  const homePagePosts = getSortedHomePagePosts(postsDirectory);

  return (
    <div className="flex content-center justify-center px-4 sm:px-6">
      <main className="w-full max-w-(--breakpoint-sm)">
        <h1 className="sr-only">toninau&apos;s Dev Blog</h1>
        <article>
          <h2 className="mt-6 mb-8 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
            About
          </h2>
          <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
            Hi! My name is <BoldText>Toni Naumanen</BoldText>, and I&apos;m a{' '}
            <BoldText>Software Engineer/Full Stack Developer</BoldText> based in{' '}
            <BoldText>Helsinki, Finland</BoldText>, currently working at <BoldText>Solita</BoldText>
            . I work on large-scale systems that tend to have longer lifecycles where reliability,
            performance, and clarity matter.
          </p>
          <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
            Outside of building software and keeping up with the fast&#x2010;moving world of modern
            engineering, I enjoy playing games, tinkering with computers, and trying to learn
            acoustic guitar 🎸
          </p>
          <p className="my-5 font-serif text-stone-700 dark:text-stone-300">
            I work comfortably with a variety of languages and frameworks, but I&apos;m most
            familiar with{' '}
            <BoldText>React, JavaScript, TypeScript, Spring Boot, Java and Kotlin</BoldText>. I care
            about accessibility, maintainability, and building software that real people depend on.
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
