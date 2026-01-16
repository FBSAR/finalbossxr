<script lang='ts'>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Badge, FloatingLabelInput, Textarea } from 'flowbite-svelte';
  import { LinkedinSolid, AppleSolid, DiscordSolid, FacebookSolid, XSolid} from 'flowbite-svelte-icons'
  import { enhance } from '$app/forms';
  import ContactForm from '$lib/components/ContactForm.svelte';
  
  function testerLink() {
      window.open('https://forms.gle/SWN4pGnP4crNx78e7', '_blank');
  }
  function discordLink() {
      window.open('https://discord.gg/W2c5KHpy', '_blank');
  }
  function gotoCosmicPage() {
    goto('cosmic');
  }
  let heroVideo: HTMLVideoElement;

  onMount(() => {
    if (heroVideo) {
      // Ensure metadata is loaded
      const startVideo = () => {
        heroVideo.currentTime = 45; // start at 10s
        heroVideo.play().catch((err) => {
          console.warn('Autoplay failed:', err);
        });
      };

      if (heroVideo.readyState >= 1) {
        // Metadata already loaded
        startVideo();
      } else {
        heroVideo.addEventListener('loadedmetadata', startVideo);
      }
    }
  });
</script>
<main>

  <!-- Header -->
   <!-- 
    Desktop - Has screen sized background video
    Mobile - No background video, show video directly after text
   -->
  <div class="relative p-4 lg:p-0 lg:flex justify-center z-10 pb-20 lg:pb-0 mb-8 overflow-hidden border-b-8 border-[#ffffff10]">
    <!-- Desktop Background Video -->
    <video
      id="background-video-desktop"
      class="hidden lg:block absolute inset-0 w-full h-full object-cover bg-black opacity-90"
      style="transform: scaleX(-1) translateY(0%);"
      src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/space_rock_2.mp4"
      autoplay
      loop
      playsinline 
      muted>
    </video>
    <!-- Header Content -->
    <div class="z-20 mx-auto lg:m-4 lg:p-8">
      <!-- Two column grid container -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
      
      <!-- New Left Column -->
      <div class="lg:col-span-1 hidden lg:block">
        <!-- Your new left content here -->
        <!-- <div class="bg-white/10 border-white/20 border-2 rounded-lg p-4">
          <p>Left sidebar content</p>
        </div> -->
      </div>
      
      <!-- Middle Left Column - Your existing left content -->
      <div class="hero-card p-4 lg:col-span-1 bg-none lg:backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2 rounded-lg shadow-2xl">
        <img class="w-[320px] lg:w-[225px] lg:h-[225px] mx-auto" src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" alt="Cosmic Collisions Logo">
        
        <h1 class="text-4xl lg:text-[1.6em] xl:text-4xl my-2 jersey-font green-header-text">Get a Taste of the Future</h1>
        
        <p class="text-md xl:text:lg my-2">Blast into a new reality. Command your ship, defend Earth, and explore a solar-system under threat in the ultimate AR sci-fi battle. This is the future of mobile gaming.</p>
        
        <!-- Upcoming Platforms message -->
        <div class="flex">
          <h3 class="relative top-1 my-2 text-lg gold-header-text">Upcoming Platforms June 2025 (Demo)</h3>
          <AppleSolid size="xl" class="mx-2" color="#00c400"></AppleSolid>
          <svg fill="#00c400" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="32px" height="32px" viewBox="0 0 512 512" enable-background="new 0 0 512 512" xml:space="preserve">
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
        
        <div class="space-y-4">
          <Button on:click={gotoCosmicPage} color="green" class="w-full">Cosmic Collisions Demo</Button>
          <Button on:click={discordLink} color="purple" class="w-full">
            <DiscordSolid class="mr-2"></DiscordSolid>Join our Discord
          </Button>
          <Button href="#testers" color="light" class="w-full">Become a Tester</Button>
        </div>
      </div>

      <!-- Middle Right Column - Your existing right content -->
      <div class="lg:col-span-1 content-center">
        <video
          bind:this={heroVideo}
          id="hero-video-mobile"
          class="phone-case-iphone14 mx-auto"
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/Game-trailer-Attempt-3.mp4"
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
  </div>

  <!-- Who is Final Boss? -->
  <div id="made-with" class="block pb-20 lg:py-20 mx-auto h-auto md:shadow-4xl w-11/12 border-b-8 border-[#ffffff10]">
    <div class="flex flex-col lg:flex-row items-center justify-center w-full max-w-5xl mx-auto mb-10">
      <div class="intro-card w-11/12 lg:w-1/2 mx-auto mb-8 lg:mb-0 lg:mr-4 content-center bg-white/10 p-4 border-white/20 lg:border-2">
        <h1 class="text-3xl lg:text-4xl gold-header-text">Our Goal? Evolutionize Gaming</h1>
        <p class="text-baseline">
          Remember the electric energy of a room packed with friends, controllers in hand, battling it out in Smash Bros, Halo, Madden, Mortal Kambat, etc?
          <br><span class="jersey-font green-header-text text-5xl">We do</span>.
          <br>Our mission is to recapture that magic, reimagining the spirit of couch multiplayer for the modern era through the innovative possibilities of augmented and mixed reality (AR/MR).
          <span class="jersey-font green-header-text text-2xl">We're building new ways to play together, in the same space, and beyond.</span>
        </p>
        <a href="/about" class="text-[#35a2f4] text-sm mt-4 inline-block border-b-2 border-[#35a2f4]">More info about our Team &rarr;</a>
      </div>

      <div class="w-full mx-auto lg:w-1/2 content-center">
        <video
        class="w-full lg:w-[600px] mx-auto hidden lg:block" autoplay muted loop playsinline
        src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/FBSIntro.mp4">
        </video>
      </div>
    </div>
    <video
      class="w-full lg:w-[600px] block lg:hidden" autoplay muted loop playsinline
      src="https://finalbossxr.s3.us-east-1.amazonaws.com/videos/FBSIntro.mp4">
    </video>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Cosmic -->
  <div id="cosmic" class="block lg:flex mx-auto w-11/12 h-auto pb-20">
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
      
      <!-- New Left Column -->
      <div class="lg:col-span-1 hidden lg:block">
        <!-- Your new left content here -->
        <!-- <div class="bg-white/10 border-white/20 border-2 rounded-lg p-4">
          <p>Left sidebar content</p>
        </div> -->
      </div>
      
      <!-- Middle Left Column - Your existing left content -->
      <div class="cosmic-card p-4 lg:col-span-2 space-y-4 bg-none lg:backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2 rounded-lg shadow-2xl">
        <img class="h-32 mb-4" src="https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/Coz_Logo_Final_w_Text-NoBG.png" alt="" srcset="">
        <p class="text-sm lg:text-[0.9em] leading-normal">
        Born from our 2023 Metaverse Creators VR Hackathon project, Cosmic Collisions, this game captured the simple yet addictive fun of shooting down incoming asteroids in VR. That core gameplay loop resonated with us, inspiring us the following year to reimagine the concept as a more accessible Mobile AR experience. 
        <br>
        <br>
        Now, we're expanding on that foundation with RPG elements reminiscent of Dynasty Warriors; Players will unlock unique abilities for diverse characters as they progress through their individual stories and perspectives on the unfolding alien invasion.
        <br>
        <br>
        This experience utilizes spacial awareness, it a way that is similar to the game of Pool. Find your position, aim your shot, fire on the target.
        </p>
        <a href="/cosmic" class="text-[#35a2f4] text-lg lg:text-xl mt-4 inline-block border-b-2 border-[#35a2f4]">More Info About Cosmic Collisions &rarr;</a>
        <div class="flex bg-[#88888800] my-4">
        <h3 class="relative top-1 text-lg gold-header-text">Upcoming Platforms July 2025 [Demo]</h3>
        <AppleSolid size="xl" class="mx-2" color="#00c400"></AppleSolid>
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
        <div class=" bg-[#88888800] my-4">
        <a href="https://www.unrealengine.com" target="_blank">
          <h3 class="relative inline-block top-1 text-xl gold-header-text mr-4">Made with Unreal Engine 5

            <!-- Unreal Icon -->
          <svg class="inline" fill="#00c400" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12c0-6.627-5.373-12-12-12zm0 1.846c5.595.007 10.128 4.545 10.128 10.141 0 5.601-4.54 10.141-10.141 10.141s-10.141-4.54-10.141-10.141c0-2.8 1.135-5.335 2.97-7.17 1.837-1.835 4.374-2.97 7.176-2.97h.007zm0 2.77c-4.392.774-8.308 4.824-8.308 9.23 2.149-3.794 3.584-4.067 3.981-4.067s.606.206.606.663v5.654c0 .703-1.366.588-1.818.519 1.67 2.485 5.539 2.77 5.539 2.77l1.846-1.846 1.846.923c2.914-1.334 4.615-4.19 4.615-4.615-.701.868-1.646 1.515-2.731 1.836l-.039.01c-.245 0-.923-.126-.923-.462v-6.693c0-.581 1.342-2.354 1.846-3-3.332.873-4.298 2.394-4.298 2.394s-.253-.548-1.24-.548c.501.473.838 1.114.922 1.832l.001.014v5.654c-.525.373-1.144.653-1.813.801l-.034.006c-.64 0-.952-.26-.952-.75s.029-6.634.029-6.634-.923.339-.923-1.558c0-.949 1.846-2.135 1.846-2.135z"/>
          </svg>
          </h3>
          
        </a>
        </div>
      </div>

      <!-- Middle Right Column - Your existing right content -->
      <div class="lg:col-span-1 hidden lg:block content-center">
        <video
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
  <div class="h-10 lg:h-32 border-b-8 border-[#ffffff10]"></div>
   
  <!-- Beta Testers / Discord -->
  <div id="testers" class="block lg:flex py-20 mx-auto h-auto lg:h-[500px] md:shadow-4xl w-11/12 lg:w-3/4">
    <div class="w-full lg:w-1/2 bg-[#] content-center">
      <h1 class="text-3xl my-2 green-header-text">We need Testers (You).</h1>
      <img class="w-full h-full pb-10 lg:pb-0 lg:pr-10 object-cover" src="https://finalbossxr.s3.us-east-1.amazonaws.com/misc/fbs_tshirt_1.jpg" alt="" srcset="">
    </div>
    <div class=" w-full lg:w-1/2 content-center">
      <h3 class="text-[#ffd24d] text-3xl">Testers get a free Final Boss T-Shirt (limted time)</h3>
      <p class="tester-card text-md lg:text-lg my-4 bg-white/10 p-4 border-white/20 lg:border-2">
        Join the Final Boss team as a Beta Tester and be among the first to experience Cosmic Collisions and shape our future games! We're seeking 25-30 dedicated players to help us test, provide valuable feedback, and even spread the word. Your insights will be instrumental in making our games the best they can be!      </p>
      <Button on:click={testerLink} color="green" class="mt-4 w-full lg:w-48">Become a Tester</Button>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
  <ContactForm />

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
  
