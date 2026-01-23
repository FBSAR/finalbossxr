<script lang="ts">
  import { LinkedinSolid } from 'flowbite-svelte-icons'
  import ContactForm from '$lib/components/ContactForm.svelte';
  import KickstarterPromo from '$lib/components/landing/KickstarterPromo.svelte';
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
    <h1 class="text-7xl jersey-font gradient-text">ABOUT US</h1>
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
    <div class="section-container mx-auto my-4 w-11/12">
      <h2 class="section-title gold-header-text">Founders</h2>
      <div class="cards-grid">
        {#each founders as founder}
          <div class="team-card">
            <div class="card-image-container">
              <img 
                src={founder.photo} 
                class="card-image" 
                alt="{founder.name}" 
              />
            </div>
            <div class="card-content">
              <h3 class="card-name green-header-text">{founder.name}</h3>
              <p class="card-title">{founder.title}</p>
              <a href="{founder.linkedin}" target="_blank" class="linkedin-link">
                <LinkedinSolid size="xl" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Team -->
    <div class="section-container mx-auto my-4 w-11/12">
      <h2 class="section-title gold-header-text">Team</h2>
      <div class="cards-grid">
        {#each team as member}
          <div class="team-card">
            <div class="card-image-container">
              <img 
                src={member.photo} 
                class="card-image" 
                alt="{member.name}" 
              />
            </div>
            <div class="card-content">
              <h3 class="card-name green-header-text">{member.name}</h3>
              <p class="card-title">{member.title}</p>
              <a href="{member.linkedin}" target="_blank" class="linkedin-link">
                <LinkedinSolid size="xl" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>

    <!-- Advisors -->
    <div class="section-container mx-auto my-4 w-11/12">
      <h2 class="section-title gold-header-text">Advisors</h2>
      <div class="cards-grid">
        {#each advisors as advisor}
          <div class="team-card">
            <div class="card-image-container">
              <img 
                src={advisor.photo} 
                class="card-image" 
                alt="{advisor.name}" 
              />
            </div>
            <div class="card-content">
              <h3 class="card-name green-header-text">{advisor.name}</h3>
              <p class="card-title">{advisor.title}</p>
              <a href="{advisor.linkedin}" target="_blank" class="linkedin-link">
                <LinkedinSolid size="xl" />
              </a>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <ContactForm />

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Kickstarter Promo -->
  <KickstarterPromo />

</main>
<style>

  /* Section Styling */
  .section-container {
    margin-top: 2rem;
  }

  .section-title {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 1.25rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid rgba(218, 165, 32, 0.3);
    display: inline-block;
  }

  /* Cards Grid */
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
  }

  /* Team Card */
  .team-card {
    background: linear-gradient(145deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 1rem;
    overflow: hidden;
    transition: all 0.3s ease;
  }

  .team-card:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 196, 0, 0.4);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3), 0 0 20px rgba(0, 196, 0, 0.1);
  }

  .card-image-container {
    width: 100%;
    height: 260px;
    overflow: hidden;
    background: linear-gradient(135deg, rgba(0, 100, 0, 0.2), rgba(0, 50, 0, 0.3));
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 20%;
    transition: transform 0.3s ease;
  }

  .team-card:hover .card-image {
    transform: scale(1.05);
  }

  .card-content {
    padding: 1.25rem;
  }

  .card-name {
    font-size: 1.35rem;
    font-weight: 700;
    margin-bottom: 0.375rem;
  }

  .card-title {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.7);
    margin-bottom: 1rem;
    line-height: 1.4;
  }

  .linkedin-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: #DAA520;
    transition: all 0.2s ease;
  }

  .linkedin-link:hover {
    color: #FFD700;
    transform: scale(1.15);
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

  /* Mobile Responsive */
  @media (max-width: 640px) {
    .section-title {
      font-size: 1.5rem;
    }

    .cards-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .card-image-container {
      height: 220px;
    }

    .card-name {
      font-size: 1.2rem;
    }
  }
</style>
