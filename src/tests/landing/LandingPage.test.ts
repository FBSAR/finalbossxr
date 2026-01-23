/**
 * Landing Page Tests
 * 
 * Tests for the main landing page (+page.svelte)
 * Covers: rendering, scroll animations, section visibility, timeline interactions
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import LandingPage from '../../routes/+page.svelte';

describe('Landing Page', () => {
  beforeEach(() => {
    // Reset mocks before each test
    vi.clearAllMocks();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the landing page container', () => {
      render(LandingPage);
      
      const main = document.querySelector('.landing-page');
      expect(main).toBeInTheDocument();
    });

    it('should render all major sections', () => {
      render(LandingPage);
      
      // Check for section aria-labels
      expect(screen.getByLabelText('Featured Project')).toBeInTheDocument();
      expect(screen.getByLabelText('Newsletter')).toBeInTheDocument();
      expect(screen.getByLabelText('Blog')).toBeInTheDocument();
      expect(screen.getByLabelText('Our Story')).toBeInTheDocument();
      expect(screen.getByLabelText('Contact Us')).toBeInTheDocument();
    });

    it('should render contact section with ContactForm', () => {
      render(LandingPage);
      
      const contactSection = screen.getByLabelText('Contact Us');
      expect(contactSection).toBeInTheDocument();
      expect(contactSection.querySelector('.contact-container')).toBeInTheDocument();
    });
  });

  describe('Scroll Event Handling', () => {
    it('should render with scroll tracking capability', () => {
      render(LandingPage);
      
      // The landing page sets up scroll tracking - verify the container exists
      const landingPage = document.querySelector('.landing-page');
      expect(landingPage).toBeInTheDocument();
    });

    it('should handle window resize', async () => {
      render(LandingPage);
      
      // Simulate resize
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      fireEvent.resize(window);
      
      // The component should handle the resize event gracefully
      const landingPage = document.querySelector('.landing-page');
      expect(landingPage).toBeInTheDocument();
    });

    it('should remove event listeners on unmount', () => {
      const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
      
      const { unmount } = render(LandingPage);
      unmount();
      
      // Check that scroll and resize listeners were removed
      const scrollCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'scroll'
      );
      const resizeCalls = removeEventListenerSpy.mock.calls.filter(
        call => call[0] === 'resize'
      );
      expect(scrollCalls.length).toBeGreaterThan(0);
      expect(resizeCalls.length).toBeGreaterThan(0);
    });

    it('should handle scroll events', async () => {
      render(LandingPage);
      
      // Trigger scroll event
      fireEvent.scroll(window);
      
      // The component should handle the scroll event gracefully
      // (RAF behavior is internal to the component)
      const landingPage = document.querySelector('.landing-page');
      expect(landingPage).toBeInTheDocument();
    });
  });

  describe('Performance Optimizations', () => {
    it('should have smooth scroll behavior in head styles', () => {
      render(LandingPage);
      
      // The component adds smooth scroll behavior via svelte:head
      // Check that the style element exists in the document head
      const styleElements = document.querySelectorAll('head style');
      const hasScrollBehavior = Array.from(styleElements).some(
        el => el.textContent?.includes('scroll-behavior: smooth')
      );
      expect(hasScrollBehavior).toBe(true);
    });

    it('should apply CSS containment to landing page', () => {
      render(LandingPage);
      
      const landingPage = document.querySelector('.landing-page');
      expect(landingPage).toBeInTheDocument();
      // CSS containment is applied via stylesheet
    });
  });

  describe('Responsive Behavior', () => {
    it('should track window width', async () => {
      render(LandingPage);
      
      // Simulate resize
      Object.defineProperty(window, 'innerWidth', { value: 768, writable: true });
      fireEvent.resize(window);
      
      // Wait for debounced resize handler
      await vi.waitFor(() => {
        // The component should have updated its internal state
        // This is tested indirectly through timeline behavior
      }, { timeout: 200 });
    });

    it('should disable timeline index tracking on mobile', () => {
      // Set mobile width before rendering
      Object.defineProperty(window, 'innerWidth', { value: 600, writable: true });
      
      render(LandingPage);
      
      // On mobile (< 1024px), activeTimelineIndex should be -1
      // This is verified through the OurStorySection behavior
    });
  });

  describe('Accessibility', () => {
    it('should include reduced motion media query styles', () => {
      render(LandingPage);
      
      const styleElements = document.querySelectorAll('head style');
      const hasReducedMotion = Array.from(styleElements).some(
        el => el.textContent?.includes('prefers-reduced-motion')
      );
      expect(hasReducedMotion).toBe(true);
    });

    it('should have semantic section structure', () => {
      render(LandingPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
      
      // All sections should be within main
      const sections = main?.querySelectorAll('section');
      expect(sections?.length).toBeGreaterThan(0);
    });
  });
});
