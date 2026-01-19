<script lang='ts'>
  import { onMount } from 'svelte';
  import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let heroSection: HTMLElement;
  let projectSection: HTMLElement;
  let storySection: HTMLElement;
  let projectVideo: HTMLVideoElement;
  let windowWidth = 0;
  let windowHeight = 0;
  
  // Scroll animation state for project section
  let projectAnimationProgress = 0;
  
  // Scroll animation state for story section
  let storyAnimationProgress = 0;
  
  // Scroll animation state for next project section
  let nextProjectSection: HTMLElement;
  let nextProjectAnimationProgress = 0;

  // Define geometric shapes with their positions and properties
  interface Shape {
    id: number;
    type: 'hexagon' | 'triangle' | 'square' | 'diamond' | 'circle';
    x: number;
    y: number;
    size: number;
    rotation: number;
    baseRotation: number;
    color: string;
    parallaxSpeed: number; // Different speeds for each shape
  }

  const shapes: Shape[] = [
    { id: 1, type: 'hexagon', x: 15, y: 20, size: 80, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.15)', parallaxSpeed: 0.3 },
    { id: 2, type: 'triangle', x: 85, y: 15, size: 60, rotation: 0, baseRotation: 30, color: 'rgba(0, 196, 0, 0.12)', parallaxSpeed: 0.5 },
    { id: 3, type: 'square', x: 10, y: 70, size: 50, rotation: 0, baseRotation: 45, color: 'rgba(255, 215, 0, 0.1)', parallaxSpeed: 0.2 },
    { id: 4, type: 'diamond', x: 90, y: 75, size: 70, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.1)', parallaxSpeed: 0.4 },
    { id: 5, type: 'circle', x: 75, y: 45, size: 100, rotation: 0, baseRotation: 0, color: 'rgba(138, 43, 226, 0.08)', parallaxSpeed: 0.15 },
    { id: 6, type: 'hexagon', x: 25, y: 85, size: 55, rotation: 0, baseRotation: 15, color: 'rgba(0, 196, 0, 0.08)', parallaxSpeed: 0.35 },
    { id: 7, type: 'triangle', x: 5, y: 45, size: 45, rotation: 0, baseRotation: -20, color: 'rgba(255, 215, 0, 0.08)', parallaxSpeed: 0.45 },
    { id: 8, type: 'square', x: 70, y: 85, size: 40, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.1)', parallaxSpeed: 0.25 },
    { id: 9, type: 'diamond', x: 50, y: 10, size: 35, rotation: 0, baseRotation: 45, color: 'rgba(138, 43, 226, 0.1)', parallaxSpeed: 0.55 },
    { id: 10, type: 'hexagon', x: 95, y: 50, size: 65, rotation: 0, baseRotation: 30, color: 'rgba(0, 196, 0, 0.06)', parallaxSpeed: 0.2 },
  ];

  let shapeTransforms: { [key: number]: { translateX: number; translateY: number; rotation: number; scale: number } } = {};

  // Initialize transforms
  shapes.forEach(shape => {
    shapeTransforms[shape.id] = { translateX: 0, translateY: 0, rotation: shape.baseRotation, scale: 1 };
  });

  const handleMouseMove = (e: MouseEvent) => {
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;

    updateShapeTransforms();
  };

  const updateShapeTransforms = () => {
    if (!heroSection) return;
    const rect = heroSection.getBoundingClientRect();

    shapes.forEach(shape => {
      const shapePixelX = (shape.x / 100) * rect.width;
      const shapePixelY = (shape.y / 100) * rect.height;
      
      const deltaX = mouseX - shapePixelX;
      const deltaY = mouseY - shapePixelY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const influenceRadius = 400;
      
      let translateX = 0;
      let translateY = 0;
      let rotation = shape.baseRotation;
      let scale = 1;

      // Mouse interaction
      if (distance < influenceRadius) {
        const influence = 1 - (distance / influenceRadius);
        const pushStrength = 50 * influence;
        
        const angle = Math.atan2(deltaY, deltaX);
        translateX = -Math.cos(angle) * pushStrength;
        translateY = -Math.sin(angle) * pushStrength;
        rotation = shape.baseRotation + (influence * 45);
        scale = 1 + (influence * 0.15);
      }

      // Add scroll-based parallax offset
      const parallaxOffset = scrollY * shape.parallaxSpeed;
      translateY -= parallaxOffset;

      shapeTransforms[shape.id] = { translateX, translateY, rotation, scale };
    });
    
    shapeTransforms = { ...shapeTransforms };
  };

  const handleScroll = () => {
    scrollY = window.scrollY;
    updateShapeTransforms();
    
    // Calculate scroll percentage for scroll-based animations
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = documentHeight > 0 ? (scrollY / documentHeight) * 100 : 0;
    console.log(`Scroll Position: ${scrollPercent.toFixed(2)}%`);
    
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
      
      // Play video when section is visible
      if (projectVideo) {
        if (projectAnimationProgress > 0.3) {
          projectVideo.play().catch(() => {});
        } else {
          projectVideo.pause();
        }
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

  onMount(() => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<svelte:window on:scroll={handleScroll} />

<main>
  <!-- Hero Section -->
  <section 
    class="hero-section" 
    bind:this={heroSection}
    on:mousemove={handleMouseMove}
    role="banner"
    aria-label="Hero section"
  >
    <!-- Animated Background Grid - slowest parallax -->
    <div class="grid-background" style="transform: translateY({scrollY * 0.1}px);"></div>
    
    <!-- Geometric Shapes -->
    {#each shapes as shape (shape.id)}
      <div 
        class="geo-shape {shape.type}"
        style="
          left: {shape.x}%;
          top: {shape.y}%;
          width: {shape.size}px;
          height: {shape.size}px;
          --shape-color: {shape.color};
          transform: translate(-50%, -50%) 
            translateX({shapeTransforms[shape.id]?.translateX || 0}px) 
            translateY({shapeTransforms[shape.id]?.translateY || 0}px) 
            rotate({shapeTransforms[shape.id]?.rotation || shape.baseRotation}deg)
            scale({shapeTransforms[shape.id]?.scale || 1});
        "
      ></div>
    {/each}

    <!-- Subtle Cursor Glow -->
    <div 
      class="cursor-glow"
      style="left: {mouseX}px; top: {mouseY}px;"
    ></div>

    <!-- Hero Content - moves slightly faster than background for depth -->
    <div class="hero-content" style="transform: translateY({scrollY * -0.2}px);">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        <span>Immersive Technology Studio</span>
      </div>
      
      <h1 class="hero-title">
        <span class="title-line">Shaping the Future of</span>
        <span class="title-line gradient-text">Extended Reality</span>
      </h1>
      
      <p class="hero-subtitle">
        We build proprietary XR software and (sometimes) AI-powered spatial experiences — 
        from immersive games, and other industries. We are a creative studio that wants to
        truly innovate the way people interact with technology.
      </p>

      <!-- Value Props -->
      <div class="value-props">
        <div class="value-prop">
          <span class="prop-icon">🎮</span>
          <span class="prop-text">Immersive Games</span>
        </div>
        <div class="value-prop">
          <span class="prop-icon">🧠</span>
          <span class="prop-text">AI Integration</span>
        </div>
        <div class="value-prop">
          <span class="prop-icon">👓</span>
          <span class="prop-text">XR Platform</span>
        </div>
      </div>

      <div class="hero-cta">
        <a href="/cosmic" class="btn-primary">
          <span class="btn-badge btn-badge-primary">Video Game</span>
          <span>Cosmic Collisions</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="/project_v" class="btn-secondary">
          <span class="btn-badge">Coming Soon</span>
          Project V
        </a>
      </div>
    </div>

    <!-- Scroll Indicator - fades out as you scroll -->
    <div class="scroll-indicator" style="opacity: {Math.max(0, 1 - scrollY / 200)}; transform: translateY({scrollY * 0.5}px);">
      <span>Scroll to explore</span>
      <div class="scroll-arrow">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 5v14M5 12l7 7 7-7"/>
        </svg>
      </div>
    </div>
  </section>

  <!-- Featured Project -->
  <section 
    class="project-section" 
    bind:this={projectSection}
    aria-label="Most recent project"
  >
    <div class="project-background"></div>
    
    <div class="project-container">
      <!-- Section Header -->
      <div 
        class="project-header"
        style="
          opacity: {projectAnimationProgress};
          transform: translateY({(1 - projectAnimationProgress) * 50}px);
        "
      >
        <span class="section-label">Featured Work</span>
      </div>

      <div class="project-content">
        <!-- iPhone Demo -->
        <div 
          class="iphone-container"
          style="
            opacity: {projectAnimationProgress};
            transform: translateX({(1 - projectAnimationProgress) * -100}px) rotateY({(1 - projectAnimationProgress) * -15}deg);
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
            opacity: {projectAnimationProgress};
            transform: translateX({(1 - projectAnimationProgress) * 100}px);
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

  <!-- Our Story Section -->
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
      <div class="floating-shape shape-1" style="opacity: {storyAnimationProgress * 0.6};"></div>
      <div class="floating-shape shape-2" style="opacity: {storyAnimationProgress * 0.4};"></div>
      <div class="floating-shape shape-3" style="opacity: {storyAnimationProgress * 0.5};"></div>
    </div>

    <div class="story-container">
      <!-- Section Header -->
      <div 
        class="story-header"
        style="
          opacity: {storyAnimationProgress};
          transform: translateY({(1 - storyAnimationProgress) * 60}px);
        "
      >
        <span class="section-label">The Journey</span>
        <h2 class="section-title gradient-text">Our Story</h2>
        
        <!-- Animated underline SVG -->
        <svg class="title-underline" viewBox="0 0 200 20" style="transform: scaleX({storyAnimationProgress});">
          <path d="M0 10 Q50 0 100 10 T200 10" stroke="url(#lineGradient)" fill="none" stroke-width="2" />
        </svg>
      </div>

      <div class="story-content">
        <!-- Timeline / Text Side -->
        <div 
          class="story-text"
          style="
            opacity: {storyAnimationProgress};
            transform: translateX({(1 - storyAnimationProgress) * -80}px);
          "
        >
          <div class="story-intro">
            <p class="lead-text">
              What started as a passion project in a small apartment has grown into 
              a vision for the future of human-computer interaction.
            </p>
          </div>

          <!-- Timeline -->
          <div class="timeline">
            <div class="timeline-line" style="height: {storyAnimationProgress * 100}%;"></div>
            
            <div class="timeline-item" style="opacity: {Math.min(1, storyAnimationProgress * 2)}; transform: translateX({(1 - Math.min(1, storyAnimationProgress * 2)) * 30}px);">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-year">2023</span>
                <h4>The Beginning</h4>
                <p>Founded with a dream to push the boundaries of immersive technology and create experiences that matter.</p>
              </div>
            </div>

            <div class="timeline-item" style="opacity: {Math.min(1, Math.max(0, storyAnimationProgress * 2 - 0.5))}; transform: translateX({(1 - Math.min(1, Math.max(0, storyAnimationProgress * 2 - 0.5))) * 30}px);">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-year">2024</span>
                <h4>First Launch</h4>
                <p>Released our first mobile game, Cosmic Collisions, learning invaluable lessons about game development and user experience.</p>
              </div>
            </div>

            <div class="timeline-item" style="opacity: {Math.min(1, Math.max(0, storyAnimationProgress * 2 - 1))}; transform: translateX({(1 - Math.min(1, Math.max(0, storyAnimationProgress * 2 - 1))) * 30}px);">
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <span class="timeline-year">2025</span>
                <h4>Expanding Horizons</h4>
                <p>Began development on XR productivity tools and enterprise solutions, bringing our vision to new industries.</p>
              </div>
            </div>

            <div class="timeline-item" style="opacity: {Math.min(1, Math.max(0, storyAnimationProgress * 2 - 1.3))}; transform: translateX({(1 - Math.min(1, Math.max(0, storyAnimationProgress * 2 - 1.3))) * 30}px);">
              <div class="timeline-dot active"></div>
              <div class="timeline-content">
                <span class="timeline-year">Today</span>
                <h4>Building the Future</h4>
                <p>Continuing to innovate at the intersection of gaming, AI, and spatial computing.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Media Montage Side -->
        <div 
          class="story-media"
          style="
            opacity: {storyAnimationProgress};
            transform: translateX({(1 - storyAnimationProgress) * 80}px);
          "
        >
          <div class="media-montage">
            <!-- Main featured media -->
            <div class="media-item main" style="transform: translateY({(1 - storyAnimationProgress) * 40}px);">
              <div class="media-frame">
                <img src="/images/story/team-working.jpg" alt="Team collaboration" />
                <div class="media-overlay">
                  <span class="media-caption">Late nights & big dreams</span>
                </div>
              </div>
              <!-- Decorative corner accent -->
              <svg class="corner-accent" viewBox="0 0 60 60">
                <path d="M0 60 L0 20 Q0 0 20 0 L60 0" stroke="#00c400" fill="none" stroke-width="2" />
              </svg>
            </div>

            <!-- Secondary media items -->
            <div class="media-item secondary-1" style="transform: translate({(1 - storyAnimationProgress) * 60}px, {(1 - storyAnimationProgress) * -30}px);">
              <div class="media-frame">
                <img src="/images/story/prototype.jpg" alt="Early prototype" />
              </div>
            </div>

            <div class="media-item secondary-2" style="transform: translate({(1 - storyAnimationProgress) * -40}px, {(1 - storyAnimationProgress) * 50}px);">
              <div class="media-frame">
                <video autoplay loop muted playsinline>
                  <source src="/videos/story/development-timelapse.mp4" type="video/mp4" />
                </video>
              </div>
            </div>

            <div class="media-item secondary-3" style="transform: translate({(1 - storyAnimationProgress) * 30}px, {(1 - storyAnimationProgress) * 40}px);">
              <div class="media-frame">
                <img src="/images/story/milestone.jpg" alt="Celebrating milestone" />
              </div>
            </div>

            <!-- Floating video thumbnail -->
            <div class="media-item floating-video" style="transform: translateY({(1 - storyAnimationProgress) * -60}px) rotate({(1 - storyAnimationProgress) * 10}deg);">
              <div class="media-frame">
                <video autoplay loop muted playsinline>
                  <source src="/videos/story/behind-scenes.mp4" type="video/mp4" />
                </video>
                <div class="play-indicator">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Animated connection lines between media -->
          <svg class="media-connections" viewBox="0 0 500 600">
            <defs>
              <linearGradient id="connectionGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="rgba(0, 196, 0, 0.3)" />
                <stop offset="100%" stop-color="rgba(138, 43, 226, 0.3)" />
              </linearGradient>
            </defs>
            <path 
              class="connection-path" 
              d="M250 100 Q350 150 300 250 Q250 350 350 400 Q450 450 400 550" 
              stroke="url(#connectionGrad)" 
              fill="none" 
              stroke-width="1"
              stroke-dasharray="5 5"
              style="stroke-dashoffset: {(1 - storyAnimationProgress) * 500};"
            />
          </svg>
        </div>
      </div>

      <!-- Bottom quote/mission statement -->
      <div 
        class="story-mission"
        style="
          opacity: {Math.max(0, storyAnimationProgress - 0.5) * 2};
          transform: translateY({(1 - Math.max(0, storyAnimationProgress - 0.5) * 2) * 40}px);
        "
      >
        <svg class="quote-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21" />
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
        </svg>
        <p class="mission-text">
          We believe technology should feel like magic — intuitive, immersive, and 
          deeply human. Every line of code we write brings us closer to that vision.
        </p>
        <span class="mission-attribution">— The FinalBoss Team</span>
      </div>
    </div>
  </section>

  <!-- Next Project Section -->
  <section 
    class="next-project-section" 
    bind:this={nextProjectSection}
    aria-label="Next Project"
  >
    <!-- Animated Background -->
    <div class="next-project-bg">
      <!-- Animated Grid Pattern -->
      <svg class="grid-pattern" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <pattern id="gridPattern" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0, 255, 0, 0.1)" stroke-width="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#gridPattern)" />
      </svg>
      
      <!-- Glowing orbs -->
      <div class="glow-orb orb-1" style="opacity: {nextProjectAnimationProgress * 0.5};"></div>
      <div class="glow-orb orb-2" style="opacity: {nextProjectAnimationProgress * 0.3};"></div>
    </div>

    <div class="next-project-container">
      <div class="next-project-content">
        <!-- Left Side - Text -->
        <div 
          class="next-project-info"
          style="
            opacity: {nextProjectAnimationProgress};
            transform: translateX({(1 - nextProjectAnimationProgress) * -60}px);
          "
        >
          <h2 class="next-project-title">
            <span class="title-prefix">Next Up:</span>
            <span class="title-main gradient-text">Project V</span>
          </h2>
          
          <p class="next-project-description">
            A groundbreaking XR productivity platform designed to transform how teams 
            collaborate in spatial environments. Seamlessly blend physical and digital 
            workspaces with intuitive gesture controls and AI-powered assistance.
          </p>
        </div>

        <!-- Right Side - SVG Visual -->
        <div 
          class="next-project-visual"
          style="
            opacity: {nextProjectAnimationProgress};
            transform: translateX({(1 - nextProjectAnimationProgress) * 60}px) scale({0.9 + nextProjectAnimationProgress * 0.1});
          "
        >
          <!-- Smart Glasses SVG -->
          <div class="glasses-container">
            <svg class="smart-glasses" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <filter id="glassesGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              
              <!-- Left Lens Frame -->
              <rect x="10" y="20" width="70" height="40" rx="8" fill="none" stroke="#00ff00" stroke-width="2" filter="url(#glassesGlow)" />
              <!-- Left Lens -->
              <rect x="14" y="24" width="62" height="32" rx="6" fill="rgba(0, 255, 0, 0.1)" stroke="rgba(0, 255, 0, 0.5)" stroke-width="1" />
              <!-- Left Lens Reflection -->
              <path d="M20 28 L30 28 L25 35 Z" fill="rgba(0, 255, 0, 0.3)" />
              
              <!-- Right Lens Frame -->
              <rect x="120" y="20" width="70" height="40" rx="8" fill="none" stroke="#00ff00" stroke-width="2" filter="url(#glassesGlow)" />
              <!-- Right Lens -->
              <rect x="124" y="24" width="62" height="32" rx="6" fill="rgba(0, 255, 0, 0.1)" stroke="rgba(0, 255, 0, 0.5)" stroke-width="1" />
              <!-- Right Lens Reflection -->
              <path d="M130 28 L140 28 L135 35 Z" fill="rgba(0, 255, 0, 0.3)" />
              
              <!-- Bridge -->
              <path d="M80 35 Q100 25 120 35" fill="none" stroke="#00ff00" stroke-width="4" />
              
              <!-- Left Temple Arm -->
              <path d="M10 30 L0 28 Q-5 27 -5 32 L-5 35" fill="none" stroke="#00ff00" stroke-width="3" />
              
              <!-- Right Temple Arm -->
              <path d="M190 30 L200 28 Q205 27 205 32 L205 35" fill="none" stroke="#00ff00" stroke-width="3" />
              
              <!-- Tech Details - Left -->
              <circle cx="25" cy="55" r="3" fill="#00ff00">
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
              </circle>
              <rect x="60" y="52" width="15" height="6" rx="2" fill="rgba(0, 255, 0, 0.6)" />
              
              <!-- Tech Details - Right -->
              <circle cx="175" cy="55" r="3" fill="#00ff00">
                <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
              </circle>
              <rect x="125" y="52" width="15" height="6" rx="2" fill="rgba(0, 255, 0, 0.6)" />
              
              <!-- HUD Elements (animated) -->
              <g class="hud-elements" opacity="0.7">
                <rect x="20" y="32" width="20" height="2" rx="1" fill="#00ff00">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
                </rect>
                <rect x="20" y="38" width="15" height="2" rx="1" fill="#00ff00">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="0.5s" />
                </rect>
                <rect x="20" y="44" width="25" height="2" rx="1" fill="#00ff00">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="1s" />
                </rect>
                
                <rect x="155" y="32" width="20" height="2" rx="1" fill="#00ff00">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="1.5s" />
                </rect>
                <rect x="160" y="38" width="15" height="2" rx="1" fill="#00ff00">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="2s" />
                </rect>
                <rect x="150" y="44" width="25" height="2" rx="1" fill="#00ff00">
                  <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="2.5s" />
                </rect>
              </g>
              
              <!-- Scanning line effect -->
              <rect x="14" y="24" width="62" height="2" rx="1" fill="rgba(0, 255, 0, 0.4)">
                <animate attributeName="y" values="24;52;24" dur="2s" repeatCount="indefinite" />
              </rect>
              <rect x="124" y="24" width="62" height="2" rx="1" fill="rgba(0, 255, 0, 0.4)">
                <animate attributeName="y" values="24;52;24" dur="2s" repeatCount="indefinite" begin="0.3s" />
              </rect>
            </svg>
          </div>
          
          <!-- Animated rings around visual -->
          <div class="visual-ring ring-1"></div>
          <div class="visual-ring ring-2"></div>
        </div>
      </div>
    </div>
  </section>

  <!-- Blog Section -->
  <section class="blog-section" aria-label="Blog">
    <div class="blog-container">
      <div class="blog-header">
        <span class="section-label">Latest Updates</span>
        <h2 class="section-title gradient-text">From Our Blog</h2>
      </div>

      <div class="blog-grid">
        <!-- Blog Card 1 -->
        <article class="blog-card">
          <div class="blog-image">
            <div class="blog-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span class="blog-category">Development</span>
          </div>
          <div class="blog-content">
            <span class="blog-date">Jan 15, 2026</span>
            <h3 class="blog-title">Building Immersive Experiences with Unreal Engine 5</h3>
            <p class="blog-excerpt">Explore how we leverage the latest UE5 features to create stunning XR applications...</p>
            <a href="/blog/placeholder-1" class="blog-link">
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </article>

        <!-- Blog Card 2 -->
        <article class="blog-card">
          <div class="blog-image">
            <div class="blog-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span class="blog-category">XR Insights</span>
          </div>
          <div class="blog-content">
            <span class="blog-date">Jan 10, 2026</span>
            <h3 class="blog-title">The Future of Spatial Computing in Enterprise</h3>
            <p class="blog-excerpt">How businesses are adopting XR technologies to transform workflows and collaboration...</p>
            <a href="/blog/placeholder-2" class="blog-link">
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </article>

        <!-- Blog Card 3 -->
        <article class="blog-card">
          <div class="blog-image">
            <div class="blog-image-placeholder">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </div>
            <span class="blog-category">Behind the Scenes</span>
          </div>
          <div class="blog-content">
            <span class="blog-date">Jan 5, 2026</span>
            <h3 class="blog-title">Cosmic Collisions: From Concept to Launch</h3>
            <p class="blog-excerpt">A deep dive into the creative process behind our first mobile game release...</p>
            <a href="/blog/placeholder-3" class="blog-link">
              Read More
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </article>
      </div>
    </div>
  </section>

  <!-- Newsletter -->
  <section class="newsletter-section" aria-label="Newsletter">
    <div class="newsletter-bg">
      <div class="newsletter-glow"></div>
    </div>
    
    <div class="newsletter-container">
      <div class="newsletter-content">
        <div class="newsletter-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        </div>
        
        <h2 class="newsletter-title gradient-text">Stay in the Loop</h2>
        <p class="newsletter-description">
          Get the latest updates on our projects, behind-the-scenes content, 
          and exclusive announcements delivered straight to your inbox.
        </p>

        <div class="newsletter-form-wrapper">
          <NewsletterSignup 
            variant="stacked" 
            placeholder="Enter your email" 
            buttonText="Subscribe" 
            showName={true} 
          />
        </div>

        <p class="newsletter-privacy">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div>
    </div>
  </section>

  <!-- Job Postings -->
  <section class="jobs-section" aria-label="Job Postings">
    <div class="jobs-container">
      <div class="jobs-header">
        <span class="section-label">Join Our Team</span>
        <h2 class="section-title gradient-text">Open Positions</h2>
        <p class="jobs-subtitle">
          We're looking for passionate individuals to help us build the future of immersive technology.
        </p>
      </div>

      <div class="jobs-grid">
        <!-- Job Card 1: Game Developer -->
        <article class="job-card">
          <div class="job-icon">🎮</div>
          <div class="job-meta">
            <span class="job-department">Engineering</span>
            <span class="job-type">Part-time</span>
          </div>
          <h3 class="job-title">Game Developer</h3>
          <p class="job-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Remote
          </p>
          <p class="job-description">
            Join our team to build immersive XR gaming experiences using Unreal Engine. Work on cutting-edge VR/AR projects.
          </p>
        </article>

        <!-- Job Card 2: Graphic Designer -->
        <article class="job-card">
          <div class="job-icon">🎨</div>
          <div class="job-meta">
            <span class="job-department">Design</span>
            <span class="job-type">Project-based</span>
          </div>
          <h3 class="job-title">Graphic Designer & Illustrator</h3>
          <p class="job-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            Remote
          </p>
          <p class="job-description">
            Design intuitive and visually stunning interfaces for our XR applications. Push the boundaries of spatial computing.
          </p>
        </article>
      </div>

      <div class="jobs-cta">
        <a href="/jobs" class="view-all-jobs">
          View All Open Positions
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    </div>
  </section>

  <!-- Contact Us -->
  <section class="contact-section" aria-label="Contact Us">
    <div class="contact-container">
      <ContactForm />
    </div>
  </section>
</main>

<style>
  /* Hero Section */
  .hero-section {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh; /* Dynamic viewport height for mobile */
    width: 100%;
    display: flex;
    padding-top: 2em;
    justify-content: center;
    overflow: hidden;
    /* background: radial-gradient(ellipse at 50% 50%, #0a1628 0%, #000000 100%); */
  }

  /* Animated Grid Background */
  .grid-background {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 196, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 196, 0, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
    animation: gridPulse 8s ease-in-out infinite;
    will-change: transform;
  }

  @media (max-width: 768px) {
    .grid-background {
      background-size: 40px 40px;
    }
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Geometric Shapes */
  .geo-shape {
    position: absolute;
    pointer-events: none;
    transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
  }

  /* Hide some shapes on mobile for cleaner look */
  @media (max-width: 768px) {
    .geo-shape {
      opacity: 0.5;
      transform: scale(0.6) !important;
    }
  }

  .geo-shape.hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: var(--shape-color);
    border: 2px solid rgba(0, 196, 0, 0.2);
  }

  .geo-shape.hexagon::before {
    content: '';
    position: absolute;
    inset: 3px;
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: transparent;
    border: 1px solid rgba(0, 196, 0, 0.3);
  }

  .geo-shape.triangle {
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background: var(--shape-color);
  }

  .geo-shape.triangle::before {
    content: '';
    position: absolute;
    inset: 4px;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    background: transparent;
    border: 1px solid rgba(0, 196, 0, 0.25);
  }

  .geo-shape.square {
    background: var(--shape-color);
    border: 1px solid rgba(255, 215, 0, 0.2);
  }

  .geo-shape.square::before {
    content: '';
    position: absolute;
    inset: 4px;
    background: transparent;
    border: 1px solid rgba(255, 215, 0, 0.15);
  }

  .geo-shape.diamond {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background: var(--shape-color);
  }

  .geo-shape.diamond::before {
    content: '';
    position: absolute;
    inset: 4px;
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
    background: transparent;
    border: 1px solid rgba(0, 196, 0, 0.2);
  }

  .geo-shape.circle {
    border-radius: 50%;
    background: var(--shape-color);
    border: 1px solid rgba(138, 43, 226, 0.15);
  }

  .geo-shape.circle::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(138, 43, 226, 0.1);
  }

  /* Cursor Glow - hide on touch devices */
  .cursor-glow {
    position: absolute;
    width: 250px;
    height: 250px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0, 196, 0, 0.1) 0%, transparent 70%);
    pointer-events: none;
    transform: translate(-50%, -50%);
    transition: left 0.15s ease-out, top 0.15s ease-out;
  }

  @media (max-width: 768px) {
    .cursor-glow {
      display: none;
    }
  }

  /* Hero Content */
  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 900px;
    will-change: transform;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  @media (max-width: 768px) {
    .hero-content {
      padding: 1rem;
      padding-top: 3rem;
      justify-content: flex-start;
    }
  }

  .hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    margin-bottom: 2rem;
    color: #00c400;
    font-size: 0.875rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 768px) {
    .hero-badge {
      font-size: 0.75rem;
      padding: 0.4rem 0.8rem;
      margin-bottom: 1.5rem;
    }
  }

  .badge-dot {
    width: 8px;
    height: 8px;
    background: #00c400;
    border-radius: 50%;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(1.2); }
  }

  .hero-title {
    font-size: clamp(2.25rem, 8vw, 4.5rem);
    font-weight: 500;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: white;
  }

  @media (max-width: 768px) {
    .hero-title {
      margin-bottom: 1rem;
    }
  }

  .title-line {
    display: block;
  }

  .gradient-text {
    background: linear-gradient(135deg, #00c400 0%, #FFD700 50%, #00c400 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 4s ease-in-out infinite;
  }

  @keyframes gradientShift {
    0%, 100% { background-position: 0% center; }
    50% { background-position: 100% center; }
  }

  .hero-subtitle {
    font-size: clamp(1rem, 3vw, 1.25rem);
    color: rgba(255, 255, 255, 0.7);
    max-width: 650px;
    margin: 0 auto 2rem;
    line-height: 1.6;
    padding: 0 1rem;
  }

  @media (max-width: 768px) {
    .hero-subtitle {
      margin-bottom: 1.5rem;
    }
  }

  /* Value Props */
  .value-props {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .value-props {
      gap: 0.75rem;
      margin-bottom: 2rem;
      padding: 0 0.5rem;
    }
  }

  .value-prop {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.5rem;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .value-prop {
      padding: 0.5rem 0.875rem;
      gap: 0.375rem;
    }
  }

  .value-prop:hover {
    background: rgba(255, 255, 255, 0.06);
    border-color: rgba(0, 196, 0, 0.3);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .value-prop:hover {
      transform: none;
    }
  }

  .prop-icon {
    font-size: 1.25rem;
  }

  @media (max-width: 768px) {
    .prop-icon {
      font-size: 1rem;
    }
  }

  .prop-text {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .prop-text {
      font-size: 0.75rem;
    }
  }

  /* CTA Buttons */
  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  @media (max-width: 768px) {
    .hero-cta {
      flex-direction: column;
      width: 100%;
      padding: 0 1rem;
      gap: 0.75rem;
    }
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: rgba(0, 196, 0, 0.1);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .btn-primary {
      justify-content: center;
      padding: 0.875rem 1.5rem;
      font-size: 0.9375rem;
      width: 100%;
    }
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 196, 0, 0.6);
    background: rgba(0, 196, 0, 0.15);
  }

  @media (max-width: 768px) {
    .btn-primary:hover {
      transform: none;
    }
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: rgba(138, 43, 226, 0.1);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid rgba(138, 43, 226, 0.3);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    .btn-secondary {
      justify-content: center;
      padding: 0.875rem 1.5rem;
      font-size: 0.9375rem;
      width: 100%;
    }
  }

  .btn-secondary:hover {
    border-color: rgba(138, 43, 226, 0.6);
    background: rgba(138, 43, 226, 0.15);
  }

  .btn-badge {
    font-size: 0.625rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.5rem;
    background: rgba(138, 43, 226, 0.3);
    border-radius: 0.25rem;
    color: #c4a1ff;
  }

  .btn-badge-primary {
    background: rgba(0, 100, 0, 0.5);
    color: #90EE90;
  }

  /* Scroll Indicator */
  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  @media (max-width: 768px) {
    .scroll-indicator {
      bottom: 1.5rem;
      font-size: 0.625rem;
    }
  }

  .scroll-arrow {
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(8px); }
  }

  .scroll-arrow svg {
    stroke: rgba(255, 255, 255, 0.4);
  }

  @media (max-width: 768px) {
    .scroll-arrow svg {
      width: 20px;
      height: 20px;
    }
  }

  /* Most Recent Project Section */
  .project-section {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: linear-gradient(180deg, #000000 0%, #0a1628 50%, #000000 100%); */
    overflow: hidden;
  }

  .project-background {
    position: absolute;
    inset: 0;
    background-image: 
      radial-gradient(ellipse at 30% 50%, rgba(0, 196, 0, 0.05) 0%, transparent 50%),
      radial-gradient(ellipse at 70% 50%, rgba(138, 43, 226, 0.05) 0%, transparent 50%);
  }

  .project-container {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    width: 100%;
    padding: 4rem 2rem;
  }

  .project-header {
    text-align: center;
    margin-bottom: 4rem;
    will-change: transform, opacity;
  }

  .section-label {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #00c400;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 9999px;
  }

  .section-title {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 600;
    color: white;
    margin: 0;
  }

  .project-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 968px) {
    .project-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  /* iPhone Container */
  .iphone-container {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    will-change: transform, opacity;
    perspective: 1000px;
  }

  .iphone-frame {
    position: relative;
    width: 280px;
    height: 580px;
    background: linear-gradient(145deg, #1a1a1a 0%, #0d0d0d 100%);
    border-radius: 45px;
    padding: 12px;
    box-shadow: 
      0 0 0 1px rgba(255, 255, 255, 0.1),
      0 25px 50px -12px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    .iphone-frame {
      width: 240px;
      height: 500px;
      border-radius: 38px;
    }
  }

  .iphone-notch {
    position: absolute;
    top: 12px;
    left: 50%;
    transform: translateX(-50%);
    width: 120px;
    height: 28px;
    background: #000;
    border-radius: 0 0 20px 20px;
    z-index: 10;
  }

  @media (max-width: 768px) {
    .iphone-notch {
      width: 100px;
      height: 24px;
    }
  }

  .iphone-screen {
    width: 100%;
    height: 100%;
    background: #000;
    border-radius: 35px;
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
    width: 120px;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    .iphone-home-indicator {
      width: 100px;
    }
  }

  .iphone-glow {
    position: absolute;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, rgba(0, 196, 0, 0.2) 0%, transparent 70%);
    border-radius: 50%;
    z-index: -1;
    animation: glowPulse 4s ease-in-out infinite;
  }

  @keyframes glowPulse {
    0%, 100% { opacity: 0.5; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }

  /* Project Info */
  .project-info {
    will-change: transform, opacity;
  }

  @media (max-width: 968px) {
    .project-info {
      text-align: center;
    }
  }

  .project-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    margin-bottom: 1.5rem;
    color: #00c400;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .badge-icon {
    font-size: 1rem;
  }

  .project-name {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 600;
    color: white;
    margin: 0 0 1rem 0;
  }

  .project-description {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  @media (max-width: 768px) {
    .project-description {
      font-size: 1rem;
    }
  }

  .project-features {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 968px) {
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
    stroke: #00c400;
    flex-shrink: 0;
  }

  .project-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.2) 0%, rgba(0, 196, 0, 0.1) 100%);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid rgba(0, 196, 0, 0.4);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .project-cta:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 196, 0, 0.7);
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.3) 0%, rgba(0, 196, 0, 0.15) 100%);
    box-shadow: 0 10px 30px -10px rgba(0, 196, 0, 0.3);
  }

  @media (max-width: 768px) {
    .project-cta:hover {
      transform: none;
    }
  }

  .project-cta svg {
    transition: transform 0.3s ease;
  }

  .project-cta:hover svg {
    transform: translateX(4px);
  }

  /* ==================== Our Story Section ==================== */
  .story-section {
    position: relative;
    min-height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: linear-gradient(180deg, #000000 0%, #0d1a2d 30%, #0a1628 70%, #000000 100%); */
    overflow: hidden;
    padding: 6rem 0;
  }

  /* SVG Background Elements */
  .story-bg-elements {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .circuit-svg {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.6;
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

  .title-underline {
    width: 200px;
    height: 20px;
    margin: 1rem auto 0;
    transform-origin: center;
    transition: transform 0.5s ease-out;
  }

  /* Story Content Grid */
  .story-content {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 4rem;
    align-items: start;
  }

  @media (max-width: 1024px) {
    .story-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  /* Story Text Side */
  .story-text {
    will-change: transform, opacity;
  }

  .story-intro {
    margin-bottom: 3rem;
  }

  .lead-text {
    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
    color: rgba(255, 255, 255, 0.9);
    line-height: 1.7;
    font-weight: 300;
  }

  /* Timeline Styles */
  .timeline {
    position: relative;
    padding-left: 2rem;
  }

  .timeline-line {
    position: absolute;
    left: 0;
    top: 0;
    width: 2px;
    background: linear-gradient(180deg, #00c400, #8a2be2);
    transition: height 0.5s ease-out;
  }

  .timeline-item {
    position: relative;
    padding-bottom: 2rem;
    padding-left: 1.5rem;
    will-change: transform, opacity;
  }

  .timeline-item:last-child {
    padding-bottom: 0;
  }

  .timeline-dot {
    position: absolute;
    left: -2rem;
    top: 0.25rem;
    width: 12px;
    height: 12px;
    background: #0a1628;
    border: 2px solid #00c400;
    border-radius: 50%;
    transform: translateX(-5px);
  }

  .timeline-dot.active {
    background: #00c400;
    box-shadow: 0 0 15px rgba(0, 196, 0, 0.5);
  }

  .timeline-content {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 0.75rem;
    padding: 1.25rem;
    transition: all 0.3s ease;
  }

  .timeline-content:hover {
    background: rgba(255, 255, 255, 0.05);
    border-color: rgba(0, 196, 0, 0.2);
  }

  .timeline-year {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #00c400;
    margin-bottom: 0.5rem;
  }

  .timeline-content h4 {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin: 0 0 0.5rem 0;
  }

  .timeline-content p {
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin: 0;
  }

  /* Media Montage Side */
  .story-media {
    position: relative;
    min-height: 600px;
    will-change: transform, opacity;
    padding-top: 8rem;
  }

  @media (max-width: 1024px) {
    .story-media {
      min-height: 400px;
      padding-top: 0;
    }
  }

  .media-montage {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .media-item {
    position: absolute;
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.5);
    transition: all 0.4s ease;
  }

  .media-item:hover {
    transform: scale(1.02) !important;
    z-index: 10;
  }

  .media-item.main {
    top: 10%;
    left: 5%;
    width: 55%;
    z-index: 3;
  }

  .media-item.secondary-1 {
    top: 5%;
    right: 0;
    width: 38%;
    z-index: 2;
  }

  .media-item.secondary-2 {
    bottom: 10%;
    left: 0;
    width: 35%;
    z-index: 2;
  }

  .media-item.secondary-3 {
    bottom: 0;
    right: 5%;
    width: 32%;
    z-index: 1;
  }

  .media-item.floating-video {
    top: 45%;
    right: 2%;
    width: 28%;
    z-index: 4;
  }

  @media (max-width: 768px) {
    .media-item.main {
      position: relative;
      top: 0;
      left: 0;
      width: 100%;
      margin-bottom: 1rem;
    }

    .media-item.secondary-1,
    .media-item.secondary-2,
    .media-item.secondary-3,
    .media-item.floating-video {
      display: none;
    }

    .media-montage {
      display: flex;
      flex-direction: column;
    }
  }

  .media-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16/10;
    background: #0a1628;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    overflow: hidden;
  }

  .media-frame img,
  .media-frame video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .media-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem 1rem 1rem;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  }

  .media-caption {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
  }

  .corner-accent {
    position: absolute;
    top: -1rem;
    left: -1rem;
    width: 60px;
    height: 60px;
    opacity: 0.6;
  }

  .play-indicator {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    background: rgba(0, 0, 0, 0.5);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .media-item:hover .play-indicator {
    opacity: 1;
  }

  .media-connections {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 0;
  }

  .connection-path {
    transition: stroke-dashoffset 1s ease-out;
  }

  /* Mission Statement */
  .story-mission {
    text-align: center;
    max-width: 800px;
    margin: 5rem auto 0;
    padding: 3rem;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 1rem;
    will-change: transform, opacity;
  }

  .quote-icon {
    width: 40px;
    height: 40px;
    stroke: rgba(0, 196, 0, 0.5);
    margin-bottom: 1.5rem;
  }

  .mission-text {
    font-size: clamp(1.125rem, 2vw, 1.375rem);
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.8;
    font-weight: 300;
    margin: 0 0 1.5rem 0;
  }

  .mission-attribution {
    font-size: 0.875rem;
    color: rgba(0, 196, 0, 0.8);
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .story-section {
      padding: 4rem 0;
    }

    .story-mission {
      margin-top: 3rem;
      padding: 2rem 1.5rem;
    }
  }

  /* ==================== Next Project Section ==================== */
  .next-project-section {
    position: relative;
    min-height: 60vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: linear-gradient(180deg, #000000 0%, #0a1a0a 50%, #0d200d 100%); */
    overflow: hidden;
    padding: 4rem 0;
  }

  .next-project-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .grid-pattern {
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }

  .glow-orb.orb-1 {
    width: 400px;
    height: 400px;
    background: rgba(0, 255, 0, 0.2);
    top: -10%;
    right: 10%;
    animation: floatOrb 20s ease-in-out infinite;
  }

  .glow-orb.orb-2 {
    width: 300px;
    height: 300px;
    background: rgba(0, 200, 0, 0.15);
    bottom: -5%;
    left: 5%;
    animation: floatOrb 15s ease-in-out infinite reverse;
  }

  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -30px); }
  }

  .next-project-container {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    width: 100%;
    padding: 2rem;
  }

  .next-project-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 968px) {
    .next-project-content {
      grid-template-columns: 1fr;
      gap: 3rem;
    }
  }

  .next-project-info {
    will-change: transform, opacity;
  }

  @media (max-width: 968px) {
    .next-project-info {
      text-align: center;
    }
  }

  .coming-soon-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    background: rgba(138, 43, 226, 0.15);
    border: 1px solid rgba(138, 43, 226, 0.4);
    border-radius: 9999px;
    margin-bottom: 1.5rem;
    color: #c4a1ff;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.15em;
  }

  .pulse-ring {
    position: relative;
    width: 8px;
    height: 8px;
    background: #8a2be2;
    border-radius: 50%;
  }

  .pulse-ring::before {
    content: '';
    position: absolute;
    inset: -4px;
    border: 2px solid rgba(138, 43, 226, 0.5);
    border-radius: 50%;
    animation: pulseRing 2s ease-out infinite;
  }

  @keyframes pulseRing {
    0% { transform: scale(1); opacity: 1; }
    100% { transform: scale(2); opacity: 0; }
  }

  .next-project-title {
    margin: 0 0 1.5rem 0;
  }

  .title-prefix {
    display: block;
    font-size: clamp(0.875rem, 2vw, 1rem);
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 0.5rem;
  }

  .title-main {
    display: block;
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 700;
  }

  .green-gradient-text {
    background: linear-gradient(135deg, #00ff00 0%, #90EE90 50%, #00ff00 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: gradientShift 4s ease-in-out infinite;
  }

  .next-project-description {
    font-size: 1.0625rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 500px;
  }

  @media (max-width: 968px) {
    .next-project-description {
      margin-left: auto;
      margin-right: auto;
    }
  }

  .next-project-features {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  @media (max-width: 968px) {
    .next-project-features {
      justify-content: center;
    }
  }

  .np-feature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.875rem;
    transition: all 0.3s ease;
  }

  .np-feature:hover {
    background: rgba(0, 255, 0, 0.15);
    border-color: rgba(0, 255, 0, 0.4);
  }

  .np-feature svg {
    stroke: #00ff00;
  }

  .next-project-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.75rem;
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.3) 0%, rgba(138, 43, 226, 0.15) 100%);
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    border: 1px solid rgba(138, 43, 226, 0.5);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .next-project-cta:hover {
    transform: translateY(-2px);
    border-color: rgba(138, 43, 226, 0.8);
    background: linear-gradient(135deg, rgba(138, 43, 226, 0.4) 0%, rgba(138, 43, 226, 0.2) 100%);
    box-shadow: 0 10px 30px -10px rgba(138, 43, 226, 0.4);
  }

  @media (max-width: 768px) {
    .next-project-cta:hover {
      transform: none;
    }
  }

  .next-project-cta svg {
    transition: transform 0.3s ease;
  }

  .next-project-cta:hover svg {
    transform: translateX(4px);
  }

  /* Visual Side */
  .next-project-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    will-change: transform, opacity;
  }

  @media (max-width: 968px) {
    .next-project-visual {
      order: -1;
    }
  }

  /* Smart Glasses Styles */
  .glasses-container {
    display: flex;
    justify-content: center;
    animation: glassesFloat 4s ease-in-out infinite;
  }

  .smart-glasses {
    width: 320px;
    height: 140px;
    filter: drop-shadow(0 0 25px rgba(0, 255, 0, 0.4));
  }

  @keyframes glassesFloat {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-12px); }
  }

  .visual-ring {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(0, 255, 0, 0.2);
    pointer-events: none;
  }

  .visual-ring.ring-1 {
    width: 120%;
    height: 120%;
    animation: rotateRing 20s linear infinite;
  }

  .visual-ring.ring-2 {
    width: 140%;
    height: 140%;
    border-style: dashed;
    animation: rotateRing 30s linear infinite reverse;
  }

  @keyframes rotateRing {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    .next-project-section {
      min-height: auto;
      padding: 3rem 0;
    }

    .smart-glasses {
      width: 260px;
      height: 110px;
    }

    .visual-ring {
      display: none;
    }
  }

  /* ==================== Blog Section ==================== */
  .blog-section {
    position: relative;
    min-height: 50vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: linear-gradient(180deg, #0d200d 0%, #0a1628 50%, #000000 100%); */
    padding: 4rem 0;
  }

  .blog-container {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    width: 100%;
    padding: 0 2rem;
  }

  .blog-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .blog-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
  }

  @media (max-width: 968px) {
    .blog-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 640px) {
    .blog-section {
      min-height: auto;
      padding: 3rem 0;
    }

    .blog-grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .blog-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .blog-card:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 20px 40px -20px rgba(0, 196, 0, 0.2);
  }

  .blog-image {
    position: relative;
    aspect-ratio: 16 / 9;
    overflow: hidden;
  }

  .blog-image-placeholder {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.1) 0%, rgba(0, 100, 0, 0.15) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: rgba(0, 196, 0, 0.4);
  }

  .blog-category {
    position: absolute;
    top: 1rem;
    left: 1rem;
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

  .blog-content {
    padding: 1.5rem;
  }

  .blog-date {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  .blog-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: white;
    margin: 0.75rem 0;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-excerpt {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin-bottom: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .blog-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #00c400;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .blog-link:hover {
    gap: 0.75rem;
  }

  .blog-link svg {
    transition: transform 0.3s ease;
  }

  .blog-link:hover svg {
    transform: translateX(4px);
  }

  /* ==================== Newsletter Section ==================== */
  .newsletter-section {
    position: relative;
    min-height: 50vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: linear-gradient(180deg, #000000 0%, #0a1628 50%, #0a0a1a 100%); */
    padding: 4rem 0;
    overflow: hidden;
  }

  .newsletter-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .newsletter-glow {
    position: absolute;
    width: 600px;
    height: 600px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(0, 196, 0, 0.08) 0%, transparent 70%);
    border-radius: 50%;
  }

  .newsletter-container {
    position: relative;
    z-index: 10;
    max-width: 600px;
    width: 100%;
    padding: 0 2rem;
  }

  .newsletter-content {
    text-align: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    padding: 3rem 2.5rem;
  }

  @media (max-width: 640px) {
    .newsletter-section {
      min-height: auto;
      padding: 3rem 0;
    }

    .newsletter-content {
      padding: 2rem 1.5rem;
    }
  }

  .newsletter-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 50%;
    margin-bottom: 1.5rem;
    color: #00c400;
  }

  .newsletter-title {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    color: white;
    margin: 0 0 1rem 0;
  }

  .newsletter-description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 450px;
    margin-left: auto;
    margin-right: auto;
  }

  .newsletter-form-wrapper {
    max-width: 400px;
    margin: 0 auto 1.5rem;
  }

  .newsletter-form-wrapper :global(.newsletter-form.stacked) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .newsletter-privacy {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
    margin: 0;
  }

  /* ==================== Jobs Section ==================== */
  .jobs-section {
    position: relative;
    min-height: 50vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    /* background: linear-gradient(180deg, #0a0a1a 0%, #0a1628 50%, #000000 100%); */
    padding: 4rem 0;
  }

  .jobs-container {
    position: relative;
    z-index: 10;
    max-width: 900px;
    width: 100%;
    padding: 0 2rem;
  }

  .jobs-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .jobs-subtitle {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 500px;
    margin: 1rem auto 0;
    line-height: 1.6;
  }

  .jobs-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    .jobs-section {
      min-height: auto;
      padding: 3rem 0;
    }

    .jobs-grid {
      grid-template-columns: 1fr;
    }
  }

  .job-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    padding: 1.75rem;
    transition: all 0.3s ease;
  }

  .job-card:hover {
    transform: translateY(-4px);
    border-color: rgba(0, 196, 0, 0.3);
    box-shadow: 0 20px 40px -20px rgba(0, 196, 0, 0.15);
  }

  .job-icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }

  .job-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .job-department,
  .job-type {
    font-size: 0.6875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
  }

  .job-department {
    background: rgba(0, 196, 0, 0.15);
    color: #00c400;
    border: 1px solid rgba(0, 196, 0, 0.3);
  }

  .job-type {
    background: rgba(138, 43, 226, 0.15);
    color: #c4a1ff;
    border: 1px solid rgba(138, 43, 226, 0.3);
  }

  .job-title {
    font-size: 1.25rem;
    font-weight: 400;
    color: white;
    margin: 0 0 0.75rem 0;
  }

  .job-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1rem;
  }

  .job-location svg {
    stroke: rgba(255, 255, 255, 0.4);
  }

  .job-description {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin-bottom: 1.5rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .job-apply-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #00c400;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .job-apply-btn:hover {
    gap: 0.75rem;
  }

  .job-apply-btn svg {
    transition: transform 0.3s ease;
  }

  .job-apply-btn:hover svg {
    transform: translateX(4px);
  }

  .jobs-cta {
    text-align: center;
    margin-top: 2.5rem;
  }

  .view-all-jobs {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.875rem 1.75rem;
    background: rgba(0, 196, 0, 0.1);
    color: white;
    font-weight: 600;
    font-size: 0.9375rem;
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .view-all-jobs:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 196, 0, 0.6);
    background: rgba(0, 196, 0, 0.15);
    box-shadow: 0 10px 30px -10px rgba(0, 196, 0, 0.3);
  }

  .view-all-jobs svg {
    transition: transform 0.3s ease;
  }

  .view-all-jobs:hover svg {
    transform: translateX(4px);
  }

  /* ==================== Contact Section ==================== */
  .contact-section {
    position: relative;
    width: 100%;
    /* background: linear-gradient(180deg, #000000 0%, #0a1628 50%, #000000 100%); */
    padding: 4rem 0;
  }

  .contact-container {
    position: relative;
    z-index: 10;
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
  }

  @media (max-width: 640px) {
    .contact-section {
      padding: 3rem 0;
    }
  }
</style>