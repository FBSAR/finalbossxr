<script lang="ts">
    import { onMount } from 'svelte';
    import { Badge, Toast, Button, FloatingLabelInput, Textarea } from 'flowbite-svelte';
    import { CheckCircleOutline, CloseCircleOutline, LinkedinSolid, AppleSolid, DiscordSolid, FacebookSolid, XSolid } from 'flowbite-svelte-icons'
    import { enhance } from '$app/forms';

   // TailwindCSS Classes
  const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';
  const successToastClass = 'w-full max-w-xl z-50 p-4 text-white text-3xl bg-black shadow dark:text-white dark:bg-black border-2 border-[#00ff00] rounded gap-3'
  const errorToastClass = 'w-full max-w-sm lg:max-w-xl z-50 p-4 text-white text-3xl bg-black shadow dark:text-white dark:bg-black border-2 border-[#dd0000] rounded gap-3'

  // Toasts
  let successToast = false;
  function showSuccessToast() {
    successToast = true;
    setTimeout(() => {
      successToast = false;
    }, 8000);
  }

  let errorToast = false;
  let errorToastMessage = '';
  function showErrorToast(message: string) {
    errorToastMessage = message;
    errorToast = true;
    setTimeout(() => {
      errorToast = false;
      errorToastMessage = '';
    }, 5000);
  }

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
     let characters = [
      {
        name: 'Captain Phoenix',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Characters/DALL_E%202024-04-09%2021.17.57%20-%20In%20a%20universe%20where%20advanced%20technology%20and%20interstellar%20warfare%20collide,%20Captain%20Aurora%20_Phoenix.jpg?updatedAt=1724781653546',
        title: 'The Captain',
        special: 'Piercing Shots - These shots continue their momentum after hitting 1 object.',
        description: "A battle-hardened SSDF veteran, driven by the loss of her family in the alien attack. A brilliant tactician, she defends the solar system with unmatched skill, but her inner turmoil risks overwhelming her, as she battles between vengeance and hope.",
      },
      {
        name: 'Riley',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Characters/DALLE2024-04-1008.58.35-LieutenantRiley_MacGyver_McKayknownasTheEngineerstandsoutwiththeirred-themedengineeringgearembodyinginno-ezgif.com-webp-to-jpg-co.jpg?updatedAt=1724391506293',
        title: 'The Engineer',
        special: 'Repair Portal - Fix portals simply by flying through it.',
        description: "A young, improvisational genius who can turn scraps into solutions, from asteroid defenses to alien tech. Their rebellious nature and unconventional methods often clash with Phoenix's strict command, challenging them to find common ground and work as a team.",
      },
      {
        name: 'Johnny Sparks',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Characters/DALLE2024-04-1009.02.32-CadetJohnny_Sparky_SparksknownasTheRookieembodiesthevibrantenergyanduntestedvalorofanewrecruit.Dressed-ezgif.com-webp-to-jpg-conv.jpg?updatedAt=1724391506509',
        title: 'The Rookie',
        special: 'Health Regeneration - Player Ship’s Shield regenerates every [X amount of time]',
        description: "A newly minted graduate, Sparky is naive but full of courage and optimism. Despite their inexperience, they bring a fresh perspective and a contagious positive spirit, which could be the spark the resistance needs. An exceptional VR/AR gamer with a determination reminiscent of a young Leon Kennedy.",
      },
      {
        name: 'Xylo',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Characters/DALLE2024-04-1008.55.44-EnhancingXyloshumanlikenessfurthertheynowexhibitamorepronouncedblendofhumanandetherealavianfeatures.The-ezgif.com-webp-to-jpg-con.jpg?updatedAt=1724391506584',
        title: 'The Alien',
        special: 'Defense - Can destroy asteroids colliding into them, with no damage to the ship.',
        description: "An ethereal avian species with shimmering iridescent wings, hailing from a solar system bathed in twilight. With an innate grasp of astrophysics, Xylo navigates space with unmatched precision. Discovered after crash-landing on Earth, Xylo's gentle nature and otherworldly beauty quickly transformed initial fear into awe.",
      },
      {
        name: 'AI Wraith',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Characters/AI%20Wraith?updatedAt=1748462083566',
        title: 'The AI',
        special: 'Speed Increase - Temporary Speed Increase under certain conditions (still working on this design)',
        description: "Wraith, once a counterpart to Reaper, remains loyal to humanity. Operating in the shadows, Wraith uses its cyber capabilities to protect the solar system, quietly neutralizing threats and countering Reaper's plans. A silent guardian, it provides vital intelligence to the SSDF, ensuring the galaxy's survival.",
      },
    ]
