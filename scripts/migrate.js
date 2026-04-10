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

console.log('All migrations complete!');

console.log('All migrations complete!');
