'use client';
import { ReactNode, useMemo } from 'react';
import ArrowRight from '@/components/icons/ArrowRight';
import Link from '@/components/Link';
import DateText from '@/components/DateText';
import { tagId, TagId, Tag } from '@/lib/tag';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { HomePagePost } from '@/lib/post';

export function Posts({ posts }: { posts: HomePagePost[] }) {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const allTags: Tag[] = useMemo(() => {
    const set = new Set();
    return posts
      .map((post) => post.frontMatter.tags)
      .flat()
      .filter((o) => !set.has(o.id) && set.add(o.id))
      .toSorted((a, b) => a.name.localeCompare(b.name));
  }, [posts]);

  const filterSearchParam = searchParams.get('filter');

  const activeTag = useMemo(() => {
    if (!filterSearchParam) return null;
    return allTags.find((t) => t.id === tagId(filterSearchParam)) ?? null;
  }, [allTags, filterSearchParam]);

  const filteredPosts = activeTag
    ? posts.filter((post) => post.frontMatter.tags?.some((t) => t.id === activeTag?.id))
    : posts;

  const handleFilterChange = (tag: TagId | null) => {
    const params = new URLSearchParams(searchParams);

    if (tag) {
      params.set('filter', tag);
    } else {
      params.delete('filter');
    }

    replace(`${pathname}?${params.toString()}`, {
      scroll: false
    });
  };

  return (
    <>
      <h2
        id="posts"
        className="mt-12 mb-8 text-4xl font-semibold tracking-tighter text-stone-900 dark:text-white"
      >
        Posts
      </h2>
      <FilterGroup>
        <Filter active={activeTag === null} onClick={() => handleFilterChange(null)} value="All" />
        {allTags.map((tag) => (
          <Filter
            active={activeTag?.id === tag.id}
            onClick={() => handleFilterChange(tag.id)}
            value={tag.name}
            key={tag.id}
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
    <label className="bg-button text-secondary active:bg-button-active hover:bg-button-hover cursor-pointer rounded-full px-3 py-1 text-sm font-medium outline-offset-2 outline-black transition-colors select-none focus-within:outline-2 has-checked:bg-stone-900 has-checked:text-white dark:outline-white dark:has-checked:bg-white dark:has-checked:text-stone-900">
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
