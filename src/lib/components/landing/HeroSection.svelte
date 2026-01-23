<script lang="ts">
  import XRAbstractArt from '$lib/components/XRAbstractArt.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let scrollY = 0;

  let heroSection: HTMLElement;
  let mouseX = 0;
  let mouseY = 0;

  // ============================================
  // CONSTELLATION PARTICLE SYSTEM - Cherry on top!
  // ============================================
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let particles: Particle[] = [];
  let animationId: number;
  let canvasWidth = 0;
  let canvasHeight = 0;

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
    baseAlpha: number;
    pulseOffset: number;
  }

  const PARTICLE_COUNT = 60;
  const CONNECTION_DISTANCE = 150;
  const MOUSE_INFLUENCE_RADIUS = 200;
  const COLORS = ['#00c400', '#00ff88', '#8a2be2', '#aa66ff', '#ffd700'];

  function createParticle(): Particle {
    return {
      x: Math.random() * canvasWidth,
      y: Math.random() * canvasHeight,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.15,
      radius: Math.random() * 2 + 1,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: Math.random() * 0.5 + 0.3,
      baseAlpha: Math.random() * 0.5 + 0.3,
      pulseOffset: Math.random() * Math.PI * 2
    };
  }

  function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles(time: number) {
    if (!ctx) return;
    const c = ctx; // Local reference for TypeScript narrowing
    
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update and draw particles
    particles.forEach((p, i) => {
      // Mouse influence - attract particles slightly toward cursor
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distToMouse = Math.sqrt(dx * dx + dy * dy);
      
      if (distToMouse < MOUSE_INFLUENCE_RADIUS && distToMouse > 0) {
        const influence = (1 - distToMouse / MOUSE_INFLUENCE_RADIUS) * 0.005;
        p.vx += dx * influence;
        p.vy += dy * influence;
      }
      
      // Apply velocity with damping (higher = more friction = slower)
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around edges
      if (p.x < 0) p.x = canvasWidth;
      if (p.x > canvasWidth) p.x = 0;
      if (p.y < 0) p.y = canvasHeight;
      if (p.y > canvasHeight) p.y = 0;
      
      // Pulsing alpha
      p.alpha = p.baseAlpha + Math.sin(time * 0.002 + p.pulseOffset) * 0.2;
      
      // Draw connections to nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dist = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        
        if (dist < CONNECTION_DISTANCE) {
          const lineAlpha = (1 - dist / CONNECTION_DISTANCE) * 0.3;
          
          c.beginPath();
          c.moveTo(p.x, p.y);
          c.lineTo(p2.x, p2.y);
          c.strokeStyle = `rgba(0, 196, 0, ${lineAlpha})`;
          c.lineWidth = 0.5;
          c.stroke();
        }
      }
      
      // Draw mouse connection lines
      if (distToMouse < CONNECTION_DISTANCE * 1.5) {
        const lineAlpha = (1 - distToMouse / (CONNECTION_DISTANCE * 1.5)) * 0.4;
        c.beginPath();
        c.moveTo(p.x, p.y);
        c.lineTo(mouseX, mouseY);
        c.strokeStyle = `rgba(138, 43, 226, ${lineAlpha})`;
        c.lineWidth = 0.8;
        c.stroke();
      }
      
      // Draw particle with glow
      c.beginPath();
      c.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2);
      const glowGradient = c.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 2);
      glowGradient.addColorStop(0, p.color);
      glowGradient.addColorStop(1, 'transparent');
      c.fillStyle = glowGradient;
      c.globalAlpha = p.alpha * 0.5;
      c.fill();
      
      // Draw core
      c.beginPath();
      c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      c.fillStyle = p.color;
      c.globalAlpha = p.alpha;
      c.fill();
      c.globalAlpha = 1;
    });
    
    animationId = requestAnimationFrame((t) => drawParticles(t));
  }

  function resizeCanvas() {
    if (!canvas || !heroSection) return;
    const rect = heroSection.getBoundingClientRect();
    canvasWidth = rect.width;
    canvasHeight = rect.height;
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Reinitialize particles on resize
    if (particles.length === 0 || Math.abs(particles[0]?.x - canvasWidth) > canvasWidth * 0.5) {
      initParticles();
    }
  }

  // Hero text reveal animation
  let heroRevealed = false;
  let heroRevealTimeout: ReturnType<typeof setTimeout>;

  onMount(() => {
    if (browser && canvas) {
      ctx = canvas.getContext('2d');
      resizeCanvas();
      initParticles();
      drawParticles(0);
      
      window.addEventListener('resize', resizeCanvas);
    }
    
    // Reveal hero text after 1500ms
    heroRevealTimeout = setTimeout(() => {
      heroRevealed = true;
    }, 2500);
  });

  onDestroy(() => {
    if (browser) {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(heroRevealTimeout);
    }
  });

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
    parallaxSpeed: number;
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

  // Performance: RAF-based mouse tracking
  let mouseTicking = false;
  let pendingMouseX = 0;
  let pendingMouseY = 0;

  const handleMouseMove = (e: MouseEvent) => {
    if (!heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    pendingMouseX = e.clientX - rect.left;
    pendingMouseY = e.clientY - rect.top;

    if (!mouseTicking) {
      requestAnimationFrame(() => {
        mouseX = pendingMouseX;
        mouseY = pendingMouseY;
        updateShapeTransforms();
        mouseTicking = false;
      });
      mouseTicking = true;
    }
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

      if (distance < influenceRadius) {
        const influence = 1 - (distance / influenceRadius);
        const pushStrength = 50 * influence;
        
        const angle = Math.atan2(deltaY, deltaX);
        translateX = -Math.cos(angle) * pushStrength;
        translateY = -Math.sin(angle) * pushStrength;
        rotation = shape.baseRotation + (influence * 45);
        scale = 1 + (influence * 0.15);
      }

      const parallaxOffset = scrollY * shape.parallaxSpeed;
      translateY -= parallaxOffset;

      shapeTransforms[shape.id] = { translateX, translateY, rotation, scale };
    });
    
    shapeTransforms = { ...shapeTransforms };
  };

  // Update shapes when scrollY changes
  $: if (scrollY !== undefined) {
    updateShapeTransforms();
  }
