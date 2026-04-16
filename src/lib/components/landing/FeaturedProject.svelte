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
  
  <!-- Floating Cosmic Shapes -->
  <div class="floating-shapes">
    <!-- 4-Point Star -->
    <svg class="shape shape-1" viewBox="0 0 100 100" fill="none">
      <path d="M50,5 L55,45 L95,50 L55,55 L50,95 L45,55 L5,50 L45,45 Z" stroke="rgba(0, 196, 0, 0.2)" stroke-width="1.5" fill="none"/>
    </svg>
    
    <!-- Planet with Ring -->
    <svg class="shape shape-2" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="25" stroke="rgba(147, 51, 234, 0.2)" stroke-width="2" fill="rgba(147, 51, 234, 0.03)"/>
      <ellipse cx="50" cy="50" rx="45" ry="12" stroke="rgba(147, 51, 234, 0.15)" stroke-width="1.5" fill="none" transform="rotate(-20 50 50)"/>
    </svg>
    
    <!-- Comet -->
    <svg class="shape shape-3" viewBox="0 0 100 100" fill="none">
      <circle cx="75" cy="30" r="8" stroke="rgba(0, 196, 0, 0.25)" stroke-width="2" fill="rgba(0, 196, 0, 0.05)"/>
      <path d="M70,35 Q40,50 10,80" stroke="rgba(0, 196, 0, 0.15)" stroke-width="2" stroke-linecap="round"/>
      <path d="M68,38 Q35,55 5,75" stroke="rgba(0, 196, 0, 0.08)" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    
    <!-- Crescent Moon -->
    <svg class="shape shape-4" viewBox="0 0 100 100" fill="none">
      <path d="M60,15 A35,35 0 1,1 60,85 A28,28 0 1,0 60,15" stroke="rgba(147, 51, 234, 0.2)" stroke-width="2" fill="rgba(147, 51, 234, 0.03)"/>
    </svg>
    
    <!-- Twinkling Star (small) -->
    <svg class="shape shape-5" viewBox="0 0 100 100" fill="none">
      <path d="M50,20 L53,47 L80,50 L53,53 L50,80 L47,53 L20,50 L47,47 Z" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1" fill="none"/>
    </svg>
    
    <!-- Orbit Path -->
    <svg class="shape shape-6" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="40" ry="20" stroke="rgba(147, 51, 234, 0.12)" stroke-width="1" stroke-dasharray="6 4" fill="none"/>
      <circle cx="85" cy="58" r="4" fill="rgba(147, 51, 234, 0.2)"/>
    </svg>
    
    <!-- Galaxy Spiral -->
    <svg class="shape shape-7" viewBox="0 0 100 100" fill="none">
      <path d="M50,50 Q60,30 80,35 Q90,50 75,65 Q55,75 45,60 Q35,45 50,35 Q65,25 75,40" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1.5" fill="none"/>
      <circle cx="50" cy="50" r="5" fill="rgba(0, 196, 0, 0.15)"/>
    </svg>
    
    <!-- Asteroid -->
    <svg class="shape shape-8" viewBox="0 0 100 100" fill="none">
      <path d="M30,50 Q25,30 45,25 Q70,20 80,40 Q85,60 70,75 Q50,85 35,70 Q20,60 30,50" stroke="rgba(0, 196, 0, 0.15)" stroke-width="2" fill="none"/>
      <circle cx="55" cy="40" r="3" fill="rgba(0, 196, 0, 0.1)"/>
      <circle cx="65" cy="55" r="2" fill="rgba(0, 196, 0, 0.08)"/>
    </svg>
    
    <!-- 6-Point Star -->
    <svg class="shape shape-9" viewBox="0 0 100 100" fill="none">
      <polygon points="50,10 58,40 88,40 64,58 72,88 50,70 28,88 36,58 12,40 42,40" stroke="rgba(147, 51, 234, 0.12)" stroke-width="1.5" fill="none"/>
    </svg>
    
    <!-- Satellite -->
    <svg class="shape shape-10" viewBox="0 0 100 100" fill="none">
      <rect x="40" y="45" width="20" height="10" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1.5" fill="none"/>
      <rect x="20" y="42" width="20" height="16" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1" fill="none"/>
      <rect x="60" y="42" width="20" height="16" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1" fill="none"/>
      <line x1="50" y1="45" x2="50" y2="35" stroke="rgba(0, 196, 0, 0.1)" stroke-width="1"/>
    </svg>
    
    <!-- Nebula Cloud -->
    <svg class="shape shape-11" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="35" ry="25" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1" fill="rgba(147, 51, 234, 0.02)"/>
      <ellipse cx="40" cy="45" rx="20" ry="15" stroke="rgba(147, 51, 234, 0.08)" stroke-width="1" fill="none"/>
      <ellipse cx="60" cy="55" rx="18" ry="12" stroke="rgba(0, 196, 0, 0.08)" stroke-width="1" fill="none"/>
    </svg>
    
    <!-- Rocket -->
    <svg class="shape shape-12" viewBox="0 0 100 100" fill="none">
      <path d="M50,15 Q65,30 65,55 L55,70 L50,65 L45,70 L35,55 Q35,30 50,15" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1.5" fill="none"/>
      <circle cx="50" cy="40" r="5" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1" fill="none"/>
      <path d="M45,70 L50,85 L55,70" stroke="rgba(147, 51, 234, 0.12)" stroke-width="1.5" fill="none"/>
    </svg>
    
    <!-- Constellation Pattern -->
    <svg class="shape shape-13" viewBox="0 0 100 100" fill="none">
      <circle cx="20" cy="30" r="3" fill="rgba(147, 51, 234, 0.2)"/>
      <circle cx="50" cy="20" r="2" fill="rgba(147, 51, 234, 0.15)"/>
      <circle cx="80" cy="35" r="3" fill="rgba(147, 51, 234, 0.2)"/>
      <circle cx="60" cy="60" r="2" fill="rgba(147, 51, 234, 0.15)"/>
      <circle cx="30" cy="70" r="3" fill="rgba(147, 51, 234, 0.2)"/>
      <line x1="20" y1="30" x2="50" y2="20" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1"/>
      <line x1="50" y1="20" x2="80" y2="35" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1"/>
      <line x1="80" y1="35" x2="60" y2="60" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1"/>
      <line x1="60" y1="60" x2="30" y2="70" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1"/>
    </svg>
    
    <!-- PROMINENT: Large Planet with Rings -->
    <svg class="shape shape-14 shape-prominent" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke="rgba(0, 196, 0, 0.4)" stroke-width="2" fill="rgba(0, 196, 0, 0.05)"/>
      <ellipse cx="50" cy="50" rx="48" ry="15" stroke="rgba(0, 196, 0, 0.25)" stroke-width="2" fill="none" transform="rotate(-25 50 50)"/>
      <ellipse cx="50" cy="50" rx="42" ry="10" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1" fill="none" transform="rotate(-25 50 50)"/>
    </svg>
    
    <!-- Shooting Star (small) -->
    <svg class="shape shape-15" viewBox="0 0 100 100" fill="none">
      <path d="M80,20 L20,80" stroke="rgba(147, 51, 234, 0.15)" stroke-width="2" stroke-linecap="round"/>
      <path d="M75,25 L25,75" stroke="rgba(147, 51, 234, 0.08)" stroke-width="1" stroke-linecap="round"/>
      <circle cx="80" cy="20" r="4" fill="rgba(147, 51, 234, 0.2)"/>
    </svg>
    
    <!-- PROMINENT: Supernova -->
    <svg class="shape shape-16 shape-prominent" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="15" stroke="rgba(147, 51, 234, 0.5)" stroke-width="2" fill="rgba(147, 51, 234, 0.1)"/>
      <circle cx="50" cy="50" r="25" stroke="rgba(147, 51, 234, 0.25)" stroke-width="1" fill="none"/>
      <circle cx="50" cy="50" r="35" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1" fill="none"/>
      <path d="M50,10 L50,5 M50,90 L50,95 M10,50 L5,50 M90,50 L95,50 M22,22 L17,17 M78,78 L83,83 M78,22 L83,17 M22,78 L17,83" stroke="rgba(147, 51, 234, 0.3)" stroke-width="2" stroke-linecap="round"/>
    </svg>
    
    <!-- Small Moon -->
    <svg class="shape shape-17" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="20" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1.5" fill="none"/>
      <circle cx="42" cy="45" r="4" stroke="rgba(0, 196, 0, 0.08)" stroke-width="1" fill="none"/>
      <circle cx="58" cy="55" r="3" stroke="rgba(0, 196, 0, 0.08)" stroke-width="1" fill="none"/>
    </svg>
    
    <!-- PROMINENT: Galaxy -->
    <svg class="shape shape-18 shape-prominent" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="40" ry="20" stroke="rgba(0, 196, 0, 0.3)" stroke-width="2" fill="rgba(0, 196, 0, 0.03)" transform="rotate(-30 50 50)"/>
      <ellipse cx="50" cy="50" rx="30" ry="12" stroke="rgba(0, 196, 0, 0.2)" stroke-width="1.5" fill="none" transform="rotate(-30 50 50)"/>
      <ellipse cx="50" cy="50" rx="18" ry="6" stroke="rgba(147, 51, 234, 0.25)" stroke-width="1" fill="none" transform="rotate(-30 50 50)"/>
      <circle cx="50" cy="50" r="6" fill="rgba(0, 196, 0, 0.2)"/>
    </svg>
    
    <!-- Binary Stars -->
    <svg class="shape shape-19" viewBox="0 0 100 100" fill="none">
      <circle cx="35" cy="50" r="12" stroke="rgba(147, 51, 234, 0.15)" stroke-width="1.5" fill="rgba(147, 51, 234, 0.03)"/>
      <circle cx="65" cy="50" r="8" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1.5" fill="rgba(0, 196, 0, 0.03)"/>
      <ellipse cx="50" cy="50" rx="30" ry="8" stroke="rgba(147, 51, 234, 0.08)" stroke-width="1" stroke-dasharray="4 3" fill="none"/>
    </svg>
    
    <!-- UFO -->
    <svg class="shape shape-20" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="55" rx="30" ry="8" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1.5" fill="none"/>
      <path d="M35,55 Q35,40 50,35 Q65,40 65,55" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1.5" fill="none"/>
      <circle cx="50" cy="42" r="6" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1" fill="none"/>
    </svg>
    
    <!-- PROMINENT: Cosmic Starburst -->
    <svg class="shape shape-21 shape-prominent" viewBox="0 0 100 100" fill="none">
      <path d="M50,5 L54,42 L90,30 L58,48 L95,50 L58,52 L90,70 L54,58 L50,95 L46,58 L10,70 L42,52 L5,50 L42,48 L10,30 L46,42 Z" stroke="rgba(147, 51, 234, 0.4)" stroke-width="1.5" fill="rgba(147, 51, 234, 0.05)"/>
      <circle cx="50" cy="50" r="8" fill="rgba(147, 51, 234, 0.15)"/>
    </svg>
    
    <!-- Space Station -->
    <svg class="shape shape-22" viewBox="0 0 100 100" fill="none">
      <rect x="35" y="45" width="30" height="10" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1.5" fill="none"/>
      <rect x="15" y="40" width="15" height="20" stroke="rgba(0, 196, 0, 0.1)" stroke-width="1" fill="none"/>
      <rect x="70" y="40" width="15" height="20" stroke="rgba(0, 196, 0, 0.1)" stroke-width="1" fill="none"/>
      <circle cx="50" cy="50" r="3" fill="rgba(0, 196, 0, 0.15)"/>
    </svg>
    
    <!-- Wormhole -->
    <svg class="shape shape-23" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="35" ry="35" stroke="rgba(147, 51, 234, 0.08)" stroke-width="1" fill="none"/>
      <ellipse cx="50" cy="50" rx="28" ry="28" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1" fill="none"/>
      <ellipse cx="50" cy="50" rx="20" ry="20" stroke="rgba(147, 51, 234, 0.12)" stroke-width="1" fill="none"/>
      <ellipse cx="50" cy="50" rx="12" ry="12" stroke="rgba(147, 51, 234, 0.15)" stroke-width="1.5" fill="rgba(147, 51, 234, 0.03)"/>
    </svg>
  </div>
  
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
              preload="none"
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
          class="w-32 lg:w-30 mx-auto lg:mx-0 drop-shadow-2xl" 
          alt="Cosmic Collisions Logo"
          loading="lazy"
          decoding="async"
          width="128"
          height="128"
        >
        
        <h3 class="lg:text-6xl gradient-text">Cosmic Collisions</h3>
        
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
  /* Featured Project Section - Performance Optimized */
  .project-section {
    position: relative;
    min-height: 100vh;
    padding: 6rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    contain: layout paint;
    isolation: isolate;
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

  /* Floating Shapes - GPU Optimized */
  .floating-shapes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    contain: strict;
    z-index: 0;
  }

  .shape {
    position: absolute;
    opacity: 0.6;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .shape-1 {
    width: 80px;
    height: 80px;
    top: 10%;
    left: 5%;
    animation: float-1 20s ease-in-out infinite, spin-slow 30s linear infinite;
  }

  .shape-2 {
    width: 120px;
    height: 120px;
    top: 15%;
    right: 8%;
    animation: float-2 25s ease-in-out infinite;
  }

  .shape-3 {
    width: 60px;
    height: 60px;
    bottom: 20%;
    left: 10%;
    animation: float-3 18s ease-in-out infinite, spin-slow 25s linear infinite reverse;
  }

  .shape-4 {
    width: 100px;
    height: 100px;
    bottom: 15%;
    right: 5%;
    animation: float-1 22s ease-in-out infinite reverse;
  }

  .shape-5 {
    width: 40px;
    height: 40px;
    top: 40%;
    left: 3%;
    animation: float-2 15s ease-in-out infinite;
  }

  .shape-6 {
    width: 50px;
    height: 50px;
    top: 60%;
    right: 12%;
    animation: float-3 20s ease-in-out infinite, spin-slow 40s linear infinite;
  }

  .shape-7 {
    width: 70px;
    height: 70px;
    bottom: 35%;
    right: 20%;
    animation: float-1 17s ease-in-out infinite;
  }

  .shape-8 {
    width: 55px;
    height: 55px;
    top: 25%;
    left: 15%;
    animation: float-2 19s ease-in-out infinite, spin-slow 35s linear infinite;
  }

  .shape-9 {
    width: 45px;
    height: 45px;
    top: 8%;
    right: 25%;
    animation: float-3 16s ease-in-out infinite;
  }

  .shape-10 {
    width: 90px;
    height: 90px;
    bottom: 8%;
    left: 25%;
    animation: float-1 24s ease-in-out infinite reverse, spin-slow 50s linear infinite;
  }

  .shape-11 {
    width: 65px;
    height: 65px;
    top: 50%;
    right: 3%;
    animation: float-2 21s ease-in-out infinite;
  }

  .shape-12 {
    width: 50px;
    height: 50px;
    bottom: 45%;
    left: 8%;
    animation: float-3 23s ease-in-out infinite, spin-slow 45s linear infinite reverse;
  }

  .shape-13 {
    width: 35px;
    height: 35px;
    top: 70%;
    right: 30%;
    animation: float-1 14s ease-in-out infinite, spin-slow 20s linear infinite;
  }

  /* PROMINENT: Large Triangle */
  .shape-14 {
    width: 140px;
    height: 140px;
    top: 5%;
    left: 8%;
    animation: float-2 28s ease-in-out infinite, spin-slow 60s linear infinite;
  }

  .shape-15 {
    width: 30px;
    height: 30px;
    top: 35%;
    right: 15%;
    animation: float-3 13s ease-in-out infinite;
  }

  /* PROMINENT: Glowing Circle */
  .shape-16 {
    width: 120px;
    height: 120px;
    bottom: 10%;
    right: 8%;
    animation: float-1 26s ease-in-out infinite reverse;
  }

  .shape-17 {
    width: 25px;
    height: 25px;
    top: 55%;
    left: 5%;
    animation: float-2 11s ease-in-out infinite, spin-slow 15s linear infinite;
  }

  /* PROMINENT: Large Hexagon */
  .shape-18 {
    width: 130px;
    height: 130px;
    top: 20%;
    right: 3%;
    animation: float-3 30s ease-in-out infinite, spin-slow 70s linear infinite reverse;
  }

  .shape-19 {
    width: 50px;
    height: 50px;
    bottom: 25%;
    left: 18%;
    animation: float-1 18s ease-in-out infinite, spin-slow 25s linear infinite;
  }

  .shape-20 {
    width: 40px;
    height: 40px;
    top: 75%;
    left: 12%;
    animation: float-2 15s ease-in-out infinite;
  }

  /* PROMINENT: Star Burst */
  .shape-21 {
    width: 110px;
    height: 110px;
    bottom: 5%;
    left: 5%;
    animation: float-3 32s ease-in-out infinite, spin-slow 55s linear infinite;
  }

  .shape-22 {
    width: 35px;
    height: 35px;
    top: 45%;
    right: 25%;
    animation: float-1 12s ease-in-out infinite;
  }

  .shape-23 {
    width: 55px;
    height: 55px;
    bottom: 40%;
    right: 12%;
    animation: float-2 20s ease-in-out infinite, spin-slow 40s linear infinite reverse;
  }

  /* Prominent shape glow effect */
  .shape-prominent {
    filter: drop-shadow(0 0 15px currentColor);
  }

  @keyframes float-1 {
    0%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(15px, -20px);
    }
    50% {
      transform: translate(-10px, -35px);
    }
    75% {
      transform: translate(20px, -15px);
    }
  }

  @keyframes float-2 {
    0%, 100% {
      transform: translate(0, 0);
    }
    33% {
      transform: translate(-20px, 25px);
    }
    66% {
      transform: translate(15px, -20px);
    }
  }

  @keyframes float-3 {
    0%, 100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(25px, 10px);
    }
    40% {
      transform: translate(-15px, 30px);
    }
    60% {
      transform: translate(10px, -25px);
    }
    80% {
      transform: translate(-20px, 5px);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .shape {
      opacity: 0.4;
    }
    .shape-1, .shape-3, .shape-5, .shape-8, .shape-10, .shape-12, .shape-15, .shape-17, .shape-19, .shape-20, .shape-22 {
      display: none;
    }
    .shape-2 {
      width: 80px;
      height: 80px;
    }
    .shape-4 {
      width: 60px;
      height: 60px;
    }
    .shape-9, .shape-11, .shape-13, .shape-23 {
      opacity: 0.3;
    }
    /* Keep prominent shapes visible but smaller on mobile */
    .shape-prominent {
      opacity: 0.5;
    }
    .shape-14 {
      width: 80px;
      height: 80px;
      top: 3%;
      left: 5%;
    }
    .shape-16 {
      width: 70px;
      height: 70px;
      bottom: 8%;
      right: 5%;
    }
    .shape-18 {
      width: 75px;
      height: 75px;
      top: 15%;
      right: 2%;
    }
    .shape-21 {
      width: 65px;
      height: 65px;
      bottom: 3%;
      left: 3%;
    }
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

</style>
