<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { browser } from '$app/environment';

  interface Shape {
    id: number;
    type: 'hexagon' | 'triangle' | 'square' | 'diamond' | 'circle';
    x: number;
    y: number;
    size: number;
    color: string;
    collected: boolean;
    draggable: boolean;
  }

  export let shapes: Shape[] = [];
  export let shapeTransforms: Record<number, { translateX: number; translateY: number; scale: number }> = {};
  export let draggedShapeId: number | null = null;
  export let flyingShapeId: number | null = null;
  export let isSupernova = false;

  let canvas: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.OrthographicCamera;
  let animId: number | null = null;
  let heroW = 800;
  let heroH = 600;
  let ro: ResizeObserver;

  interface Entry {
    outer: THREE.Mesh;
    spinX: number;
    spinY: number;
  }

  interface AbsorbEntry {
    outer: THREE.Mesh;
    startTime: number;
    lastScale: number;
    lastX: number;
    lastY: number;
  }

  const meshMap = new Map<number, Entry>();
  const absorbMap = new Map<number, AbsorbEntry>();

  // ── Color helpers ─────────────────────────────────────────
  function hexFromColor(c: string): number {
    if (c.includes('255, 215')) return 0xffd700; // gold  — draggable shapes
    if (c.includes('138, 43'))  return 0x8a2be2; // purple
    return 0x00c400;                              // green  — default
  }

  // ── Geometry factories (each "fits" in a unit sphere so scale = size/2) ──
  function makeOuterGeo(type: Shape['type']): THREE.BufferGeometry {
    switch (type) {
      case 'circle':   return new THREE.IcosahedronGeometry(1.0, 1);
      case 'square':   return new THREE.BoxGeometry(1.4, 1.4, 1.4);
      case 'hexagon':  return new THREE.CylinderGeometry(1.0, 1.0, 0.35, 6);
      case 'triangle': return new THREE.TetrahedronGeometry(1.2);
      case 'diamond':  return new THREE.OctahedronGeometry(1.2);
    }
  }

  function makeInnerGeo(type: Shape['type']): THREE.BufferGeometry {
    switch (type) {
      case 'circle':   return new THREE.SphereGeometry(0.55, 12, 12);
      case 'square':   return new THREE.BoxGeometry(1.1, 1.1, 1.1);
      case 'hexagon':  return new THREE.CylinderGeometry(0.75, 0.75, 0.28, 6);
      case 'triangle': return new THREE.TetrahedronGeometry(0.9);
      case 'diamond':  return new THREE.OctahedronGeometry(0.9);
    }
  }

  // ── Create mesh pair for a shape ──────────────────────────
  function addShape(shape: Shape) {
    if (meshMap.has(shape.id)) return;

    const hex = hexFromColor(shape.color);

    // Outer: wireframe shell with additive blending for natural glow
    const outer = new THREE.Mesh(
      makeOuterGeo(shape.type),
      new THREE.MeshBasicMaterial({
        color: hex,
        wireframe: true,
        transparent: true,
        opacity: shape.draggable ? 0.85 : 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );

    // Inner: semi-transparent solid fill — gives depth / holographic look
    const inner = new THREE.Mesh(
      makeInnerGeo(shape.type),
      new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: shape.draggable ? 0.10 : 0.05,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    outer.add(inner);

    // Deterministic spin rates (no Math.random — consistent per shape)
    const id = shape.id;
    const spinX = ((id * 3 % 7) - 3) * 0.006;
    const spinY = ((id * 5 % 11) - 5) * 0.005 + 0.010;

    meshMap.set(shape.id, { outer, spinX, spinY });
    scene.add(outer);
  }

  // ── Cleanup helpers ───────────────────────────────────────
  function disposeMesh(mesh: THREE.Mesh) {
    mesh.geometry.dispose();
    const mat = mesh.material;
    if (Array.isArray(mat)) mat.forEach(m => m.dispose());
    else mat.dispose();
    mesh.children.forEach(child => {
      if (child instanceof THREE.Mesh) disposeMesh(child);
    });
  }

  // ── Coordinate mapping (ortho: 1 world unit = 1 CSS pixel) ──
  function worldPos(shape: Shape, tf: { translateX: number; translateY: number; scale: number }) {
    const screenX = (shape.x / 100) * heroW;
    const screenY = (shape.y / 100) * heroH;
    return {
      x: screenX - heroW / 2 + tf.translateX,
      y: heroH  / 2 - screenY - tf.translateY,
      s: (shape.size / 2) * (tf.scale ?? 1),
    };
  }

  // ── Animation loop ────────────────────────────────────────
  function animate(t = 0) {
    animId = requestAnimationFrame(animate);

    // Active shapes
    for (const [id, entry] of meshMap) {
      const shape = shapes.find(s => s.id === id);
      if (!shape) continue;

      // Continuous spin
      entry.outer.rotation.x += entry.spinX;
      entry.outer.rotation.y += entry.spinY;

      // Position + scale from parent state
      const tf = shapeTransforms[id] ?? { translateX: 0, translateY: 0, scale: 1 };
      const { x, y, s } = worldPos(shape, tf);
      entry.outer.position.set(x, y, 0);

      const isDragged = draggedShapeId === id;
      const isFlying  = flyingShapeId  === id;
      entry.outer.scale.setScalar(s * (isDragged ? 1.3 : isFlying ? 1.1 : 1));

      // Smooth opacity: full bright when dragged, dim during supernova
      const mat = entry.outer.material as THREE.MeshBasicMaterial;
      if (isSupernova) {
        mat.opacity = Math.max(0, mat.opacity - 0.025);
      } else {
        const target = isDragged ? 1.0 : shape.draggable ? 0.85 : 0.45;
        mat.opacity += (target - mat.opacity) * 0.1;
      }
    }

    // Absorption animations (shape collected)
    for (const [id, anim] of absorbMap) {
      const elapsed = (t - anim.startTime) / 600; // 600 ms total
      if (elapsed >= 1) {
        scene.remove(anim.outer);
        disposeMesh(anim.outer);
        absorbMap.delete(id);
      } else {
        const p = 1 - elapsed;
        anim.outer.scale.setScalar(anim.lastScale * p);
        anim.outer.position.set(anim.lastX, anim.lastY, 0);
        anim.outer.rotation.x += 0.08;
        anim.outer.rotation.z += 0.12;
        (anim.outer.material as THREE.MeshBasicMaterial).opacity = 0.85 * p;
      }
    }

    renderer.render(scene, camera);
  }

  // ── Reactive sync with parent shapes array ─────────────────
  $: if (scene) syncShapes(shapes);

  function syncShapes(s: Shape[]) {
    s.forEach(shape => {
      if (!shape.collected && !meshMap.has(shape.id) && !absorbMap.has(shape.id)) {
        addShape(shape);
      } else if (shape.collected && meshMap.has(shape.id)) {
        // Kick off absorption animation
        const entry = meshMap.get(shape.id)!;
        const tf = shapeTransforms[shape.id] ?? { translateX: 0, translateY: 0, scale: 1 };
        const { x, y, s } = worldPos(shape, tf);
        absorbMap.set(shape.id, {
          outer: entry.outer,
          startTime: performance.now(),
          lastScale: s,
          lastX: x,
          lastY: y,
        });
        meshMap.delete(shape.id);
      }
    });
  }

  // ── Resize ────────────────────────────────────────────────
  function setSize() {
    if (!canvas?.parentElement || !renderer || !camera) return;
    heroW = canvas.parentElement.clientWidth  || 800;
    heroH = canvas.parentElement.clientHeight || 600;
    renderer.setSize(heroW, heroH);
    camera.left   = -heroW / 2;
    camera.right  =  heroW / 2;
    camera.top    =  heroH / 2;
    camera.bottom = -heroH / 2;
    camera.updateProjectionMatrix();
  }

  // ── Lifecycle ─────────────────────────────────────────────
  onMount(() => {
    if (!browser) return;

    heroW = canvas.parentElement?.clientWidth  ?? 800;
    heroH = canvas.parentElement?.clientHeight ?? 600;

    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(heroW, heroH);

    scene = new THREE.Scene();

    // Orthographic camera: 1 world unit = 1 CSS pixel
    camera = new THREE.OrthographicCamera(
      -heroW / 2,  heroW / 2,
       heroH / 2, -heroH / 2,
      0.1, 200
    );
    camera.position.z = 50;

    // Build initial meshes
    shapes.forEach(s => { if (!s.collected) addShape(s); });

    animate();

    ro = new ResizeObserver(setSize);
    if (canvas.parentElement) ro.observe(canvas.parentElement);
  });

  onDestroy(() => {
    if (!browser) return;
    if (animId !== null) cancelAnimationFrame(animId);
    if (ro) ro.disconnect();
    meshMap.forEach(e => disposeMesh(e.outer));
    absorbMap.forEach(a => disposeMesh(a.outer));
    if (renderer) renderer.dispose();
  });
</script>

<canvas bind:this={canvas} class="shapes3d-canvas" aria-hidden="true"></canvas>

<style>
  .shapes3d-canvas {
    position: absolute;
    inset: 0;
    pointer-events: none;
    z-index: 15;
    width: 100% !important;
    height: 100% !important;
  }
</style>
