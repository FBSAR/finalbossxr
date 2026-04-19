import { json } from '@sveltejs/kit';
import { subscribeToNewsletter, saveCapturedBot } from '$lib/db';
import { sendNewsletterAdminNotificationEmail } from '$lib/email';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, name, website } = body;

        // Honeypot check
        if (website) {
            console.log('Bot detected via honeypot on newsletter form');
            
            await saveCapturedBot({
                formType: 'newsletter',
                honeypotField: 'website',
                honeypotValue: website,
                formData: { email, name },
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip'),
                userAgent: request.headers.get('user-agent')
            });

            // Return fake success to trick the bot
            return json({ success: true });
        }

        // Validate email
        if (!email) {
            return json({ success: false, message: 'Email is required' }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return json({ success: false, message: 'Invalid email address' }, { status: 400 });
        }

        // Subscribe to newsletter
        await subscribeToNewsletter(email, name);

        // Send admin notification
        await sendNewsletterAdminNotificationEmail({ email, name });

        return json({ success: true, message: 'Successfully subscribed!' });

    } catch (error) {
        console.error('Newsletter subscription error:', error);
        return json({ success: false, message: 'An error occurred. Please try again.' }, { status: 500 });
    }
};
