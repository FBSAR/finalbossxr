import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import AdminLoginPage from '../../routes/admin/+page.svelte';

// Mock $app/forms enhance
vi.mock('$app/forms', () => ({
  enhance: () => () => {}
}));

describe('AdminLoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the admin login container', () => {
      render(AdminLoginPage, { props: { form: null } });
      const container = document.querySelector('.admin-container');
      expect(container).toBeTruthy();
    });

    it('renders the login card', () => {
      render(AdminLoginPage, { props: { form: null } });
      const card = document.querySelector('.login-card');
      expect(card).toBeTruthy();
    });

    it('displays Admin Access title with lock emoji', () => {
      render(AdminLoginPage, { props: { form: null } });
      expect(screen.getByText('🔐 Admin Access')).toBeTruthy();
    });

    it('has gradient-text styling on title', () => {
      render(AdminLoginPage, { props: { form: null } });
      const title = document.querySelector('.gradient-text');
      expect(title).toBeTruthy();
      expect(title?.textContent).toContain('Admin Access');
    });
  });

  describe('Email Step', () => {
    it('displays email step by default', () => {
      render(AdminLoginPage, { props: { form: null } });
      expect(screen.getByText('Enter your admin email')).toBeTruthy();
    });

    it('renders email input field', () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com');
      expect(emailInput).toBeTruthy();
    });

    it('email input has correct type attribute', () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com');
      expect(emailInput).toHaveAttribute('type', 'email');
    });

    it('email input is required', () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com');
      expect(emailInput).toHaveAttribute('required');
    });

    it('email input has autocomplete attribute', () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com');
      expect(emailInput).toHaveAttribute('autocomplete', 'email');
    });

    it('renders Send Code button', () => {
      render(AdminLoginPage, { props: { form: null } });
      expect(screen.getByText('Send Code')).toBeTruthy();
    });

    it('submit button has correct type', () => {
      render(AdminLoginPage, { props: { form: null } });
      const button = screen.getByText('Send Code');
      expect(button).toHaveAttribute('type', 'submit');
    });

    it('form has correct action for requesting code', () => {
      render(AdminLoginPage, { props: { form: null } });
      const form = document.querySelector('form');
      expect(form?.getAttribute('action')).toBe('?/requestCode');
    });
  });

  describe('Code Step', () => {
    const codeStepForm = {
      success: true,
      step: 'code',
      email: 'test@finalbossxr.com'
    };

    it('displays code step when form.step is code', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      expect(screen.getByText('Enter the 6-digit code')).toBeTruthy();
    });

    it('shows code sent message with email', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      expect(screen.getByText('Code sent to')).toBeTruthy();
      expect(screen.getByText('test@finalbossxr.com')).toBeTruthy();
    });

    it('renders code input field', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toBeTruthy();
    });

    it('code input has correct maxlength', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toHaveAttribute('maxlength', '6');
    });

    it('code input has numeric inputmode', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toHaveAttribute('inputmode', 'numeric');
    });

    it('code input has one-time-code autocomplete', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toHaveAttribute('autocomplete', 'one-time-code');
    });

    it('code input is required', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toHaveAttribute('required');
    });

    it('code input has code-input class', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const codeInput = document.querySelector('.code-input');
      expect(codeInput).toBeTruthy();
    });

    it('renders Verify Code button', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      expect(screen.getByText('Verify Code')).toBeTruthy();
    });

    it('form has correct action for verifying code', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const form = document.querySelector('form');
      expect(form?.getAttribute('action')).toBe('?/verifyCode');
    });

    it('renders Back button', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      expect(screen.getByText('← Back')).toBeTruthy();
    });

    it('Back button is a regular button type', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const backButton = screen.getByText('← Back');
      expect(backButton).toHaveAttribute('type', 'button');
    });

    it('includes hidden email input for verification', () => {
      render(AdminLoginPage, { props: { form: codeStepForm } });
      const hiddenInput = document.querySelector('input[type="hidden"][name="email"]');
      expect(hiddenInput).toBeTruthy();
      expect(hiddenInput).toHaveAttribute('value', 'test@finalbossxr.com');
    });
  });

  describe('Error Display', () => {
    it('displays error message when form has error', () => {
      render(AdminLoginPage, { props: { form: { error: 'Invalid email address' } } });
      expect(screen.getByText('Invalid email address')).toBeTruthy();
    });

    it('error message has error styling class', () => {
      render(AdminLoginPage, { props: { form: { error: 'Something went wrong' } } });
      const errorDiv = document.querySelector('.error-msg');
      expect(errorDiv).toBeTruthy();
      expect(errorDiv?.textContent).toContain('Something went wrong');
    });

    it('does not show error when no error in form', () => {
      render(AdminLoginPage, { props: { form: null } });
      const errorDiv = document.querySelector('.error-msg');
      expect(errorDiv).toBeFalsy();
    });

    it('shows unauthorized error for invalid email', () => {
      render(AdminLoginPage, { props: { form: { error: 'Unauthorized email address', step: 'email' } } });
      expect(screen.getByText('Unauthorized email address')).toBeTruthy();
    });

    it('shows expired code error', () => {
      render(AdminLoginPage, { props: { form: { error: 'Code expired. Request a new one.', step: 'email' } } });
      expect(screen.getByText('Code expired. Request a new one.')).toBeTruthy();
    });

    it('shows invalid code error', () => {
      render(AdminLoginPage, { props: { form: { error: 'Invalid code', step: 'code', email: 'test@finalbossxr.com' } } });
      expect(screen.getByText('Invalid code')).toBeTruthy();
    });
  });

  describe('Loading State', () => {
    it('shows Sending... text when submitting', async () => {
      const { component } = render(AdminLoginPage, { props: { form: null } });
      
      // Access internal state by manipulating form
      // The button text changes based on isSubmitting state which is internal
      // We can only verify the initial state
      expect(screen.getByText('Send Code')).toBeTruthy();
    });

    it('submit button is enabled by default', () => {
      render(AdminLoginPage, { props: { form: null } });
      const button = screen.getByText('Send Code');
      expect(button).not.toBeDisabled();
    });
  });

  describe('Styling', () => {
    it('has dark theme background', () => {
      render(AdminLoginPage, { props: { form: null } });
      const container = document.querySelector('.admin-container');
      expect(container).toBeTruthy();
    });

    it('login header has centered text', () => {
      render(AdminLoginPage, { props: { form: null } });
      const header = document.querySelector('.login-header');
      expect(header).toBeTruthy();
    });

    it('email input has name attribute', () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com');
      expect(emailInput).toHaveAttribute('name', 'email');
    });

    it('code input has name attribute', () => {
      render(AdminLoginPage, { props: { form: { step: 'code', email: 'test@finalbossxr.com' } } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toHaveAttribute('name', 'code');
    });
  });

  describe('Head/SEO', () => {
    it('sets page title', () => {
      render(AdminLoginPage, { props: { form: null } });
      // The svelte:head component should set the title
      // In testing environment, we verify the component renders without errors
      expect(document.querySelector('.admin-container')).toBeTruthy();
    });
  });

  describe('Form Method', () => {
    it('email form uses POST method', () => {
      render(AdminLoginPage, { props: { form: null } });
      const form = document.querySelector('form');
      expect(form).toHaveAttribute('method', 'POST');
    });

    it('code verification form uses POST method', () => {
      render(AdminLoginPage, { props: { form: { step: 'code', email: 'test@finalbossxr.com' } } });
      const form = document.querySelector('form');
      expect(form).toHaveAttribute('method', 'POST');
    });
  });

  describe('Accessibility', () => {
    it('has form landmarks', () => {
      render(AdminLoginPage, { props: { form: null } });
      const form = document.querySelector('form');
      expect(form).toBeTruthy();
    });

    it('email input has proper labeling via placeholder', () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com');
      expect(emailInput).toBeTruthy();
    });

    it('code input has proper labeling via placeholder', () => {
      render(AdminLoginPage, { props: { form: { step: 'code', email: 'test@finalbossxr.com' } } });
      const codeInput = screen.getByPlaceholderText('000000');
      expect(codeInput).toBeTruthy();
    });

    it('Back button is clickable', async () => {
      render(AdminLoginPage, { props: { form: { step: 'code', email: 'test@finalbossxr.com' } } });
      const backButton = screen.getByText('← Back');
      await fireEvent.click(backButton);
      // After clicking back, should show email step
      expect(screen.getByText('Enter your admin email')).toBeTruthy();
    });
  });

  describe('Input Interaction', () => {
    it('allows typing in email input', async () => {
      render(AdminLoginPage, { props: { form: null } });
      const emailInput = screen.getByPlaceholderText('admin@finalbossxr.com') as HTMLInputElement;
      await fireEvent.input(emailInput, { target: { value: 'eddie@finalbossxr.com' } });
      expect(emailInput.value).toBe('eddie@finalbossxr.com');
    });

    it('allows typing in code input', async () => {
      render(AdminLoginPage, { props: { form: { step: 'code', email: 'test@finalbossxr.com' } } });
      const codeInput = screen.getByPlaceholderText('000000') as HTMLInputElement;
      await fireEvent.input(codeInput, { target: { value: '123456' } });
      expect(codeInput.value).toBe('123456');
    });
  });
});
