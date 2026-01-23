<script lang="ts">
  import { onMount } from 'svelte';
  import { navigating } from '$app/stores';
  import ContactForm from '$lib/components/ContactForm.svelte';
  import KickstarterPromo from '$lib/components/landing/KickstarterPromo.svelte';
    import { Button } from 'flowbite-svelte';
    import { AppleSolid } from 'flowbite-svelte-icons';

  // Loading state for navigation
  $: isLoading = $navigating !== null;

  // Contact Form Submission
  function testerLink() {
       window.open('https://forms.gle/SWN4pGnP4crNx78e7', '_blank');
  }
  function iosTesterLink() {
       window.open('https://testflight.apple.com/join/FYcWW7qk', '_blank');
  }
  function androidTesterLink() {
       window.open('https://groups.google.com/g/cosmic-collisions-testers', '_blank');
  }
  let characters = [
    {
        name: 'Captain Phoenix',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/phoenix_photo.PNG',
        video: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/Character+Videos/NewPhoenix.mp4',
        title: 'The Captain',
        special: 'Piercing Shots - These shots continue their momentum after hitting 1 object.',
        description: "A battle-hardened SSDF veteran, driven by the loss of her family in the alien attack. A brilliant tactician, she defends the solar system with unmatched skill, but her inner turmoil risks overwhelming her, as she battles between vengeance and hope.",
    },
    {
        name: 'Riley',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/riley_photo.PNG',
        title: 'The Engineer',
        video: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/Character+Videos/RileyGesture.mp4',
        special: 'Repair Portal - Fix portals simply by flying through it.',
        description: "A young, improvisational genius who can turn scraps into solutions, from asteroid defenses to alien tech. Their rebellious nature and unconventional methods often clash with Phoenix's strict command, challenging them to find common ground and work as a team.",
    },
    {
        name: 'Johnny Sparks',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/johnny_photo.PNG',
        title: 'The Rookie',
        video: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/Character+Videos/JohnnySparksIntroGesture.mp4',
        special: 'Health Regeneration - Player Ship’s Shield regenerates every [X amount of time]',
        description: "A newly minted graduate, Sparky is naive but full of courage and optimism. Despite their inexperience, they bring a fresh perspective and a contagious positive spirit, which could be the spark the resistance needs. An exceptional VR/AR gamer with a determination reminiscent of a young Leon Kennedy.",
    },
    {
        name: 'Xylo',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/xylo_photo.PNG',
        title: 'The Alien',
        video: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/Character+Videos/XyloGesture.mp4',
        special: 'Defense - Can destroy asteroids colliding into them, with no damage to the ship.',
        description: "An ethereal avian species with shimmering iridescent wings, hailing from a solar system bathed in twilight. With an innate grasp of astrophysics, Xylo navigates space with unmatched precision. Discovered after crash-landing on Earth, Xylo's gentle nature and otherworldly beauty quickly transformed initial fear into awe.",
    },
    {
        name: 'AI Wraith',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/wraith_photo.PNG',
        title: 'The AI',
        video: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/characters/concepts/Character+Videos/WraithGesture.mp4',
        special: 'Speed Increase - Temporary Speed Increase',
        description: "Wraith, once a counterpart to Reaper, remains loyal to humanity. Operating in the shadows, Wraith uses its cyber capabilities to protect the solar system, quietly neutralizing threats and countering Reaper's plans. A silent guardian, it provides vital intelligence to the SSDF, ensuring the galaxy's survival.",
    },
  ]
  let demoVideo: HTMLVideoElement;

  onMount(() => {
    if (demoVideo) {
      // Ensure metadata is loaded
      const startVideo = () => {
        demoVideo.currentTime = 45; // start at 10s
        demoVideo.play().catch((err) => {
          console.warn('Autoplay failed:', err);
        });
      };

      if (demoVideo.readyState >= 1) {
        // Metadata already loaded
        startVideo();
      } else {
        demoVideo.addEventListener('loadedmetadata', startVideo);
      }
    }
  });
