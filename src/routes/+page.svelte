<script lang='ts'>
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

  const handleScroll = () => {
    scrollY = window.scrollY;
    
    // Calculate project section animation progress
    if (projectSection) {
      const rect = projectSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Start animation when section is 10-20% scrolled into view
      const triggerStart = viewportHeight * 0.8; // When top of section reaches 80% down viewport
      const triggerEnd = viewportHeight * 0.3; // Animation completes when top reaches 30% down
      
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
      const viewportHeight = window.innerHeight;
      
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

    // Track which timeline row is active on desktop (threshold-based for consistency)
    if (windowWidth >= 1024) {
      const activationZone = window.innerHeight * 0.4; // Upper 40% of viewport
      let newActiveIndex = -1;

      // Find the row whose top edge has scrolled past the activation zone (iterate backwards)
      for (let i = timelineRowElements.length - 1; i >= 0; i--) {
        const el = timelineRowElements[i];
        if (el) {
          const elRect = el.getBoundingClientRect();
          // A row is active if its top is above the activation zone and it's still visible
          if (elRect.top <= activationZone && elRect.bottom > 0) {
            newActiveIndex = i;
            break;
          }
        }
      }

      // If nothing found (all below), use the first visible one
      if (newActiveIndex === -1) {
        for (let i = 0; i < timelineRowElements.length; i++) {
          const el = timelineRowElements[i];
          if (el) {
            const elRect = el.getBoundingClientRect();
            if (elRect.top < window.innerHeight && elRect.bottom > 0) {
              newActiveIndex = i;
              break;
            }
          }
        }
      }

      activeTimelineIndex = newActiveIndex;
    } else {
      activeTimelineIndex = -1; // Show all on mobile
    }
    
    // Calculate next project section animation progress
    if (nextProjectSection) {
      const rect = nextProjectSection.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
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
  };
</script>

<svelte:window on:scroll={handleScroll} bind:innerWidth={windowWidth} />

<main>
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
  /* Contact Section */
  .contact-section {
    padding: 6rem 2rem;
  }

  @media (max-width: 768px) {
    .contact-section {
      padding: 4rem 1rem;
    }
  }

  .contact-container {
    max-width: 800px;
    margin: 0 auto;
  }
</style>
