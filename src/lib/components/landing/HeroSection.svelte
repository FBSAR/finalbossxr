<script lang="ts">
  import XRAbstractArt from '$lib/components/XRAbstractArt.svelte';
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  export let scrollY = 0;

  let heroSection: HTMLElement;
  let xrArtElement: HTMLElement;
  let mouseX = 0;
  let mouseY = 0;

  // ============================================
  // GAMIFICATION - Shape Collection System
  // ============================================
  let collectedShapes = 0;
  let isSupernova = false;
  let supernovaComplete = false;
  let xrArtReacting = false;
  let reactionIntensity = 0;
  
  // Dragging state
  let isDragging = false;
  let draggedShapeId: number | null = null;
  let dragStartX = 0;
  let dragStartY = 0;
  let dragOffsetX = 0;
  let dragOffsetY = 0;
  let isHoveringDraggable = false;

  // Mobile detection and tap-to-collect
  let isMobile = false;
  let flyingShapeId: number | null = null;

  // Persistent energy sound state
  let energyAudioCtx: AudioContext | null = null;
  let energyOscillators: OscillatorNode[] = [];
  let energyGains: GainNode[] = [];
  let energyLFO: OscillatorNode | null = null;
  let isEnergyPlaying = false;
  let crackleInterval: ReturnType<typeof setInterval> | null = null;

  // ============================================
  // CONSTELLATION PARTICLE SYSTEM - Cherry on top!
  // ============================================
  let canvas: HTMLCanvasElement;
  let ctx: CanvasRenderingContext2D | null;
  let particles: Particle[] = [];
  let animationId: number | null;
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

  const PARTICLE_COUNT_DESKTOP = 30;
  const PARTICLE_COUNT_MOBILE = 15;
  const CONNECTION_DISTANCE = 100;
  const MOUSE_INFLUENCE_RADIUS = 180;
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
    const count = isMobile ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(createParticle());
    }
  }

  function drawParticles(time: number) {
    if (!ctx) return;
    const c = ctx; // Local reference for TypeScript narrowing
    
    c.clearRect(0, 0, canvasWidth, canvasHeight);
    
    // Update and draw particles
    particles.forEach((p, i) => {
      // Mouse influence - attract particles slightly toward cursor (skip on mobile)
      let distToMouse = Infinity;
      if (!isMobile) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < MOUSE_INFLUENCE_RADIUS && distToMouse > 0) {
          const influence = (1 - distToMouse / MOUSE_INFLUENCE_RADIUS) * 0.005;
          p.vx += dx * influence;
          p.vy += dy * influence;
        }
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
      
      // Connection lines are batched below after the particle loop
      
      // Draw particle (soft outer ring + solid core — no per-particle gradient)
      c.beginPath();
      c.arc(p.x, p.y, p.radius * 2.5, 0, Math.PI * 2);
      c.fillStyle = p.color;
      c.globalAlpha = p.alpha * 0.25;
      c.fill();

      // Draw core
      c.beginPath();
      c.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      c.fillStyle = p.color;
      c.globalAlpha = p.alpha;
      c.fill();
      c.globalAlpha = 1;
    });

    // Batch all green connection lines into a single stroke call
    c.beginPath();
    c.strokeStyle = 'rgba(0, 196, 0, 0.3)';
    c.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        if (dx * dx + dy * dy < CONNECTION_DISTANCE * CONNECTION_DISTANCE) {
          c.moveTo(p.x, p.y);
          c.lineTo(p2.x, p2.y);
        }
      }
    }
    c.stroke();

    // Batch mouse connection lines (desktop only)
    if (!isMobile) {
      c.beginPath();
      c.strokeStyle = 'rgba(138, 43, 226, 0.4)';
      c.lineWidth = 0.8;
      const mouseDist2 = CONNECTION_DISTANCE * CONNECTION_DISTANCE * 2.25; // (1.5x)²
      for (const p of particles) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        if (dx * dx + dy * dy < mouseDist2) {
          c.moveTo(p.x, p.y);
          c.lineTo(mouseX, mouseY);
        }
      }
      c.stroke();
    }

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

  function checkMobile() {
    isMobile = browser && window.innerWidth < 768;
  }

  function handleResize() {
    resizeCanvas();
    checkMobile();
  }

  // Hero text reveal animation
  let heroRevealed = false;
  let heroRevealTimeout: ReturnType<typeof setTimeout>;
  
  // XR Art reveal animation
  let xrArtRevealed = true;
  let xrArtRevealTimeout: ReturnType<typeof setTimeout>;
  
  // Typewriter effect state
  const titleLine1 = 'Shaping the Future of';
  const titleLine2 = 'Extended Reality';
  const subtitleText = 'We build proprietary XR software and (sometimes) AI-powered spatial experiences — from immersive games, and other industries. We are a creative studio that wants to truly innovate the way people interact with technology.';
  
  let typedTitle1 = '';
  let typedTitle2 = '';
  let typedSubtitle = '';
  let typewriterComplete = false;
  
  function startTypewriter() {
    const speed = 25; // ms per character
    let i = 0;
    let j = 0;
    let k = 0;
    
    // Type title line 1
    const typeTitle1 = () => {
      if (i < titleLine1.length) {
        typedTitle1 = titleLine1.slice(0, i + 1);
        i++;
        setTimeout(typeTitle1, speed);
      } else {
        // Start title line 2 after a brief pause
        setTimeout(typeTitle2, 150);
      }
    };
    
    // Type title line 2
    const typeTitle2 = () => {
      if (j < titleLine2.length) {
        typedTitle2 = titleLine2.slice(0, j + 1);
        j++;
        setTimeout(typeTitle2, speed);
      } else {
        // Start subtitle after a brief pause
        setTimeout(typeSubtitle, 200);
      }
    };
    
    // Type subtitle (slightly faster than title but still readable)
    const typeSubtitle = () => {
      if (k < subtitleText.length) {
        typedSubtitle = subtitleText.slice(0, k + 1);
        k++;
        setTimeout(typeSubtitle, 20); // Comfortable reading speed
      } else {
        typewriterComplete = true;
      }
    };
    
    typeTitle1();
  }

  onMount(() => {
    if (browser) {
      checkMobile();
      
      // Apply mobile-friendly positions for draggable shapes
      if (isMobile) {
        const mobilePositions: Record<number, {x: number, y: number}> = {
          1: { x: 25, y: 2 },
          2: { x: 75, y: 2 },
          3: { x: 15, y: 7 },
          4: { x: 85, y: 7 },
          5: { x: 50, y: 4 }, // Moved down below "ENERGY COLLECTED" UI
        };
        shapes = shapes.map(s => {
          if (s.draggable && mobilePositions[s.id]) {
            return { ...s, x: mobilePositions[s.id].x, y: mobilePositions[s.id].y, size: s.size * 0.65 };
          }
          return s;
        });
      }
    }
    
    if (browser && canvas) {
      ctx = canvas.getContext('2d');
      resizeCanvas();
      initParticles();
      drawParticles(0);
      
      window.addEventListener('resize', handleResize);

      // Pause particle loop when hero scrolls out of view
      const heroObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!animationId) drawParticles(0);
            } else {
              if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
              }
            }
          });
        },
        { threshold: 0 }
      );
      if (heroSection) heroObserver.observe(heroSection);
    }
    
    // Reveal XR art after 1500ms
    xrArtRevealTimeout = setTimeout(() => {
      xrArtRevealed = true;
    }, 1500);
    
    // Reveal hero text after 2500ms
    heroRevealTimeout = setTimeout(() => {
      heroRevealed = true;
      // Start typewriter effect 400ms after reveal animation starts
      setTimeout(startTypewriter, 400);
    }, 2500);
  });

  onDestroy(() => {
    if (browser) {
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      clearTimeout(heroRevealTimeout);
      clearTimeout(xrArtRevealTimeout);
      // Stop energy hum if playing
      stopEnergyHum();
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
    collected: boolean;
    draggable: boolean;
  }

  let shapes: Shape[] = [
    // Draggable shapes (circles and squares only)
    { id: 1, type: 'circle', x: 15, y: 8, size: 70, rotation: 0, baseRotation: 0, color: 'rgba(255, 215, 0, 0.08)', parallaxSpeed: 0.3, collected: false, draggable: true },
    { id: 2, type: 'square', x: 85, y: 5, size: 55, rotation: 0, baseRotation: 45, color: 'rgba(255, 215, 0, 0.1)', parallaxSpeed: 0.5, collected: false, draggable: true },
    { id: 3, type: 'square', x: 10, y: 15, size: 60, rotation: 0, baseRotation: 0, color: 'rgba(255, 215, 0, 0.08)', parallaxSpeed: 0.2, collected: false, draggable: true },
    { id: 4, type: 'circle', x: 90, y: 15, size: 50, rotation: 0, baseRotation: 0, color: 'rgba(255, 215, 0, 0.1)', parallaxSpeed: 0.4, collected: false, draggable: true },
    { id: 5, type: 'square', x: 75, y: 22, size: 80, rotation: 0, baseRotation: 0, color: 'rgba(255, 215, 0, 0.08)', parallaxSpeed: 0.15, collected: false, draggable: true },
    // Decorative shapes (not draggable)
    { id: 6, type: 'hexagon', x: 25, y: 30, size: 55, rotation: 0, baseRotation: 15, color: 'rgba(0, 196, 0, 0.08)', parallaxSpeed: 0.35, collected: false, draggable: false },
    { id: 7, type: 'triangle', x: 5, y: 25, size: 45, rotation: 0, baseRotation: -20, color: 'rgba(255, 215, 0, 0.08)', parallaxSpeed: 0.45, collected: false, draggable: false },
    { id: 8, type: 'diamond', x: 70, y: 30, size: 40, rotation: 0, baseRotation: 0, color: 'rgba(0, 196, 0, 0.1)', parallaxSpeed: 0.25, collected: false, draggable: false },
    { id: 9, type: 'hexagon', x: 50, y: 10, size: 35, rotation: 0, baseRotation: 45, color: 'rgba(138, 43, 226, 0.1)', parallaxSpeed: 0.55, collected: false, draggable: false },
    { id: 10, type: 'triangle', x: 95, y: 28, size: 65, rotation: 0, baseRotation: 30, color: 'rgba(0, 196, 0, 0.06)', parallaxSpeed: 0.2, collected: false, draggable: false },
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

      // Only apply mouse influence to non-draggable (decorative) shapes
      // Draggable shapes stay in place so users can grab them
      if (distance < influenceRadius && !shape.draggable) {
        const influence = 1 - (distance / influenceRadius);
        const pushStrength = 50 * influence;
        
        const angle = Math.atan2(deltaY, deltaX);
        translateX = -Math.cos(angle) * pushStrength;
        translateY = -Math.sin(angle) * pushStrength;
        rotation = shape.baseRotation + (influence * 45);
        scale = 1 + (influence * 0.15);
      }

      // Only apply parallax to non-draggable shapes
      const parallaxOffset = shape.draggable ? 0 : scrollY * shape.parallaxSpeed;
      translateY -= parallaxOffset;

      shapeTransforms[shape.id] = { translateX, translateY, rotation, scale };
    });
    
    shapeTransforms = { ...shapeTransforms };
  };

  // ============================================
  // DRAG & DROP HANDLERS
  // ============================================
  
  function handleShapeMouseDown(e: MouseEvent, shapeId: number) {
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape || !shape.draggable || shape.collected || isSupernova) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    isDragging = true;
    draggedShapeId = shapeId;
    
    const rect = heroSection.getBoundingClientRect();
    dragStartX = (shape.x / 100) * rect.width;
    dragStartY = (shape.y / 100) * rect.height;
    dragOffsetX = e.clientX - rect.left - dragStartX;
    dragOffsetY = e.clientY - rect.top - dragStartY;
    
    // Add global listeners
    window.addEventListener('mousemove', handleDragMove);
    window.addEventListener('mouseup', handleDragEnd);
  }
  
  function handleDragMove(e: MouseEvent) {
    if (!isDragging || draggedShapeId === null || !heroSection) return;
    
    const rect = heroSection.getBoundingClientRect();
    const newX = e.clientX - rect.left - dragOffsetX;
    const newY = e.clientY - rect.top - dragOffsetY;
    
    // Update shape position (as percentage)
    const shapeIndex = shapes.findIndex(s => s.id === draggedShapeId);
    if (shapeIndex !== -1) {
      shapes[shapeIndex].x = (newX / rect.width) * 100;
      shapes[shapeIndex].y = (newY / rect.height) * 100;
      shapes = [...shapes]; // Trigger reactivity
    }
    
    // Check proximity to XR Art center for visual feedback
    if (xrArtElement) {
      const xrRect = xrArtElement.getBoundingClientRect();
      const xrCenterX = xrRect.left + xrRect.width / 2 - rect.left;
      const xrCenterY = xrRect.top + xrRect.height / 2 - rect.top;
      
      const distance = Math.sqrt((newX - xrCenterX) ** 2 + (newY - xrCenterY) ** 2);
      const dropZoneRadius = 120;
      
      if (distance < dropZoneRadius * 1.5) {
        reactionIntensity = Math.max(0, 1 - distance / (dropZoneRadius * 1.5));
        xrArtReacting = true;
      } else {
        xrArtReacting = false;
        reactionIntensity = 0;
      }
    }
  }
  
  function handleDragEnd(e: MouseEvent) {
    if (!isDragging || draggedShapeId === null || !heroSection) {
      cleanupDrag();
      return;
    }
    
    const rect = heroSection.getBoundingClientRect();
    const shape = shapes.find(s => s.id === draggedShapeId);
    
    if (shape && xrArtElement) {
      const xrRect = xrArtElement.getBoundingClientRect();
      const xrCenterX = xrRect.left + xrRect.width / 2 - rect.left;
      const xrCenterY = xrRect.top + xrRect.height / 2 - rect.top;
      
      const shapeX = (shape.x / 100) * rect.width;
      const shapeY = (shape.y / 100) * rect.height;
      const distance = Math.sqrt((shapeX - xrCenterX) ** 2 + (shapeY - xrCenterY) ** 2);
      
      const dropZoneRadius = 120;
      
      if (distance < dropZoneRadius) {
        // Shape was dropped in the XR Art zone - collect it!
        collectShape(draggedShapeId);
      }
    }
    
    cleanupDrag();
  }
  
  function cleanupDrag() {
    isDragging = false;
    draggedShapeId = null;
    xrArtReacting = false;
    reactionIntensity = 0;
    window.removeEventListener('mousemove', handleDragMove);
    window.removeEventListener('mouseup', handleDragEnd);
  }
  
  // Video game-style collect sound (coin/power-up feel)
  function playCollectSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Main tone - pleasant mid-range frequency
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(440, audioCtx.currentTime); // A4
      osc1.frequency.setValueAtTime(523, audioCtx.currentTime + 0.08); // C5
      osc1.frequency.setValueAtTime(659, audioCtx.currentTime + 0.16); // E5
      
      gain1.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.35);
      
      // Harmony tone - adds richness
      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(330, audioCtx.currentTime); // E4
      osc2.frequency.setValueAtTime(392, audioCtx.currentTime + 0.08); // G4
      osc2.frequency.setValueAtTime(494, audioCtx.currentTime + 0.16); // B4
      
      gain2.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      
      osc2.start(audioCtx.currentTime);
      osc2.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // Audio not supported, silently ignore
    }
  }
  
  function collectShape(shapeId: number) {
    const shapeIndex = shapes.findIndex(s => s.id === shapeId);
    if (shapeIndex === -1) return;
    
    // Play video game collect sound
    playCollectSound();
    
    // Mark shape as collected (will animate it being absorbed)
    shapes[shapeIndex].collected = true;
    shapes = [...shapes];
    
    collectedShapes++;
    
    // Trigger XR Art reaction
    triggerAbsorptionReaction();
    
    // Check for supernova
    if (collectedShapes >= 5) {
      setTimeout(() => {
        triggerSupernova();
      }, 500);
    }
  }
  
  function triggerAbsorptionReaction() {
    xrArtReacting = true;
    reactionIntensity = 1;
    
    setTimeout(() => {
      xrArtReacting = false;
      reactionIntensity = 0;
    }, 600);
  }
  
  // Epic supernova explosion sound
  function playSupernovaSound() {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Rising sweep - building energy
      const sweep = audioCtx.createOscillator();
      const sweepGain = audioCtx.createGain();
      sweep.connect(sweepGain);
      sweepGain.connect(audioCtx.destination);
      
      sweep.type = 'sawtooth';
      sweep.frequency.setValueAtTime(80, audioCtx.currentTime);
      sweep.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 0.8);
      sweep.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 1.5);
      
      sweepGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
      sweepGain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.6);
      sweepGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
      
      sweep.start(audioCtx.currentTime);
      sweep.stop(audioCtx.currentTime + 2);
      
      // Impact bass hit
      const bass = audioCtx.createOscillator();
      const bassGain = audioCtx.createGain();
      bass.connect(bassGain);
      bassGain.connect(audioCtx.destination);
      
      bass.type = 'sine';
      bass.frequency.setValueAtTime(120, audioCtx.currentTime + 0.6);
      bass.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 1.5);
      
      bassGain.gain.setValueAtTime(0, audioCtx.currentTime);
      bassGain.gain.setValueAtTime(0.4, audioCtx.currentTime + 0.6);
      bassGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
      
      bass.start(audioCtx.currentTime);
      bass.stop(audioCtx.currentTime + 2);
      
      // Shimmer/sparkle layer
      const shimmer = audioCtx.createOscillator();
      const shimmerGain = audioCtx.createGain();
      shimmer.connect(shimmerGain);
      shimmerGain.connect(audioCtx.destination);
      
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(600, audioCtx.currentTime + 0.5);
      shimmer.frequency.setValueAtTime(800, audioCtx.currentTime + 0.7);
      shimmer.frequency.setValueAtTime(1000, audioCtx.currentTime + 0.9);
      shimmer.frequency.setValueAtTime(800, audioCtx.currentTime + 1.1);
      shimmer.frequency.exponentialRampToValueAtTime(400, audioCtx.currentTime + 2);
      
      shimmerGain.gain.setValueAtTime(0, audioCtx.currentTime);
      shimmerGain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.6);
      shimmerGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2.2);
      
      shimmer.start(audioCtx.currentTime);
      shimmer.stop(audioCtx.currentTime + 2.2);
      
      // White noise burst for explosion texture
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      
      const noise = audioCtx.createBufferSource();
      noise.buffer = noiseBuffer;
      
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(200, audioCtx.currentTime);
      noiseFilter.frequency.linearRampToValueAtTime(3000, audioCtx.currentTime + 0.6);
      noiseFilter.frequency.exponentialRampToValueAtTime(500, audioCtx.currentTime + 2);
      
      const noiseGain = audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.6);
      noiseGain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 2);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(audioCtx.destination);
      noise.start(audioCtx.currentTime);
      noise.stop(audioCtx.currentTime + 2);
      
    } catch (e) {
      // Audio not supported, silently ignore
    }
  }

  // Persistent energy hum for golden state
  function startEnergyHum() {
    if (isEnergyPlaying || !browser) return;
    
    try {
      energyAudioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create master gain for overall volume control
      const masterGain = energyAudioCtx.createGain();
      masterGain.gain.setValueAtTime(0, energyAudioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.15, energyAudioCtx.currentTime + 0.5);
      masterGain.connect(energyAudioCtx.destination);
      energyGains.push(masterGain);
      
      // LFO for pulsating effect
      energyLFO = energyAudioCtx.createOscillator();
      energyLFO.type = 'sine';
      energyLFO.frequency.setValueAtTime(2, energyAudioCtx.currentTime); // Pulse 2x per second
      
      const lfoGain = energyAudioCtx.createGain();
      lfoGain.gain.setValueAtTime(0.3, energyAudioCtx.currentTime);
      energyLFO.connect(lfoGain);
      
      // Base drone - low frequency hum
      const drone1 = energyAudioCtx.createOscillator();
      drone1.type = 'sine';
      drone1.frequency.setValueAtTime(32, energyAudioCtx.currentTime); // Sub-bass C1
      
      const drone1Gain = energyAudioCtx.createGain();
      drone1Gain.gain.setValueAtTime(0.4, energyAudioCtx.currentTime);
      lfoGain.connect(drone1Gain.gain); // LFO modulates this
      drone1.connect(drone1Gain);
      drone1Gain.connect(masterGain);
      energyOscillators.push(drone1);
      energyGains.push(drone1Gain);
      
      // Mid harmonic - adds richness
      const drone2 = energyAudioCtx.createOscillator();
      drone2.type = 'triangle';
      drone2.frequency.setValueAtTime(65, energyAudioCtx.currentTime); // C2
      
      const drone2Gain = energyAudioCtx.createGain();
      drone2Gain.gain.setValueAtTime(0.2, energyAudioCtx.currentTime);
      drone2.connect(drone2Gain);
      drone2Gain.connect(masterGain);
      energyOscillators.push(drone2);
      energyGains.push(drone2Gain);
      
      // High shimmer - ethereal quality
      const shimmer = energyAudioCtx.createOscillator();
      shimmer.type = 'sine';
      shimmer.frequency.setValueAtTime(262, energyAudioCtx.currentTime); // C4 (middle C)
      
      // Slight detuning for movement
      const shimmerLFO = energyAudioCtx.createOscillator();
      shimmerLFO.type = 'sine';
      shimmerLFO.frequency.setValueAtTime(0.5, energyAudioCtx.currentTime);
      const shimmerLFOGain = energyAudioCtx.createGain();
      shimmerLFOGain.gain.setValueAtTime(10, energyAudioCtx.currentTime);
      shimmerLFO.connect(shimmerLFOGain);
      shimmerLFOGain.connect(shimmer.frequency);
      
      const shimmerGain = energyAudioCtx.createGain();
      shimmerGain.gain.setValueAtTime(0.05, energyAudioCtx.currentTime);
      shimmer.connect(shimmerGain);
      shimmerGain.connect(masterGain);
      energyOscillators.push(shimmer);
      energyOscillators.push(shimmerLFO);
      energyGains.push(shimmerGain);
      
      // Start all oscillators
      energyLFO.start(energyAudioCtx.currentTime);
      shimmerLFO.start(energyAudioCtx.currentTime);
      drone1.start(energyAudioCtx.currentTime);
      drone2.start(energyAudioCtx.currentTime);
      shimmer.start(energyAudioCtx.currentTime);
      
      // Fire crackling effect - random bursts every 1-3 seconds
      const playCrackle = () => {
        if (!energyAudioCtx || !isEnergyPlaying) return;
        
        // Create multiple small crackle bursts
        const numCrackles = Math.floor(Math.random() * 4) + 2; // 2-5 crackles
        
        for (let i = 0; i < numCrackles; i++) {
          const delay = Math.random() * 0.3; // Spread over 300ms
          
          // Create noise buffer for crackle
          const bufferSize = energyAudioCtx.sampleRate * 0.05; // 50ms burst
          const noiseBuffer = energyAudioCtx.createBuffer(1, bufferSize, energyAudioCtx.sampleRate);
          const output = noiseBuffer.getChannelData(0);
          
          // Generate crackling noise with random spikes
          for (let j = 0; j < bufferSize; j++) {
            // Create spiky, crackly texture
            const spike = Math.random() > 0.7 ? (Math.random() * 2 - 1) * 2 : 0;
            output[j] = (Math.random() * 2 - 1) * 0.3 + spike;
          }
          
          const noise = energyAudioCtx.createBufferSource();
          noise.buffer = noiseBuffer;
          
          // Bandpass filter for fire-like crackling tone
          const filter = energyAudioCtx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(800 + Math.random() * 1200, energyAudioCtx.currentTime); // 800-2000Hz
          filter.Q.setValueAtTime(1.5, energyAudioCtx.currentTime);
          
          // Sharp attack, quick decay envelope
          const crackleGain = energyAudioCtx.createGain();
          const startTime = energyAudioCtx.currentTime + delay;
          crackleGain.gain.setValueAtTime(0, startTime);
          crackleGain.gain.linearRampToValueAtTime(0.08 + Math.random() * 0.06, startTime + 0.005);
          crackleGain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.04 + Math.random() * 0.03);
          
          noise.connect(filter);
          filter.connect(crackleGain);
          crackleGain.connect(masterGain);
          
          noise.start(startTime);
          noise.stop(startTime + 0.1);
        }
      };
      
      // Initial crackle after a short delay
      setTimeout(playCrackle, 500);
      
      // Set up random interval for crackling (every 1-3 seconds)
      const scheduleCrackle = () => {
        if (!isEnergyPlaying) return;
        const nextDelay = 1000 + Math.random() * 2000; // 1-3 seconds
        crackleInterval = setTimeout(() => {
          playCrackle();
          scheduleCrackle();
        }, nextDelay);
      };
      scheduleCrackle();
      
      isEnergyPlaying = true;
      
    } catch (e) {
      // Audio not supported, silently ignore
    }
  }
  
  function stopEnergyHum() {
    if (!isEnergyPlaying || !energyAudioCtx) return;
    
    try {
      const fadeTime = 0.5;
      const currentTime = energyAudioCtx.currentTime;
      
      // Fade out master gain
      if (energyGains[0]) {
        energyGains[0].gain.setValueAtTime(energyGains[0].gain.value, currentTime);
        energyGains[0].gain.linearRampToValueAtTime(0, currentTime + fadeTime);
      }
      
      // Stop and disconnect after fade
      setTimeout(() => {
        energyOscillators.forEach(osc => {
          try { osc.stop(); } catch (e) {}
        });
        if (energyLFO) {
          try { energyLFO.stop(); } catch (e) {}
        }
        if (crackleInterval) {
          clearTimeout(crackleInterval);
          crackleInterval = null;
        }
        if (energyAudioCtx) {
          energyAudioCtx.close();
          energyAudioCtx = null;
        }
        energyOscillators = [];
        energyGains = [];
        energyLFO = null;
        isEnergyPlaying = false;
      }, fadeTime * 1000 + 100);
      
    } catch (e) {
      // Silently ignore
    }
  }
  
  // Check if hero section is visible
  function isHeroVisible(): boolean {
    if (!heroSection || !browser) return false;
    const rect = heroSection.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    // Consider visible if at least 30% of hero is in viewport
    return rect.top < windowHeight * 0.7 && rect.bottom > windowHeight * 0.3;
  }
  
  // Reactive statement to handle scroll-based sound control
  // Using scrollY to trigger reactivity on scroll changes
  $: if (browser && supernovaComplete && scrollY >= 0) {
    if (isHeroVisible()) {
      if (!isEnergyPlaying) {
        startEnergyHum();
      }
    } else {
      if (isEnergyPlaying) {
        stopEnergyHum();
      }
    }
  }
  
  function triggerSupernova() {
    isSupernova = true;
    
    // Play epic supernova sound
    playSupernovaSound();
    
    // After supernova animation completes
    setTimeout(() => {
      supernovaComplete = true;
    }, 2500);
  }
  
  // ============================================
  // MOBILE TAP-TO-COLLECT
  // ============================================
  function handleMobileTap(shapeId: number) {
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape || !shape.draggable || shape.collected || isSupernova || flyingShapeId !== null) return;
    
    flyingShapeId = shapeId;
    xrArtReacting = true;
    reactionIntensity = 0.8;
    
    // Calculate XR art center position as percentage of hero section
    let targetX = 50;
    let targetY = 35;
    if (xrArtElement && heroSection) {
      const heroRect = heroSection.getBoundingClientRect();
      const xrRect = xrArtElement.getBoundingClientRect();
      targetX = ((xrRect.left + xrRect.width / 2 - heroRect.left) / heroRect.width) * 100;
      targetY = ((xrRect.top + xrRect.height / 2 - heroRect.top) / heroRect.height) * 100;
    }
    
    const startX = shape.x;
    const startY = shape.y;
    const duration = 450;
    const startTime = performance.now();
    
    function animateFly(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3); // Ease-out cubic
      
      const shapeIndex = shapes.findIndex(s => s.id === shapeId);
      if (shapeIndex !== -1) {
        shapes[shapeIndex].x = startX + (targetX - startX) * eased;
        shapes[shapeIndex].y = startY + (targetY - startY) * eased;
        shapes = [...shapes];
      }
      
      if (t < 1) {
        requestAnimationFrame(animateFly);
      } else {
        collectShape(shapeId);
        flyingShapeId = null;
      }
    }
    
    requestAnimationFrame(animateFly);
  }

  // Touch support for mobile & desktop
  function handleShapeTouchStart(e: TouchEvent, shapeId: number) {
    const shape = shapes.find(s => s.id === shapeId);
    if (!shape || !shape.draggable || shape.collected || isSupernova) return;
    
    e.preventDefault();
    
    // On mobile, use tap-to-collect instead of drag
    if (isMobile) {
      handleMobileTap(shapeId);
      return;
    }
    
    const touch = e.touches[0];
    isDragging = true;
    draggedShapeId = shapeId;
    
    const rect = heroSection.getBoundingClientRect();
    dragStartX = (shape.x / 100) * rect.width;
    dragStartY = (shape.y / 100) * rect.height;
    dragOffsetX = touch.clientX - rect.left - dragStartX;
    dragOffsetY = touch.clientY - rect.top - dragStartY;
    
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
  }
  
  function handleTouchMove(e: TouchEvent) {
    if (!isDragging || draggedShapeId === null || !heroSection) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const rect = heroSection.getBoundingClientRect();
    const newX = touch.clientX - rect.left - dragOffsetX;
    const newY = touch.clientY - rect.top - dragOffsetY;
    
    const shapeIndex = shapes.findIndex(s => s.id === draggedShapeId);
    if (shapeIndex !== -1) {
      shapes[shapeIndex].x = (newX / rect.width) * 100;
      shapes[shapeIndex].y = (newY / rect.height) * 100;
      shapes = [...shapes];
    }
    
    // Check proximity to XR Art
    if (xrArtElement) {
      const xrRect = xrArtElement.getBoundingClientRect();
      const xrCenterX = xrRect.left + xrRect.width / 2 - rect.left;
      const xrCenterY = xrRect.top + xrRect.height / 2 - rect.top;
      
      const distance = Math.sqrt((newX - xrCenterX) ** 2 + (newY - xrCenterY) ** 2);
      const dropZoneRadius = 120;
      
      if (distance < dropZoneRadius * 1.5) {
        reactionIntensity = Math.max(0, 1 - distance / (dropZoneRadius * 1.5));
        xrArtReacting = true;
      } else {
        xrArtReacting = false;
        reactionIntensity = 0;
      }
    }
  }
  
  function handleTouchEnd(e: TouchEvent) {
    if (!isDragging || draggedShapeId === null || !heroSection) {
      cleanupTouch();
      return;
    }
    
    const rect = heroSection.getBoundingClientRect();
    const shape = shapes.find(s => s.id === draggedShapeId);
    
    if (shape && xrArtElement) {
      const xrRect = xrArtElement.getBoundingClientRect();
      const xrCenterX = xrRect.left + xrRect.width / 2 - rect.left;
      const xrCenterY = xrRect.top + xrRect.height / 2 - rect.top;
      
      const shapeX = (shape.x / 100) * rect.width;
      const shapeY = (shape.y / 100) * rect.height;
      const distance = Math.sqrt((shapeX - xrCenterX) ** 2 + (shapeY - xrCenterY) ** 2);
      
      const dropZoneRadius = 120;
      
      if (distance < dropZoneRadius) {
        collectShape(draggedShapeId);
      }
    }
    
    cleanupTouch();
  }
  
  function cleanupTouch() {
    isDragging = false;
    draggedShapeId = null;
    xrArtReacting = false;
    reactionIntensity = 0;
    window.removeEventListener('touchmove', handleTouchMove);
    window.removeEventListener('touchend', handleTouchEnd);
  }

  // Update shapes when scrollY changes
  $: if (scrollY !== undefined && !isDragging) {
    updateShapeTransforms();
  }