</script>
<main>
  {#if isLoading}
    <!-- Skeleton Loading State -->
    <div class="skeleton-container">
      <!-- Hero Skeleton -->
      <div class="skeleton-hero">
        <div class="skeleton-hero-content">
          <div class="skeleton-logo"></div>
          <div class="skeleton-card-large">
            <div class="skeleton-badge"></div>
            <div class="skeleton-title-large"></div>
            <div class="skeleton-text-line"></div>
            <div class="skeleton-tags">
              <div class="skeleton-tag"></div>
              <div class="skeleton-tag"></div>
              <div class="skeleton-tag"></div>
            </div>
            <div class="skeleton-text-block"></div>
            <div class="skeleton-buttons">
              <div class="skeleton-button"></div>
              <div class="skeleton-button"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Section Skeleton -->
      <div class="skeleton-section">
        <div class="skeleton-demo-grid">
          <div class="skeleton-card-large">
            <div class="skeleton-badge"></div>
            <div class="skeleton-title-large"></div>
            <div class="skeleton-text-line"></div>
            <div class="skeleton-tags">
              <div class="skeleton-tag"></div>
              <div class="skeleton-tag"></div>
              <div class="skeleton-tag"></div>
            </div>
            <div class="skeleton-text-block"></div>
            <div class="skeleton-button-full"></div>
            <div class="skeleton-button-full"></div>
          </div>
          <div class="skeleton-phone"></div>
        </div>
      </div>

      <!-- Characters Section Skeleton -->
      <div class="skeleton-section">
        <div class="skeleton-section-title"></div>
        {#each Array(3) as _}
          <div class="skeleton-character-card">
            <div class="skeleton-character-image"></div>
            <div class="skeleton-character-info">
              <div class="skeleton-character-name"></div>
              <div class="skeleton-character-title"></div>
              <div class="skeleton-character-special"></div>
              <div class="skeleton-text-block"></div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
  <!-- Header -->
   <div class="relative w-full overflow-hidden min-h-[70vh] lg:min-h-[100vh]">
    <!-- Background Video -->
    <video
      class="hidden lg:block fixed inset-0 w-full h-full object-cover bg-black"
      style="transform: scaleX(-1);"
      src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/space_rock_2.mp4"
      autoplay
      loop
      playsinline 
      muted>
    </video>
    <!-- Dark overlay for better text readability -->
    <div class="hidden lg:block absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/0"></div>
    
    <div class="relative z-10 w-11/12 lg:w-10/12 flex flex-col mx-auto py-12 lg:py-24 h-full">

      <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
        
        <!-- Logo Column -->
        <div class="w-full lg:w-1/3 flex justify-center lg:justify-end">
          <div class="relative">
            <img 
              src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/CC_LogoAnimated.gif" 
              class="w-64 lg:w-80 mx-auto drop-shadow-2xl" 
              alt="Cosmic Collisions Logo"
            >
            <!-- Glow effect behind logo -->
            <div class="absolute inset-0 blur-3xl bg-[#00c400]/20 -z-10 scale-150"></div>
          </div>
        </div>

        <!-- Info Card Column -->
        <div class="w-full lg:w-1/2">
          <div class="header-card p-6 lg:p-8 space-y-5 backdrop-blur-xl bg-black/40 lg:bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
            
            <!-- Platform Badge -->
            <div class="flex items-center gap-3">
              <div class="flex items-center gap-2 px-4 py-2 bg-[#00c400]/10 border border-[#00c400]/30 rounded-full">
                <svg fill="#00c400" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 512 512">
                  <path d="M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z"/>
                </svg>
                <span class="text-[#00c400] text-sm font-semibold uppercase tracking-wide">Android Demo Available</span>
              </div>
            </div>

            <!-- Title -->
            <div>
              <h1 class="text-4xl lg:text-5xl gradient-text mb-2">Cosmic Collisions</h1>
              <p class="text-gray-400 text-sm lg:text-base">Defend the Solar System in Augmented Reality</p>
            </div>

            <!-- Genre Tags -->
            <div class="flex flex-wrap gap-2">
              <span class="px-3 py-1.5 bg-black/60 border border-[#FFD700]/40 rounded-full text-xs text-white font-medium shadow-lg">Arcade</span>
              <span class="px-3 py-1.5 bg-black/60 border border-[#00c400]/40 rounded-full text-xs text-white font-medium shadow-lg">Space Shooter</span>
              <span class="px-3 py-1.5 bg-black/60 border border-purple-500/40 rounded-full text-xs text-white font-medium shadow-lg">RPG</span>
              <span class="px-3 py-1.5 bg-black/60 border border-blue-400/40 rounded-full text-xs text-white font-medium shadow-lg">AR (Augmented Reality)</span>
            </div>

            <!-- Description -->
            <p class="text-gray-300 text-sm lg:text-base leading-relaxed">
              Get ready to shoot aliens and asteroids in space! Inspired by classics like <span class="text-[#FFD700] font-medium">Galaga</span> and <span class="text-[#FFD700] font-medium">Space Invaders</span>, we add another dimension to the traditional space shooter. Join the <span class="text-[#00c400] font-medium">SSDF</span> as they protect Earth from an oncoming enemy attack.
            </p>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 pt-2">
              <Button href="/leaderboards" color="none" class="flex-1 justify-center bg-[#1b023d] hover:bg-[#2d0a5e] text-white border border-purple-900/50">Leaderboards</Button>
              <Button href="#demo" color="dark" class="flex-1 justify-center border border-white/20 hover:border-[#00c400]/50">Play Demo</Button>
            </div>
          </div>
        </div>
        
      </div>

    </div>
  </div>

  <!-- Spacer -->
  <div class="h-2 border-b-8 border-[#ffffff10]"></div>

  <!-- Game Play Update & Video -->
  <div id="demo" class="w-11/12 lg:w-10/12 mx-auto my-16 lg:my-24">

    <div class="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16">
      
      <!-- Demo Info Card -->
      <div class="w-full lg:w-auto lg:max-w-xl">
        <div class="demo-info-card p-6 lg:p-8 space-y-5 backdrop-blur-xl bg-black/40 lg:bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
          
          <!-- Status Badge -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-4 py-2 bg-[#FFD700]/10 border border-[#FFD700]/30 rounded-full">
              <span class="text-[#FFD700] text-sm font-semibold uppercase tracking-wide">Demo Available</span>
            </div>
          </div>

          <!-- Title -->
          <div>
            <h1 class="text-4xl lg:text-5xl gold-header-text mb-2">Play the Demo</h1>
            <p class="text-gray-400 text-sm lg:text-base">Experience Cosmic Collisions before the official release</p>
          </div>

          <!-- Features List -->
          <div class="flex flex-wrap gap-2">
            <span class="px-3 py-1.5 bg-black/60 border border-[#00c400]/40 rounded-full text-xs text-white font-medium shadow-lg">Tutorial Mission</span>
            <span class="px-3 py-1.5 bg-black/60 border border-[#FFD700]/40 rounded-full text-xs text-white font-medium shadow-lg">Flight Mission #01</span>
            <span class="px-3 py-1.5 bg-black/60 border border-purple-500/40 rounded-full text-xs text-white font-medium shadow-lg">Survival Mode</span>
          </div>

          <!-- Description -->
          <p class="text-gray-300 text-sm lg:text-base leading-relaxed">
            We're working towards an iOS/Android release for our official demo. This demo is specifically designed to showcase the <span class="text-[#00c400] font-medium">core gameplay mechanics</span> and give you a taste of the full experience.
          </p>

          <!-- Download Section -->
          <div class="space-y-4 pt-2">
            <h2 class="text-2xl purple-header-text font-semibold">Download Now</h2>
            
            <!-- iOS Button -->
            <div class="space-y-2">
              <p class="text-gray-400 text-xs"><span class="text-[#FFD700] font-semibold">iOS</span> — Requires TestFlight app installed</p>
              <Button on:click={iosTesterLink} class="text-white bg-black/50 hover:bg-[#1b023d] border border-white/20 hover:border-[#00c400]/50 uppercase text-base w-full transition-all duration-200">
                <span><AppleSolid size="lg" class="mr-3" color="#00c400"></AppleSolid></span>
                Download via TestFlight
              </Button>
            </div>

            <!-- Android Button -->
            <div class="space-y-2">
              <p class="text-gray-400 text-xs"><span class="text-[#FFD700] font-semibold">Android</span> — Join tester group, then download APK</p>
              <Button on:click={androidTesterLink} class="text-white bg-black/50 hover:bg-[#1b023d] border border-white/20 hover:border-[#00c400]/50 uppercase text-base w-full transition-all duration-200">
                <svg fill="#00c400" class="mr-3" version="1.1" xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 512 512">
                  <path d="M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z"/>
                </svg>
                Download Android APK
              </Button>
            </div>
          </div>
        </div>
      </div>

      <!-- Phone Mockup with Video -->
      <div class="w-full lg:w-auto flex justify-center">
        <div class="relative">
          <!-- Phone Frame -->
          <div class="phone-mockup relative">
            <!-- Glow effect -->
            <div class="absolute inset-0 blur-3xl bg-[#FFD700]/10 -z-10 scale-125 rounded-full"></div>
            
            <!-- Phone bezel -->
            <div class="relative bg-gradient-to-b from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl border border-gray-700/50">
              <!-- Notch -->
              <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-2xl z-20"></div>
              
              <!-- Screen -->
              <div class="relative overflow-hidden rounded-[2.5rem] bg-black">
                <video
                  bind:this={demoVideo}
                  class="w-56 lg:w-64 aspect-[9/19.5] object-cover"
                  src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/Game-trailer-Attempt-3.mp4"
                  autoplay
                  playsinline 
                  loop
                  muted>
                </video>
              </div>
              
              <!-- Home indicator -->
              <div class="absolute bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          
          <!-- Badges underneath phone -->
          <div class="flex flex-wrap justify-center gap-2 mt-6">
            <div class="px-4 py-2 bg-[#00c400]/20 border border-[#00c400]/50 rounded-full backdrop-blur-sm">
              <span class="text-[#00c400] text-xs font-semibold">Live Gameplay</span>
            </div>
            <div class="px-4 py-2 bg-[#FFD700]/20 border border-[#FFD700]/50 rounded-full backdrop-blur-sm">
              <span class="text-[#FFD700] text-xs font-semibold">Alpha Development</span>
            </div>
          </div>
        </div>
      </div>
      
    </div>

  </div>

  <!-- Spacer -->
  <div class="h-2 border-b-8 border-[#ffffff10]"></div>

  <!-- Characters -->
  <div class="mx-auto w-11/12 lg:w-1/2 mt-20">
    <h1 class="jersey-font text-xl green-header-text glow-text">
      Characters
    </h1>
  </div>
  <div class="w-11/12 lg:w-1/2 mx-auto h-auto lg:h-auto"> 
    {#each characters as character, index}
      <div class="pilot-card group w-full my-4 rounded-xl lg:w-full p-5 backdrop-blur-lg bg-gradient-to-br from-white/5 to-white/10 border border-white/20 text-white flex gap-5 hover:border-[#FFD700]/40 relative overflow-hidden">
        <!-- Subtle gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#FFD700]/5 to-[#00c400]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <!-- Left column - Video/Image -->
        <div class="flex-shrink-0 relative z-10">
          <div class="relative">
            <video
              autoplay
              playsinline 
              muted
              loop
              class="h-24 w-24 lg:h-36 lg:w-36 rounded-xl object-cover ring-2 ring-white/20 group-hover:ring-[#FFD700]/50 transition-all duration-300"
              poster="https://placehold.co/80x80/1f2937/ffffff?text=Video+Poster"
            >
              <source src="{character.video}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
            <!-- Character number badge -->
            <div class="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg">
              {index + 1}
            </div>
          </div>
        </div>
      
        <!-- Right column - Character Info -->
        <div class="flex-1 relative z-10 flex flex-col justify-center">
          <div class="flex items-center gap-2 mb-1">
            <h1 class="text-2xl lg:text-4xl gold-header-text tracking-tight">{character.name}</h1>
          </div>
          <h2 class="text-lg lg:text-xl green-header-text font-medium mb-2">{character.title}</h2>
          
          <!-- Special ability with icon -->
          <div class="bg-black/30 rounded-lg px-3 py-2 mb-3 border-l-4 border-[#00c400]">
            <p class="text-xs lg:text-sm text-gray-300">
              <span class="text-[#00c400] font-semibold">Special:</span> {character.special}
            </p>
          </div>
          
          <p class="text-xs lg:text-sm text-gray-400 leading-relaxed line-clamp-3 lg:line-clamp-none">{character.description}</p>
        </div>
      </div>
    {/each}
  </div>
  <div class="w-11/12 lg:w-1/2 mx-auto mt-4 p-4 rounded-lg border-2 border-[#FFD700]/50 bg-[#FFD700]/10 backdrop-blur-lg">
    <div class="flex items-start gap-3">
      <div>
        <h1 class="text-[#FFD700] text-sm lg:text-3xl mb-1">We're Hiring!</h1>
        <p class="text-gray-300 text-xs lg:text-sm mb-2">
          We're looking for a talented <span class="text-purple-400 font-semibold">Graphic Designer & Illustrator</span> to create original character concepts and game lore settings. 
          We've used AI-generated concepts as a starting point, but now we need an artist to finalize designs and develop additional assets. Ideal candidates are passionate about sci-fi and space themes, with experience in 
          <span class="text-purple-400 font-semibold">comic book-style illustration</span>.
        </p>
        <a href="/jobs" class="inline-flex items-center text-[#00c400] hover:text-[#00ff00] text-sm font-medium transition-colors">
          View Open Positions →
        </a>
      </div>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-20 border-b-8 border-[#ffffff10]"></div>

    <!-- Lore -->
  <div class="relative w-full overflow-hidden min-h-[50vh] lg:min-h-[60vh]">
    <!-- Background Video (Desktop only) -->
    <video
      class="hidden lg:block absolute inset-0 w-full h-full object-cover"
      src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/videos/SpaceAnimatedVideo.mp4"
      autoplay
      loop
      playsinline 
      muted>
    </video>
    <!-- Dark overlay for better text readability -->
    <div class="hidden lg:block absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>
    
    <div class="relative z-10 w-11/12 lg:w-10/12 mx-auto py-12 lg:py-20 flex items-center min-h-[50vh] lg:min-h-[60vh]">
      
      <div class="w-full lg:w-1/2">
        <div class="lore-card p-6 lg:p-8 space-y-5 backdrop-blur-xl bg-black/40 lg:bg-white/5 border border-white/10 rounded-2xl shadow-2xl">
          
          <!-- Section Badge -->
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full">
              <span class="text-purple-400 text-sm font-semibold uppercase tracking-wide">Story</span>
            </div>
          </div>

          <!-- Title -->
          <div>
            <h1 class="text-4xl lg:text-5xl gold-header-text font-bold mb-2">The Lore</h1>
            <p class="text-gray-400 text-sm lg:text-base">Year 2157 — The Solar System Under Siege</p>
          </div>

          <!-- Lore Content -->
          <div class="space-y-4">
            <p class="text-gray-300 text-sm lg:text-base leading-relaxed">
              An alien force has set its sights on our Sun — viewing it as a vital energy resource to fuel their interstellar conquest. Their strategy is ruthless: <span class="text-[#FFD700] font-medium">destroy each planet</span> to eliminate any resistance before claiming our star.
            </p>
            
            <p class="text-gray-300 text-sm lg:text-base leading-relaxed">
              Earth's <span class="text-[#00c400] font-medium">Solar System Defense Force (SSDF)</span> has discovered the enemy's first move — they've destabilized the asteroid belt, weaponizing space debris against every world in our system.
            </p>

            <div class="bg-black/30 rounded-lg px-4 py-3 border-l-4 border-[#FFD700]">
              <p class="text-sm text-gray-300 italic">
                "The Sun is essential to all life. If it falls, so does everything we've ever known. We are humanity's last line of defense."
              </p>
              <p class="text-xs text-[#FFD700] mt-2 font-semibold">— Captain Phoenix, SSDF Commander</p>
            </div>
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap gap-2 pt-2">
            <span class="px-3 py-1.5 bg-black/60 border border-[#FFD700]/40 rounded-full text-xs text-white font-medium shadow-lg">Earth</span>
            <span class="px-3 py-1.5 bg-black/60 border border-[#00c400]/40 rounded-full text-xs text-white font-medium shadow-lg">The Sun</span>
            <span class="px-3 py-1.5 bg-black/60 border border-purple-500/40 rounded-full text-xs text-white font-medium shadow-lg">Alien Invasion</span>
            <span class="px-3 py-1.5 bg-black/60 border border-blue-400/40 rounded-full text-xs text-white font-medium shadow-lg">SSDF</span>
          </div>
        </div>
      </div>
      
    </div>
  </div>

  <!-- Spacer -->
  <div class="mb-20 border-b-8 border-[#ffffff10]"></div>

  <!-- Kickstarter -->
  <KickstarterPromo variant="cosmic" />

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
  {/if}

  <!-- Contact Form -->
  <div class="relative z-10">
    <ContactForm isLoading={isLoading} />

    <!-- Spacer -->
    <div class="h-10 lg:h-32"></div>
  </div>
</main>
<style>
  :global(html) {
    scroll-behavior: smooth;
  }

  .glow-text {
    text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  }

  .header-card, .demo-info-card, .lore-card
  {
    transition: all 300ms ease-out;
  }

  .header-card:hover, .demo-info-card:hover {
    border-color: rgba(255, 215, 0, 0.3);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    transform: translateY(-4px);
  }

  .phone-mockup {
    transition: all 400ms ease-out;
  }

  .phone-mockup:hover {
    transform: translateY(-8px) scale(1.02);
  }

  @media (min-width: 1000px) { 
    /* Lore */
    .lore-card:hover{
    transition: 200ms;
    background: linear-gradient(135deg, #5f9f571a, #FFD7001a);
    padding: 1em;
    border-color: #0fd8414d;
    }
    .lore-card:hover {
    transition: 200ms;
    font-size: 1.2em;
    line-height: 1.45em;
    }

    /* Pilot Card */
    .pilot-card {
      transition: all 300ms ease-out;
      transform: translateY(0);
    }
    .pilot-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px -15px rgba(255, 215, 0, 0.15);
    }
  }

  /* Skeleton Loading UI */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .skeleton-container {
    padding: 1rem;
  }

  .skeleton-hero {
    min-height: 70vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .skeleton-hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
  }

  @media (min-width: 1024px) {
    .skeleton-hero-content {
      flex-direction: row;
      justify-content: center;
    }
  }

  .skeleton-logo {
    width: 280px;
    height: 280px;
    border-radius: 50%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-card-large {
    width: 100%;
    max-width: 500px;
    padding: 2rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
  }

  .skeleton-badge {
    width: 180px;
    height: 2rem;
    border-radius: 9999px;
    margin-bottom: 1.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-title-large {
    width: 70%;
    height: 2.5rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text-line {
    width: 50%;
    height: 1rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-tags {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .skeleton-tag {
    width: 80px;
    height: 1.75rem;
    border-radius: 9999px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-text-block {
    width: 100%;
    height: 4rem;
    margin-bottom: 1rem;
    border-radius: 0.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-buttons {
    display: flex;
    gap: 0.75rem;
  }

  .skeleton-button {
    flex: 1;
    height: 2.5rem;
    border-radius: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-button-full {
    width: 100%;
    height: 2.75rem;
    margin-bottom: 0.75rem;
    border-radius: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-section {
    width: 91.666%;
    max-width: 800px;
    margin: 3rem auto;
  }

  .skeleton-demo-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    .skeleton-demo-grid {
      flex-direction: row;
      justify-content: center;
    }
  }

  .skeleton-phone {
    width: 256px;
    height: 500px;
    border-radius: 3rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-section-title {
    width: 150px;
    height: 1.5rem;
    margin-bottom: 1.5rem;
    border-radius: 0.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-character-card {
    display: flex;
    gap: 1.25rem;
    padding: 1.25rem;
    margin-bottom: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
  }

  .skeleton-character-image {
    width: 6rem;
    height: 6rem;
    flex-shrink: 0;
    border-radius: 0.75rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  @media (min-width: 1024px) {
    .skeleton-character-image {
      width: 9rem;
      height: 9rem;
    }
  }

  .skeleton-character-info {
    flex: 1;
  }

  .skeleton-character-name {
    width: 60%;
    height: 1.75rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-character-title {
    width: 40%;
    height: 1.25rem;
    margin-bottom: 0.75rem;
    border-radius: 0.25rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-character-special {
    width: 100%;
    height: 2.5rem;
    margin-bottom: 0.75rem;
    border-radius: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }
</style>
