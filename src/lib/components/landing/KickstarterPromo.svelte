<script lang="ts">
  export let variant: 'landing' | 'cosmic' = 'landing';
</script>

<section class="kickstarter-section" class:cosmic={variant === 'cosmic'}>
  <div class="kickstarter-container">
    <div class="kickstarter-card">
      
      <!-- Kickstarter Logo -->
      <div class="logo-wrapper">
        <img 
          class="kickstarter-logo" 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/misc/Kickstarter-Logo.png" 
          alt="Kickstarter"
        >
        <!-- Glow effect -->
        <div class="logo-glow"></div>
      </div>

      <!-- Status Badge -->
      <div class="badge-wrapper">
        <div class="status-badge">
          <span class="pulse-dot">
            <span class="pulse-ring"></span>
            <span class="pulse-core"></span>
          </span>
          <span class="badge-text">Coming Soon</span>
        </div>
      </div>

      <!-- Title & Description -->
      <div class="content">
        <h2 class="gradient-text kickstarter-title">Support Our Campaign</h2>
        <p class="description">
          Help us bring <span class="highlight">Cosmic Collisions</span> to life! Back our Kickstarter to unlock exclusive rewards and be part of the journey.
        </p>
      </div>

      <!-- Launch Date -->
      <div class="launch-date">
        <p>
          <span class="date-label">Launch Date:</span> Q2 2026
        </p>
      </div>

      <!-- CTA Button -->
      <div class="cta-wrapper">
        <a 
          href="https://www.kickstarter.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          class="cta-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Visit Kickstarter Page
        </a>
      </div>

      <!-- Notify Me Option -->
      <p class="notify-text">
        Want to be notified when we launch? <a href="#contact" class="notify-link">Sign up for updates</a>
      </p>
    </div>
  </div>
</section>

<style>
  .kickstarter-section {
    padding: 4rem 1rem;
    position: relative;
  }

  .kickstarter-section.cosmic {
    padding: 0;
  }

  .kickstarter-container {
    max-width: 640px;
    margin: 0 auto;
  }

  .cosmic .kickstarter-container {
    width: 91.666667%;
    max-width: 50%;
  }

  @media (max-width: 1024px) {
    .cosmic .kickstarter-container {
      max-width: 91.666667%;
    }
  }

  .kickstarter-card {
    padding: 1.5rem;
    border-radius: 1rem;
    backdrop-filter: blur(12px);
    background: rgba(18, 18, 26, 0.8);
    border: 1px solid rgba(5, 206, 120, 0.3);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    transition: all 0.3s ease;
  }

  .kickstarter-card:hover {
    border-color: rgba(5, 206, 120, 0.5);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(5, 206, 120, 0.1);
    transform: translateY(-2px);
  }

  @media (min-width: 1024px) {
    .kickstarter-card {
      padding: 2rem;
    }
  }

  .cosmic .kickstarter-card {
    background: rgba(0, 0, 0, 0.4);
  }

  @media (min-width: 1024px) {
    .cosmic .kickstarter-card {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  /* Logo */
  .logo-wrapper {
    position: relative;
    display: inline-block;
    margin: 0 auto;
  }

  .kickstarter-logo {
    height: 5rem;
    margin: 0 auto;
  }

  @media (min-width: 1024px) {
    .kickstarter-logo {
      height: 7rem;
    }
  }

  .logo-glow {
    position: absolute;
    inset: 0;
    filter: blur(24px);
    background: rgba(5, 206, 120, 0.2);
    z-index: -1;
    transform: scale(1.5);
  }

  /* Status Badge */
  .badge-wrapper {
    display: flex;
    justify-content: center;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 215, 0, 0.15);
    border: 1px solid rgba(255, 215, 0, 0.4);
    border-radius: 9999px;
  }

  .pulse-dot {
    position: relative;
    display: flex;
    height: 0.5rem;
    width: 0.5rem;
  }

  .pulse-ring {
    position: absolute;
    display: inline-flex;
    height: 100%;
    width: 100%;
    border-radius: 9999px;
    background: #FFD700;
    opacity: 0.75;
    animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
  }

  .pulse-core {
    position: relative;
    display: inline-flex;
    border-radius: 9999px;
    height: 0.5rem;
    width: 0.5rem;
    background: #FFD700;
  }

  @keyframes ping {
    75%, 100% {
      transform: scale(2);
      opacity: 0;
    }
  }

  .badge-text {
    color: #FFD700;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* Content */
  .content {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .kickstarter-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }

  @media (min-width: 1024px) {
    .kickstarter-title {
      font-size: 1.875rem;
    }
  }

  .description {
    color: #9ca3af;
    font-size: 0.875rem;
    max-width: 28rem;
    margin: 0 auto;
    line-height: 1.5;
  }

  @media (min-width: 1024px) {
    .description {
      font-size: 1rem;
    }
  }

  .highlight {
    color: #FFD700;
    font-weight: 500;
  }

  /* Launch Date */
  .launch-date {
    display: inline-block;
    margin: 0 auto;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .launch-date p {
    color: #d1d5db;
    font-size: 0.875rem;
    margin: 0;
  }

  .date-label {
    color: #05ce78;
    font-weight: 600;
  }

  /* CTA Button */
  .cta-wrapper {
    padding-top: 0.5rem;
  }

  .cta-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 2rem;
    background: #05ce78;
    color: #000;
    font-weight: 700;
    font-size: 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.2s ease;
  }

  .cta-button:hover {
    background: #04b56a;
    transform: scale(1.05);
    box-shadow: 0 10px 25px rgba(5, 206, 120, 0.3);
  }

  /* Notify Text */
  .notify-text {
    color: #6b7280;
    font-size: 0.75rem;
    margin: 0;
  }

  .notify-link {
    color: #05ce78;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .notify-link:hover {
    text-decoration: underline;
    color: #06e88a;
  }
</style>
