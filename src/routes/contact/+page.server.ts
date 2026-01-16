import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';

export const prerender = false;

// NOTE: The DISCORD_CONTACT_FORM_HOOK_URL should be defined in your .env.private file.
// For demonstration, we'll use the environment variable name provided.
const DISCORD_WEBHOOK_URL = env.DISCORD_CONTACT_FORM_HOOK_URL;
const DISCORD_EMBED_COLOR = 3066993; // A nice green color for Discord embeds

/**
 * Submits the form data to the Discord webhook using a rich embed structure.
 * @param name The submitter's name.
 * @param email The submitter's email.
 * @param message The message body.
 */
async function submitFormData(name: string, email: string, message: string) {
    const timestamp = new Date().toISOString();

    // Discord Payload using a structured Embed for clarity in the channel
    const discordPayload = {
        embeds: [
            {
                title: '✅ New FinalBossXR Contact Form',
                description: `A new message was received from the website contact form.`,
                color: DISCORD_EMBED_COLOR,
                timestamp: timestamp,
                fields: [
                    { name: '👤 Name', value: name, inline: true },
                    { name: '📧 Email', value: email, inline: true },
                    // Truncate message if needed, Discord limits embed field value to 1024 chars
                    { name: '💬 Message', value: message.substring(0, 1024), inline: false }, 
                ],
                footer: {
                    text: 'Final Boss Contact System'
                }
            }
        ]
    };

    try {
        const response = await fetch(env.DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(discordPayload)
        });

        // Discord webhooks return 204 No Content on success
        if (response.ok) {
            console.log('Discord webhook POST request successful (204 No Content).');
            return { success: true };
        } else {
            // Log the error and fail the SvelteKit action
            console.error(`Discord webhook failed (Status: ${response.status}):`, await response.text());
            return fail(500, { message: 'Failed to send message due to a server error.' });
        }
    } catch (error) {
        console.error('Error during Discord webhook fetch:', error);
        return fail(500, { message: 'An unexpected server error occurred.' });
    }
}

export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const message = data.get('message') as string;
        
        // Server-side validation is necessary as client-side checks can be bypassed
        if (!name || !email || !message) {
            return fail(400, { message: 'Please fill out the entire form.' });
        }

        // Await the submission to ensure the action only returns success if Discord accepts the message
        return await submitFormData(name, email, message);
    }
}
