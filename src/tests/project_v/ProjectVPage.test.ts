/**
 * Project V Page Tests
 * 
 * Tests for the /project_v page which is a "Coming Soon" page for Project V.
 * Features: Smart glasses SVG, title, newsletter signup, KickstarterPromo component.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import ProjectVPage from '../../routes/project_v/+page.svelte';

describe('Project V Page', () => {
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
    it('should render the main element', () => {
      render(ProjectVPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should render coming soon container', () => {
      render(ProjectVPage);
      
      const container = document.querySelector('.coming-soon-container');
      expect(container).toBeInTheDocument();
    });

    it('should render coming soon content', () => {
      render(ProjectVPage);
      
      const content = document.querySelector('.coming-soon-content');
      expect(content).toBeInTheDocument();
    });
  });

  describe('Smart Glasses SVG', () => {
    it('should render glasses container', () => {
      render(ProjectVPage);
      
      const glassesContainer = document.querySelector('.glasses-container');
      expect(glassesContainer).toBeInTheDocument();
    });

    it('should render smart glasses SVG element', () => {
      render(ProjectVPage);
      
      const svgElement = document.querySelector('.smart-glasses');
      expect(svgElement).toBeInTheDocument();
      expect(svgElement?.tagName.toLowerCase()).toBe('svg');
    });

    it('should have correct viewBox on SVG', () => {
      render(ProjectVPage);
      
      const svgElement = document.querySelector('.smart-glasses');
      expect(svgElement?.getAttribute('viewBox')).toBe('0 0 200 80');
    });

    it('should render lens frames', () => {
      render(ProjectVPage);
      
      const lensFrames = document.querySelectorAll('.lens-frame');
      expect(lensFrames.length).toBe(2); // Left and right lens frames
    });

    it('should render lenses', () => {
      render(ProjectVPage);
      
      const lenses = document.querySelectorAll('.lens');
      expect(lenses.length).toBe(2); // Left and right lenses
    });

    it('should render lens reflections', () => {
      render(ProjectVPage);
      
      const reflections = document.querySelectorAll('.lens-reflection');
      expect(reflections.length).toBe(2); // Left and right reflections
    });

    it('should render bridge element', () => {
      render(ProjectVPage);
      
      const bridge = document.querySelector('.bridge');
      expect(bridge).toBeInTheDocument();
    });

    it('should render temple arms', () => {
      render(ProjectVPage);
      
      const templeArms = document.querySelectorAll('.temple-arm');
      expect(templeArms.length).toBe(2); // Left and right arms
    });

    it('should render tech dots', () => {
      render(ProjectVPage);
      
      const techDots = document.querySelectorAll('.tech-dot');
      expect(techDots.length).toBe(2); // Left and right tech dots
    });

    it('should render tech strips', () => {
      render(ProjectVPage);
      
      const techStrips = document.querySelectorAll('.tech-strip');
      expect(techStrips.length).toBe(2); // Left and right tech strips
    });

    it('should render HUD elements group', () => {
      render(ProjectVPage);
      
      const hudElements = document.querySelector('.hud-elements');
      expect(hudElements).toBeInTheDocument();
    });

    it('should render HUD lines', () => {
      render(ProjectVPage);
      
      const hudLines = document.querySelectorAll('.hud-line');
      expect(hudLines.length).toBe(6); // 3 left + 3 right HUD lines
    });
  });

  describe('Title Section', () => {
    it('should render the page title', () => {
      render(ProjectVPage);
      
      expect(screen.getByText('#PROJECT_V')).toBeInTheDocument();
    });

    it('should have gradient text class on title', () => {
      render(ProjectVPage);
      
      const title = document.querySelector('.coming-soon-title');
      expect(title).toBeInTheDocument();
      expect(title?.classList.contains('gradient-text')).toBe(true);
    });

    it('should render the divider', () => {
      render(ProjectVPage);
      
      const divider = document.querySelector('.coming-soon-divider');
      expect(divider).toBeInTheDocument();
    });
  });

  describe('Coming Soon Message', () => {
    it('should render "Coming Soon" message', () => {
      render(ProjectVPage);
      
      // "Coming Soon" appears in main content (message) and in KickstarterPromo badge
      const comingSoonElements = screen.getAllByText('Coming Soon');
      expect(comingSoonElements.length).toBeGreaterThanOrEqual(1);
      
      // Verify the main page message specifically
      const mainMessage = document.querySelector('.coming-soon-message');
      expect(mainMessage?.textContent?.trim()).toBe('Coming Soon');
    });

    it('should have gold header text class on message', () => {
      render(ProjectVPage);
      
      const message = document.querySelector('.coming-soon-message');
      expect(message).toBeInTheDocument();
      expect(message?.classList.contains('gold-header-text')).toBe(true);
    });

    it('should render subtitle', () => {
      render(ProjectVPage);
      
      expect(screen.getByText('Our most ambitious project yet.')).toBeInTheDocument();
    });

    it('should have subtitle with proper class', () => {
      render(ProjectVPage);
      
      const subtitle = document.querySelector('.coming-soon-subtitle');
      expect(subtitle).toBeInTheDocument();
    });
  });

  describe('Newsletter Section', () => {
    it('should render newsletter container', () => {
      render(ProjectVPage);
      
      const newsletterContainer = document.querySelector('.newsletter-container');
      expect(newsletterContainer).toBeInTheDocument();
    });

    it('should render newsletter header', () => {
      render(ProjectVPage);
      
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
    });

    it('should have newsletter header with proper class', () => {
      render(ProjectVPage);
      
      const header = document.querySelector('.newsletter-header');
      expect(header).toBeInTheDocument();
    });

    it('should render NewsletterSignup component', () => {
      render(ProjectVPage);
      
      // NewsletterSignup renders a form
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(ProjectVPage);
      
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it('should render name input field', () => {
      render(ProjectVPage);
      
      // showName={true} is passed to NewsletterSignup
      const nameInput = document.querySelector('input[type="text"]');
      expect(nameInput).toBeInTheDocument();
    });

    it('should render subscribe button', () => {
      render(ProjectVPage);
      
      const submitBtn = screen.getByRole('button', { name: /subscribe/i });
      expect(submitBtn).toBeInTheDocument();
    });
  });

  describe('KickstarterPromo Integration', () => {
    it('should render KickstarterPromo component', () => {
      render(ProjectVPage);
      
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
    });

    it('should render Kickstarter logo', () => {
      render(ProjectVPage);
      
      const kickstarterLogo = document.querySelector('.kickstarter-logo');
      expect(kickstarterLogo).toBeInTheDocument();
    });

    it('should render Coming Soon badge in promo', () => {
      render(ProjectVPage);
      
      // KickstarterPromo has "Coming Soon" badge
      expect(screen.getAllByText('Coming Soon').length).toBeGreaterThanOrEqual(1);
    });

    it('should render Support Our Campaign heading', () => {
      render(ProjectVPage);
      
      expect(screen.getByText('Support Our Campaign')).toBeInTheDocument();
    });

    it('should render Visit Kickstarter Page link', () => {
      render(ProjectVPage);
      
      const kickstarterLink = screen.getByRole('link', { name: /visit kickstarter page/i });
      expect(kickstarterLink).toBeInTheDocument();
      expect(kickstarterLink.getAttribute('href')).toBe('https://www.kickstarter.com/');
    });
  });

  describe('Styling', () => {
    it('should have h1 element for title', () => {
      render(ProjectVPage);
      
      const h1 = document.querySelector('h1.coming-soon-title');
      expect(h1).toBeInTheDocument();
    });

    it('should have h3 element for newsletter header', () => {
      render(ProjectVPage);
      
      const h3 = document.querySelector('h3.newsletter-header');
      expect(h3).toBeInTheDocument();
    });

    it('should have proper container styling', () => {
      render(ProjectVPage);
      
      const container = document.querySelector('.coming-soon-container');
      expect(container).toBeInTheDocument();
    });
  });

  describe('SVG Structure', () => {
    it('should have SVG with proper namespace', () => {
      render(ProjectVPage);
      
      const svg = document.querySelector('.smart-glasses');
      expect(svg?.getAttribute('xmlns')).toBe('http://www.w3.org/2000/svg');
    });

    it('should have left lens at correct position', () => {
      render(ProjectVPage);
      
      const lensFrames = document.querySelectorAll('.lens-frame');
      const leftFrame = lensFrames[0];
      expect(leftFrame?.getAttribute('x')).toBe('10');
      expect(leftFrame?.getAttribute('y')).toBe('20');
    });

    it('should have right lens at correct position', () => {
      render(ProjectVPage);
      
      const lensFrames = document.querySelectorAll('.lens-frame');
      const rightFrame = lensFrames[1];
      expect(rightFrame?.getAttribute('x')).toBe('120');
      expect(rightFrame?.getAttribute('y')).toBe('20');
    });

    it('should have circular tech dots', () => {
      render(ProjectVPage);
      
      const techDots = document.querySelectorAll('.tech-dot');
      techDots.forEach(dot => {
        expect(dot.tagName.toLowerCase()).toBe('circle');
        expect(dot.getAttribute('r')).toBe('3');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark', () => {
      render(ProjectVPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have heading hierarchy', () => {
      render(ProjectVPage);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');
      
      expect(h1s.length).toBeGreaterThan(0);
      // h2 may be in KickstarterPromo
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should have form with proper inputs', () => {
      render(ProjectVPage);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      
      const inputs = form?.querySelectorAll('input');
      expect(inputs?.length).toBeGreaterThanOrEqual(2); // name and email
    });

    it('should have submit button in form', () => {
      render(ProjectVPage);
      
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('should display PROJECT_V as the project name', () => {
      render(ProjectVPage);
      
      const title = screen.getByText('#PROJECT_V');
      expect(title).toBeInTheDocument();
    });

    it('should indicate this is coming soon', () => {
      render(ProjectVPage);
      
      // "Coming Soon" appears in main content and in KickstarterPromo badge
      const message = document.querySelector('.coming-soon-message');
      expect(message).toBeInTheDocument();
      expect(message?.textContent?.trim()).toBe('Coming Soon');
    });

    it('should have subtitle describing the project', () => {
      render(ProjectVPage);
      
      expect(screen.getByText('Our most ambitious project yet.')).toBeInTheDocument();
    });

    it('should have call to action for newsletter', () => {
      render(ProjectVPage);
      
      expect(screen.getByText('Subscribe to Newsletter')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => render(ProjectVPage)).not.toThrow();
    });

    it('should render NewsletterSignup from $lib', () => {
      render(ProjectVPage);
      
      // NewsletterSignup should render with stacked variant
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render KickstarterPromo from $lib', () => {
      render(ProjectVPage);
      
      // KickstarterPromo should render (without cosmic variant)
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
      // Should NOT have cosmic class (default variant)
      expect(kickstarterSection?.classList.contains('cosmic')).toBe(false);
    });
  });

  describe('Visual Elements', () => {
    it('should have glasses container for floating animation', () => {
      render(ProjectVPage);
      
      const glassesContainer = document.querySelector('.glasses-container');
      expect(glassesContainer).toBeInTheDocument();
    });

    it('should have divider element', () => {
      render(ProjectVPage);
      
      const divider = document.querySelector('.coming-soon-divider');
      expect(divider).toBeInTheDocument();
    });

    it('should have all major visual sections', () => {
      render(ProjectVPage);
      
      // Glasses
      expect(document.querySelector('.glasses-container')).toBeInTheDocument();
      // Title
      expect(document.querySelector('.coming-soon-title')).toBeInTheDocument();
      // Divider
      expect(document.querySelector('.coming-soon-divider')).toBeInTheDocument();
      // Message
      expect(document.querySelector('.coming-soon-message')).toBeInTheDocument();
      // Subtitle
      expect(document.querySelector('.coming-soon-subtitle')).toBeInTheDocument();
      // Newsletter
      expect(document.querySelector('.newsletter-container')).toBeInTheDocument();
      // Kickstarter
      expect(document.querySelector('.kickstarter-section')).toBeInTheDocument();
    });
  });

  describe('Newsletter Form Behavior', () => {
    it('should have email input with label', () => {
      render(ProjectVPage);
      
      // The NewsletterSignup uses floating labels, not placeholders
      const emailLabel = screen.getByText('Enter your email');
      expect(emailLabel).toBeInTheDocument();
    });

    it('should have name input field visible', () => {
      render(ProjectVPage);
      
      // showName={true} is passed - label says "Name (optional)"
      const nameLabel = screen.getByText('Name (optional)');
      expect(nameLabel).toBeInTheDocument();
    });

    it('should have subscribe button with correct text', () => {
      render(ProjectVPage);
      
      // buttonText="Subscribe" is passed
      const button = screen.getByRole('button', { name: /subscribe/i });
      expect(button).toBeInTheDocument();
    });

    it('should have email input field', () => {
      render(ProjectVPage);
      
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it('should have name input field', () => {
      render(ProjectVPage);
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput).toBeInTheDocument();
    });
  });
});
