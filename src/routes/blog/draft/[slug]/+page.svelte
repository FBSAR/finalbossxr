<script lang="ts">
  import { page } from '$app/stores';
  import { marked } from 'marked';
  import NewsletterSection from '$lib/components/landing/NewsletterSection.svelte';
  
  export let data;
  
  $: post = data.post;
  $: isDraft = data.isDraft;
  
  // Custom image renderer to support height syntax: ![alt](url){height=300px}
  const imageRenderer = (token: any) => {
    const { text, href, title } = token;
    let height = '';
    let finalText = text;
    
    // Parse height from text if present: text{height=300px}
    const heightMatch = text.match(/\{height=([^}]+)\}/);
    if (heightMatch) {
      height = heightMatch[1];
      finalText = text.replace(/\s*\{height=[^}]+\}/, '');
    }
    
    const heightStyle = height ? ` style="height: ${height}; width: auto;"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    
    return `<img src="${href}" alt="${finalText}"${titleAttr}${heightStyle} />`;
  };
  
  // Configure marked for GitHub-flavored markdown
  marked.setOptions({
    breaks: true,
    gfm: true
  });
  
  // Override the image renderer
  const renderer = new marked.Renderer();
  renderer.image = imageRenderer;
  marked.setOptions({ renderer });
  
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
</script>

<svelte:head>
  <title>{post.title} (Draft) | FinalBossXR Blog</title>
  <meta name="description" content="Draft preview - {post.excerpt || post.content?.substring(0, 160)}" />
</svelte:head>

<div class="min-h-screen">
  <!-- Draft Warning Banner -->
  <div class="bg-yellow-900/30 border-b border-yellow-600/30 px-4 py-3">
    <div class="max-w-3xl mx-auto flex items-center gap-3">
      <svg class="w-5 h-5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      </svg>
      <div>
        <p class="text-sm font-semibold text-yellow-200">DRAFT PREVIEW</p>
        <p class="text-xs text-yellow-100">This post is not published yet. Changes will not be visible to the public.</p>
      </div>
    </div>
  </div>

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
      
      <!-- Draft Badge -->
      <div class="mb-4">
        <span class="inline-block px-3 py-1 bg-yellow-500/20 border border-yellow-500/50 text-yellow-300 text-xs font-semibold rounded-full">
          DRAFT
        </span>
      </div>

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

  <!-- Featured Image -->
  {#if post.feature_image_url}
    <section class="px-4 pb-8">
      <div class="max-w-3xl mx-auto">
        <div class="post-featured-image">
          <img 
            src={post.feature_image_url} 
            alt={post.title}
            class="post-featured-image-img"
          />
        </div>
      </div>
    </section>
  {/if}

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
      
      <!-- Draft Actions -->
      <div class="mt-12 pt-8 border-t border-white/10">
        <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Draft Actions</h3>
        <div class="flex gap-3">
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002 2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              Copy Draft Link
            {/if}
          </button>
          <a 
            href="/admin/dashboard"
            class="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg text-yellow-300 hover:bg-yellow-500/20 hover:border-yellow-500/50 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Draft
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Newsletter Section -->
  <NewsletterSection />
</div>

<style>
  /* Post Featured Image */
  .post-featured-image {
    position: relative;
    aspect-ratio: 16 / 9;
    height: 12rem;
    overflow: hidden;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 768px) {
    .post-featured-image {
      height: 18rem;
    }
  }

  .post-featured-image-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
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
</style>
