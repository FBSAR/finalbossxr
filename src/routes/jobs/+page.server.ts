import { fail } from '@sveltejs/kit';
import { getDb, initializeJobApplicationsTable, saveCapturedBot, addToEmailList } from '$lib/db';
import { sendApplicationConfirmationEmail } from '$lib/email';
import { env } from '$env/dynamic/private';
import { neon } from '@neondatabase/serverless';
import type { Actions } from './$types';

export const prerender = false;

// Initialize the table on first import (only creates if doesn't exist)
let tableInitialized = true;

async function ensureTableExists() {
    if (!tableInitialized) {
        try {
            await initializeJobApplicationsTable();
            tableInitialized = true;
        } catch (error) {
            console.error('Failed to initialize job applications table:', error);
            // Don't throw - the table might already exist
        }
    }
}

/**
 * Loads all published jobs from the database
 */
export async function load() {
	try {
		const sql = neon(env.DATABASE_URL);
		const jobs = await sql`
   SELECT id, title, department, job_type, location, description, published, created_at
			FROM jobs
			WHERE published = true
			ORDER BY created_at DESC
		`;

		return {
			jobs: jobs as Array<{
				id: number;
				title: string;
				department: string;
				job_type: string;
				location: string;
				description: string;
				icon: string;
				published: boolean;
				created_at: string;
			}>
		};
	} catch (error) {
		console.error('Error fetching jobs:', error);
		return {
			jobs: []
		};
	}
}

export const actions: Actions = {
    default: async ({ request }) => {
        // Ensure the table exists before inserting
        await ensureTableExists();
        
        const formData = await request.formData();
        
        // Honeypot check - if filled, it's a bot
        const honeypot = formData.get('company') as string;
        if (honeypot) {
            console.log('Bot detected via honeypot on job application form');
            
            // Save bot data to database
            await saveCapturedBot({
                formType: 'job_application',
                honeypotField: 'company',
                honeypotValue: honeypot,
                formData: {
                    jobId: formData.get('jobId') as string,
                    jobTitle: formData.get('jobTitle') as string,
                    name: formData.get('name') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    linkedin: formData.get('linkedin') as string,
                    portfolio: formData.get('portfolio') as string,
                    experience: formData.get('experience') as string,
                    whyJoin: formData.get('whyJoin') as string
                },
                ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip'),
                userAgent: request.headers.get('user-agent')
            });
            
            // Return success to trick the bot, but don't process
            return { success: true, message: 'Application submitted successfully!' };
        }
        
        // Extract form fields
        const jobId = formData.get('jobId') as string;
        const jobTitle = formData.get('jobTitle') as string;
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string || null;
        const linkedin = formData.get('linkedin') as string || null;
        const portfolio = formData.get('portfolio') as string || null;
        const experience = formData.get('experience') as string;
        const whyJoin = formData.get('whyJoin') as string;
        const resume = formData.get('resume') as File | null;
        
        // Server-side validation
        if (!name || !email || !experience || !whyJoin) {
            return fail(400, { 
                success: false,
                message: 'Please fill out all required fields.' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return fail(400, { 
                success: false,
                message: 'Please enter a valid email address.' 
            });
        }
        
        // Minimum length validation
        if (experience.length < 50) {
            return fail(400, { 
                success: false,
                message: 'Experience description should be at least 50 characters.' 
            });
        }
        
        if (whyJoin.length < 50) {
            return fail(400, { 
                success: false,
                message: 'Please tell us more about why you want to join (at least 50 characters).' 
            });
        }
        
        // Resume validation
        if (!resume || resume.size === 0) {
            return fail(400, { 
                success: false,
                message: 'Please upload your resume.' 
            });
        }
        
        // File size validation (5MB max)
        if (resume.size > 5 * 1024 * 1024) {
            return fail(400, { 
                success: false,
                message: 'Resume file must be less than 5MB.' 
            });
        }
        
        try {
            const sql = getDb();
            
            // Convert file to buffer for storage
            const resumeBuffer = Buffer.from(await resume.arrayBuffer());
            
            // Insert application into database
            await sql`
                INSERT INTO job_applications (
                    job_id,
                    job_title,
                    name,
                    email,
                    phone,
                    linkedin,
                    portfolio,
                    experience,
                    why_join,
                    resume_filename,
                    resume_data
                ) VALUES (
                    ${parseInt(jobId) || 0},
                    ${jobTitle || 'Unknown Position'},
                    ${name},
                    ${email},
                    ${phone},
                    ${linkedin},
                    ${portfolio},
                    ${experience},
                    ${whyJoin},
                    ${resume.name},
                    ${resumeBuffer}
                )
            `;
            
            console.log(`New job application submitted: ${name} for ${jobTitle}`);
            
            // Add email to mailing list
            await addToEmailList({
                email,
                name,
                source: 'job_application'
            });
            
            // Send confirmation email to applicant
            const emailResult = await sendApplicationConfirmationEmail({
                applicantName: name,
                applicantEmail: email,
                jobTitle: jobTitle || 'Unknown Position',
                phone,
                linkedin,
                portfolio,
                experience,
                whyJoin
            });
            
            if (!emailResult.success) {
                console.warn('Failed to send confirmation email, but application was saved:', emailResult.error);
            }
            
            return { 
                success: true,
                message: 'Application submitted successfully!' 
            };
            
        } catch (error) {
            console.error('Error saving job application:', error);
            return fail(500, { 
                success: false,
                message: 'An error occurred while submitting your application. Please try again later.' 
            });
        }
    }
};
