import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

// 001_create_blogs
await sql`CREATE TABLE IF NOT EXISTS blogs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  feature_image_url TEXT,
  author VARCHAR(100) DEFAULT 'FinalBoss XR',
  published BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`;
await sql`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`;
await sql`CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published) WHERE published = TRUE`;
console.log('Done: 001_create_blogs');

// 002_create_newsletter_drafts
await sql`CREATE TABLE IF NOT EXISTS newsletter_drafts (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
  scheduled_at TIMESTAMP WITH TIME ZONE,
  sent_at TIMESTAMP WITH TIME ZONE,
  recipient_count INTEGER DEFAULT 0,
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`;
await sql`CREATE INDEX IF NOT EXISTS idx_newsletter_drafts_status ON newsletter_drafts(status)`;
console.log('Done: 002_create_newsletter_drafts');

// 003_create_job_applications
await sql`CREATE TABLE IF NOT EXISTS job_applications (
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
)`;
await sql`CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id)`;
await sql`CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email)`;
console.log('Done: 003_create_job_applications');

// 004_create_email_list
await sql`CREATE TABLE IF NOT EXISTS email_list (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(100),
  source VARCHAR(50) NOT NULL,
  subscribed_to_newsletter BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`;
await sql`CREATE INDEX IF NOT EXISTS idx_email_list_email ON email_list(email)`;
await sql`CREATE INDEX IF NOT EXISTS idx_email_list_source ON email_list(source)`;
console.log('Done: 004_create_email_list');

// 005_create_captured_bots
await sql`CREATE TABLE IF NOT EXISTS captured_bots (
  id SERIAL PRIMARY KEY,
  form_type VARCHAR(50) NOT NULL,
  honeypot_field VARCHAR(50) NOT NULL,
  honeypot_value TEXT,
  form_data JSONB,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`;
await sql`CREATE INDEX IF NOT EXISTS idx_captured_bots_form_type ON captured_bots(form_type)`;
await sql`CREATE INDEX IF NOT EXISTS idx_captured_bots_created_at ON captured_bots(created_at)`;
console.log('Done: 005_create_captured_bots');

// 006_add_feature_image_to_blogs
try {
  await sql`ALTER TABLE blogs ADD COLUMN feature_image_url TEXT`;
  console.log('Done: 006_add_feature_image_to_blogs (column added)');
} catch (e) {
  // Column likely already exists
  console.log('Done: 006_add_feature_image_to_blogs (column already exists)');
}

// 007_create_jobs
await sql`CREATE TABLE IF NOT EXISTS jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  department VARCHAR(100) NOT NULL,
  job_type VARCHAR(50) NOT NULL,
  location VARCHAR(100) DEFAULT 'Remote',
  description TEXT NOT NULL,
  icon VARCHAR(10) DEFAULT '💼',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
)`;
await sql`CREATE INDEX IF NOT EXISTS idx_jobs_published ON jobs(published)`;
console.log('Done: 007_create_jobs');

console.log('All migrations complete!');
