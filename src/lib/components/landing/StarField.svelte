<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const parent = canvas.parentElement!;
    let w = parent.clientWidth;
    let h = parent.clientHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, w / h, 0.1, 600);
    camera.position.z = 50;

    const COUNT = 2400;
    const SPREAD_XY = 200;
    const DEPTH = 400;
    const SPEED = 0.38;
    const RESET_Z = 60;

    const positions = new Float32Array(COUNT * 3);
    const sizes = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * SPREAD_XY;
      positions[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_XY;
      positions[i * 3 + 2] = (Math.random() - 0.5) * DEPTH;
      sizes[i] = Math.random() * 1.4 + 0.3;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: /* glsl */`
        attribute float size;
        varying float vDepth;
        void main() {
          vDepth = (position.z + 200.0) / 400.0;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (200.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */`
        varying float vDepth;
        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float alpha = smoothstep(0.5, 0.1, d);
          vec3 far  = vec3(1.0, 1.0, 1.0);
          vec3 mid  = vec3(0.54, 0.17, 0.89);
          vec3 near = vec3(0.0, 0.77, 0.0);
          vec3 color = mix(far, mid, smoothstep(0.3, 0.65, vDepth));
          color      = mix(color, near, smoothstep(0.65, 1.0, vDepth));
          gl_FragColor = vec4(color, alpha * 0.9);
        }
      `,
      transparent: true,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const posAttr = geometry.attributes.position as THREE.BufferAttribute;

    const ro = new ResizeObserver(() => {
      w = parent.clientWidth;
      h = parent.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
    ro.observe(parent);

    let rafId: number;
    function animate() {
      rafId = requestAnimationFrame(animate);
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < COUNT; i++) {
        arr[i * 3 + 2] += SPEED;
        if (arr[i * 3 + 2] > RESET_Z) {
          arr[i * 3 + 2] = -DEPTH * 0.5;
          arr[i * 3]     = (Math.random() - 0.5) * SPREAD_XY;
          arr[i * 3 + 1] = (Math.random() - 0.5) * SPREAD_XY;
        }
      }
      posAttr.needsUpdate = true;
      renderer.render(scene, camera);
    }

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  });
</script>

<canvas bind:this={canvas} />

<style>
  canvas {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
  }
</style>
