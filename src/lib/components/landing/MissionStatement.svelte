<section class="mission-statement-container">
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
</section>

<style>
  /* Mission Statement - Enhanced Cool Design */
  .mission-statement-container {
    position: relative;
    text-align: center;
    max-width: 800px;
    margin: 5rem auto;
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

  .mission-statement-container::before {
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
    .mission-statement-container {
      margin: 3rem auto;
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
