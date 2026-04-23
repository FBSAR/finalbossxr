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
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));

    // Strong front fill so the ship face is always readable
    const fill = new THREE.DirectionalLight(0xffffff, 2.2);
    fill.position.set(0, 4, 20);
    scene.add(fill);

    const key = new THREE.DirectionalLight(0xddeeff, 1.4);
    key.position.set(8, 10, 6);
    scene.add(key);

    // Green rim from below-left for silhouette contrast
    const rim = new THREE.DirectionalLight(0x00c400, 0.9);
    rim.position.set(-10, -4, -4);
    scene.add(rim);

    // Purple top-back rim for edge definition
    const backRim = new THREE.DirectionalLight(0xbb66ff, 0.7);
    backRim.position.set(0, 8, -10);
    scene.add(backRim);

    const engineGlow = new THREE.PointLight(0x8a2be2, 8, 10);
    scene.add(engineGlow);

    // --- Materials ---
    // Light silver-white body so it reads against any dark background
    const bodyMat    = new THREE.MeshStandardMaterial({ color: 0xc8cfe0, metalness: 0.75, roughness: 0.22 });
    // Slightly darker panels for the wings — still clearly visible
    const wingMat    = new THREE.MeshStandardMaterial({ color: 0x8898b8, metalness: 0.65, roughness: 0.30, side: THREE.DoubleSide });
    // Purple nose/ring with a strong emissive so it self-glows
    const purpleMat  = new THREE.MeshStandardMaterial({ color: 0x9b3ef5, metalness: 0.7, roughness: 0.15, emissive: new THREE.Color(0x4a0090), emissiveIntensity: 0.6 });
    // Green accents — self-lit so they pop as bright lines
    const accentMat  = new THREE.MeshBasicMaterial({ color: 0x00ff55 });
    // Cockpit glass — bright teal emissive
    const cockpitMat = new THREE.MeshStandardMaterial({ color: 0x44ffcc, emissive: new THREE.Color(0x00aa66), emissiveIntensity: 0.8, metalness: 0.05, roughness: 0.04, transparent: true, opacity: 0.92 });
    // Engine exhaust — bright purple glow
    const exhaustMat = new THREE.MeshBasicMaterial({ color: 0xcc66ff, transparent: true, opacity: 0.9 });

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

    // Purple hull stripe — emissive so it reads as a glowing accent line
    const stripe = new THREE.Mesh(
      new THREE.BoxGeometry(4.4, 0.07, 0.11),
      new THREE.MeshStandardMaterial({ color: 0xaa44ff, emissive: new THREE.Color(0x6600cc), emissiveIntensity: 0.9, metalness: 0.5, roughness: 0.1 })
    );
    stripe.position.set(0.2, 0.34, 0);
    ship.add(stripe);

    scene.add(ship);

    // --- Asteroids ---
    // Each flies right → left as scroll progresses (opposite of ship)
    const asteroidMat = new THREE.MeshStandardMaterial({
      color: 0x6b5a4e, roughness: 0.92, metalness: 0.05
    });

    type Asteroid = {
      mesh: THREE.Mesh;
      startX: number;
      travel: number;  // total X distance covered across full scroll
      rotAxis: THREE.Vector3;
      rotSpeed: number; // radians per unit of progress
    };

    const ASTEROID_DEFS: Array<{ sx: number; y: number; z: number; scale: number; travel: number; rotSpeed: number }> = [
      { sx: 28,  y:  2.5, z: -2,  scale: 0.55, travel: 58, rotSpeed: 4.2 },
      { sx: 22,  y: -1.8, z:  1,  scale: 0.38, travel: 50, rotSpeed: 5.8 },
      { sx: 35,  y:  0.4, z: -4,  scale: 0.70, travel: 65, rotSpeed: 3.1 },
      { sx: 18,  y:  3.2, z:  2,  scale: 0.28, travel: 44, rotSpeed: 7.0 },
      { sx: 30,  y: -2.8, z: -1,  scale: 0.45, travel: 55, rotSpeed: 4.8 },
      { sx: 40,  y:  1.2, z:  3,  scale: 0.62, travel: 70, rotSpeed: 2.9 },
      { sx: 24,  y: -0.5, z: -5,  scale: 0.32, travel: 48, rotSpeed: 6.2 },
      { sx: 33,  y:  2.0, z:  0,  scale: 0.50, travel: 60, rotSpeed: 3.7 },
    ];

    const asteroids: Asteroid[] = ASTEROID_DEFS.map((d) => {
      // Use low-poly icosahedron + slight non-uniform scale for rocky look
      const geo = new THREE.IcosahedronGeometry(1, 1);
      // Perturb vertices for irregular shape
      const pos = geo.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        pos.setXYZ(
          i,
          pos.getX(i) * (0.82 + Math.random() * 0.36),
          pos.getY(i) * (0.82 + Math.random() * 0.36),
          pos.getZ(i) * (0.82 + Math.random() * 0.36)
        );
      }
      geo.computeVertexNormals();

      const mesh = new THREE.Mesh(geo, asteroidMat);
      mesh.scale.setScalar(d.scale);
      mesh.position.set(d.sx, d.y, d.z);
      // Random initial rotation
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      scene.add(mesh);

      return {
        mesh,
        startX: d.sx,
        travel: d.travel,
        rotAxis: new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5).normalize(),
        rotSpeed: d.rotSpeed,
      };
    });

    // --- Fire / thruster particles (world space, additive blending) ---
    const FIRE_N = 120;
    type FP = { x: number; y: number; z: number; vx: number; vy: number; vz: number; life: number; maxLife: number; sz: number };
    const fp: FP[] = Array.from({ length: FIRE_N }, () => ({ x: 0, y: 0, z: 0, vx: 0, vy: 0, vz: 0, life: 999, maxLife: 0.4, sz: 0.3 }));

    const fpPos  = new Float32Array(FIRE_N * 3);
    const fpLife = new Float32Array(FIRE_N);
    const fpSize = new Float32Array(FIRE_N);
    fpPos.fill(-9999); // hide all until spawned

    const fireGeo = new THREE.BufferGeometry();
    fireGeo.setAttribute('position', new THREE.BufferAttribute(fpPos, 3));
    fireGeo.setAttribute('pLife',    new THREE.BufferAttribute(fpLife, 1));
    fireGeo.setAttribute('pSize',    new THREE.BufferAttribute(fpSize, 1));

    const fireMat = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: /* glsl */`
        attribute float pLife;
        attribute float pSize;
        varying float vLife;
        void main() {
          vLife = pLife;
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = pSize * (180.0 / -mv.z) * (1.0 - pLife * 0.55);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying float vLife;
        void main() {
          vec2 c = gl_PointCoord - 0.5;
          float d = length(c);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.04, d) * (1.0 - vLife);
          // white/yellow core → orange → deep red
          vec3 col = mix(vec3(1.0, 0.96, 0.75), vec3(1.0, 0.35, 0.0), min(1.0, vLife * 2.2));
          col = mix(col, vec3(0.45, 0.01, 0.0), max(0.0, vLife * 3.5 - 2.5));
          gl_FragColor = vec4(col, a * 0.95);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    scene.add(new THREE.Points(fireGeo, fireMat));

    // --- Scroll tracking (natural flow, no sticky trap) ---
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
    let lastT = 0;
    let rafId: number;

    function animate() {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const frameDt = Math.min(t - lastT, 0.05); // cap at 50ms to avoid jumps on tab restore
      lastT = t;

      smoothProgress += (targetProgress - smoothProgress) * 0.08;
      const delta = smoothProgress - prevSmooth;
      prevSmooth = smoothProgress;

      // Position
      ship.position.x = X_START + (X_END - X_START) * smoothProgress;
      ship.position.y = Math.sin(t * 0.85) * 0.3;

      // Banking & yaw
      ship.rotation.z = THREE.MathUtils.clamp(-delta * 100, -0.38, 0.38);
      ship.rotation.y = -0.2 + THREE.MathUtils.clamp(delta * 40, -0.25, 0.25);

      // Asteroids: move right → left (negative X) as progress increases
      for (const a of asteroids) {
        a.mesh.position.x = a.startX - smoothProgress * a.travel;
        // Spin driven by scroll delta (feels physical)
        a.mesh.rotateOnAxis(a.rotAxis, delta * a.rotSpeed);
      }

      // Engine light
      engineGlow.position.set(ship.position.x - 3.2, ship.position.y, 0);

      // Exhaust pulse (static cone kept but small — fire particles take over)
      const spd = Math.abs(delta) * 500;
      exhaust.scale.x = 1 + spd * 0.15;
      exhaustMat.opacity = 0.25 + Math.sin(t * 7) * 0.08;

      // --- Fire particle spawn + update ---
      const scrollSpeed = Math.abs(delta);
      // Always spawn a small idle flame; burst more when scrolling
      const toSpawn = 3 + Math.floor(scrollSpeed * 1400);
      const tailX = ship.position.x - 3.85;
      const tailY = ship.position.y;

      let spawned = 0;
      for (let i = 0; i < FIRE_N && spawned < toSpawn; i++) {
        if (fp[i].life >= fp[i].maxLife) {
          fp[i].x       = tailX + (Math.random() - 0.5) * 0.28;
          fp[i].y       = tailY + (Math.random() - 0.5) * 0.35;
          fp[i].z       = (Math.random() - 0.5) * 0.35;
          fp[i].vx      = -(0.5 + Math.random() * 1.2 + scrollSpeed * 90);
          fp[i].vy      = (Math.random() - 0.5) * 0.55;
          fp[i].vz      = (Math.random() - 0.5) * 0.55;
          fp[i].maxLife = 0.22 + Math.random() * 0.32;
          fp[i].sz      = 0.38 + Math.random() * 0.55 + scrollSpeed * 70;
          fp[i].life    = 0;
          spawned++;
        }
      }

      for (let i = 0; i < FIRE_N; i++) {
        if (fp[i].life < fp[i].maxLife) {
          fp[i].life += frameDt;
          fp[i].x    += fp[i].vx * frameDt;
          fp[i].y    += fp[i].vy * frameDt;
          fp[i].z    += fp[i].vz * frameDt;
          const t01 = fp[i].life / fp[i].maxLife;
          fpPos[i * 3]     = fp[i].x;
          fpPos[i * 3 + 1] = fp[i].y;
          fpPos[i * 3 + 2] = fp[i].z;
          fpLife[i] = t01;
          fpSize[i] = fp[i].sz;
        } else {
          fpPos[i * 3] = -9999;
          fpLife[i] = 1;
          fpSize[i] = 0;
        }
      }
      (fireGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (fireGeo.attributes.pLife    as THREE.BufferAttribute).needsUpdate = true;
      (fireGeo.attributes.pSize    as THREE.BufferAttribute).needsUpdate = true;

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
      fireGeo.dispose();
      fireMat.dispose();
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
