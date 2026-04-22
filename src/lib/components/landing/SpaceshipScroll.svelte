<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let outer: HTMLElement;
  let canvas: HTMLCanvasElement;

  onMount(() => {
    const section = canvas.parentElement!;
    let W = section.clientWidth;
    let H = section.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 400);
    camera.position.set(0, 3, 18);
    camera.lookAt(0, 0, 0);

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xaaaacc, 0.35));

    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(8, 10, 6);
    scene.add(key);

    const rim = new THREE.DirectionalLight(0x00c400, 0.45);
    rim.position.set(-6, -3, -5);
    scene.add(rim);

    const engineGlow = new THREE.PointLight(0x8a2be2, 6, 8);
    scene.add(engineGlow);

    // --- Materials ---
    const bodyMat    = new THREE.MeshStandardMaterial({ color: 0x12122e, metalness: 0.9, roughness: 0.15 });
    const purpleMat  = new THREE.MeshStandardMaterial({ color: 0x8a2be2, metalness: 0.85, roughness: 0.1, emissive: new THREE.Color(0x250040) });
    const wingMat    = new THREE.MeshStandardMaterial({ color: 0x0a0a1e, metalness: 0.8, roughness: 0.25, side: THREE.DoubleSide });
    const accentMat  = new THREE.MeshBasicMaterial({ color: 0x00c400 });
    const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x00ee99, emissive: new THREE.Color(0x003322), metalness: 0.1, roughness: 0.05, transparent: true, opacity: 0.88 });
    const exhaustMat = new THREE.MeshBasicMaterial({ color: 0x8a2be2, transparent: true, opacity: 0.8 });

    // --- Build ship ---
    const ship = new THREE.Group();

    // Fuselage
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.60, 5.0, 10), bodyMat);
    fuselage.rotation.z = Math.PI / 2;
    ship.add(fuselage);

    // Nose cone
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.32, 2.2, 10), purpleMat);
    nose.rotation.z = -Math.PI / 2;
    nose.position.x = 3.6;
    ship.add(nose);

    // Wings
    const wings = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.06, 4.2), wingMat);
    wings.position.x = -0.3;
    ship.add(wings);

    // Green leading-edge stripes
    const edgeGeo = new THREE.BoxGeometry(3.0, 0.09, 0.09);
    for (const z of [2.2, -2.2]) {
      const e = new THREE.Mesh(edgeGeo, accentMat);
      e.position.set(-0.3, 0, z);
      ship.add(e);
    }

    // Tail fins (vertical)
    const finGeo = new THREE.BoxGeometry(1.1, 0.85, 0.06);
    for (const z of [-0.45, 0.45]) {
      const fin = new THREE.Mesh(finGeo, wingMat);
      fin.position.set(-1.85, 0.42, z);
      ship.add(fin);
    }

    // Cockpit
    const cockpit = new THREE.Mesh(
      new THREE.SphereGeometry(0.28, 12, 12, 0, Math.PI * 2, 0, Math.PI * 0.55),
      cockpitMat
    );
    cockpit.position.set(1.0, 0.34, 0);
    ship.add(cockpit);

    // Engine ring
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.46, 0.08, 8, 20), purpleMat);
    ring.rotation.y = Math.PI / 2;
    ring.position.x = -2.55;
    ship.add(ring);

    // Exhaust cone
    const exhaust = new THREE.Mesh(new THREE.ConeGeometry(0.38, 2.0, 12), exhaustMat);
    exhaust.rotation.z = Math.PI / 2;
    exhaust.position.x = -3.6;
    ship.add(exhaust);

    // Purple hull stripe
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.07, 0.11),
      new THREE.MeshBasicMaterial({ color: 0x5a10a0 })
    );
    stripe.position.set(0.2, 0.34, 0);
    ship.add(stripe);

    scene.add(ship);

    // --- Scroll tracking (natural flow, no sticky trap) ---
    // Progress = how far the section has passed through the viewport
    // 0 = section bottom just entered; 1 = section top just left
    const X_START = -20;
    const X_END   =  20;
    let smoothProgress = 0;
    let targetProgress = 0;

    const getProgress = (): number => {
      const rect = outer.getBoundingClientRect();
      const total = window.innerHeight + rect.height;
      const traveled = window.innerHeight - rect.top;
      return Math.max(0, Math.min(1, traveled / total));
    };

    const onScroll = () => { targetProgress = getProgress(); };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize
    const ro = new ResizeObserver(() => {
      W = section.clientWidth;
      H = section.clientHeight;
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    });
    ro.observe(section);

    const clock = new THREE.Clock();
    let prevSmooth = 0;
    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      smoothProgress += (targetProgress - smoothProgress) * 0.08;
      const delta = smoothProgress - prevSmooth;
      prevSmooth = smoothProgress;

      // Position
      ship.position.x = X_START + (X_END - X_START) * smoothProgress;
      ship.position.y = Math.sin(t * 0.85) * 0.3;

      // Banking & yaw
      ship.rotation.z = THREE.MathUtils.clamp(-delta * 100, -0.38, 0.38);
      ship.rotation.y = -0.2 + THREE.MathUtils.clamp(delta * 40, -0.25, 0.25);

      // Engine light
      engineGlow.position.set(ship.position.x - 3.2, ship.position.y, 0);

      // Exhaust pulse
      const spd = Math.abs(delta) * 500;
      exhaust.scale.x = 1 + spd * 0.3;
      exhaustMat.opacity = 0.55 + Math.sin(t * 7) * 0.15;

      // Camera parallax
      camera.position.x = ship.position.x * 0.035;

      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      renderer.dispose();
    };
  });
</script>

<div class="spaceship-section" bind:this={outer}>
  <canvas bind:this={canvas} />
</div>

<style>
  .spaceship-section {
    position: relative;
    width: 100%;
    height: 55vh;
    overflow: hidden;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 768px) {
    .spaceship-section {
      height: 40vh;
    }
  }
</style>
