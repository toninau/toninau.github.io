import { formatIsoDate } from '@/lib/dateUtils';
import { getSortedFrontPagePosts, postsDirectory } from '@/lib/postUtils';
import { MetadataRoute } from 'next';

export const baseUrl = 'https://toninau.github.io';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getSortedFrontPagePosts(postsDirectory).map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
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
