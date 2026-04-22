<script lang="ts">
  export let animationProgress = 0;
  export let nextProjectSection: HTMLElement | undefined = undefined;
</script>

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
    <div class="glow-orb orb-1" style="opacity: {animationProgress * 0.5};"></div>
    <div class="glow-orb orb-2" style="opacity: {animationProgress * 0.3};"></div>
  </div>

  <div class="next-project-container">
    <div class="next-project-content">
      <!-- Left Side - Text -->
      <div 
        class="next-project-info"
        style="
          opacity: {animationProgress};
          transform: translateX({(1 - animationProgress) * -60}px);
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
          opacity: {animationProgress};
          transform: translateX({(1 - animationProgress) * 60}px) scale({0.9 + animationProgress * 0.1});
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
              <linearGradient id="bridgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#8a2be2" />
                <stop offset="50%" stop-color="#cc1a1a" />
                <stop offset="100%" stop-color="#00c400" />
              </linearGradient>
            </defs>
            
            <!-- Left Lens Frame — Purple -->
            <rect x="10" y="20" width="70" height="40" rx="8" fill="none" stroke="#8a2be2" stroke-width="2" filter="url(#glassesGlow)" />
            <!-- Left Lens -->
            <rect x="14" y="24" width="62" height="32" rx="6" fill="rgba(138, 43, 226, 0.1)" stroke="rgba(138, 43, 226, 0.5)" stroke-width="1" />
            <!-- Left Lens Reflection -->
            <path d="M20 28 L30 28 L25 35 Z" fill="rgba(138, 43, 226, 0.3)" />
            
            <!-- Right Lens Frame — Green -->
            <rect x="120" y="20" width="70" height="40" rx="8" fill="none" stroke="#00c400" stroke-width="2" filter="url(#glassesGlow)" />
            <!-- Right Lens -->
            <rect x="124" y="24" width="62" height="32" rx="6" fill="rgba(0, 196, 0, 0.1)" stroke="rgba(0, 196, 0, 0.5)" stroke-width="1" />
            <!-- Right Lens Reflection -->
            <path d="M130 28 L140 28 L135 35 Z" fill="rgba(0, 196, 0, 0.3)" />
            
            <!-- Bridge — Purple → Red → Green gradient -->
            <path d="M80 35 Q100 25 120 35" fill="none" stroke="url(#bridgeGradient)" stroke-width="4" />
            
            <!-- Left Temple Arm — Purple -->
            <path d="M10 30 L0 28 Q-5 27 -5 32 L-5 35" fill="none" stroke="#8a2be2" stroke-width="3" />
            
            <!-- Right Temple Arm — Green -->
            <path d="M190 30 L200 28 Q205 27 205 32 L205 35" fill="none" stroke="#00c400" stroke-width="3" />
            
            <!-- Tech Details - Left — Red indicator dot -->
            <circle cx="25" cy="55" r="3" fill="#cc1a1a">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
            </circle>
            <rect x="60" y="52" width="15" height="6" rx="2" fill="rgba(138, 43, 226, 0.6)" />
            
            <!-- Tech Details - Right — Red indicator dot -->
            <circle cx="175" cy="55" r="3" fill="#cc1a1a">
              <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.5s" />
            </circle>
            <rect x="125" y="52" width="15" height="6" rx="2" fill="rgba(0, 196, 0, 0.6)" />
            
            <!-- HUD Elements (animated) — Left: Purple, Right: Green -->
            <g class="hud-elements" opacity="0.7">
              <rect x="20" y="32" width="20" height="2" rx="1" fill="#8a2be2">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" />
              </rect>
              <rect x="20" y="38" width="15" height="2" rx="1" fill="#8a2be2">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="0.5s" />
              </rect>
              <rect x="20" y="44" width="25" height="2" rx="1" fill="#8a2be2">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="1s" />
              </rect>
              
              <rect x="155" y="32" width="20" height="2" rx="1" fill="#00c400">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="1.5s" />
              </rect>
              <rect x="160" y="38" width="15" height="2" rx="1" fill="#00c400">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="2s" />
              </rect>
              <rect x="150" y="44" width="25" height="2" rx="1" fill="#00c400">
                <animate attributeName="opacity" values="0.7;0.3;0.7" dur="3s" repeatCount="indefinite" begin="2.5s" />
              </rect>
            </g>
            
            <!-- Scanning line — Left: Purple, Right: Green -->
            <rect x="14" y="24" width="62" height="2" rx="1" fill="rgba(138, 43, 226, 0.5)">
              <animate attributeName="y" values="24;52;24" dur="2s" repeatCount="indefinite" />
            </rect>
            <rect x="124" y="24" width="62" height="2" rx="1" fill="rgba(0, 196, 0, 0.5)">
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

<style>
  /* Next Project Section */
  .next-project-section {
    position: relative;
    min-height: 80vh;
    padding: 6rem 2rem;
    display: flex;
    align-items: center;
    overflow: hidden;
    background: linear-gradient(180deg, transparent 0%, rgba(0, 20, 0, 0.3) 50%, transparent 100%);
  }

  @media (max-width: 768px) {
    .next-project-section {
      padding: 4rem 1rem;
      min-height: auto;
    }
  }

  .next-project-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.5;
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
  }

  .orb-1 {
    width: 400px;
    height: 400px;
    background: rgba(0, 196, 0, 0.3);
    left: -10%;
    top: 20%;
    animation: orbFloat 8s ease-in-out infinite;
  }

  .orb-2 {
    width: 300px;
    height: 300px;
    background: rgba(138, 43, 226, 0.2);
    right: -5%;
    bottom: 10%;
    animation: orbFloat 10s ease-in-out infinite reverse;
  }

  @keyframes orbFloat {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -30px); }
  }

  .next-project-container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .next-project-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
  }

  @media (max-width: 1024px) {
    .next-project-content {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
  }

  .next-project-info {
    will-change: opacity, transform;
  }

  .next-project-title {
    margin-bottom: 1.5rem;
  }

  .title-prefix {
    display: block;
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.5);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 0.5rem;
  }

  .title-main {
    display: block;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 400;
    line-height: 1.1;
  }

  .next-project-description {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.7;
    max-width: 500px;
  }

  @media (max-width: 1024px) {
    .next-project-description {
      margin: 0 auto;
    }
  }

  /* Smart Glasses Visual */
  .next-project-visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    will-change: opacity, transform;
  }

  .glasses-container {
    position: relative;
    z-index: 2;
  }

  .smart-glasses {
    width: 100%;
    max-width: 400px;
    height: auto;
    filter: drop-shadow(0 0 12px rgba(138, 43, 226, 0.4)) drop-shadow(0 0 20px rgba(0, 196, 0, 0.2));
  }

  @media (max-width: 768px) {
    .smart-glasses {
      max-width: 280px;
    }
  }

  .visual-ring {
    position: absolute;
    border: 1px solid rgba(138, 43, 226, 0.2);
    border-radius: 50%;
    animation: ringPulse 4s ease-in-out infinite;
  }

  .ring-1 {
    width: 300px;
    height: 300px;
    animation-delay: 0s;
    border-color: rgba(138, 43, 226, 0.2);
  }

  .ring-2 {
    width: 400px;
    height: 400px;
    animation-delay: 2s;
    border-color: rgba(0, 196, 0, 0.15);
  }

  @keyframes ringPulse {
    0%, 100% { 
      transform: scale(0.8);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
  }

</style>
