<script lang="ts">
  import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
</script>

<svelte:head>
  <title>Newsletter | Final Boss Studios</title>
  <meta name="description" content="Subscribe to the Final Boss Studios newsletter for the latest updates on our projects." />
</svelte:head>

<main class="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-20 lg:py-32 overflow-hidden">

  <!-- Content -->
  <div class="relative z-10 w-full max-w-2xl">
    <!-- Header -->
    <div class="text-center mb-12 lg:mb-16">
      <div class="mb-6">
        <svg
          class="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4 text-[#00c400]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          ></path>
        </svg>
      </div>

      <h1 class="text-4xl lg:text-5xl font-bold gradient-text mb-4">
        Stay in the Loop
      </h1>

      <p class="text-lg lg:text-xl text-gray-400 max-w-xl mx-auto mb-2">
        Get the latest updates from Final Boss Studios
      </p>
    </div>

    <!-- Newsletter Signup Card -->
    <div class="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 lg:p-12 shadow-2xl">
      <div class="mb-8">
        <h2 class="text-xl lg:text-2xl font-semibold text-white mb-2">
          Subscribe to Our Newsletter
        </h2>
        <p class="text-gray-400 text-sm lg:text-base">
          No spam, no fluff—just game updates, dev insights, and occasional memes.
        </p>
      </div>

      <!-- Newsletter Signup Component -->
      <NewsletterSignup
        variant="stacked"
        placeholder="Enter your email"
        buttonText="Subscribe"
        showName={true}
      />

      <!-- Info boxes -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="p-4 bg-[#00c400]/5 border border-[#00c400]/20 rounded-lg">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-[#00c400] flex-shrink-0 mt-0.5"
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
            <div>
              <p class="font-semibold text-white text-sm">Game Updates</p>
              <p class="text-gray-400 text-xs mt-1">New features & releases</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-[#FFD700]/5 border border-[#FFD700]/20 rounded-lg">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-[#FFD700] flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z"
              ></path>
            </svg>
            <div>
              <p class="font-semibold text-white text-sm">Behind the Scenes</p>
              <p class="text-gray-400 text-xs mt-1">Dev diaries & insights</p>
            </div>
          </div>
        </div>

        <div class="p-4 bg-purple-500/5 border border-purple-500/20 rounded-lg">
          <div class="flex items-start gap-3">
            <svg
              class="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
              ></path>
            </svg>
            <div>
              <p class="font-semibold text-white text-sm">Exclusive Perks</p>
              <p class="text-gray-400 text-xs mt-1">Early access & rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom links -->
    <div class="mt-12 text-center">
      <p class="text-gray-500 text-sm mb-4">
        Have questions? Check out our <a href="/blog" class="text-[#00c400] hover:text-[#00ff00] transition-colors">blog</a> or
        <a href="/#contact" class="text-[#00c400] hover:text-[#00ff00] transition-colors">contact us</a>
      </p>
      <a
        href="/"
        class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
        </svg>
        Back to Home
      </a>
    </div>
  </div>
</main>

<style>
  :global(body) {
    background: black;
    color: white;
  }
</style>
