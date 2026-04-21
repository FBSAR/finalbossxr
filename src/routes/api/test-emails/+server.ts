import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
    testContactConfirmationEmail,
    testApplicationConfirmationEmail,
    testApplicationAdminNotificationEmail,
    testNewsletterEmail,
    testNewsletterAdminNotificationEmail,
    testJobApplicationAcceptanceEmail,
    testJobApplicationRejectionEmail,
    testApplicationResponseNotificationEmail,
    testAllEmailsAtOnce,
    testSelectedEmails
} from '$lib/email-test';

/**
 * Test email API endpoint
 * 
 * GET /api/test-emails?email=test@example.com&template=all
 * GET /api/test-emails?email=test@example.com&templates=contact,applicationConfirmation
 */
export const GET: RequestHandler = async ({ url }) => {
    try {
        const email = url.searchParams.get('email');
        const template = url.searchParams.get('template');
        const templates = url.searchParams.get('templates')?.split(',') || [];

        // Validation
        if (!email || !email.includes('@')) {
            return json(
                { error: 'Valid email address required in ?email= parameter' },
                { status: 400 }
            );
        }

        // Send all emails
        if (template === 'all') {
            const result = await testAllEmailsAtOnce(email);
            return json(result, {
                status: result.success ? 200 : 500
            });
        }

        // Send specific template
        if (template) {
            const templateFunctions: Record<string, (email: string) => Promise<any>> = {
                contact: testContactConfirmationEmail,
                applicationConfirmation: testApplicationConfirmationEmail,
                applicationAdminNotification: testApplicationAdminNotificationEmail,
                newsletter: testNewsletterEmail,
                newsletterAdminNotification: testNewsletterAdminNotificationEmail,
                jobAcceptance: testJobApplicationAcceptanceEmail,
                jobRejection: testJobApplicationRejectionEmail,
                applicationResponseAccepted: (e) => testApplicationResponseNotificationEmail(e, 'accepted'),
                applicationResponseRejected: (e) => testApplicationResponseNotificationEmail(e, 'rejected')
            };

            if (!templateFunctions[template]) {
                return json(
                    {
                        error: `Unknown template: ${template}`,
                        availableTemplates: Object.keys(templateFunctions)
                    },
                    { status: 400 }
                );
            }

            const result = await templateFunctions[template](email);
            return json(
                { success: true, message: `Email sent to ${email}`, result },
                { status: 200 }
            );
        }

        // Send selected templates
        if (templates.length > 0) {
            const result = await testSelectedEmails(email, templates as any);
            return json(result, {
                status: result.success ? 200 : 500
            });
        }

        // No template specified
        return json(
            {
                error: 'Missing required parameters',
                usage: [
                    'Send all emails: GET /api/test-emails?email=test@example.com&template=all',
                    'Send specific: GET /api/test-emails?email=test@example.com&template=contact',
                    'Send multiple: GET /api/test-emails?email=test@example.com&templates=contact,newsletter',
                    'Available templates: contact, applicationConfirmation, applicationAdminNotification, newsletter, newsletterAdminNotification, jobAcceptance, jobRejection, applicationResponseAccepted, applicationResponseRejected'
                ]
            },
            { status: 400 }
        );

    } catch (error) {
        console.error('Test email API error:', error);
        return json(
            { error: 'Failed to send test emails', details: String(error) },
            { status: 500 }
        );
    }
};

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const { email, template, templates } = body;

        // Validation
        if (!email || !email.includes('@')) {
            return json(
                { error: 'Valid email address required' },
                { status: 400 }
            );
        }

        // Send all emails
        if (template === 'all') {
            const result = await testAllEmailsAtOnce(email);
            return json(result, {
                status: result.success ? 200 : 500
            });
        }

        // Send selected templates
        if (Array.isArray(templates) && templates.length > 0) {
            const result = await testSelectedEmails(email, templates);
            return json(result, {
                status: result.success ? 200 : 500
            });
        }

        // Send single template
        if (template) {
            const templateFunctions: Record<string, (email: string) => Promise<any>> = {
                contact: testContactConfirmationEmail,
                applicationConfirmation: testApplicationConfirmationEmail,
                applicationAdminNotification: testApplicationAdminNotificationEmail,
                newsletter: testNewsletterEmail,
                newsletterAdminNotification: testNewsletterAdminNotificationEmail,
                jobAcceptance: testJobApplicationAcceptanceEmail,
                jobRejection: testJobApplicationRejectionEmail,
                applicationResponseAccepted: (e) => testApplicationResponseNotificationEmail(e, 'accepted'),
                applicationResponseRejected: (e) => testApplicationResponseNotificationEmail(e, 'rejected')
            };

            if (!templateFunctions[template]) {
                return json(
                    {
                        error: `Unknown template: ${template}`,
                        availableTemplates: Object.keys(templateFunctions)
                    },
                    { status: 400 }
                );
            }

            const result = await templateFunctions[template](email);
            return json(
                { success: true, message: `Email sent to ${email}`, result },
                { status: 200 }
            );
        }

        return json(
            {
                error: 'Missing required parameters',
                expectedPayload: {
                    email: 'test@example.com',
                    template: 'all' // or specific template name
                }
            },
            { status: 400 }
        );

    } catch (error) {
        console.error('Test email API error:', error);
        return json(
            { error: 'Failed to send test emails', details: String(error) },
            { status: 500 }
        );
    }
};
