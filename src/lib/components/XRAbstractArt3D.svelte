<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import { browser } from '$app/environment';

  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let className: string = '';
  export let interactive: boolean = true;

  const sizeMap: Record<string, number> = { sm: 150, md: 220, lg: 300, xl: 400 };

  let container: HTMLDivElement;
  let canvas: HTMLCanvasElement;
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let animId: number | null = null;
  let ro: ResizeObserver;

  // Mouse-reactive rotation targets
  let targetRotX = 0;
  let targetRotY = 0;
  let currentRotX = 0;
  let currentRotY = 0;

  // Animated object refs
  let coreGroup: THREE.Group;
  let coreMat: THREE.MeshBasicMaterial;
  let ring1: THREE.Mesh, ring2: THREE.Mesh, ring3: THREE.Mesh;
  let orbit1: THREE.Group, orbit2: THREE.Group, orbit3: THREE.Group;
  let fragMeshes: THREE.Mesh[] = [];
  let fragBaseY: number[] = [];

  // Color palette
  const C_GREEN  = new THREE.Color('#00C400');
  const C_PURPLE = new THREE.Color('#8A2BE2');
  const C_GOLD   = new THREE.Color('#FFD700');
  const _tmpColor = new THREE.Color();

  function init() {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.z = 5;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.25));
    const gLight = new THREE.PointLight(0x00c400, 3, 10);
    gLight.position.set(2, 2, 3);
    scene.add(gLight);
    const pLight = new THREE.PointLight(0x8a2be2, 3, 10);
    pLight.position.set(-2, -2, 3);
    scene.add(pLight);
    const yLight = new THREE.PointLight(0xffd700, 2, 8);
    yLight.position.set(0, 3, 2);
    scene.add(yLight);

    // ── Central group ──────────────────────────────────────
    coreGroup = new THREE.Group();

    // Icosahedron wireframe — color-shifts green→purple→gold
    const icoGeo = new THREE.IcosahedronGeometry(0.9, 1);
    coreMat = new THREE.MeshBasicMaterial({
      color: 0x00c400,
      wireframe: true,
      transparent: true,
      opacity: 0.7,
    });
    coreGroup.add(new THREE.Mesh(icoGeo, coreMat));

    // Inner glowing sphere (purple)
    const sphGeo = new THREE.SphereGeometry(0.35, 16, 16);
    coreGroup.add(new THREE.Mesh(sphGeo, new THREE.MeshBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.75 })));

    // Pulsing aura shell
    const auraGeo = new THREE.SphereGeometry(0.65, 16, 16);
    coreGroup.add(new THREE.Mesh(auraGeo, new THREE.MeshBasicMaterial({ color: 0x00c400, transparent: true, opacity: 0.07, side: THREE.BackSide })));

    scene.add(coreGroup);

    // ── Three intersecting torus rings ─────────────────────
    // Each ring mirrors the 3 animated ellipses in the SVG
    const torusGeo = new THREE.TorusGeometry(1.5, 0.025, 6, 100);

    ring1 = new THREE.Mesh(torusGeo, new THREE.MeshBasicMaterial({ color: 0x00c400, transparent: true, opacity: 0.85 }));
    // ring1 lies flat (XZ plane) — like the horizontal ellipse
    scene.add(ring1);

    ring2 = new THREE.Mesh(torusGeo, new THREE.MeshBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.7 }));
    ring2.rotation.x = Math.PI / 3; // 60° tilt
    scene.add(ring2);

    ring3 = new THREE.Mesh(torusGeo, new THREE.MeshBasicMaterial({ color: 0xffd700, transparent: true, opacity: 0.5 }));
    ring3.rotation.x = -Math.PI / 3;
    ring3.rotation.y = Math.PI / 4;
    scene.add(ring3);

    // ── Orbiting data nodes ────────────────────────────────
    const nodeGeo = new THREE.SphereGeometry(0.08, 8, 8);

    orbit1 = new THREE.Group();
    const n1 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0x00c400 }));
    n1.position.set(1.5, 0, 0);
    orbit1.add(n1);
    scene.add(orbit1);

    orbit2 = new THREE.Group();
    orbit2.rotation.x = Math.PI / 3;
    const n2 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0x8a2be2 }));
    n2.position.set(1.5, 0, 0);
    orbit2.add(n2);
    scene.add(orbit2);

    orbit3 = new THREE.Group();
    orbit3.rotation.x = -Math.PI / 3;
    orbit3.rotation.y = Math.PI / 4;
    const n3 = new THREE.Mesh(nodeGeo, new THREE.MeshBasicMaterial({ color: 0xffd700 }));
    n3.position.set(1.5, 0, 0);
    orbit3.add(n3);
    scene.add(orbit3);

    // ── Floating corner fragments (tetrahedra) ─────────────
    const fragGeo = new THREE.TetrahedronGeometry(0.15);
    const fragDefs: Array<[number, number, number, number]> = [
      [-1.8,  1.5, -0.3, 0x00c400],
      [ 1.8,  0.9, -0.3, 0x8a2be2],
      [ 1.7, -1.6, -0.3, 0xffd700],
      [-1.7, -1.3, -0.3, 0x00c400],
      [ 0.4,  2.0, -0.3, 0x8a2be2],
      [-0.4, -2.0, -0.3, 0xffd700],
    ];
    fragMeshes = fragDefs.map(([x, y, z, color]) => {
      const m = new THREE.Mesh(
        fragGeo,
        new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: 0.5 }),
      );
      m.position.set(x, y, z);
      scene.add(m);
      fragBaseY.push(y);
      return m;
    });

    setSize();
    animate();
  }

  function setSize() {
    if (!container || !renderer || !camera) return;
    const w = container.clientWidth  || sizeMap[size];
    const h = container.clientHeight || sizeMap[size];
    if (w === 0 || h === 0) return;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function animate() {
    animId = requestAnimationFrame(animate);
    const t = performance.now() * 0.001;

    // Shift icosahedron wireframe color: green → purple → gold → green (6 s)
    const cycle = (t % 6) / 6;
    if (cycle < 1 / 3) {
      _tmpColor.lerpColors(C_GREEN, C_PURPLE, cycle * 3);
    } else if (cycle < 2 / 3) {
      _tmpColor.lerpColors(C_PURPLE, C_GOLD, (cycle - 1 / 3) * 3);
    } else {
      _tmpColor.lerpColors(C_GOLD, C_GREEN, (cycle - 2 / 3) * 3);
    }
    if (coreMat) coreMat.color.copy(_tmpColor);

    // Rotate rings
    ring1.rotation.z  =  t * 0.30;
    ring2.rotation.z  =  t * 0.20;
    ring3.rotation.z  = -t * 0.15;

    // Spin icosahedron
    coreGroup.rotation.y = t * 0.40;
    coreGroup.rotation.x = t * 0.25;

    // Orbit nodes around their parent ring axes
    orbit1.rotation.y =  t * 1.05;
    orbit2.rotation.y =  t * 0.75;
    orbit3.rotation.y = -t * 0.60;

    // Float & spin corner fragments
    fragMeshes.forEach((f, i) => {
      f.rotation.x = t * 0.4 * (i % 2 === 0 ? 1 : -1);
      f.rotation.y = t * 0.3 * (i % 3 === 0 ? 1 : -1);
      f.position.y  = fragBaseY[i] + Math.sin(t * 0.8 + i * 1.3) * 0.08;
    });

    // Smooth mouse-reactive tilt of the whole scene
    if (interactive) {
      currentRotX += (targetRotX - currentRotX) * 0.05;
      currentRotY += (targetRotY - currentRotY) * 0.05;
      scene.rotation.x = currentRotX;
      scene.rotation.y = currentRotY;
    }

    renderer.render(scene, camera);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!interactive || !container) return;
    const rect = container.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const md   = Math.max(rect.width, rect.height);
    targetRotY =  ((e.clientX - cx) / md) * 0.6;
    targetRotX = -((e.clientY - cy) / md) * 0.6;
  }

  onMount(() => {
    if (!browser) return;
    init();
    ro = new ResizeObserver(setSize);
    ro.observe(container);
    if (interactive) window.addEventListener('mousemove', handleMouseMove);
  });

  onDestroy(() => {
    if (!browser) return;
    if (animId !== null) cancelAnimationFrame(animId);
    if (ro) ro.disconnect();
    if (renderer) renderer.dispose();
    window.removeEventListener('mousemove', handleMouseMove);
  });
</script>

<div
  class="xr3d-container {className}"
  bind:this={container}
  style="--xr-size: {sizeMap[size]}px;"
  role="img"
  aria-label="Abstract XR visualization"
>
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .xr3d-container {
    width: 100%;
    max-width: var(--xr-size, 220px);
    aspect-ratio: 1;
    /* Subtle idle float, matching the original SVG component */
    animation: xr3dFloat 6s ease-in-out infinite;
  }

  @media (prefers-reduced-motion: reduce) {
    .xr3d-container {
      animation: none;
    }
  }

  canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }

  @keyframes xr3dFloat {
    0%,  100% { transform: translateY(0px);   }
    50%        { transform: translateY(-10px); }
  }
</style>
