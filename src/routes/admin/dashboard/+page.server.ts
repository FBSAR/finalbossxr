import { getDb } from '$lib/db';
import { sendNewsletterEmail, sendJobApplicationAcceptanceEmail, sendJobApplicationRejectionEmail, sendApplicationResponseNotificationEmail } from '$lib/email';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const ALLOWED_ADMINS = ['eddie@finalbossxr.com', 'keith@finalbossxr.com'];

export const load: PageServerLoad = async ({ cookies, setHeaders }) => {
  // Set cache control headers to prevent caching
  setHeaders({
    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
    'Pragma': 'no-cache',
    'Expires': '0'
  });

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
  let jobApplications: any[] = [];
  try {
    jobApplications = await db`
      SELECT id, job_id, job_title, name, email, phone, linkedin, portfolio, 
             experience, why_join, resume_filename, status, response_message, 
             response_sent_at, created_at, updated_at
      FROM job_applications
      ORDER BY created_at DESC
    `;
  } catch (e) {
    console.error('Error fetching job applications:', e);
  }

  // Fetch blogs
  let blogs: any[] = [];
  try {
    blogs = await db`
      SELECT id, title, slug, excerpt, content, feature_image_url, published, featured, created_at, updated_at
      FROM blogs
      ORDER BY featured DESC, created_at DESC
    `;
  } catch (e) {
    // blogs table may not exist yet
    console.log('Blogs table not found, skipping...');
  }

  // Fetch newsletter subscribers (email list)
  let subscribers: any[] = [];
  try {
    subscribers = await db`
      SELECT id, email, name, source, created_at
      FROM email_list
      ORDER BY created_at DESC
    `;
  } catch (e) {
    console.log('Email list table not found, skipping...');
  }

  // Fetch newsletter drafts
  let newsletterDrafts: any[] = [];
  let archivedNewsletters: any[] = [];
  try {
    // Initialize newsletter_drafts table if it doesn't exist
    await db`
      CREATE TABLE IF NOT EXISTS newsletter_drafts (
        id SERIAL PRIMARY KEY,
        subject VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
        scheduled_at TIMESTAMP WITH TIME ZONE,
        sent_at TIMESTAMP WITH TIME ZONE,
        recipient_count INTEGER DEFAULT 0,
        created_by VARCHAR(255),
        archived BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Add archived column if it doesn't exist (for existing tables)
    try {
      await db`ALTER TABLE newsletter_drafts ADD COLUMN IF NOT EXISTS archived BOOLEAN DEFAULT FALSE`;
    } catch (e) {
      // Column might already exist
    }
    
    // Fetch active (non-archived) newsletters
    newsletterDrafts = await db`
      SELECT id, subject, content, status, scheduled_at, sent_at, recipient_count, created_by, archived, created_at, updated_at
      FROM newsletter_drafts
      WHERE archived = FALSE OR archived IS NULL
      ORDER BY created_at DESC
    `;

    // Fetch archived newsletters
    archivedNewsletters = await db`
      SELECT id, subject, content, status, scheduled_at, sent_at, recipient_count, created_by, archived, created_at, updated_at
      FROM newsletter_drafts
      WHERE archived = TRUE
      ORDER BY sent_at DESC
    `;
  } catch (e) {
    console.log('Newsletter drafts table error:', e);
  }

  // Fetch jobs
  let jobs: any[] = [];
  try {
    jobs = await db`
      SELECT id, title, department, job_type, location, summary, description, published, created_at, updated_at
      FROM jobs
      ORDER BY created_at DESC
    `;
  } catch (e) {
    console.log('Jobs table not found, skipping...');
  }

  return {
    adminEmail,
    jobApplications,
    blogs,
    jobs,
    subscribers,
    newsletterDrafts,
    archivedNewsletters
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
    const feature_image_url = data.get('feature_image_url') as string || null;
    const published = data.get('published') === 'on';
    const featured = data.get('featured') === 'on';

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
      INSERT INTO blogs (title, slug, excerpt, content, feature_image_url, published, featured)
      VALUES (${title}, ${slug}, ${excerpt}, ${content}, ${feature_image_url}, ${published}, ${featured})
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
    const feature_image_url = data.get('feature_image_url') as string || null;
    const published = data.get('published') === 'on';
    const featured = data.get('featured') === 'on';

    try {
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
            feature_image_url = ${feature_image_url}, published = ${published}, featured = ${featured}, updated_at = NOW()
        WHERE id = ${id}
      `;

      return { success: true, message: 'Blog updated' };
    } catch (e) {
      console.error('updateBlog error:', e);
      return fail(500, { error: true, message: 'Failed to update blog. Please try again.' });
    }
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
  },

  // Newsletter Actions
  deleteSubscriber: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`DELETE FROM email_list WHERE id = ${id}`;
    return { success: true, message: 'Subscriber removed' };
  },

  createDraft: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const subject = data.get('subject') as string;
    const content = data.get('content') as string;
    const status = data.get('status') as string || 'draft';
    const scheduledAt = data.get('scheduled_at') as string;

    const db = getDb();

    await db`
      INSERT INTO newsletter_drafts (subject, content, status, scheduled_at, created_by)
      VALUES (${subject}, ${content}, ${status}, ${scheduledAt || null}, ${adminEmail})
    `;

    return { success: true, message: 'Draft created' };
  },

  updateDraft: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const subject = data.get('subject') as string;
    const content = data.get('content') as string;
    const status = data.get('status') as string || 'draft';
    const scheduledAt = data.get('scheduled_at') as string;

    const db = getDb();

    await db`
      UPDATE newsletter_drafts 
      SET subject = ${subject}, content = ${content}, status = ${status}, 
          scheduled_at = ${scheduledAt || null}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return { success: true, message: 'Draft updated' };
  },

  deleteDraft: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`DELETE FROM newsletter_drafts WHERE id = ${id}`;
    return { success: true, message: 'Draft deleted' };
  },

  sendNewsletter: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const draftId = data.get('id');
    const db = getDb();

    // Get the draft
    const drafts = await db`SELECT * FROM newsletter_drafts WHERE id = ${draftId}`;
    if (drafts.length === 0) {
      return fail(404, { error: true, message: 'Draft not found' });
    }
    const draft = drafts[0];

    // Get all subscribers
    const subscribers = await db`SELECT email, name FROM email_list`;
    if (subscribers.length === 0) {
      return fail(400, { error: true, message: 'No subscribers to send to' });
    }

    // Send emails to all subscribers
    let successCount = 0;
    let failCount = 0;

    for (const subscriber of subscribers) {
      try {
        const result = await sendNewsletterEmail({
          subject: draft.subject,
          content: draft.content,
          recipientEmail: subscriber.email,
          recipientName: subscriber.name || undefined
        });

        if (result.success) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        console.error('Error sending to:', subscriber.email, error);
        failCount++;
      }
    }

    // Update the draft status to sent
    await db`
      UPDATE newsletter_drafts 
      SET status = 'sent', sent_at = NOW(), recipient_count = ${successCount}
      WHERE id = ${draftId}
    `;

    if (failCount > 0) {
      return { 
        success: true, 
        message: `Newsletter sent to ${successCount} subscribers. ${failCount} failed.` 
      };
    }

    return { success: true, message: `Newsletter sent to ${successCount} subscribers!` };
  },

  archiveNewsletter: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`UPDATE newsletter_drafts SET archived = TRUE, updated_at = NOW() WHERE id = ${id}`;
    return { success: true, message: 'Newsletter archived' };
  },

  unarchiveNewsletter: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`UPDATE newsletter_drafts SET archived = FALSE, updated_at = NOW() WHERE id = ${id}`;
    return { success: true, message: 'Newsletter restored' };
  },

  // Job Actions
  createJob: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const title = data.get('title') as string;
    const department = data.get('department') as string;
    const job_type = data.get('job_type') as string;
    const location = data.get('location') as string || 'Remote';
    const summary = data.get('summary') as string;
    const description = data.get('description') as string;
    const published = data.get('published') === 'on';
    const db = getDb();

    await db`
      INSERT INTO jobs (title, department, job_type, location, summary, description, published)
      VALUES (${title}, ${department}, ${job_type}, ${location}, ${summary}, ${description}, ${published})
    `;

    return { success: true, message: 'Job created' };
  },

  updateJob: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const title = data.get('title') as string;
    const department = data.get('department') as string;
    const job_type = data.get('job_type') as string;
    const location = data.get('location') as string || 'Remote';
    const summary = data.get('summary') as string;
    const description = data.get('description') as string;
    const published = data.get('published') === 'on';
    const db = getDb();

    await db`
      UPDATE jobs 
      SET title = ${title}, department = ${department}, job_type = ${job_type}, 
          location = ${location}, summary = ${summary}, description = ${description}, 
          published = ${published}, updated_at = NOW()
      WHERE id = ${id}
    `;

    return { success: true, message: 'Job updated' };
  },

  deleteJob: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const id = data.get('id');
    const db = getDb();

    await db`DELETE FROM jobs WHERE id = ${id}`;
    return { success: true, message: 'Job deleted' };
  },

  // Application Response Actions
  respondToApplication: async ({ request, cookies }) => {
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
      throw redirect(303, '/admin');
    }

    const data = await request.formData();
    const applicationId = data.get('applicationId');
    const status = data.get('status') as string; // 'accepted' or 'rejected'
    const customMessage = data.get('customMessage') as string;

    if (!applicationId || !status || !customMessage) {
      return fail(400, { error: true, message: 'Missing required fields' });
    }

    if (!['accepted', 'rejected'].includes(status)) {
      return fail(400, { error: true, message: 'Invalid status' });
    }

    const db = getDb();

    try {
      // Get application details
      const application = await db`
        SELECT id, name, email, job_title
        FROM job_applications
        WHERE id = ${applicationId}
      `;

      if (application.length === 0) {
        return fail(404, { error: true, message: 'Application not found' });
      }

      const app = application[0];

      // Update application status in database
      await db`
        UPDATE job_applications
        SET status = ${status}, response_message = ${customMessage}, response_sent_at = NOW(), updated_at = NOW()
        WHERE id = ${applicationId}
      `;

      // Send appropriate email to applicant
      if (status === 'accepted') {
        await sendJobApplicationAcceptanceEmail({
          applicantName: app.name,
          applicantEmail: app.email,
          jobTitle: app.job_title,
          customMessage
        });
      } else {
        await sendJobApplicationRejectionEmail({
          applicantName: app.name,
          applicantEmail: app.email,
          jobTitle: app.job_title,
          customMessage
        });
      }

      // Send notification to admins
      await sendApplicationResponseNotificationEmail({
        status: status as 'accepted' | 'rejected',
        applicantName: app.name,
        applicantEmail: app.email,
        jobTitle: app.job_title
      });

      return { success: true, message: `Application ${status}. Email sent to applicant and admins.` };
    } catch (error) {
      console.error('Error responding to application:', error);
      return fail(500, { error: true, message: 'Failed to send response' });
    }
  }
};
