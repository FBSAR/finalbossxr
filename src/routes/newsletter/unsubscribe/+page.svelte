<script lang="ts">
  import { Button } from 'flowbite-svelte';
  import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';

  let email = '';
  let isSubmitting = false;
  let isUnsubscribed = false;

  async function handleUnsubscribe(event: SubmitEvent) {
    event.preventDefault();

    if (!email || isSubmitting) return;

    isSubmitting = true;

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (response.ok) {
        isUnsubscribed = true;
        showSuccessToast('Successfully unsubscribed from our newsletter');
        email = '';
      } else {
        const data = await response.json();
        showErrorToast(data.message || 'Failed to unsubscribe. Please try again.');
      }
    } catch (error) {
      console.error('Unsubscribe error:', error);
      showErrorToast('An error occurred. Please try again later.');
    } finally {
      isSubmitting = false;
    }
  }
</script>

<svelte:head>
  <title>Unsubscribe | Final Boss Studios</title>
  <meta name="description" content="Manage your newsletter preferences with Final Boss Studios." />
</svelte:head>

<main class="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">
  <!-- Background gradient -->
  <div class="absolute inset-0 pointer-events-none">
    <div class="absolute inset-0 bg-gradient-to-b from-black via-[#0a0a0a] to-black"></div>
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#FF6B6B]/10 rounded-full blur-3xl opacity-20"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 w-full max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-12 lg:mb-16">
      <div class="mb-6">
        <svg
          class="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      </div>

      <h1 class="text-4xl lg:text-5xl font-bold text-white mb-4">
        Manage Your Preferences
      </h1>

      <p class="text-lg lg:text-xl text-gray-400 max-w-xl mx-auto">
        We're sorry to see you go. You can unsubscribe from our newsletter below.
      </p>
    </div>

    <!-- Unsubscribe Card -->
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl">
      {#if !isUnsubscribed}
        <div>
          <h2 class="text-xl lg:text-2xl font-semibold text-white mb-4">
            Unsubscribe from Newsletter
          </h2>

          <p class="text-gray-400 text-sm lg:text-base mb-6">
            Enter your email address below to unsubscribe from Final Boss Studios newsletters. This will remove you from our mailing list immediately.
          </p>

          <form on:submit={handleUnsubscribe} class="space-y-4">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="your@email.com"
                bind:value={email}
                required
                class="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#00c400] focus:bg-white/15 transition-colors"
              />
            </div>

            <div class="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={!email || isSubmitting}
                class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
              </Button>
              <a
                href="/newsletter"
                class="flex-1 text-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors border border-white/20"
              >
                Stay Subscribed
              </a>
            </div>
          </form>

          <!-- Info section -->
          <div class="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <h3 class="text-sm font-semibold text-blue-300 mb-2">
              ℹ️ What happens next?
            </h3>
            <ul class="text-xs text-gray-400 space-y-1 list-disc list-inside">
              <li>You'll be immediately removed from our mailing list</li>
              <li>You won't receive any more newsletters or promotional emails</li>
              <li>Your data will be retained only as required by law</li>
              <li>You can always resubscribe at any time</li>
            </ul>
          </div>
        </div>
      {:else}
        <div class="text-center space-y-6">
          <div class="flex justify-center">
            <div class="w-16 h-16 lg:w-20 lg:h-20 bg-green-500/20 border border-green-500/40 rounded-full flex items-center justify-center">
              <svg
                class="w-8 h-8 lg:w-10 lg:h-10 text-green-400"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
          </div>

          <div>
            <h2 class="text-2xl lg:text-3xl font-bold text-white mb-3">
              Successfully Unsubscribed
            </h2>
            <p class="text-gray-400 text-base lg:text-lg">
              You've been removed from our newsletter mailing list. We hope to see you again soon!
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <a
              href="/"
              class="px-6 py-3 bg-[#00c400]/20 hover:bg-[#00c400]/30 text-[#00c400] border border-[#00c400]/50 font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </a>
            <a
              href="/newsletter"
              class="px-6 py-3 bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold rounded-lg transition-colors"
            >
              Resubscribe
            </a>
          </div>
        </div>
      {/if}
    </div>

    <!-- Footer links -->
    <div class="mt-12 text-center">
      <p class="text-gray-500 text-sm">
        Questions about your privacy? Check our <a href="/privacy" class="text-[#00c400] hover:text-[#00ff00] transition-colors">privacy policy</a>
      </p>
    </div>
  </div>
</main>

<style>
  :global(body) {
    background: black;
    color: white;
  }
</style>
