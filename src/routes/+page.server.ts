import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';

export const prerender = false;

/**
 * Loads the featured blog post, the 2 most recent blog posts, and all published jobs from the database
 */
export async function load({ setHeaders }: { setHeaders: (headers: Record<string, string>) => void }) {
	// Prevent CDN from caching this page — blog/job data must always be fresh
	setHeaders({
		'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
	});
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
