<script lang="ts">
  import ContactForm from '$lib/components/ContactForm.svelte';
  import { navigating } from '$app/stores';

  // Loading state for navigation
  $: isLoading = $navigating !== null;
</script>
<main>
  <ContactForm {isLoading} />
</main>
<style>
</style>
