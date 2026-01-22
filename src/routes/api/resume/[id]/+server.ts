import { getDb } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const ALLOWED_ADMINS = ['eddie@finalbossxr.com', 'keith@finalbossxr.com'];

export const GET: RequestHandler = async ({ params, cookies }) => {
    // Check admin authentication
    const adminEmail = cookies.get('admin_auth');
    if (!adminEmail || !ALLOWED_ADMINS.includes(adminEmail)) {
        throw error(401, 'Unauthorized');
    }

    const { id } = params;
    
    if (!id || isNaN(parseInt(id))) {
        throw error(400, 'Invalid application ID');
    }

    const db = getDb();
    
    // Fetch the resume data
    const results = await db`
        SELECT resume_filename, resume_data
        FROM job_applications
        WHERE id = ${parseInt(id)}
    `;

    if (results.length === 0) {
        throw error(404, 'Application not found');
    }

    const application = results[0];
    
    if (!application.resume_data) {
        throw error(404, 'No resume attached to this application');
    }

    // Determine content type based on filename
    const filename = application.resume_filename || 'resume.pdf';
    let contentType = 'application/octet-stream';
    
    if (filename.endsWith('.pdf')) {
        contentType = 'application/pdf';
    } else if (filename.endsWith('.doc')) {
        contentType = 'application/msword';
    } else if (filename.endsWith('.docx')) {
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }

    // Convert the binary data to a response
    const resumeBuffer = Buffer.from(application.resume_data);
    
    return new Response(resumeBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Disposition': `inline; filename="${filename}"`,
            'Content-Length': resumeBuffer.length.toString()
        }
    });
};
