import { neon } from '@neondatabase/serverless';
import { env } from '$env/dynamic/private';

/**
 * Creates a Neon database client using the DATABASE_URL from environment variables.
 * Uses the pooled connection URL for better performance.
 */
export function getDb() {
    const databaseUrl = env.DATABASE_URL;
    
    if (!databaseUrl) {
        throw new Error('DATABASE_URL environment variable is not set');
    }
    
    return neon(databaseUrl);
}

/**
 * Initializes the job_applications table if it doesn't exist.
 * Call this once during app setup or let it auto-create on first use.
 */
export async function initializeJobApplicationsTable() {
    const sql = getDb();
    
    await sql`
        CREATE TABLE IF NOT EXISTS job_applications (
            id SERIAL PRIMARY KEY,
            job_id INTEGER NOT NULL,
            job_title VARCHAR(255) NOT NULL,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(20),
            linkedin VARCHAR(255),
            portfolio VARCHAR(255),
            experience TEXT NOT NULL,
            why_join TEXT NOT NULL,
            resume_filename VARCHAR(255),
            resume_data BYTEA,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    console.log('Job applications table initialized successfully');
}

/**
 * Initializes the captured_bots table if it doesn't exist.
 */
export async function initializeCapturedBotsTable() {
    const sql = getDb();
    
    await sql`
        CREATE TABLE IF NOT EXISTS captured_bots (
            id SERIAL PRIMARY KEY,
            form_type VARCHAR(50) NOT NULL,
            honeypot_field VARCHAR(50) NOT NULL,
            honeypot_value TEXT,
            form_data JSONB,
            ip_address VARCHAR(45),
            user_agent TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    console.log('Captured bots table initialized successfully');
}

interface CapturedBotData {
    formType: string;
    honeypotField: string;
    honeypotValue: string;
    formData: Record<string, unknown>;
    ipAddress?: string | null;
    userAgent?: string | null;
}

/**
 * Saves a captured bot to the database.
 */
export async function saveCapturedBot(data: CapturedBotData) {
    const sql = getDb();
    
    // Ensure table exists
    try {
        await initializeCapturedBotsTable();
    } catch {
        // Table might already exist, continue
    }
    
    await sql`
        INSERT INTO captured_bots (
            form_type,
            honeypot_field,
            honeypot_value,
            form_data,
            ip_address,
            user_agent
        ) VALUES (
            ${data.formType},
            ${data.honeypotField},
            ${data.honeypotValue},
            ${JSON.stringify(data.formData)},
            ${data.ipAddress || 'unknown'},
            ${data.userAgent || 'unknown'}
        )
    `;
    
    console.log(`🤖 Bot captured on ${data.formType} form`);
}

/**
 * Initializes the email_list table if it doesn't exist.
 */
export async function initializeEmailListTable() {
    const sql = getDb();
    
    await sql`
        CREATE TABLE IF NOT EXISTS email_list (
            id SERIAL PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            name VARCHAR(100),
            source VARCHAR(50) NOT NULL,
            subscribed_to_newsletter BOOLEAN DEFAULT false,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
    `;
    
    console.log('Email list table initialized successfully');
}

interface EmailListData {
    email: string;
    name?: string | null;
    source: 'contact_form' | 'cosmic_contact' | 'job_application' | 'newsletter';
    subscribedToNewsletter?: boolean;
}

/**
 * Adds an email to the email list. Updates if email already exists.
 */
export async function addToEmailList(data: EmailListData) {
    const sql = getDb();
    
    // Ensure table exists
    try {
        await initializeEmailListTable();
    } catch {
        // Table might already exist, continue
    }
    
    // Use upsert to handle duplicates - update name/source if email exists
    await sql`
        INSERT INTO email_list (
            email,
            name,
            source,
            subscribed_to_newsletter
        ) VALUES (
            ${data.email.toLowerCase().trim()},
            ${data.name || null},
            ${data.source},
            ${data.subscribedToNewsletter || false}
        )
        ON CONFLICT (email) 
        DO UPDATE SET
            name = COALESCE(EXCLUDED.name, email_list.name),
            subscribed_to_newsletter = CASE 
                WHEN EXCLUDED.subscribed_to_newsletter = true THEN true 
                ELSE email_list.subscribed_to_newsletter 
            END,
            updated_at = CURRENT_TIMESTAMP
    `;
    
    console.log(`📧 Email added/updated in list: ${data.email} (source: ${data.source})`);
}

/**
 * Subscribe an email to the newsletter.
 */
export async function subscribeToNewsletter(email: string, name?: string | null) {
    return addToEmailList({
        email,
        name,
        source: 'newsletter',
        subscribedToNewsletter: true
    });
}

/**
 * Unsubscribe an email from the newsletter.
 * Returns { found: boolean } indicating whether the email existed.
 */
export async function unsubscribeFromNewsletter(email: string): Promise<{ found: boolean }> {
    const sql = getDb();

    const result = await sql`
        UPDATE email_list
        SET subscribed_to_newsletter = false,
            updated_at = CURRENT_TIMESTAMP
        WHERE LOWER(email) = LOWER(${email.trim()})
    `;

    // neon returns rowCount on UPDATE
    const affected = (result as unknown as { rowCount?: number }).rowCount ?? 0;
    console.log(`📧 Unsubscribe request for ${email}: ${affected > 0 ? 'found and updated' : 'not found'}`);
    return { found: affected > 0 };
}

/**
 * Adds the summary column to jobs table if it doesn't exist.
 */
export async function addSummaryColumnToJobs() {
    const sql = getDb();
    
    try {
        await sql`
            ALTER TABLE jobs 
            ADD COLUMN IF NOT EXISTS summary TEXT DEFAULT '';
        `;
        console.log('Summary column added to jobs table');
    } catch (error) {
        console.log('Summary column already exists or error occurred:', error);
    }
}

export async function addStatusColumnsToApplications() {
    const sql = getDb();
    
    try {
        // Add status column with enum-like behavior using VARCHAR
        await sql`
            ALTER TABLE job_applications
            ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';
        `;
        console.log('Status column added to job_applications table');
    } catch (error) {
        console.log('Status column already exists or error occurred:', error);
    }
    
    try {
        // Add response_message column
        await sql`
            ALTER TABLE job_applications
            ADD COLUMN IF NOT EXISTS response_message TEXT;
        `;
        console.log('Response message column added to job_applications table');
    } catch (error) {
        console.log('Response message column already exists or error occurred:', error);
    }
    
    try {
        // Add response_sent_at column
        await sql`
            ALTER TABLE job_applications
            ADD COLUMN IF NOT EXISTS response_sent_at TIMESTAMP WITH TIME ZONE;
        `;
        console.log('Response sent at column added to job_applications table');
    } catch (error) {
        console.log('Response sent at column already exists or error occurred:', error);
    }
}

/**
 * Initializes the response_templates table if it doesn't exist.
 * Stores preset message templates for job application responses (acceptance/rejection).
 */
export async function initializeResponseTemplatesTable() {
    const sql = getDb();
    
    try {
        await sql`
            CREATE TABLE IF NOT EXISTS response_templates (
                id SERIAL PRIMARY KEY,
                template_type VARCHAR(20) NOT NULL UNIQUE,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                next_steps TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            )
        `;
        console.log('Response templates table initialized successfully');
        
        // Initialize with default templates if they don't exist
        await sql`
            INSERT INTO response_templates (template_type, title, message, next_steps)
            VALUES 
                ('acceptance', 'Default Acceptance Message', 
                 'We were impressed with your background and experience. We''d like to move forward with your application. Here''s what to expect next...', 
                 'We will be in touch soon with interview details.'),
                ('rejection', 'Default Rejection Message', 
                 'Thank you for your interest in joining Final Boss Studios. We appreciate the time you took to apply. Unfortunately, we''ve decided to move forward with other candidates at this time. We encourage you to apply again in the future.',
                 NULL)
            ON CONFLICT (template_type) DO NOTHING
        `;
        console.log('Default response templates inserted');
    } catch (error) {
        console.log('Response templates table initialization error:', error);
    }
}

export interface ResponseTemplate {
    id: number;
    template_type: 'acceptance' | 'rejection';
    title: string;
    message: string;
    next_steps: string | null;
    created_at: string;
    updated_at: string;
}

/**
 * Gets a response template by type (acceptance or rejection)
 */
export async function getResponseTemplate(templateType: 'acceptance' | 'rejection'): Promise<ResponseTemplate | null> {
    const sql = getDb();
    
    try {
        await initializeResponseTemplatesTable();
        
        const result = await sql`
            SELECT id, template_type, title, message, next_steps, created_at, updated_at
            FROM response_templates
            WHERE template_type = ${templateType}
        `;
        
        return result.length > 0 ? (result[0] as ResponseTemplate) : null;
    } catch (error) {
        console.error(`Error fetching response template for type ${templateType}:`, error);
        return null;
    }
}

/**
 * Gets all response templates
 */
export async function getAllResponseTemplates(): Promise<ResponseTemplate[]> {
    const sql = getDb();
    
    try {
        await initializeResponseTemplatesTable();
        
        const result = await sql`
            SELECT id, template_type, title, message, next_steps, created_at, updated_at
            FROM response_templates
            ORDER BY template_type
        `;
        
        return result as ResponseTemplate[];
    } catch (error) {
        console.error('Error fetching all response templates:', error);
        return [];
    }
}

/**
 * Updates a response template
 */
export async function updateResponseTemplate(
    templateType: 'acceptance' | 'rejection',
    title: string,
    message: string,
    nextSteps?: string | null
): Promise<ResponseTemplate | null> {
    const sql = getDb();
    
    try {
        await initializeResponseTemplatesTable();
        
        const result = await sql`
            UPDATE response_templates
            SET title = ${title}, message = ${message}, next_steps = ${nextSteps || null}, updated_at = CURRENT_TIMESTAMP
            WHERE template_type = ${templateType}
            RETURNING id, template_type, title, message, next_steps, created_at, updated_at
        `;
        
        return result.length > 0 ? (result[0] as ResponseTemplate) : null;
    } catch (error) {
        console.error(`Error updating response template for type ${templateType}:`, error);
        return null;
    }
}
