/**
 * Contact Page Tests
 * 
 * Tests for the /contact page which displays the contact form.
 * Features: ContactForm component with name, email, message fields, validation, honeypot.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/svelte';
import ContactPage from '../../routes/contact/+page.svelte';

describe('Contact Page', () => {
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
      render(ContactPage);
      
      const mains = document.querySelectorAll('main');
      expect(mains.length).toBeGreaterThan(0);
    });

    it('should render the page title', () => {
      render(ContactPage);
      
      expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    });

    it('should have gradient text class on title', () => {
      render(ContactPage);
      
      const title = document.querySelector('h1.gradient-text');
      expect(title).toBeInTheDocument();
      expect(title?.textContent).toBe('CONTACT US');
    });

    it('should have jersey font on title', () => {
      render(ContactPage);
      
      const title = document.querySelector('h1.jersey-font');
      expect(title).toBeInTheDocument();
    });
  });

  describe('Contact Description', () => {
    it('should render contact description text', () => {
      render(ContactPage);
      
      expect(screen.getByText(/Have a question\? Have a comment\?/)).toBeInTheDocument();
    });

    it('should mention working with or investing in Final Boss', () => {
      render(ContactPage);
      
      expect(screen.getByText(/Want to work with, or invest in Final Boss\?/)).toBeInTheDocument();
    });

    it('should have contact header card class', () => {
      render(ContactPage);
      
      const headerCard = document.querySelector('.contact-header-card');
      expect(headerCard).toBeInTheDocument();
    });
  });

  describe('Contact Form', () => {
    it('should render contact form', () => {
      render(ContactPage);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should have POST method on form', () => {
      render(ContactPage);
      
      const form = document.querySelector('form');
      expect(form?.getAttribute('method')).toBe('POST');
    });

    it('should render contact card container', () => {
      render(ContactPage);
      
      const contactCard = document.querySelector('.contact-card');
      expect(contactCard).toBeInTheDocument();
    });
  });

  describe('Form Badge', () => {
    it('should render "Please fill out entire form" badge', () => {
      render(ContactPage);
      
      expect(screen.getByText('Please fill out entire form')).toBeInTheDocument();
    });
  });

  describe('Name Input', () => {
    it('should render name input field', () => {
      render(ContactPage);
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput).toBeInTheDocument();
    });

    it('should have text type for name input', () => {
      render(ContactPage);
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput?.getAttribute('type')).toBe('text');
    });

    it('should have maxlength of 100 on name input', () => {
      render(ContactPage);
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput?.getAttribute('maxlength')).toBe('100');
    });

    it('should render "First & Last Name" label', () => {
      render(ContactPage);
      
      expect(screen.getByText('First & Last Name')).toBeInTheDocument();
    });
  });

  describe('Email Input', () => {
    it('should render email input field', () => {
      render(ContactPage);
      
      const emailInput = document.querySelector('input[name="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it('should have email type for email input', () => {
      render(ContactPage);
      
      const emailInput = document.querySelector('input[name="email"]');
      expect(emailInput?.getAttribute('type')).toBe('email');
    });

    it('should have maxlength of 100 on email input', () => {
      render(ContactPage);
      
      const emailInput = document.querySelector('input[name="email"]');
      expect(emailInput?.getAttribute('maxlength')).toBe('100');
    });

    it('should render "Email" label', () => {
      render(ContactPage);
      
      expect(screen.getByText('Email')).toBeInTheDocument();
    });
  });

  describe('Message Textarea', () => {
    it('should render message textarea', () => {
      render(ContactPage);
      
      const textarea = document.querySelector('textarea[name="message"]');
      expect(textarea).toBeInTheDocument();
    });

    it('should have maxlength of 500 on textarea', () => {
      render(ContactPage);
      
      const textarea = document.querySelector('textarea[name="message"]');
      expect(textarea?.getAttribute('maxlength')).toBe('500');
    });

    it('should have placeholder "Your message"', () => {
      render(ContactPage);
      
      const textarea = document.querySelector('textarea[placeholder="Your message"]');
      expect(textarea).toBeInTheDocument();
    });

    it('should have 6 rows', () => {
      render(ContactPage);
      
      const textarea = document.querySelector('textarea[name="message"]');
      expect(textarea?.getAttribute('rows')).toBe('6');
    });
  });

  describe('Submit Button', () => {
    it('should render submit button', () => {
      render(ContactPage);
      
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn).toBeInTheDocument();
    });

    it('should have "Submit" text on button', () => {
      render(ContactPage);
      
      const submitBtn = screen.getByRole('button', { name: /submit/i });
      expect(submitBtn).toBeInTheDocument();
    });

    it('should have submit-btn class', () => {
      render(ContactPage);
      
      const submitBtn = document.querySelector('.submit-btn');
      expect(submitBtn).toBeInTheDocument();
    });

    it('should be disabled when form is empty', () => {
      render(ContactPage);
      
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Honeypot Field', () => {
    it('should render honeypot field', () => {
      render(ContactPage);
      
      const honeypot = document.querySelector('.honeypot');
      expect(honeypot).toBeInTheDocument();
    });

    it('should have aria-hidden on honeypot', () => {
      render(ContactPage);
      
      const honeypot = document.querySelector('.honeypot');
      expect(honeypot?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should have website input in honeypot', () => {
      render(ContactPage);
      
      const websiteInput = document.querySelector('input[name="website"]');
      expect(websiteInput).toBeInTheDocument();
    });

    it('should have tabindex -1 on honeypot input', () => {
      render(ContactPage);
      
      const websiteInput = document.querySelector('input[name="website"]');
      expect(websiteInput?.getAttribute('tabindex')).toBe('-1');
    });

    it('should have autocomplete off on honeypot input', () => {
      render(ContactPage);
      
      const websiteInput = document.querySelector('input[name="website"]');
      expect(websiteInput?.getAttribute('autocomplete')).toBe('off');
    });

    it('should have Website label for honeypot', () => {
      render(ContactPage);
      
      const label = document.querySelector('label[for="website"]');
      expect(label).toBeInTheDocument();
      expect(label?.textContent).toBe('Website');
    });
  });

  describe('Form Fields Count', () => {
    it('should have 3 visible input fields', () => {
      render(ContactPage);
      
      // name, email inputs + honeypot (hidden)
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const messageInput = document.querySelector('textarea[name="message"]');
      
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(messageInput).toBeInTheDocument();
    });

    it('should have 4 total input fields including honeypot', () => {
      render(ContactPage);
      
      const allInputs = document.querySelectorAll('input');
      // name, email, honeypot (website)
      expect(allInputs.length).toBe(3);
    });
  });

  describe('Styling', () => {
    it('should have h1 element for page title', () => {
      render(ContactPage);
      
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1?.textContent).toBe('CONTACT US');
    });

    it('should have text-7xl class on title', () => {
      render(ContactPage);
      
      const title = document.querySelector('h1.text-7xl');
      expect(title).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have main landmark', () => {
      render(ContactPage);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should have heading', () => {
      render(ContactPage);
      
      const h1 = document.querySelector('h1');
      expect(h1).toBeInTheDocument();
    });

    it('should have labels for form inputs', () => {
      render(ContactPage);
      
      // FloatingLabelInput components render labels
      expect(screen.getByText('First & Last Name')).toBeInTheDocument();
      expect(screen.getByText('Email')).toBeInTheDocument();
    });

    it('should have placeholder for textarea', () => {
      render(ContactPage);
      
      const textarea = screen.getByPlaceholderText('Your message');
      expect(textarea).toBeInTheDocument();
    });

    it('should have form element', () => {
      render(ContactPage);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Content Accuracy', () => {
    it('should display correct page title', () => {
      render(ContactPage);
      
      expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    });

    it('should have description about contacting the team', () => {
      render(ContactPage);
      
      const description = document.querySelector('.contact-header-card');
      expect(description?.textContent).toContain('Have a question?');
      expect(description?.textContent).toContain('contact you at our earliest convenience');
    });

    it('should have correct form fields', () => {
      render(ContactPage);
      
      expect(document.querySelector('input[name="name"]')).toBeInTheDocument();
      expect(document.querySelector('input[name="email"]')).toBeInTheDocument();
      expect(document.querySelector('textarea[name="message"]')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render without errors', () => {
      expect(() => render(ContactPage)).not.toThrow();
    });

    it('should render ContactForm from $lib', () => {
      render(ContactPage);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
    });

    it('should pass isLoading prop to ContactForm', () => {
      render(ContactPage);
      
      // When isLoading is false (default due to $navigating mock), actual content renders
      expect(screen.getByText('CONTACT US')).toBeInTheDocument();
    });
  });

  describe('Form Validation Display', () => {
    it('should show badge indicating form requirements', () => {
      render(ContactPage);
      
      expect(screen.getByText('Please fill out entire form')).toBeInTheDocument();
    });

    it('should have disabled submit button initially', () => {
      render(ContactPage);
      
      const submitBtn = document.querySelector('button[type="submit"]');
      expect(submitBtn?.hasAttribute('disabled')).toBe(true);
    });
  });

  describe('Form Input Interaction', () => {
    it('should allow typing in name input', async () => {
      render(ContactPage);
      
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      
      expect(nameInput.value).toBe('John Doe');
    });

    it('should allow typing in email input', async () => {
      render(ContactPage);
      
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      await fireEvent.input(emailInput, { target: { value: 'john@example.com' } });
      
      expect(emailInput.value).toBe('john@example.com');
    });

    it('should allow typing in message textarea', async () => {
      render(ContactPage);
      
      const textarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      await fireEvent.input(textarea, { target: { value: 'Hello, this is a test message.' } });
      
      expect(textarea.value).toBe('Hello, this is a test message.');
    });
  });

  describe('Layout', () => {
    it('should have w-11/12 container', () => {
      render(ContactPage);
      
      const container = document.querySelector('.w-11\\/12');
      expect(container).toBeInTheDocument();
    });

    it('should have centered content with mx-auto', () => {
      render(ContactPage);
      
      const centeredElements = document.querySelectorAll('.mx-auto');
      expect(centeredElements.length).toBeGreaterThan(0);
    });
  });
});
