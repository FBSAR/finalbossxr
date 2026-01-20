<script lang="ts">
  export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  export let className: string = '';
  
  const sizeMap = {
    sm: '150px',
    md: '220px',
    lg: '300px',
    xl: '400px'
  };
</script>

<div 
  class="xr-abstract-container {className}"
  style="--xr-size: {sizeMap[size]};"
>
  <svg class="xr-abstract-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Animated color-shifting gradient -->
      <linearGradient id="xrShift" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#00C400">
          <animate attributeName="stop-color" values="#00C400;#8A2BE2;#FFD700;#00C400" dur="6s" repeatCount="indefinite"/>
        </stop>
        <stop offset="50%" stop-color="#8A2BE2">
          <animate attributeName="stop-color" values="#8A2BE2;#FFD700;#00C400;#8A2BE2" dur="6s" repeatCount="indefinite"/>
        </stop>
        <stop offset="100%" stop-color="#00C400">
          <animate attributeName="stop-color" values="#00C400;#8A2BE2;#FFD700;#00C400" dur="6s" repeatCount="indefinite" begin="0.5s"/>
        </stop>
      </linearGradient>
      
      <linearGradient id="portalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#00C400" stop-opacity="0.8"/>
        <stop offset="50%" stop-color="#8A2BE2" stop-opacity="0.6"/>
        <stop offset="100%" stop-color="#00C400" stop-opacity="0.8"/>
      </linearGradient>
      
      <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#8A2BE2" stop-opacity="0.6"/>
        <stop offset="50%" stop-color="#00C400" stop-opacity="0.2"/>
        <stop offset="100%" stop-color="transparent"/>
      </radialGradient>
      
      <filter id="abstractGlow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur"/>
        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
      
      <!-- Clip path for inner portal -->
      <clipPath id="portalClip">
        <circle cx="150" cy="150" r="60"/>
      </clipPath>
    </defs>
    
    <!-- Outer rotating hexagon ring -->
    <g class="outer-hex">
      <polygon points="150,30 240,75 240,165 150,210 60,165 60,75" fill="none" stroke="url(#xrShift)" stroke-width="1" opacity="0.3">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="30s" repeatCount="indefinite"/>
      </polygon>
      <polygon points="150,40 230,80 230,160 150,200 70,160 70,80" fill="none" stroke="url(#xrShift)" stroke-width="0.5" opacity="0.2">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="-360 150 150" dur="25s" repeatCount="indefinite"/>
      </polygon>
    </g>
    
    <!-- Pulsing core glow -->
    <circle cx="150" cy="150" r="70" fill="url(#coreGlow)" opacity="0.5">
      <animate attributeName="r" values="60;80;60" dur="4s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite"/>
    </circle>
    
    <!-- Inner geometric portal - 3 intersecting planes representing XR dimensions -->
    <g class="xr-core" filter="url(#abstractGlow)">
      <!-- Plane 1 - Physical Reality (horizontal ellipse) -->
      <ellipse cx="150" cy="150" rx="55" ry="20" fill="none" stroke="#00C400" stroke-width="2" opacity="0.8">
        <animateTransform attributeName="transform" type="rotate" from="0 150 150" to="360 150 150" dur="8s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="20;25;20" dur="3s" repeatCount="indefinite"/>
      </ellipse>
      
      <!-- Plane 2 - Virtual Layer (tilted ellipse) -->
      <ellipse cx="150" cy="150" rx="55" ry="20" fill="none" stroke="#8A2BE2" stroke-width="2" opacity="0.7">
        <animateTransform attributeName="transform" type="rotate" from="60 150 150" to="420 150 150" dur="10s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="20;28;20" dur="4s" repeatCount="indefinite"/>
      </ellipse>
      
      <!-- Plane 3 - Extended dimension (another tilt) -->
      <ellipse cx="150" cy="150" rx="55" ry="20" fill="none" stroke="#FFD700" stroke-width="1.5" opacity="0.5">
        <animateTransform attributeName="transform" type="rotate" from="-60 150 150" to="300 150 150" dur="12s" repeatCount="indefinite"/>
        <animate attributeName="ry" values="18;22;18" dur="3.5s" repeatCount="indefinite"/>
      </ellipse>
    </g>
    
    <!-- Central convergence point -->
    <g class="convergence">
      <!-- Pulsing center dot -->
      <circle cx="150" cy="150" r="8" fill="url(#xrShift)" opacity="0.9">
        <animate attributeName="r" values="6;12;6" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite"/>
      </circle>
      
      <!-- Inner ring -->
      <circle cx="150" cy="150" r="18" fill="none" stroke="url(#xrShift)" stroke-width="1" opacity="0.6">
        <animate attributeName="r" values="15;22;15" dur="2.5s" repeatCount="indefinite"/>
      </circle>
    </g>
    
    <!-- Orbiting data nodes -->
    <g class="data-nodes">
      <!-- Node 1 -->
      <circle r="4" fill="#00C400" opacity="0.9" filter="url(#abstractGlow)">
        <animateMotion dur="6s" repeatCount="indefinite" path="M150,90 A60,60 0 1,1 149.9,90"/>
      </circle>
      <!-- Node 2 -->
      <circle r="3" fill="#8A2BE2" opacity="0.8">
        <animateMotion dur="8s" repeatCount="indefinite" path="M150,90 A60,60 0 1,1 149.9,90" begin="-2s"/>
      </circle>
      <!-- Node 3 -->
      <circle r="2.5" fill="#FFD700" opacity="0.7">
        <animateMotion dur="10s" repeatCount="indefinite" path="M150,90 A60,60 0 1,1 149.9,90" begin="-4s"/>
      </circle>
    </g>
    
    <!-- Floating geometric fragments -->
    <g class="fragments" opacity="0.6">
      <!-- Triangle fragment 1 -->
      <polygon points="50,80 65,110 35,110" fill="none" stroke="#00C400" stroke-width="1">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="3s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" values="0,0;5,-8;0,0" dur="4s" repeatCount="indefinite"/>
      </polygon>
      
      <!-- Square fragment -->
      <rect x="240" y="100" width="15" height="15" fill="none" stroke="#8A2BE2" stroke-width="1">
        <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2.5s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" values="0 247 107;45 247 107;0 247 107" dur="5s" repeatCount="indefinite"/>
      </rect>
      
      <!-- Triangle fragment 2 -->
      <polygon points="260,200 275,230 245,230" fill="none" stroke="#FFD700" stroke-width="1">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="3.5s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="translate" values="0,0;-5,8;0,0" dur="4.5s" repeatCount="indefinite"/>
      </polygon>
      
      <!-- Diamond fragment -->
      <polygon points="40,200 55,215 40,230 25,215" fill="none" stroke="#00C400" stroke-width="1">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" begin="0.5s"/>
        <animateTransform attributeName="transform" type="scale" values="1;1.1;1" dur="3s" repeatCount="indefinite" begin="0.5s"/>
      </polygon>
      
      <!-- Hexagon fragment -->
      <polygon points="250,50 260,55 260,65 250,70 240,65 240,55" fill="none" stroke="#8A2BE2" stroke-width="1">
        <animate attributeName="opacity" values="0.3;0.7;0.3" dur="4s" repeatCount="indefinite"/>
        <animateTransform attributeName="transform" type="rotate" values="0 250 60;180 250 60;360 250 60" dur="8s" repeatCount="indefinite"/>
      </polygon>
      
      <!-- Small circle fragments -->
      <circle cx="45" cy="150" r="5" fill="none" stroke="#FFD700" stroke-width="0.8">
        <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="255" cy="150" r="4" fill="none" stroke="#00C400" stroke-width="0.8">
        <animate attributeName="r" values="3;6;3" dur="2.5s" repeatCount="indefinite" begin="0.5s"/>
      </circle>
    </g>
    
    <!-- Connection lines radiating from center -->
    <g class="connections" opacity="0.3">
      <line x1="150" y1="150" x2="60" y2="90" stroke="url(#xrShift)" stroke-width="0.5" stroke-dasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="150" y1="150" x2="240" y2="90" stroke="url(#xrShift)" stroke-width="0.5" stroke-dasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="150" y1="150" x2="60" y2="210" stroke="url(#xrShift)" stroke-width="0.5" stroke-dasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
      </line>
      <line x1="150" y1="150" x2="240" y2="210" stroke="url(#xrShift)" stroke-width="0.5" stroke-dasharray="4 4">
        <animate attributeName="stroke-dashoffset" values="0;8" dur="1s" repeatCount="indefinite"/>
      </line>
    </g>
  </svg>
</div>

<style>
  .xr-abstract-container {
    width: 100%;
    max-width: var(--xr-size, 220px);
    animation: xrFloat 6s ease-in-out infinite;
  }

  .xr-abstract-svg {
    width: 100%;
    height: auto;
    filter: drop-shadow(0 0 20px rgba(0, 196, 0, 0.2));
  }

  @keyframes xrFloat {
    0%, 100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.02);
    }
  }

  /* Hover effect for interactive contexts */
  .xr-abstract-container:hover .xr-abstract-svg {
    filter: drop-shadow(0 0 30px rgba(0, 196, 0, 0.4));
  }
</style>
