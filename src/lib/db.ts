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
