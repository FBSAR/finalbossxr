<script lang="ts">
  import { Badge, Button, FloatingLabelInput, Textarea } from 'flowbite-svelte';
  import { LinkedinSolid, DiscordSolid, FacebookSolid, XSolid } from 'flowbite-svelte-icons'
  import { enhance } from '$app/forms';
  import { showSuccessToast ,showErrorToast } from '$lib/stores/toastStore';
  import SocialMedia from '$lib/components/SocialMedia.svelte';

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
  let founders = [
      {
        name: 'Eddie Taliaferro II',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/eddie-pic.jpeg',
        title: 'CEO / Co-Founder / Software Developer',
        linkedin: 'https://www.linkedin.com/in/eddie-taliaferro-ii',
      },
      {
        name: 'Keith Dunklin',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/keith-pic.jpg',
        title: 'COO / Co-Founder / Game Developer',
        linkedin: 'https://www.linkedin.com/in/keith-dunklin-9a838543/',
      }
  ]
  let advisors = [
      {
        name: 'Edward Kim',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/ed-pic-2.jpeg',
        title: 'Business Advisor',
        linkedin: "https://www.linkedin.com/in/edwardkim1/",
      },
      {
        name: 'John Wolff',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/john-pic-2.jpeg',
        title: 'Game Advisor',
        linkedin: "https://www.linkedin.com/in/johnwolff89/"
      },
      {
        name: 'Terrell Thomas',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/terrel_pic.png',
        title: 'Legal Advisor',
        linkedin: 'https://www.linkedin.com/in/terrell-thomas-927a0123/'
      }
  ]
  let team = [
      {
        name: 'Aaron Goodson',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/fbs-aaron.png',
        title: 'Senior Software Developer',
        linkedin: 'https://www.linkedin.com/in/aaron-goodson-a14187153/'
      },
      {
        name: 'Richard Davis III',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/fbs-richard.png',
        title: 'Sound Design / 3D Modeling & Printing',
        linkedin: 'https://www.linkedin.com/in/richard-davis-iii-300703240/'
      },
      {
        name: 'Rowan Christerfield',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/rowan_photo.png',
        title: 'Social Media',
        linkedin: 'https://www.linkedin.com/in/rowanchristerfield/'
      }
  ]
</script>
<main>

  <!-- Header -->
  <div class="mx-auto w-11/12">
    <h1 class="jersey-font page-header green-header-text">ABOUT US</h1>
    <p class="sm:w-1/2 lg:w-1/2">Introducing the Final Boss team.</p>
  </div>

  <!-- Founders -->
  <div class="fouders mx-auto my-4 w-11/12">
    <h1 class="gold-header-text mb-2 mt-8 text-4xl">Founders</h1>
    <div class="flex flex-wrap justify-start gap-2">
      {#each founders as founder}
        <div class="founder-card w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={founder.photo} 
            class="h-20 rounded mb-2" 
            alt="Flowbite Logo" 
          />
          <h1 class="text-2xl green-header-text">{founder.name}</h1>
          <p class="text-sm font-bold  pb-1 mb-2">{founder.title}</p>
          <a href="{founder.linkedin}" target="_blank"><LinkedinSolid color="#DAA520"></LinkedinSolid></a>
        </div>
      {/each}
    </div>
   </div>

  <!-- Team -->
  <div class=" mx-auto my-4 w-11/12">
    <h1 class="gold-header-text mb-2 mt-8 text-4xl">Team</h1>
    <div class="flex flex-wrap justify-start gap-2">
      {#each team as member}
        <div class="team-card w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={member.photo} 
            class="h-20 rounded mb-2" 
            alt="Flowbite Logo" 
          />
          <h1 class="text-2xl green-header-text">{member.name}</h1>
          <p class="text-sm font-bold pb-1 mb-2">{member.title}</p>
          <a href="{member.linkedin}" target="_blank"><LinkedinSolid color="#DAA520"></LinkedinSolid></a>        </div>
      {/each}
    </div>
  </div>

  <!-- Advisors -->
  <div class="mx-auto my-4 w-11/12">
    <h1  class="gold-header-text mb-2 mt-8 text-4xl">Advisors</h1>
    <div class="flex flex-wrap justify-start gap-2">
      {#each advisors as advisor}
        <div class="advisor-card w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={advisor.photo} 
            class="h-20 rounded mb-2" 
            alt="Flowbite Logo" 
          />
          <h1 class="text-2xl green-header-text">{advisor.name}</h1>
          <p class="text-sm font-bold pb-1 mb-2">{advisor.title}</p>
          <a href="{advisor.linkedin}" target="_blank"><LinkedinSolid color="#DAA520"></LinkedinSolid></a>        </div>
      {/each}
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-2 my-20 lg:my-32 border-b-8 border-[#00c40030]"></div>
   
  <SocialMedia />
  
  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Contact Form -->
  <div class="mx-auto w-11/12">
    <h1 class="text-7xl jersey-font sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 green-header-text">CONTACT US</h1>
    <p class="contact-header-card text-lg lg:text-lg sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2">
    Have a question? Have a comment? Want to work with, or invest in Final Boss?
    Please reach out, and we will contact you are our earliest convenience!
    </p>

    <!-- Form -->
    <div class="contact-card w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2">
      <Badge color="yellow" class="mb-4">Please fill out entire form</Badge>
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

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

</main>
<style>
  .contact-card, .contact-header-card  {
    transition: 200ms;
  }
  @media (min-width: 1000px) {
    .founder-card:hover, .team-card:hover, .advisor-card:hover {
      transition: 200ms;
      background: linear-gradient(135deg, #5f9f571a, #FFD7001a);
      transform: translateY(-10px);
      border-color: #0fd8414d;
    }
    .contact-header-card:hover {
      font-size: 1.35em;
    }
    .contact-card:hover, .contact-header-card:hover{
      transition: 200ms;
      background: linear-gradient(135deg, #5f9f571a, #FFD7001a);
      transform: translateY(-10px);
      border-color: #0fd8414d;
    }
  }
</style>
