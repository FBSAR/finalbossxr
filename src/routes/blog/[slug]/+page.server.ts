import type { PageServerLoad } from './$types';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
  const sql = neon(DATABASE_URL);
  const { slug } = params;
  
  try {
    const posts = await sql`
      SELECT id, title, slug, excerpt, content, feature_image_url, author, published, featured, created_at, updated_at
      FROM blogs
      WHERE slug = ${slug} AND published = true
      LIMIT 1
    `;
    
    if (!posts || posts.length === 0) {
      throw error(404, 'Post not found');
    }
    
    // Fetch related posts (other published posts, prioritizing featured and recent)
    const relatedPosts = await sql`
      SELECT id, title, slug, excerpt, created_at, featured
      FROM blogs
      WHERE published = true AND slug != ${slug}
      ORDER BY featured DESC, created_at DESC
      LIMIT 3
    `;
    
    return {
      post: posts[0],
      relatedPosts: relatedPosts ?? []
    };
  } catch (err: any) {
    if (err.status === 404) {
      throw err;
    }
    console.error('Error fetching blog post:', err);
    throw error(500, 'Failed to load post');
  }
};
