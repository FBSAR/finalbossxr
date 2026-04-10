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
      WHERE slug = ${slug} AND published = false
      LIMIT 1
    `;
    
    if (!posts || posts.length === 0) {
      throw error(404, 'Draft not found');
    }
    
    return {
      post: posts[0],
      isDraft: true
    };
  } catch (err: any) {
    if (err.status === 404) {
      throw err;
    }
    console.error('Error fetching draft post:', err);
    throw error(500, 'Failed to load draft');
  }
};
