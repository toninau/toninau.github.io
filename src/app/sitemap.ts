import { formatIsoDate } from '@/lib/date';
import { getSortedFrontPagePosts, postsDirectory } from '@/lib/post';
import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export const baseUrl = process.env.BASE_URL ?? '';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedFrontPagePosts(postsDirectory).map((post) => ({
    url: `${baseUrl}/posts/${post.postId}`,
    lastModified: formatIsoDate(post.frontMatter.updated ?? post.frontMatter.published)
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString().split('T')[0]
    },
    ...posts
  ];
}
