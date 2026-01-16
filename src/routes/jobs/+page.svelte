<script lang="ts">
  import { Badge, FloatingLabelInput, Textarea, Fileupload } from 'flowbite-svelte';
  import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { enhance } from '$app/forms';

  // Slider State
  let currentSlide = 0;
  let sliderContainer: HTMLDivElement;

  // Job Listings
  const jobs = [
    {
      id: 1,
      title: 'Game Developer',
      department: 'Engineering',
      icon: '🎮',
      location: 'Remote',
      type: 'Part-time',
      description: 'Join our team to build immersive XR gaming experiences using Unreal Engine. You\'ll work on cutting-edge VR/AR projects and help shape the future of interactive entertainment.',
      requirements: [
        'Proficiency in Unreal Engine 5 and C++',
        'Experience with VR/AR development',
        'Strong understanding of game mechanics and physics',
        'Portfolio of shipped games or prototypes'
      ]
    },
    {
      id: 2,
      title: 'Graphic Designer & Illustrator',
      department: 'Design',
      icon: '🎨',
      location: 'Remote',
      type: 'Project-based',
      description: 'Design intuitive and visually stunning interfaces for our XR applications. Create experiences that push the boundaries of spatial computing and immersive design.',
      requirements: [
        'Strong portfolio showcasing UI/UX work',
        'Experience with Figma or similar tools',
        'Understanding of XR design principles',
        'Eye for modern, accessible design'
      ]
    }
  ];

  // Selected Job
  let selectedJob: typeof jobs[0] | null = null;

  // Application Form Data
  let applicationData = {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    experience: '',
    whyJoin: '',
    resume: null as File | null
  };
  
  // File list for binding to Fileupload component
  let resumeFiles: FileList | undefined;
  
  // Reactive statement to sync resumeFiles with applicationData.resume
  $: if (resumeFiles && resumeFiles.length > 0) {
    applicationData.resume = resumeFiles[0];
  }

  // Input styling
  const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';

  // Select a job and move to application slide
  function selectJob(job: typeof jobs[0]) {
    selectedJob = job;
    goToSlide(1);
  }

  // Navigate to a specific slide
  function goToSlide(index: number) {
    currentSlide = index;
  }

  // Go back to job listings
  function goBack() {
    goToSlide(0);
  }

  // Format phone number as (xxx) xxx - xxxx
  function formatPhoneNumber(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove all non-digits
    
    if (value.length > 10) {
      value = value.slice(0, 10); // Limit to 10 digits
    }
    
    // Format the number
    if (value.length >= 6) {
      applicationData.phone = `(${value.slice(0, 3)}) ${value.slice(3, 6)} - ${value.slice(6)}`;
    } else if (value.length >= 3) {
      applicationData.phone = `(${value.slice(0, 3)}) ${value.slice(3)}`;
    } else if (value.length > 0) {
      applicationData.phone = `(${value}`;
    } else {
      applicationData.phone = '';
    }
  }

  // Handle form submission
  let isSubmitting = false;
  
  function handleFormSubmit() {
    return async ({ result, update }: { result: any; update: () => Promise<void> }) => {
      isSubmitting = false;
      
      if (result.type === 'success' && result.data?.success) {
        console.log('Application submitted:', result.data);
        showSuccessToast();
        
        // Reset form
        applicationData = {
          name: '',
          email: '',
          phone: '',
          linkedin: '',
          portfolio: '',
          experience: '',
          whyJoin: '',
          resume: null
        };
        resumeFiles = undefined;
        selectedJob = null;
        goToSlide(0);
      } else if (result.type === 'failure') {
        showErrorToast(result.data?.message || 'There was an error submitting your application.');
      } else {
        showErrorToast('There was an error submitting your application. Please try again later.');
      }
    };
  }

  // Pre-submit validation
  function validateBeforeSubmit(event: Event) {
    // Validation
    if (!applicationData.name || !applicationData.email || !applicationData.experience || !applicationData.whyJoin) {
      event.preventDefault();
      return showErrorToast('Please fill out all required fields');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicationData.email)) {
      event.preventDefault();
      return showErrorToast('Please enter a valid email address');
    }

    // Minimum length validation for text areas
    if (applicationData.experience.length < 50) {
      event.preventDefault();
      return showErrorToast('Experience description should be at least 50 characters');
    }

    if (applicationData.whyJoin.length < 50) {
      event.preventDefault();
      return showErrorToast('Please tell us more about why you want to join (at least 50 characters)');
    }

    if (!applicationData.resume) {
      event.preventDefault();
      return showErrorToast('Please upload your resume');
    }

    // File size validation (5MB max)
    if (applicationData.resume.size > 5 * 1024 * 1024) {
      event.preventDefault();
      return showErrorToast('Resume file must be less than 5MB');
    }
    
    isSubmitting = true;
  }