</main>
<style>
  .phone-case-iphone14 {
    height: 600px;
  }
  .hero-card, .intro-card, .cosmic-card, .tester-card {
    transition: 200ms;
  }
  @media (min-width: 1000px) {
    .hero-card:hover, .intro-card:hover, .cosmic-card:hover, .tester-card:hover {
      background: linear-gradient(135deg, #5f9f571a, #FFD7001a);
      transform: translateY(-10px);
      border-color: #0fd8414d;
    }
    .hero-card:hover img {
      height: 250px;
      width: 250px;
    }
    .hero-card *, .intro-card * {
      transition: 200ms;
    }
    .hero-card:hover p {
      font-size: 1.25em;
    }
    .hero-card:hover h1 {
      font-size: 3.75em;
    }
    .intro-card:hover p {
    font-size: 1.25em;
    }
    .cosmic-card img, .cosmic-card p {
      transition: 200ms;
    }
    .cosmic-card:hover p {
      font-size: 1.25em;
    }
    .cosmic-card:hover img {
      height: 300px;
    }
    .tester-card:hover {
      font-size: 1.45em;
    }
  }
  
  
  @keyframes fade-in-hor {
        0% {
            transform: translateX(-1.25rem);
        }
        100% {
            opacity: 1;
            transform: translateX(0rem);
        }
  }
  @keyframes fade-in-ver {
        0% {
            transform: translateY(1.25rem);
        }
        100% {
            opacity: 1;
            transform: translateY(0rem);
        }
  }
</style>