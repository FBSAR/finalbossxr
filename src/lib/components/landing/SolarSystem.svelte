<script lang="ts">
  // Solar System section - 100vh tall immersive visualization
</script>

<section class="solar-system-section" aria-label="Solar System">
  <div class="solar-system-container">
    <!-- Placeholder content for Solar System visualization -->
    <div class="solar-system-content">
      <p>Solar System</p>
    </div>
  </div>
</section>

<style>
  .solar-system-section {
    position: relative;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at center, rgba(10, 10, 30, 1) 0%, rgba(0, 0, 0, 1) 100%);
    overflow: hidden;
  }

  .solar-system-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .solar-system-content {
    text-align: center;
    color: rgba(255, 255, 255, 0.8);
    font-size: 2rem;
  }
</style>