</script>
<main>
  <!-- Header Text -->
  <div class="mx-auto w-11/12 px-4 lg:p-0">
    <h1 class="jersey-font page-header green-header-text">COSMIC COLLISIONS</h1>
  </div>

  <!-- Header Content -->
  <div class="w-11/12 flex flex-col p-4 lg:p-0 md:flex-row mx-auto h-auto lg:h-40"> 
    
    <!-- Photo -->
    <div class="w-1/2 mb-5 lg:mr-6 md:w-1/4">
      <img 
      src="https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Coz_Logo_Final.png?updatedAt=1746148308153" 
      class="w-3/4 mx-auto pt-8" 
      alt="Cosmic Collisions Logo"
      >
    </div>
    
    <!-- Text and Link -->
    <div class="w-full md:w-3/4">

    <div class="flex bg-[#88888800] mb-4">
      <h3 class="text-lg lg:text-2xl gold-header-text">Upcoming Platforms June 2025 (Demo)</h3>
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
    <div class="italic">
      <h1 class="text-3xl green-header-text inline">Genre:</h1>
      <span class="text-[#999]">Arcade, Space Shooter, RPG, Augmented Reality (AR) </span>
    </div>
    <p class="text-white opacity-80 text-md lg:text-xl md:text-white my-4 sm:w-1/2 lg:w-3/4">
      Get ready to shoot some aliens and asteroids in space, in an AR environment!
      Inspired by classics like <b>Galaga</b> and <b>Space Invaders</b>, we aim to add another dimension 
      - and story - to the traditional space shooter. Join our heroes from the SSDF (Solar System Defense Force), as they protect the Earth, the Sun, and their neighbors from an oncoming enemy attack.
    </p>
    <h1 class="text-4xl mt-20 lg:mt-0 lg:text-2xl gold-header-text">
      Want to play the Demo?
    </h1>
    <!-- <Button on:click={testerLink} color="none" class="text-white text-md mt-2 w-full lg:w-40" style="background: var(--green-gradient);">Tester Sign Up</Button> -->
    <Button on:click={testerLink} disabled color="purple" class="text-white text-md mt-2 w-full lg:w-40">
      iOS Testflight
    </Button>
    <Button on:click={testerLink} disabled color="purple" class="text-white text-md mt-2 w-full lg:w-40">
      Android .APK
    </Button>
    <Button on:click={testerLink} color="purple" class="text-white text-md mt-2 w-full lg:w-40">
      Tester Sign Up
    </Button>
    <br>
    <span class="text-white text-xs">Please open on Mobile Browsers (iOS/Android)</span>
  </div>

  </div>

  <!-- Spacer -->
  <div class="h-12 lg:h-40"></div>

  <!-- Game Play Video -->
  <div class="w-11/12 flex flex-col md:flex-row mx-auto mt-4 lg:mt-24 h-[500px] content-center">
    <!-- Description -->
    <div class="w-full mb-5 lg:mr-6 md:w-1/2">
      <h1 class="text-3xl gold-header-text">Game Update [05/06]</h1>
      <p class="text-md lg:text-xl">
        We are currently working towards an iOS/Android release for an official demo. 
        This demo will be specifially designed to highlight the gameplay design
      </p>
      <ul class="list-disc pl-8 mt-2 green-header-text jersey-font text-2xl">
        <li>Tutorial Mission</li>
        <li>Flight Mission #01</li>
        <li>Story Mode - Earth</li>
      </ul>
    </div>
    <!-- Video -->
    <div class="mb-5 lg:mr-6 md:w-1/2">
      <!-- svelte-ignore a11y-media-has-caption -->
      <video class="w-full h-full object-cover" autoplay muted controls playsinline>
        <source src="https://ik.imagekit.io/lgpq0vloy/FinalBossXR/StoryMission01.mp4?updatedAt=1746148790663" type="video/mp4">
        Your browser does not support the video tag.
      </video>
      <h2 class="gold-header-text">Development Footage / Story Mode</h2>
    </div>

  </div>

  <!-- Spacer -->
  <div class="h-2 lg:h-32 my-20 lg:my-10 border-b-2 border-gray-800"></div>

  <!-- Characters -->
  <div class="mx-auto w-11/12">
    <h1 class="jersey-font text-4xl gold-header-text">Characters</h1>
    <p class="w-full lg:w-1/2 mb-4 text-md lg:text-xl">
      The unit from the <span class="green-header-text jersey-font text-2xl">Solar System Defense Force (SSDF)</span>, 
      tasked with defending the solar system.
    </p>
  </div>
  <div class="w-11/12 flex flex-col md:flex-row mx-auto h-auto lg:h-auto"> 
    {#each characters as character}
        <div class="w-full my-2 lg:mx-1 rounded sm:w-1/2 lg:w-1/5 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={character.photo} 
            class="h-auto rounded mb-2" 
            alt="Flowbite Logo" 
            />
            <h2 class="text-2xl lg:text-xl green-header-text">{character.name}</h2>
            <h1 class="text-3xl lg:text-3xl gold-header-text mb-2">{character.title}</h1>
            <p class="text-md lg:text-[0.85em] h-16 mb-2 pb-4 border-b-2 border-[#999]"><b>Special</b>: {character.special}</p>
          <p class="text-md lg:text-[0.85em]">{character.description}</p>
          <br>
        </div>
    {/each}
  </div>
  <div class="w-11/12 flex flex-col md:flex-row mx-auto mt-2 h-auto lg:h-auto">
    <span class="text-gray-500">[Disclaimer] AI-Generated concept images, final concepts in development.</span>
  </div>

  <!-- Spacer -->
  <div class="h-2 my-4 lg:my-32 border-b-2 border-gray-800"></div>

  <!-- Lore -->
  <div class="w-11/12 flex flex-col md:flex-row mx-auto mt-2 h-auto lg:h-auto"> 

    <!-- Photo -->
    <div class="w-full mb-5 lg:mr-6 md:w-1/2">
      <div class="bg-blue-800 h-96 bg-no-repeat bg-cover bg-center lg:bg-cover" style="background-image: url('https://ik.imagekit.io/lgpq0vloy/Cosmic%20Collsions/Gemini_Generated_Image_3b4qfh3b4qfh3b4q%20(1).jpeg?updatedAt=1724392397795');">

      </div>
      <span class="text-gray-500">[Disclaimer] AI-Generated concept image</span>

    </div>

    <!-- Text and Link -->
    <div class="w-full md:w-1/2 p-4 lg:p-0">
      <h1 class="text-3xl jersey-font gold-header-text">Lore</h1>
      <p class="text-md lg:text-xl">In 2157, an alien force targets the Sun as a vital resource, intending to destroy each planet to eliminate resistance. Earth’s <b>Solar System Defense Force (SSDF)</b> discovers the enemy has destabilized the asteroid belt, threatening every planet. 
        The SSDF must protect the solar system and its colonies to ensure survival, as the Sun is essential to all life.
      </p>
    </div>
    

  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- KickStarer -->
  <!-- <div class="mx-auto p-8 rounded shadow-lg text-center bg-white/10 border-2 border-[#ffcb0a]/40 w-11/12 lg:w-1/3">
    <p class="text-xl text-white">Want to donate to our KickStarter Campaign?</p>
    <Button color="none" class="text-black text-lg mt-6 w-full lg:w-40" style="background: var(--gold-gradient);">Contribute</Button>
  </div> -->

  <div class="mx-auto p-2 rounded shadow-lg text-center border-2 border-[#dd0000]/60 bg-[#dd0000]/20 w-11/12 lg:w-1/3">
    <img class="h-32 mx-auto relative bottom-3" src="https://ik.imagekit.io/lgpq0vloy/logos/Kickstarter-Logo.png?updatedAt=1724604584415" alt="KickStarter">
    <p class="text-xl text-white relative bottom-8">Coming Soon - Summer 2025</p>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
   
  <!-- Form & Social Media -->
  <div class="sm:inline-block lg:flex w-1/3 mx-auto my-4 bg-[#88888800] justify-center text-center">
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
  <div class="text-center my-8">
      <Button on:click={discordLink} color="purple" class="w-48">
        <DiscordSolid class="mr-2"></DiscordSolid>
        Join our Discord
      </Button>
  </div>
  
  <div class="mx-auto px-4 w-11/12">
    <h1 class="jersey-font page-header green-header-text">CONTACT US</h1>
  <p class="text-xs lg:text-lg sm:w-1/2 lg:w-1/2">
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

    <!-- Toasts -->
    {#if successToast}
    <Toast 
      position={'top-right'}
      divClass={successToastClass} 
      contentClass={'w-full text-sm lg:text-lg font-normal'} 
      dismissable={true} 
      align={true}>
        <span><CheckCircleOutline size="xl" color="#00ff00"></CheckCircleOutline></span>
        <span>Your message has been submitted! We will get back to you soon! 🙏🏾</span>
    </Toast>
    {/if}
    {#if errorToast}
    <Toast 
      position={'top-right'}
      divClass={errorToastClass} 
      contentClass={'w-full text-sm lg:text-lg font-normal'} 
      dismissable={true} 
      align={true}>
        <span><CloseCircleOutline size="xl" color="#dd0000"></CloseCircleOutline></span>
        <span>{errorToastMessage}</span>
    </Toast>
    {/if}
  </div>

</main>
<style>

</style>
