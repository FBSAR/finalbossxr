<script lang="ts">
  import SocialMedia from '$lib/components/SocialMedia.svelte';
  import ContactForm from '$lib/components/ContactForm.svelte';
</script>
<main>
  <ContactForm />

  <!-- Spacer -->
  <div class="h-8"></div>

  <SocialMedia />
</main>
<style>
  .contact-card, .contact-header-card {
    transition: 200ms;
  }
  @media (min-width: 1000px) { 
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
