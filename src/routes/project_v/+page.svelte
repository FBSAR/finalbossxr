<script lang="ts">
  import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
  // import KickstarterPromo from '$lib/components/landing/KickstarterPromo.svelte';
  import { navigating } from '$app/stores';

  // Loading state for navigation
  $: isLoading = $navigating !== null;
</script>

<main>
  <div class="coming-soon-container">
    <div class="coming-soon-content">
      {#if isLoading}
        <!-- Skeleton Loading State -->
        <div class="skeleton-glasses"></div>
        <div class="skeleton-text skeleton-title"></div>
        <div class="skeleton-divider"></div>
        <div class="skeleton-text skeleton-message"></div>
        <div class="skeleton-text skeleton-subtitle"></div>
        
        <div class="newsletter-container">
          <div class="skeleton-text skeleton-header"></div>
          <div class="skeleton-input"></div>
          <div class="skeleton-input"></div>
          <div class="skeleton-button"></div>
        </div>
      {:else}
        <!-- Smart Glasses SVG -->
        <div class="glasses-container">
          <svg class="smart-glasses" viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <!-- Left Lens Frame -->
            <rect x="10" y="20" width="70" height="40" rx="8" class="lens-frame"/>
            <!-- Left Lens -->
            <rect x="14" y="24" width="62" height="32" rx="6" class="lens"/>
            <!-- Left Lens Reflection -->
            <path d="M20 28 L30 28 L25 35 Z" class="lens-reflection"/>
            
            <!-- Right Lens Frame -->
            <rect x="120" y="20" width="70" height="40" rx="8" class="lens-frame"/>
            <!-- Right Lens -->
            <rect x="124" y="24" width="62" height="32" rx="6" class="lens"/>
            <!-- Right Lens Reflection -->
            <path d="M130 28 L140 28 L135 35 Z" class="lens-reflection"/>
            
            <!-- Bridge -->
            <path d="M80 35 Q100 25 120 35" stroke-width="4" class="bridge"/>
            
            <!-- Left Temple Arm -->
            <path d="M10 30 L0 28 Q-5 27 -5 32 L-5 35" stroke-width="3" class="temple-arm"/>
            
            <!-- Right Temple Arm -->
            <path d="M190 30 L200 28 Q205 27 205 32 L205 35" stroke-width="3" class="temple-arm"/>
            
            <!-- Tech Details - Left -->
            <circle cx="25" cy="55" r="3" class="tech-dot"/>
            <rect x="60" y="52" width="15" height="6" rx="2" class="tech-strip"/>
            
            <!-- Tech Details - Right -->
            <circle cx="175" cy="55" r="3" class="tech-dot"/>
            <rect x="125" y="52" width="15" height="6" rx="2" class="tech-strip"/>
            
            <!-- HUD Elements (animated) -->
            <g class="hud-elements">
              <rect x="20" y="32" width="20" height="2" rx="1" class="hud-line"/>
              <rect x="20" y="38" width="15" height="2" rx="1" class="hud-line"/>
              <rect x="20" y="44" width="25" height="2" rx="1" class="hud-line"/>
              
              <rect x="155" y="32" width="20" height="2" rx="1" class="hud-line"/>
              <rect x="160" y="38" width="15" height="2" rx="1" class="hud-line"/>
              <rect x="150" y="44" width="25" height="2" rx="1" class="hud-line"/>
            </g>
          </svg>
        </div>
      <h1 class="coming-soon-title gradient-text">#PROJECT_V</h1>
      <div class="coming-soon-divider"></div>
      <p class="coming-soon-message gold-header-text">Coming Soon</p>
      <p class="coming-soon-subtitle">Our most ambitious project yet.</p>
      
      <div class="newsletter-container">
        <h3 class="newsletter-header">Subscribe to Newsletter</h3>
        <NewsletterSignup variant="stacked" placeholder="Enter your email" buttonText="Subscribe" showName={true} />
      </div>
      {/if}
    </div>
  </div>

  <!-- Kickstarter Promo -->
  <!-- <KickstarterPromo /> -->
</main>

<style>
  .coming-soon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 10rem);
    padding: 2rem;
  }

  .coming-soon-content {
    text-align: center;
    max-width: 600px;
  }

  /* Smart Glasses Styles */
  .glasses-container {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    animation: float 4s ease-in-out infinite;
  }

  .smart-glasses {
    width: 280px;
    height: 120px;
    filter: drop-shadow(0 0 20px rgba(0, 255, 0, 0.3));
  }

  .lens-frame {
    fill: none;
    stroke: #00ff00;
    stroke-width: 2;
  }

  .lens {
    fill: rgba(0, 255, 0, 0.1);
    stroke: rgba(0, 255, 0, 0.5);
    stroke-width: 1;
  }

  .lens-reflection {
    fill: rgba(0, 255, 0, 0.3);
  }

  .bridge {
    fill: none;
    stroke: #00ff00;
  }

  .temple-arm {
    fill: none;
    stroke: #00ff00;
  }

  .tech-dot {
    fill: #00ff00;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  .tech-strip {
    fill: rgba(0, 255, 0, 0.6);
  }

  .hud-elements {
    opacity: 0.7;
  }

  .hud-line {
    fill: #00ff00;
    animation: hud-flicker 3s ease-in-out infinite;
  }

  .hud-line:nth-child(2) {
    animation-delay: 0.5s;
  }

  .hud-line:nth-child(3) {
    animation-delay: 1s;
  }

  .hud-line:nth-child(4) {
    animation-delay: 1.5s;
  }

  .hud-line:nth-child(5) {
    animation-delay: 2s;
  }

  .hud-line:nth-child(6) {
    animation-delay: 2.5s;
  }

  @keyframes float {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }

  @keyframes pulse-glow {
    0%, 100% {
      opacity: 1;
      filter: drop-shadow(0 0 3px #00ff00);
    }
    50% {
      opacity: 0.6;
      filter: drop-shadow(0 0 8px #00ff00);
    }
  }

  @keyframes hud-flicker {
    0%, 100% {
      opacity: 0.7;
    }
    50% {
      opacity: 0.3;
    }
  }

  .coming-soon-title {
    font-family: "Jersey 10", sans-serif;
    font-size: 5rem;
    color: #00ff00;
    text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
    margin-bottom: 1rem;
    letter-spacing: 0.5rem;
  }

  .coming-soon-divider {
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    margin: 2rem auto;
  }

  .coming-soon-message {
    font-family: "Raleway", sans-serif;
    font-size: 2rem;
    font-weight: 300;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.3rem;
  }

  .coming-soon-subtitle {
    font-family: "Raleway", sans-serif;
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }

  .newsletter-container {
    margin-top: 2.5rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .newsletter-header {
    font-family: "Raleway", sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #00ff00;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
    margin-bottom: 1.25rem;
  }

  /* Add spacing between newsletter form elements */
  .newsletter-container :global(.newsletter-form.stacked) {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  @media (max-width: 640px) {
    .coming-soon-title {
      font-size: 3rem;
      letter-spacing: 0.25rem;
    }

    .coming-soon-message {
      font-size: 1.5rem;
    }

    .coming-soon-subtitle {
      font-size: 1rem;
    }
  }

  /* Skeleton Loading UI */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .skeleton-text {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.25rem;
    margin-left: auto;
    margin-right: auto;
  }

  .skeleton-glasses {
    width: 280px;
    height: 120px;
    margin: 0 auto 2rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.5rem;
  }

  .skeleton-title {
    width: 320px;
    height: 4rem;
    margin-bottom: 1rem;
  }

  .skeleton-divider {
    width: 100px;
    height: 4px;
    margin: 2rem auto;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 2px;
  }

  .skeleton-message {
    width: 200px;
    height: 2rem;
    margin-bottom: 1rem;
  }

  .skeleton-subtitle {
    width: 280px;
    height: 1.25rem;
  }

  .skeleton-header {
    width: 220px;
    height: 1.25rem;
    margin-bottom: 1.25rem;
  }

  .skeleton-input {
    width: 100%;
    height: 3rem;
    margin-bottom: 1rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem;
  }

  .skeleton-button {
    width: 100%;
    height: 2.75rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem;
  }

  @media (max-width: 640px) {
    .skeleton-title {
      width: 200px;
      height: 3rem;
    }

    .skeleton-glasses {
      width: 220px;
      height: 100px;
    }
  }
</style>
