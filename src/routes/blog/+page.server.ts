import type { PageServerLoad } from './$types';
import { neon } from '@neondatabase/serverless';
import { DATABASE_URL } from '$env/static/private';

export const load: PageServerLoad = async () => {
  const sql = neon(DATABASE_URL);
  
  try {
    const posts = await sql`
      SELECT id, title, slug, excerpt, content, author, published, featured, created_at, updated_at
      FROM blogs
      WHERE published = true
      ORDER BY created_at DESC
    `;
    
    return {
      posts: posts ?? []
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      posts: []
    };
  }
};
