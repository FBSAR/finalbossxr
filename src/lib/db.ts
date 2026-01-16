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
