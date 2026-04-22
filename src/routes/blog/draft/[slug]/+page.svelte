<script lang="ts">
  import { page } from '$app/stores';
  import { marked } from 'marked';
  import { onMount, tick } from 'svelte';
  import NewsletterSection from '$lib/components/landing/NewsletterSection.svelte';
  
  export let data;
  
  $: post = data.post;
  $: isDraft = data.isDraft;
  
  let isPageLoaded = false;
  
  onMount(async () => {
    // Brief skeleton display during hydration
    setTimeout(async () => {
      isPageLoaded = true;
      await tick();
      initAudioPlayers();
    }, 600);
  });

  function formatAudioTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return m + ':' + String(sec).padStart(2, '0');
  }

  function initAudioPlayers() {
    document.querySelectorAll<HTMLElement>('.audio-player-wrapper:not([data-cap-init])').forEach(wrapper => {
      wrapper.setAttribute('data-cap-init', 'true');
      const audio = wrapper.querySelector<HTMLAudioElement>('.blog-audio-player');
      const playBtn = wrapper.querySelector<HTMLButtonElement>('.cap-play-btn');
      const iconPlay = wrapper.querySelector<HTMLElement>('.cap-icon-play');
      const iconPause = wrapper.querySelector<HTMLElement>('.cap-icon-pause');
      const track = wrapper.querySelector<HTMLElement>('.cap-track');
      const fill = wrapper.querySelector<HTMLElement>('.cap-fill');
      const thumb = wrapper.querySelector<HTMLElement>('.cap-thumb');
      const timeEl = wrapper.querySelector<HTMLElement>('.cap-time');
      if (!audio || !playBtn || !track || !fill || !thumb || !timeEl) return;

      playBtn.addEventListener('click', () => {
        if (audio.paused) audio.play();
        else audio.pause();
      });
      audio.addEventListener('play', () => {
        if (iconPlay) iconPlay.style.display = 'none';
        if (iconPause) iconPause.style.display = '';
        wrapper.classList.add('playing');
      });
      audio.addEventListener('pause', () => {
        if (iconPlay) iconPlay.style.display = '';
        if (iconPause) iconPause.style.display = 'none';
        wrapper.classList.remove('playing');
      });
      audio.addEventListener('ended', () => {
        if (iconPlay) iconPlay.style.display = '';
        if (iconPause) iconPause.style.display = 'none';
        wrapper.classList.remove('playing');
      });
      audio.addEventListener('timeupdate', () => {
        const pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
        fill.style.width = pct + '%';
        thumb.style.left = pct + '%';
        timeEl.textContent = formatAudioTime(audio.currentTime);
      });
      track.addEventListener('click', (e) => {
        if (!audio.duration) return;
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = pct * audio.duration;
      });
      let dragging = false;
      thumb.addEventListener('pointerdown', (e) => {
        dragging = true;
        thumb.setPointerCapture(e.pointerId);
        e.stopPropagation();
      });
      thumb.addEventListener('pointermove', (e) => {
        if (!dragging || !audio.duration) return;
        const rect = track.getBoundingClientRect();
        const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        fill.style.width = (pct * 100) + '%';
        thumb.style.left = (pct * 100) + '%';
        audio.currentTime = pct * audio.duration;
        timeEl.textContent = formatAudioTime(audio.currentTime);
      });
      thumb.addEventListener('pointerup', () => { dragging = false; });
    });
  }

  // List of video file extensions
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.mkv', '.avi', '.flv', '.wmv'];
  
  // List of audio file extensions
  const audioExtensions = ['.mp3', '.wav', '.m4a', '.aac', '.flac', '.ogg', '.wma', '.opus'];
  
  // Map audio extensions to MIME types
  const audioMimeTypes: { [key: string]: string } = {
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.flac': 'audio/flac',
    '.ogg': 'audio/ogg',
    '.wma': 'audio/wav',
    '.opus': 'audio/opus'
  };
  
  // Check if URL is a video file
  const isVideoFile = (url: string): boolean => {
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };
  
  // Check if URL is an audio file
  const isAudioFile = (url: string): boolean => {
    return audioExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };
  
  // Get MIME type for audio file
  const getAudioMimeType = (url: string): string => {
    const ext = audioExtensions.find(e => url.toLowerCase().endsWith(e));
    return ext ? audioMimeTypes[ext] : 'audio/mpeg';
  };
  
  // Custom renderer to support images, videos and audio with caption syntax: ![alt | caption](url)
  const mediaRenderer = (token: any) => {
    const { text, href, title } = token;
    let height = '';
    let altText = text;
    let caption = '';
    
    // Parse height from text if present: text{height=300px}
    const heightMatch = text.match(/\{height=([^}]+)\}/);
    if (heightMatch) {
      height = heightMatch[1];
    }
    
    // Parse caption from text if present: alt | caption {height=300px}
    const pipeIndex = text.indexOf('|');
    if (pipeIndex !== -1) {
      altText = text.substring(0, pipeIndex).trim();
      caption = text.substring(pipeIndex + 1).trim();
      if (heightMatch) {
        caption = caption.replace(/\s*\{height=[^}]+\}/, '').trim();
      }
    } else if (heightMatch) {
      altText = text.replace(/\s*\{height=[^}]+\}/, '').trim();
    }
    
    const heightStyle = height ? ` style="height: ${height}; width: auto;"` : '';
    const titleAttr = title ? ` title="${title}"` : '';
    
    let mediaElement = '';
    // Check if it's a video file
    if (isVideoFile(href)) {
      const controls = 'controls';
      const preload = 'metadata';
      mediaElement = `<video ${controls} ${preload} muted${heightStyle} class="auto-play-video"><source src="${href}" type="video/mp4"></video>`;
    } else if (isAudioFile(href)) {
      // Render as custom audio player
      const mimeType = getAudioMimeType(href);
      const playIcon = `<svg class="cap-icon-play" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><polygon points="6,3 20,12 6,21"/></svg>`;
      const pauseIcon = `<svg class="cap-icon-pause" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style="display:none"><rect x="5" y="4" width="4" height="16"/><rect x="15" y="4" width="4" height="16"/></svg>`;
      mediaElement = `<div class="audio-player-wrapper"><audio preload="metadata" class="blog-audio-player"><source src="${href}" type="${mimeType}"></audio><div class="custom-audio-player"><button class="cap-play-btn" aria-label="Play/Pause">${playIcon}${pauseIcon}</button><div class="cap-track"><div class="cap-fill"></div><div class="cap-thumb"></div></div><span class="cap-time">0:00</span></div></div>`;
    } else {
      // Render as image
      mediaElement = `<img src="${href}" alt="${altText}"${titleAttr}${heightStyle} />`;
    }
    
    // Wrap in figure with optional figcaption
    if (caption) {
      return `<figure class="media-figure">${mediaElement}<figcaption>${caption}</figcaption></figure>`;
    }
    
    return mediaElement;
  };
  
  // Configure marked for GitHub-flavored markdown
  marked.setOptions({
    breaks: true,
    gfm: true
  });
  
  // Override the image renderer with media renderer (handles both images and videos)
  const renderer = new marked.Renderer();
  renderer.image = mediaRenderer;
  marked.setOptions({ renderer });
  
  // Parse markdown content
  $: renderedContent = post.content ? marked(post.content) : '';
  $: isLoading = !post;
  
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

  // Setup Intersection Observer for autoplay when videos enter viewport
  onMount(() => {
    const setupVideoObserver = () => {
      const videos = document.querySelectorAll('.auto-play-video');
      
      if ('IntersectionObserver' in window && videos.length > 0) {
        const videoObserver = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              video.play().catch(() => {
                // Autoplay may be blocked by browser policy, that's ok
              });
            } else {
              video.pause();
            }
          });
        }, {
          threshold: 0.5 // Play when 50% of video is visible
        });

        videos.forEach(video => videoObserver.observe(video));

        return () => {
          videos.forEach(video => videoObserver.unobserve(video));
        };
      }
    };

    // Setup observer immediately and when content finishes loading
    setupVideoObserver();
    
    // Also setup after isPageLoaded to catch rendered videos
    const timer = setTimeout(setupVideoObserver, 650);
    
    return () => clearTimeout(timer);
  });
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

      {#if !isPageLoaded}
        <!-- Meta Skeleton -->
        <div class="skeleton-text skeleton-text-xs" style="width: 200px; margin-bottom: 1.5rem;"></div>
        <!-- Title Skeleton -->
        <div class="skeleton-text" style="width: 70%; height: 2.5rem; margin-top: 1.5rem;"></div>
      {:else}
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
      {/if}
    </div>
  </section>

  <!-- Featured Image -->
  {#if !isPageLoaded}
    <section class="px-4 pb-8">
      <div class="max-w-3xl mx-auto">
        <div class="post-featured-image skeleton-loader"></div>
      </div>
    </section>
  {:else if post.feature_image_url}
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
      
      {#if !isPageLoaded}
        <!-- Skeleton Content -->
        <div class="space-y-4">
          <div class="skeleton-text skeleton-text-lg" style="width: 60%;"></div>
          <div class="skeleton-text" style="width: 100%;"></div>
          <div class="skeleton-text" style="width: 100%;"></div>
          <div class="skeleton-text" style="width: 95%;"></div>
          <div class="skeleton-text skeleton-text-sm" style="width: 40%;"></div>
          <div class="mt-8 space-y-4">
            <div class="skeleton-text" style="width: 100%;"></div>
            <div class="skeleton-text" style="width: 100%;"></div>
            <div class="skeleton-text" style="width: 85%;"></div>
          </div>
        </div>
      {:else}
        <!-- Excerpt -->
        {#if post.excerpt}
          <p class="text-xl text-gray-400 my-6">
            {post.excerpt}
          </p>
        {/if}

        <article class="prose">
          {@html renderedContent}
        </article>
      {/if}
      
      <!-- Draft Actions -->
      {#if isPageLoaded}
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
      {/if}
    </div>
  </section>

  <!-- Newsletter Section -->
  <NewsletterSection />
</div>

<style>
  /* Post Featured Image */
  .post-featured-image {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    overflow: hidden;
    border-radius: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
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

  .prose :global(video) {
    width: 100%;
    border-radius: 1rem;
    margin: 2rem 0;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    background: rgba(0, 0, 0, 0.5);
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

  /* Skeleton Loader Styles */
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .skeleton-loader {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
  }

  .skeleton-text {
    height: 1rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.1) 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
    border-radius: 0.5rem;
  }

  .skeleton-text-lg {
    height: 1.5rem;
  }

  .skeleton-text-sm {
    height: 0.75rem;
  }

  /* Caption text */
  .prose :global(figcaption) {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    text-align: center;
    margin-top: 0.5rem;
    font-style: italic;
  }

  /* Custom Audio Player */
  .prose :global(.audio-player-wrapper) {
    margin: 1.5rem 0;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border-left: 2px solid #9333ea;
  }

  .prose :global(audio.blog-audio-player) {
    display: none;
  }

  .prose :global(.custom-audio-player) {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.4rem 0;
  }

  .prose :global(.cap-play-btn) {
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid rgba(147, 51, 234, 0.5);
    background: transparent;
    color: #9333ea;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    transition: background 0.15s, border-color 0.15s;
  }

  .prose :global(.cap-play-btn:hover) {
    background: rgba(147, 51, 234, 0.12);
    border-color: #9333ea;
  }

  .prose :global(.cap-track) {
    flex: 1;
    position: relative;
    height: 2px;
    background: rgba(255, 255, 255, 0.15);
    cursor: pointer;
    border-radius: 1px;
  }

  .prose :global(.cap-fill) {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0%;
    background: #9333ea;
    border-radius: 1px;
    pointer-events: none;
  }

  .prose :global(.cap-thumb) {
    position: absolute;
    top: 50%;
    left: 0%;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #9333ea;
    transform: translate(-50%, -50%);
    cursor: grab;
  }

  .prose :global(.cap-thumb:active) {
    cursor: grabbing;
    transform: translate(-50%, -50%) scale(1.15);
  }

  .prose :global(.cap-time) {
    flex-shrink: 0;
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.45);
    font-variant-numeric: tabular-nums;
    min-width: 2.5rem;
    text-align: right;
  }

  /* Playing state — green theme */
  .prose :global(.audio-player-wrapper.playing) {
    border-left-color: #00c400;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.12) 0%, rgba(255, 215, 0, 0.08) 50%, rgba(0, 196, 0, 0.12) 100%);
    background-size: 200% auto;
    animation: playerGradientShift 4s ease-in-out infinite;
  }

  @keyframes playerGradientShift {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
  }

  .prose :global(.audio-player-wrapper.playing .cap-play-btn) {
    border-color: rgba(0, 196, 0, 0.5);
    color: #00c400;
  }

  .prose :global(.audio-player-wrapper.playing .cap-play-btn:hover) {
    background: rgba(0, 196, 0, 0.12);
    border-color: #00c400;
  }

  .prose :global(.audio-player-wrapper.playing .cap-fill) {
    background: #00c400;
  }

  .prose :global(.audio-player-wrapper.playing .cap-thumb) {
    background: #00c400;
  }

  /* Audio inside figure — adjust wrapper margin */
  .prose :global(figure.media-figure .audio-player-wrapper) {
    margin: 0;
  }

  /* Ensure figcaption displays properly */
  .prose :global(figure.media-figure figcaption) {
    display: block;
    margin-top: 0.5rem;
  }
</style>
