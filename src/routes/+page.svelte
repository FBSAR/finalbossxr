<script lang='ts'>
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { Button, Badge, FloatingLabelInput, Textarea } from 'flowbite-svelte';
  import { LinkedinSolid, AppleSolid, DiscordSolid, FacebookSolid, XSolid} from 'flowbite-svelte-icons'
  import { enhance } from '$app/forms';
  import { showSuccessToast ,showErrorToast } from '$lib/stores/toastStore';


  // TailwindCSS Classes
  const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';

  // Contact Form Submission
  let contactInfo = {
    name: '',
    email: '',
    message: '',
  }
  async function handleSubmit(event: SubmitEvent) {
    console.log('Attempting to Submit Form...');
    const form = event.currentTarget as HTMLFormElement; 

    try {
      // Check if User has filled out entire form
      if( contactInfo.name == '' || 
          contactInfo.email == '' || 
          contactInfo.message == '' ) 
        { return showErrorToast('Please fill out the entire form') }

        // Fetch Slack API Request
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form)   
        });

        // Success Response
        if (response.ok) {
          const data = await response.json();
          showSuccessToast();

          // Failure Response
        } else {
          console.error('Error submitting form:', response.status);
          showErrorToast('There was an error submitting your form. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showErrorToast('There was an error submitting your form. Please try again later.')
    }
  }
  function testerLink() {
      window.open('https://forms.gle/SWN4pGnP4crNx78e7', '_blank');
  }
  function discordLink() {
      window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
  function gotoCosmicPage() {
    goto('cosmic');
  }
  function gotoFacebookPage() {
    window.open('https://www.facebook.com/FinalBossStudios', '_blank');
  }
  function gotoInstagramPage() {
    window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
  function gotoXPage() {
    window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
  function gotoLinkedInPage() {
    window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
  onMount(() => {
    return;
  })
</script>
<main>

  <!-- Header -->
   <!-- 
    Desktop - Has screen sized background video
    Mobile - No background video, show video directly after text
   -->
  <div class="relative z-10 h-auto lg:h-screen pb-20 lg:pb-0 mb-8 overflow-hidden border-b-8 border-[#00c40030]">
    <!-- Desktop Background Video -->
    <video
      class="hidden lg:block absolute inset-0 w-full h-full object-cover bg-black opacity-15"
      style="transform: scaleX(-1) translateY(-20%);"
      src="https://ik.imagekit.io/lgpq0vloy/FinalBossXR/FlightMission01.mp4?updatedAt=1746125092231"
      autoplay
      loop
      muted>
    </video>
    <!-- Header Content -->
    <div class="relative z-20 mx-auto lg:m-8 lg:p-8 w-11/12 lg:w-[800px] pl-0 pt-0 bg-none lg:backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2 rounded-lg shadow-2xl">
      <img class="w-40 h-40" src="https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Coz_Logo_Final.png?updatedAt=1746148308153" alt="Cosmic Collisions Logo">
      <h1 class="text-3xl lg:text-5xl jersey-font green-header-text">Get a Taste of the Future</h1>
      <p class="text-sm lg:text-md">Blast into a new reality. Command your ship, defend Earth, and explore a solar-system under threat in the ultimate AR sci-fi battle. This is the future of mobile gaming.</p>
      <!-- Mobile Video -->
      <video
      class="w-full lg:w-[600px] my-8 lg:hidden"
      src="https://ik.imagekit.io/lgpq0vloy/FinalBossXR/FlightMission01.mp4?updatedAt=1746125092231"
      autoplay
      loop
      playsinline
      muted>
    </video>
      <!-- Upcoming Platforms message -->
      <div class="flex">
        <h3 class="relative top-1 text-xl lg:text-2xl gold-header-text">Upcoming Platforms June 2025 (Demo)</h3>
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
      <Button on:click={gotoCosmicPage} color="green" class="mt-4 mr-2 w-full lg:w-52">Cosmic Collisions Demo</Button>
      <Button on:click={discordLink} color="purple" class="mt-4 mr-2 w-full lg:w-52 relative lg:top-1">
        <DiscordSolid class="mr-2"></DiscordSolid>Join our Discord
      </Button>
      <Button href="#testers" color="light" class="mt-4 mr-2 w-full lg:w-52">Become a Tester</Button>
      <!-- <h2 class="block lg:hidden">Development Footage / Story Mode</h2> -->
    </div>
  </div>

  <!-- Who is Final Boss? -->
  <div id="made-with" class="block lg:flex pb-20 lg:pb-0 mx-auto h-auto lg:h-[500px] md:shadow-4xl w-full border-b-8 border-[#00c40030]">
    <div class="w-full lg:w-1/2 bg-[#] p-0 lg:pr-8 content-center">
      <!-- Desktop FBS Intro Video -->
      <video
        class="w-full lg:w-[600px] mx-auto hidden lg:block" autoplay muted loop playsinline
        src="https://ik.imagekit.io/k8qym6wh0/FBSIntro.mp4?updatedAt=1747791672391">
      </video>    
    </div>
    <div class="w-11/12 lg:w-1/2 bg-[#] content-center">
      <!-- <img class="h-32" src="https://ik.imagekit.io/lgpq0vloy/logos/F_Logo_White.png?updatedAt=1721187101575" alt="" srcset=""> -->
      <h1 class="text-3xl lg:text-5xl gold-header-text">Our Goal? Evolutionize Gaming</h1>
      <!-- <QuoteSolid color="#ffd24d" size="xl"></QuoteSolid> -->
      <p class="text-lg">
        Remember the electric energy of a room packed with friends, controllers in hand, battling it out in Smash Bros, Halo, Madden, Mortal Kambat, etc?
        <br><br><span class="jersey-font green-header-text text-5xl">We do</span>.<br>
        <br>Our mission is to recapture that magic, reimagining the spirit of couch multiplayer for the modern era through the innovative possibilities of augmented and mixed reality (AR/MR). 
        <br><br><span class="jersey-font green-header-text text-2xl">We're building new ways to play together, in the same space, and beyond.</span>
      </p>
      <!-- <h3 class="text-[#ffd24d] text-2xl mt-4">~ Eddie T. | CEO & Co-Founder</h3> -->
      <a href="/about" class="text-[#35a2f4] text-sm mt-4 inline-block border-b-2 border-[#35a2f4]">More info about our Team &rarr;</a>
    </div>
      <!-- Mobile FBS Intro Video -->
      <video
        class="w-full lg:w-[600px] block lg:hidden" autoplay muted loop playsinline
        src="https://ik.imagekit.io/k8qym6wh0/FBSIntro.mp4?updatedAt=1747791672391">
      </video>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Cosmic -->
  <div id="cosmic" class="block lg:flex mx-auto w-11/12 h-auto pb-20 border-b-8 border-[#00c40030]">
    <div class="w-11/12 lg:w-1/2 mx-auto h-auto bg-[#] content-center">
      <img class="h-32 mb-4" src="https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Coz_Logo_Final.png?updatedAt=1746148308153" alt="" srcset="">
      <p class="text-xs lg:text-md">
        Born from our 2023 Metaverse Creators VR Hackathon project, Cosmic Collisions, this game captured the simple yet addictive fun of shooting down incoming asteroids in VR. That core gameplay loop resonated with us, inspiring us the following year to reimagine the concept as a more accessible Mobile AR experience. 
        <br>
        <br>
        Now, we're expanding on that foundation with RPG elements reminiscent of Dynasty Warriors; Players will unlock unique abilities for diverse characters as they progress through their individual stories and perspectives on the unfolding alien invasion.
        <br>
        <br>
        This experience utilizes spacial awareness, it a way that is similar to the game of Pool. Find your position, aim your shot, fire on the target.
      </p>
      <a href="/cosmic" class="text-[#35a2f4] text-lg lg:text-2xl mt-4 inline-block border-b-2 border-[#35a2f4]">More Info About Cosmic Collisions &rarr;</a>
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
          <h3 class="relative inline-block top-1 text-2xl gold-header-text mr-4">Made with Unreal Engine 5

            <!-- Unreal Icon -->
          <svg class="inline" fill="#00c400" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="m12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12c0-6.627-5.373-12-12-12zm0 1.846c5.595.007 10.128 4.545 10.128 10.141 0 5.601-4.54 10.141-10.141 10.141s-10.141-4.54-10.141-10.141c0-2.8 1.135-5.335 2.97-7.17 1.837-1.835 4.374-2.97 7.176-2.97h.007zm0 2.77c-4.392.774-8.308 4.824-8.308 9.23 2.149-3.794 3.584-4.067 3.981-4.067s.606.206.606.663v5.654c0 .703-1.366.588-1.818.519 1.67 2.485 5.539 2.77 5.539 2.77l1.846-1.846 1.846.923c2.914-1.334 4.615-4.19 4.615-4.615-.701.868-1.646 1.515-2.731 1.836l-.039.01c-.245 0-.923-.126-.923-.462v-6.693c0-.581 1.342-2.354 1.846-3-3.332.873-4.298 2.394-4.298 2.394s-.253-.548-1.24-.548c.501.473.838 1.114.922 1.832l.001.014v5.654c-.525.373-1.144.653-1.813.801l-.034.006c-.64 0-.952-.26-.952-.75s.029-6.634.029-6.634-.923.339-.923-1.558c0-.949 1.846-2.135 1.846-2.135z"/>
          </svg>
          </h3>
          
        </a>
      </div>
    </div>
    <div class="w-11/12 lg:w-1/2 mx-auto object-cover bg-[#] pl-0 lg:pl-10 content-center">
      <video class="block lg:hidden w-full h-full object-cover" autoplay muted controls playsinline>
        <source src="https://ik.imagekit.io/lgpq0vloy/FinalBossXR/StoryMission01.mp4?updatedAt=1746148790663" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <video class="hidden lg:block w-full h-full object-cover" autoplay muted controls playsinline>
        <source src="https://ik.imagekit.io/lgpq0vloy/FinalBossXR/StoryMission01.mp4?updatedAt=1746148790663" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <h2 class="block lg:hidden">Development Footage / Flight Mission</h2>
      <h2 class="hidden lg:block">Development Footage / Story Mission</h2>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
   
  <!-- Beta Testers / Discord -->
  <div id="testers" class="block lg:flex mx-auto h-auto lg:h-[500px] md:shadow-4xl w-11/12 lg:w-3/4">
    <div class="w-full lg:w-1/2 bg-[#] content-center">
      <h1 class="text-3xl my-2 green-header-text">We need Testers (You).</h1>
      <img class="w-full h-full pb-10 lg:pb-0 lg:pr-10 object-cover" src="https://ik.imagekit.io/lgpq0vloy/Photos/IMG_4302.jpg?updatedAt=1746243009214" alt="" srcset="">
    </div>
    <div class="w-full lg:w-1/2 content-center">
      <h3 class="text-[#ffd24d] text-3xl">Testers get a free Final Boss T-Shirt (limted time)</h3>
      <p class="text-md lg:text-lg my-4">
        Join the Final Boss team as a Beta Tester and be among the first to experience Cosmic Collisions and shape our future games! We're seeking 25-30 dedicated players to help us test, provide valuable feedback, and even spread the word. Your insights will be instrumental in making our games the best they can be!      </p>
      <Button on:click={testerLink} color="green" class="mt-4 w-full lg:w-48">Become a Tester</Button>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
   
  <!-- Form & Social Media -->
  <div class="sm:inline lg:flex w-1/3 mx-auto my-4 bg-[#88888800] justify-center text-center">
    <!-- Flowbite InstagramSolid icon didnt work -->
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoInstagramPage}>
      <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#00c400"/>
      <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#00c400"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#00c400"/>
      </svg>
    </Button>    
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoFacebookPage}>
      <XSolid size="xl" class="mx-2" color="#00c400"></XSolid>
    </Button>    
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoLinkedInPage}>
      <LinkedinSolid size="xl" class="mx-2" color="#00c400"></LinkedinSolid>
    </Button>    
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoFacebookPage}>
      <FacebookSolid  size="xl" class="mx-2" color="#00c400"></FacebookSolid>
    </Button>
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoFacebookPage}> 
      <svg fill="#00c400" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
      </svg>
    </Button>
    <br>
  </div>
  <div class="text-center my-8 pb-20 w-full border-b-8 border-[#00c40030]">
    <Button on:click={discordLink} color="purple" class="w-48">
      <DiscordSolid class="mr-2"></DiscordSolid>
      Join our Discord
    </Button>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Contact Form -->
  <div class="mx-auto w-11/12">
    <h1 class="jersey-font page-header green-header-text">CONTACT US</h1>
  <p class="text-lg lg:text-lg sm:w-1/2 lg:w-1/2">
    Have a question? Have a comment? Want to work with, or invest in Final Boss?
    Please reach out, and we will contact you are our earliest convenience!
  </p>
  <Badge color="yellow">Please fill out entire form</Badge>
  <!-- Spacer -->
  <div class="h-4"></div>
   
  <!-- Form -->
  <div class="w-full lg:w-1/2 bg-white/10 p-4">
    <form method="POST" use:enhance on:submit|preventDefault={handleSubmit}>
      <FloatingLabelInput 
        maxlength="100"
        bind:value={contactInfo.name}
        name="name"
        classInput={inputClass}
        defaultClass={"mb-2 bg-red-900"} style="filled" type="text">
        First & Last Name
      </FloatingLabelInput>
      <!-- Spacer -->
      <div class="h-4"></div>
      <FloatingLabelInput
        maxlength="100"
        bind:value={contactInfo.email}
        name="email"
        classInput={inputClass}
        defaultClass={"mb-2"} style="filled" color="base" type="email">
        Email
      </FloatingLabelInput>

      <!-- Spacer -->
      <div class="h-4"></div>
      <Textarea 
        maxlength="500"
        bind:value={contactInfo.message}
        name="message"
        class={inputClass}
        placeholder="Your message" rows="6"  
      />
      <!--         style="background: var(--green-gradient);" 
 -->
      <button
        type="submit"
        disabled={contactInfo.name === '' || contactInfo.email === '' || contactInfo.message === '' }
        class="block w-full h-10 rounded text-white text-lg mt-2 disabled:opacity-50 disabled:bg-white/20 bg-[#0e9f0e] hover:bg-[var(--red)] duration-200">
          Submit
      </button>
    </form>
  </div>
  </div>
  
</main>
<style>
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