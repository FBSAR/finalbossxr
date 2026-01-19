<script lang="ts">
  import { page } from '$app/stores';
  
  export let data;
  
  $: posts = data.posts;
  $: featuredPost = posts.find((p: any) => p.featured) || posts[0];
  $: regularPosts = posts.filter((p: any) => p.id !== featuredPost?.id);
  
  let searchQuery = '';
  
  $: filteredPosts = searchQuery
    ? posts.filter((p: any) => 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.excerpt?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : regularPosts;

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
          class="w-full px-5 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all"
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
            <h2 class="text-sm font-semibold text-purple-400 uppercase tracking-wider mb-4">Featured</h2>
            <a 
              href="/blog/{featuredPost.slug}"
              class="group block bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-2xl overflow-hidden hover:border-purple-500/30 transition-all duration-300"
            >
              <div class="p-8 md:p-10">
                <div class="flex items-center gap-3 mb-4">
                  <span class="px-3 py-1 text-xs font-medium bg-purple-500/20 text-purple-300 rounded-full">
                    Featured
                  </span>
                  <span class="text-sm text-gray-500">
                    {formatDate(featuredPost.created_at)}
                  </span>
                  <span class="text-sm text-gray-500">
                    · {calculateReadTime(featuredPost.content)} min read
                  </span>
                </div>
                <h3 class="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                  {featuredPost.title}
                </h3>
                <p class="text-gray-400 text-lg mb-4 line-clamp-2">
                  {featuredPost.excerpt || featuredPost.content?.substring(0, 200) + '...'}
                </p>
                <div class="flex items-center gap-2 text-purple-400 font-medium">
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
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {#each filteredPosts as post}
                  <a 
                    href="/blog/{post.slug}"
                    class="group block bg-white/[0.03] border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300"
                  >
                    <div class="p-6">
                      <div class="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <span>{formatDate(post.created_at)}</span>
                        <span>·</span>
                        <span>{calculateReadTime(post.content)} min read</span>
                      </div>
                      <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      <p class="text-gray-400 text-sm line-clamp-3 mb-4">
                        {post.excerpt || post.content?.substring(0, 150) + '...'}
                      </p>
                      <div class="flex items-center gap-2 text-sm text-purple-400 font-medium">
                        Read more
                        <svg class="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </a>
                {/each}
              </div>
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
</style>
