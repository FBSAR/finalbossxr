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
    color: #00c400;
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

  /* Gradient text utility */
  :global(.gradient-text) {
    background: linear-gradient(135deg, #00c400 0%, #8a2be2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
