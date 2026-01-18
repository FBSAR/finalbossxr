-- Blogs table migration
-- Run this SQL in your Neon database console

CREATE TABLE IF NOT EXISTS blogs (
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
);

-- Create index for slug lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Create index for published posts
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published) WHERE published = TRUE;
