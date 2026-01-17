<script lang="ts">
  import { LinkedinSolid } from 'flowbite-svelte-icons'
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { navigating } from '$app/stores';

  // Loading state for navigation
  $: isLoading = $navigating !== null;
  
  let founders = [
      {
        name: 'Eddie Taliaferro II',
        photo: 'https://finalbossxr.s3.us-east-1.amazonaws.com/team-photos/eddie-pro-pic-11-25.png',
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
      }
  ]
</script>
<main>

  <!-- Header -->
  <div class="mx-auto w-11/12">
    <h1 class="jersey-font page-header green-header-text glow-text">ABOUT US</h1>
    <p class="sm:w-1/2 lg:w-1/2">Introducing the Final Boss team.</p>
  </div>

  {#if isLoading}
    <!-- Skeleton Loading State -->
    <!-- Founders Skeleton -->
    <div class="mx-auto my-4 w-11/12">
      <div class="skeleton-text skeleton-section-title"></div>
      <div class="flex flex-wrap justify-start gap-2">
        {#each Array(2) as _}
          <div class="skeleton-card w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2">
            <div class="skeleton-photo"></div>
            <div class="skeleton-text skeleton-name"></div>
            <div class="skeleton-text skeleton-title"></div>
            <div class="skeleton-icon"></div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Team Skeleton -->
    <div class="mx-auto my-4 w-11/12">
      <div class="skeleton-text skeleton-section-title"></div>
      <div class="flex flex-wrap justify-start gap-2">
        {#each Array(2) as _}
          <div class="skeleton-card w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2">
            <div class="skeleton-photo"></div>
            <div class="skeleton-text skeleton-name"></div>
            <div class="skeleton-text skeleton-title"></div>
            <div class="skeleton-icon"></div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Advisors Skeleton -->
    <div class="mx-auto my-4 w-11/12">
      <div class="skeleton-text skeleton-section-title"></div>
      <div class="flex flex-wrap justify-start gap-2">
        {#each Array(2) as _}
          <div class="skeleton-card w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2">
            <div class="skeleton-photo"></div>
            <div class="skeleton-text skeleton-name"></div>
            <div class="skeleton-text skeleton-title"></div>
            <div class="skeleton-icon"></div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
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
  {/if}

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <ContactForm />

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

</main>
<style>
  .glow-text {
    text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
  }

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

  /* Skeleton Loading UI */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .skeleton-card {
    pointer-events: none;
  }

  .skeleton-text {
    display: block;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.25rem;
  }

  .skeleton-section-title {
    width: 120px;
    height: 2.25rem;
    margin-bottom: 0.5rem;
    margin-top: 2rem;
  }

  .skeleton-photo {
    width: 5rem;
    height: 5rem;
    border-radius: 0.25rem;
    margin-bottom: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
  }

  .skeleton-name {
    width: 70%;
    height: 1.5rem;
    margin-bottom: 0.5rem;
  }

  .skeleton-title {
    width: 90%;
    height: 0.875rem;
    margin-bottom: 0.75rem;
  }

  .skeleton-icon {
    width: 1.5rem;
    height: 1.5rem;
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
</style>
