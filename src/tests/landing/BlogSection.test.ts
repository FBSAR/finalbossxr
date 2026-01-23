/**
 * BlogSection Component Tests
 * 
 * Tests for the blog section including:
 * - Blog cards rendering
 * - Links to blog posts
 * - Layout and structure
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import BlogSection from '$lib/components/landing/BlogSection.svelte';

describe('BlogSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the blog section with aria-label', () => {
      render(BlogSection);
      
      const section = screen.getByLabelText('Blog');
      expect(section).toBeInTheDocument();
    });

    it('should render the blog container', () => {
      render(BlogSection);
      
      const container = document.querySelector('.blog-container');
      expect(container).toBeInTheDocument();
    });

    it('should render the blog header', () => {
      render(BlogSection);
      
      const header = document.querySelector('.blog-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Header Content', () => {
    it('should render section label "Latest Updates"', () => {
      render(BlogSection);
      
      const label = document.querySelector('.section-label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Latest Updates');
    });

    it('should render section title "From Our Blog"', () => {
      render(BlogSection);
      
      const title = document.querySelector('.section-title');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('From Our Blog');
    });

    it('should have gradient-text class on title', () => {
      render(BlogSection);
      
      const title = document.querySelector('.section-title');
      expect(title?.classList.contains('gradient-text')).toBe(true);
    });
  });

  describe('Blog Grid', () => {
    it('should render the blog grid', () => {
      render(BlogSection);
      
      const grid = document.querySelector('.blog-grid');
      expect(grid).toBeInTheDocument();
    });

    it('should render 3 blog cards', () => {
      render(BlogSection);
      
      const cards = document.querySelectorAll('.blog-card');
      expect(cards.length).toBe(3);
    });

    it('should render blog cards as article elements', () => {
      render(BlogSection);
      
      const articles = document.querySelectorAll('article.blog-card');
      expect(articles.length).toBe(3);
    });
  });

  describe('Blog Card Structure', () => {
    it('should render blog images', () => {
      render(BlogSection);
      
      const images = document.querySelectorAll('.blog-image');
      expect(images.length).toBe(3);
    });

    it('should render blog image placeholders', () => {
      render(BlogSection);
      
      const placeholders = document.querySelectorAll('.blog-image-placeholder');
      expect(placeholders.length).toBe(3);
    });

    it('should render blog categories', () => {
      render(BlogSection);
      
      const categories = document.querySelectorAll('.blog-category');
      expect(categories.length).toBe(3);
      
      const categoryTexts = Array.from(categories).map(c => c.textContent);
      expect(categoryTexts).toContain('Development');
      expect(categoryTexts).toContain('XR Insights');
      expect(categoryTexts).toContain('Behind the Scenes');
    });

    it('should render blog content sections', () => {
      render(BlogSection);
      
      const contents = document.querySelectorAll('.blog-content');
      expect(contents.length).toBe(3);
    });

    it('should render blog dates', () => {
      render(BlogSection);
      
      const dates = document.querySelectorAll('.blog-date');
      expect(dates.length).toBe(3);
    });

    it('should render blog titles', () => {
      render(BlogSection);
      
      const titles = document.querySelectorAll('.blog-title');
      expect(titles.length).toBe(3);
    });

    it('should render blog excerpts', () => {
      render(BlogSection);
      
      const excerpts = document.querySelectorAll('.blog-excerpt');
      expect(excerpts.length).toBe(3);
    });
  });

  describe('Blog Links', () => {
    it('should render "Read More" links', () => {
      render(BlogSection);
      
      const links = document.querySelectorAll('.blog-link');
      expect(links.length).toBe(3);
    });

    it('should have correct href for blog links', () => {
      render(BlogSection);
      
      const links = document.querySelectorAll('.blog-link');
      const hrefs = Array.from(links).map(l => l.getAttribute('href'));
      
      expect(hrefs).toContain('/blog/placeholder-1');
      expect(hrefs).toContain('/blog/placeholder-2');
      expect(hrefs).toContain('/blog/placeholder-3');
    });

    it('should have arrow icon in links', () => {
      render(BlogSection);
      
      const links = document.querySelectorAll('.blog-link svg');
      expect(links.length).toBe(3);
    });
  });

  describe('Blog Content', () => {
    it('should render first blog post about Unreal Engine', () => {
      render(BlogSection);
      
      const titles = document.querySelectorAll('.blog-title');
      const titleTexts = Array.from(titles).map(t => t.textContent);
      
      expect(titleTexts.some(t => t?.includes('Unreal Engine'))).toBe(true);
    });

    it('should render second blog post about Spatial Computing', () => {
      render(BlogSection);
      
      const titles = document.querySelectorAll('.blog-title');
      const titleTexts = Array.from(titles).map(t => t.textContent);
      
      expect(titleTexts.some(t => t?.includes('Spatial Computing'))).toBe(true);
    });

    it('should render third blog post about Cosmic Collisions', () => {
      render(BlogSection);
      
      const titles = document.querySelectorAll('.blog-title');
      const titleTexts = Array.from(titles).map(t => t.textContent);
      
      expect(titleTexts.some(t => t?.includes('Cosmic Collisions'))).toBe(true);
    });
  });

  describe('Accessibility', () => {
    it('should have proper section aria-label', () => {
      render(BlogSection);
      
      const section = screen.getByRole('region', { name: 'Blog' });
      expect(section).toBeInTheDocument();
    });

    it('should use article elements for blog cards', () => {
      render(BlogSection);
      
      const articles = screen.getAllByRole('article');
      expect(articles.length).toBe(3);
    });

    it('should have heading hierarchy', () => {
      render(BlogSection);
      
      const h2 = document.querySelector('h2.section-title');
      const h3s = document.querySelectorAll('h3.blog-title');
      
      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(3);
    });
  });
});
