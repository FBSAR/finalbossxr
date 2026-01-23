/**
 * About Page Tests
 * 
 * Tests for the /about page which displays the Final Boss team.
 * Features: Founders, Team, Advisors sections with profile cards, ContactForm, KickstarterPromo.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/svelte';
import AboutPage from '../../routes/about/+page.svelte';

describe('About Page', () => {
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
      render(AboutPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should render page header', () => {
      render(AboutPage);
      
      expect(screen.getByText('ABOUT US')).toBeInTheDocument();
    });

    it('should have gradient text class on title', () => {
      render(AboutPage);
      
      const title = document.querySelector('h1.gradient-text');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('ABOUT US');
    });

    it('should have jersey font on title', () => {
      render(AboutPage);
      
      const title = document.querySelector('h1.jersey-font');
      expect(title).toBeInTheDocument();
    });

    it('should render introductory text', () => {
      render(AboutPage);
      
      expect(screen.getByText('Introducing the Final Boss team.')).toBeInTheDocument();
    });
  });

  describe('Founders Section', () => {
    it('should render founders section title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Founders')).toBeInTheDocument();
    });

    it('should have gold header text on founders title', () => {
      render(AboutPage);
      
      const foundersTitle = screen.getByText('Founders');
      expect(foundersTitle.classList.contains('gold-header-text')).toBe(true);
    });

    it('should render Eddie Taliaferro II', () => {
      render(AboutPage);
      
      expect(screen.getByText('Eddie Taliaferro II')).toBeInTheDocument();
    });

    it('should render Keith Dunklin', () => {
      render(AboutPage);
      
      expect(screen.getByText('Keith Dunklin')).toBeInTheDocument();
    });

    it('should display CEO title for Eddie', () => {
      render(AboutPage);
      
      expect(screen.getByText('CEO / Co-Founder / Software Developer')).toBeInTheDocument();
    });

    it('should display COO title for Keith', () => {
      render(AboutPage);
      
      expect(screen.getByText('COO / Co-Founder / Game Developer')).toBeInTheDocument();
    });

    it('should render founder photos', () => {
      render(AboutPage);
      
      const eddiePhoto = screen.getByAltText('Eddie Taliaferro II');
      const keithPhoto = screen.getByAltText('Keith Dunklin');
      
      expect(eddiePhoto).toBeInTheDocument();
      expect(keithPhoto).toBeInTheDocument();
    });

    it('should have correct photo URLs for founders', () => {
      render(AboutPage);
      
      const eddiePhoto = screen.getByAltText('Eddie Taliaferro II') as HTMLImageElement;
      const keithPhoto = screen.getByAltText('Keith Dunklin') as HTMLImageElement;
      
      expect(eddiePhoto.src).toContain('eddie-pro-pic-11-25.png');
      expect(keithPhoto.src).toContain('keith-pic.jpg');
    });

    it('should render LinkedIn links for founders', () => {
      render(AboutPage);
      
      const linkedinLinks = document.querySelectorAll('a.linkedin-link');
      // At least 2 for founders
      expect(linkedinLinks.length).toBeGreaterThanOrEqual(2);
    });

    it('should have correct LinkedIn URL for Eddie', () => {
      render(AboutPage);
      
      const eddieLinkedIn = document.querySelector('a[href="https://www.linkedin.com/in/eddie-taliaferro-ii"]');
      expect(eddieLinkedIn).toBeInTheDocument();
    });

    it('should have correct LinkedIn URL for Keith', () => {
      render(AboutPage);
      
      const keithLinkedIn = document.querySelector('a[href="https://www.linkedin.com/in/keith-dunklin-9a838543/"]');
      expect(keithLinkedIn).toBeInTheDocument();
    });
  });

  describe('Team Section', () => {
    it('should render team section title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Team')).toBeInTheDocument();
    });

    it('should have gold header text on team title', () => {
      render(AboutPage);
      
      const teamTitle = screen.getByText('Team');
      expect(teamTitle.classList.contains('gold-header-text')).toBe(true);
    });

    it('should render Aaron Goodson', () => {
      render(AboutPage);
      
      expect(screen.getByText('Aaron Goodson')).toBeInTheDocument();
    });

    it('should render Richard Davis III', () => {
      render(AboutPage);
      
      expect(screen.getByText('Richard Davis III')).toBeInTheDocument();
    });

    it('should display Senior Software Developer title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Senior Software Developer')).toBeInTheDocument();
    });

    it('should display Sound Design / 3D Modeling title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Sound Design / 3D Modeling & Printing')).toBeInTheDocument();
    });

    it('should render team member photos', () => {
      render(AboutPage);
      
      const aaronPhoto = screen.getByAltText('Aaron Goodson');
      const richardPhoto = screen.getByAltText('Richard Davis III');
      
      expect(aaronPhoto).toBeInTheDocument();
      expect(richardPhoto).toBeInTheDocument();
    });

    it('should have correct photo URLs for team', () => {
      render(AboutPage);
      
      const aaronPhoto = screen.getByAltText('Aaron Goodson') as HTMLImageElement;
      const richardPhoto = screen.getByAltText('Richard Davis III') as HTMLImageElement;
      
      expect(aaronPhoto.src).toContain('fbs-aaron.png');
      expect(richardPhoto.src).toContain('fbs-richard.png');
    });

    it('should have correct LinkedIn URL for Aaron', () => {
      render(AboutPage);
      
      const aaronLinkedIn = document.querySelector('a[href="https://www.linkedin.com/in/aaron-goodson-a14187153/"]');
      expect(aaronLinkedIn).toBeInTheDocument();
    });

    it('should have correct LinkedIn URL for Richard', () => {
      render(AboutPage);
      
      const richardLinkedIn = document.querySelector('a[href="https://www.linkedin.com/in/richard-davis-iii-300703240/"]');
      expect(richardLinkedIn).toBeInTheDocument();
    });
  });

  describe('Advisors Section', () => {
    it('should render advisors section title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Advisors')).toBeInTheDocument();
    });

    it('should have gold header text on advisors title', () => {
      render(AboutPage);
      
      const advisorsTitle = screen.getByText('Advisors');
      expect(advisorsTitle.classList.contains('gold-header-text')).toBe(true);
    });

    it('should render Edward Kim', () => {
      render(AboutPage);
      
      expect(screen.getByText('Edward Kim')).toBeInTheDocument();
    });

    it('should render Terrell Thomas', () => {
      render(AboutPage);
      
      expect(screen.getByText('Terrell Thomas')).toBeInTheDocument();
    });

    it('should display Business Advisor title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Business Advisor')).toBeInTheDocument();
    });

    it('should display Legal Advisor title', () => {
      render(AboutPage);
      
      expect(screen.getByText('Legal Advisor')).toBeInTheDocument();
    });

    it('should render advisor photos', () => {
      render(AboutPage);
      
      const edwardPhoto = screen.getByAltText('Edward Kim');
      const terrellPhoto = screen.getByAltText('Terrell Thomas');
      
      expect(edwardPhoto).toBeInTheDocument();
      expect(terrellPhoto).toBeInTheDocument();
    });

    it('should have correct photo URLs for advisors', () => {
      render(AboutPage);
      
      const edwardPhoto = screen.getByAltText('Edward Kim') as HTMLImageElement;
      const terrellPhoto = screen.getByAltText('Terrell Thomas') as HTMLImageElement;
      
      expect(edwardPhoto.src).toContain('ed-pic-2.jpeg');
      expect(terrellPhoto.src).toContain('terrel_pic.png');
    });

    it('should have correct LinkedIn URL for Edward', () => {
      render(AboutPage);
      
      const edwardLinkedIn = document.querySelector('a[href="https://www.linkedin.com/in/edwardkim1/"]');
      expect(edwardLinkedIn).toBeInTheDocument();
    });

    it('should have correct LinkedIn URL for Terrell', () => {
      render(AboutPage);
      
      const terrellLinkedIn = document.querySelector('a[href="https://www.linkedin.com/in/terrell-thomas-927a0123/"]');
      expect(terrellLinkedIn).toBeInTheDocument();
    });
  });

  describe('Team Cards Structure', () => {
    it('should render team cards', () => {
      render(AboutPage);
      
      const teamCards = document.querySelectorAll('.team-card');
      expect(teamCards.length).toBe(6); // 2 founders + 2 team + 2 advisors
    });

    it('should render cards grid containers', () => {
      render(AboutPage);
      
      const cardsGrids = document.querySelectorAll('.cards-grid');
      expect(cardsGrids.length).toBe(3); // Founders, Team, Advisors
    });

    it('should render section containers', () => {
      render(AboutPage);
      
      const sectionContainers = document.querySelectorAll('.section-container');
      expect(sectionContainers.length).toBe(3); // Founders, Team, Advisors
    });

    it('should render card image containers', () => {
      render(AboutPage);
      
      const imageContainers = document.querySelectorAll('.card-image-container');
      expect(imageContainers.length).toBe(6);
    });

    it('should render card content sections', () => {
      render(AboutPage);
      
      const cardContents = document.querySelectorAll('.card-content');
      expect(cardContents.length).toBe(6);
    });

    it('should have green header text on all names', () => {
      render(AboutPage);
      
      const greenHeaders = document.querySelectorAll('.card-name.green-header-text');
      expect(greenHeaders.length).toBe(6);
    });
  });

  describe('LinkedIn Links', () => {
    it('should render all LinkedIn links', () => {
      render(AboutPage);
      
      const linkedinLinks = document.querySelectorAll('.linkedin-link');
      expect(linkedinLinks.length).toBe(6);
    });

    it('should have target="_blank" on all LinkedIn links', () => {
      render(AboutPage);
      
      const linkedinLinks = document.querySelectorAll('.linkedin-link');
      linkedinLinks.forEach(link => {
        expect(link.getAttribute('target')).toBe('_blank');
      });
    });

    it('should have LinkedIn icon in each link', () => {
      render(AboutPage);
      
      const linkedinLinks = document.querySelectorAll('.linkedin-link');
      linkedinLinks.forEach(link => {
        // LinkedinSolid component renders an SVG
        const svg = link.querySelector('svg');
        expect(svg).toBeInTheDocument();
      });
    });
  });

  describe('ContactForm Integration', () => {
    it('should render ContactForm component', () => {
      render(AboutPage);
      
      // ContactForm has a form element
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render contact form wrapper', () => {
      render(AboutPage);
      
      // ContactForm wraps in a div or section
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have email input in contact form', () => {
      render(AboutPage);
      
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it('should have message textarea in contact form', () => {
      render(AboutPage);
      
      const textarea = document.querySelector('textarea');
      expect(textarea).toBeInTheDocument();
    });

    it('should have submit button in contact form', () => {
      render(AboutPage);
      
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn).toBeInTheDocument();
    });
  });

  describe('KickstarterPromo Integration', () => {
    it('should render KickstarterPromo component', () => {
      render(AboutPage);
      
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
    });

    it('should render Kickstarter logo', () => {
      render(AboutPage);
      
      const kickstarterLogo = document.querySelector('.kickstarter-logo');
      expect(kickstarterLogo).toBeInTheDocument();
    });

    it('should render Support Our Campaign heading', () => {
      render(AboutPage);
      
      expect(screen.getByText('Support Our Campaign')).toBeInTheDocument();
    });

    it('should render Visit Kickstarter Page link', () => {
      render(AboutPage);
      
      const kickstarterLink = screen.getByRole('link', { name: /visit kickstarter page/i });
      expect(kickstarterLink).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should have h1 element for page title', () => {
      render(AboutPage);
      
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toBe('ABOUT US');
    });

    it('should have h2 elements for section titles', () => {
      render(AboutPage);
      
      const h2s = document.querySelectorAll('h2.section-title');
      expect(h2s.length).toBe(3); // Founders, Team, Advisors
    });

    it('should have h3 elements for card names', () => {
      render(AboutPage);
      
      const h3s = document.querySelectorAll('h3.card-name');
      expect(h3s.length).toBe(6);
    });

    it('should have card title paragraphs', () => {
      render(AboutPage);
      
      const cardTitles = document.querySelectorAll('p.card-title');
      expect(cardTitles.length).toBe(6);
    });
  });

  describe('Images', () => {
    it('should have 6 team member photos', () => {
      render(AboutPage);
      
      const cardImages = document.querySelectorAll('.card-image');
      expect(cardImages.length).toBe(6);
    });

    it('should have alt text on all photos', () => {
      render(AboutPage);
      
      const cardImages = document.querySelectorAll('.card-image');
      cardImages.forEach(img => {
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('should have S3 URLs for all photos', () => {
      render(AboutPage);
      
      const cardImages = document.querySelectorAll('.card-image') as NodeListOf<HTMLImageElement>;
      cardImages.forEach(img => {
        expect(img.src).toContain('finalbossxr.s3.us-east-1.amazonaws.com');
      });
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark', () => {
      render(AboutPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have heading hierarchy', () => {
      render(AboutPage);
      
      const h1s = document.querySelectorAll('h1');
      const h2s = document.querySelectorAll('h2');
      const h3s = document.querySelectorAll('h3');
      
      // Page has main h1 + KickstarterPromo may have h1
      expect(h1s.length).toBeGreaterThanOrEqual(1);
      expect(h2s.length).toBeGreaterThan(0);
      expect(h3s.length).toBeGreaterThan(0);
    });

    it('should have alt text on all images', () => {
      render(AboutPage);
      
      const images = document.querySelectorAll('img');
      images.forEach(img => {
        expect(img.getAttribute('alt')).toBeTruthy();
      });
    });

    it('should have external links with target blank', () => {
      render(AboutPage);
      
      const externalLinks = document.querySelectorAll('a[target="_blank"]');
      expect(externalLinks.length).toBeGreaterThan(0);
    });
  });

  describe('Content Accuracy', () => {
    it('should have exactly 2 founders', () => {
      render(AboutPage);
      
      const foundersSection = screen.getByText('Founders').closest('.section-container');
      const founderCards = foundersSection?.querySelectorAll('.team-card');
      expect(founderCards?.length).toBe(2);
    });

    it('should have exactly 2 team members', () => {
      render(AboutPage);
      
      const teamSection = screen.getByText('Team').closest('.section-container');
      const teamCards = teamSection?.querySelectorAll('.team-card');
      expect(teamCards?.length).toBe(2);
    });

    it('should have exactly 2 advisors', () => {
      render(AboutPage);
      
      const advisorsSection = screen.getByText('Advisors').closest('.section-container');
      const advisorCards = advisorsSection?.querySelectorAll('.team-card');
      expect(advisorCards?.length).toBe(2);
    });

    it('should have 6 total team members', () => {
      render(AboutPage);
      
      const allCards = document.querySelectorAll('.team-card');
      expect(allCards.length).toBe(6);
    });

    it('should display all founder names', () => {
      render(AboutPage);
      
      expect(screen.getByText('Eddie Taliaferro II')).toBeInTheDocument();
      expect(screen.getByText('Keith Dunklin')).toBeInTheDocument();
    });

    it('should display all team member names', () => {
      render(AboutPage);
      
      expect(screen.getByText('Aaron Goodson')).toBeInTheDocument();
      expect(screen.getByText('Richard Davis III')).toBeInTheDocument();
    });

    it('should display all advisor names', () => {
      render(AboutPage);
      
      expect(screen.getByText('Edward Kim')).toBeInTheDocument();
      expect(screen.getByText('Terrell Thomas')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => render(AboutPage)).not.toThrow();
    });

    it('should render ContactForm from $lib', () => {
      render(AboutPage);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should render KickstarterPromo from $lib', () => {
      render(AboutPage);
      
      const kickstarterSection = document.querySelector('.kickstarter-section');
      expect(kickstarterSection).toBeInTheDocument();
    });

    it('should render LinkedinSolid icons', () => {
      render(AboutPage);
      
      const linkedinLinks = document.querySelectorAll('.linkedin-link svg');
      expect(linkedinLinks.length).toBe(6);
    });
  });

  describe('Spacer Elements', () => {
    it('should have spacer divs between sections', () => {
      render(AboutPage);
      
      // The page has spacer divs with h-10 lg:h-32 classes
      const spacers = document.querySelectorAll('div.h-10');
      expect(spacers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Section Order', () => {
    it('should render sections in correct order', () => {
      render(AboutPage);
      
      const sectionTitles = document.querySelectorAll('h2.section-title');
      const titles = Array.from(sectionTitles).map(el => el.textContent);
      
      expect(titles).toEqual(['Founders', 'Team', 'Advisors']);
    });
  });
});
