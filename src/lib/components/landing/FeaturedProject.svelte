<script lang="ts">
  export let animationProgress = 0;
  export let projectSection: HTMLElement | undefined = undefined;
  
  let projectVideo: HTMLVideoElement;
  
  // Reactive video play/pause based on progress
  $: if (projectVideo) {
    if (animationProgress > 0.2 && animationProgress < 0.9) {
      projectVideo.play().catch(() => {});
    } else {
      projectVideo.pause();
    }
  }
</script>

<section 
  class="project-section" 
  bind:this={projectSection}
  aria-label="Featured Project"
>
  <div class="project-background"></div>
  
  <div class="project-container">
    <!-- Section Header -->
    <div 
      class="project-header"
      style="
        opacity: {animationProgress};
        transform: translateY({(1 - animationProgress) * 50}px);
      "
    >
      <span class="section-label">Featured Work</span>
    </div>

    <div class="project-content">
      <!-- iPhone Demo -->
      <div 
        class="iphone-container"
        style="
          opacity: {animationProgress};
          transform: translateX({(1 - animationProgress) * -100}px) rotateY({(1 - animationProgress) * -15}deg);
        "
      >
        <div class="iphone-frame">
          <div class="iphone-notch"></div>
          <div class="iphone-screen">
            <video 
              bind:this={projectVideo}
              loop 
              muted 
              playsinline
              class="demo-video"
            >
              <source src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/Game-trailer-Attempt-3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div class="iphone-home-indicator"></div>
        </div>
        
        <!-- Glow effect behind iPhone -->
        <div class="iphone-glow"></div>
      </div>

      <!-- Project Info -->
      <div 
        class="project-info"
        style="
          opacity: {animationProgress};
          transform: translateX({(1 - animationProgress) * 100}px);
        "
      >
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/CC_LogoAnimated.gif" 
          class="w-32 lg:w-20 mx-auto lg:mx-0 drop-shadow-2xl" 
          alt="Cosmic Collisions Logo"
        >
        
        <h3 class="text-4xl gradient-text">Cosmic Collisions</h3>
        
        <p class="project-description">
          An arcade-style space shooter where physics meets chaos. Navigate through 
          asteroid fields, collect power-ups, and survive increasingly intense waves 
          of cosmic debris. Built with Unreal Engine 5 for iOS and Android.
        </p>

        <div class="project-features">
          <div class="feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Physics-based gameplay</span>
          </div>
          <div class="feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Endless arcade mode</span>
          </div>
          <div class="feature">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
            <span>Global leaderboards</span>
          </div>
        </div>

        <a href="/cosmic" class="project-cta">
          <span>View Full Project</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</section>

<style>
  /* Featured Project Section */
  .project-section {
    position: relative;
    min-height: 100vh;
    padding: 6rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .project-section {
      padding: 4rem 1rem;
      min-height: auto;
    }
  }

  .project-background {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 30% 50%, rgba(0, 196, 0, 0.08) 0%, transparent 60%);
    pointer-events: none;
  }

  .project-container {
    max-width: 1200px;
    width: 100%;
    position: relative;
  }

  .project-header {
    text-align: center;
    margin-bottom: 4rem;
    will-change: opacity, transform;
  }

  @media (max-width: 768px) {
    .project-header {
      margin-bottom: 2rem;
    }
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
  }

  .project-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .project-content {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
  }

  /* iPhone Mockup */
  .iphone-container {
    position: relative;
    display: flex;
    justify-content: center;
    perspective: 1000px;
    will-change: opacity, transform;
  }

  .iphone-frame {
    position: relative;
    width: 280px;
    height: 580px;
    background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
    border-radius: 50px;
    padding: 12px;
    box-shadow: 
      0 50px 100px rgba(0, 0, 0, 0.5),
      0 0 0 2px rgba(255, 255, 255, 0.1),
      inset 0 0 20px rgba(0, 0, 0, 0.5);
  }

  @media (max-width: 768px) {
    .iphone-frame {
      width: 240px;
      height: 500px;
      border-radius: 40px;
    }
  }

  .iphone-notch {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 32px;
    background: #000;
    border-radius: 0 0 20px 20px;
    z-index: 2;
  }

  @media (max-width: 768px) {
    .iphone-notch {
      width: 100px;
      height: 28px;
    }
  }

  .iphone-screen {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 38px;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .iphone-screen {
      border-radius: 30px;
    }
  }

  .demo-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .iphone-home-indicator {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  .iphone-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 320px;
    height: 620px;
    background: radial-gradient(ellipse at center, rgba(0, 196, 0, 0.2) 0%, transparent 70%);
    filter: blur(30px);
    z-index: -1;
  }

  @media (max-width: 768px) {
    .iphone-glow {
      width: 260px;
      height: 540px;
    }
  }

  /* Project Info */
  .project-info {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    will-change: opacity, transform;
  }

  .project-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 1.125rem;
    line-height: 1.7;
  }

  .project-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  @media (max-width: 1024px) {
    .project-features {
      align-items: center;
    }
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9375rem;
  }

  .feature svg {
    color: #00c400;
  }

  .project-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: transparent;
    border: 1px solid rgba(0, 196, 0, 0.5);
    color: #00c400;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
    width: fit-content;
  }

  @media (max-width: 1024px) {
    .project-cta {
      margin: 0 auto;
    }
  }

  .project-cta:hover {
    background: rgba(0, 196, 0, 0.1);
    border-color: #00c400;
    transform: translateX(4px);
  }

  /* Gradient text utility */
  :global(.gradient-text) {
    background: linear-gradient(135deg, #00c400 0%, #8a2be2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
