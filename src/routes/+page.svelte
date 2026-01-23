<script lang='ts'>
  /**
   * Landing Page Performance Optimizations:
   * - requestAnimationFrame throttling for scroll/mouse handlers
   * - Passive event listeners and cached viewport dimensions
   * - CSS containment and GPU acceleration for animated elements
   * - Floating cosmic shapes optimized with will-change and translateZ
   * - Respects prefers-reduced-motion for accessibility
   */
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import HeroSection from '$lib/components/landing/HeroSection.svelte';
  import FeaturedProject from '$lib/components/landing/FeaturedProject.svelte';
  import NewsletterSection from '$lib/components/landing/NewsletterSection.svelte';
  import NextProject from '$lib/components/landing/NextProject.svelte';
  import BlogSection from '$lib/components/landing/BlogSection.svelte';
  import JobsSection from '$lib/components/landing/JobsSection.svelte';
  import KickstarterPromo from '$lib/components/landing/KickstarterPromo.svelte';
  import OurStorySection from '$lib/components/landing/OurStorySection.svelte';

  let scrollY = 0;
  let windowWidth = 0;
  
  // Section refs for scroll tracking
  let projectSection: HTMLElement;
  let storySection: HTMLElement;
  let nextProjectSection: HTMLElement;
  
  // Scroll animation state for project section
  let projectAnimationProgress = 0;
  
  // Scroll animation state for story section
  let storyAnimationProgress = 0;
  
  // Scroll animation state for next project section
  let nextProjectAnimationProgress = 0;

  // Active timeline index for desktop media visibility
  let activeTimelineIndex = -1;
  let timelineRowElements: HTMLElement[] = new Array(6); // Pre-initialize for 6 timeline items

  // Performance optimization: RAF-based scroll handling
  let ticking = false;
  let rafId: number;

  // Cache viewport height to avoid repeated reflows
  let viewportHeight = 0;

  const updateScrollAnimations = () => {
    scrollY = window.scrollY;
    
    // Calculate project section animation progress
    if (projectSection) {
      const rect = projectSection.getBoundingClientRect();
      
      const triggerStart = viewportHeight * 0.8;
      const triggerEnd = viewportHeight * 0.3;
      
      if (rect.top <= triggerStart && rect.top >= triggerEnd) {
        projectAnimationProgress = 1 - ((rect.top - triggerEnd) / (triggerStart - triggerEnd));
      } else if (rect.top < triggerEnd) {
        projectAnimationProgress = 1;
      } else {
        projectAnimationProgress = 0;
      }
    }
    
    // Calculate story section animation progress
    if (storySection) {
      const rect = storySection.getBoundingClientRect();
      
      const triggerStart = viewportHeight * 0.85;
      const triggerEnd = viewportHeight * 0.2;
      
      if (rect.top <= triggerStart && rect.top >= triggerEnd) {
        storyAnimationProgress = 1 - ((rect.top - triggerEnd) / (triggerStart - triggerEnd));
      } else if (rect.top < triggerEnd) {
        storyAnimationProgress = 1;
      } else {
        storyAnimationProgress = 0;
      }
    }

    // Track which timeline row is active on desktop
    if (windowWidth >= 1024) {
      const activationZone = viewportHeight * 0.4;
      let newActiveIndex = -1;

      for (let i = timelineRowElements.length - 1; i >= 0; i--) {
        const el = timelineRowElements[i];
        if (el) {
          const elRect = el.getBoundingClientRect();
          if (elRect.top <= activationZone && elRect.bottom > 0) {
            newActiveIndex = i;
            break;
          }
        }
      }

      if (newActiveIndex === -1) {
        for (let i = 0; i < timelineRowElements.length; i++) {
          const el = timelineRowElements[i];
          if (el) {
            const elRect = el.getBoundingClientRect();
            if (elRect.top < viewportHeight && elRect.bottom > 0) {
              newActiveIndex = i;
              break;
            }
          }
        }
      }

      activeTimelineIndex = newActiveIndex;
    } else {
      activeTimelineIndex = -1;
    }
    
    // Calculate next project section animation progress
    if (nextProjectSection) {
      const rect = nextProjectSection.getBoundingClientRect();
      
      const triggerStart = viewportHeight * 0.9;
      const triggerEnd = viewportHeight * 0.4;
      
      if (rect.top <= triggerStart && rect.top >= triggerEnd) {
        nextProjectAnimationProgress = 1 - ((rect.top - triggerEnd) / (triggerStart - triggerEnd));
      } else if (rect.top < triggerEnd) {
        nextProjectAnimationProgress = 1;
      } else {
        nextProjectAnimationProgress = 0;
      }
    }
    
    ticking = false;
  };

  // Optimized scroll handler using requestAnimationFrame
  const handleScroll = () => {
    if (!ticking) {
      rafId = requestAnimationFrame(updateScrollAnimations);
      ticking = true;
    }
  };

  // Handle resize with debounce
  let resizeTimeout: ReturnType<typeof setTimeout>;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      viewportHeight = window.innerHeight;
      windowWidth = window.innerWidth;
    }, 100);
  };

  onMount(() => {
    // Initialize cached values
    viewportHeight = window.innerHeight;
    windowWidth = window.innerWidth;
    
    // Add passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    // Initial calculation
    updateScrollAnimations();
  });

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(resizeTimeout);
    }
  });
