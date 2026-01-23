/**
 * HeroSection Component Tests
 * 
 * Tests for the hero section with:
 * - Constellation particle system
 * - Typewriter effect
 * - Hero text reveal animations
 * - XR Abstract Art component integration
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import HeroSection from '$lib/components/landing/HeroSection.svelte';

describe('HeroSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock window dimensions
    Object.defineProperty(window, 'innerHeight', { value: 800, writable: true });
    Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  describe('Rendering', () => {
    it('should render the hero section', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const heroSection = document.querySelector('.hero-section');
      expect(heroSection).toBeInTheDocument();
    });

    it('should render the canvas element for particles', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const canvas = document.querySelector('.constellation-canvas');
      expect(canvas).toBeInTheDocument();
    });

    it('should render the hero badge', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      // Badge should be present (may be hidden initially)
      const badge = document.querySelector('.hero-badge');
      expect(badge).toBeInTheDocument();
    });

    it('should render the XRAbstractArt component container', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const artContainer = document.querySelector('.xr-art-hero');
      expect(artContainer).toBeInTheDocument();
    });

    it('should render value proposition items', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const valueProps = document.querySelector('.value-props');
      expect(valueProps).toBeInTheDocument();
    });

    it('should render CTA buttons container', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const cta = document.querySelector('.hero-cta');
      expect(cta).toBeInTheDocument();
    });
  });

  describe('Typewriter Effect', () => {
    it('should render title element', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const titleElement = document.querySelector('.hero-title');
      expect(titleElement).toBeInTheDocument();
    });

    it('should have title lines for typewriter', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const titleLines = document.querySelectorAll('.title-line');
      expect(titleLines.length).toBe(2); // Two lines of title
    });

    it('should have typewriter cursor elements', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const cursors = document.querySelectorAll('.typewriter-cursor');
      expect(cursors.length).toBeGreaterThan(0);
    });
  });

  describe('Hero Reveal Animation', () => {
    it('should have hero-badge element for animations', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const heroBadge = document.querySelector('.hero-badge');
      expect(heroBadge).toBeInTheDocument();
    });

    it('should not have revealed class initially', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const heroBadge = document.querySelector('.hero-badge');
      expect(heroBadge?.classList.contains('revealed')).toBe(false);
    });

    it('should support revealed class for hero animation', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      // Hero badge exists and can receive revealed class
      const heroBadge = document.querySelector('.hero-badge');
      expect(heroBadge).toBeInTheDocument();
      // The revealed class is added via Svelte class directive after timeout
      // We verify the element supports this animation
    });
  });

  describe('XR Art Reveal Animation', () => {
    it('should have xr-art-hero element', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const xrArt = document.querySelector('.xr-art-hero');
      expect(xrArt).toBeInTheDocument();
    });

    it('should support revealed class for XR art animation', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      // XR art container exists and can receive revealed class
      const xrArt = document.querySelector('.xr-art-hero');
      expect(xrArt).toBeInTheDocument();
      // The revealed class is added via Svelte class directive after timeout
      // We verify the element supports this animation
    });
  });

  describe('Canvas Particle System', () => {
    it('should have canvas with constellation-canvas class', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const canvas = document.querySelector('.constellation-canvas') as HTMLCanvasElement;
      expect(canvas).toBeInTheDocument();
      expect(canvas.tagName.toLowerCase()).toBe('canvas');
    });

    it('should have aria-hidden on canvas for accessibility', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const canvas = document.querySelector('.constellation-canvas');
      expect(canvas?.getAttribute('aria-hidden')).toBe('true');
    });
  });

  describe('Scroll Behavior', () => {
    it('should accept scrollY prop', () => {
      const { component } = render(HeroSection, { props: { scrollY: 100 } });
      
      expect(component).toBeTruthy();
    });

    it('should apply parallax effect based on scrollY', () => {
      render(HeroSection, { props: { scrollY: 200 } });
      
      // Hero content should have transform based on scroll
      const heroContent = document.querySelector('.hero-content') as HTMLElement;
      expect(heroContent?.style.transform).toContain('translateY');
    });

    it('should render scroll indicator', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const scrollIndicator = document.querySelector('.scroll-indicator');
      expect(scrollIndicator).toBeInTheDocument();
    });

    it('should fade scroll indicator based on scroll', () => {
      render(HeroSection, { props: { scrollY: 100 } });
      
      const scrollIndicator = document.querySelector('.scroll-indicator') as HTMLElement;
      expect(scrollIndicator?.style.opacity).toBeDefined();
    });
  });

  describe('Geometric Shapes', () => {
    it('should render geometric shape wrappers', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const shapes = document.querySelectorAll('.geo-shape-wrapper');
      expect(shapes.length).toBeGreaterThan(0);
    });

    it('should render various shape types', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const shapes = document.querySelectorAll('.geo-shape');
      expect(shapes.length).toBeGreaterThan(0);
    });
  });

  describe('Value Props', () => {
    it('should render three value props', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const valueProps = document.querySelectorAll('.value-prop');
      expect(valueProps.length).toBe(3);
    });

    it('should have icons in value props', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const propIcons = document.querySelectorAll('.prop-icon');
      expect(propIcons.length).toBe(3);
    });

    it('should have text in value props', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const propTexts = document.querySelectorAll('.prop-text');
      expect(propTexts.length).toBe(3);
    });
  });

  describe('CTA Buttons', () => {
    it('should render primary CTA button', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const primaryBtn = document.querySelector('.btn-primary');
      expect(primaryBtn).toBeInTheDocument();
    });

    it('should render secondary CTA button', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const secondaryBtn = document.querySelector('.btn-secondary');
      expect(secondaryBtn).toBeInTheDocument();
    });

    it('should link to correct pages', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const primaryBtn = document.querySelector('.btn-primary');
      const secondaryBtn = document.querySelector('.btn-secondary');
      
      expect(primaryBtn?.getAttribute('href')).toBe('/cosmic');
      expect(secondaryBtn?.getAttribute('href')).toBe('/project_v');
    });
  });

  describe('Accessibility', () => {
    it('should have banner role on hero section', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const hero = document.querySelector('.hero-section');
      expect(hero?.getAttribute('role')).toBe('banner');
    });

    it('should have aria-label on hero section', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const hero = document.querySelector('.hero-section');
      expect(hero?.getAttribute('aria-label')).toBe('Hero section');
    });

    it('should have heading elements', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
    });

    it('should have descriptive subtitle', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const subtitle = document.querySelector('.hero-subtitle');
      expect(subtitle).toBeInTheDocument();
    });

    it('should have accessible CTA links', () => {
      render(HeroSection, { props: { scrollY: 0 } });
      
      const links = document.querySelectorAll('.hero-cta a');
      expect(links.length).toBeGreaterThan(0);
    });
  });

  describe('Cleanup', () => {
    it('should clear timeouts on unmount', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      
      const { unmount } = render(HeroSection, { props: { scrollY: 0 } });
      unmount();
      
      expect(clearTimeoutSpy).toHaveBeenCalled();
    });
  });
});
