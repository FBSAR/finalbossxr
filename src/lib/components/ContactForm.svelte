<script lang="ts">
    import { enhance } from '$app/forms';
    import { showSuccessToast ,showErrorToast } from '$lib/stores/toastStore';  
    import { Badge, FloatingLabelInput, Textarea } from 'flowbite-svelte';
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

        // Success Response
        if (response.ok) {
          const data = await response.json();
          form.reset();
          contactInfo = { name: '', email: '', message: '' };
          console.log('Form submitted successfully:', data);
          showSuccessToast();

          // Failure Response
        } else {
          console.error('Error submitting form:', response.status);
          showErrorToast('There was an error submitting your form. Please try again later.')
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      showErrorToast('There was an error submitting your form. Please try again later.')
    }
    }
</script>
<main>
  <div class="mx-auto w-11/12">
    <h1 class="text-7xl jersey-font sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 green-header-text">CONTACT US</h1>
    <p class=" contact-header-card text-lg lg:text-lg sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2">
    Have a question? Have a comment? Want to work with, or invest in Final Boss?
    Please reach out, and we will contact you are our earliest convenience!
    </p>

    <!-- Form -->
    <div class="contact-card w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2">
        <Badge color="yellow" class="mb-4">Please fill out entire form</Badge>
        <form method="POST" on:submit|preventDefault={handleSubmit}>
            <FloatingLabelInput 
        maxlength="100"
        bind:value={contactInfo.name}
        name="name"
        classInput={inputClass}
        defaultClass={"mb-2 bg-red-900"} style="filled" type="text">
        First & Last Name
            </FloatingLabelInput>
            <!-- Spacer -->
            <div class="h-4"></div>
            <FloatingLabelInput
        maxlength="100"
        bind:value={contactInfo.email}
        name="email"
        classInput={inputClass}
        defaultClass={"mb-2"} style="filled" color="base" type="email">
        Email
            </FloatingLabelInput> 
            <!-- Spacer -->
            <div class="h-4"></div>
            <Textarea 
        maxlength="500"
        bind:value={contactInfo.message}
        name="message"
        class={inputClass}
        placeholder="Your message" rows="6"  
            />
            <!--         style="background: var(--green-gradient);" -->
            <button
        type="submit"
        disabled={contactInfo.name === '' || contactInfo.email === '' || contactInfo.message === '' }
        class="block w-full h-10 rounded text-white text-lg mt-2 disabled:opacity-50 disabled:bg-white/20 bg-[#0e9f0e] hover:bg-[var(--red)] duration-200">
          Submit
            </button>
        </form>
    </div>
  </div>
</main>
<style>

</style>