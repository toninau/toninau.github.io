import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Posts } from './Posts';
import { useSearchParams, ReadonlyURLSearchParams } from 'next/navigation';
import { HomePagePost, PostId } from '@/lib/post';
import { ReactNode } from 'react';
import { tagId } from '@/lib/tag';

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn()
}));

vi.mock('@/components/Link', () => ({
  default: ({ children, href }: { children: ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  )
}));

const mockedUseSearchParams = vi.mocked(useSearchParams);

const mockPosts = [
  {
    postId: '1' as PostId,
    frontMatter: {
      title: 'Post One',
      description: 'Description 1',
      published: new Date('2023-01-01'),
      updated: null,
      tags: [{ id: tagId('tech'), name: 'Tech' }]
    }
  },
  {
    postId: '2' as PostId,
    frontMatter: {
      title: 'Post Two',
      description: 'Description 2',
      published: new Date('2023-01-02'),
      updated: null,
      tags: [
        { id: tagId('tech'), name: 'Tech' },
        { id: tagId('ai'), name: 'AI' }
      ]
    }
  },
  {
    postId: '3' as PostId,
    frontMatter: {
      title: 'Post Three',
      description: 'Description 3',
      published: new Date('2023-01-03'),
      updated: null,
      tags: [{ id: tagId('cooking'), name: 'Cooking' }]
    }
  }
] satisfies HomePagePost[];

describe('<Posts />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseSearchParams.mockReturnValue(new URLSearchParams() as ReadonlyURLSearchParams);
  });

  test('renders all posts when no filter is applied', () => {
    render(<Posts posts={mockPosts} />);

    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
    expect(screen.getByText('Post Three')).toBeInTheDocument();
  });

  test('renders all filter tags', () => {
    render(<Posts posts={mockPosts} />);

    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Tech')).toBeInTheDocument();
    expect(screen.getByText('AI')).toBeInTheDocument();
    expect(screen.getByText('Cooking')).toBeInTheDocument();
  });

  test('filters posts when a specific tag is selected', () => {
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('filter=tech') as ReadonlyURLSearchParams
    );

    render(<Posts posts={mockPosts} />);

    // "Tech" should be visible, but only Post One and Post Two should exist
    expect(screen.getByText('Post One')).toBeInTheDocument();
    expect(screen.getByText('Post Two')).toBeInTheDocument();
    expect(screen.queryByText('Post Three')).not.toBeInTheDocument();
  });

  test('updates URL and filters posts when "Tech" button is clicked', () => {
    const pushSpy = vi.spyOn(history, 'pushState');

    render(<Posts posts={mockPosts} />);

    const techFilter = screen.getByText('Tech');
    fireEvent.click(techFilter);

    // Verify the router push was called with the correct params
    expect(pushSpy).toHaveBeenCalledWith(null, '', '?filter=tech');
  });

  test('removes filter when "All" is clicked', () => {
    // Start with a tech filter active
    mockedUseSearchParams.mockReturnValue(
      new URLSearchParams('filter=tech') as ReadonlyURLSearchParams
    );
    const pushSpy = vi.spyOn(history, 'pushState');

    render(<Posts posts={mockPosts} />);

    const allFilter = screen.getByText('All');
    fireEvent.click(allFilter);

    // Should call push with no filter parameter
    expect(pushSpy).toHaveBeenCalledWith(null, '', '?');
  });

  test('displays correct post description and links', () => {
    render(<Posts posts={mockPosts} />);

    const firstPostTitle = screen.getByText('Post One');
    expect(firstPostTitle).toBeInTheDocument();

    // Verify that it's wrapped in a link (or check the href)
    const link = firstPostTitle.closest('a');
    expect(link?.getAttribute('href')).toBe('/posts/1');

    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });
});
