<script lang="ts">
  import QrLanding from '$lib/components/QrLanding.svelte';
  import { navigating } from '$app/stores';

  // Loading state for navigation
  $: isLoading = $navigating !== null;
</script>
<main>
  <QrLanding {isLoading} />
</main>
<style>
</style>
