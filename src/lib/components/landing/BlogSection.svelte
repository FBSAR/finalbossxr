<script lang="ts">
  // Blog section component
  interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    author: string;
    published: boolean;
    created_at: string;
  }

  export let blogs: BlogPost[] = [];

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
</script>

<section class="blog-section" aria-label="Blog">
  <div class="blog-container">
    <div class="blog-header">
      <span class="section-label">Latest Updates</span>
      <h2 class="section-title gradient-text">From Our Blog</h2>
    </div>

    <div class="blog-grid">
      {#if blogs.length > 0}
        {#each blogs as blog (blog.id)}
          <article class="blog-card">
            <div class="blog-image">
              <div class="blog-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
              <span class="blog-category">{blog.author}</span>
            </div>
            <div class="blog-content">
              <span class="blog-date">{formatDate(blog.created_at)}</span>
              <h3 class="blog-title">{blog.title}</h3>
              <p class="blog-excerpt">{blog.excerpt}</p>
              <a href="/blog/{blog.slug}" class="blog-link">
                Read More
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </a>
            </div>
          </article>
        {/each}
      {:else}
        <div class="no-blogs">
          <h3>No Blog Posts Yet</h3>
          <p>Check back soon for our latest updates and insights!</p>
        </div>
      {/if}
    </div>
  </div>
</section>

<style>
  /* Blog Section */
  .blog-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
  }

  @media (max-width: 768px) {
    .blog-section {
      padding: 4rem 1rem;
    }
  }

  .blog-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-label {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 9999px;
    color: #00c400;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 768px) {
    .blog-grid {
      grid-template-columns: 1fr;
    }
  }

  .blog-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .blog-card:hover {
    border-color: rgba(0, 196, 0, 0.3);
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }

  .blog-image {
    position: relative;
    aspect-ratio: 16/10;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .blog-image-placeholder {
    color: rgba(255, 255, 255, 0.2);
  }

  .blog-category {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.25rem 0.75rem;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    font-size: 0.75rem;
    color: #00c400;
    font-weight: 500;
  }

  .blog-content {
    padding: 1.5rem;
  }

  .blog-date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .blog-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin: 0.75rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-excerpt {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin-bottom: 1rem;
  }

  .blog-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: #00c400;
    font-size: 0.875rem;
    font-weight: 500;
    text-decoration: none;
    transition: gap 0.3s ease;
  }

  .blog-link:hover {
    gap: 0.75rem;
  }

  .no-blogs {
    grid-column: 1 / -1;
    text-align: center;
    padding: 3rem 2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
  }

  .no-blogs h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
  }

  .no-blogs p {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.95rem;
  }

</style>
