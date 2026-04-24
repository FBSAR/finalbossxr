<script lang="ts">
  // Blog section component
  interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    feature_image_url: string | null;
    published: boolean;
    featured?: boolean;
    created_at: string;
  }

  export let blogs: BlogPost[] = [];

  let isVisible = false;

  // Intersection Observer action: reveal section when scrolled into view
  function observeSection(node: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get featured blog and other blogs
  $: featuredBlog = blogs.find(blog => blog.featured) || blogs[0];
  $: otherBlogs = blogs.filter(blog => !blog.featured);
</script>

<section class="blog-section" class:visible={isVisible} use:observeSection aria-label="Blog">
  <div class="blog-container">
    <div class="blog-header">
      <span class="section-label">Latest Updates</span>
      <h2 class="section-title gradient-text">From Our Blog</h2>
    </div>

    {#if blogs.length > 0}
      <!-- Featured Blog -->
      {#if featuredBlog}
        <article class="featured-blog-card">
          <div class="featured-blog-image">
            {#if featuredBlog.feature_image_url}
              <img src={featuredBlog.feature_image_url} alt={featuredBlog.title} class="featured-blog-image-img" loading="lazy" decoding="async" />
            {:else}
              <div class="featured-blog-image-placeholder">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            {/if}
            <span class="featured-badge">Featured</span>
          </div>
          <div class="featured-blog-content">
            <span class="featured-blog-date">{formatDate(featuredBlog.created_at)}</span>
            <h3 class="featured-blog-title">{featuredBlog.title}</h3>
            <p class="featured-blog-excerpt">{featuredBlog.excerpt}</p>
            <a href="/blog/{featuredBlog.slug}" class="featured-blog-link">
              Read Full Article
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </article>
      {/if}

      <!-- Other Blogs Grid -->
      {#if otherBlogs.length > 0}
        <div class="blog-grid">
          {#each otherBlogs as blog (blog.id)}
            <article class="blog-card">
              <div class="blog-image">
                {#if blog.feature_image_url}
                  <img src={blog.feature_image_url} alt={blog.title} class="blog-image-img" loading="lazy" decoding="async" />
                {:else}
                  <div class="blog-image-placeholder">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </div>
                {/if}
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
        </div>
      {/if}
    {:else}
      <div class="no-blogs">
        <h3>No Blog Posts Yet</h3>
        <p>Check back soon for our latest updates and insights!</p>
      </div>
    {/if}

    <div class="blog-footer">
      <a href="/blog" class="view-all-link">
        View All Articles
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
  </div>
</section>

<style>
  /* Blog Section */
  .blog-section {
    padding: 6rem 2rem;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 50%, transparent 100%);
    /* Initially hidden for scroll-into-view reveal */
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .blog-section.visible {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.2s;
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

  /* Featured Blog Card */
  .featured-blog-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    overflow: hidden;
    margin-bottom: 4rem;
    transition: all 0.3s ease;
  }

  .featured-blog-card:hover {
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 1024px) {
    .featured-blog-card {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .featured-blog-image {
    position: relative;
    aspect-ratio: 16/9;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.1) 0%, rgba(138, 43, 226, 0.1) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .featured-blog-image-placeholder {
    color: rgba(255, 255, 255, 0.2);
  }

  .featured-blog-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  .featured-badge {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(0, 196, 0, 0.9);
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 0.5rem;
  }

  .featured-blog-content {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
  }

  .featured-blog-date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.5rem;
  }

  .featured-blog-title {
    font-family: "Raleway", sans-serif;
    font-size: clamp(1.5rem, 3vw, 2rem);
    color: white;
    margin: 0.75rem 0;
    line-height: 1.3;
    font-weight: 700;
  }

  .featured-blog-excerpt {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
    margin-bottom: 1.5rem;
    flex-grow: 1;
  }

  .featured-blog-link {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 1.4rem;
    background: rgba(138, 43, 226, 0.15);
    border: 1px solid rgba(138, 43, 226, 0.5);
    border-radius: 0.75rem;
    color: #a855f7;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    width: fit-content;
  }

  .featured-blog-link:hover {
    gap: 1rem;
    background: rgba(138, 43, 226, 0.3);
    border-color: rgba(168, 85, 247, 0.8);
    color: #c084fc;
  }

  /* Blog Grid (for other posts) */
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    .blog-grid {
      grid-template-columns: 1fr;
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

  .blog-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
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
    font-family: "Raleway", sans-serif;
    font-size: 1.5rem;
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
    font-weight: 600;
    text-decoration: none;
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }

  .blog-link:hover {
    gap: 0.75rem;
    color: #00ff00;
  }

  .no-blogs {
    text-align: center;
    padding: 4rem 2rem;
    color: rgba(255, 255, 255, 0.5);
  }

  .no-blogs h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  /* Blog Footer */
  .blog-footer {
    display: flex;
    justify-content: center;
    margin-top: 3rem;
  }

  .view-all-link {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 0.75rem;
    color: #00c400;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .view-all-link:hover {
    background: rgba(0, 196, 0, 0.2);
    border-color: rgba(0, 196, 0, 0.5);
    gap: 1rem;
    color: #00ff00;
  }
</style>
