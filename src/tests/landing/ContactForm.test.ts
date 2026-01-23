/**
 * ContactForm Component Tests
 * 
 * Tests for the contact form including:
 * - Form rendering
 * - Validation
 * - Submission handling
 * - Loading state
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/svelte';
import ContactForm from '$lib/components/ContactForm.svelte';

// Mock the toast store
vi.mock('$lib/stores/toastStore', () => ({
  showSuccessToast: vi.fn(),
  showErrorToast: vi.fn()
}));

import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    cleanup();
  });

  describe('Rendering', () => {
    it('should render the contact form container', () => {
      render(ContactForm);
      
      const main = document.querySelector('main');
      expect(main).toBeInTheDocument();
    });

    it('should render the "CONTACT US" heading', () => {
      render(ContactForm);
      
      const heading = document.querySelector('h1');
      expect(heading).toBeInTheDocument();
      expect(heading?.textContent).toContain('CONTACT US');
    });

    it('should render the contact header description', () => {
      render(ContactForm);
      
      const description = document.querySelector('.contact-header-card');
      expect(description).toBeInTheDocument();
      expect(description?.textContent).toContain('Have a question');
    });

    it('should render the contact card', () => {
      render(ContactForm);
      
      const card = document.querySelector('.contact-card');
      expect(card).toBeInTheDocument();
    });
  });

  describe('Form Fields', () => {
    it('should render the form element', () => {
      render(ContactForm);
      
      const form = document.querySelector('form');
      expect(form).toBeInTheDocument();
      expect(form?.getAttribute('method')).toBe('POST');
    });

    it('should render name input field', () => {
      render(ContactForm);
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput).toBeInTheDocument();
    });

    it('should render email input field', () => {
      render(ContactForm);
      
      const emailInput = document.querySelector('input[name="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    it('should render message textarea', () => {
      render(ContactForm);
      
      const textarea = document.querySelector('textarea[name="message"]');
      expect(textarea).toBeInTheDocument();
    });

    it('should render submit button', () => {
      render(ContactForm);
      
      const button = document.querySelector('button[type="submit"]');
      expect(button).toBeInTheDocument();
    });

    it('should render form badge', () => {
      render(ContactForm);
      
      // Badge with "Please fill out entire form"
      const badge = document.querySelector('.mb-4'); // Badge has mb-4 class
      expect(badge).toBeInTheDocument();
    });
  });

  describe('Validation', () => {
    it('should show error toast when name is empty', async () => {
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill only email and message
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.input(messageTextarea, { target: { value: 'Test message' } });
      
      await fireEvent.submit(form);
      
      expect(showErrorToast).toHaveBeenCalledWith('Please fill out the entire form');
    });

    it('should show error toast when email is empty', async () => {
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill only name and message
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(messageTextarea, { target: { value: 'Test message' } });
      
      await fireEvent.submit(form);
      
      expect(showErrorToast).toHaveBeenCalledWith('Please fill out the entire form');
    });

    it('should show error toast when message is empty', async () => {
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill only name and email
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      
      await fireEvent.submit(form);
      
      expect(showErrorToast).toHaveBeenCalledWith('Please fill out the entire form');
    });
  });

  describe('Form Submission', () => {
    it('should call fetch on valid submission', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill all fields
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.input(messageTextarea, { target: { value: 'Test message' } });
      
      await fireEvent.submit(form);
      
      expect(global.fetch).toHaveBeenCalled();
    });

    it('should show success toast on successful submission', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ success: true })
      });
      
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill all fields
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.input(messageTextarea, { target: { value: 'Test message' } });
      
      await fireEvent.submit(form);
      
      await waitFor(() => {
        expect(showSuccessToast).toHaveBeenCalled();
      });
    });

    it('should show error toast on failed submission', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ type: 'failure', data: { message: 'Server error' } })
      });
      
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill all fields
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.input(messageTextarea, { target: { value: 'Test message' } });
      
      await fireEvent.submit(form);
      
      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalled();
      });
    });

    it('should show error toast on network error', async () => {
      (global.fetch as ReturnType<typeof vi.fn>).mockRejectedValueOnce(new Error('Network error'));
      
      render(ContactForm);
      
      const form = document.querySelector('form') as HTMLFormElement;
      
      // Fill all fields
      const nameInput = document.querySelector('input[name="name"]') as HTMLInputElement;
      const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement;
      const messageTextarea = document.querySelector('textarea[name="message"]') as HTMLTextAreaElement;
      
      await fireEvent.input(nameInput, { target: { value: 'John Doe' } });
      await fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
      await fireEvent.input(messageTextarea, { target: { value: 'Test message' } });
      
      await fireEvent.submit(form);
      
      await waitFor(() => {
        expect(showErrorToast).toHaveBeenCalledWith('There was an error submitting your form. Please try again later.');
      });
    });
  });

  describe('Loading State', () => {
    it('should render skeleton when isLoading is true', () => {
      render(ContactForm, { props: { isLoading: true } });
      
      const skeleton = document.querySelector('.skeleton-text');
      expect(skeleton).toBeInTheDocument();
    });

    it('should render skeleton input fields when loading', () => {
      render(ContactForm, { props: { isLoading: true } });
      
      const skeletonInput = document.querySelector('.skeleton-input');
      expect(skeletonInput).toBeInTheDocument();
    });

    it('should render skeleton textarea when loading', () => {
      render(ContactForm, { props: { isLoading: true } });
      
      const skeletonTextarea = document.querySelector('.skeleton-textarea');
      expect(skeletonTextarea).toBeInTheDocument();
    });

    it('should render skeleton button when loading', () => {
      render(ContactForm, { props: { isLoading: true } });
      
      const skeletonButton = document.querySelector('.skeleton-button');
      expect(skeletonButton).toBeInTheDocument();
    });

    it('should not render form when loading', () => {
      render(ContactForm, { props: { isLoading: true } });
      
      const form = document.querySelector('form');
      expect(form).not.toBeInTheDocument();
    });
  });

  describe('Input Constraints', () => {
    it('should have maxlength on name input', () => {
      render(ContactForm);
      
      const nameInput = document.querySelector('input[name="name"]');
      expect(nameInput?.getAttribute('maxlength')).toBe('100');
    });

    it('should have maxlength on email input', () => {
      render(ContactForm);
      
      const emailInput = document.querySelector('input[name="email"]');
      expect(emailInput?.getAttribute('maxlength')).toBe('100');
    });
  });
});