</script>

<svelte:head>
  <style>
    /* Global performance optimizations */
    html {
      scroll-behavior: smooth;
    }
    
    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
      *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
</svelte:head>

<main class="landing-page">
  <!-- Hero Section -->
  <HeroSection {scrollY} />

  <!-- Featured Project Section -->
  <FeaturedProject 
    bind:projectSection={projectSection}
    animationProgress={projectAnimationProgress} 
  />

  <!-- Newsletter -->
  <NewsletterSection />

  <!-- Next Project Section -->
  <NextProject 
    bind:nextProjectSection={nextProjectSection}
    animationProgress={nextProjectAnimationProgress} 
  />

  <!-- Blog Section -->
  <BlogSection />

  <!-- Job Postings -->
  <JobsSection />
  
  <!-- Our Story Section -->
  <OurStorySection 
    bind:storySection={storySection}
    bind:timelineRowElements={timelineRowElements}
    animationProgress={storyAnimationProgress}
    {activeTimelineIndex}
    {windowWidth}
  />

  <!-- Kickstarter Promo -->
  <KickstarterPromo />

  <!-- Contact Us -->
  <section class="contact-section" aria-label="Contact Us">
    <div class="contact-container">
      <ContactForm />
    </div>
  </section>
</main>

<style>
  /* Performance-optimized landing page styles */
  .landing-page {
    /* Isolate the main element for better compositing */
    contain: layout style;
    
    /* Enable GPU acceleration for the entire page */
    transform: translateZ(0);
    backface-visibility: hidden;
    
    /* Smooth font rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Optimize sections for scroll performance */
  .landing-page :global(section) {
    /* Content visibility for off-screen sections */
    content-visibility: auto;
    contain-intrinsic-size: auto 100vh;
    
    /* Isolate paint and layout */
    contain: layout paint;
  }

  /* GPU-accelerated animations hint */
  .landing-page :global([style*="transform"]),
  .landing-page :global([style*="opacity"]) {
    will-change: transform, opacity;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  /* Optimize floating shapes container */
  .landing-page :global(.floating-shapes) {
    will-change: auto;
    contain: strict;
    pointer-events: none;
  }

  .landing-page :global(.floating-shapes .shape) {
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  /* Contact Section */
  .contact-section {
    padding: 6rem 2rem;
    contain: layout paint;
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 4rem 1rem;
    }
    
    /* Reduce animation complexity on mobile for better performance */
    .landing-page :global(.floating-shapes .shape) {
      animation-play-state: paused;
    }
    
    /* Re-enable for users who prefer motion */
    @media (prefers-reduced-motion: no-preference) {
      .landing-page :global(.floating-shapes .shape) {
        animation-play-state: running;
      }
    }
  }

  .contact-container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
