import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
dotenv.config();
const sql = neon(process.env.DATABASE_URL);

// Use tagged template literal for DDL (sql.unsafe silently fails on pooler)
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
console.log('blogs table created');

await sql`CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug)`;
await sql`CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published) WHERE published = TRUE`;
console.log('indexes created');

const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
console.log('Tables:', tables.map(t => t.tablename));
