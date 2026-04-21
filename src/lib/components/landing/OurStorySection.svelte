<script lang="ts">
  import { onMount } from 'svelte';

  export let animationProgress = 0;
  export let storySection: HTMLElement | undefined = undefined;
  export let activeTimelineIndex = -1;
  export let windowWidth = 0;
  export let timelineRowElements: HTMLElement[] = [];
  export let onTimelineClick: ((index: number) => void) | undefined = undefined;

  // Track loading state for each video
  let loadingVideos = new Set<string>();

  // Track which timeline rows are visible in viewport
  let visibleTimelineRows = new Set<number>();

  // Intersection Observer action: reveal timeline rows when scrolled into view
  function observeTimelineRow(node: HTMLElement, index: number) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            visibleTimelineRows.add(index);
            visibleTimelineRows = visibleTimelineRows; // Trigger reactivity
          } else {
            visibleTimelineRows.delete(index);
            visibleTimelineRows = visibleTimelineRows; // Trigger reactivity
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

  // Intersection Observer action: play video only when visible
  function lazyPlay(node: HTMLVideoElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            node.play().catch(() => {});
          } else {
            node.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }

  // Handle video loading state
  function handleVideoLoadStart(src: string) {
    loadingVideos.add(src);
    loadingVideos = loadingVideos; // Trigger reactivity
  }

  function handleVideoCanPlay(src: string) {
    loadingVideos.delete(src);
    loadingVideos = loadingVideos; // Trigger reactivity
  }

  // Timeline data
  interface TimelineItem {
    year: string;
    title: string;
    description: string;
    isActive?: boolean;
    media?: {
      type: 'video' | 'image';
      src: string;
      badge?: string;
      startTime?: number;
      endTime?: number;
      isPhone?: boolean;
      companionPhoto?: string;
    }[];
  }

  export const timelineItems: TimelineItem[] = [
    {
      year: '2021',
      title: 'The Spark',
      description: 'It started with a simple idea — a VR game inspired by Dynasty Warriors, built while studying Unreal Engine 4. Later that year, an Epic Games Educators Accelerator deepened Eddie\'s immersion in the Unreal ecosystem and developer community. This was based off of a belief that XR would be the future, not only in video games, but in many other industries as well.',
      media: [
        {
          type: 'image',
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' preserveAspectRatio='xMidYMid meet'%3E%3Cdefs%3E%3ClinearGradient id='bulbG' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300c400'%3E%3Canimate attributeName='stop-color' values='%2300c400;%2300e600;%2300c400' dur='3s' repeatCount='indefinite'/%3E%3C/stop%3E%3Cstop offset='100%25' stop-color='%238a2be2'%3E%3Canimate attributeName='stop-color' values='%238a2be2;%239f4ded;%238a2be2' dur='3s' repeatCount='indefinite'/%3E%3C/stop%3E%3C/linearGradient%3E%3CradialGradient id='glow' cx='50%25' cy='43%25' r='30%25'%3E%3Cstop offset='0%25' stop-color='%2300c400' stop-opacity='0.5'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/radialGradient%3E%3CradialGradient id='innerGlow' cx='50%25' cy='35%25' r='60%25'%3E%3Cstop offset='0%25' stop-color='%2300c400' stop-opacity='0.4'/%3E%3Cstop offset='50%25' stop-color='%238a2be2' stop-opacity='0.2'/%3E%3Cstop offset='100%25' stop-color='transparent'/%3E%3C/radialGradient%3E%3Cfilter id='bulbGlow' x='-50%25' y='-50%25' width='200%25' height='200%25'%3E%3CfeGaussianBlur stdDeviation='3' result='blur'/%3E%3CfeMerge%3E%3CfeMergeNode in='blur'/%3E%3CfeMergeNode in='SourceGraphic'/%3E%3C/feMerge%3E%3C/filter%3E%3C/defs%3E%3Crect fill='%230a1628' width='200' height='200' rx='12'/%3E%3Cellipse cx='100' cy='86' rx='28' ry='32' fill='url(%23glow)'%3E%3Canimate attributeName='opacity' values='0.4;0.8;0.4' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='rx' values='26;30;26' dur='2s' repeatCount='indefinite'/%3E%3Canimate attributeName='ry' values='30;34;30' dur='2s' repeatCount='indefinite'/%3E%3C/ellipse%3E%3Cg filter='url(%23bulbGlow)'%3E%3Cpath d='M100 56 C78 56 70 73 70 86 C70 99 78 107 83 114 L83 123 L117 123 L117 114 C122 107 130 99 130 86 C130 73 122 56 100 56Z' fill='url(%23innerGlow)' stroke='url(%23bulbG)' stroke-width='2.5' stroke-linejoin='round'%3E%3Canimate attributeName='opacity' values='0.9;1;0.9' dur='1.5s' repeatCount='indefinite'/%3E%3C/path%3E%3C/g%3E%3Cline x1='86' y1='129' x2='114' y2='129' stroke='%2300c400' stroke-width='2.5' stroke-linecap='round'%3E%3Canimate attributeName='opacity' values='0.7;1;0.7' dur='1.2s' repeatCount='indefinite'/%3E%3C/line%3E%3Cline x1='88' y1='137' x2='112' y2='137' stroke='%238a2be2' stroke-width='2.5' stroke-linecap='round'%3E%3Canimate attributeName='opacity' values='0.7;1;0.7' dur='1.2s' repeatCount='indefinite' begin='0.2s'/%3E%3C/line%3E%3Cline x1='92' y1='145' x2='108' y2='145' stroke='%2300c400' stroke-width='2.5' stroke-linecap='round'%3E%3Canimate attributeName='opacity' values='0.7;1;0.7' dur='1.2s' repeatCount='indefinite' begin='0.4s'/%3E%3C/line%3E%3Ccircle cx='100' cy='80' r='4' fill='%2300c400' opacity='0.6'%3E%3Canimate attributeName='opacity' values='0.3;0.8;0.3' dur='1s' repeatCount='indefinite'/%3E%3Canimate attributeName='r' values='3;5;3' dur='1s' repeatCount='indefinite'/%3E%3C/circle%3E%3C/svg%3E",
          badge: 'Summer 2021'
        }
      ]
    },
    {
      year: '2022',
      title: 'The Catalyst - Unreal Basecamp',
      description: 'Drawing from five years as a Tech Educator, Eddie taught a class called Unreal Basecamp as an instructor for a nonprofit named Journi — a course blending Unreal Engine, AR, and the Magic Leap One. This sparked a bigger vision: Final Boss Studios, started with Keith Dunklin, Demekco Eberhardt, Richard Davis III, and Aaron Goodson. Together, we built Gameball, our first AR prototype on Magic Leap.',
      media: [
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/unreal_basecamp_promo.mp4',
          badge: 'Unreal Basecamp Class',
          startTime: 80
        },
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/gameball_demo.mp4',
          badge: 'Gameball Prototype'
        }
      ]
    },
    {
      year: '2023',
      title: 'Expanding Horizons',
      description: 'We built an AR demo of Monopoly as a team-building exercise — and it opened doors. Clients approached us for XR prototypes, and we partnered with nonprofits to teach Unreal Engine workshops, growing our network and spreading XR education across the community.',
      media: [
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/Eddie_Teaching_Class2.mp4',
          badge: 'ToT Intro to Unreal Class',
          companionPhoto: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/BLACK_Group_Photo.jpg'
        },
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/DC_Demo_02.mov',
          badge: 'Drone Training MVP',
          isPhone: true
        },
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/monopoly_ar_demo.mp4',
          badge: 'Monopoly AR Demo',
          startTime: 35,
          endTime: 75,
          isPhone: true
        },
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/landing_page_my_stories_videos/mr_car_02.mov',
          badge: 'MR Car Experience'
        }
      ]
    },
    {
      year: '2024',
      title: 'Re-evaluation',
      description: 'By this point, we took a small break to reflect on our journey and plan the next steps for Final Boss Studios. We knew that we no longer wanted to make software as contractors for other companies, but instead focus on creating our own XR experiences and products.',
      media: [
        {
          type: 'image',
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='g1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300c400'/%3E%3Cstop offset='100%25' stop-color='%238a2be2'/%3E%3C/linearGradient%3E%3ClinearGradient id='g2' x1='100%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%238a2be2'/%3E%3Cstop offset='100%25' stop-color='%2300c400'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='%230a1628' width='200' height='200' rx='20'/%3E%3Ccircle cx='100' cy='100' r='60' fill='none' stroke='url(%23g1)' stroke-width='3' stroke-dasharray='95 285' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 100 100' to='360 100 100' dur='2s' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='100' cy='100' r='45' fill='none' stroke='url(%23g2)' stroke-width='3' stroke-dasharray='70 213' stroke-linecap='round'%3E%3CanimateTransform attributeName='transform' type='rotate' from='360 100 100' to='0 100 100' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='100' cy='100' r='30' fill='none' stroke='%2300c400' stroke-width='2' stroke-dasharray='47 141' stroke-linecap='round' opacity='0.7'%3E%3CanimateTransform attributeName='transform' type='rotate' from='0 100 100' to='360 100 100' dur='1s' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='100' cy='100' r='8' fill='%238a2be2'%3E%3Canimate attributeName='opacity' values='1;0.4;1' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3Ccircle cx='100' cy='100' r='4' fill='%2300c400'/%3E%3C/svg%3E",
          badge: '2024 - Taking a Break'
        }
      ]
    },
    {
      year: '2025',
      title: 'Building Our First IP',
      description: 'In 2025, we focused on building our first intellectual property: an AR mobile game. This marked a significant shift from contract work to creating our own XR experiences, allowing us to fully explore our creative potential and establish our brand in the XR space.',
      media: [
        {
          type: 'image',
          src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' preserveAspectRatio='xMidYMid meet'%3E%3Cdefs%3E%3ClinearGradient id='engG' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%2300c400'/%3E%3Cstop offset='100%25' stop-color='%238a2be2'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill='%230a1628' width='200' height='200' rx='12'/%3E%3Crect x='35' y='55' width='130' height='85' rx='6' fill='none' stroke='url(%23engG)' stroke-width='3'/%3E%3Crect x='45' y='65' width='110' height='65' rx='3' fill='%23111827'/%3E%3Ctext x='55' y='85' font-family='monospace' font-size='10' fill='%2300c400'%3E%3E_ init game%3C/text%3E%3Ctext x='55' y='100' font-family='monospace' font-size='10' fill='%238a2be2'%3Eload assets...%3C/text%3E%3Ctext x='55' y='115' font-family='monospace' font-size='10' fill='%2300c400' opacity='0.7'%3E%3Canimate attributeName='opacity' values='0.7;1;0.7' dur='1s' repeatCount='indefinite'/%3E%E2%96%88%3C/text%3E%3Ccircle cx='60' cy='150' r='12' fill='none' stroke='url(%23engG)' stroke-width='2'/%3E%3Ccircle cx='60' cy='150' r='6' fill='url(%23engG)' opacity='0.5'%3E%3Canimate attributeName='r' values='4;7;4' dur='1.5s' repeatCount='indefinite'/%3E%3C/circle%3E%3Crect x='90' y='145' width='20' height='10' rx='2' fill='none' stroke='%2300c400' stroke-width='2'/%3E%3Crect x='93' y='148' width='5' height='4' fill='%2300c400' opacity='0.6'/%3E%3Crect x='100' y='148' width='5' height='4' fill='%238a2be2' opacity='0.6'/%3E%3Cg transform='translate(135,143)'%3E%3Cpath d='M0 0 L0 14 L5 14 L5 6 L7 6 L12 14 L18 14 L12 5 L12 5 C15 4 16 2 16 0 L16 0 C16 -2 14 -4 11 -4 L0 -4 Z M5 -1 L5 3 L10 3 C11 3 11 2 11 1 C11 0 11 -1 10 -1 Z' fill='url(%23engG)' transform='scale(0.9)'/%3E%3C/g%3E%3C/svg%3E",
          badge: 'Engineering'
        }
      ]
    },
    {
      year: '2026',
      title: 'Cosmic Collisions releases on iOS/Android',
      description: 'In 2026, we released our first AR mobile game, Cosmic Collisions, on iOS and Android. This milestone marked the culmination of our efforts to transition from contract work to creating our own XR experiences, and it allowed us to showcase our creative vision to a wider audience.',
      isActive: true,
      media: [
        {
          type: 'image',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/CC_LogoAnimated.webp',
          badge: 'Cosmic Collisions'
        },
        {
          type: 'video',
          src: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/videos/FlightMission01PortraitFinal+-+Made+with+Clipchamp+(2).mp4',
          badge: 'Flight Mission',
          isPhone: true
        }
      ]
    }
  ];
