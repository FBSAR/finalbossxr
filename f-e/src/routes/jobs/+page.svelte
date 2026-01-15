<script lang="ts">
  import { Badge, FloatingLabelInput, Textarea, Fileupload } from 'flowbite-svelte';
  import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';
  import { fly } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

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

  // Handle file upload
  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      applicationData.resume = target.files[0];
    }
  }

  // Handle form submission
  async function handleSubmit(event: SubmitEvent) {
    console.log('Submitting application...');
    
    // Validation
    if (!applicationData.name || !applicationData.email || !applicationData.experience || !applicationData.whyJoin) {
      return showErrorToast('Please fill out all required fields');
    }

    if (!applicationData.resume) {
      return showErrorToast('Please upload your resume');
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('jobId', selectedJob?.id.toString() || '');
      formData.append('jobTitle', selectedJob?.title || '');
      formData.append('name', applicationData.name);
      formData.append('email', applicationData.email);
      formData.append('phone', applicationData.phone);
      formData.append('linkedin', applicationData.linkedin);
      formData.append('portfolio', applicationData.portfolio);
      formData.append('experience', applicationData.experience);
      formData.append('whyJoin', applicationData.whyJoin);
      formData.append('resume', applicationData.resume);

      const response = await fetch('http://localhost:3000/jobs', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to submit application');
      }

      console.log('Application submitted:', result);
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
      selectedJob = null;
      goToSlide(0);

    } catch (error) {
      console.error('Error submitting application:', error);
      showErrorToast('There was an error submitting your application. Please try again later.');
    }
  }
</script>

