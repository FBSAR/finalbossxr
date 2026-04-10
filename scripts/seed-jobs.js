import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

const sql = neon(process.env.DATABASE_URL);

const jobsToSeed = [
  {
    title: 'Game Developer',
    department: 'Engineering',
    job_type: 'Part-time',
    location: 'Remote',
    description: 'Join our team to build immersive XR gaming experiences using Unreal Engine. Work on cutting-edge VR/AR projects.',
    icon: '🎮',
    published: true
  },
  {
    title: 'Graphic Designer & Illustrator',
    department: 'Design',
    job_type: 'Project-based',
    location: 'Remote',
    description: 'Design intuitive and visually stunning interfaces for our XR applications. Push the boundaries of spatial computing.',
    icon: '🎨',
    published: true
  }
];

console.log('Seeding jobs...');

for (const job of jobsToSeed) {
  try {
    await sql`
      INSERT INTO jobs (title, department, job_type, location, description, icon, published)
      VALUES (${job.title}, ${job.department}, ${job.job_type}, ${job.location}, ${job.description}, ${job.icon}, ${job.published})
    `;
    console.log(`✓ Added: ${job.title}`);
  } catch (error) {
    console.error(`✗ Failed to add ${job.title}:`, error.message);
  }
}

console.log('Jobs seeded successfully!');
