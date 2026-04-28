import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { unsubscribeFromNewsletter } from '$lib/db';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return json({ message: 'Valid email is required' }, { status: 400 });
    }

    const result = await unsubscribeFromNewsletter(email);

    if (!result.found) {
      return json(
        { message: 'Email not found in our mailing list' },
        { status: 404 }
      );
    }

    return json(
      { message: 'Successfully unsubscribed from newsletter' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Unsubscribe error:', error);
    return json(
      { message: 'Failed to process unsubscribe request' },
      { status: 500 }
    );
  }
};
