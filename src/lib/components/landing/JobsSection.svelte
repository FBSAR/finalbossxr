<script lang="ts">
  export let jobs: Array<{
    id: number;
    title: string;
    department: string;
    job_type: string;
    location: string;
    summary: string;
    published: boolean;
    created_at: string;
  }> = [];

  let isVisible = false;

  // Intersection Observer action: reveal section when scrolled into view
  function observeSection(node: HTMLElement) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isVisible = true;
          }
        });
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    observer.observe(node);
    return {
      destroy() {
        observer.disconnect();
      }
    };
  }
</script>

<section class="jobs-section" class:visible={isVisible} use:observeSection aria-label="Job Postings">
  <div class="jobs-background"></div>
  
  <!-- Floating Cosmic Shapes -->
  <div class="floating-shapes">
    <!-- 4-Point Star -->
    <svg class="shape shape-1" viewBox="0 0 100 100" fill="none">
      <path d="M50,5 L55,45 L95,50 L55,55 L50,95 L45,55 L5,50 L45,45 Z" stroke="rgba(0, 196, 0, 0.2)" stroke-width="1.5" fill="none"/>
    </svg>
    
    <!-- Planet with Ring -->
    <svg class="shape shape-2" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="25" stroke="rgba(147, 51, 234, 0.2)" stroke-width="2" fill="rgba(147, 51, 234, 0.03)"/>
      <ellipse cx="50" cy="50" rx="45" ry="12" stroke="rgba(147, 51, 234, 0.15)" stroke-width="1.5" fill="none" transform="rotate(-20 50 50)"/>
    </svg>
    
    <!-- Comet -->
    <svg class="shape shape-3" viewBox="0 0 100 100" fill="none">
      <circle cx="75" cy="30" r="8" stroke="rgba(0, 196, 0, 0.25)" stroke-width="2" fill="rgba(0, 196, 0, 0.05)"/>
      <path d="M70,35 Q40,50 10,80" stroke="rgba(0, 196, 0, 0.15)" stroke-width="2" stroke-linecap="round"/>
      <path d="M68,38 Q35,55 5,75" stroke="rgba(0, 196, 0, 0.08)" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
    
    <!-- Crescent Moon -->
    <svg class="shape shape-4" viewBox="0 0 100 100" fill="none">
      <path d="M60,15 A35,35 0 1,1 60,85 A28,28 0 1,0 60,15" stroke="rgba(147, 51, 234, 0.2)" stroke-width="2" fill="rgba(147, 51, 234, 0.03)"/>
    </svg>
    
    <!-- Twinkling Star (small) -->
    <svg class="shape shape-5" viewBox="0 0 100 100" fill="none">
      <path d="M50,20 L53,47 L80,50 L53,53 L50,80 L47,53 L20,50 L47,47 Z" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1" fill="none"/>
    </svg>
    
    <!-- Orbit Path -->
    <svg class="shape shape-6" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="40" ry="20" stroke="rgba(147, 51, 234, 0.12)" stroke-width="1" stroke-dasharray="6 4" fill="none"/>
      <circle cx="85" cy="58" r="4" fill="rgba(147, 51, 234, 0.2)"/>
    </svg>
    
    <!-- Galaxy Spiral -->
    <svg class="shape shape-7" viewBox="0 0 100 100" fill="none">
      <path d="M50,50 Q60,30 80,35 Q90,50 75,65 Q55,75 45,60 Q35,45 50,35 Q65,25 75,40" stroke="rgba(0, 196, 0, 0.12)" stroke-width="1.5" fill="none"/>
      <circle cx="50" cy="50" r="5" fill="rgba(0, 196, 0, 0.15)"/>
    </svg>
    
    <!-- Asteroid -->
    <svg class="shape shape-8" viewBox="0 0 100 100" fill="none">
      <path d="M30,50 Q25,30 45,25 Q70,20 80,40 Q85,60 70,75 Q50,85 35,70 Q20,60 30,50" stroke="rgba(0, 196, 0, 0.15)" stroke-width="2" fill="none"/>
      <circle cx="55" cy="40" r="3" fill="rgba(0, 196, 0, 0.1)"/>
      <circle cx="65" cy="55" r="2" fill="rgba(0, 196, 0, 0.08)"/>
    </svg>
    
    <!-- 6-Point Star -->
    <svg class="shape shape-9" viewBox="0 0 100 100" fill="none">
      <polygon points="50,10 58,40 88,40 64,58 72,88 50,70 28,88 36,58 12,40 42,40" stroke="rgba(147, 51, 234, 0.12)" stroke-width="1.5" fill="none"/>
    </svg>
    
    <!-- Nebula Cloud -->
    <svg class="shape shape-10" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="35" ry="25" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1" fill="rgba(147, 51, 234, 0.02)"/>
      <ellipse cx="40" cy="45" rx="20" ry="15" stroke="rgba(147, 51, 234, 0.08)" stroke-width="1" fill="none"/>
      <ellipse cx="60" cy="55" rx="18" ry="12" stroke="rgba(0, 196, 0, 0.08)" stroke-width="1" fill="none"/>
    </svg>
    
    <!-- PROMINENT: Large Planet with Rings -->
    <svg class="shape shape-11 shape-prominent" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="30" stroke="rgba(0, 196, 0, 0.4)" stroke-width="2" fill="rgba(0, 196, 0, 0.05)"/>
      <ellipse cx="50" cy="50" rx="48" ry="15" stroke="rgba(0, 196, 0, 0.25)" stroke-width="2" fill="none" transform="rotate(-25 50 50)"/>
      <ellipse cx="50" cy="50" rx="42" ry="10" stroke="rgba(0, 196, 0, 0.15)" stroke-width="1" fill="none" transform="rotate(-25 50 50)"/>
    </svg>
    
    <!-- PROMINENT: Supernova -->
    <svg class="shape shape-12 shape-prominent" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="15" stroke="rgba(147, 51, 234, 0.5)" stroke-width="2" fill="rgba(147, 51, 234, 0.1)"/>
      <circle cx="50" cy="50" r="25" stroke="rgba(147, 51, 234, 0.25)" stroke-width="1" fill="none"/>
      <circle cx="50" cy="50" r="35" stroke="rgba(147, 51, 234, 0.1)" stroke-width="1" fill="none"/>
      <path d="M50,10 L50,5 M50,90 L50,95 M10,50 L5,50 M90,50 L95,50 M22,22 L17,17 M78,78 L83,83 M78,22 L83,17 M22,78 L17,83" stroke="rgba(147, 51, 234, 0.3)" stroke-width="2" stroke-linecap="round"/>
    </svg>
    
    <!-- PROMINENT: Galaxy -->
    <svg class="shape shape-13 shape-prominent" viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="50" rx="40" ry="20" stroke="rgba(0, 196, 0, 0.3)" stroke-width="2" fill="rgba(0, 196, 0, 0.03)" transform="rotate(-30 50 50)"/>
      <ellipse cx="50" cy="50" rx="30" ry="12" stroke="rgba(0, 196, 0, 0.2)" stroke-width="1.5" fill="none" transform="rotate(-30 50 50)"/>
      <ellipse cx="50" cy="50" rx="18" ry="6" stroke="rgba(147, 51, 234, 0.25)" stroke-width="1" fill="none" transform="rotate(-30 50 50)"/>
      <circle cx="50" cy="50" r="6" fill="rgba(0, 196, 0, 0.2)"/>
    </svg>
  </div>

  <div class="jobs-container">
    <div class="jobs-header">
      <span class="section-label">Join Our Team</span>
      <h2 class="section-title gradient-text">Open Positions</h2>
      <p class="jobs-subtitle">
        We're looking for passionate individuals to help us build the future of immersive technology.
      </p>
    </div>

    {#if jobs.length > 0}
      <div class="jobs-grid">
        {#each jobs as job (job.id)}
          <article class="job-card">
            <div class="job-meta">
              <span class="job-department">{job.department}</span>
              <span class="job-type">{job.job_type}</span>
            </div>
            <h3 class="job-title">{job.title}</h3>
            <p class="job-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {job.location}
            </p>
            <p class="job-description">
              {job.summary}
            </p>
          </article>
        {/each}
      </div>

      <div class="jobs-cta">
        <a href="/jobs" class="view-all-jobs">
          View All Open Positions
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </a>
      </div>
    {:else}
      <div class="empty-state">
        <p>No open positions at this time. Check back soon!</p>
      </div>
    {/if}
  </div>
</section>

<style>
  .empty-state {
    text-align: center;
    color: #999;
    padding: 3rem 2rem;
    font-size: 1.125rem;
  }

  /* Jobs Section - Performance Optimized */
  .jobs-section {
    position: relative;
    padding: 6rem 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    contain: layout paint;
    isolation: isolate;
    /* Initially hidden for scroll-into-view reveal */
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .jobs-section.visible {
    opacity: 1;
    transform: translateY(0);
    transition-delay: 0.2s;
  }

  @media (max-width: 768px) {
    .jobs-section {
      padding: 4rem 1rem;
    }
  }

  .jobs-background {
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 60% 50%, rgba(0, 196, 0, 0.06) 0%, transparent 65%),
                radial-gradient(ellipse at 20% 80%, rgba(147, 51, 234, 0.05) 0%, transparent 70%);
    pointer-events: none;
  }

  /* Floating Shapes - GPU Optimized */
  .floating-shapes {
    position: absolute;
    inset: 0;
    overflow: hidden;
    pointer-events: none;
    contain: strict;
    z-index: 0;
  }

  .shape {
    position: absolute;
    opacity: 0.5;
    will-change: transform;
    backface-visibility: hidden;
    transform: translateZ(0);
  }

  .shape-1 {
    width: 70px;
    height: 70px;
    top: 15%;
    left: 8%;
    animation: float-1 20s ease-in-out infinite, spin-slow 30s linear infinite;
  }

  .shape-2 {
    width: 100px;
    height: 100px;
    top: 12%;
    right: 10%;
    animation: float-2 25s ease-in-out infinite;
  }

  .shape-3 {
    width: 50px;
    height: 50px;
    bottom: 25%;
    left: 12%;
    animation: float-3 18s ease-in-out infinite, spin-slow 25s linear infinite reverse;
  }

  .shape-4 {
    width: 80px;
    height: 80px;
    bottom: 15%;
    right: 8%;
    animation: float-1 22s ease-in-out infinite reverse;
  }

  .shape-5 {
    width: 35px;
    height: 35px;
    top: 50%;
    left: 5%;
    animation: float-2 15s ease-in-out infinite;
  }

  .shape-6 {
    width: 45px;
    height: 45px;
    top: 65%;
    right: 15%;
    animation: float-3 20s ease-in-out infinite, spin-slow 40s linear infinite;
  }

  .shape-7 {
    width: 60px;
    height: 60px;
    bottom: 40%;
    right: 22%;
    animation: float-1 17s ease-in-out infinite;
  }

  .shape-8 {
    width: 48px;
    height: 48px;
    top: 30%;
    left: 18%;
    animation: float-2 19s ease-in-out infinite, spin-slow 35s linear infinite;
  }

  .shape-9 {
    width: 40px;
    height: 40px;
    top: 10%;
    right: 28%;
    animation: float-3 16s ease-in-out infinite;
  }

  .shape-10 {
    width: 55px;
    height: 55px;
    top: 55%;
    right: 5%;
    animation: float-2 21s ease-in-out infinite;
  }

  /* PROMINENT: Large Planet with Rings */
  .shape-11 {
    width: 120px;
    height: 120px;
    top: 8%;
    left: 3%;
    animation: float-2 28s ease-in-out infinite, spin-slow 60s linear infinite;
  }

  /* PROMINENT: Supernova */
  .shape-12 {
    width: 110px;
    height: 110px;
    bottom: 12%;
    right: 5%;
    animation: float-1 26s ease-in-out infinite reverse;
  }

  /* PROMINENT: Galaxy */
  .shape-13 {
    width: 115px;
    height: 115px;
    top: 25%;
    right: 2%;
    animation: float-3 30s ease-in-out infinite, spin-slow 70s linear infinite reverse;
  }

  /* Prominent shape glow effect */
  .shape-prominent {
    filter: drop-shadow(0 0 15px currentColor);
  }

  @keyframes float-1 {
    0%, 100% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(15px, -20px);
    }
    50% {
      transform: translate(-10px, -35px);
    }
    75% {
      transform: translate(20px, -15px);
    }
  }

  @keyframes float-2 {
    0%, 100% {
      transform: translate(0, 0);
    }
    33% {
      transform: translate(-20px, 25px);
    }
    66% {
      transform: translate(15px, -20px);
    }
  }

  @keyframes float-3 {
    0%, 100% {
      transform: translate(0, 0);
    }
    20% {
      transform: translate(25px, 10px);
    }
    40% {
      transform: translate(-15px, 30px);
    }
    60% {
      transform: translate(10px, -25px);
    }
    80% {
      transform: translate(-20px, 5px);
    }
  }

  @keyframes spin-slow {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .shape {
      opacity: 0.3;
    }
    .shape-1, .shape-3, .shape-5, .shape-8, .shape-9 {
      display: none;
    }
    .shape-2 {
      width: 70px;
      height: 70px;
    }
    .shape-4 {
      width: 55px;
      height: 55px;
    }
    .shape-6, .shape-7, .shape-10 {
      opacity: 0.2;
    }
    /* Keep prominent shapes visible but smaller on mobile */
    .shape-prominent {
      opacity: 0.4;
    }
    .shape-11 {
      width: 70px;
      height: 70px;
      top: 5%;
      left: 3%;
    }
    .shape-12 {
      width: 65px;
      height: 65px;
      bottom: 10%;
      right: 3%;
    }
    .shape-13 {
      width: 70px;
      height: 70px;
      top: 20%;
      right: 2%;
    }
  }

  .jobs-container {
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }

  .jobs-header {
    text-align: center;
    margin-bottom: 3rem;
  }

  .section-label {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: rgba(0, 196, 0, 0.1);
    border: 1px solid rgba(0, 196, 0, 0.2);
    border-radius: 9999px;
    color: #00c400;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 1rem;
  }

  .section-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .jobs-subtitle {
    font-size: 1.125rem;
    color: rgba(255, 255, 255, 0.6);
    max-width: 600px;
    margin: 0 auto;
  }

  .jobs-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
    justify-content: center;
    margin: 0 auto 3rem;
    max-width: 1000px;
  }

  .jobs-grid .job-card {
    flex: 0 1 450px;
  }

  .job-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1rem;
    padding: 2rem;
    transition: all 0.3s ease;
    width: 100%;
  }

  .job-card:hover {
    border-color: rgba(0, 196, 0, 0.3);
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  }

  .job-meta {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .job-department,
  .job-type {
    padding: 0.25rem 0.75rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .job-department {
    background: rgba(0, 196, 0, 0.1);
    color: #00c400;
    border: 1px solid rgba(0, 196, 0, 0.2);
  }

  .job-type {
    background: rgba(138, 43, 226, 0.1);
    color: #8a2be2;
    border: 1px solid rgba(138, 43, 226, 0.2);
  }

  .job-title {
    font-family: "Raleway", sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: white;
    margin-bottom: 0.5rem;
  }

  .job-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 1rem;
  }

  .job-description {
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.6);
    line-height: 1.6;
  }

  .jobs-cta {
    text-align: center;
  }

  .view-all-jobs {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 2rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    border-radius: 0.75rem;
    text-decoration: none;
    transition: all 0.3s ease;
  }

  .view-all-jobs:hover {
    border-color: rgba(0, 196, 0, 0.5);
    color: #00c400;
    background: rgba(0, 196, 0, 0.05);
  }

</style>
