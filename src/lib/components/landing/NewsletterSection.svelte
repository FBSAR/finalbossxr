<script lang="ts">
  import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
</script>

<section class="newsletter-section" aria-label="Newsletter">
  <div class="newsletter-bg">
    <div class="newsletter-glow"></div>
  </div>
  
  <div class="newsletter-container">
    <div class="newsletter-content">
      <div class="newsletter-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round" class="newsletter-svg">
          <!-- Envelope body -->
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="url(#envGrad)" stroke-width="1.5"></path>
          <!-- Envelope flap -->
          <polyline points="22,6 12,13 2,6" stroke="url(#envGrad)" stroke-width="1.5"></polyline>
          <!-- Sparkle 1 -->
          <g class="sparkle sparkle-1">
            <line x1="21" y1="2" x2="21" y2="4" stroke="url(#sparkleGrad)" stroke-width="1.5"></line>
            <line x1="20" y1="3" x2="22" y2="3" stroke="url(#sparkleGrad)" stroke-width="1.5"></line>
          </g>
          <!-- Sparkle 2 -->
          <g class="sparkle sparkle-2">
            <line x1="3" y1="1" x2="3" y2="2.5" stroke="url(#sparkleGrad)" stroke-width="1"></line>
            <line x1="2.25" y1="1.75" x2="3.75" y2="1.75" stroke="url(#sparkleGrad)" stroke-width="1"></line>
          </g>
          <!-- Sparkle 3 -->
          <g class="sparkle sparkle-3">
            <circle cx="23" cy="10" r="0.5" fill="url(#sparkleGrad)"></circle>
          </g>
          <!-- Gradients -->
          <defs>
            <linearGradient id="envGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00c400"></stop>
              <stop offset="100%" stop-color="#8a2be2"></stop>
            </linearGradient>
            <linearGradient id="sparkleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#00ff88"></stop>
              <stop offset="100%" stop-color="#aa66ff"></stop>
            </linearGradient>
          </defs>
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

<style>
  /* Newsletter Section */
  .newsletter-section {
    position: relative;
    padding: 6rem 2rem;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .newsletter-section {
      padding: 4rem 1rem;
    }
  }

  .newsletter-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .newsletter-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 400px;
    background: radial-gradient(ellipse at center, rgba(0, 196, 0, 0.15) 0%, transparent 70%);
    filter: blur(40px);
  }

  .newsletter-container {
    max-width: 600px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .newsletter-content {
    text-align: center;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.5rem;
    padding: 3rem;
  }

  @media (max-width: 768px) {
    .newsletter-content {
      padding: 2rem 1.5rem;
    }
  }

  .newsletter-icon {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  .newsletter-svg {
    filter: drop-shadow(0 0 20px rgba(0, 196, 0, 0.4)) drop-shadow(0 0 40px rgba(138, 43, 226, 0.2));
  }

  .sparkle {
    animation: sparkle-pulse 2s ease-in-out infinite;
  }

  .sparkle-1 {
    animation-delay: 0s;
  }

  .sparkle-2 {
    animation-delay: 0.6s;
  }

  .sparkle-3 {
    animation-delay: 1.2s;
  }

  @keyframes sparkle-pulse {
    0%, 100% {
      opacity: 0.3;
      transform: scale(0.8);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sparkle {
      animation: none;
      opacity: 0.8;
    }
  }

  .newsletter-title {
    font-size: clamp(1.75rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .newsletter-description {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
    margin-bottom: 2rem;
  }

  .newsletter-form-wrapper {
    max-width: 400px;
    margin: 0 auto 1.5rem;
  }

  .newsletter-privacy {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.4);
  }

</style>
