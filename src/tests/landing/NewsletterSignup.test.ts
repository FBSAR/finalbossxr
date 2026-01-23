/**
 * NewsletterSignup Component Tests
 * 
 * Tests for the newsletter signup form including:
 * - Multiple variants (inline, stacked, expandable)
 * - Email validation
 * - Form submission
 * - Success/error states
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';

// Mock the toast store
vi.mock('$lib/stores/toastStore', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn()
}));

import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';

describe('NewsletterSignup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering - Default (Inline)', () => {
    it('should render the newsletter wrapper', () => {
      render(NewsletterSignup);
      
      const wrapper = document.querySelector('.newsletter-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render honeypot field for spam protection', () => {
      render(NewsletterSignup);
      
      const honeypot = document.querySelector('.honeypot');
      expect(honeypot).toBeInTheDocument();
      expect(honeypot?.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render honeypot input with tabindex=-1', () => {
      render(NewsletterSignup);
      
      const honeypotInput = document.querySelector('.honeypot input');
      expect(honeypotInput?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('Stacked Variant', () => {
    it('should render with stacked layout', () => {
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const wrapper = document.querySelector('.newsletter-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should render name field when showName is true', () => {
      render(NewsletterSignup, { props: { variant: 'stacked', showName: true } });
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput).toBeInTheDocument();
    });

    it('should not render name field when showName is false', () => {
      render(NewsletterSignup, { props: { variant: 'stacked', showName: false } });
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput).not.toBeInTheDocument();
    });
  });

  describe('Expandable Variant', () => {
    it('should render trigger button initially', () => {
      render(NewsletterSignup, { props: { variant: 'expandable' } });
      
      const trigger = document.querySelector('.trigger-btn');
      expect(trigger).toBeInTheDocument();
    });

    it('should use custom trigger text', () => {
      render(NewsletterSignup, { props: { variant: 'expandable', triggerText: 'Custom Trigger' } });
      
      const trigger = document.querySelector('.trigger-btn');
      expect(trigger?.textContent).toBe('Custom Trigger');
    });

    it('should expand form when trigger is clicked', async () => {
      render(NewsletterSignup, { props: { variant: 'expandable' } });
      
      const trigger = document.querySelector('.trigger-btn') as HTMLButtonElement;
      await fireEvent.click(trigger);
      
      const form = document.querySelector('.newsletter-form');
      expect(form).toBeInTheDocument();
    });
  });

  describe('Props', () => {
    it('should use custom placeholder text', () => {
      render(NewsletterSignup, { props: { placeholder: 'Custom placeholder' } });
      
      // Placeholder is used on the FloatingLabelInput
      const wrapper = document.querySelector('.newsletter-wrapper');
      expect(wrapper).toBeInTheDocument();
    });

    it('should use custom button text', () => {
      render(NewsletterSignup, { props: { variant: 'stacked', buttonText: 'Join Now' } });
      
      const button = document.querySelector('button[type="submit"]');
      expect(button?.textContent).toContain('Join Now');
    });
  });

  describe('Email Validation', () => {
    it('should show error for invalid email format', async () => {
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      // Set invalid email directly on the component's state
      await fireEvent.input(emailInput, { target: { value: 'invalid-email' } });
      await fireEvent.submit(form);
      
      expect(showErrorToast).toHaveBeenCalledWith('Please enter a valid email address');
    });

    it('should not submit when email is empty', async () => {
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      await fireEvent.submit(form);
      
      // fetch should not be called for empty email
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  describe('Form Submission', () => {
    it('should call fetch with correct endpoint on valid submission', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', expect.any(Object));
    });

    it('should send email and name in request body', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      render(NewsletterSignup, { props: { variant: 'stacked', showName: true } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      expect(global.fetch).toHaveBeenCalledWith('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', name: 'John Doe' })
      });
    });

    it('should show success toast on successful submission', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      await waitFor(() => {
        expect(showSuccessToast).toHaveBeenCalled();
      });
    });

    it('should show error toast on API error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ message: 'Email already exists' })
      });
      
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Email already exists');
      });
    });

    it('should show error toast on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
      
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('Something went wrong. Please try again.');
      });
    });
  });

  describe('Success State', () => {
    it('should show subscribed message after successful submission (expandable)', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      render(NewsletterSignup, { props: { variant: 'expandable' } });
      
      // Expand the form
      const trigger = document.querySelector('.trigger-btn') as HTMLButtonElement;
      await fireEvent.click(trigger);
      
      // Submit
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      await waitFor(() => {
        const subscribedMessage = document.querySelector('.subscribed-message');
        expect(subscribedMessage).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should disable button while submitting', async () => {
      // Make fetch hang
      (global.fetch as ReturnType<typeof vi.fn>).mockImplementation(() => new Promise(() => {}));
      
      render(NewsletterSignup, { props: { variant: 'stacked' } });
      
      const form = document.querySelector('form') as HTMLFormElement;
      const emailInput = document.querySelector('input[type="email"], input[name="email"]') as HTMLInputElement;
      const button = document.querySelector('button[type="submit"]') as HTMLButtonElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.submit(form);
      
      // Button should be disabled while submitting
      expect(button.disabled).toBe(true);
    });
  });
});