</script>

<section 
  class="hero-section" 
  bind:this={heroSection}
  on:mousemove={handleMouseMove}
  role="banner"
  aria-label="Hero section"
>
  <!-- Constellation Particle Canvas - The Cherry on Top! -->
  <canvas 
    bind:this={canvas} 
    class="constellation-canvas"
    aria-hidden="true"
  ></canvas>

  <!-- Animated Background Grid -->
  <div class="grid-background" style="transform: translateY({scrollY * 0.1}px);"></div>
  
  <!-- Geometric Shapes -->
  {#each shapes as shape (shape.id)}
    <div 
      class="geo-shape-wrapper"
      style="
        left: {shape.x}%;
        top: {shape.y}%;
        width: {shape.size}px;
        height: {shape.size}px;
        transform: translate(-50%, -50%) 
          translateX({shapeTransforms[shape.id]?.translateX || 0}px) 
          translateY({shapeTransforms[shape.id]?.translateY || 0}px) 
          scale({shapeTransforms[shape.id]?.scale || 1});
      "
    >
      <div 
        class="geo-shape {shape.type}"
        style="
          width: 100%;
          height: 100%;
          --shape-color: {shape.color};
        "
      ></div>
    </div>
  {/each}

  <!-- Subtle Cursor Glow -->
  <div 
    class="cursor-glow"
    style="left: {mouseX}px; top: {mouseY}px;"
  ></div>

  <!-- Hero Content -->
  <div class="hero-content" style="transform: translateY({scrollY * -0.2}px);">
    <div class="xr-art-hero">
      <XRAbstractArt size="lg" />
    </div>

    <div class="hero-badge" class:revealed={heroRevealed}>
      <span class="badge-dot"></span>
      <span>Immersive Technology Studio</span>
    </div>
    
    <h1 class="hero-title" class:revealed={heroRevealed}>
      <span class="title-line">Shaping the Future of</span>
      <span class="title-line gradient-text">Extended Reality</span>
    </h1>
    
    <p class="hero-subtitle" class:revealed={heroRevealed}>
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

  <!-- Scroll Indicator -->
  <div class="scroll-indicator" style="opacity: {Math.max(0, 1 - scrollY / 200)}; transform: translateY({scrollY * 0.5}px);">
    <span>Scroll to explore</span>
    <div class="scroll-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
    </div>
  </div>
</section>

<style>
  .hero-section {
    position: relative;
    min-height: 100vh;
    min-height: 100dvh;
    width: 100%;
    display: flex;
    padding-top: 2em;
    justify-content: center;
    overflow: hidden;
    contain: layout paint;
    isolation: isolate;
  }

  /* Constellation Particle System */
  .constellation-canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
    opacity: 0.8;
    mix-blend-mode: screen;
  }

  @media (max-width: 768px) {
    .constellation-canvas {
      opacity: 0.4;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .constellation-canvas {
      display: none;
    }
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
    will-change: opacity;
    transform: translateZ(0);
    backface-visibility: hidden;
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

  .geo-shape-wrapper {
    position: absolute;
    pointer-events: none;
    transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
  }

  @media (max-width: 768px) {
    .geo-shape-wrapper {
      opacity: 0.5;
      transform: scale(0.6) translateZ(0) !important;
    }
  }

  .geo-shape {
    position: relative;
    pointer-events: none;
    will-change: transform, filter;
    backface-visibility: hidden;
  }

  .geo-shape.hexagon {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
    background: var(--shape-color);
    border: 2px solid rgba(0, 196, 0, 0.2);
    animation: hexagonPulse 20s linear infinite, hexagonGlow 3s ease-in-out infinite;
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
    animation: trianglePulse 25s linear infinite, triangleGlow 4s ease-in-out infinite;
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
    animation: squarePulse 15s linear infinite, squareGlow 3.5s ease-in-out infinite;
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
    animation: diamondPulse 18s linear infinite, diamondGlow 4.5s ease-in-out infinite;
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
    animation: circleGlow 5s ease-in-out infinite;
  }

  .geo-shape.circle::before {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: transparent;
    border: 1px solid rgba(138, 43, 226, 0.1);
  }

  @keyframes hexagonPulse {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes trianglePulse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }

  @keyframes squarePulse {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes diamondPulse {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }

  @keyframes hexagonGlow {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(0, 196, 0, 0.2)); }
    50% { filter: drop-shadow(0 0 12px rgba(0, 196, 0, 0.6)) drop-shadow(0 0 25px rgba(0, 196, 0, 0.3)); }
  }

  @keyframes triangleGlow {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(0, 196, 0, 0.15)); }
    50% { filter: drop-shadow(0 0 10px rgba(0, 196, 0, 0.5)) drop-shadow(0 0 20px rgba(0, 196, 0, 0.25)); }
  }

  @keyframes squareGlow {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(255, 215, 0, 0.15)); }
    50% { filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5)) drop-shadow(0 0 22px rgba(255, 215, 0, 0.25)); }
  }

  @keyframes diamondGlow {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(0, 196, 0, 0.15)); }
    50% { filter: drop-shadow(0 0 12px rgba(0, 196, 0, 0.55)) drop-shadow(0 0 24px rgba(0, 196, 0, 0.28)); }
  }

  @keyframes circleGlow {
    0%, 100% { filter: drop-shadow(0 0 3px rgba(138, 43, 226, 0.15)); }
    50% { filter: drop-shadow(0 0 14px rgba(138, 43, 226, 0.5)) drop-shadow(0 0 28px rgba(138, 43, 226, 0.25)); }
  }

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

  .xr-art-hero {
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 768px) {
    .xr-art-hero {
      margin-bottom: 0.5rem;
    }
    
    .xr-art-hero :global(.xr-abstract-container) {
      max-width: 200px;
    }
  }

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
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .hero-badge.revealed {
    opacity: 1;
    transform: translateY(0);
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
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 400;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    letter-spacing: -0.02em;
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
  }

  .hero-title.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  .title-line {
    display: block;
    color: white;
  }

  .hero-subtitle {
    font-size: clamp(1rem, 2.5vw, 1.25rem);
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto 2rem;
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s, 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s;
  }

  .hero-subtitle.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .hero-subtitle {
      margin-bottom: 1.5rem;
    }
  }

  .value-props {
    display: flex;
    gap: 2rem;
    margin-bottom: 2.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  @media (max-width: 768px) {
    .value-props {
      gap: 1rem;
      margin-bottom: 2rem;
    }
  }

  .value-prop {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9375rem;
  }

  .prop-icon {
    font-size: 1.25rem;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .btn-primary {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #00c400 0%, #008800 100%);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 196, 0, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 196, 0, 0.4);
  }

  .btn-secondary {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: transparent;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }

  .btn-badge {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    padding: 0.15rem 0.5rem;
    background: rgba(138, 43, 226, 0.9);
    font-size: 0.625rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 4px;
    white-space: nowrap;
  }

  .btn-badge-primary {
    background: rgba(0, 0, 0, 0.4);
  }

  .scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    will-change: transform, opacity;
  }

  .scroll-arrow {
    animation: bounce 2s ease-in-out infinite;
  }

  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(10px); }
  }

  @media (max-width: 768px) {
    .scroll-indicator {
      display: none;
    }
  }

  /* Gradient text utility */
  :global(.gradient-text) {
    background: linear-gradient(135deg, #00c400 0%, #8a2be2 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
</style>
