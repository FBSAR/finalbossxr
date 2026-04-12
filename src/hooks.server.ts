import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);

	// Security headers
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

	// CDN edge caching for GET requests (Vercel)
	if (event.request.method === 'GET' && !response.headers.has('cache-control')) {
		response.headers.set('cache-control', 'public, max-age=0, s-maxage=3600');
	}

	return response;
};
