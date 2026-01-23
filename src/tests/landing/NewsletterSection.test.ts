/**
 * NewsletterSection Component Tests
 * 
 * Tests for the newsletter section including:
 * - Rendering of newsletter form
 * - Visual elements (icon, glow effects)
 * - NewsletterSignup integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import NewsletterSection from '$lib/components/landing/NewsletterSection.svelte';

describe('NewsletterSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the newsletter section with aria-label', () => {
      render(NewsletterSection);
      
      const section = screen.getByLabelText('Newsletter');
      expect(section).toBeInTheDocument();
    });

    it('should render the newsletter container', () => {
      render(NewsletterSection);
      
      const container = document.querySelector('.newsletter-container');
      expect(container).toBeInTheDocument();
    });

    it('should render the newsletter content wrapper', () => {
      render(NewsletterSection);
      
      const content = document.querySelector('.newsletter-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Icon and Visual Elements', () => {
    it('should render the newsletter icon container', () => {
      render(NewsletterSection);
      
      const iconContainer = document.querySelector('.newsletter-icon');
      expect(iconContainer).toBeInTheDocument();
    });

    it('should render the envelope SVG icon', () => {
      render(NewsletterSection);
      
      const svg = document.querySelector('.newsletter-svg');
      expect(svg).toBeInTheDocument();
    });

    it('should render animated sparkle elements', () => {
      render(NewsletterSection);
      
      const sparkles = document.querySelectorAll('.sparkle');
      expect(sparkles.length).toBe(3); // 3 sparkle groups
    });

    it('should have gradient definitions in SVG', () => {
      render(NewsletterSection);
      
      const envGrad = document.querySelector('#envGrad');
      const sparkleGrad = document.querySelector('#sparkleGrad');
      
      expect(envGrad).toBeInTheDocument();
      expect(sparkleGrad).toBeInTheDocument();
    });

    it('should render the glow background effect', () => {
      render(NewsletterSection);
      
      const glow = document.querySelector('.newsletter-glow');
      expect(glow).toBeInTheDocument();
    });
  });

  describe('Content', () => {
    it('should render the section title', () => {
      render(NewsletterSection);
      
      const title = document.querySelector('.newsletter-title');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toContain('Stay in the Loop');
    });

    it('should have gradient-text class on title', () => {
      render(NewsletterSection);
      
      const title = document.querySelector('.newsletter-title');
      expect(title?.classList.contains('gradient-text')).toBe(true);
    });

    it('should render the description text', () => {
      render(NewsletterSection);
      
      const description = document.querySelector('.newsletter-description');
      expect(description).toBeInTheDocument();
      expect(description?.textContent).toContain('Get the latest updates');
    });

    it('should render the privacy notice', () => {
      render(NewsletterSection);
      
      const privacy = document.querySelector('.newsletter-privacy');
      expect(privacy).toBeInTheDocument();
      expect(privacy?.textContent).toContain('respect your privacy');
    });
  });

  describe('Newsletter Form Integration', () => {
    it('should render the form wrapper', () => {
      render(NewsletterSection);
      
      const formWrapper = document.querySelector('.newsletter-form-wrapper');
      expect(formWrapper).toBeInTheDocument();
    });

    it('should include NewsletterSignup component', () => {
      render(NewsletterSection);
      
      // NewsletterSignup renders a newsletter-wrapper
      const newsletterWrapper = document.querySelector('.newsletter-wrapper');
      expect(newsletterWrapper).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper section aria-label', () => {
      render(NewsletterSection);
      
      const section = screen.getByRole('region', { name: 'Newsletter' });
      expect(section).toBeInTheDocument();
    });

    it('should have heading element for title', () => {
      render(NewsletterSection);
      
      const heading = document.querySelector('h2.newsletter-title');
      expect(heading).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have newsletter-section class', () => {
      render(NewsletterSection);
      
      const section = document.querySelector('.newsletter-section');
      expect(section).toBeInTheDocument();
    });

    it('should have newsletter-bg for background effects', () => {
      render(NewsletterSection);
      
      const bg = document.querySelector('.newsletter-bg');
      expect(bg).toBeInTheDocument();
    });
  });
});
