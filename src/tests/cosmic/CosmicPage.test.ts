/**
 * Cosmic Collisions Page Tests
 * 
 * Tests for the /cosmic page which showcases the Cosmic Collisions game.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/svelte';
import CosmicPage from '../../routes/cosmic/+page.svelte';

describe('Cosmic Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock window.open for external links
    vi.spyOn(window, 'open').mockImplementation(() => null);
    
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
      render(CosmicPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have proper page structure with main container', () => {
      render(CosmicPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
      expect(main?.children.length).toBeGreaterThan(0);
    });
  });

  describe('Hero Section', () => {
    it('should render the Cosmic Collisions logo', () => {
      render(CosmicPage);
      
      const logo = document.querySelector('img[alt="Cosmic Collisions Logo"]');
      expect(logo).toBeInTheDocument();
      expect(logo?.getAttribute('src')).toContain('CC_LogoAnimated.webp');
    });

    it('should render the game title', () => {
      render(CosmicPage);
      
      // The title appears multiple times (KickstarterPromo also has it)
      const titles = screen.getAllByText('Cosmic Collisions');
      expect(titles.length).toBeGreaterThan(0);
    });

    it('should render the game subtitle', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Defend the Solar System in Augmented Reality')).toBeInTheDocument();
    });

    it('should render Android platform badge', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Android Demo Available')).toBeInTheDocument();
    });

    it('should render genre tags', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Arcade')).toBeInTheDocument();
      expect(screen.getByText('Space Shooter')).toBeInTheDocument();
      expect(screen.getByText('RPG')).toBeInTheDocument();
      expect(screen.getByText('AR (Augmented Reality)')).toBeInTheDocument();
    });

    it('should mention classic games in description', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Galaga')).toBeInTheDocument();
      expect(screen.getByText('Space Invaders')).toBeInTheDocument();
    });

    it('should render Leaderboards button', () => {
      render(CosmicPage);
      
      // Query by href since role query may not work for styled links
      const leaderboardsBtn = document.querySelector('a[href="/leaderboards"]');
      expect(leaderboardsBtn).toBeInTheDocument();
      expect(leaderboardsBtn?.textContent).toContain('Leaderboards');
    });

    it('should render Play Demo button', () => {
      render(CosmicPage);
      
      // Query by href since role query may not work for styled links
      const demoBtn = document.querySelector('a[href="#demo"]');
      expect(demoBtn).toBeInTheDocument();
      expect(demoBtn?.textContent).toContain('Play Demo');
    });

    it('should have background video element', () => {
      render(CosmicPage);
      
      const videos = document.querySelectorAll('video');
      const bgVideo = Array.from(videos).find(v => 
        v.getAttribute('src')?.includes('space_rock_2.mp4')
      );
      expect(bgVideo).toBeInTheDocument();
    });

    it('should render header card with proper classes', () => {
      render(CosmicPage);
      
      const headerCard = document.querySelector('.header-card');
      expect(headerCard).toBeInTheDocument();
    });
  });

  describe('Demo Section', () => {
    it('should render demo section with id', () => {
      render(CosmicPage);
      
      const demoSection = document.querySelector('#demo');
      expect(demoSection).toBeInTheDocument();
    });

    it('should render demo status badge', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Demo Available')).toBeInTheDocument();
    });

    it('should render Play the Demo title', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Play the Demo')).toBeInTheDocument();
    });

    it('should render demo feature tags', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Tutorial Mission')).toBeInTheDocument();
      expect(screen.getByText('Flight Mission #01')).toBeInTheDocument();
      expect(screen.getByText('Survival Mode')).toBeInTheDocument();
    });

    it('should render Download Now section', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Download Now')).toBeInTheDocument();
    });

    it('should render iOS TestFlight button', () => {
      render(CosmicPage);
      
      const iosBtn = screen.getByRole('button', { name: /download via testflight/i });
      expect(iosBtn).toBeInTheDocument();
    });

    it('should render Android APK button', () => {
      render(CosmicPage);
      
      const androidBtn = screen.getByRole('button', { name: /download android apk/i });
      expect(androidBtn).toBeInTheDocument();
    });

    it('should open TestFlight link on iOS button click', async () => {
      render(CosmicPage);
      
      const iosBtn = screen.getByRole('button', { name: /download via testflight/i });
      await fireEvent.click(iosBtn);
      
      expect(window.open).toHaveBeenCalledWith(
        'https://testflight.apple.com/join/FYcWW7qk',
        '_blank'
      );
    });

    it('should open Google Groups link on Android button click', async () => {
      render(CosmicPage);
      
      const androidBtn = screen.getByRole('button', { name: /download android apk/i });
      await fireEvent.click(androidBtn);
      
      expect(window.open).toHaveBeenCalledWith(
        'https://groups.google.com/g/cosmic-collisions-testers',
        '_blank'
      );
    });

    it('should render phone mockup with video', () => {
      render(CosmicPage);
      
      const phoneMockup = document.querySelector('.phone-mockup');
      expect(phoneMockup).toBeInTheDocument();
    });

    it('should render demo video badges', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Live Gameplay')).toBeInTheDocument();
      expect(screen.getByText('Alpha Development')).toBeInTheDocument();
    });

    it('should render demo info card', () => {
      render(CosmicPage);
      
      const demoCard = document.querySelector('.demo-info-card');
      expect(demoCard).toBeInTheDocument();
    });
  });

  describe('Characters Section', () => {
    it('should render Characters heading', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Characters')).toBeInTheDocument();
    });

    it('should render all 5 characters', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Captain Phoenix')).toBeInTheDocument();
      expect(screen.getByText('Riley')).toBeInTheDocument();
      expect(screen.getByText('Johnny Sparks')).toBeInTheDocument();
      expect(screen.getByText('Xylo')).toBeInTheDocument();
      expect(screen.getByText('AI Wraith')).toBeInTheDocument();
    });

    it('should render character titles', () => {
      render(CosmicPage);
      
      expect(screen.getByText('The Captain')).toBeInTheDocument();
      expect(screen.getByText('The Engineer')).toBeInTheDocument();
      expect(screen.getByText('The Rookie')).toBeInTheDocument();
      expect(screen.getByText('The Alien')).toBeInTheDocument();
      expect(screen.getByText('The AI')).toBeInTheDocument();
    });

    it('should render character special abilities', () => {
      render(CosmicPage);
      
      expect(screen.getByText(/Piercing Shots/)).toBeInTheDocument();
      expect(screen.getByText(/Repair Portal/)).toBeInTheDocument();
      expect(screen.getByText(/Health Regeneration/)).toBeInTheDocument();
      // Defense appears in multiple places, so use getAllByText
      const defenseElements = screen.getAllByText(/Defense/);
      expect(defenseElements.length).toBeGreaterThan(0);
      expect(screen.getByText(/Speed Increase/)).toBeInTheDocument();
    });

    it('should render pilot cards', () => {
      render(CosmicPage);
      
      const pilotCards = document.querySelectorAll('.pilot-card');
      expect(pilotCards.length).toBe(5);
    });

    it('should render character videos', () => {
      render(CosmicPage);
      
      const pilotCards = document.querySelectorAll('.pilot-card');
      pilotCards.forEach(card => {
        const video = card.querySelector('video');
        expect(video).toBeInTheDocument();
      });
    });

    it('should render character number badges', () => {
      render(CosmicPage);
      
      // Characters are numbered 1-5
      for (let i = 1; i <= 5; i++) {
        expect(screen.getByText(i.toString())).toBeInTheDocument();
      }
    });
  });

  describe('Hiring Section', () => {
    it('should render hiring banner', () => {
      render(CosmicPage);
      
      expect(screen.getByText("We're Hiring!")).toBeInTheDocument();
    });

    it('should mention Graphic Designer role', () => {
      render(CosmicPage);
      
      expect(screen.getByText(/Graphic Designer & Illustrator/)).toBeInTheDocument();
    });

    it('should have link to jobs page', () => {
      render(CosmicPage);
      
      const jobsLink = screen.getByRole('link', { name: /view open positions/i });
      expect(jobsLink).toBeInTheDocument();
      expect(jobsLink.getAttribute('href')).toBe('/jobs');
    });
  });

  describe('Lore Section', () => {
    it('should render Story badge', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Story')).toBeInTheDocument();
    });

    it('should render The Lore title', () => {
      render(CosmicPage);
      
      expect(screen.getByText('The Lore')).toBeInTheDocument();
    });

    it('should render year setting', () => {
      render(CosmicPage);
      
      expect(screen.getByText(/Year 2157/)).toBeInTheDocument();
    });

    it('should mention SSDF in lore', () => {
      render(CosmicPage);
      
      expect(screen.getByText(/Solar System Defense Force/)).toBeInTheDocument();
    });

    it('should render Captain Phoenix quote', () => {
      render(CosmicPage);
      
      expect(screen.getByText(/The Sun is essential to all life/)).toBeInTheDocument();
      expect(screen.getByText(/— Captain Phoenix, SSDF Commander/)).toBeInTheDocument();
    });

    it('should render lore tags', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Earth')).toBeInTheDocument();
      expect(screen.getByText('The Sun')).toBeInTheDocument();
      expect(screen.getByText('Alien Invasion')).toBeInTheDocument();
    });

    it('should have lore background video', () => {
      render(CosmicPage);
      
      const videos = document.querySelectorAll('video');
      const loreVideo = Array.from(videos).find(v => 
        v.getAttribute('src')?.includes('SpaceAnimatedVideo.mp4')
      );
      expect(loreVideo).toBeInTheDocument();
    });

    it('should render lore card', () => {
      render(CosmicPage);
      
      const loreCard = document.querySelector('.lore-card');
      expect(loreCard).toBeInTheDocument();
    });
  });

  describe('KickstarterPromo Integration', () => {
    it('should render KickstarterPromo component', () => {
      render(CosmicPage);
      
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
    });

    it('should render Kickstarter logo', () => {
      render(CosmicPage);
      
      const kickstarterLogo = document.querySelector('.kickstarter-logo');
      expect(kickstarterLogo).toBeInTheDocument();
    });

    it('should render Coming Soon badge', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Coming Soon')).toBeInTheDocument();
    });

    it('should render Support Our Campaign heading', () => {
      render(CosmicPage);
      
      expect(screen.getByText('Support Our Campaign')).toBeInTheDocument();
    });

    it('should render launch date info', () => {
      render(CosmicPage);
      
      expect(screen.getByText(/Q2 2026/)).toBeInTheDocument();
    });

    it('should render Visit Kickstarter Page button', () => {
      render(CosmicPage);
      
      const kickstarterLink = screen.getByRole('link', { name: /visit kickstarter page/i });
      expect(kickstarterLink).toBeInTheDocument();
      expect(kickstarterLink.getAttribute('href')).toBe('https://www.kickstarter.com/');
    });
  });

  describe('Contact Form Integration', () => {
    it('should render ContactForm component', () => {
      render(CosmicPage);
      
      const contactForm = document.querySelector('form');
      expect(contactForm).toBeInTheDocument();
    });

    it('should render CONTACT US heading', () => {
      render(CosmicPage);
      
      expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    });

    it('should render contact form fields', () => {
      render(CosmicPage);
      
      expect(screen.getByLabelText(/first & last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your message/i)).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(CosmicPage);
      
      const submitBtn = screen.getByRole('button', { name: /submit/i });
      expect(submitBtn).toBeInTheDocument();
    });
  });

  describe('Video Elements', () => {
    it('should have multiple video elements', () => {
      render(CosmicPage);
      
      const videos = document.querySelectorAll('video');
      // Background video, demo video, character videos (5), lore video
      expect(videos.length).toBeGreaterThanOrEqual(3);
    });

    it('should have autoplay attributes on videos', () => {
      render(CosmicPage);
      
      const videos = document.querySelectorAll('video');
      const autoplayVideos = Array.from(videos).filter(v => v.hasAttribute('autoplay'));
      expect(autoplayVideos.length).toBeGreaterThan(0);
    });

    it('should have loop attribute on background videos', () => {
      render(CosmicPage);
      
      const videos = document.querySelectorAll('video');
      const loopingVideos = Array.from(videos).filter(v => v.hasAttribute('loop'));
      expect(loopingVideos.length).toBeGreaterThan(0);
    });

    it('should have playsinline attribute for mobile compatibility', () => {
      render(CosmicPage);
      
      const videos = document.querySelectorAll('video');
      const playsInlineVideos = Array.from(videos).filter(v => v.hasAttribute('playsinline'));
      expect(playsInlineVideos.length).toBeGreaterThan(0);
    });
  });

  describe('Styling and Visual Elements', () => {
    it('should have gradient text elements', () => {
      render(CosmicPage);
      
      const gradientText = document.querySelector('.gradient-text');
      expect(gradientText).toBeInTheDocument();
    });

    it('should have gold header text', () => {
      render(CosmicPage);
      
      const goldText = document.querySelectorAll('.gold-header-text');
      expect(goldText.length).toBeGreaterThan(0);
    });

    it('should have green header text', () => {
      render(CosmicPage);
      
      const greenText = document.querySelectorAll('.green-header-text');
      expect(greenText.length).toBeGreaterThan(0);
    });

    it('should have glow text effect', () => {
      render(CosmicPage);
      
      const glowText = document.querySelector('.glow-text');
      expect(glowText).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('should have anchor link to demo section', () => {
      render(CosmicPage);
      
      const demoLink = document.querySelector('a[href="#demo"]');
      expect(demoLink).toBeInTheDocument();
      expect(demoLink?.getAttribute('href')).toBe('#demo');
    });

    it('should have leaderboards link', () => {
      render(CosmicPage);
      
      const leaderboardsLink = document.querySelector('a[href="/leaderboards"]');
      expect(leaderboardsLink).toBeInTheDocument();
      expect(leaderboardsLink?.getAttribute('href')).toBe('/leaderboards');
    });

    it('should have jobs link', () => {
      render(CosmicPage);
      
      const jobsLink = screen.getByRole('link', { name: /view open positions/i });
      expect(jobsLink.getAttribute('href')).toBe('/jobs');
    });
  });

  describe('External Links', () => {
    it('should have TestFlight link functionality', async () => {
      render(CosmicPage);
      
      const iosBtn = screen.getByRole('button', { name: /download via testflight/i });
      await fireEvent.click(iosBtn);
      
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('testflight.apple.com'),
        '_blank'
      );
    });

    it('should have Android tester group link functionality', async () => {
      render(CosmicPage);
      
      const androidBtn = screen.getByRole('button', { name: /download android apk/i });
      await fireEvent.click(androidBtn);
      
      expect(window.open).toHaveBeenCalledWith(
        expect.stringContaining('groups.google.com'),
        '_blank'
      );
    });

    it('should have Kickstarter link with proper attributes', () => {
      render(CosmicPage);
      
      const kickstarterLink = screen.getByRole('link', { name: /visit kickstarter page/i });
      expect(kickstarterLink.getAttribute('target')).toBe('_blank');
      expect(kickstarterLink.getAttribute('rel')).toContain('noopener');
    });
  });

  describe('Accessibility', () => {
    it('should have alt text on logo image', () => {
      render(CosmicPage);
      
      const logo = document.querySelector('img[alt="Cosmic Collisions Logo"]');
      expect(logo).toBeInTheDocument();
    });

    it('should have heading hierarchy', () => {
      render(CosmicPage);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      
      expect(h1s.length).toBeGreaterThan(0);
      expect(h2s.length).toBeGreaterThan(0);
    });

    it('should have descriptive link text', () => {
      render(CosmicPage);
      
      const leaderboardsLink = document.querySelector('a[href="/leaderboards"]');
      const jobsLink = document.querySelector('a[href="/jobs"]');
      
      expect(leaderboardsLink).toBeInTheDocument();
      expect(jobsLink).toBeInTheDocument();
    });

    it('should have buttons with accessible names', () => {
      render(CosmicPage);
      
      const iosBtn = screen.getByRole('button', { name: /download via testflight/i });
      const androidBtn = screen.getByRole('button', { name: /download android apk/i });
      
      expect(iosBtn).toBeInTheDocument();
      expect(androidBtn).toBeInTheDocument();
    });

    it('should have form labels', () => {
      render(CosmicPage);
      
      expect(screen.getByLabelText(/first & last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct number of characters', () => {
      render(CosmicPage);
      
      const characters = ['Captain Phoenix', 'Riley', 'Johnny Sparks', 'Xylo', 'AI Wraith'];
      characters.forEach(name => {
        expect(screen.getByText(name)).toBeInTheDocument();
      });
    });

    it('should display correct character count in cards', () => {
      render(CosmicPage);
      
      const pilotCards = document.querySelectorAll('.pilot-card');
      expect(pilotCards.length).toBe(5);
    });

    it('should have correct genre count', () => {
      render(CosmicPage);
      
      const genres = ['Arcade', 'Space Shooter', 'RPG', 'AR (Augmented Reality)'];
      genres.forEach(genre => {
        expect(screen.getByText(genre)).toBeInTheDocument();
      });
    });

    it('should mention SSDF in description', () => {
      render(CosmicPage);
      
      const ssdfMentions = screen.getAllByText(/SSDF/);
      expect(ssdfMentions.length).toBeGreaterThan(0);
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => render(CosmicPage)).not.toThrow();
    });

    it('should render ContactForm from $lib', () => {
      render(CosmicPage);
      
      // Contact form should be rendered
      const contactForm = document.querySelector('form');
      expect(contactForm).toBeInTheDocument();
    });

    it('should render KickstarterPromo from $lib', () => {
      render(CosmicPage);
      
      // KickstarterPromo should be rendered with cosmic variant
      const kickstarterSection = document.querySelector('.kickstarter-section.cosmic');
      expect(kickstarterSection).toBeInTheDocument();
    });
  });
});
