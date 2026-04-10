<script lang="ts">
  export let jobs: Array<{
    id: number;
    title: string;
    department: string;
    job_type: string;
    location: string;
    description: string;
    published: boolean;
    created_at: string;
  }> = [];
</script>

<section class="jobs-section" aria-label="Job Postings">
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
              {job.description}
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

  /* Jobs Section */
  .jobs-section {
    padding: 6rem 2rem;
  }

  @media (max-width: 768px) {
    .jobs-section {
      padding: 4rem 1rem;
    }
  }

  .jobs-container {
    max-width: 1000px;
    margin: 0 auto;
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
