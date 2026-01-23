/**
 * Blog Page Tests
 * 
 * Tests for the /blog page which displays a list of blog posts.
 * Features: Hero section, search bar, featured post, posts grid, pagination, KickstarterPromo.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import BlogPage from '../../routes/blog/+page.svelte';

// Mock blog posts data
const mockPosts = [
  {
    id: 1,
    title: 'Featured Blog Post',
    slug: 'featured-blog-post',
    excerpt: 'This is a featured blog post excerpt.',
    content: 'This is the full content of the featured blog post. It has multiple words to test read time calculation.',
    author: 'Eddie Taliaferro',
    published: true,
    featured: true,
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-01-15T10:00:00Z'
  },
  {
    id: 2,
    title: 'Regular Blog Post',
    slug: 'regular-blog-post',
    excerpt: 'This is a regular blog post excerpt.',
    content: 'This is the full content of a regular blog post.',
    author: 'Keith Dunklin',
    published: true,
    featured: false,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z'
  },
  {
    id: 3,
    title: 'Another Blog Post',
    slug: 'another-blog-post',
    excerpt: 'This is another blog post excerpt.',
    content: 'This is the full content of another blog post.',
    author: 'Eddie Taliaferro',
    published: true,
    featured: false,
    created_at: '2026-01-05T10:00:00Z',
    updated_at: '2026-01-05T10:00:00Z'
  }
];

const emptyPosts: any[] = [];

describe('Blog Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Page Structure', () => {
    it('should render the page', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const container = document.querySelector('.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should render hero section', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const section = document.querySelector('section.relative');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Hero Section', () => {
    it('should render the page title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      expect(screen.getByText('Blog')).toBeInTheDocument();
    });

    it('should have gradient text class on title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const title = document.querySelector('.gradient-text');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('Blog');
    });

    it('should have jersey font class on title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const title = document.querySelector('.jersey-font');
      expect(title).toBeInTheDocument();
    });

    it('should render subtitle', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      expect(screen.getByText(/Latest news, dev logs, and insights from the FinalBossXR team/)).toBeInTheDocument();
    });

    it('should render blog SVG illustration', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const svgContainer = document.querySelector('.blog-svg-container');
      expect(svgContainer).toBeInTheDocument();
      
      const svg = document.querySelector('.blog-illustration');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Search Bar', () => {
    it('should render search input', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const searchInput = screen.getByPlaceholderText('Search articles...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have search icon', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      // Search icon is an SVG near the input
      const searchSvg = document.querySelector('input[placeholder="Search articles..."]')?.previousElementSibling || 
                        document.querySelector('input[placeholder="Search articles..."]')?.parentElement?.querySelector('svg');
      expect(searchSvg).toBeInTheDocument();
    });

    it('should allow typing in search input', async () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const searchInput = screen.getByPlaceholderText('Search articles...') as HTMLInputElement;
      await fireEvent.input(searchInput, { target: { value: 'test' } });
      
      expect(searchInput.value).toBe('test');
    });
  });

  describe('Featured Post', () => {
    it('should render featured section title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      // "Featured" appears as section title (h2) and as badge (span)
      const featuredElements = screen.getAllByText('Featured');
      expect(featuredElements.length).toBeGreaterThanOrEqual(1);
      
      // Verify the section title h2 exists
      const sectionTitle = document.querySelector('h2.text-sm');
      expect(sectionTitle?.textContent).toBe('Featured');
    });

    it('should render featured post card', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const featuredCard = document.querySelector('.featured-card');
      expect(featuredCard).toBeInTheDocument();
    });

    it('should render featured badge', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const featuredBadge = document.querySelector('.featured-badge');
      expect(featuredBadge).toBeInTheDocument();
    });

    it('should display featured post title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      expect(screen.getByText('Featured Blog Post')).toBeInTheDocument();
    });

    it('should have link to featured post', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const featuredLink = document.querySelector('a[href="/blog/featured-blog-post"]');
      expect(featuredLink).toBeInTheDocument();
    });

    it('should display "Read more" text', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const readMoreElements = screen.getAllByText('Read more');
      expect(readMoreElements.length).toBeGreaterThan(0);
    });
  });

  describe('Posts Grid', () => {
    it('should render "All Posts" section title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      expect(screen.getByText('All Posts')).toBeInTheDocument();
    });

    it('should render blog grid', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogGrid = document.querySelector('.blog-grid');
      expect(blogGrid).toBeInTheDocument();
    });

    it('should render blog cards', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogCards = document.querySelectorAll('.blog-card');
      expect(blogCards.length).toBeGreaterThan(0);
    });

    it('should render post titles in cards', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      expect(screen.getByText('Regular Blog Post')).toBeInTheDocument();
      expect(screen.getByText('Another Blog Post')).toBeInTheDocument();
    });

    it('should have links to individual posts', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const postLink1 = document.querySelector('a[href="/blog/regular-blog-post"]');
      const postLink2 = document.querySelector('a[href="/blog/another-blog-post"]');
      
      expect(postLink1).toBeInTheDocument();
      expect(postLink2).toBeInTheDocument();
    });

    it('should display "Article" category badge', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const categoryBadges = document.querySelectorAll('.blog-category');
      expect(categoryBadges.length).toBeGreaterThan(0);
    });

    it('should display "Read More" links', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const readMoreLinks = document.querySelectorAll('.blog-link');
      expect(readMoreLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Blog Card Structure', () => {
    it('should have blog image section', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogImages = document.querySelectorAll('.blog-image');
      expect(blogImages.length).toBeGreaterThan(0);
    });

    it('should have blog content section', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogContent = document.querySelectorAll('.blog-content');
      expect(blogContent.length).toBeGreaterThan(0);
    });

    it('should display blog date', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogDates = document.querySelectorAll('.blog-date');
      expect(blogDates.length).toBeGreaterThan(0);
    });

    it('should display blog title', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogTitles = document.querySelectorAll('.blog-title');
      expect(blogTitles.length).toBeGreaterThan(0);
    });

    it('should display blog excerpt', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blogExcerpts = document.querySelectorAll('.blog-excerpt');
      expect(blogExcerpts.length).toBeGreaterThan(0);
    });
  });

  describe('Empty State', () => {
    it('should render empty state when no posts', () => {
      render(BlogPage, { props: { data: { posts: emptyPosts } } });
      
      expect(screen.getByText('No posts yet')).toBeInTheDocument();
    });

    it('should show message to check back', () => {
      render(BlogPage, { props: { data: { posts: emptyPosts } } });
      
      expect(screen.getByText('Check back soon for updates and articles!')).toBeInTheDocument();
    });

    it('should display emoji in empty state', () => {
      render(BlogPage, { props: { data: { posts: emptyPosts } } });
      
      expect(screen.getByText('📝')).toBeInTheDocument();
    });
  });

  describe('KickstarterPromo Integration', () => {
    it('should render KickstarterPromo component', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
    });

    it('should render Kickstarter logo', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const kickstarterLogo = document.querySelector('.kickstarter-logo');
      expect(kickstarterLogo).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should show search results count when searching', async () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const searchInput = screen.getByPlaceholderText('Search articles...');
      await fireEvent.input(searchInput, { target: { value: 'Regular' } });
      
      // Should show search results text
      expect(screen.getByText(/Search Results/)).toBeInTheDocument();
    });

    it('should filter posts based on search query', async () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const searchInput = screen.getByPlaceholderText('Search articles...');
      await fireEvent.input(searchInput, { target: { value: 'Regular' } });
      
      // Regular Blog Post should be visible
      expect(screen.getByText('Regular Blog Post')).toBeInTheDocument();
    });

    it('should show "no posts found" message when search has no results', async () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const searchInput = screen.getByPlaceholderText('Search articles...');
      await fireEvent.input(searchInput, { target: { value: 'nonexistent' } });
      
      expect(screen.getByText(/No posts found matching/)).toBeInTheDocument();
    });
  });

  describe('Date Formatting', () => {
    it('should display formatted date on posts', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      // Should display formatted date like "January 15, 2026"
      expect(screen.getByText(/January 15, 2026/)).toBeInTheDocument();
    });
  });

  describe('Read Time', () => {
    it('should display read time on posts', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      // Should show "min read" text
      const minReadElements = document.body.textContent;
      expect(minReadElements).toContain('min read');
    });
  });

  describe('Styling', () => {
    it('should have h1 element in hero section', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
    });

    it('should have background blur elements', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const blurElements = document.querySelectorAll('.blur-3xl');
      expect(blurElements.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have search input accessible', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const searchInput = screen.getByPlaceholderText('Search articles...');
      expect(searchInput).toBeInTheDocument();
    });

    it('should have links to blog posts', () => {
      render(BlogPage, { props: { data: { posts: mockPosts } } });
      
      const links = document.querySelectorAll('a[href^="/blog/"]');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => render(BlogPage, { props: { data: { posts: mockPosts } } })).not.toThrow();
    });

    it('should render with empty posts without errors', () => {
      expect(() => render(BlogPage, { props: { data: { posts: emptyPosts } } })).not.toThrow();
    });
  });
});
