import { env } from '$env/dynamic/private';
import { fail } from '@sveltejs/kit';
import { neon } from '@neondatabase/serverless';

export const prerender = false;

// NOTE: The DISCORD_CONTACT_FORM_HOOK_URL should be defined in your .env.private file.
// For demonstration, we'll use the environment variable name provided.
const DISCORD_WEBHOOK_URL = env.DISCORD_CONTACT_FORM_HOOK_URL;

/**
 * Loads the featured blog post, the 2 most recent blog posts, and all published jobs from the database
 */
export async function load() {
	try {
		const sql = neon(env.DATABASE_URL);
		
		// Run all queries in parallel for faster page loads
		const [featuredBlog, recentBlogs, jobs] = await Promise.all([
			sql`
				SELECT id, title, slug, excerpt, feature_image_url, published, featured, created_at
				FROM blogs
				WHERE published = true AND featured = true
				LIMIT 1
			`,
			sql`
				SELECT id, title, slug, excerpt, feature_image_url, published, featured, created_at
				FROM blogs
				WHERE published = true
				ORDER BY created_at DESC
				LIMIT 2
			`,
			sql`
				SELECT id, title, department, job_type, location, summary, published, created_at
				FROM jobs
				WHERE published = true
				ORDER BY created_at DESC
			`
		]);

		// Combine: featured first, then recent blogs (and filter out featured if it was in recent)
		const blogs = [
			...(featuredBlog.length > 0 ? featuredBlog : []),
			...recentBlogs.filter(blog => featuredBlog.length === 0 || blog.id !== featuredBlog[0].id)
		];

		return {
			blogs: blogs as Array<{
				id: string;
				title: string;
				slug: string;
				excerpt: string;
				feature_image_url: string | null;
				published: boolean;
				featured?: boolean;
				created_at: string;
			}>,
			jobs: jobs as Array<{
				id: number;
				title: string;
				department: string;
				job_type: string;
				location: string;
				summary: string;
				published: boolean;
				created_at: string;
			}>
		};
	} catch (error) {
		console.error('Error fetching blogs or jobs:', error);
		return {
			blogs: [],
			jobs: []
		};
	}
}
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
        const response = await fetch(DISCORD_WEBHOOK_URL, {
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
