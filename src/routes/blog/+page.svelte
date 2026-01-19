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

<div class="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
  <!-- Hero Section -->
  <section class="relative pt-32 pb-16 px-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative max-w-6xl mx-auto text-center">
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
