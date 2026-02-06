<script lang="ts">
  // HIDDEN: Contact form temporarily disabled
  // import ContactForm from '$lib/components/ContactForm.svelte';
  import { navigating } from '$app/stores';

  // Loading state for navigation
  $: isLoading = $navigating !== null;
</script>
<main>
  <!-- HIDDEN: Contact form temporarily disabled -->
  <!-- <ContactForm {isLoading} /> -->
</main>
<style>
</style>
