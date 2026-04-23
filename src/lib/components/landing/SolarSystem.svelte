<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;
  let sectionElement: HTMLElement;
  let scrollProgress = 0;

  // ----- Procedural planet textures -----------------------------------------
  function makeTexture(draw: (ctx: CanvasRenderingContext2D, W: number, H: number) => void): THREE.CanvasTexture {
    const W = 512, H = 256;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    const ctx = cv.getContext('2d')!;
    draw(ctx, W, H);
    return new THREE.CanvasTexture(cv);
  }

  function makeMercuryTex() {
    return makeTexture((ctx, W, H) => {
      const g = ctx.createRadialGradient(W/2,H/2,20,W/2,H/2,W/2);
      g.addColorStop(0,'#b5a090'); g.addColorStop(1,'#6e5c4a');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      for (const [x,y,r] of [[80,60,14],[200,120,20],[350,80,17],[130,190,11],[420,160,18],[290,190,15]]) {
        ctx.globalAlpha = 0.55; ctx.fillStyle = '#504030';
        ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
        ctx.globalAlpha = 0.3; ctx.strokeStyle = '#c0a880'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x,y,r+1.5,0,Math.PI*2); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }

  function makeVenusTex() {
    return makeTexture((ctx, W, H) => {
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#f5e090'); g.addColorStop(0.4,'#e8c840'); g.addColorStop(1,'#c8980a');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      ctx.globalAlpha = 0.25; ctx.strokeStyle = '#fffac0'; ctx.lineWidth = 4;
      for (let i = 0; i < 14; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8)
          ctx.lineTo(x, i*(H/13) + Math.sin(x*0.02+i*0.8)*14);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }

  function makeEarthTex() {
    return makeTexture((ctx, W, H) => {
      ctx.fillStyle = '#1a5fa8'; ctx.fillRect(0,0,W,H);
      ctx.fillStyle = '#2d8a3a';
      for (const [x,y,rx,ry,rot] of [[110,90,55,48,-0.3],[255,100,34,68,0.1],[370,78,68,53,0],[148,173,26,48,0.2],[415,183,33,20,-0.2],[480,120,25,40,-0.1]]) {
        ctx.save(); ctx.translate(x,y); ctx.rotate(rot as number);
        ctx.beginPath(); ctx.ellipse(0,0,rx,ry,0,0,Math.PI*2); ctx.fill(); ctx.restore();
      }
      ctx.fillStyle = '#ddeeff';
      ctx.fillRect(0,0,W,16); ctx.fillRect(0,H-14,W,14);
      ctx.globalAlpha = 0.18; ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        ctx.ellipse(Math.random()*W, Math.random()*H, 20+Math.random()*40, 7+Math.random()*12, Math.random(), 0, Math.PI*2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  function makeMarsTex() {
    return makeTexture((ctx, W, H) => {
      const g = ctx.createLinearGradient(0,0,W,H);
      g.addColorStop(0,'#c85030'); g.addColorStop(0.5,'#e06840'); g.addColorStop(1,'#b04020');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#701808';
      for (const [x,y,rx,ry] of [[180,110,64,36],[350,155,48,30],[100,160,38,24]]) {
        ctx.beginPath(); ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2); ctx.fill();
      }
      ctx.globalAlpha = 0.75; ctx.fillStyle = '#f0e0e0';
      ctx.beginPath(); ctx.ellipse(W/2,10,128,14,0,0,Math.PI*2); ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function makeJupiterTex() {
    return makeTexture((ctx, W, H) => {
      const bands = [
        '#c9a87c','#ddb87a','#a05828','#d8905a',
        '#c0784a','#e8c060','#b87040','#c8a060',
        '#e8c870','#b07040','#d4a060','#c08040',
        '#e8c87a','#a05828','#d4905a','#c9a87c',
      ];
      const bh = H / bands.length;
      bands.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(0, i * bh, W, bh + 1);
      });
      // Turbulent band edges
      ctx.globalAlpha = 0.18;
      for (let i = 0; i < bands.length - 1; i++) {
        const y = (i + 1) * bh;
        ctx.fillStyle = i % 2 === 0 ? '#5a3010' : '#f0d080';
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6)
          ctx.lineTo(x, y + Math.sin(x * 0.035 + i * 1.4) * 5);
        ctx.lineTo(W, y + 8); ctx.lineTo(0, y + 8); ctx.fill();
      }
      // Great Red Spot
      ctx.globalAlpha = 1; ctx.fillStyle = '#c03820';
      ctx.beginPath(); ctx.ellipse(180, H * 0.6, 38, 20, -0.15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#e05530';
      ctx.beginPath(); ctx.ellipse(178, H * 0.6 - 2, 26, 13, -0.15, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = '#f07050';
      ctx.beginPath(); ctx.ellipse(176, H * 0.6 - 3, 14, 8, -0.1, 0, Math.PI*2); ctx.fill();
    });
  }

  function makeSaturnTex() {
    return makeTexture((ctx, W, H) => {
      const bands = [
        '#e8dcc0','#d4c090','#c0a870','#d8c898',
        '#c8b880','#e0d0a8','#c8b070','#e0cca0',
      ];
      const bh = H / bands.length;
      bands.forEach((col, i) => {
        ctx.fillStyle = col;
        ctx.fillRect(0, i * bh, W, bh + 1);
      });
      ctx.globalAlpha = 0.12;
      for (let i = 0; i < bands.length - 1; i++) {
        const y = (i + 1) * bh;
        ctx.fillStyle = '#a08040';
        ctx.beginPath();
        for (let x = 0; x <= W; x += 6)
          ctx.lineTo(x, y + Math.sin(x * 0.03 + i) * 4);
        ctx.lineTo(W, y + 6); ctx.lineTo(0, y + 6); ctx.fill();
      }
      ctx.globalAlpha = 1;
    });
  }

  function makeUranusTex() {
    return makeTexture((ctx, W, H) => {
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#7de8e8'); g.addColorStop(0.5,'#5cc8d8'); g.addColorStop(1,'#4ab0c0');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      ctx.globalAlpha = 0.1; ctx.strokeStyle = '#aafafa'; ctx.lineWidth = 2;
      for (let i = 0; i < 6; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8)
          ctx.lineTo(x, i*(H/5) + Math.sin(x*0.015)*12);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }

  function makeNeptuneTex() {
    return makeTexture((ctx, W, H) => {
      const g = ctx.createLinearGradient(0,0,0,H);
      g.addColorStop(0,'#2060d0'); g.addColorStop(0.5,'#1840a8'); g.addColorStop(1,'#102888');
      ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
      ctx.globalAlpha = 0.35; ctx.fillStyle = '#1a50b8';
      ctx.beginPath(); ctx.ellipse(320, H*0.45, 60, 30, 0.2, 0, Math.PI*2); ctx.fill();
      ctx.globalAlpha = 0.15; ctx.strokeStyle = '#80b0ff'; ctx.lineWidth = 2;
      for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 8)
          ctx.lineTo(x, i*(H/4) + Math.sin(x*0.02+i)*16);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    });
  }

  // ----- Planet definitions --------------------------------------------------
  // startAngle: initial orbit position in radians (distributes planets around the sun)
  // speed: visual orbital speed — how many full 2π rotations over a complete scroll
  const PLANET_DEFS = [
    { name:'Mercury', radius:0.7,  distance:12,  speed:2.80, startAngle:0.50, tilt:0.03, tex:makeMercuryTex },
    { name:'Venus',   radius:1.6,  distance:18,  speed:1.75, startAngle:1.40, tilt:3.10, tex:makeVenusTex },
    { name:'Earth',   radius:1.8,  distance:25,  speed:1.00, startAngle:2.80, tilt:0.41, tex:makeEarthTex },
    { name:'Mars',    radius:1.0,  distance:33,  speed:0.70, startAngle:4.50, tilt:0.44, tex:makeMarsTex },
    { name:'Jupiter', radius:6.0,  distance:52,  speed:0.45, startAngle:1.00, tilt:0.05, tex:makeJupiterTex },
    { name:'Saturn',  radius:4.8,  distance:70,  speed:0.30, startAngle:3.20, tilt:0.47, tex:makeSaturnTex, rings:true },
    { name:'Uranus',  radius:2.8,  distance:87,  speed:0.20, startAngle:5.00, tilt:1.71, tex:makeUranusTex },
    { name:'Neptune', radius:2.6,  distance:101, speed:0.15, startAngle:2.00, tilt:0.49, tex:makeNeptuneTex },
  ];

  onMount(() => {
    const section = sectionElement;
    let W = section.clientWidth;
    let H = section.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x06060f, 1);

    const scene = new THREE.Scene();
    // Wider FOV and closer camera to see all 8 planets including outer ones
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 3000);
    camera.position.set(95, 95, 95);
    camera.lookAt(0, 0, 0);

    // Lighting — sun-only model for true light/dark terminator
    // Very low ambient: dark side stays dark but not pitch black
    scene.add(new THREE.AmbientLight(0x111133, 0.18));
    // Sun PointLight at origin — decay=0 so ALL planets receive equal light.
    // The day/night split comes purely from surface normal angle (Lambert), not falloff.
    const sunLight = new THREE.PointLight(0xfff4cc, 3.5, 0, 0);
    scene.add(sunLight);

    // Parallax stars with vertical scroll effect
    const STAR_COUNT = 2400;
    const starPos = new Float32Array(STAR_COUNT * 3);
    const starSz  = new Float32Array(STAR_COUNT);
    for (let i = 0; i < STAR_COUNT; i++) {
      starPos[i*3]   = (Math.random() - 0.5) * 300;  // x spread
      starPos[i*3+1] = (Math.random() - 0.5) * 400;  // y (depth range for parallax)
      starPos[i*3+2] = -(Math.random() * 100 + 50);  // z: -50 to -150
      starSz[i] = Math.random() * 1.5 + 0.4;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSz, 1));
    const starMat = new THREE.ShaderMaterial({
      uniforms: { uParallaxY: { value: 0 } },
      vertexShader: /* glsl */`
        attribute float size;
        uniform float uParallaxY;
        varying float vDepth;
        void main() {
          // Depth: near=-50 (depth=0), far=-150 (depth=1)
          float depth = clamp((-position.z - 50.0) / 100.0, 0.0, 1.0);
          vDepth = depth;
          // Near stars shift more, far stars barely move
          vec3 pos = position;
          pos.y += uParallaxY * (1.0 - depth * 0.85);
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (180.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: /* glsl */`
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float a = smoothstep(0.5, 0.08, d) * 0.85;
          // Color gradient: white far → cyan mid → green near
          vec3 far  = vec3(1.0, 1.0, 1.0);
          vec3 mid  = vec3(0.4, 0.9, 1.0);
          vec3 near = vec3(0.0, 1.0, 0.4);
          vec3 col = mix(far, mid, smoothstep(0.2, 0.6, vDepth));
          col = mix(col, near, smoothstep(0.65, 1.0, vDepth));
          gl_FragColor = vec4(col, a);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const starPoints = new THREE.Points(starGeo, starMat);
    scene.add(starPoints);

    // Sun
    const sunMesh = new THREE.Mesh(
      new THREE.SphereGeometry(8, 64, 64),
      new THREE.MeshBasicMaterial({ color: 0xfdb813 })
    );
    scene.add(sunMesh);
    // Sun corona glow
    const coronaMesh = new THREE.Mesh(
      new THREE.SphereGeometry(9.5, 32, 32),
      new THREE.MeshBasicMaterial({ color: 0xff9900, transparent: true, opacity: 0.12, depthWrite: false, side: THREE.BackSide })
    );
    scene.add(coronaMesh);

    // Build planets
    const planetMeshes = PLANET_DEFS.map((p) => {
      const tex = p.tex();
      tex.colorSpace = THREE.SRGBColorSpace;

      const geo = new THREE.SphereGeometry(p.radius, 64, 64);
      // roughness: lower = punchier highlights on lit side; metalness near 0 for rocky/gas look
      const mat = new THREE.MeshStandardMaterial({ map: tex, metalness: 0.02, roughness: 0.70 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.z = p.tilt;

      // Orbital group (rotating this positions the planet on its orbit)
      const orbitPivot = new THREE.Group();
      orbitPivot.add(mesh);
      mesh.position.set(p.distance, 0, 0);
      scene.add(orbitPivot);

      // Saturn rings
      let ringMesh: THREE.Mesh | null = null;
      if (p.rings) {
        const ringGeo = new THREE.RingGeometry(p.radius * 1.35, p.radius * 2.4, 128);
        // Fix UV mapping so the gradient runs radially
        const pos = ringGeo.attributes.position;
        const uv  = ringGeo.attributes.uv;
        const v3  = new THREE.Vector3();
        const inner = p.radius * 1.35, outer = p.radius * 2.4;
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          uv.setXY(i, (v3.length() - inner) / (outer - inner), 0);
        }
        const ringCanvas = document.createElement('canvas');
        ringCanvas.width = 256; ringCanvas.height = 1;
        const rctx = ringCanvas.getContext('2d')!;
        const grad = rctx.createLinearGradient(0, 0, 256, 0);
        grad.addColorStop(0.0, 'rgba(200,180,120,0)');
        grad.addColorStop(0.1, 'rgba(210,190,130,0.7)');
        grad.addColorStop(0.35,'rgba(180,160,100,0.9)');
        grad.addColorStop(0.5, 'rgba(150,130,80,0.5)');
        grad.addColorStop(0.65,'rgba(180,160,100,0.85)');
        grad.addColorStop(0.85,'rgba(160,140,90,0.6)');
        grad.addColorStop(1.0, 'rgba(140,120,70,0)');
        rctx.fillStyle = grad; rctx.fillRect(0,0,256,1);
        const ringTex = new THREE.CanvasTexture(ringCanvas);
        ringTex.colorSpace = THREE.SRGBColorSpace;
        const ringMat = new THREE.MeshBasicMaterial({
          map: ringTex, side: THREE.DoubleSide,
          transparent: true, depthWrite: false,
        });
        ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI / 2.2;
        mesh.add(ringMesh);
      }

      return { mesh, orbitPivot, planet: p, ringMesh };
    });

    // Orbital path lines
    PLANET_DEFS.forEach((p) => {
      const pts: number[] = [];
      for (let i = 0; i <= 128; i++) {
        const a = (i / 128) * Math.PI * 2;
        pts.push(Math.cos(a) * p.distance, 0, Math.sin(a) * p.distance);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(pts), 3));
      scene.add(new THREE.Line(geo, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12 })));
    });

    // Scroll tracking
    const handleScroll = () => {
      if (!sectionElement) return;
      const rect = sectionElement.getBoundingClientRect();
      const total = window.innerHeight + rect.height;
      scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / total));
    };

    const handleResize = () => {
      W = section.clientWidth; H = section.clientHeight;
      camera.aspect = W / H; camera.updateProjectionMatrix();
      renderer.setSize(W, H);
    };

    let rafId: number;
    const animate = () => {
      rafId = requestAnimationFrame(animate);

      // Update parallax shader with vertical scroll progress
      (starMat as THREE.ShaderMaterial).uniforms.uParallaxY.value = scrollProgress * 120;

      planetMeshes.forEach(({ mesh, orbitPivot, planet }) => {
        // Orbit: startAngle offsets initial position, scroll drives the rest
        orbitPivot.rotation.y = planet.startAngle + scrollProgress * Math.PI * 2 * planet.speed;
        // Self-rotation
        mesh.rotation.y += 0.003;
      });

      renderer.render(scene, camera);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  });
</script>

<section class="solar-system-section" bind:this={sectionElement} aria-label="Solar System">
  <canvas bind:this={canvas} />
</section>

<style>
  .solar-system-section {
    position: relative;
    width: 100%;
    height: 100vh;
    background: radial-gradient(ellipse at center, rgba(10, 10, 30, 1) 0%, rgba(0, 0, 0, 1) 100%);
    overflow: hidden;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
</style>
