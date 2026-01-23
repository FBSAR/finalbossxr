// Mock $app/stores
import { readable, writable, get } from 'svelte/store';

export const page = readable({
  url: new URL('http://localhost'),
  params: {},
  route: { id: '/' },
  status: 200,
  error: null,
  data: {},
  form: null
});

// Navigating store that always returns null (not navigating)
// This ensures components using $navigating !== null see false
export const navigating = readable(null);

export const updated = {
  subscribe: readable(false).subscribe,
  check: async () => false
};
