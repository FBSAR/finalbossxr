import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const code = parseInt(url.searchParams.get('code') || '500');
  
  // Throw error with the specified code (defaults to 500)
  throw error(code, {
    message: `Test error with status ${code}`
  });
};
