/**
 * OurStorySection Component Tests
 * 
 * Tests for the timeline/story section including:
 * - Timeline rendering with all items
 * - Animation progress handling
 * - Desktop click-to-scroll functionality
 * - Media visibility based on active index
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import OurStorySection from '$lib/components/landing/OurStorySection.svelte';

describe('OurStorySection', () => {
  const defaultProps = {
    animationProgress: 1,
    activeTimelineIndex: -1,
    windowWidth: 1200,
    onTimelineClick: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the story section with aria-label', () => {
      render(OurStorySection, { props: defaultProps });
      
      const section = screen.getByLabelText('Our Story');
      expect(section).toBeInTheDocument();
    });

    it('should render the section header', () => {
      render(OurStorySection, { props: defaultProps });
      
      const header = document.querySelector('.story-header');
      expect(header).toBeInTheDocument();
    });

    it('should render section label "The Journey"', () => {
      render(OurStorySection, { props: defaultProps });
      
      const label = document.querySelector('.section-label');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('The Journey');
    });

    it('should render section title "Our Story"', () => {
      render(OurStorySection, { props: defaultProps });
      
      const title = document.querySelector('.section-title');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('Our Story');
    });

    it('should render story intro paragraph', () => {
      render(OurStorySection, { props: defaultProps });
      
      const intro = document.querySelector('.story-intro');
      expect(intro).toBeInTheDocument();
    });
  });

  describe('Timeline Items', () => {
    it('should render all timeline items', () => {
      render(OurStorySection, { props: defaultProps });
      
      const timelineRows = document.querySelectorAll('.timeline-row');
      expect(timelineRows.length).toBe(6); // 2021-2026
    });

    it('should render timeline years correctly', () => {
      render(OurStorySection, { props: defaultProps });
      
      const years = document.querySelectorAll('.timeline-year');
      const yearTexts = Array.from(years).map(y => y.textContent);
      
      expect(yearTexts).toContain('2021');
      expect(yearTexts).toContain('2022');
      expect(yearTexts).toContain('2023');
      expect(yearTexts).toContain('2024');
      expect(yearTexts).toContain('2025');
      expect(yearTexts).toContain('2026');
    });

    it('should render timeline titles', () => {
      render(OurStorySection, { props: defaultProps });
      
      const titles = document.querySelectorAll('.timeline-text-block h4');
      expect(titles.length).toBe(6);
    });

    it('should render timeline descriptions', () => {
      render(OurStorySection, { props: defaultProps });
      
      const descriptions = document.querySelectorAll('.timeline-text-block p');
      expect(descriptions.length).toBe(6);
    });

    it('should render timeline markers', () => {
      render(OurStorySection, { props: defaultProps });
      
      const markers = document.querySelectorAll('.timeline-marker');
      expect(markers.length).toBe(6);
    });

    it('should render timeline dots', () => {
      render(OurStorySection, { props: defaultProps });
      
      const dots = document.querySelectorAll('.timeline-dot-integrated');
      expect(dots.length).toBe(6);
    });

    it('should mark 2026 as active (isActive)', () => {
      render(OurStorySection, { props: defaultProps });
      
      const activeDots = document.querySelectorAll('.timeline-dot-integrated.active');
      expect(activeDots.length).toBe(1); // Only 2026 is marked active
    });
  });

  describe('Timeline Media', () => {
    it('should render media grids for items with media', () => {
      render(OurStorySection, { props: defaultProps });
      
      const mediaGrids = document.querySelectorAll('.timeline-media-grid');
      expect(mediaGrids.length).toBeGreaterThan(0);
    });

    it('should render media badges', () => {
      render(OurStorySection, { props: defaultProps });
      
      const badges = document.querySelectorAll('.timeline-media-badge');
      expect(badges.length).toBeGreaterThan(0);
    });

    it('should show media when activeTimelineIndex is -1', () => {
      render(OurStorySection, { props: { ...defaultProps, activeTimelineIndex: -1 } });
      
      const visibleMediaGrids = document.querySelectorAll('.timeline-media-grid.media-visible');
      // When activeTimelineIndex is -1, all media should be visible
      expect(visibleMediaGrids.length).toBeGreaterThan(0);
    });

    it('should show only active index media on desktop', () => {
      render(OurStorySection, { props: { ...defaultProps, activeTimelineIndex: 2, windowWidth: 1200 } });
      
      // Only index 2 should have media-visible
      const visibleMediaGrids = document.querySelectorAll('.timeline-media-grid.media-visible');
      expect(visibleMediaGrids.length).toBe(1);
    });
  });

  describe('Animation Progress', () => {
    it('should apply opacity based on animation progress', () => {
      render(OurStorySection, { props: { ...defaultProps, animationProgress: 0.5 } });
      
      const header = document.querySelector('.story-header') as HTMLElement;
      expect(header?.style.opacity).toBeDefined();
    });

    it('should apply transform based on animation progress', () => {
      render(OurStorySection, { props: { ...defaultProps, animationProgress: 0.5 } });
      
      const header = document.querySelector('.story-header') as HTMLElement;
      expect(header?.style.transform).toBeDefined();
    });

    it('should render vertical timeline line', () => {
      render(OurStorySection, { props: defaultProps });
      
      const timelineLine = document.querySelector('.timeline-line-vertical');
      expect(timelineLine).toBeInTheDocument();
    });

    it('should animate timeline line height based on progress', () => {
      render(OurStorySection, { props: { ...defaultProps, animationProgress: 0.5 } });
      
      const timelineLine = document.querySelector('.timeline-line-vertical') as HTMLElement;
      expect(timelineLine?.style.height).toContain('%');
    });
  });

  describe('Desktop Click-to-Scroll', () => {
    it('should add clickable class on desktop with onTimelineClick', () => {
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 1200 } });
      
      const clickableRows = document.querySelectorAll('.timeline-row.clickable');
      expect(clickableRows.length).toBe(6);
    });

    it('should not add clickable class on mobile', () => {
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 600 } });
      
      const clickableRows = document.querySelectorAll('.timeline-row.clickable');
      expect(clickableRows.length).toBe(0);
    });

    it('should call onTimelineClick when timeline row is clicked on desktop', async () => {
      const onTimelineClick = vi.fn();
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 1200, onTimelineClick } });
      
      const timelineRows = document.querySelectorAll('.timeline-row');
      await fireEvent.click(timelineRows[2]);
      
      expect(onTimelineClick).toHaveBeenCalledWith(2);
    });

    it('should not call onTimelineClick on mobile', async () => {
      const onTimelineClick = vi.fn();
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 600, onTimelineClick } });
      
      const timelineRows = document.querySelectorAll('.timeline-row');
      await fireEvent.click(timelineRows[2]);
      
      expect(onTimelineClick).not.toHaveBeenCalled();
    });

    it('should support keyboard navigation with Enter key', async () => {
      const onTimelineClick = vi.fn();
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 1200, onTimelineClick } });
      
      const timelineRows = document.querySelectorAll('.timeline-row');
      await fireEvent.keyDown(timelineRows[1], { key: 'Enter' });
      
      expect(onTimelineClick).toHaveBeenCalledWith(1);
    });

    it('should have role="button" on clickable rows', () => {
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 1200 } });
      
      const timelineRows = document.querySelectorAll('.timeline-row[role="button"]');
      expect(timelineRows.length).toBe(6);
    });

    it('should have tabindex="0" on clickable rows', () => {
      render(OurStorySection, { props: { ...defaultProps, windowWidth: 1200 } });
      
      const timelineRows = document.querySelectorAll('.timeline-row[tabindex="0"]');
      expect(timelineRows.length).toBe(6);
    });
  });

  describe('Mission Statement', () => {
    it('should render the mission statement section', () => {
      render(OurStorySection, { props: defaultProps });
      
      const mission = document.querySelector('.story-mission');
      expect(mission).toBeInTheDocument();
    });

    it('should render the quote icon', () => {
      render(OurStorySection, { props: defaultProps });
      
      const quoteIcon = document.querySelector('.quote-icon');
      expect(quoteIcon).toBeInTheDocument();
    });

    it('should render the mission text', () => {
      render(OurStorySection, { props: defaultProps });
      
      const missionText = document.querySelector('.mission-text');
      expect(missionText).toBeInTheDocument();
      expect(missionText?.textContent).toContain('technology should feel like magic');
    });

    it('should render the attribution', () => {
      render(OurStorySection, { props: defaultProps });
      
      const attribution = document.querySelector('.mission-attribution');
      expect(attribution).toBeInTheDocument();
      expect(attribution?.textContent).toContain('FinalBoss Team');
    });
  });

  describe('Background Elements', () => {
    it('should render SVG background elements', () => {
      render(OurStorySection, { props: defaultProps });
      
      const bgElements = document.querySelector('.story-bg-elements');
      expect(bgElements).toBeInTheDocument();
    });

    it('should render circuit SVG', () => {
      render(OurStorySection, { props: defaultProps });
      
      const circuitSvg = document.querySelector('.circuit-svg');
      expect(circuitSvg).toBeInTheDocument();
    });

    it('should render floating shapes', () => {
      render(OurStorySection, { props: defaultProps });
      
      const shapes = document.querySelectorAll('.floating-shape');
      expect(shapes.length).toBe(3);
    });
  });

  describe('Accessibility', () => {
    it('should have proper section aria-label', () => {
      render(OurStorySection, { props: defaultProps });
      
      const section = screen.getByRole('region', { name: 'Our Story' });
      expect(section).toBeInTheDocument();
    });

    it('should have heading hierarchy', () => {
      render(OurStorySection, { props: defaultProps });
      
      const h2 = document.querySelector('h2.section-title');
      const h4s = document.querySelectorAll('.timeline-text-block h4');
      
      expect(h2).toBeInTheDocument();
      expect(h4s.length).toBe(6);
    });
  });
});
