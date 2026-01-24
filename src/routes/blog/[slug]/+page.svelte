<script lang="ts">
  import { page } from '$app/stores';
  import { marked } from 'marked';
  import KickstarterPromo from '$lib/components/landing/KickstarterPromo.svelte';
  import NewsletterSection from '$lib/components/landing/NewsletterSection.svelte';
  
  export let data;
  
  $: post = data.post;
  $: relatedPosts = data.relatedPosts;
  
  // Configure marked for GitHub-flavored markdown
  marked.setOptions({
    breaks: true,
    gfm: true
  });
  
  // Parse markdown content
  $: renderedContent = post.content ? marked(post.content) : '';
  
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

<div class="min-h-screen">
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
      <div class="flex flex-wrap items-center gap-3 text-sm text-gray-400">
        <span>{formatDate(post.created_at)}</span>
        <span>·</span>
        <span>{calculateReadTime(post.content)} min read</span>
        {#if post.author}
          <span>·</span>
          <span>By {post.author}</span>
        {/if}
      </div>

      <!-- Title -->
      <h1 class="text-4xl md:text-5xl font-bold gradient-text mt-6">
        {post.title}
      </h1>
    </div>
  </section>

  <!-- Content -->
  <section class="px-4 pb-2">
    <div class="max-w-3xl mx-auto">
      
      <!-- Excerpt -->
      {#if post.excerpt}
        <p class="text-xl text-gray-400 my-6">
          {post.excerpt}
        </p>
      {/if}

      <article class="prose">
        {@html renderedContent}
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
        <h2 class="text-2xl gradient-text mb-8">Related Posts</h2>
        <div class="grid md:grid-cols-3 gap-6">
          {#each relatedPosts as relatedPost}
            <a 
              href="/blog/{relatedPost.slug}"
              class="related-post-card group"
            >
              <div class="related-post-image">
                <div class="related-post-placeholder">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                {#if relatedPost.featured}
                  <span class="related-post-badge">Featured</span>
                {/if}
              </div>
              <div class="related-post-content">
                <div class="related-post-date">
                  {formatDate(relatedPost.created_at)}
                </div>
                <h3 class="related-post-title">
                  {relatedPost.title}
                </h3>
                {#if relatedPost.excerpt}
                  <p class="related-post-excerpt">
                    {relatedPost.excerpt}
                  </p>
                {/if}
                <span class="related-post-link">
                  Read more
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </div>
            </a>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Newsletter Section -->
  <NewsletterSection />

  <!-- Kickstarter Promo -->
  <KickstarterPromo />
</div>

<style>
  /* Related Posts Styles */
  .related-post-card {
    display: block;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
    text-decoration: none;
  }

  .related-post-card:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 20px 40px -20px rgba(0, 196, 0, 0.2);
  }

  .related-post-image {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .related-post-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.1) 0%, rgba(0, 100, 0, 0.15) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 196, 0, 0.4);
  }

  .related-post-badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
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

  .related-post-content {
    padding: 1.25rem;
  }

  .related-post-date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .related-post-title {
    font-size: 1.1rem;
    font-weight: 400;
    color: #fff;
    margin-bottom: 0.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    transition: color 0.2s ease;
  }

  .related-post-card:hover .related-post-title {
    color: #00c400;
  }

  .related-post-excerpt {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-height: 1.5;
  }

  .related-post-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(0, 196, 0, 0.7);
    transition: all 0.2s ease;
  }

  .related-post-link svg {
    transition: transform 0.2s ease;
  }

  .related-post-card:hover .related-post-link {
    color: #00c400;
  }

  .related-post-card:hover .related-post-link svg {
    transform: translateX(4px);
  }

  /* Markdown Prose Styles */
  .prose {
    color: #d1d5db;
    line-height: 1.8;
    font-size: 1.125rem;
  }

  .prose :global(h1) {
    font-size: 2.25rem;
    font-weight: 400;
    color: #fff;
    margin-top: 2rem;
    margin-bottom: 1rem;
    background: linear-gradient(to right, #4ade80, #22d3ee);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .prose :global(h2) {
    font-size: 1.75rem;
    font-weight: 400;
    color: #fff;
    margin-top: 2.5rem;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .prose :global(h3) {
    font-size: 1.375rem;
    font-weight: 400;
    color: #e5e7eb;
    margin-top: 2rem;
    margin-bottom: 0.75rem;
  }

  .prose :global(h4) {
    font-size: 1.125rem;
    font-weight: 400;
    color: #d1d5db;
    margin-top: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .prose :global(p) {
    margin-bottom: 1.5rem;
  }

  .prose :global(img) {
    width: 100%;
    border-radius: 1rem;
    margin: 2rem 0;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  .prose :global(a) {
    color: #4ade80;
    text-decoration: none;
    transition: all 0.2s;
  }

  .prose :global(a:hover) {
    color: #86efac;
    text-decoration: underline;
  }

  .prose :global(strong) {
    color: #fff;
    font-weight: 600;
  }

  .prose :global(em) {
    color: #9ca3af;
    font-style: italic;
  }

  .prose :global(ul) {
    list-style: none;
    padding-left: 0;
    margin-bottom: 1.5rem;
  }

  .prose :global(ul li) {
    position: relative;
    padding-left: 1.75rem;
    margin-bottom: 0.75rem;
  }

  .prose :global(ul li::before) {
    content: '';
    position: absolute;
    left: 0;
    top: 0.6rem;
    width: 6px;
    height: 6px;
    background: linear-gradient(to right, #4ade80, #22d3ee);
    border-radius: 50%;
  }

  .prose :global(ol) {
    list-style: none;
    padding-left: 0;
    margin-bottom: 1.5rem;
    counter-reset: ol-counter;
  }

  .prose :global(ol li) {
    position: relative;
    padding-left: 2.5rem;
    margin-bottom: 0.75rem;
    counter-increment: ol-counter;
  }

  .prose :global(ol li::before) {
    content: counter(ol-counter) '.';
    position: absolute;
    left: 0;
    top: 0;
    font-weight: 600;
    color: #4ade80;
  }

  .prose :global(blockquote) {
    border-left: 4px solid #4ade80;
    padding-left: 1.5rem;
    margin: 2rem 0;
    font-style: italic;
    color: #9ca3af;
    background: rgba(255, 255, 255, 0.02);
    padding: 1rem 1.5rem;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .prose :global(code) {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.2rem 0.4rem;
    border-radius: 0.25rem;
    font-size: 0.9em;
    color: #f472b6;
    font-family: 'Fira Code', monospace;
  }

  .prose :global(pre) {
    background: rgba(0, 0, 0, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1.5rem;
    overflow-x: auto;
    margin: 2rem 0;
  }

  .prose :global(pre code) {
    background: none;
    padding: 0;
    color: #e5e7eb;
    font-size: 0.875rem;
  }

  .prose :global(hr) {
    border: none;
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.2), transparent);
    margin: 3rem 0;
  }

  .prose :global(table) {
    width: 100%;
    border-collapse: collapse;
    margin: 2rem 0;
  }

  .prose :global(th) {
    background: rgba(255, 255, 255, 0.05);
    padding: 0.75rem 1rem;
    text-align: left;
    font-weight: 600;
    color: #fff;
    border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  }

  .prose :global(td) {
    padding: 0.75rem 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .prose :global(tr:hover td) {
    background: rgba(255, 255, 255, 0.02);
  }
</style>
