/**
 * Blog Slug Page Tests
 * 
 * Tests for the /blog/[slug] page which displays individual blog posts.
 * Features: Back link, post meta, title, content, share buttons, related posts, KickstarterPromo.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import BlogSlugPage from '../../routes/blog/[slug]/+page.svelte';

// Mock blog post data
const mockPost = {
  id: 1,
  title: 'Test Blog Post Title',
  slug: 'test-blog-post',
  excerpt: 'This is a test excerpt for the blog post.',
  content: '# Hello World\n\nThis is the **markdown content** of the blog post. It has multiple paragraphs and some *emphasis*.\n\n## Section Two\n\nMore content here with a [link](https://example.com).',
  author: 'Eddie Taliaferro',
  published: true,
  featured: true,
  created_at: '2026-01-20T10:00:00Z',
  updated_at: '2026-01-20T10:00:00Z'
};

const mockRelatedPosts = [
  {
    id: 2,
    title: 'Related Post One',
    slug: 'related-post-one',
    excerpt: 'Excerpt for related post one.',
    created_at: '2026-01-15T10:00:00Z',
    featured: false
  },
  {
    id: 3,
    title: 'Related Post Two',
    slug: 'related-post-two',
    excerpt: 'Excerpt for related post two.',
    created_at: '2026-01-10T10:00:00Z',
    featured: true
  },
  {
    id: 4,
    title: 'Related Post Three',
    slug: 'related-post-three',
    excerpt: 'Excerpt for related post three.',
    created_at: '2026-01-05T10:00:00Z',
    featured: false
  }
];

const emptyRelatedPosts: any[] = [];

describe('Blog Slug Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
    
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined)
      }
    });
    
    // Mock window.open for share buttons
    vi.spyOn(window, 'open').mockImplementation(() => null);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  describe('Page Structure', () => {
    it('should render the page', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const container = document.querySelector('.min-h-screen');
      expect(container).toBeInTheDocument();
    });

    it('should render header section', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const header = document.querySelector('section.relative');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Back Link', () => {
    it('should render back to blog link', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Back to Blog')).toBeInTheDocument();
    });

    it('should have correct href on back link', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const backLink = document.querySelector('a[href="/blog"]');
      expect(backLink).toBeInTheDocument();
    });

    it('should have back arrow icon', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const backLink = screen.getByText('Back to Blog').closest('a');
      const svg = backLink?.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Post Meta', () => {
    it('should display formatted date', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('January 20, 2026')).toBeInTheDocument();
    });

    it('should display read time', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const pageText = document.body.textContent;
      expect(pageText).toContain('min read');
    });

    it('should display author name', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText(/By Eddie Taliaferro/)).toBeInTheDocument();
    });
  });

  describe('Post Title', () => {
    it('should render post title', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('should have h1 for post title', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toBe('Test Blog Post Title');
    });

    it('should have gradient text class on title', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const h1 = document.querySelector('h1.gradient-text');
      expect(h1).toBeInTheDocument();
    });
  });

  describe('Post Excerpt', () => {
    it('should render post excerpt', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('This is a test excerpt for the blog post.')).toBeInTheDocument();
    });
  });

  describe('Post Content', () => {
    it('should render article with prose class', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const article = document.querySelector('article.prose');
      expect(article).toBeInTheDocument();
    });

    it('should render markdown content as HTML', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const article = document.querySelector('article.prose');
      expect(article?.innerHTML).toBeTruthy();
    });
  });

  describe('Share Buttons', () => {
    it('should render share section title', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Share this post')).toBeInTheDocument();
    });

    it('should render Twitter share button', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Twitter')).toBeInTheDocument();
    });

    it('should render LinkedIn share button', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
    });

    it('should render Copy Link button', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });

    it('should have 3 share buttons', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const shareSection = screen.getByText('Share this post').parentElement;
      const buttons = shareSection?.querySelectorAll('button');
      expect(buttons?.length).toBe(3);
    });

    it('should copy link when clicking copy button', async () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const copyButton = screen.getByText('Copy Link').closest('button');
      await fireEvent.click(copyButton!);
      
      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });

    it('should open Twitter when clicking Twitter button', async () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const twitterButton = screen.getByText('Twitter').closest('button');
      await fireEvent.click(twitterButton!);
      
      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('twitter.com'), '_blank');
    });

    it('should open LinkedIn when clicking LinkedIn button', async () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const linkedinButton = screen.getByText('LinkedIn').closest('button');
      await fireEvent.click(linkedinButton!);
      
      expect(window.open).toHaveBeenCalledWith(expect.stringContaining('linkedin.com'), '_blank');
    });
  });

  describe('Related Posts Section', () => {
    it('should render related posts section', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Related Posts')).toBeInTheDocument();
    });

    it('should have h2 for related posts title', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const h2 = screen.getByText('Related Posts');
      expect(h2.tagName.toLowerCase()).toBe('h2');
    });

    it('should render related post cards', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const relatedCards = document.querySelectorAll('.related-post-card');
      expect(relatedCards.length).toBe(3);
    });

    it('should display related post titles', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Related Post One')).toBeInTheDocument();
      expect(screen.getByText('Related Post Two')).toBeInTheDocument();
      expect(screen.getByText('Related Post Three')).toBeInTheDocument();
    });

    it('should have links to related posts', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const link1 = document.querySelector('a[href="/blog/related-post-one"]');
      const link2 = document.querySelector('a[href="/blog/related-post-two"]');
      const link3 = document.querySelector('a[href="/blog/related-post-three"]');
      
      expect(link1).toBeInTheDocument();
      expect(link2).toBeInTheDocument();
      expect(link3).toBeInTheDocument();
    });

    it('should display "Read more" links in related posts', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const readMoreLinks = document.querySelectorAll('.related-post-link');
      expect(readMoreLinks.length).toBe(3);
    });

    it('should show featured badge on featured related post', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const featuredBadges = document.querySelectorAll('.related-post-badge');
      expect(featuredBadges.length).toBe(1); // Only Related Post Two is featured
    });

    it('should not render related posts section when empty', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: emptyRelatedPosts } } });
      
      expect(screen.queryByText('Related Posts')).not.toBeInTheDocument();
    });
  });

  describe('Related Post Card Structure', () => {
    it('should have related post image section', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const relatedImages = document.querySelectorAll('.related-post-image');
      expect(relatedImages.length).toBe(3);
    });

    it('should have related post content section', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const relatedContent = document.querySelectorAll('.related-post-content');
      expect(relatedContent.length).toBe(3);
    });

    it('should display related post dates', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const relatedDates = document.querySelectorAll('.related-post-date');
      expect(relatedDates.length).toBe(3);
    });

    it('should display related post excerpts', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const relatedExcerpts = document.querySelectorAll('.related-post-excerpt');
      expect(relatedExcerpts.length).toBe(3);
    });
  });

  describe('KickstarterPromo Integration', () => {
    it('should render KickstarterPromo component', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
    });

    it('should render Kickstarter logo', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const kickstarterLogo = document.querySelector('.kickstarter-logo');
      expect(kickstarterLogo).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have background blur elements', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const blurElements = document.querySelectorAll('.blur-3xl');
      expect(blurElements.length).toBeGreaterThan(0);
    });

    it('should have max-w-3xl for content', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const maxWidth = document.querySelector('.max-w-3xl');
      expect(maxWidth).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have heading hierarchy', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');
      
      expect(h1s.length).toBeGreaterThanOrEqual(1);
      expect(h2s.length).toBeGreaterThanOrEqual(1);
      expect(h3s.length).toBeGreaterThanOrEqual(1);
    });

    it('should have navigation link back to blog', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      const backLink = document.querySelector('a[href="/blog"]');
      expect(backLink).toBeInTheDocument();
    });

    it('should have share buttons with text labels', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Twitter')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('Copy Link')).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct post title', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument();
    });

    it('should display correct post excerpt', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText('This is a test excerpt for the blog post.')).toBeInTheDocument();
    });

    it('should display correct author', () => {
      render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.getByText(/By Eddie Taliaferro/)).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: mockRelatedPosts } } })).not.toThrow();
    });

    it('should render without related posts', () => {
      expect(() => render(BlogSlugPage, { props: { data: { post: mockPost, relatedPosts: emptyRelatedPosts } } })).not.toThrow();
    });
  });

  describe('Post Without Author', () => {
    it('should not show author when not provided', () => {
      const postWithoutAuthor = { ...mockPost, author: null };
      render(BlogSlugPage, { props: { data: { post: postWithoutAuthor, relatedPosts: mockRelatedPosts } } });
      
      expect(screen.queryByText(/By/)).not.toBeInTheDocument();
    });
  });

  describe('Post Without Excerpt', () => {
    it('should not show excerpt when not provided', () => {
      const postWithoutExcerpt = { ...mockPost, excerpt: null };
      render(BlogSlugPage, { props: { data: { post: postWithoutExcerpt, relatedPosts: mockRelatedPosts } } });
      
      // The excerpt text should not be present
      expect(screen.queryByText('This is a test excerpt for the blog post.')).not.toBeInTheDocument();
    });
  });
});
