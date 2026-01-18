<script lang='ts'>
  import { onMount } from 'svelte';

  let mouseX = 0;
  let mouseY = 0;
  let heroSection: HTMLElement;
  let windowWidth = 0;
  let windowHeight = 0;

  // Define geometric shapes with their positions and properties
  interface Shape {
    id: number;
    type: 'hexagon' | 'triangle' | 'square' | 'diamond' | 'circle';
    x: number; // percentage
    y: number; // percentage
    size: number;
    rotation: number;
    baseRotation: number;
    color: string;
  }

  const shapes: Shape[] = [
    { id: 1, type: 'hexagon', x: 15, y: 20, size: 80, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.15)' },
    { id: 2, type: 'triangle', x: 85, y: 15, size: 60, rotation: 0, baseRotation: 30, color: 'rgba(0, 196, 0, 0.12)' },
    { id: 3, type: 'square', x: 10, y: 70, size: 50, rotation: 0, baseRotation: 45, color: 'rgba(255, 215, 0, 0.1)' },
    { id: 4, type: 'diamond', x: 90, y: 75, size: 70, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.1)' },
    { id: 5, type: 'circle', x: 75, y: 45, size: 100, rotation: 0, baseRotation: 0, color: 'rgba(138, 43, 226, 0.08)' },
    { id: 6, type: 'hexagon', x: 25, y: 85, size: 55, rotation: 0, baseRotation: 15, color: 'rgba(0, 196, 0, 0.08)' },
    { id: 7, type: 'triangle', x: 5, y: 45, size: 45, rotation: 0, baseRotation: -20, color: 'rgba(255, 215, 0, 0.08)' },
    { id: 8, type: 'square', x: 70, y: 85, size: 40, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.1)' },
    { id: 9, type: 'diamond', x: 50, y: 10, size: 35, rotation: 0, baseRotation: 45, color: 'rgba(138, 43, 226, 0.1)' },
    { id: 10, type: 'hexagon', x: 95, y: 50, size: 65, rotation: 0, baseRotation: 30, color: 'rgba(0, 196, 0, 0.06)' },
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

    // Update each shape based on cursor proximity
    shapes.forEach(shape => {
      const shapePixelX = (shape.x / 100) * rect.width;
      const shapePixelY = (shape.y / 100) * rect.height;
      
      const deltaX = mouseX - shapePixelX;
      const deltaY = mouseY - shapePixelY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      // Influence radius - shapes within this distance will react
      const influenceRadius = 400;
      
      if (distance < influenceRadius) {
        const influence = 1 - (distance / influenceRadius);
        const pushStrength = 50 * influence;
        
        // Push shape away from cursor
        const angle = Math.atan2(deltaY, deltaX);
        const translateX = -Math.cos(angle) * pushStrength;
        const translateY = -Math.sin(angle) * pushStrength;
        
        // Rotate based on cursor position
        const rotation = shape.baseRotation + (influence * 45);
        
        // Scale up slightly when cursor is near
        const scale = 1 + (influence * 0.15);
        
        shapeTransforms[shape.id] = { translateX, translateY, rotation, scale };
      } else {
        // Return to base state
        shapeTransforms[shape.id] = { 
          translateX: 0, 
          translateY: 0, 
          rotation: shape.baseRotation, 
          scale: 1 
        };
      }
    });
    
    // Trigger reactivity
    shapeTransforms = { ...shapeTransforms };
  };

  onMount(() => {
    windowWidth = window.innerWidth;
    windowHeight = window.innerHeight;
  });
</script>

<main>
  <!-- Hero Section -->
  <section 
    class="hero-section" 
    bind:this={heroSection}
    on:mousemove={handleMouseMove}
  >
    <!-- Animated Background Grid -->
    <div class="grid-background"></div>
    
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

    <!-- Hero Content -->
    <div class="hero-content">
      <div class="hero-badge">
        <span class="badge-dot"></span>
        <span>XR Gaming Studio</span>
      </div>
      
      <h1 class="hero-title">
        <span class="title-line">Building the Future of</span>
        <span class="title-line gradient-text">Immersive Gaming</span>
      </h1>
      
      <p class="hero-subtitle">
        We create cutting-edge AR/VR experiences that blur the line between reality and imagination.
      </p>

      <div class="hero-cta">
        <a href="/cosmic" class="btn-primary">
          <span>Explore Our Games</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
        <a href="/about" class="btn-secondary">Meet the Team</a>
      </div>
    </div>
  </section>
</main>

<style>
  /* Hero Section */
  .hero-section {
    position: relative;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
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
  }

  @keyframes gridPulse {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }

  /* Geometric Shapes */
  .geo-shape {
    position: absolute;
    pointer-events: none;
    transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  /* Hexagon */
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

  /* Triangle */
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

  /* Square */
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

  /* Diamond */
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

  /* Circle */
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

  /* Cursor Glow */
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

  /* Hero Content */
  .hero-content {
    position: relative;
    z-index: 10;
    text-align: center;
    max-width: 900px;
    padding: 2rem;
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
    font-size: 4.5rem;
    font-weight: 700;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    color: white;
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
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.7);
    max-width: 600px;
    margin: 0 auto 2.5rem;
    line-height: 1.6;
  }

  .hero-cta {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: linear-gradient(135deg, #00c400 0%, #006600 100%);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px rgba(0, 196, 0, 0.3);
  }

  .btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px rgba(0, 196, 0, 0.4);
  }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    padding: 1rem 2rem;
    background: transparent;
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .btn-secondary:hover {
    border-color: rgba(255, 255, 255, 0.5);
    background: rgba(255, 255, 255, 0.05);
  }
</style>