<script lang='ts'>
  import { onMount } from 'svelte';

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = 0;
  let heroSection: HTMLElement;
  let projectSection: HTMLElement;
  let projectVideo: HTMLVideoElement;
  let windowWidth = 0;
  let windowHeight = 0;
  
  // Scroll animation state for project section
  let projectAnimationProgress = 0;

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

  <!-- Most Recent Project Section -->
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
            class="w-10 lg:w-20 drop-shadow-2xl" 
            alt="Cosmic Collisions Logo"
          >
          
          <h3 class="text-4xl gold-header-text">Cosmic Collisions</h3>
          
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

  <!-- Our Story -->

  <!-- Our Next Project -->

  <!-- Blog Section -->

  <!-- Newsletter -->

  <!-- Job Postings -->

  <!-- Contact Us -->
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
    background: radial-gradient(ellipse at 50% 50%, #0a1628 0%, #000000 100%);
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
    background: linear-gradient(180deg, #000000 0%, #0a1628 50%, #000000 100%);
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
</style>