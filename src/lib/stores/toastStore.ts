import { writable } from 'svelte/store';

// Define the shape of our toast state
interface ToastState {
  success: boolean;
  error: boolean;
  errorMessage: string;
}

// Initial state for the toasts
const initialToastState: ToastState = {
  success: false,
  error: false,
  errorMessage: '',
};

// Create a writable store
export const toast = writable<ToastState>(initialToastState);

// Helper function to show a success toast
export function showSuccessToast() {
  toast.update(state => ({ ...state, success: true }));
  setTimeout(() => {
    toast.update(state => ({ ...state, success: false }));
  }, 8000); // Toast disappears after 8 seconds
}

// Helper function to show an error toast
export function showErrorToast(message: string) {
  toast.update(state => ({ ...state, error: true, errorMessage: message }));
  setTimeout(() => {
    toast.update(state => ({ ...state, error: false, errorMessage: '' }));
  }, 5000); // Toast disappears after 5 seconds
}