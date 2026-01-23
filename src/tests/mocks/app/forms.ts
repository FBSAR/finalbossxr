// Mock $app/forms
import { vi } from 'vitest';

export const enhance = vi.fn(() => {
  return {
    destroy: vi.fn()
  };
});

export const applyAction = vi.fn();
export const deserialize = vi.fn();
