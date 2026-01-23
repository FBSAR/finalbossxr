<script lang="ts">
  import { page } from '$app/stores';
  import XRAbstractArt from '$lib/components/XRAbstractArt.svelte';
</script>

<svelte:head>
  <title>{$page.status} | FinalBoss XR</title>
</svelte:head>

<div class="error-page">
  <!-- Animated Background -->
  <div class="error-bg">
    <div class="grid-background"></div>
    <div class="glow-orb orb-1"></div>
    <div class="glow-orb orb-2"></div>
  </div>

  <div class="error-content">
    <div class="xr-art-error">
      <XRAbstractArt size="md" />
    </div>

    <div class="error-code">
      <span class="digit">{String($page.status)[0] || '?'}</span>
      <span class="digit glitch" data-text={String($page.status)[1] || '?'}>{String($page.status)[1] || '?'}</span>
      <span class="digit">{String($page.status)[2] || '?'}</span>
    </div>

    <h1 class="error-title">
      {#if $page.status === 404}
        <span class="gradient-text">Not Found</span>
      {:else if $page.status >= 500}
        <span class="gradient-text">System Malfunction</span>
      {:else}
        <span class="gradient-text">Something Went Wrong</span>
      {/if}
    </h1>

    <p class="error-message">
      {#if $page.status === 404}
        The page you're looking for has drifted into another dimension. 
        It might have been moved, deleted, or perhaps it never existed.
      {:else if $page.status >= 500}
        Our systems encountered an unexpected error. 
        Our team has been notified and is working on a fix.
      {:else}
        {$page.error?.message || 'An unexpected error occurred.'}
      {/if}
    </p>

    <div class="error-actions">
      <a href="/" class="btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span>Return Home</span>
      </a>
      <button class="btn-secondary" on:click={() => history.back()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>Go Back</span>
      </button>
    </div>

    <!-- Floating particles -->
    <div class="particles">
      {#each Array(6) as _, i}
        <div class="particle" style="--delay: {i * 0.5}s; --x: {Math.random() * 100}%;"></div>
      {/each}
    </div>
  </div>

  <!-- Decorative elements -->
  <div class="corner-decoration top-left"></div>
  <div class="corner-decoration top-right"></div>
  <div class="corner-decoration bottom-left"></div>
  <div class="corner-decoration bottom-right"></div>
</div>

<style>
  .error-page {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 2rem;
  }

  /* Background */
  .error-bg {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  .grid-background {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(rgba(0, 196, 0, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0, 196, 0, 0.03) 1px, transparent 1px);
    background-size: 60px 60px;
    mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
    animation: gridPulse 8s ease-in-out infinite;
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  .glow-orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    animation: floatOrb 20s ease-in-out infinite;
  }

  .orb-1 {
    width: 400px;
    height: 400px;
    background: rgba(255, 50, 50, 0.15);
    top: 10%;
    left: 10%;
  }

  .orb-2 {
    width: 300px;
    height: 300px;
    background: rgba(138, 43, 226, 0.15);
    bottom: 10%;
    right: 10%;
    animation-delay: -10s;
  }

  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(30px, -30px); }
  }

  /* Content */
  .error-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 600px;
  }

  .xr-art-error {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    opacity: 0.7;
  }

  /* Error Code */
  .error-code {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
  }

  .digit {
    font-size: clamp(4rem, 15vw, 8rem);
    font-weight: 800;
    color: transparent;
    background: linear-gradient(135deg, #00c400 0%, #8a2be2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    line-height: 1;
    text-shadow: 0 0 40px rgba(0, 196, 0, 0.3);
  }

  .digit.glitch {
    position: relative;
    animation: glitch 3s ease-in-out infinite;
  }

  .digit.glitch::before,
  .digit.glitch::after {
    content: attr(data-text);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #00c400 0%, #8a2be2 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }

  .digit.glitch::before {
    animation: glitchTop 3s ease-in-out infinite;
    clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
  }

  .digit.glitch::after {
    animation: glitchBottom 3s ease-in-out infinite;
    clip-path: polygon(0 55%, 100% 55%, 100% 100%, 0 100%);
  }

  @keyframes glitch {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-2px, 2px); }
    94% { transform: translate(2px, -2px); }
    96% { transform: translate(-1px, -1px); }
    98% { transform: translate(1px, 1px); }
  }

  @keyframes glitchTop {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(3px, 0); }
    94% { transform: translate(-3px, 0); }
    96% { transform: translate(2px, 0); }
    98% { transform: translate(-2px, 0); }
  }

  @keyframes glitchBottom {
    0%, 90%, 100% { transform: translate(0); }
    92% { transform: translate(-3px, 0); }
    94% { transform: translate(3px, 0); }
    96% { transform: translate(-2px, 0); }
    98% { transform: translate(2px, 0); }
  }

  .error-title {
    font-size: clamp(1.5rem, 4vw, 2.5rem);
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .error-message {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.7;
    margin-bottom: 2.5rem;
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }

  /* Actions */
  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #00c400 0%, #008800 100%);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: none;
    border-radius: 0.75rem;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 196, 0, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 196, 0, 0.4);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: transparent;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }

  /* Particles */
  .particles {
    position: absolute;
    inset: 0;
    pointer-events: none;
    overflow: hidden;
  }

  .particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: #00c400;
    border-radius: 50%;
    left: var(--x);
    bottom: -10px;
    opacity: 0;
    animation: floatUp 8s ease-in-out infinite;
    animation-delay: var(--delay);
  }

  .particle:nth-child(even) {
    background: #8a2be2;
    width: 3px;
    height: 3px;
  }

  @keyframes floatUp {
    0% {
      transform: translateY(0) scale(0);
      opacity: 0;
    }
    10% {
      opacity: 1;
      transform: translateY(-50px) scale(1);
    }
    90% {
      opacity: 0.5;
    }
    100% {
      transform: translateY(-500px) scale(0);
      opacity: 0;
    }
  }

  /* Corner Decorations */
  .corner-decoration {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid rgba(0, 196, 0, 0.2);
    pointer-events: none;
  }

  .corner-decoration.top-left {
    top: 2rem;
    left: 2rem;
    border-right: none;
    border-bottom: none;
  }

  .corner-decoration.top-right {
    top: 2rem;
    right: 2rem;
    border-left: none;
    border-bottom: none;
  }

  .corner-decoration.bottom-left {
    bottom: 2rem;
    left: 2rem;
    border-right: none;
    border-top: none;
  }

  .corner-decoration.bottom-right {
    bottom: 2rem;
    right: 2rem;
    border-left: none;
    border-top: none;
  }

  @media (max-width: 768px) {
    .corner-decoration {
      width: 50px;
      height: 50px;
    }

    .error-message {
      font-size: 1rem;
    }

    .error-actions {
      flex-direction: column;
      align-items: center;
    }

    .btn-primary,
    .btn-secondary {
      width: 100%;
      max-width: 280px;
      justify-content: center;
    }
  }
</style>