</script>

<main class="jobs-page">
  <!-- Header Section -->
  <div class="header-section">
    <h1 class="page-title jersey-font green-header-text">JOIN OUR TEAM</h1>
    <p class="page-subtitle">
      Help us build the future of XR gaming. We're looking for passionate individuals who want to push the boundaries of immersive entertainment.
    </p>
  </div>

  <!-- Progress Indicator -->
  <div class="progress-container">
    <button 
      class="progress-dot" 
      class:active={currentSlide === 0}
      on:click={() => goToSlide(0)}
      aria-label="View job listings"
    >
      <span class="dot"></span>
      <span class="label">Positions</span>
    </button>
    <div class="progress-line" class:active={currentSlide === 1}></div>
    <button 
      class="progress-dot" 
      class:active={currentSlide === 1}
      disabled={!selectedJob}
      on:click={() => selectedJob && goToSlide(1)}
      aria-label="View application form"
    >
      <span class="dot"></span>
      <span class="label">Apply</span>
    </button>
  </div>

  <!-- Horizontal Slider Container -->
  <div class="slider-viewport" bind:this={sliderContainer}>
    <div 
      class="slider-track"
      style="transform: translateX(-{currentSlide * 50}%)"
    >
      <!-- Slide 1: Job Listings -->
      <div class="slide">
        <div class="slide-content">
          <h2 class="section-title raleway-700">
            Open Positions
          </h2>
          
          <div class="jobs-grid">
            {#each jobs as job}
              <button 
                class="job-card"
                on:click={() => selectJob(job)}
              >
                <div class="job-card-header">
                  <span class="job-icon">{job.icon}</span>
                  <div class="job-badges">
                    <Badge color="green">{job.type}</Badge>
                    <Badge color="purple">{job.location}</Badge>
                  </div>
                </div>
                
                <h3 class="job-title">{job.title}</h3>
                <p class="job-department">{job.department}</p>
                <p class="job-description">{job.description}</p>

                <div class="job-cta">
                  <span>Apply Now</span>
                  <span class="arrow">→</span>
                </div>
              </button>
            {/each}
          </div>
        </div>
      </div>

      <!-- Slide 2: Application Form -->
      <div class="slide">
        <div class="slide-content">
          {#if selectedJob}
            <button class="back-button" on:click={goBack}>
              ← Back to Positions
            </button>

            <div class="application-header">
              <span class="job-icon-large">{selectedJob.icon}</span>
              <div>
                <h2 class="font-bold text-white raleway-700">
                  Apply for {selectedJob.title}
                </h2>
                <p>{selectedJob.department} · {selectedJob.location}</p>
              </div>
            </div>

            <!-- Job Requirements Section -->
            <div class="requirements-section">
              <h3 class="requirements-title">Position Requirements</h3>
              <p class="job-description-full">{selectedJob.description}</p>
              <ul class="requirements-list">
                {#each selectedJob.requirements as req}
                  <li>{req}</li>
                {/each}
              </ul>
            </div>

            <form 
              class="application-form" 
              method="POST"
              enctype="multipart/form-data"
              on:submit={validateBeforeSubmit}
              use:enhance={handleFormSubmit}
            >
              <!-- Hidden fields for job info -->
              <input type="hidden" name="jobId" value={selectedJob?.id || ''} />
              <input type="hidden" name="jobTitle" value={selectedJob?.title || ''} />
              
              <Badge color="yellow" class="mb-4">* Required fields</Badge>
              
              <!-- Personal Info Section -->
              <div class="form-section">
                <h3 class="form-section-title">Personal Information</h3>
                <div class="form-grid">
                  <FloatingLabelInput
                    maxlength={100}
                    bind:value={applicationData.name}
                    name="name"
                    class={inputClass}
                    style="filled"
                    type="text"
                  >
                    Full Name *
                  </FloatingLabelInput>

                  <FloatingLabelInput
                    maxlength={100}
                    bind:value={applicationData.email}
                    name="email"
                    class={inputClass}
                    style="filled"
                    type="email"
                  >
                    Email Address *
                  </FloatingLabelInput>

                  <FloatingLabelInput
                    maxlength={16}
                    bind:value={applicationData.phone}
                    name="phone"
                    class={inputClass}
                    style="filled"
                    type="tel"
                    pattern="\\(\\d{3}\\) \\d{3} - \\d{4}"
                    placeholder="(xxx) xxx - xxxx"
                    on:input={formatPhoneNumber}
                  >
                    Phone Number
                  </FloatingLabelInput>

                  <FloatingLabelInput
                    maxlength={200}
                    bind:value={applicationData.linkedin}
                    name="linkedin"
                    class={inputClass}
                    style="filled"
                    type="url"
                  >
                    LinkedIn Profile
                  </FloatingLabelInput>
                </div>

                <div class="mt-4">
                  <FloatingLabelInput
                    maxlength={200}
                    bind:value={applicationData.portfolio}
                    name="portfolio"
                    class={inputClass}
                    style="filled"
                    type="url"
                  >
                    Portfolio / GitHub URL
                  </FloatingLabelInput>
                </div>
              </div>

              <!-- Questions Section -->
              <div class="form-section">
                <h3 class="form-section-title">Tell Us About Yourself</h3>
                
                <div class="form-field">
                  <div class="label-row">
                    <label for="experience" class="field-label">Describe your relevant experience *</label>
                    <span class="char-count" class:warning={applicationData.experience.length > 800}>
                      {applicationData.experience.length}/1000
                    </span>
                  </div>
                  <Textarea
                    id="experience"
                    maxlength={1000}
                    bind:value={applicationData.experience}
                    name="experience"
                    class={inputClass}
                    placeholder="Tell us about your background, skills, and relevant projects..."
                    rows={4}
                  />
                  <span class="field-hint">Minimum 50 characters recommended</span>
                </div>

                <div class="form-field">
                  <div class="label-row">
                    <label for="whyJoin" class="field-label">Why do you want to join Final Boss Studios? *</label>
                    <span class="char-count" class:warning={applicationData.whyJoin.length > 800}>
                      {applicationData.whyJoin.length}/1000
                    </span>
                  </div>
                  <Textarea
                    id="whyJoin"
                    maxlength={1000}
                    bind:value={applicationData.whyJoin}
                    name="whyJoin"
                    class={inputClass}
                    placeholder="What excites you about working with us..."
                    rows={4}
                  />
                  <span class="field-hint">Minimum 50 characters recommended</span>
                </div>
              </div>

              <!-- Resume Upload Section -->
              <div class="form-section">
                <h3 class="form-section-title">Resume / CV *</h3>
                <div class="file-upload-wrapper">
                  <Fileupload 
                    name="resume"
                    accept=".pdf,.doc,.docx"
                    bind:files={resumeFiles}
                    class="file-upload"
                  />
                  <p class="file-hint">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  {#if applicationData.resume}
                    <p class="file-selected">
                      ✓ Selected: {applicationData.resume.name}
                    </p>
                  {/if}
                </div>
              </div>

              <!-- Submit Button -->
              <button
                type="submit"
                disabled={isSubmitting || !applicationData.name || !applicationData.email || !applicationData.experience || !applicationData.whyJoin || !applicationData.resume}
                class="submit-button"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          {:else}
            <div class="no-job-selected">
              <p>Please select a position first</p>
              <button class="back-button" on:click={goBack}>
                ← View Open Positions
              </button>
            </div>
          {/if}
        </div>
      </div>
    </div>
  </div>
</main>

<style>
  /* Header Styles */
  .header-section {
    text-align: center;
    padding: 1.5rem 1rem;
  }

  .page-title {
    font-size: 2.5rem;
    margin-bottom: 0.75rem;
  }

  .page-subtitle {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    max-width: 90%;
    margin: 0 auto;
    line-height: 1.5;
  }

  @media (min-width: 640px) {
    .header-section {
      padding: 2rem 1rem;
    }

    .page-title {
      font-size: 3.5rem;
    }

    .page-subtitle {
      font-size: 1rem;
      max-width: 32rem;
    }
  }

  @media (min-width: 768px) {
    .header-section {
      padding: 2rem 1rem;
    }

    .page-title {
      font-size: 4.5rem;
      margin-bottom: 1rem;
    }

    .page-subtitle {
      font-size: 1.125rem;
      max-width: 42rem;
    }
  }

  /* Progress Indicator */
  .progress-container {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1.5rem;
    padding: 0 1rem;
  }

  @media (min-width: 640px) {
    .progress-container {
      gap: 0.75rem;
      margin-bottom: 2rem;
    }
  }

  .progress-dot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.35rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  @media (min-width: 640px) {
    .progress-dot {
      gap: 0.5rem;
    }
  }

  .progress-dot:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .progress-dot .dot {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  @media (min-width: 640px) {
    .progress-dot .dot {
      width: 16px;
      height: 16px;
    }
  }

  .progress-dot.active .dot {
    background: #00ff00;
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
    animation: pulse 1.5s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 25px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.4);
      transform: scale(1.1);
    }
  }

  .progress-dot .label {
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.5);
    font-family: "Raleway", sans-serif;
    transition: color 0.3s ease;
  }

  @media (min-width: 640px) {
    .progress-dot .label {
      font-size: 0.75rem;
    }
  }

  .progress-dot.active .label {
    color: white;
  }

  .progress-line {
    width: 40px;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    align-self: flex-start;
    margin-top: 6px;
    transition: background 0.3s ease;
  }

  @media (min-width: 640px) {
    .progress-line {
      width: 60px;
      margin-top: 7px;
    }
  }

  .progress-line.active {
    background: linear-gradient(90deg, #00ff00, rgba(0, 255, 0, 0.3));
  }

  /* Main Container */
  .jobs-page {
    min-height: 100vh;
    overflow-x: hidden;
    width: 100%;
    max-width: 100vw;
  }

  /* Slider Styles */
  .slider-viewport {
    overflow: hidden;
    width: 100%;
    position: relative;
  }

  .slider-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    width: 200%; /* Two slides */
  }

  .slide {
    width: 50%; /* Each slide takes half of the track (which is 200% of viewport) */
    flex-shrink: 0;
    padding: 0 0.75rem;
    box-sizing: border-box;
  }

  @media (min-width: 640px) {
    .slide {
      padding: 0 1rem;
    }
  }

  .slide-content {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 2rem;
  }

  /* Section Title */
  .section-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-align: center;
    font-family: "Raleway", sans-serif;
  }

  @media (min-width: 640px) {
    .section-title {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .section-title {
      font-size: 1.875rem;
    }
  }

  /* Job Cards */
  .jobs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .jobs-grid {
      gap: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .jobs-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .job-card {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  @media (min-width: 640px) {
    .job-card {
      border-radius: 1.5rem;
      padding: 1.5rem;
    }
  }

  .job-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(0, 255, 0, 0.3);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .job-card:active {
    transform: translateY(-2px);
  }

  .job-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
    gap: 0.5rem;
  }

  @media (min-width: 640px) {
    .job-card-header {
      margin-bottom: 1rem;
    }
  }

  .job-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  @media (min-width: 640px) {
    .job-icon {
      font-size: 2.5rem;
    }
  }

  .job-badges {
    display: flex;
    gap: 0.35rem;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  @media (min-width: 640px) {
    .job-badges {
      gap: 0.5rem;
    }
  }

  .job-title {
    font-family: "Raleway", sans-serif;
    font-weight: 700;
    font-size: 1.125rem;
    color: white;
    margin-bottom: 0.25rem;
  }

  @media (min-width: 640px) {
    .job-title {
      font-size: 1.5rem;
    }
  }

  .job-department {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    margin-bottom: 0.75rem;
  }

  @media (min-width: 640px) {
    .job-department {
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
  }

  .job-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    line-height: 1.5;
    margin-bottom: 0.75rem;
    flex-grow: 1;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (min-width: 640px) {
    .job-description {
      font-size: 0.9rem;
      margin-bottom: 1rem;
      -webkit-line-clamp: 4;
      line-clamp: 4;
    }
  }

  .job-cta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.75rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #00ff00;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
  }

  @media (min-width: 640px) {
    .job-cta {
      padding-top: 1rem;
      font-size: 1rem;
    }
  }

  .job-cta .arrow {
    transition: transform 0.3s ease;
  }

  .job-card:hover .job-cta .arrow {
    transform: translateX(4px);
  }

  /* Application Form Styles */
  .back-button {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 0.5rem;
    padding: 0.5rem 0.875rem;
    color: white;
    font-family: "Raleway", sans-serif;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
  }

  @media (min-width: 640px) {
    .back-button {
      padding: 0.5rem 1rem;
      margin-bottom: 1.5rem;
    }
  }

  .back-button:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .application-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    margin-bottom: 1.25rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 640px) {
    .application-header {
      flex-direction: row;
      text-align: left;
      gap: 1rem;
      margin-bottom: 2rem;
      padding: 1.5rem;
      border-radius: 1rem;
    }
  }

  .application-header h2 {
    font-size: 1.25rem;
  }

  @media (min-width: 640px) {
    .application-header h2 {
      font-size: 1.5rem;
    }
  }

  @media (min-width: 768px) {
    .application-header h2 {
      font-size: 1.875rem;
    }
  }

  .application-header p {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (min-width: 640px) {
    .application-header p {
      font-size: 1rem;
    }
  }

  .job-icon-large {
    font-size: 2.5rem;
  }

  @media (min-width: 640px) {
    .job-icon-large {
      font-size: 3rem;
    }
  }

  /* Requirements Section on Slide 2 */
  .requirements-section {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 0.75rem;
    padding: 1rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 640px) {
    .requirements-section {
      border-radius: 1rem;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
  }

  .requirements-title {
    font-family: "Raleway", sans-serif;
    font-weight: 700;
    font-size: 0.9rem;
    color: #00ff00;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  @media (min-width: 640px) {
    .requirements-title {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
  }

  .job-description-full {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.85rem;
    line-height: 1.6;
    margin-bottom: 0.75rem;
  }

  @media (min-width: 640px) {
    .job-description-full {
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
  }

  .requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.35rem;
  }

  @media (min-width: 640px) {
    .requirements-list {
      gap: 0.5rem;
    }
  }

  .requirements-list li {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    padding: 0.4rem 0.5rem;
    padding-left: 1.5rem;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.35rem;
  }

  @media (min-width: 640px) {
    .requirements-list li {
      font-size: 0.9rem;
      padding: 0.5rem 0.75rem;
      padding-left: 1.75rem;
      border-radius: 0.5rem;
    }
  }

  .requirements-list li::before {
    content: "✓";
    color: #00ff00;
    position: absolute;
    left: 0.5rem;
    font-weight: bold;
    font-size: 0.75rem;
  }

  @media (min-width: 640px) {
    .requirements-list li::before {
      left: 0.75rem;
      font-size: inherit;
    }
  }

  .application-form {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1rem;
  }

  @media (min-width: 640px) {
    .application-form {
      border-radius: 1.5rem;
      padding: 1.5rem;
    }
  }

  .form-section {
    margin-bottom: 1.5rem;
  }

  @media (min-width: 640px) {
    .form-section {
      margin-bottom: 2rem;
    }
  }

  .form-section-title {
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 0.95rem;
    color: white;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  @media (min-width: 640px) {
    .form-section-title {
      font-size: 1.1rem;
      margin-bottom: 1rem;
    }
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
  }

  .form-field {
    margin-bottom: 0.75rem;
  }

  @media (min-width: 640px) {
    .form-field {
      margin-bottom: 1rem;
    }
  }

  .field-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.8rem;
    margin-bottom: 0.35rem;
  }

  @media (min-width: 640px) {
    .field-label {
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
  }

  .input-wrapper {
    position: relative;
  }

  .char-count {
    display: block;
    text-align: right;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 0.2rem;
    transition: color 0.2s ease;
  }

  @media (min-width: 640px) {
    .char-count {
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
  }

  .char-count.warning {
    color: #ffa500;
  }

  .label-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 0.35rem;
  }

  @media (min-width: 640px) {
    .label-row {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
  }

  .label-row .field-label {
    margin-bottom: 0;
  }

  .label-row .char-count {
    margin-top: 0;
    text-align: left;
  }

  @media (min-width: 640px) {
    .label-row .char-count {
      text-align: right;
    }
  }

  .field-hint {
    display: block;
    font-size: 0.65rem;
    color: rgba(255, 255, 255, 0.4);
    margin-top: 0.2rem;
    font-style: italic;
  }

  @media (min-width: 640px) {
    .field-hint {
      font-size: 0.75rem;
      margin-top: 0.25rem;
    }
  }

  .file-upload-wrapper {
    padding: 0.75rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.5rem;
    border: 2px dashed rgba(255, 255, 255, 0.2);
  }

  @media (min-width: 640px) {
    .file-upload-wrapper {
      padding: 1rem;
      border-radius: 0.75rem;
    }
  }

  .file-hint {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.7rem;
    margin-top: 0.35rem;
  }

  @media (min-width: 640px) {
    .file-hint {
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
  }

  .file-selected {
    color: #00ff00;
    font-size: 0.8rem;
    margin-top: 0.35rem;
    word-break: break-all;
  }

  @media (min-width: 640px) {
    .file-selected {
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  }

  .submit-button {
    width: 100%;
    padding: 0.875rem 1.5rem;
    background: #0e9f0e;
    border: none;
    border-radius: 0.5rem;
    color: white;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  @media (min-width: 640px) {
    .submit-button {
      padding: 1rem 2rem;
      border-radius: 0.75rem;
      font-size: 1.1rem;
    }
  }

  .submit-button:hover:not(:disabled) {
    background: #0c8c0c;
    transform: translateY(-2px);
    box-shadow: 0 4px 20px rgba(0, 255, 0, 0.3);
  }

  .submit-button:disabled {
    opacity: 0.5;
    background: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
  }

  .no-job-selected {
    text-align: center;
    padding: 3rem 1.5rem;
    color: rgba(255, 255, 255, 0.6);
  }

  @media (min-width: 640px) {
    .no-job-selected {
      padding: 4rem 2rem;
    }
  }

  .no-job-selected p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }

  @media (min-width: 640px) {
    .no-job-selected p {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
    }
  }
</style>
