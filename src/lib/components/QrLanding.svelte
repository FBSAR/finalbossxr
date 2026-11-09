<script lang="ts">
  export let isLoading = false;
</script>
<main>
  <div class="mx-auto w-11/12">
    {#if isLoading}
      <!-- Skeleton Loading State -->
      <div class="skeleton-text skeleton-title"></div>
      <div class="skeleton-text skeleton-description"></div>
      <div class="skeleton-text skeleton-description-2"></div>

      <div class="w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2 rounded-lg">
        <div class="skeleton-qr"></div>
      </div>
    {:else}
      <h1 class="text-7xl jersey-font sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 text-center gradient-text">QR</h1>

      <!-- Centered Section -->
      <div class="w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2 rounded-lg">
        <a
          href="/newsletter"
          class="group mx-auto block w-full max-w-xs rounded-xl bg-white p-3 transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,196,0,0.45)]"
          aria-label="Open the Final Boss Studios newsletter"
          title="Scan or click to open the newsletter"
        >
          <img
            src="/qr-newsletter.svg"
            alt="QR code that links to the Final Boss Studios newsletter"
            class="h-auto w-full transition-transform duration-300 group-hover:scale-105"
            width="1024"
            height="1024"
            loading="lazy"
          />
        </a>
        <p class="mt-6 text-center text-white/70">Scan to subscribe to our newsletter</p>
        <p class="mt-1 text-center">
          <a
            href="/newsletter"
            class="text-[#00c400] text-sm transition-colors hover:text-[#00FF00]"
          >
            finalbossxr.com/newsletter
          </a>
        </p>
      </div>
    {/if}
  </div>
</main>
<style>
  /* Skeleton Loading UI */
  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }

  .skeleton-text {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.25rem;
    margin-left: auto;
    margin-right: auto;
  }

  .skeleton-title {
    width: 280px;
    max-width: 100%;
    height: 4.5rem;
    margin: 1rem auto;
  }

  .skeleton-description {
    width: 100%;
    max-width: 500px;
    height: 1.5rem;
    margin: 0.5rem auto;
  }

  .skeleton-description-2 {
    width: 100%;
    max-width: 420px;
    height: 1.5rem;
    margin: 0.5rem auto 1rem;
  }

  .skeleton-qr {
    width: 100%;
    max-width: 320px;
    aspect-ratio: 1 / 1;
    margin: 0 auto;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.75rem;
  }

  @media (max-width: 640px) {
    .skeleton-title {
      width: 200px;
      height: 3.5rem;
    }
  }
</style>
