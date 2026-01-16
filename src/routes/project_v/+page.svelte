<script lang="ts">
</script>

<main>
  <div class="coming-soon-container">
    <div class="coming-soon-content">
      <h1 class="coming-soon-title">#PROJECT_V</h1>
      <div class="coming-soon-divider"></div>
      <p class="coming-soon-message">Coming Soon</p>
      <p class="coming-soon-subtitle">Our most ambitious project yet.</p>
    </div>
  </div>
</main>

<style>
  .coming-soon-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: calc(100vh - 10rem);
    padding: 2rem;
  }

  .coming-soon-content {
    text-align: center;
    max-width: 600px;
  }

  .coming-soon-title {
    font-family: "Jersey 10", sans-serif;
    font-size: 5rem;
    color: #00ff00;
    text-shadow: 0 0 30px rgba(0, 255, 0, 0.5);
    margin-bottom: 1rem;
    letter-spacing: 0.5rem;
  }

  .coming-soon-divider {
    width: 100px;
    height: 4px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    margin: 2rem auto;
  }

  .coming-soon-message {
    font-family: "Raleway", sans-serif;
    font-size: 2rem;
    font-weight: 300;
    color: #fff;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.3rem;
  }

  .coming-soon-subtitle {
    font-family: "Raleway", sans-serif;
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.6);
    font-style: italic;
  }

  @media (max-width: 640px) {
    .coming-soon-title {
      font-size: 3rem;
      letter-spacing: 0.25rem;
    }

    .coming-soon-message {
      font-size: 1.5rem;
    }

    .coming-soon-subtitle {
      font-size: 1rem;
    }
  }
</style>
