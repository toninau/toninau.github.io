import Link from 'next/link';
import { getSortedHomePagePosts, postsDirectory } from '@/lib/postUtils';
import DateText from '@/components/DateText';

export default function HomePage() {
  const postsFrontMatter = getSortedHomePagePosts(postsDirectory);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <p>Hello world!!!</p>
      <Link href="/test">Go to test page</Link>
      {postsFrontMatter.map((frontMatter) => (
        <div key={frontMatter.id}>
          <Link href={`/posts/${frontMatter.id}`}>{frontMatter.frontMatter.title}</Link>
          <p>{frontMatter.frontMatter.description}</p>
          <DateText date={frontMatter.frontMatter.date} />
        </div>
      ))}
    </div>
  );
}
