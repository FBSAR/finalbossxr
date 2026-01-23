<script lang="ts">
  import { page } from '$app/stores';
  
  export let data;
  
  $: posts = data.posts;
  $: featuredPost = posts.find((p: any) => p.featured) || posts[0];
  $: regularPosts = posts.filter((p: any) => p.id !== featuredPost?.id);
  
  let searchQuery = '';
  
  // Pagination
  const POSTS_PER_PAGE = 6;
  let currentPage = 1;
  
  $: filteredPosts = searchQuery
    ? posts.filter((p: any) => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : regularPosts;
  
  $: totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  $: paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );
  
  // Reset to page 1 when search changes
  $: if (searchQuery) currentPage = 1;
  
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      // Scroll to top of posts section
      document.querySelector('.max-w-6xl')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  function calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const words = content?.split(/\s+/).length || 0;
    return Math.ceil(words / wordsPerMinute);
  }
</script>

<svelte:head>
  <title>Blog | FinalBossXR</title>
  <meta name="description" content="Latest news, updates, and insights from FinalBossXR" />
</svelte:head>

<div class="min-h-screen">
  <!-- Hero Section -->
  <section class="relative pt-12 pb-16 px-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative max-w-6xl mx-auto text-center">
      <!-- SVG Animation -->
      <div class="blog-svg-container mb-6">
        <svg class="blog-illustration" viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blogGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00ff00" />
              <stop offset="100%" stop-color="#004d00" />
            </linearGradient>
            <linearGradient id="blogGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="rgba(0, 255, 0, 0.2)" />
              <stop offset="50%" stop-color="rgba(0, 255, 0, 0.5)" />
              <stop offset="100%" stop-color="rgba(0, 255, 0, 0.2)" />
            </linearGradient>
            <filter id="blogGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          <!-- Main Document -->
          <rect x="50" y="20" width="100" height="120" rx="8" fill="rgba(0, 255, 0, 0.05)" stroke="#00ff00" stroke-width="1.5" filter="url(#blogGlow)" />
          
          <!-- Document Header Line -->
          <rect x="65" y="35" width="50" height="6" rx="3" fill="rgba(0, 255, 0, 0.4)">
            <animate attributeName="width" values="50;60;50" dur="3s" repeatCount="indefinite" />
          </rect>
          
          <!-- Text Lines -->
          <rect x="65" y="55" width="70" height="3" rx="1.5" fill="rgba(0, 255, 0, 0.25)">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" />
          </rect>
          <rect x="65" y="65" width="60" height="3" rx="1.5" fill="rgba(0, 255, 0, 0.2)">
            <animate attributeName="opacity" values="0.2;0.45;0.2" dur="2s" repeatCount="indefinite" begin="0.3s" />
          </rect>
          <rect x="65" y="75" width="65" height="3" rx="1.5" fill="rgba(0, 255, 0, 0.25)">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" begin="0.6s" />
          </rect>
          <rect x="65" y="85" width="55" height="3" rx="1.5" fill="rgba(0, 255, 0, 0.2)">
            <animate attributeName="opacity" values="0.2;0.45;0.2" dur="2s" repeatCount="indefinite" begin="0.9s" />
          </rect>
          <rect x="65" y="95" width="70" height="3" rx="1.5" fill="rgba(0, 255, 0, 0.25)">
            <animate attributeName="opacity" values="0.25;0.5;0.25" dur="2s" repeatCount="indefinite" begin="1.2s" />
          </rect>
          
          <!-- Floating Elements -->
          <circle cx="35" cy="50" r="8" fill="none" stroke="rgba(0, 255, 0, 0.3)" stroke-width="1.5">
            <animate attributeName="cy" values="50;45;50" dur="4s" repeatCount="indefinite" />
          </circle>
          <circle cx="35" cy="50" r="3" fill="#00ff00" opacity="0.5">
            <animate attributeName="cy" values="50;45;50" dur="4s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0.8;0.5" dur="2s" repeatCount="indefinite" />
          </circle>
          
          <circle cx="165" cy="70" r="10" fill="none" stroke="rgba(0, 255, 0, 0.25)" stroke-width="1.5">
            <animate attributeName="cy" values="70;65;70" dur="3.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="165" cy="70" r="4" fill="#00ff00" opacity="0.4">
            <animate attributeName="cy" values="70;65;70" dur="3.5s" repeatCount="indefinite" />
          </circle>
          
          <!-- Connection Lines -->
          <path d="M40 55 Q45 40 50 35" stroke="url(#blogGradient2)" stroke-width="1" fill="none" stroke-dasharray="3 3">
            <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" />
          </path>
          <path d="M160 75 Q155 60 150 50" stroke="url(#blogGradient2)" stroke-width="1" fill="none" stroke-dasharray="3 3">
            <animate attributeName="stroke-dashoffset" values="0;-12" dur="1.5s" repeatCount="indefinite" begin="0.5s" />
          </path>
        </svg>
      </div>
       
      <h1 class="text-5xl md:text-6xl font-bold text-white mb-4">
        <span class="text-7xl jersey-font gradient-text">
          Blog
        </span>
      </h1>
      <p class="text-xl text-gray-400 max-w-2xl mx-auto">
        Latest news, dev logs, and insights from the FinalBossXR team
      </p>
    </div>
  </section>

  <!-- Search Bar -->
  <section class="px-4 pb-8">
    <div class="max-w-6xl mx-auto">
      <div class="relative max-w-md mx-auto">
        <input
          type="text"
          bind:value={searchQuery}
          placeholder="Search articles..."
          class="w-full px-5 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#00c400]/50 focus:ring-2 focus:ring-[#00c400]/20 transition-all"
        />
        <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
    </div>
  </section>

  <!-- Main Content -->
  <section class="px-4 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if posts.length === 0}
        <!-- Empty State -->
        <div class="text-center py-20">
          <div class="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
            <span class="text-4xl">📝</span>
          </div>
          <h2 class="text-2xl font-semibold text-white mb-2">No posts yet</h2>
          <p class="text-gray-400">Check back soon for updates and articles!</p>
        </div>
      {:else}
        <!-- Featured Post -->
        {#if featuredPost && !searchQuery}
          <div class="mb-12">
            <h2 class="text-sm font-semibold text-[#f2e41c] uppercase tracking-wider mb-4">Featured</h2>
            <a 
              href="/blog/{featuredPost.slug}"
              class="featured-card group block"
            >
              <div class="featured-content">
                <div class="flex items-center gap-3 mb-4">
                  <span class="featured-badge">
                    Featured
                  </span>
                  <span class="text-sm text-gray-500">
                    {formatDate(featuredPost.created_at)}
                  </span>
                  <span class="text-sm text-gray-500">
                    · {calculateReadTime(featuredPost.content)} min read
                  </span>
                </div>
                <h3 class="text-2xl md:text-3xl gradient-text mb-3 group-hover:text-[#00c400] transition-colors">
                  {featuredPost.title}
                </h3>
                <p class="text-gray-400 text-lg mb-4 line-clamp-2">
                  {featuredPost.excerpt || featuredPost.content?.substring(0, 200) + '...'}
                </p>
                <div class="flex items-center gap-2 text-[#00c400] font-medium">
                  Read more
                  <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </a>
          </div>
        {/if}

        <!-- Posts Grid -->
        {#if filteredPosts.length > 0 || searchQuery}
          <div>
            <h2 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-6">
              {searchQuery ? `Search Results (${filteredPosts.length})` : 'All Posts'}
            </h2>
            
            {#if filteredPosts.length === 0}
              <div class="text-center py-12">
                <p class="text-gray-400">No posts found matching "{searchQuery}"</p>
              </div>
            {:else}
              <div class="blog-grid">
                {#each paginatedPosts as post}
                  <article class="blog-card">
                    <a href="/blog/{post.slug}" class="blog-card-link">
                      <div class="blog-image">
                        <div class="blog-image-placeholder">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="8.5" cy="8.5" r="1.5"></circle>
                            <polyline points="21 15 16 10 5 21"></polyline>
                          </svg>
                        </div>
                        <span class="blog-category">Article</span>
                      </div>
                      <div class="blog-content">
                        <span class="blog-date">{formatDate(post.created_at)} · {calculateReadTime(post.content)} min read</span>
                        <h3 class="blog-title">{post.title}</h3>
                        <p class="blog-excerpt">{post.excerpt || post.content?.substring(0, 150) + '...'}</p>
                        <span class="blog-link">
                          Read More
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </a>
                  </article>
                {/each}
              </div>
              
              <!-- Pagination -->
              {#if totalPages > 1}
                <div class="pagination">
                  <button 
                    class="pagination-btn"
                    disabled={currentPage === 1}
                    on:click={() => goToPage(currentPage - 1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M15 18l-6-6 6-6"/>
                    </svg>
                    Prev
                  </button>
                  
                  <div class="pagination-numbers">
                    {#each Array(totalPages) as _, i}
                      <button 
                        class="pagination-num"
                        class:active={currentPage === i + 1}
                        on:click={() => goToPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    {/each}
                  </div>
                  
                  <button 
                    class="pagination-btn"
                    disabled={currentPage === totalPages}
                    on:click={() => goToPage(currentPage + 1)}
                  >
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </button>
                </div>
                
                <p class="pagination-info">
                  Showing {(currentPage - 1) * POSTS_PER_PAGE + 1} - {Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} of {filteredPosts.length} posts
                </p>
              {/if}
            {/if}
          </div>
        {/if}
      {/if}
    </div>
  </section>
</div>

<style>
  .blog-svg-container {
    display: flex;
    justify-content: center;
    animation: floatBlog 4s ease-in-out infinite;
  }

  .blog-illustration {
    width: 200px;
    height: 160px;
    filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.3));
  }

  @keyframes floatBlog {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
  }

  @media (max-width: 640px) {
    .blog-illustration {
      width: 160px;
      height: 128px;
    }
  }

  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .line-clamp-3 {
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Blog Grid - Landing Page Style */
  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media (max-width: 1024px) {
    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
    }
  }

  @media (max-width: 640px) {
    .blog-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
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
    transform: translateY(-4px);
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 20px 40px -20px rgba(0, 196, 0, 0.2);
  }

  .blog-card-link {
    display: block;
    text-decoration: none;
    color: inherit;
  }

  .blog-image {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .blog-image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.1) 0%, rgba(0, 100, 0, 0.15) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 196, 0, 0.4);
  }

  .blog-category {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.25rem 0.75rem;
    background: rgba(0, 0, 0, 0.7);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #00c400;
  }

  .blog-content {
    padding: 1.5rem;
  }

  .blog-date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .blog-title {
    font-size: 1.125rem;
    font-weight: 400;
    color: #fff;
    margin: 0.75rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-excerpt {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #00c400;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .blog-card:hover .blog-link {
    gap: 0.75rem;
  }

  .blog-link svg {
    transition: transform 0.3s ease;
  }

  .blog-card:hover .blog-link svg {
    transform: translateX(4px);
  }

  /* Featured Card */
  .featured-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .featured-card:hover {
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 20px 40px -20px rgba(0, 196, 0, 0.2);
  }

  .featured-content {
    padding: 2rem;
  }

  @media (min-width: 768px) {
    .featured-content {
      padding: 2.5rem;
    }
  }

  .featured-badge {
    padding: 0.25rem 0.75rem;
    background: rgba(0, 196, 0, 0.15);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #00c400;
  }

  /* Pagination */
  .pagination {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
  }

  .pagination-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: white;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-btn:hover:not(:disabled) {
    background: rgba(0, 196, 0, 0.1);
    border-color: rgba(0, 196, 0, 0.3);
    color: #00c400;
  }

  .pagination-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .pagination-numbers {
    display: flex;
    gap: 0.5rem;
  }

  .pagination-num {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .pagination-num:hover {
    background: rgba(0, 196, 0, 0.1);
    border-color: rgba(0, 196, 0, 0.3);
    color: white;
  }

  .pagination-num.active {
    background: #00c400;
    border-color: #00c400;
    color: black;
    font-weight: 600;
  }

  .pagination-info {
    text-align: center;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.875rem;
    margin-top: 1rem;
  }

  @media (max-width: 640px) {
    .pagination {
      flex-wrap: wrap;
      gap: 0.75rem;
    }

    .pagination-btn {
      padding: 0.625rem 1rem;
      font-size: 0.8rem;
    }

    .pagination-btn span {
      display: none;
    }

    .pagination-num {
      width: 36px;
      height: 36px;
      font-size: 0.8rem;
    }
  }
</style>
