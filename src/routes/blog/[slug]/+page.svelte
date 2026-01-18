<script lang="ts">
  import { page } from '$app/stores';
  
  export let data;
  
  $: post = data.post;
  $: relatedPosts = data.relatedPosts;
  
  let copied = false;

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

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }

  function shareTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(post.title);
    window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
  }

  function shareLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
  }
</script>

<svelte:head>
  <title>{post.title} | FinalBossXR Blog</title>
  <meta name="description" content={post.excerpt || post.content?.substring(0, 160)} />
</svelte:head>

<div class="min-h-screen bg-gradient-to-b from-[#0a0a0f] via-[#12121a] to-[#0a0a0f]">
  <!-- Header -->
  <section class="relative pt-32 pb-12 px-4">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute top-20 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div class="absolute bottom-10 right-1/4 w-80 h-80 bg-emerald-600/10 rounded-full blur-3xl"></div>
    </div>
    
    <div class="relative max-w-3xl mx-auto">
      <!-- Back Link -->
      <a 
        href="/blog" 
        class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </a>
      
      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-4">
        <span>{formatDate(post.created_at)}</span>
        <span>·</span>
        <span>{calculateReadTime(post.content)} min read</span>
        {#if post.author}
          <span>·</span>
          <span>By {post.author}</span>
        {/if}
      </div>
      
      <!-- Title -->
      <h1 class="text-4xl md:text-5xl green-header-text text-white mb-6">
        {post.title}
      </h1>
      
      <!-- Excerpt -->
      {#if post.excerpt}
        <p class="text-xl text-gray-400">
          {post.excerpt}
        </p>
      {/if}
    </div>
  </section>

  <!-- Content -->
  <section class="px-4 pb-16">
    <div class="max-w-3xl mx-auto">
      <article class="prose prose-invert prose-lg max-w-none">
        <div class="text-gray-300 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>
      </article>
      
      <!-- Share Buttons -->
      <div class="mt-12 pt-8 border-t border-white/10">
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Share this post</h3>
        <div class="flex gap-3">
          <button
            on:click={shareTwitter}
            class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            Twitter
          </button>
          <button
            on:click={shareLinkedIn}
            class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
            LinkedIn
          </button>
          <button
            on:click={copyLink}
            class="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-300 hover:bg-white/10 hover:border-white/20 transition-all"
          >
            {#if copied}
              <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Copied!
            {:else}
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Link
            {/if}
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Related Posts -->
  {#if relatedPosts.length > 0}
    <section class="px-4 pb-20">
      <div class="max-w-6xl mx-auto">
        <h2 class="text-2xl font-bold text-white mb-8">Related Posts</h2>
        <div class="grid md:grid-cols-3 gap-6">
          {#each relatedPosts as relatedPost}
            <a 
              href="/blog/{relatedPost.slug}"
              class="group block bg-white/[0.03] border border-white/10 rounded-xl p-6 hover:border-purple-500/30 hover:bg-white/[0.05] transition-all duration-300"
            >
              <div class="text-sm text-gray-500 mb-2">
                {formatDate(relatedPost.created_at)}
              </div>
              <h3 class="text-lg font-semibold text-white group-hover:text-purple-300 transition-colors line-clamp-2">
                {relatedPost.title}
              </h3>
              {#if relatedPost.excerpt}
                <p class="text-gray-400 text-sm mt-2 line-clamp-2">
                  {relatedPost.excerpt}
                </p>
              {/if}
            </a>
          {/each}
        </div>
      </div>
    </section>
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
