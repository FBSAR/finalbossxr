<script lang="ts">
  import { LinkedinSolid } from 'flowbite-svelte-icons'
  let founders = [
      {
        name: 'Eddie Taliaferro II',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/eddie.jpg?updatedAt=1724278131402',
        title: 'CEO / Co-Founder / Software Developer',
        linkedin: 'https://www.linkedin.com/in/eddie-taliaferro-ii',
      },
      {
        name: 'Keith Dunklin',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/fbs-keith.jpg?updatedAt=1724277860597',
        title: 'COO / Co-Founder / Game Developer',
        linkedin: 'https://www.linkedin.com/in/keith-dunklin-9a838543/',
      }
  ]
  let advisors = [
      {
        name: 'Edward Kim',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/ed_kim.jpeg?updatedAt=1724277860376',
        title: 'Business Advisor',
        linkedin: "https://www.linkedin.com/in/edwardkim1/",
      },
      {
        name: 'John Wolff',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/john.jpg?updatedAt=1740244288777',
        title: 'Game Advisor',
        linkedin: "https://www.linkedin.com/in/johnwolff89/"
      },
      {
        name: 'Terrell Thomas',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/terrel_pic.png?updatedAt=1724277860626',
        title: 'Legal Advisor',
        linkedin: 'https://www.linkedin.com/in/terrell-thomas-927a0123/'
      }
  ]
  let team = [
      {
        name: 'Aaron Goodson',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/fbs-aaron.png?updatedAt=1724277860357',
        title: 'Senior Software Developer',
        linkedin: 'https://www.linkedin.com/in/aaron-goodson-a14187153/'
      },
      {
        name: 'Richard Davis III',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/fbs-richard.png?updatedAt=1724277860494',
        title: 'Sound Design / 3D Modeling & Printing',
        linkedin: 'https://www.linkedin.com/in/richard-davis-iii-300703240/'
      },
      {
        name: 'Rowan Christerfield',
        photo: 'https://ik.imagekit.io/lgpq0vloy/Profile%20Pictures/rowan.png?updatedAt=1724278119089',
        title: 'Social Media',
        linkedin: 'https://www.linkedin.com/in/rowanchristerfield/'
      }
  ]
</script>
<main>

  <!-- Header -->
  <div class="mx-auto container">
    <h1 class="jersey-font page-header green-header-text">ABOUT US</h1>
    <p class="sm:w-1/2 lg:w-1/2">Introducing the Final Boss team.</p>
  </div>

  <!-- Founders -->
  <div class="mx-auto my-4 container">
    <h1 class="text-white mb-2 mt-8 jersey-font text-4xl">Founders</h1>
    <div class="flex flex-wrap justify-start gap-2">
      {#each founders as founder}
        <div class="w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={founder.photo} 
            class="h-20 rounded mb-2" 
            alt="Flowbite Logo" 
          />
          <h1 class="text-2xl gold-header-text">{founder.name}</h1>
          <p class="text-sm font-bold  pb-1 mb-2">{founder.title}</p>
          <a href="{founder.linkedin}" target="_blank"><LinkedinSolid color="#00c400"></LinkedinSolid></a>
        </div>
      {/each}
    </div>
   </div>

  <!-- Team -->
  <div class="mx-auto my-4 container">
    <h1 class="text-white mb-2 mt-16 jersey-font text-4xl">Team</h1>
    <div class="flex flex-wrap justify-start gap-2">
      {#each team as member}
        <div class="w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={member.photo} 
            class="h-20 rounded mb-2" 
            alt="Flowbite Logo" 
          />
          <h1 class="text-2xl gold-header-text">{member.name}</h1>
          <p class="text-sm font-bold pb-1 mb-2">{member.title}</p>
          <a href="{member.linkedin}" target="_blank"><LinkedinSolid color="#00c400"></LinkedinSolid></a>        </div>
      {/each}
    </div>
  </div>

  <!-- Advisors -->
  <div class="mx-auto my-4 container">
    <h1  class="text-white mb-2 mt-16 jersey-font text-4xl">Advisors</h1>
    <div class="flex flex-wrap justify-start gap-2">
      {#each advisors as advisor}
        <div class="w-full rounded sm:w-1/2 lg:w-1/4 p-4 backdrop-blur-lg bg-white/10 border-white/20 border-2 text-white">
          <img 
            src={advisor.photo} 
            class="h-20 rounded mb-2" 
            alt="Flowbite Logo" 
          />
          <h1 class="text-2xl gold-header-text">{advisor.name}</h1>
          <p class="text-sm font-bold pb-1 mb-2">{advisor.title}</p>
          <a href="{advisor.linkedin}" target="_blank"><LinkedinSolid color="#00c400"></LinkedinSolid></a>        </div>
      {/each}
    </div>
  </div>

</main>
<style>

</style>
