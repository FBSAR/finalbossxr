/**
 * JobsSection Component Tests
 * 
 * Tests for the jobs section including:
 * - Job cards rendering
 * - Job metadata (department, type, location)
 * - CTA link to jobs page
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import JobsSection from '$lib/components/landing/JobsSection.svelte';

describe('JobsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the jobs section with aria-label', () => {
      render(JobsSection);
      
      const section = screen.getByLabelText('Job Postings');
      expect(section).toBeInTheDocument();
    });

    it('should render the jobs container', () => {
      render(JobsSection);
      
      const container = document.querySelector('.jobs-container');
      expect(container).toBeInTheDocument();
    });

    it('should render the jobs header', () => {
      render(JobsSection);
      
      const header = document.querySelector('.jobs-header');
      expect(header).toBeInTheDocument();
    });
  });

  describe('Header Content', () => {
    it('should render section label "Join Our Team"', () => {
      render(JobsSection);
      
      const label = document.querySelector('.section-label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Join Our Team');
    });

    it('should render section title "Open Positions"', () => {
      render(JobsSection);
      
      const title = document.querySelector('.section-title');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('Open Positions');
    });

    it('should have gradient-text class on title', () => {
      render(JobsSection);
      
      const title = document.querySelector('.section-title');
      expect(title?.classList.contains('gradient-text')).toBe(true);
    });

    it('should render the jobs subtitle', () => {
      render(JobsSection);
      
      const subtitle = document.querySelector('.jobs-subtitle');
      expect(subtitle).toBeInTheDocument();
      expect(subtitle?.textContent).toContain('passionate individuals');
    });
  });

  describe('Jobs Grid', () => {
    it('should render the jobs grid', () => {
      render(JobsSection);
      
      const grid = document.querySelector('.jobs-grid');
      expect(grid).toBeInTheDocument();
    });

    it('should render 2 job cards', () => {
      render(JobsSection);
      
      const cards = document.querySelectorAll('.job-card');
      expect(cards.length).toBe(2);
    });

    it('should render job cards as article elements', () => {
      render(JobsSection);
      
      const articles = document.querySelectorAll('article.job-card');
      expect(articles.length).toBe(2);
    });
  });

  describe('Job Card Structure', () => {
    it('should render job icons', () => {
      render(JobsSection);
      
      const icons = document.querySelectorAll('.job-icon');
      expect(icons.length).toBe(2);
    });

    it('should render correct emojis for icons', () => {
      render(JobsSection);
      
      const icons = document.querySelectorAll('.job-icon');
      const iconTexts = Array.from(icons).map(i => i.textContent);
      
      expect(iconTexts).toContain('🎮');
      expect(iconTexts).toContain('🎨');
    });

    it('should render job meta sections', () => {
      render(JobsSection);
      
      const metas = document.querySelectorAll('.job-meta');
      expect(metas.length).toBe(2);
    });

    it('should render job departments', () => {
      render(JobsSection);
      
      const departments = document.querySelectorAll('.job-department');
      expect(departments.length).toBe(2);
      
      const deptTexts = Array.from(departments).map(d => d.textContent);
      expect(deptTexts).toContain('Engineering');
      expect(deptTexts).toContain('Design');
    });

    it('should render job types', () => {
      render(JobsSection);
      
      const types = document.querySelectorAll('.job-type');
      expect(types.length).toBe(2);
      
      const typeTexts = Array.from(types).map(t => t.textContent);
      expect(typeTexts).toContain('Part-time');
      expect(typeTexts).toContain('Project-based');
    });

    it('should render job titles', () => {
      render(JobsSection);
      
      const titles = document.querySelectorAll('.job-title');
      expect(titles.length).toBe(2);
    });

    it('should render job locations', () => {
      render(JobsSection);
      
      const locations = document.querySelectorAll('.job-location');
      expect(locations.length).toBe(2);
      
      // Both should be remote
      locations.forEach(loc => {
        expect(loc.textContent).toContain('Remote');
      });
    });

    it('should render job descriptions', () => {
      render(JobsSection);
      
      const descriptions = document.querySelectorAll('.job-description');
      expect(descriptions.length).toBe(2);
    });
  });

  describe('Job Positions', () => {
    it('should render Game Developer position', () => {
      render(JobsSection);
      
      const titles = document.querySelectorAll('.job-title');
      const titleTexts = Array.from(titles).map(t => t.textContent);
      
      expect(titleTexts).toContain('Game Developer');
    });

    it('should render Graphic Designer position', () => {
      render(JobsSection);
      
      const titles = document.querySelectorAll('.job-title');
      const titleTexts = Array.from(titles).map(t => t.textContent);
      
      expect(titleTexts.some(t => t?.includes('Graphic Designer'))).toBe(true);
    });
  });

  describe('CTA Link', () => {
    it('should render the CTA container', () => {
      render(JobsSection);
      
      const cta = document.querySelector('.jobs-cta');
      expect(cta).toBeInTheDocument();
    });

    it('should render "View All Open Positions" link', () => {
      render(JobsSection);
      
      const link = document.querySelector('.view-all-jobs');
      expect(link).toBeInTheDocument();
      expect(link?.textContent).toContain('View All Open Positions');
    });

    it('should link to /jobs page', () => {
      render(JobsSection);
      
      const link = document.querySelector('.view-all-jobs');
      expect(link?.getAttribute('href')).toBe('/jobs');
    });

    it('should have arrow icon in CTA link', () => {
      render(JobsSection);
      
      const linkSvg = document.querySelector('.view-all-jobs svg');
      expect(linkSvg).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper section aria-label', () => {
      render(JobsSection);
      
      const section = screen.getByRole('region', { name: 'Job Postings' });
      expect(section).toBeInTheDocument();
    });

    it('should use article elements for job cards', () => {
      render(JobsSection);
      
      const articles = screen.getAllByRole('article');
      expect(articles.length).toBe(2);
    });

    it('should have heading hierarchy', () => {
      render(JobsSection);
      
      const h2 = document.querySelector('h2.section-title');
      const h3s = document.querySelectorAll('h3.job-title');
      
      expect(h2).toBeInTheDocument();
      expect(h3s.length).toBe(2);
    });
  });
});
