<script lang="ts">
    import { showSuccessToast ,showErrorToast } from '$lib/stores/toastStore';  
    import { Badge, FloatingLabelInput, Textarea } from 'flowbite-svelte';

    export let isLoading = false;

    // TailwindCSS Classes
    const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';   
    // Contact Form Submission
    let contactInfo = {
      name: '',
      email: '',
      message: '',
    }
    async function handleSubmit(event: SubmitEvent) {
    console.log('Attempting to Submit Form...');
    const form = event.currentTarget as HTMLFormElement; 

    try {
      // Check if User has filled out entire form
      if( contactInfo.name == '' || 
          contactInfo.email == '' || 
          contactInfo.message == '' ) 
        { return showErrorToast('Please fill out the entire form') }

        // Fetch Slack API Request
        const response = await fetch(form.action, {
          method: form.method,
          body: new FormData(form)   
        });

        const data = await response.json();

        // Check for SvelteKit fail() response or HTTP error
        if (!response.ok || data.type === 'failure') {
          console.error('Error submitting form:', data.data?.message || response.status);
          showErrorToast(data.data?.message || 'There was an error submitting your form. Please try again later.');
          return;
        }

        // Success Response
        form.reset();
        contactInfo = { name: '', email: '', message: '' };
        console.log('Form submitted successfully:', data);
        showSuccessToast();

    } catch (error) {
      console.error('Error submitting form:', error);
      showErrorToast('There was an error submitting your form. Please try again later.')
    }
    }
</script>
<main>
  <div class="mx-auto w-11/12">
    {#if isLoading}
      <!-- Skeleton Loading State -->
      <div class="skeleton-text skeleton-title"></div>
      <div class="skeleton-text skeleton-description"></div>
      <div class="skeleton-text skeleton-description-2"></div>
      
      <div class="contact-card w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2">
        <div class="skeleton-badge"></div>
        <div class="skeleton-input"></div>
        <div class="h-4"></div>
        <div class="skeleton-input"></div>
        <div class="h-4"></div>
        <div class="skeleton-textarea"></div>
        <div class="skeleton-button"></div>
      </div>
    {:else}
      <h1 class="text-7xl jersey-font sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 gradient-text">CONTACT US</h1>
      <p class="contact-header-card text-lg lg:text-lg sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2">
        Have a question? Have a comment? Want to work with, or invest in Final Boss?
        Please reach out, and we will contact you at our earliest convenience!
      </p>

      <!-- Form -->
      <div class="contact-card w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2 rounded-lg">
        <Badge color="yellow" class="mb-4">Please fill out entire form</Badge>
        <form method="POST" on:submit|preventDefault={handleSubmit}>
          <FloatingLabelInput 
            maxlength={100}
            bind:value={contactInfo.name}
            name="name"
            class="{inputClass} mb-2"
            style="filled" 
            type="text"
          >
            First & Last Name
          </FloatingLabelInput>
          
          <div class="h-4"></div>
          
          <FloatingLabelInput
            maxlength={100}
            bind:value={contactInfo.email}
            name="email"
            class="{inputClass} mb-2"
            style="filled" 
            color="base" 
            type="email"
          >
            Email
          </FloatingLabelInput> 
          
          <div class="h-4"></div>
          
          <Textarea 
            maxlength={500}
            bind:value={contactInfo.message}
            name="message"
            class={inputClass}
            placeholder="Your message" 
            rows={6}  
          />
          
          <!-- Honeypot field - hidden from humans, bots will fill it -->
          <div class="honeypot" aria-hidden="true">
            <label for="website">Website</label>
            <input type="text" name="website" id="website" tabindex="-1" autocomplete="off" />
          </div>
          
          <button
            type="submit"
            disabled={contactInfo.name === '' || contactInfo.email === '' || contactInfo.message === ''}
            class="submit-btn"
          >
            Submit
          </button>
        </form>
      </div>
    {/if}
  </div>
</main>
<style>

  .submit-btn {
    display: block;
    width: 100%;
    height: 2.75rem;
    margin-top: 1rem;
    border-radius: 0.5rem;
    color: white;
    font-size: 1rem;
    font-weight: 600;
    background: linear-gradient(135deg, #0e9f0e, #006600);
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #00c400, #008800);
    box-shadow: 0 4px 15px rgba(0, 196, 0, 0.3);
    transform: translateY(-2px);
  }

  .submit-btn:disabled {
    opacity: 0.5;
    background: rgba(255, 255, 255, 0.2);
    cursor: not-allowed;
  }

  /* Honeypot - Hidden from humans */
  .honeypot {
    position: absolute;
    left: -9999px;
    opacity: 0;
    pointer-events: none;
    height: 0;
    overflow: hidden;
  }

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

  .skeleton-badge {
    width: 180px;
    height: 1.5rem;
    margin-bottom: 1rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem;
  }

  .skeleton-input {
    width: 100%;
    height: 3.5rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem;
  }

  .skeleton-textarea {
    width: 100%;
    height: 9rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem;
  }

  .skeleton-button {
    width: 100%;
    height: 2.5rem;
    margin-top: 0.5rem;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.06) 25%,
      rgba(255, 255, 255, 0.12) 50%,
      rgba(255, 255, 255, 0.06) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 0.375rem;
  }

  @media (max-width: 640px) {
    .skeleton-title {
      width: 200px;
      height: 3.5rem;
    }
  }
</style>