</script>

<section 
  class="story-section" 
  bind:this={storySection}
  aria-label="Our Story"
>
  <!-- Animated SVG Background -->
  <div class="story-bg-elements">
    <!-- Animated Circuit Lines -->
    <svg class="circuit-svg" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(0, 196, 0, 0)" />
          <stop offset="50%" stop-color="rgba(0, 196, 0, 0.5)" />
          <stop offset="100%" stop-color="rgba(0, 196, 0, 0)" />
        </linearGradient>
        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="rgba(138, 43, 226, 0)" />
          <stop offset="50%" stop-color="rgba(138, 43, 226, 0.4)" />
          <stop offset="100%" stop-color="rgba(138, 43, 226, 0)" />
        </linearGradient>
      </defs>
      
      <!-- Horizontal flowing lines -->
      <path class="circuit-line line-1" d="M0 200 Q300 200 400 300 T800 300 T1200 200" stroke="url(#lineGradient)" fill="none" stroke-width="1" />
      <path class="circuit-line line-2" d="M0 400 Q200 350 500 400 T900 350 T1200 400" stroke="url(#lineGradient2)" fill="none" stroke-width="1" />
      <path class="circuit-line line-3" d="M0 600 Q400 550 600 600 T1000 550 T1200 600" stroke="url(#lineGradient)" fill="none" stroke-width="1" />
      
      <!-- Animated dots along paths -->
      <circle class="pulse-dot dot-1" cx="200" cy="200" r="3" fill="#00c400" />
      <circle class="pulse-dot dot-2" cx="600" cy="400" r="3" fill="#8a2be2" />
      <circle class="pulse-dot dot-3" cx="1000" cy="600" r="3" fill="#00c400" />
    </svg>
    
    <!-- Floating geometric accents -->
    <div class="floating-shape shape-1" style="opacity: {animationProgress * 0.6};"></div>
    <div class="floating-shape shape-2" style="opacity: {animationProgress * 0.4};"></div>
    <div class="floating-shape shape-3" style="opacity: {animationProgress * 0.5};"></div>
  </div>

  <div class="story-container">
    <!-- Section Header -->
    <div 
      class="story-header"
      style="
        opacity: {animationProgress};
        transform: translateY({(1 - animationProgress) * 60}px);
      "
    >
      <span class="section-label">The Journey</span>
      <h2 class="section-title gradient-text">Our Story</h2>
      
      <!-- Animated underline SVG -->
      <svg class="title-underline" viewBox="0 0 200 20" style="transform: scaleX({animationProgress});">
        <path d="M0 10 Q50 0 100 10 T200 10" stroke="url(#lineGradient)" fill="none" stroke-width="2" />
      </svg>
    </div>

    <div class="story-content-integrated">
      <div class="story-intro" style="opacity: {animationProgress}; transform: translateY({(1 - animationProgress) * 40}px);">
        <p class="lead-text">
          What started as a passion project in a small apartment has grown into 
          a vision for the future of human-computer interaction.
        </p>
      </div>

      <!-- Integrated Timeline with Media -->
      <div class="timeline-integrated">
        <div class="timeline-line-vertical" style="height: {animationProgress * 100}%;"></div>
        
        {#each timelineItems as item, index}
          {@const offset = index * (1.5 / (timelineItems.length - 1))}
          {@const progress = Math.min(1, Math.max(0, animationProgress * 2.5 - offset))}
          {@const isClickable = windowWidth >= 1024 && !!onTimelineClick}
          <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
          <div 
            class="timeline-row" 
            class:has-media={item.media && item.media.length > 0}
            class:media-active={activeTimelineIndex === index || activeTimelineIndex === -1}
            class:visible={visibleTimelineRows.has(index)}
            class:clickable={isClickable}
            use:observeTimelineRow={index}
            bind:this={timelineRowElements[index]}
            style="opacity: {progress}; transform: translateY({(1 - progress) * 40}px);"
            on:click={() => isClickable && onTimelineClick?.(index)}
            on:keydown={(e) => e.key === 'Enter' && isClickable && onTimelineClick?.(index)}
            role={isClickable ? 'button' : undefined}
            tabindex={isClickable ? 0 : -1}
          >
            <div class="timeline-marker">
              <div class="timeline-dot-integrated" class:active={item.isActive}></div>
            </div>
            
            <div class="timeline-row-content">
              <div class="timeline-text-block">
                <span class="timeline-year">{item.year}</span>
                <h4 class="gradient-text text-2xl">{item.title}</h4>
                <p>{item.description}</p>
              </div>
              
              {#if item.media && item.media.length > 0}
                <div 
                  class="timeline-media-grid" 
                  class:media-visible={activeTimelineIndex === index || activeTimelineIndex === -1}
                  style="transform: translateX({(1 - progress) * 30}px);"
                >
                  {#if activeTimelineIndex === index || activeTimelineIndex === -1 || windowWidth < 1024}
                  {#each item.media as media, mediaIndex}
                    <div class="timeline-media-item" class:phone={media.isPhone} class:has-companion={media.companionPhoto}>
                      <div class="media-stack">
                        <div class="media-frame">
                          {#if media.isPhone}
                            <div class="phone-notch"></div>
                          {/if}
                          {#if media.type === 'video'}
                            <div class="video-wrapper">
                              <video 
                                use:lazyPlay
                                loop={!media.endTime}
                                muted 
                                playsinline
                                preload="none"
                                on:loadedmetadata={(e) => { if (media.startTime) e.currentTarget.currentTime = media.startTime; handleVideoCanPlay(media.src); }}
                                on:loadstart={() => handleVideoLoadStart(media.src)}
                                on:canplay={() => handleVideoCanPlay(media.src)}
                                on:timeupdate={(e) => { if (media.endTime && e.currentTarget.currentTime >= media.endTime) e.currentTarget.currentTime = media.startTime || 0; }}
                              >
                                <source src={media.src} type="video/mp4" />
                              </video>
                              {#if loadingVideos.has(media.src)}
                                <div class="video-loading-spinner" aria-label="Loading video">
                                  <div class="spinner-ring"></div>
                                  <div class="spinner-ring"></div>
                                  <div class="spinner-ring"></div>
                                </div>
                              {/if}
                            </div>
                          {:else}
                            <img src={media.src} alt={media.badge || 'Media'} loading="lazy" decoding="async" />
                          {/if}
                        </div>
                        {#if media.companionPhoto}
                          <div class="companion-photo-frame">
                            <img src={media.companionPhoto} alt="Event group" loading="lazy" decoding="async" />
                          </div>
                        {/if}
                      </div>
                      {#if media.badge}
                        <span class="timeline-media-badge">{media.badge}</span>
                      {/if}
                    </div>
                  {/each}
                  {/if}
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Bottom quote/mission statement -->
    <div 
      class="story-mission"
      style="
        opacity: {Math.max(0, animationProgress - 0.5) * 2};
        transform: translateY({(1 - Math.max(0, animationProgress - 0.5) * 2) * 40}px);
      "
    >
      <!-- Animated corner accents -->
      <div class="mission-corner top-left"></div>
      <div class="mission-corner top-right"></div>
      <div class="mission-corner bottom-left"></div>
      <div class="mission-corner bottom-right"></div>
      
      <!-- Glowing orb background -->
      <div class="mission-glow"></div>
      
      <!-- Logo icon header -->
      <div class="mission-logo-container">
        <div class="logo-ring"></div>
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/F_Logo_White.png" 
          alt="Final Boss Logo" 
          class="mission-logo"
          loading="lazy"
          decoding="async"
        />
      </div>
      
      <p class="mission-text">
        We started with a vision of bringing back 'couch-multiplayer' gaming — a style where people played together in the same room, sharing laughs and competition. That vision has since expanded: we believe XR can bring people together and evolve interactivity, not just in gaming, but across education, training, and beyond.
      </p>
      <span class="mission-attribution gradient-text">— The FinalBoss Team</span>
      
      <!-- Animated bottom line -->
      <div class="mission-underline"></div>
    </div>
  </div>
</section>

<style>
  /* Our Story Section - Performance Optimized */
  .story-section {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 6rem 0;
    contain: layout paint;
    isolation: isolate;
  }

  /* SVG Background Elements */
  .story-bg-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
    contain: strict;
  }

  .circuit-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.6;
    will-change: opacity;
    transform: translateZ(0);
  }

  .circuit-line {
    stroke-dasharray: 1000;
    stroke-dashoffset: 1000;
    animation: drawLine 4s ease-out forwards;
  }

  .line-1 { animation-delay: 0s; }
  .line-2 { animation-delay: 0.5s; }
  .line-3 { animation-delay: 1s; }

  @keyframes drawLine {
    to {
      stroke-dashoffset: 0;
    }
  }

  .pulse-dot {
    opacity: 0;
    animation: pulseDot 3s ease-in-out infinite;
  }

  .dot-1 { animation-delay: 0.5s; }
  .dot-2 { animation-delay: 1.5s; }
  .dot-3 { animation-delay: 2.5s; }

  @keyframes pulseDot {
    0%, 100% { opacity: 0; transform: scale(1); }
    50% { opacity: 1; transform: scale(2); }
  }

  .floating-shape {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);
  }

  .floating-shape.shape-1 {
    width: 300px;
    height: 300px;
    background: rgba(0, 196, 0, 0.15);
    top: 10%;
    left: 5%;
    animation: floatShape 15s ease-in-out infinite;
  }

  .floating-shape.shape-2 {
    width: 250px;
    height: 250px;
    background: rgba(138, 43, 226, 0.1);
    bottom: 20%;
    right: 10%;
    animation: floatShape 18s ease-in-out infinite reverse;
  }

  .floating-shape.shape-3 {
    width: 200px;
    height: 200px;
    background: rgba(255, 215, 0, 0.08);
    top: 50%;
    right: 30%;
    animation: floatShape 12s ease-in-out infinite;
  }

  @keyframes floatShape {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -20px) scale(1.1); }
    50% { transform: translate(-20px, 30px) scale(0.95); }
    75% { transform: translate(20px, 20px) scale(1.05); }
  }

  /* Story Container */
  .story-container {
    position: relative;
    z-index: 10;
    max-width: 1400px;
    width: 100%;
    padding: 2rem;
  }

  .story-header {
    text-align: center;
    margin-bottom: 4rem;
    will-change: transform, opacity;
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

  .title-underline {
    width: 200px;
    height: 20px;
    margin: 1rem auto 0;
    transform-origin: center;
    transition: transform 0.5s ease-out;
  }

  /* Integrated Timeline + Media Layout */
  .story-content-integrated {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
  }

  .story-intro {
    margin-bottom: 3rem;
    text-align: center;
    max-width: 700px;
    margin-left: auto;
    margin-right: auto;
  }

  .lead-text {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    font-weight: 300;
  }

  .timeline-integrated {
    position: relative;
    padding-left: 2rem;
  }

  .timeline-line-vertical {
    position: absolute;
    left: 0;
    top: 0;
    width: 2px;
    background: linear-gradient(180deg, #00c400, #8a2be2);
    transition: height 0.5s ease-out;
  }

  .timeline-row {
    display: flex;
    gap: 2rem;
    padding-bottom: 3rem;
    position: relative;
    will-change: transform, opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
    /* Initially hidden until scrolled into view */
    opacity: 0;
    transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .timeline-row.visible {
    opacity: 1;
  }

  .timeline-row.clickable {
    cursor: pointer;
  }

  .timeline-row.clickable:focus-visible {
    outline: 2px solid rgba(0, 196, 0, 0.5);
    outline-offset: 8px;
    border-radius: 8px;
  }

  .timeline-row:last-child {
    padding-bottom: 0;
  }

  .timeline-marker {
    position: absolute;
    left: -2rem;
    top: 0.25rem;
  }

  .timeline-dot-integrated {
    width: 12px;
    height: 12px;
    background: #0a1628;
    border: 2px solid #00c400;
    border-radius: 50%;
    transform: translateX(-5px) translateZ(0);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backface-visibility: hidden;
  }

  .timeline-row:hover .timeline-dot-integrated {
    transform: translateX(-5px) scale(1.4) translateZ(0);
    background: #00c400;
    box-shadow: 0 0 20px rgba(0, 196, 0, 0.6), 0 0 40px rgba(0, 196, 0, 0.3);
  }

  .timeline-dot-integrated.active {
    background: #00c400;
    box-shadow: 0 0 15px rgba(0, 196, 0, 0.5);
  }

  .timeline-row-content {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    align-items: flex-start;
  }

  .timeline-text-block {
    flex: 0 0 280px;
    max-width: 350px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    backface-visibility: hidden;
    overflow: hidden;
    /* Initially hidden for scroll-into-view reveal */
    opacity: 0;
    transform: translateY(20px) translateZ(0);
  }

  .timeline-row.visible .timeline-text-block {
    opacity: 1;
    transform: translateY(0) translateZ(0);
    transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .timeline-text-block::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.1) 0%, transparent 50%, rgba(138, 43, 226, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .timeline-row:hover .timeline-text-block {
    background: rgba(10, 22, 40, 0.95);
    border-color: rgba(0, 196, 0, 0.4);
    transform: translateY(0) scale(1.02) translateZ(0);
    box-shadow: 
      0 10px 40px rgba(0, 0, 0, 0.3),
      0 0 30px rgba(0, 196, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .timeline-row:hover .timeline-text-block::before {
    opacity: 1;
  }

  .timeline-year {
    display: inline-block;
    padding: 0.25rem 0.75rem;
    background: rgba(0, 196, 0, 0.15);
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 600;
    color: #00c400;
    margin-bottom: 0.75rem;
  }

  .timeline-text-block h4 {
    font-weight: 400;
    color: white;
    margin: 0 0 0.5rem 0;
    transition: all 0.3s ease;
  }

  .timeline-text-block p {
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0;
    transition: all 0.3s ease;
  }

  .timeline-row:hover .timeline-text-block p {
    color: rgba(255, 255, 255, 0.85);
  }

  /* Timeline Media Grid */
  .timeline-media-grid {
    flex: 1;
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    align-items: flex-start;
    will-change: transform, opacity;
    opacity: 0;
    transform: translateX(30px);
    transition: opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s;
    pointer-events: none;
  }

  .timeline-media-grid.media-visible {
    opacity: 1;
    transform: translateX(0);
    pointer-events: auto;
  }

  .timeline-row.visible .timeline-media-grid {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s;
    pointer-events: auto;
  }

  /* On mobile, always show media */
  @media (max-width: 1023px) {
    .timeline-media-grid {
      opacity: 1;
      transform: none;
      pointer-events: auto;
    }
  }

  .timeline-media-item {
    position: relative;
    flex: 0 0 auto;
    width: 200px;
    border-radius: 0.75rem;
    overflow: visible;
    box-shadow: 0 15px 35px -10px rgba(0, 0, 0, 0.5);
    transition: all 0.4s ease;
  }

  .timeline-media-item:hover {
    transform: scale(1.05);
    z-index: 10;
  }

  .timeline-media-item .media-stack {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .timeline-media-item .media-frame {
    border-radius: 0.75rem;
    overflow: hidden;
    background: #1a1a2e;
    position: relative;
  }

  .timeline-media-item .video-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .timeline-media-item .video-loading-spinner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(10, 22, 40, 0.85);
    backdrop-filter: blur(4px);
    border-radius: 0.75rem;
    z-index: 20;
  }

  .spinner-ring {
    position: absolute;
    width: 40px;
    height: 40px;
    border: 3px solid transparent;
    border-top-color: #00c400;
    border-right-color: #8a2be2;
    border-radius: 50%;
    animation: spinRing 1s linear infinite;
  }

  .spinner-ring:nth-child(2) {
    width: 55px;
    height: 55px;
    border-top-color: #8a2be2;
    border-right-color: #00c400;
    animation-delay: -0.33s;
  }

  .spinner-ring:nth-child(3) {
    width: 70px;
    height: 70px;
    border-top-color: rgba(0, 196, 0, 0.5);
    border-right-color: rgba(138, 43, 226, 0.5);
    animation-delay: -0.66s;
  }

  @keyframes spinRing {
    to {
      transform: rotate(360deg);
    }
  }

  .timeline-media-item .companion-photo-frame {
    border-radius: 0.5rem;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.15);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    transition: all 0.3s ease;
  }

  .timeline-media-item .companion-photo-frame img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: cover;
  }

  .timeline-media-item:hover .companion-photo-frame {
    border-color: rgba(0, 196, 0, 0.4);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(0, 196, 0, 0.2);
  }

  .timeline-media-item video,
  .timeline-media-item img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }

  /* Phone-style items in timeline */
  .timeline-media-item.phone {
    width: 130px;
  }

  .timeline-media-item.phone .media-frame {
    aspect-ratio: 9/19;
    border-radius: 1.25rem;
    border: 3px solid rgba(255, 255, 255, 0.15);
    position: relative;
    box-shadow: 
      0 0 0 2px rgba(0, 0, 0, 0.8),
      0 20px 50px rgba(0, 0, 0, 0.4),
      inset 0 0 30px rgba(0, 0, 0, 0.3);
  }

  .timeline-media-item.phone video {
    height: 100%;
    object-fit: cover;
  }

  .timeline-media-item .phone-notch {
    position: absolute;
    top: 6px;
    left: 50%;
    transform: translateX(-50%);
    width: 35%;
    height: 16px;
    background: #0a0a14;
    border-radius: 0 0 10px 10px;
    z-index: 10;
  }

  .timeline-media-item .phone-notch::before {
    content: '';
    position: absolute;
    top: 5px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    box-shadow: 0 0 3px rgba(138, 43, 226, 0.5);
  }

  .timeline-media-badge {
    display: block;
    text-align: center;
    margin-top: 0.75rem;
    padding: 0.5rem 0.85rem;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.2) 0%, rgba(138, 43, 226, 0.2) 100%);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 2rem;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    word-wrap: break-word;
    overflow-wrap: break-word;
    line-height: 1.3;
    max-width: 180px;
  }

  /* Responsive adjustments for integrated layout */
  @media (max-width: 1024px) {
    .timeline-row-content {
      flex-direction: column;
    }

    .timeline-text-block {
      flex: 1 1 auto;
      max-width: none;
    }

    .timeline-media-grid {
      width: 100%;
      justify-content: flex-start;
    }

    .timeline-media-item {
      width: 150px;
    }

    .timeline-media-item.phone {
      width: 100px;
    }
  }

  @media (max-width: 640px) {
    .timeline-integrated {
      padding-left: 1.5rem;
    }

    .timeline-marker {
      left: -1.5rem;
    }

    .timeline-media-item {
      width: 120px;
    }

    .timeline-media-item.phone {
      width: 80px;
    }
  }

  /* Mission Statement - Enhanced Cool Design */
  .story-mission {
    position: relative;
    text-align: center;
    max-width: 800px;
    margin: 5rem auto 0;
    padding: 3.5rem 3rem;
    background: linear-gradient(135deg, rgba(10, 22, 40, 0.95) 0%, rgba(20, 10, 40, 0.9) 50%, rgba(10, 22, 40, 0.95) 100%);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 1.5rem;
    will-change: transform, opacity;
    overflow: hidden;
    box-shadow: 
      0 25px 80px -20px rgba(0, 0, 0, 0.6),
      0 0 60px -30px rgba(0, 196, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .story-mission::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 0%, rgba(0, 196, 0, 0.03) 50%, transparent 100%);
    pointer-events: none;
  }

  /* Animated corner accents */
  .mission-corner {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 2px solid transparent;
    pointer-events: none;
  }

  .mission-corner.top-left {
    top: 12px;
    left: 12px;
    border-top-color: #00c400;
    border-left-color: #00c400;
    border-radius: 4px 0 0 0;
    animation: cornerPulse 3s ease-in-out infinite;
  }

  .mission-corner.top-right {
    top: 12px;
    right: 12px;
    border-top-color: #8a2be2;
    border-right-color: #8a2be2;
    border-radius: 0 4px 0 0;
    animation: cornerPulse 3s ease-in-out infinite 0.75s;
  }

  .mission-corner.bottom-left {
    bottom: 12px;
    left: 12px;
    border-bottom-color: #8a2be2;
    border-left-color: #8a2be2;
    border-radius: 0 0 0 4px;
    animation: cornerPulse 3s ease-in-out infinite 1.5s;
  }

  .mission-corner.bottom-right {
    bottom: 12px;
    right: 12px;
    border-bottom-color: #00c400;
    border-right-color: #00c400;
    border-radius: 0 0 4px 0;
    animation: cornerPulse 3s ease-in-out infinite 2.25s;
  }

  @keyframes cornerPulse {
    0%, 100% { opacity: 0.4; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* Glowing orb background */
  .mission-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0, 196, 0, 0.1) 0%, rgba(138, 43, 226, 0.05) 40%, transparent 70%);
    pointer-events: none;
    animation: glowPulse 4s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
  }

  /* Logo container with animated ring */
  .mission-logo-container {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .logo-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.3), rgba(138, 43, 226, 0.3)) border-box;
    -webkit-mask: 
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    mask: 
      linear-gradient(#fff 0 0) padding-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    animation: ringRotate 8s linear infinite;
  }

  .logo-ring::before {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 50%;
    background: conic-gradient(from 0deg, #00c400, #8a2be2, #00c400);
    opacity: 0.6;
    animation: ringRotate 4s linear infinite;
    filter: blur(4px);
  }

  @keyframes ringRotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .mission-logo {
    width: 60px;
    height: 60px;
    object-fit: contain;
    filter: drop-shadow(0 0 20px rgba(0, 196, 0, 0.4));
    animation: logoFloat 3s ease-in-out infinite;
    position: relative;
    z-index: 1;
  }

  @keyframes logoFloat {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-5px) scale(1.05); }
  }

  .mission-text {
    position: relative;
    font-size: clamp(1.125rem, 2vw, 1.375rem);
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.9;
    font-weight: 300;
    margin: 0 0 1.5rem 0;
    z-index: 1;
  }

  .mission-attribution {
    display: block;
    position: relative;
    font-size: 0.9rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    z-index: 1;
  }

  /* Animated underline */
  .mission-underline {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00c400, #8a2be2, transparent);
    opacity: 0.6;
    animation: underlineShimmer 3s ease-in-out infinite;
    will-change: transform, opacity;
  }

  @keyframes underlineShimmer {
    0%, 100% { opacity: 0.4; transform: translateX(-50%) scaleX(0.83); }
    50% { opacity: 0.8; transform: translateX(-50%) scaleX(1.17); }
  }

  @media (max-width: 768px) {
    .story-section {
      padding: 4rem 0;
    }

    .story-mission {
      margin-top: 3rem;
      padding: 2.5rem 1.5rem;
    }

    .mission-logo-container {
      width: 70px;
      height: 70px;
    }

    .mission-logo {
      width: 50px;
      height: 50px;
    }

    .mission-corner {
      width: 20px;
      height: 20px;
    }
  }

</style>
