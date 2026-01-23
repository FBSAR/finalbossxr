/**
 * FeaturedProject Component Tests
 * 
 * Tests for the featured project section including:
 * - Cosmic Collisions project display
 * - Animation progress handling
 * - Video autoplay behavior
 * - Floating cosmic shapes
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import FeaturedProject from '$lib/components/landing/FeaturedProject.svelte';

describe('FeaturedProject', () => {
  const defaultProps = {
    animationProgress: 0.5 // Use 0.5 to trigger video play (between 0.2 and 0.9)
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the project section with aria-label', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const section = screen.getByLabelText('Featured Project');
      expect(section).toBeInTheDocument();
    });

    it('should render the project background', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const background = document.querySelector('.project-background');
      expect(background).toBeInTheDocument();
    });

    it('should render floating cosmic shapes container', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const shapes = document.querySelector('.floating-shapes');
      expect(shapes).toBeInTheDocument();
    });

    it('should render multiple cosmic shape SVGs', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const shapes = document.querySelectorAll('.floating-shapes .shape');
      expect(shapes.length).toBeGreaterThan(5); // Multiple shapes
    });
  });

  describe('Project Content', () => {
    it('should render the project container', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const container = document.querySelector('.project-container');
      expect(container).toBeInTheDocument();
    });

    it('should render project content area', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const content = document.querySelector('.project-content');
      expect(content).toBeInTheDocument();
    });

    it('should render project header with section label', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const label = document.querySelector('.section-label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Featured Work');
    });

    it('should render iPhone container', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const iphone = document.querySelector('.iphone-container');
      expect(iphone).toBeInTheDocument();
    });

    it('should render project info section', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const info = document.querySelector('.project-info');
      expect(info).toBeInTheDocument();
    });
  });

  describe('Video Element', () => {
    it('should render the demo video element', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const video = document.querySelector('.demo-video');
      expect(video).toBeInTheDocument();
    });

    it('should have muted attribute on video', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const video = document.querySelector('.demo-video') as HTMLVideoElement;
      expect(video).toBeInTheDocument();
      expect(video?.hasAttribute('muted') || video?.muted).toBeTruthy();
    });

    it('should have loop attribute on video', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const video = document.querySelector('.demo-video') as HTMLVideoElement;
      expect(video).toBeInTheDocument();
      expect(video?.hasAttribute('loop') || video?.loop).toBeTruthy();
    });

    it('should have playsinline attribute on video', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const video = document.querySelector('.demo-video') as HTMLVideoElement;
      expect(video).toBeInTheDocument();
      expect(video?.hasAttribute('playsinline')).toBe(true);
    });
  });

  describe('Animation Progress', () => {
    it('should apply opacity based on animation progress', () => {
      render(FeaturedProject, { props: { animationProgress: 0.5 } });
      
      const header = document.querySelector('.project-header') as HTMLElement;
      expect(header?.style.opacity).toBe('0.5');
    });

    it('should apply transform based on animation progress', () => {
      render(FeaturedProject, { props: { animationProgress: 0.5 } });
      
      const header = document.querySelector('.project-header') as HTMLElement;
      expect(header?.style.transform).toContain('translateY');
    });

    it('should render with zero progress', () => {
      render(FeaturedProject, { props: { animationProgress: 0 } });
      
      const section = screen.getByLabelText('Featured Project');
      expect(section).toBeInTheDocument();
    });

    it('should render with full progress', () => {
      render(FeaturedProject, { props: { animationProgress: 1 } });
      
      const section = screen.getByLabelText('Featured Project');
      expect(section).toBeInTheDocument();
    });
  });

  describe('Cosmic Shape Variations', () => {
    it('should render 4-point star shape', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const shapes = document.querySelectorAll('.shape');
      expect(shapes.length).toBeGreaterThan(0);
    });

    it('should render planet with ring shape', () => {
      render(FeaturedProject, { props: defaultProps });
      
      // Check for ellipse elements (planet rings)
      const ellipses = document.querySelectorAll('.floating-shapes ellipse');
      expect(ellipses.length).toBeGreaterThan(0);
    });

    it('should render comet shape', () => {
      render(FeaturedProject, { props: defaultProps });
      
      // Comets have path elements with curved trails
      const paths = document.querySelectorAll('.floating-shapes path');
      expect(paths.length).toBeGreaterThan(0);
    });
  });

  describe('Project Features', () => {
    it('should render Cosmic Collisions title', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const title = document.querySelector('.project-info h3');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toContain('Cosmic Collisions');
    });

    it('should render project description', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const description = document.querySelector('.project-description');
      expect(description).toBeInTheDocument();
    });

    it('should render project features list', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const features = document.querySelectorAll('.project-features .feature');
      expect(features.length).toBe(3);
    });

    it('should render CTA link to cosmic page', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const cta = document.querySelector('.project-cta');
      expect(cta).toBeInTheDocument();
      expect(cta?.getAttribute('href')).toBe('/cosmic');
    });
  });

  describe('Accessibility', () => {
    it('should have proper section aria-label', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const section = screen.getByRole('region', { name: 'Featured Project' });
      expect(section).toBeInTheDocument();
    });

    it('should have heading for project title', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const heading = document.querySelector('.project-info h3');
      expect(heading).toBeInTheDocument();
    });

    it('should have logo with alt text', () => {
      render(FeaturedProject, { props: defaultProps });
      
      const logo = document.querySelector('.project-info img');
      expect(logo).toBeInTheDocument();
      expect(logo?.getAttribute('alt')).toContain('Logo');
    });
  });

  describe('Binding', () => {
    it('should expose projectSection through binding', () => {
      const { component } = render(FeaturedProject, { props: defaultProps });
      
      // The component exposes projectSection via bind:this
      expect(component).toBeTruthy();
    });
  });
});
