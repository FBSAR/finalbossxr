import { getDb } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const ALLOWED_ADMINS = ['eddie@finalbossxr.com', 'keith@finalbossxr.com'];

export const load: PageServerLoad = async ({ cookies }) => {
  const adminEmail = cookies.get('admin_auth');
  console.log('Dashboard load - adminEmail from cookie:', adminEmail);
  const isAuthenticated = adminEmail && ALLOWED_ADMINS.includes(adminEmail);
  console.log('Is authenticated:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to /admin');
    throw redirect(303, '/admin');
  }

  const db = getDb();
  
  // Fetch job applications (without resume binary data for performance)
  const jobApplications = await db`
    SELECT id, job_id, job_title, name, email, phone, linkedin, portfolio, 
           experience, why_join, resume_filename, created_at, updated_at
    FROM job_applications
    ORDER BY created_at DESC
  `;

  // Fetch blogs
  let blogs: any[] = [];
  try {
    blogs = await db`
      SELECT id, title, slug, excerpt, content, author, published, featured, created_at, updated_at
      FROM blogs
      ORDER BY created_at DESC
    `;
  } catch (e) {
    // blogs table may not exist yet
    console.log('Blogs table not found, skipping...');
  }

  return {
    adminEmail,
    jobApplications,
    blogs
  };
};

export const actions: Actions = {
  logout: async ({ cookies }) => {
    cookies.delete('admin_auth', { path: '/' });
    throw redirect(303, '/admin');
  },

  deleteApplication: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`DELETE FROM job_applications WHERE id = ${id}`;
    return { success: true, message: 'Application deleted' };
  },

  createBlog: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    const baseSlug = data.get('slug') as string || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const excerpt = data.get('excerpt') as string;
    const content = data.get('content') as string;
    const author = data.get('author') as string || 'FinalBoss XR';
    const published = data.get('published') === 'true';
    const featured = data.get('featured') === 'true';

    const db = getDb();
    
    // Check if trying to feature this blog while another is already featured
    if (featured) {
      const existingFeatured = await db`SELECT id, title FROM blogs WHERE featured = true LIMIT 1`;
      if (existingFeatured.length > 0) {
        return fail(400, { 
          error: true, 
          message: `Cannot feature this blog. "${existingFeatured[0].title}" is already featured. Please unfeature it first.` 
        });
      }
    }
    
    // Check if slug already exists, if so append a timestamp
    const existingSlugs = await db`SELECT slug FROM blogs WHERE slug LIKE ${baseSlug + '%'}`;
    let slug = baseSlug;
    if (existingSlugs.length > 0) {
      slug = `${baseSlug}-${Date.now()}`;
    }
    
    await db`
      INSERT INTO blogs (title, slug, excerpt, content, author, published, featured)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${author}, ${published}, ${featured})
    `;

    return { success: true, message: 'Blog created' };
  },

  updateBlog: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const title = data.get('title') as string;
    const slug = data.get('slug') as string;
    const excerpt = data.get('excerpt') as string;
    const content = data.get('content') as string;
    const author = data.get('author') as string;
    const published = data.get('published') === 'true';
    const featured = data.get('featured') === 'true';

    const db = getDb();
    
    // Check if trying to feature this blog while another is already featured
    if (featured) {
      const existingFeatured = await db`SELECT id, title FROM blogs WHERE featured = true AND id != ${id} LIMIT 1`;
      if (existingFeatured.length > 0) {
        return fail(400, { 
          error: true, 
          message: `Cannot feature this blog. "${existingFeatured[0].title}" is already featured. Please unfeature it first.` 
        });
      }
    }
    
    await db`
      UPDATE blogs 
      SET title = ${title}, slug = ${slug}, excerpt = ${excerpt}, content = ${content},
          author = ${author}, published = ${published}, featured = ${featured}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return { success: true, message: 'Blog updated' };
  },

  deleteBlog: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`DELETE FROM blogs WHERE id = ${id}`;
    return { success: true, message: 'Blog deleted' };
  }
};