<main class="min-h-screen">
  <!-- Header Section -->
  <div class="text-center py-8 px-4">
    <h1 class="text-5xl md:text-7xl jersey-font green-header-text mb-4">JOIN OUR TEAM</h1>
    <p class="text-white/70 text-lg max-w-2xl mx-auto">
      Help us build the future of XR gaming. We're looking for passionate individuals who want to push the boundaries of immersive entertainment.
    </p>
  </div>

  <!-- Progress Indicator -->
  <div class="flex justify-center gap-3 mb-8">
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
      style="transform: translateX(-{currentSlide * 100}%)"
    >
      <!-- Slide 1: Job Listings -->
      <div class="slide">
        <div class="slide-content">
          <h2 class="text-2xl md:text-3xl font-bold text-white mb-6 text-center raleway-700">
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
                <h2 class="text-2xl md:text-3xl font-bold text-white raleway-700">
                  Apply for {selectedJob.title}
                </h2>
                <p class="text-white/60">{selectedJob.department} · {selectedJob.location}</p>
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

            <form class="application-form" on:submit|preventDefault={handleSubmit}>
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
                    maxlength={20}
                    bind:value={applicationData.phone}
                    name="phone"
                    class={inputClass}
                    style="filled"
                    type="tel"
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
                  <label for="experience" class="field-label">Describe your relevant experience *</label>
                  <Textarea
                    id="experience"
                    maxlength={1000}
                    bind:value={applicationData.experience}
                    name="experience"
                    class={inputClass}
                    placeholder="Tell us about your background, skills, and relevant projects..."
                    rows={4}
                  />
                </div>

                <div class="form-field">
                  <label for="whyJoin" class="field-label">Why do you want to join Final Boss Studios? *</label>
                  <Textarea
                    id="whyJoin"
                    maxlength={1000}
                    bind:value={applicationData.whyJoin}
                    name="whyJoin"
                    class={inputClass}
                    placeholder="What excites you about working with us..."
                    rows={4}
                  />
                </div>
              </div>

              <!-- Resume Upload Section -->
              <div class="form-section">
                <h3 class="form-section-title">Resume / CV *</h3>
                <div class="file-upload-wrapper">
                  <Fileupload 
                    accept=".pdf,.doc,.docx"
                    on:change={handleFileChange}
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
                disabled={!applicationData.name || !applicationData.email || !applicationData.experience || !applicationData.whyJoin || !applicationData.resume}
                class="submit-button"
              >
                Submit Application
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
  /* Slider Styles */
  .slider-viewport {
    overflow: hidden;
    width: 100%;
    max-width: 100vw;
  }

  .slider-track {
    display: flex;
    transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .slide {
    min-width: 100%;
    flex-shrink: 0;
    padding: 0 1rem;
  }

  .slide-content {
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 2rem;
  }

  /* Progress Indicator */
  .progress-dot {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .progress-dot:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .progress-dot .dot {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid rgba(255, 255, 255, 0.3);
    transition: all 0.3s ease;
  }

  .progress-dot.active .dot {
    background: #00ff00;
    border-color: #00ff00;
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
  }

  .progress-dot .label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.5);
    font-family: "Raleway", sans-serif;
    transition: color 0.3s ease;
  }

  .progress-dot.active .label {
    color: white;
  }

  .progress-line {
    width: 60px;
    height: 2px;
    background: rgba(255, 255, 255, 0.2);
    align-self: flex-start;
    margin-top: 7px;
    transition: background 0.3s ease;
  }

  .progress-line.active {
    background: linear-gradient(90deg, #00ff00, rgba(0, 255, 0, 0.3));
  }

  /* Job Cards */
  .jobs-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
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
    border-radius: 1.5rem;
    padding: 1.5rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
  }

  .job-card:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(0, 255, 0, 0.3);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  }

  .job-card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .job-icon {
    font-size: 2.5rem;
  }

  .job-badges {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .job-title {
    font-family: "Raleway", sans-serif;
    font-weight: 700;
    font-size: 1.5rem;
    color: white;
    margin-bottom: 0.25rem;
  }

  .job-department {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    margin-bottom: 1rem;
  }

  .job-description {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 1rem;
    flex-grow: 1;
  }

  .job-cta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: #00ff00;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
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
    padding: 0.5rem 1rem;
    color: white;
    font-family: "Raleway", sans-serif;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 1.5rem;
  }

  .back-button:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  .application-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .job-icon-large {
    font-size: 3rem;
  }

  /* Requirements Section on Slide 2 */
  .requirements-section {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1rem;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .requirements-title {
    font-family: "Raleway", sans-serif;
    font-weight: 700;
    font-size: 1.1rem;
    color: #00ff00;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .job-description-full {
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 1rem;
  }

  .requirements-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: grid;
    gap: 0.5rem;
  }

  .requirements-list li {
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    padding: 0.5rem 0.75rem;
    padding-left: 1.75rem;
    position: relative;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 0.5rem;
  }

  .requirements-list li::before {
    content: "✓";
    color: #00ff00;
    position: absolute;
    left: 0.75rem;
    font-weight: bold;
  }

  .application-form {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 1.5rem;
    padding: 1.5rem;
  }

  .form-section {
    margin-bottom: 2rem;
  }

  .form-section-title {
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    color: white;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  @media (min-width: 640px) {
    .form-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  .form-field {
    margin-bottom: 1rem;
  }

  .field-label {
    display: block;
    color: rgba(255, 255, 255, 0.7);
    font-size: 0.9rem;
    margin-bottom: 0.5rem;
  }

  .file-upload-wrapper {
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 0.75rem;
    border: 2px dashed rgba(255, 255, 255, 0.2);
  }

  .file-hint {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.8rem;
    margin-top: 0.5rem;
  }

  .file-selected {
    color: #00ff00;
    font-size: 0.9rem;
    margin-top: 0.5rem;
  }

  .submit-button {
    width: 100%;
    padding: 1rem 2rem;
    background: #0e9f0e;
    border: none;
    border-radius: 0.75rem;
    color: white;
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 1.1rem;
    cursor: pointer;
    transition: all 0.3s ease;
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
    padding: 4rem 2rem;
    color: rgba(255, 255, 255, 0.6);
  }

  .no-job-selected p {
    margin-bottom: 1.5rem;
    font-size: 1.1rem;
  }
</style>