</script>

<section 
  class="hero-section" 
  class:supernova-active={isSupernova}
  bind:this={heroSection}
  on:mousemove={handleMouseMove}
  role="banner"
  aria-label="Hero section"
>
  <!-- Supernova Flash Overlay -->
  {#if isSupernova}
    <div class="supernova-flash"></div>
    <div class="supernova-particles"></div>
    <div class="supernova-rings"></div>
  {/if}

  <!-- Constellation Particle Canvas - The Cherry on Top! -->
  <canvas 
    bind:this={canvas} 
    class="constellation-canvas"
    class:fade-out={isSupernova}
    aria-hidden="true"
  ></canvas>

  <!-- Animated Background Grid -->
  <div class="grid-background" style="transform: translateY({scrollY * 0.1}px);"></div>
  
  <!-- Shape Collection Progress -->
  {#if collectedShapes > 0 && !isSupernova}
    <div class="collection-progress">
      <div class="progress-label">Energy Collected</div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: {(collectedShapes / 5) * 100}%"></div>
      </div>
      <div class="progress-count">{collectedShapes} / 5</div>
    </div>
  {/if}
  
  <!-- Geometric Shapes -->
  {#each shapes as shape (shape.id)}
    {#if !shape.collected}
      <!-- svelte-ignore a11y-no-noninteractive-tabindex -->
      <div 
        class="geo-shape-wrapper"
        class:draggable={shape.draggable && !isSupernova}
        class:dragging={draggedShapeId === shape.id}
        class:flying={flyingShapeId === shape.id}
        style="
          left: {shape.x}%;
          top: {shape.y}%;
          width: {shape.size}px;
          height: {shape.size}px;
          transform: translate(-50%, -50%) 
            translateX({isDragging && draggedShapeId === shape.id ? 0 : (shapeTransforms[shape.id]?.translateX || 0)}px) 
            translateY({isDragging && draggedShapeId === shape.id ? 0 : (shapeTransforms[shape.id]?.translateY || 0)}px) 
            scale({draggedShapeId === shape.id ? 1.3 : (shapeTransforms[shape.id]?.scale || 1)});
          z-index: {draggedShapeId === shape.id ? 100 : 15};
        "
        on:mousedown={(e) => handleShapeMouseDown(e, shape.id)}
        on:touchstart={(e) => handleShapeTouchStart(e, shape.id)}
        on:mouseenter={() => { if (shape.draggable && !isSupernova) isHoveringDraggable = true; }}
        on:mouseleave={() => { isHoveringDraggable = false; }}
        role={shape.draggable ? "button" : "presentation"}
        tabindex={shape.draggable ? 0 : -1}
        aria-label={shape.draggable ? `Drag ${shape.type} shape to center` : undefined}
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
    {:else}
      <!-- Absorbed shape animation -->
      <div 
        class="geo-shape-wrapper absorbed"
        style="
          left: 50%;
          top: 35%;
          width: {shape.size}px;
          height: {shape.size}px;
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
    {/if}
  {/each}

  <!-- Subtle Cursor Glow -->
  <div 
    class="cursor-glow"
    style="left: {mouseX}px; top: {mouseY}px;"
  ></div>

  <!-- Hero Content -->
  <div class="hero-content" class:supernova-content={supernovaComplete} style="transform: translateY({scrollY * -0.2}px);">
    <div 
      class="xr-art-hero" 
      class:revealed={xrArtRevealed}
      class:reacting={xrArtReacting}
      class:supernova={isSupernova}
      class:golden-state={supernovaComplete}
      class:hint-glow={isHoveringDraggable && !isSupernova}
      bind:this={xrArtElement}
      style="--reaction-intensity: {reactionIntensity};"
    >
      <XRAbstractArt size="lg" interactive={!isMobile} />
      <!-- Drop Zone Indicator -->
      <div class="drop-zone" class:active={xrArtReacting}></div>
      <!-- Golden Aura - Super Saiyan State -->
      {#if supernovaComplete}
        <div class="golden-aura"></div>
        <div class="golden-particles"></div>
        <div class="golden-lightning"></div>
      {/if}
    </div>

    <!-- Game Hint -->
    {#if !isSupernova && !supernovaComplete && heroRevealed && collectedShapes === 0}
      <div class="game-hint">
        <span class="hint-icon">✨</span>
        <span>{isMobile ? 'Tap the glowing shapes!' : 'Drag shapes to the center!'}</span>
      </div>
    {/if}
    
    <div class="hero-badge" class:revealed={heroRevealed}>
      <span class="badge-dot"></span>
      <span>Immersive Technology Studio</span>
    </div>
    
    <h1 class="hero-title" class:revealed={heroRevealed}>
      <span class="title-line">{typedTitle1}<span class="typewriter-cursor" class:hidden={typedTitle1.length === titleLine1.length}></span></span>
      <span class="title-line gradient-text">{typedTitle2}<span class="typewriter-cursor" class:hidden={typedTitle2.length !== titleLine2.length || typewriterComplete}></span></span>
    </h1>
    
    <p class="hero-subtitle" class:revealed={heroRevealed}>
      {typedSubtitle}<span class="typewriter-cursor subtitle-cursor" class:hidden={typewriterComplete}></span>
    </p>

    <!-- Value Props -->
    <div class="value-props" class:revealed={typewriterComplete}>
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

    <div class="hero-cta" class:revealed={typewriterComplete}>
      <a href="/cosmic" class="btn-primary">
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

  /* Draggable shapes */
  .geo-shape-wrapper.draggable {
    pointer-events: auto;
    cursor: grab;
    filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.3));
  }
  
  .geo-shape-wrapper.draggable .geo-shape {
    border: 2px solid rgba(255, 215, 0, 0.7) !important;
    box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.2);
  }
  
  .geo-shape-wrapper.draggable:hover {
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.8)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.5));
  }
  
  .geo-shape-wrapper.draggable:hover .geo-shape {
    border-color: rgba(255, 215, 0, 1) !important;
  }
  
  .geo-shape-wrapper.dragging {
    cursor: grabbing;
    filter: brightness(1.5) drop-shadow(0 0 30px rgba(0, 196, 0, 0.8));
    transition: none;
  }
  
  .geo-shape-wrapper.absorbed {
    animation: absorb 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    pointer-events: none;
  }
  
  @keyframes absorb {
    0% {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(0.5) rotate(180deg);
    }
    100% {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0) rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .geo-shape-wrapper:not(.draggable) {
      opacity: 0.3;
      transform: translate(-50%, -50%) scale(0.6) translateZ(0) !important;
    }
    
    .geo-shape-wrapper.draggable {
      opacity: 1;
      cursor: pointer;
      animation: mobileTapPulse 2s ease-in-out infinite;
      transform: translate(-50%, -50%) scale(0.75) translateZ(0) !important;
    }
    
    .geo-shape-wrapper.dragging {
      transform: translate(-50%, -50%) scale(0.98) translateZ(0) !important;
    }
    
    .geo-shape-wrapper.draggable.flying {
      filter: brightness(2) drop-shadow(0 0 20px rgba(0, 196, 0, 0.8)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.5));
      animation: none;
      pointer-events: none;
      z-index: 100;
    }
  }

  @keyframes mobileTapPulse {
    0%, 100% {
      filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 15px rgba(255, 215, 0, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.9)) drop-shadow(0 0 40px rgba(255, 215, 0, 0.5));
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
    position: relative;
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(40px);
    will-change: transform, filter;
    transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
                filter 0.3s ease;
  }

  .xr-art-hero.revealed {
    opacity: 1;
    transform: translateY(0);
  }
  
  /* Subtle hint glow when hovering over a draggable shape */
  .xr-art-hero.hint-glow {
    filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.2));
    animation: hintPulse 1.5s ease-in-out infinite;
  }
  
  @keyframes hintPulse {
    0%, 100% { 
      filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4)) drop-shadow(0 0 30px rgba(255, 215, 0, 0.2));
    }
    50% { 
      filter: drop-shadow(0 0 25px rgba(255, 215, 0, 0.6)) drop-shadow(0 0 45px rgba(255, 215, 0, 0.3));
    }
  }
  
  /* XR Art Reactions when shapes approach */
  .xr-art-hero.reacting {
    filter: brightness(calc(1 + var(--reaction-intensity) * 0.5)) 
            drop-shadow(0 0 calc(20px + var(--reaction-intensity) * 40px) rgba(0, 196, 0, calc(0.3 + var(--reaction-intensity) * 0.5)));
    animation: xrPulse 0.3s ease-in-out infinite;
  }
  
  @keyframes xrPulse {
    0%, 100% { transform: translateY(0) scale(1); }
    50% { transform: translateY(-2px) scale(1.02); }
  }
  
  /* Supernova state */
  .xr-art-hero.supernova {
    animation: supernovaCore 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }
  
  @keyframes supernovaCore {
    0% {
      transform: translateY(0) scale(1);
      filter: brightness(1);
    }
    30% {
      transform: translateY(0) scale(1.5);
      filter: brightness(3) drop-shadow(0 0 100px rgba(255, 255, 255, 1));
    }
    60% {
      transform: translateY(0) scale(2);
      filter: brightness(5) drop-shadow(0 0 200px rgba(255, 215, 0, 1));
    }
    100% {
      transform: translateY(0) scale(1);
      filter: brightness(1.2) drop-shadow(0 0 30px rgba(0, 196, 0, 0.5));
    }
  }
  
  /* Drop zone indicator */
  .drop-zone {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 240px;
    height: 240px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    border: 2px dashed transparent;
    pointer-events: none;
    transition: all 0.3s ease;
  }
  
  .drop-zone.active {
    border-color: rgba(0, 196, 0, 0.6);
    background: radial-gradient(circle, rgba(0, 196, 0, 0.1) 0%, transparent 70%);
    animation: dropZonePulse 0.8s ease-in-out infinite;
  }
  
  @keyframes dropZonePulse {
    0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
    50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.7; }
  }

  /* ============================================
     GOLDEN STATE - SUPER SAIYAN TRANSFORMATION
     ============================================ */
  
  .xr-art-hero.golden-state {
    animation: goldenPulse 2s ease-in-out infinite;
    filter: 
      brightness(1.3) 
      saturate(1.2)
      drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))
      drop-shadow(0 0 60px rgba(255, 215, 0, 0.5))
      drop-shadow(0 0 100px rgba(255, 180, 0, 0.3));
  }
  
  .xr-art-hero.golden-state :global(.xr-abstract-container) {
    filter: sepia(0.3) saturate(2) hue-rotate(-10deg);
  }
  
  @keyframes goldenPulse {
    0%, 100% { 
      filter: 
        brightness(1.3) 
        saturate(1.2)
        drop-shadow(0 0 30px rgba(255, 215, 0, 0.8))
        drop-shadow(0 0 60px rgba(255, 215, 0, 0.5))
        drop-shadow(0 0 100px rgba(255, 180, 0, 0.3));
      transform: translateY(0) scale(1);
    }
    50% { 
      filter: 
        brightness(1.5) 
        saturate(1.4)
        drop-shadow(0 0 40px rgba(255, 215, 0, 1))
        drop-shadow(0 0 80px rgba(255, 215, 0, 0.7))
        drop-shadow(0 0 120px rgba(255, 180, 0, 0.4));
      transform: translateY(-3px) scale(1.02);
    }
  }
  
  /* Golden Aura Effect */
  .golden-aura {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 300px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(255, 215, 0, 0.4) 0%,
      rgba(255, 180, 0, 0.2) 30%,
      rgba(255, 150, 0, 0.1) 50%,
      transparent 70%
    );
    animation: auraFlicker 0.1s ease-in-out infinite, auraPulse 2s ease-in-out infinite;
    pointer-events: none;
    z-index: -1;
    will-change: transform, filter;
  }
  
  @keyframes auraFlicker {
    0%, 100% { opacity: 0.9; }
    50% { opacity: 1; }
  }
  
  @keyframes auraPulse {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      filter: blur(20px);
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.15);
      filter: blur(25px);
    }
  }
  
  /* Golden Particles Rising */
  .golden-particles {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 200px;
    height: 200px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: -1;
  }
  
  .golden-particles::before,
  .golden-particles::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 80%, #ffd700 2px, transparent 2px),
      radial-gradient(circle at 80% 70%, #ffaa00 2px, transparent 2px),
      radial-gradient(circle at 40% 60%, #ffd700 1.5px, transparent 1.5px),
      radial-gradient(circle at 60% 90%, #ffcc00 2px, transparent 2px),
      radial-gradient(circle at 30% 40%, #ffd700 1px, transparent 1px),
      radial-gradient(circle at 70% 30%, #ffaa00 1.5px, transparent 1.5px),
      radial-gradient(circle at 50% 20%, #ffd700 2px, transparent 2px),
      radial-gradient(circle at 15% 50%, #ffcc00 1px, transparent 1px),
      radial-gradient(circle at 85% 50%, #ffd700 1.5px, transparent 1.5px);
    animation: particlesRise 3s ease-in-out infinite;
  }
  
  .golden-particles::after {
    animation-delay: 1.5s;
    transform: rotate(180deg);
  }
  
  @keyframes particlesRise {
    0% {
      transform: translateY(20px) scale(0.8);
      opacity: 0;
    }
    20% {
      opacity: 1;
    }
    100% {
      transform: translateY(-80px) scale(1.2);
      opacity: 0;
    }
  }
  
  /* Golden Lightning Bolts */
  .golden-lightning {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 250px;
    height: 250px;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 1;
  }
  
  .golden-lightning::before,
  .golden-lightning::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 40px;
    background: linear-gradient(to bottom, transparent, #ffd700, #fff, #ffd700, transparent);
    filter: blur(1px);
    animation: lightningFlash 0.15s ease-out infinite;
    opacity: 0;
  }
  
  .golden-lightning::before {
    top: 10%;
    left: 15%;
    transform: rotate(-20deg);
    animation-delay: 0s;
  }
  
  .golden-lightning::after {
    top: 20%;
    right: 20%;
    transform: rotate(25deg);
    animation-delay: 0.5s;
  }
  
  @keyframes lightningFlash {
    0%, 89%, 100% { opacity: 0; }
    90%, 95% { opacity: 1; }
  }

  @media (max-width: 768px) {
    .xr-art-hero {
      margin-bottom: 0.5rem;
    }
    
    .xr-art-hero :global(.xr-abstract-container) {
      max-width: 200px;
    }
    
    .drop-zone {
      width: 180px;
      height: 180px;
    }
    
    .golden-aura {
      width: 200px;
      height: 200px;
    }
    
    .golden-particles {
      width: 150px;
      height: 150px;
    }
    
    .golden-lightning {
      width: 180px;
      height: 180px;
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
    /* Fixed height to prevent layout shift during typewriter */
    min-height: calc(1.6em * 4); /* 4 lines at 1.6 line-height */
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

  /* Typewriter cursor */
  .typewriter-cursor {
    display: inline-block;
    width: 3px;
    height: 1em;
    background: #00c400;
    margin-left: 2px;
    vertical-align: text-bottom;
    animation: cursorBlink 0.7s ease-in-out infinite;
  }

  .typewriter-cursor.hidden {
    display: none;
  }

  .subtitle-cursor {
    width: 2px;
    height: 0.9em;
    background: rgba(255, 255, 255, 0.7);
  }

  @keyframes cursorBlink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .typewriter-cursor {
      animation: none;
      opacity: 1;
    }
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
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .value-props.revealed {
    opacity: 1;
    transform: translateY(0);
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
    /* Initial hidden state */
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, 
                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s;
  }

  .hero-cta.revealed {
    opacity: 1;
    transform: translateY(0);
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

  /* ============================================
     GAMIFICATION STYLES
     ============================================ */
  
  /* Supernova Effects */
  .hero-section.supernova-active {
    overflow: hidden;
  }
  
  .supernova-flash {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 35%, rgba(255, 255, 255, 1) 0%, rgba(255, 215, 0, 0.8) 20%, rgba(0, 196, 0, 0.4) 50%, transparent 80%);
    z-index: 1000;
    animation: supernovaFlash 2.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    pointer-events: none;
  }
  
  @keyframes supernovaFlash {
    0% { opacity: 0; transform: scale(0); }
    20% { opacity: 1; transform: scale(1); }
    40% { opacity: 1; transform: scale(1.5); }
    100% { opacity: 0; transform: scale(3); }
  }
  
  .supernova-particles {
    position: absolute;
    inset: 0;
    z-index: 999;
    pointer-events: none;
    animation: supernovaParticles 2.5s ease-out forwards;
  }
  
  .supernova-particles::before,
  .supernova-particles::after {
    content: '';
    position: absolute;
    top: 35%;
    left: 50%;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ffd700;
    box-shadow: 
      0 0 20px 10px rgba(255, 215, 0, 0.8),
      60px -80px 0 0 #00c400,
      -70px -60px 0 0 #ffd700,
      100px 20px 0 0 #8a2be2,
      -90px 40px 0 0 #00ff88,
      40px 100px 0 0 #ffd700,
      -50px 90px 0 0 #00c400,
      120px -40px 0 0 #00ff88,
      -130px -20px 0 0 #8a2be2,
      80px 80px 0 0 #ffd700,
      -100px 70px 0 0 #00c400;
    animation: particlesBurst 2s ease-out forwards;
  }
  
  .supernova-particles::after {
    animation-delay: 0.1s;
    box-shadow: 
      0 0 15px 8px rgba(0, 196, 0, 0.8),
      -80px -50px 0 0 #00ff88,
      90px -70px 0 0 #ffd700,
      -60px 80px 0 0 #8a2be2,
      70px 60px 0 0 #00c400,
      -100px -90px 0 0 #ffd700,
      110px 30px 0 0 #00ff88,
      -40px 110px 0 0 #00c400,
      50px -100px 0 0 #8a2be2;
  }
  
  @keyframes particlesBurst {
    0% { 
      transform: translate(-50%, -50%) scale(0); 
      opacity: 1;
    }
    50% { 
      transform: translate(-50%, -50%) scale(3); 
      opacity: 0.8;
    }
    100% { 
      transform: translate(-50%, -50%) scale(6); 
      opacity: 0;
    }
  }
  
  .supernova-rings {
    position: absolute;
    top: 35%;
    left: 50%;
    width: 100px;
    height: 100px;
    transform: translate(-50%, -50%);
    z-index: 998;
    pointer-events: none;
  }
  
  .supernova-rings::before,
  .supernova-rings::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 3px solid rgba(0, 196, 0, 0.8);
    animation: ringExpand 2s ease-out forwards;
  }
  
  .supernova-rings::after {
    animation-delay: 0.3s;
    border-color: rgba(255, 215, 0, 0.6);
  }
  
  @keyframes ringExpand {
    0% { 
      transform: scale(0); 
      opacity: 1;
    }
    100% { 
      transform: scale(15); 
      opacity: 0;
    }
  }
  
  .constellation-canvas.fade-out {
    animation: canvasFade 1s ease-out forwards;
  }
  
  @keyframes canvasFade {
    0% { opacity: 0.8; }
    100% { opacity: 0.2; }
  }
  
  .hero-content.supernova-content {
    animation: contentReveal 1s ease-out 2s forwards;
  }
  
  @keyframes contentReveal {
    0% { filter: brightness(2); }
    100% { filter: brightness(1); }
  }
  
  /* Collection Progress Bar */
  .collection-progress {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 50;
    animation: fadeIn 0.5s ease-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateX(-50%) translateY(-10px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
  
  .progress-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(0, 196, 0, 0.8);
    font-weight: 600;
  }
  
  .progress-bar {
    width: 200px;
    height: 8px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(0, 196, 0, 0.3);
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00c400, #00ff88, #ffd700);
    border-radius: 4px;
    transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 0 10px rgba(0, 196, 0, 0.5);
  }
  
  .progress-count {
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }
  
  /* Game Hint */
  .game-hint {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.25rem;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.8rem;
    z-index: 50;
    animation: fadeIn 0.5s ease-out, gameHintPulse 3s ease-in-out infinite;
    backdrop-filter: blur(10px);
    white-space: nowrap;
    margin-bottom: 0.75rem;
  }

  @keyframes gameHintPulse {
    0%, 100% { 
      border-color: rgba(0, 196, 0, 0.3);
      box-shadow: 0 0 0 0 rgba(0, 196, 0, 0);
    }
    50% { 
      border-color: rgba(0, 196, 0, 0.6);
      box-shadow: 0 0 20px 5px rgba(0, 196, 0, 0.2);
    }
  }

  @media (max-width: 768px) {
    .game-hint {
      font-size: 0.75rem;
      padding: 0.5rem 1rem;
      margin-bottom: 0.625rem;
    }
  }

  /* Drag Hint */
  .drag-hint {
    position: absolute;
    bottom: 100px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: rgba(0, 0, 0, 0.6);
    border: 1px solid rgba(0, 196, 0, 0.3);
    border-radius: 9999px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    z-index: 50;
    animation: hintPulse 3s ease-in-out infinite, fadeIn 0.5s ease-out;
    backdrop-filter: blur(10px);
  }
  
  @keyframes hintPulse {
    0%, 100% { 
      border-color: rgba(0, 196, 0, 0.3);
      box-shadow: 0 0 0 0 rgba(0, 196, 0, 0);
    }
    50% { 
      border-color: rgba(0, 196, 0, 0.6);
      box-shadow: 0 0 20px 5px rgba(0, 196, 0, 0.2);
    }
  }
  
  .hint-icon {
    animation: sparkle 1.5s ease-in-out infinite;
  }
  
  @keyframes sparkle {
    0%, 100% { transform: scale(1) rotate(0deg); }
    50% { transform: scale(1.2) rotate(15deg); }
  }
  
  @media (max-width: 768px) {
    .collection-progress {
      top: 80px;
    }
    
    .progress-bar {
      width: 150px;
    }
    
    .drag-hint {
      bottom: 80px;
      font-size: 0.75rem;
      padding: 0.5rem 1rem;
    }
  }

</style>
