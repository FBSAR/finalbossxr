<script lang="ts">
  import { onMount } from 'svelte';
  import SocialMedia from '$lib/components/SocialMedia.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
    import { Button } from 'flowbite-svelte';
    import { AppleSolid } from 'flowbite-svelte-icons';

  // Contact Form Submission
  function testerLink() {
       window.open('https://forms.gle/SWN4pGnP4crNx78e7', '_blank');
  }
  function iosTesterLink() {
       window.open('https://forms.gle/SWN4pGnP4crNx78e7', '_blank');
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
  <!-- New Header -->
   <div class="w-11/12 flex flex-col md:flex-row mx-auto my-10 lg:my-20 h-auto content-center">

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      
      <!-- New Left Column -->
      <div class="lg:col-span-1 hidden lg:block">
        <!-- Your new left content here -->
        <!-- <div class="bg-white/10 border-white/20 border-2 rounded-lg p-4">
          <p>Left sidebar content</p>
        </div> -->
      </div>
      
      <!-- Middle Left Column - Your existing left content -->
      <div class="lg:col-span-1  content-center ">        
       <img 
         src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" 
         class="w-full mx-auto" 
         alt="Cosmic Collisions Logo"
       >
      </div>

      <!-- Middle Right Column - Your existing right content -->
      <div class="demo-card p-4 lg:col-span-2 space-y-4 bg-none lg:backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2 rounded-lg shadow-2xl">
        <div class="flex bg-[#88888800]">
          <h3 class="text-lg lg:text-2xl gold-header-text mr-2">Upcoming Platforms (Demo)</h3>
          <svg fill="#00c400"  version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"  width="32px" height="32px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
            <g id="b75708d097f2188dff6617b0f00f7c43">
              <path display="inline" d="M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203
                c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203
                c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099
                c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937
                c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399
                C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998
                l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232
                c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957
                c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345
                c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976
                S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983
                c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156
                c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226
                v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z">
              </path>
            </g>
          </svg>
        </div>
        <div class="italic">
          <h1 class="text-3xl green-header-text inline">Genre:</h1>
          <span class="text-[#999]">Arcade, Space Shooter, RPG, Augmented Reality (AR) </span>
        </div>
        <p class="text-white text-sm lg:text-lg">
          Get ready to shoot some aliens and asteroids in space, in an AR environment! Inspired by classics like <b>Galaga</b> and <b>Space Invaders</b>, we aim to add another dimension - and story - to the traditional space shooter. Join our heroes from the SSDF (Solar System Defense Force), as they protect the Earth, the Sun, and their neighbors from an oncoming enemy attack.
        </p>
      </div>

      <!-- New Right Column -->
      <div class="lg:col-span-1 hidden lg:block">
        <!-- Your new right content here -->
        <!-- <div class="bg-white/10 border-white/20 border-2 rounded-lg p-4">
          <p>Right sidebar content</p>
        </div> -->
      </div>
      
    </div>

  </div>

  <!-- Spacer -->
  <div class="h-2 border-b-8 border-[#ffffff10]"></div>

  <!-- Game Play Update & Video -->
  <div class="w-11/12 flex flex-col md:flex-row mx-auto my-10 lg:my-20 h-auto content-center">

    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      
      <!-- New Left Column -->
      <div class="lg:col-span-1 hidden lg:block">
        <!-- Your new left content here -->
        <!-- <div class="bg-white/10 border-white/20 border-2 rounded-lg p-4">
          <p>Left sidebar content</p>
        </div> -->
      </div>
      
      <!-- Middle Left Column - Your existing left content -->
      <div class="demo-card p-4 lg:col-span-2 space-y-4 bg-none lg:backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2 rounded-lg shadow-2xl">
        <h1 class="text-5xl gold-header-text">Demo</h1>
        <p class="text-md">
        We are currently working towards an iOS/Android release for an official demo. 
        This demo will be specifially designed to highlight the gameplay design
        </p>
        <ul class="list-disc pl-8 mt-2 green-header-text jersey-font text-2xl">
          <li>Tutorial Mission</li>
          <li>Flight Mission #01</li>
          <li>Survival Mode - Earth</li>
        </ul>
        <br>
        <h2 class="text-4xl lg:mt-0 lg:text-4xl purple-header-text">
          Want to play the Demo?
        </h2>
        
          
        <!-- <Button on:click={testerLink} color="none" class="text-white text-md mt-2 w-full lg:w-40" style="background: var(--green-gradient);">Tester Sign Up</Button> -->
        <Button on:click={iosTesterLink} class="text-white bg-[#555] hover:bg-[#776505] uppercase text-lg mt-2 w-full">
          <span><AppleSolid size="xl" class="mx-2" color="#00c400"></AppleSolid></span>
          iOS Testflight
        </Button>
        <Button on:click={androidTesterLink} class="text-white bg-[#555] hover:bg-[#776505] uppercase text-lg mt-2 w-full">
          <span>
            <!-- Android Icon -->
            <svg fill="#00c400" class="mx-2" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
            <g id="b75708d097f2188dff6617b0f00f7c43">
              <path display="inline" d="M120.606,169h270.788v220.663c0,13.109-10.628,23.737-23.721,23.737h-27.123v67.203
                  c0,17.066-13.612,30.897-30.415,30.897c-16.846,0-30.438-13.831-30.438-30.897v-67.203h-47.371v67.203
                  c0,17.066-13.639,30.897-30.441,30.897c-16.799,0-30.437-13.831-30.437-30.897v-67.203h-27.099
                  c-13.096,0-23.744-10.628-23.744-23.737V169z M67.541,167.199c-16.974,0-30.723,13.963-30.723,31.2v121.937
                  c0,17.217,13.749,31.204,30.723,31.204c16.977,0,30.723-13.987,30.723-31.204V198.399
                  C98.264,181.162,84.518,167.199,67.541,167.199z M391.395,146.764H120.606c3.342-38.578,28.367-71.776,64.392-90.998
                  l-25.746-37.804c-3.472-5.098-2.162-12.054,2.946-15.525c5.102-3.471,12.044-2.151,15.533,2.943l28.061,41.232
                  c15.558-5.38,32.446-8.469,50.208-8.469c17.783,0,34.672,3.089,50.229,8.476L334.29,5.395c3.446-5.108,10.41-6.428,15.512-2.957
                  c5.108,3.471,6.418,10.427,2.946,15.525l-25.725,37.804C363.047,74.977,388.055,108.175,391.395,146.764z M213.865,94.345
                  c0-8.273-6.699-14.983-14.969-14.983c-8.291,0-14.99,6.71-14.99,14.983c0,8.269,6.721,14.976,14.99,14.976
                  S213.865,102.614,213.865,94.345z M329.992,94.345c0-8.273-6.722-14.983-14.99-14.983c-8.291,0-14.97,6.71-14.97,14.983
                  c0,8.269,6.679,14.976,14.97,14.976C323.271,109.321,329.992,102.614,329.992,94.345z M444.48,167.156
                  c-16.956,0-30.744,13.984-30.744,31.222v121.98c0,17.238,13.788,31.226,30.744,31.226c16.978,0,30.701-13.987,30.701-31.226
                  v-121.98C475.182,181.14,461.458,167.156,444.48,167.156z">
              </path>
            </g>
          </svg>
          </span>
          Android .APK
        </Button>
        <br>
        <span class="text-white text-xs">Please open on Mobile Browsers (iOS/Android)</span>
      </div>

      <!-- Middle Right Column - Your existing right content -->
      <div class="lg:col-span-1  content-center">
        <video
          bind:this={demoVideo}
          class="phone-case-iphone14"
          style=""
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/videos/FlightMission01PortraitFinal+-+Made+with+Clipchamp+(2).mp4"
          autoplay
          playsinline 
          loop
          muted>
        </video>
      </div>

      <!-- New Right Column -->
      <div class="lg:col-span-1 hidden lg:block">
        <!-- Your new right content here -->
        <!-- <div class="bg-white/10 border-white/20 border-2 rounded-lg p-4">
          <p>Right sidebar content</p>
        </div> -->
      </div>
      
    </div>

  </div>

  <!-- Spacer -->
  <div class="h-2 border-b-8 border-[#ffffff10]"></div>

  <!-- Characters -->
  <div class="mx-auto w-11/12 lg:w-1/2 mt-20">
    <h1 class="jersey-font text-4xl green-header-text">
      <!-- svelte-ignore a11y-missing-attribute -->
      <img
        src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" 
        class="w-12 mx-auto inline"  />
      Characters
    </h1>
  </div>
  <div class="w-11/12 lg:w-1/2 mx-auto h-auto lg:h-auto"> 
    {#each characters as character}
      <div class="pilot-card w-full my-2 lg:mx-1 rounded sm:w-1/2 lg:w-full p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white flex gap-4">
        <!-- Left column - Image only -->
        <div class="flex-shrink-0 lg:content-center">
        <!-- <img 
          src={character.photo} 
          class="h-20 lg:h-40 rounded-full" 
          alt="Flowbite Logo" 
        /> -->
        <video
          autoplay
          playsinline 
          muted
          loop
          class="h-20 w-20 lg:h-40 lg:w-40 rounded-full object-cover"
          poster="https://placehold.co/80x80/1f2937/ffffff?text=Video+Poster"
            >
         <source src="{character.video}" type="video/mp4">
         Your browser does not support the video tag.
        </video>
        </div>
      
        <!-- Right column - Everything else -->
        <div class="flex-1">
        <h1 class="text-3xl lg:text-5xl gold-header-text">{character.name}</h1>
        <h2 class="text-2xl lg:text-xl green-header-text">{character.title}</h2>
        <p class="text-sm lg:text-[0.85em] h-auto lg:h-6 mb-2 pb-4 border-b-2 border-[#999]"><b>Special</b>: {character.special}</p>
        <p class="text-xs lg:text-md text-[#ffffff80]">{character.description}</p>
        <br>
        </div>
      </div>
    {/each}
  </div>
  <!-- <div class="w-11/12 lg:w-1/2 flex flex-col md:flex-row mx-auto mt-2 h-auto lg:h-auto">
    <span class="text-gray-500">[Disclaimer] AI-Generated concept images, final concepts in development.</span>
  </div> -->

  <!-- Spacer -->
  <div class="h-2 my-20 lg:my-32 border-b-8 border-[#ffffff10]"></div>

  <!-- Lore -->
  <div class="w-11/12 flex flex-col md:flex-row mx-auto mt-2 h-auto lg:h-auto"> 

    <!-- Photo -->
    <div class="w-full mb-5 lg:mr-6 md:w-1/2">
      <div class="relative w-full h-96 overflow-hidden">
        <video
          autoplay
          playsinline 
          muted
          loop
          class="absolute inset-0 w-full h-full object-cover"
          poster="https://placehold.co/80x80/1f2937/ffffff?text=Video+Poster"
        >
          <source src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/videos/SpaceAnimatedVideo.mp4" type="video/mp4">
          Your browser does not support the video tag.
        </video>
      </div>
      <!-- <span class="text-gray-500">[Disclaimer] AI-Generated concept image</span> -->

    </div>

    <!-- Text and Link -->
    <div class="w-full md:w-1/2 lg:p-0">
      <h1 class="text-3xl jersey-font green-header-text">Lore</h1>
      <p class="lore-card text-sm lg:text-md lg:p-2 backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2 text-white">In 2157, an alien force targets the Sun as a vital resource, intending to destroy each planet to eliminate resistance. Earth’s <b>Solar System Defense Force (SSDF)</b> discovers the enemy has destabilized the asteroid belt, threatening every planet. 
        The SSDF must protect the solar system and its colonies to ensure survival, as the Sun is essential to all life.
      </p>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-2 my-20 lg:my-32 border-b-8 border-[#ffffff10]"></div>

  <!-- KickStarer -->
  <!-- <div class="mx-auto p-8 rounded shadow-lg text-center bg-white/10 border-2 border-[#ffcb0a]/40 w-11/12 lg:w-1/3">
    <p class="text-xl text-white">Want to donate to our KickStarter Campaign?</p>
    <Button color="none" class="text-black text-lg mt-6 w-full lg:w-40" style="background: var(--gold-gradient);">Contribute</Button>
  </div> -->

  <div class="mx-auto p-2 rounded shadow-lg text-center border-2 border-[#00c400]/60 bg-[#00c400]/10 w-11/12 lg:w-1/3">
    <img class="h-32 mx-auto relative bottom-3" src="https://finalbossxr.s3.us-east-1.amazonaws.com/misc/Kickstarter-Logo.png" alt="KickStarter">
    <p class="text-xl text-white relative bottom-8">Coming Soon - 2025</p>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
   
  <SocialMedia />
  
  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Contact Form -->
  <ContactForm />

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
</main>
<style>

  .header-card, .demo-card, .lore-card, .contact-card, .header-card p, .header-card h3, .demo-card p, .demo-card h1, .demo-card h2, .demo-card li,
  .contact-card, .contact-header-card
  {
    transition: 200ms;
  }
  @media (min-width: 1000px) { 
    /* Header Card */
    .header-card:hover, .demo-card:hover,  .contact-card:hover, .contact-header-card:hover {
      transition: 200ms;
      background: linear-gradient(135deg, #5f9f571a, #FFD7001a);
      transform: translateY(-10px);
      border-color: #0fd8414d;
    } 
    .header-card:hover {
      padding: 1em;
    }
    .header-card:hover h3 {
      font-size: 1.85em;
    }
    .header-card:hover p {
      font-size: 1.1em;
      line-height: 1.4em;
    }

    /* Demo Card */
    .demo-card:hover h1 {
      font-size: 5em;
    }
    .demo-card:hover h2 {
      font-size: 3em;
    }
    .demo-card:hover li {
      font-size: 1.25em;
    }
    .demo-card:hover p {
      font-size: 1.35em;
    }

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
      transition: transform 200ms ease-out, background 200ms ease-out, border-color 200ms ease-out, box-shadow 200ms ease-out;
      transform: translateY(-10px);
    }
    .pilot-card:hover {
      transition: 200ms;
      margin: 2em 0em 1em 0em;
      background: linear-gradient(135deg, #5f9f571a, #FFD7001a);
      transform: translateY(-10px);
      border-color: #0fd8414d;
    }
    .pilot-card:hover::after {
      transition: 200ms;
      margin: 0em;
    }

    /* Contact */
    .contact-header-card:hover {
      font-size: 1.35em;
    }
  }
</style>
