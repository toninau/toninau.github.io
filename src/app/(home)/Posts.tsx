'use client';
import { ReactNode, useMemo, useState } from 'react';
import { HomePagePost } from '@/lib/post';
import ArrowRight from '@/components/icons/ArrowRight';
import Link from '@/components/Link';
import DateText from '@/components/DateText';
import { TagId } from '@/lib/tag';

export function Posts({ posts }: { posts: HomePagePost[] }) {
  const [activeTag, setActiveTag] = useState<TagId | null>(null);

  const allTags: TagId[] = useMemo(
    () => Array.from(new Set(posts.map((post) => post.frontMatter.tags).flat())).sort(),
    [posts]
  );

  const filteredPosts = activeTag
    ? posts.filter((post) => post.frontMatter.tags?.includes(activeTag))
    : posts;

  return (
    <>
      <h2 className="mt-12 mb-8 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white">
        Posts
      </h2>
      <FilterGroup>
        <Filter active={activeTag === null} onClick={() => setActiveTag(null)} value="All" />
        {allTags.map((tag) => (
          <Filter
            active={activeTag === tag}
            onClick={() => setActiveTag(tag)}
            value={tag}
            key={tag}
          />
        ))}
      </FilterGroup>
      {filteredPosts.map((post) => (
        <article className="my-6" key={post.postId}>
          <h3 className="my-2 text-2xl font-medium tracking-tighter text-stone-900 dark:text-white">
            <Link className="group" href={`/posts/${post.postId}`}>
              <span className="group-hover:underline">{post.frontMatter.title}</span>
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
            <dl className="text-secondary my-1 flex items-center gap-2 font-serif text-sm font-normal max-[300px]:max-w-min">
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
    </>
  );
}

function FilterGroup({ children }: { children: ReactNode }) {
  return (
    <fieldset className="my-6 flex flex-wrap gap-2">
      <legend className="sr-only">Filter by</legend>
      {children}
    </fieldset>
  );
}

function Filter({
  value,
  active,
  onClick
}: {
  value: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <label className="cursor-pointer rounded-full bg-stone-200 px-3 py-1 text-sm font-medium text-stone-800 outline-offset-2 outline-black transition-colors select-none focus-within:outline-2 hover:bg-stone-300 has-checked:bg-stone-900 has-checked:text-white dark:bg-stone-700 dark:text-stone-200 dark:outline-white dark:hover:bg-stone-600 dark:has-checked:bg-white dark:has-checked:text-stone-900">
      <input
        type="radio"
        checked={active}
        name={value}
        value={value}
        className="sr-only"
        onChange={onClick}
      />
      <span>{value}</span>
    </label>
  );
}
