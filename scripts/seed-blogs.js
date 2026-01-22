import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '..', '.env') });

const blogs = [
  {
    title: 'The Rise of Mixed Reality in Healthcare',
    slug: 'rise-of-mixed-reality-healthcare-' + Date.now(),
    excerpt: 'Exploring how XR technologies are revolutionizing medical training, patient care, and surgical procedures.',
    content: `Mixed reality is transforming healthcare in unprecedented ways. From surgical simulations that allow doctors to practice complex procedures without risk, to patient rehabilitation programs that gamify physical therapy, XR is making healthcare more effective and accessible.

Hospitals around the world are now using AR headsets to overlay patient vitals during surgery, while VR environments help patients manage chronic pain through immersive distraction therapy. The future of medicine is spatial, and we are just scratching the surface of what is possible.

At FinalBoss XR, we believe these technologies will become standard tools in every medical facility within the next decade.`,
    author: 'Dr. Sarah Chen',
    published: true,
    featured: false
  },
  {
    title: 'Building Performant Mobile Games with Unreal Engine 5',
    slug: 'building-performant-mobile-games-ue5-' + Date.now(),
    excerpt: 'Tips and tricks for optimizing UE5 games for mobile platforms without sacrificing visual quality.',
    content: `Mobile game development with Unreal Engine 5 presents unique challenges. The powerful Nanite and Lumen systems that make UE5 spectacular on PC need careful consideration on mobile.

In this deep dive, we explore LOD management, texture streaming strategies, and shader optimization techniques that helped us achieve 60fps gameplay on mid-range devices. We also cover the importance of profiling early and often, using tools like Unreal Insights to identify bottlenecks before they become problems.

Key takeaways include: batch draw calls aggressively, use mobile-specific material nodes, and never underestimate the power of good occlusion culling.`,
    author: 'Marcus Johnson',
    published: true,
    featured: false
  },
  {
    title: 'Why Spatial Audio is the Unsung Hero of Immersion',
    slug: 'spatial-audio-unsung-hero-immersion-' + Date.now(),
    excerpt: 'How 3D audio design can make or break your VR experience, and techniques to get it right.',
    content: `When people talk about immersive experiences, visuals often steal the spotlight. But ask any VR veteran and they will tell you: audio is at least half the experience.

Spatial audio creates presence. The subtle sound of footsteps behind you, the way voices fade as characters walk away, the ambient environmental sounds that tell your brain this world is real - these elements work subconsciously to deepen immersion.

We break down HRTF implementation, reverb zone design, and the often-overlooked importance of silence. Plus, practical tips for working with audio middleware like Wwise and FMOD in your XR projects.`,
    author: 'Audio Team',
    published: true,
    featured: false
  },
  {
    title: 'From Indie to Industry: Our First Year Journey',
    slug: 'indie-to-industry-first-year-journey-' + Date.now(),
    excerpt: 'Reflections on building FinalBoss XR from a garage startup to a growing XR studio.',
    content: `One year ago, FinalBoss XR was just an idea sketched on a whiteboard. Today, we have shipped our first game, secured partnerships with major XR platforms, and grown our team from 2 to 15 passionate creators.

This journey was not without challenges. We pivoted twice, nearly ran out of runway once, and learned more about business than we ever expected. But we also discovered the incredible power of community - our early supporters who believed in our vision even when all we had were prototypes and promises.

Here are the biggest lessons we learned, the mistakes we made, and why we would do it all over again.`,
    author: 'Eddie Taliaferro',
    published: true,
    featured: true
  },
  {
    title: 'The Ethics of AI NPCs: When Characters Feel Real',
    slug: 'ethics-ai-npcs-characters-feel-real-' + Date.now(),
    excerpt: 'As AI-driven NPCs become more convincing, what responsibilities do developers have?',
    content: `Large language models are enabling NPCs that can hold genuine conversations, remember past interactions, and exhibit personalities that feel startlingly human. This is exciting for game design, but it raises important questions.

What happens when players form emotional attachments to AI characters? How do we handle scenarios where NPCs might be subjected to virtual harm? Should AI characters have some form of simulated consent?

These are not just philosophical exercises - they are design decisions we face daily. We share our framework for ethical AI character design and invite the community to join this important conversation.`,
    author: 'Ethics Committee',
    published: true,
    featured: false
  },
  {
    title: 'Cosmic Collisions: Behind the Particle Systems',
    slug: 'cosmic-collisions-behind-particle-systems-' + Date.now(),
    excerpt: 'A technical breakdown of how we created the explosive visual effects in our debut game.',
    content: `The particle systems in Cosmic Collisions went through 47 iterations before we achieved the look we wanted. This post takes you behind the curtain of our VFX pipeline.

We start with our custom Niagara modules for procedural debris generation, move through our approach to GPU-driven particle physics, and end with the shader tricks that make everything glow just right.

Bonus: we share a downloadable sample project with our base explosion system that you can use in your own UE5 projects. Sometimes the best way to learn is to take something apart.`,
    author: 'VFX Team',
    published: true,
    featured: false
  }
];

async function insertBlogs() {
  const sql = neon(process.env.DATABASE_URL);
  
  for (const blog of blogs) {
    await sql`
      INSERT INTO blogs (title, slug, excerpt, content, author, published, featured)
      VALUES (${blog.title}, ${blog.slug}, ${blog.excerpt}, ${blog.content}, ${blog.author}, ${blog.published}, ${blog.featured})
    `;
    console.log('Created:', blog.title);
  }
  console.log('Done! Created 6 blogs.');
}

insertBlogs().catch(console.error);
