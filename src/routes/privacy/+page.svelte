<script lang='ts'>
  import { goto } from '$app/navigation';
  import { Button, Badge, FloatingLabelInput, Textarea } from 'flowbite-svelte';
  import { LinkedinSolid, DiscordSolid, FacebookSolid, XSolid} from 'flowbite-svelte-icons'
  import { enhance } from '$app/forms';
  import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';

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
  function testerLink() {
      window.open('https://forms.gle/SWN4pGnP4crNx78e7', '_blank');
  }
  function discordLink() {
      window.open('https://discord.gg/W2c5KHpy', '_blank');
  }
  function gotoCosmicPage() {
    goto('cosmic');
  }
  function gotoFacebookPage() {
    window.open('https://www.facebook.com/FinalBossStudios', '_blank');
  }
  function gotoInstagramPage() {
    window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
  function gotoXPage() {
    window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
  function gotoLinkedInPage() {
    window.open('https://discord.gg/UvRHXpgd', '_blank');
  }
</script>
<main>

    <!-- Header -->
    <h1 class="page-header text-7xl jersey-font sm:w-1/2 lg:w-1/2 mx-auto mt-4 p-2 green-header-text">Privacy Policy</h1>
    <div class="mx-auto w-11/12 lg:w-1/2 mt-2">
        <p class="date-info">
        Effective Date: July 10, 2025<br>
        Last Updated: July 10, 2025
        </p>  
        <p><strong>Developer:</strong> Final Boss Studios</p>
        <br>
        <p>Final Boss Studios (“we,” “our,” or “us”) respects your privacy and is committed to protecting the personal data of users who interact with our mobile game, <strong>Cosmic Collisions</strong>, available on the Google Play Store.</p>  
        <p>This Privacy Policy explains how we collect, use, and share your information in accordance with <strong>Google Play’s User Data Policy</strong>.</p>  
        <br>

        <h2 class="gold-header-text text-3xl">1. Types of Data We Collect</h2>
        <p>We may collect the following data types, either directly or via third-party services:</p>
        <ul>
            <li><strong>a. Device & Technical Data</strong>
                <ul>
                    <li style="">Device model, OS version, and hardware ID</li>
                    <li>IP address (used for region targeting)</li>
                    <li>Crash logs and performance metrics</li>
                </ul>
            </li>
            <li><strong>b. Gameplay Data</strong>
                <ul>
                    <li>Progress, scores, items collected, levels completed</li>
                </ul>
            </li>
            <li><strong>c. Third-Party SDK Data</strong>
                <ul>
                    <li>Firebase Analytics: usage metrics (e.g., session duration)</li>
                    <li>Google AdMob: for displaying <strong>non-personalized ads</strong> (no behavioral tracking)</li>
                </ul>
            </li>
        </ul>
        <p>We <strong>do not collect</strong> names, email addresses, location data beyond city-level, or any personally identifiable information.</p>  
        <br>
        
        <h2 class="gold-header-text text-3xl">2. How We Use Your Data</h2>
        <p>We use collected data to:</p>
        <ul>
            <li>Provide a stable and functional app experience</li>
            <li>Improve game performance and identify bugs</li>
            <li>Display <strong>non-personalized ads</strong></li>
            <li>Comply with legal and regulatory requirements</li>
        </ul>
        <br>

        <h2 class="gold-header-text text-3xl">3. Data Sharing Practices</h2>
        <p>We do not sell your data. We only share data under the following conditions:</p>
        <ul>
            <li>With trusted third-party providers (e.g., Google/Firebase) strictly for analytics and ad display</li>
            <li>When legally required (e.g., court order or regulatory requirement)</li>
        </ul> 
        <br>
         
        <h2 class="gold-header-text text-3xl">4. User Data and Google Play Compliance</h2>
        <p>We follow these best practices:</p>
        <ul>
            <li><strong>Data minimization:</strong> We only collect what is essential for gameplay and analytics.</li>
            <li><strong>No sensitive permissions:</strong> We do not access camera, microphone, contacts, SMS, or location.</li>
            <li>No account sign-in is required</li>
            <li>No personal information is stored or processed on our servers.</li>
        </ul><br>

        <h2 class="gold-header-text text-3xl">5. Children's Privacy</h2>
        <p><strong>Cosmic Collisions</strong> is <strong>not intended for children under the age of 13</strong>. We do not knowingly collect personal data from children. If we become aware that we have collected such data without parental consent, we will delete it immediately.</p>  
        <br>
        
        <h2 class="gold-header-text text-3xl">6. Data Retention and Deletion</h2>
        <p>We retain gameplay and analytics data only as long as necessary for its intended purpose.</p>
        <p>You may request data deletion by contacting us at the email below.</p>  
        <br>

        <h2 class="gold-header-text text-3xl">7. Security</h2>
        <p>We implement reasonable technical safeguards to protect your data. However, no online service is completely secure, and we cannot guarantee absolute security.</p>  
        <br>
        
        <h2 class="gold-header-text text-3xl">8. Your Choices</h2>
        <p>You can:</p>
        <ul>
            <li>Opt out of personalized ads via your Google Account settings</li>
            <li>Limit data sharing by disabling analytics in device settings (where available)</li>
        </ul>  
        <br>
        
        <h2 class="gold-header-text text-3xl">9. Changes to This Policy</h2>
        <p>We may update this Privacy Policy to reflect changes in our practices or legal requirements. The updated version will always be posted here with a new effective date</p>  
    </div>
  
   
  <!-- Spacer -->
  <div class="h-2 my-20 lg:my-32 border-b-8 border-[#00c40030]"></div>
   
  <!-- Form & Social Media -->
  <div class="sm:inline lg:flex w-1/3 mx-auto my-4 bg-[#88888800] justify-center text-center">
    <!-- Flowbite InstagramSolid icon didnt work -->
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoInstagramPage}>
      <svg width="32px" height="32px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="#00c400"/>
      <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="#00c400"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="#00c400"/>
      </svg>
    </Button>    
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoFacebookPage}>
      <XSolid size="xl" class="mx-2" color="#00c400"></XSolid>
    </Button>    
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoLinkedInPage}>
      <LinkedinSolid size="xl" class="mx-2" color="#00c400"></LinkedinSolid>
    </Button>    
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoFacebookPage}>
      <FacebookSolid  size="xl" class="mx-2" color="#00c400"></FacebookSolid>
    </Button>
    <Button class="w-20 my-2 lg:my-0 lg:mx-2 border-[#99999930] hover:border-green-500 border-2 hover:border-2" on:click={gotoFacebookPage}> 
      <svg fill="#00c400" width="32px" height="32px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" xml:space="preserve"><path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
      </svg>
    </Button>
    <br>
  </div>
  <div class="text-center my-8 pb-20 w-full">
    <Button on:click={discordLink} color="purple" class="w-48">
      <DiscordSolid class="mr-2"></DiscordSolid>
      Join our Discord
    </Button>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>

  <!-- Contact Form -->
  <div class="mx-auto w-11/12">
    <h1 class="text-7xl jersey-font sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 green-header-text">CONTACT US</h1>
    <p class="text-lg lg:text-lg sm:w-1/2 lg:w-1/2 mx-auto my-4 p-2 backdrop-blur-lg lg:bg-white/10 border-white/20 lg:border-2">
    Have a question? Have a comment? Want to work with, or invest in Final Boss?
    Please reach out, and we will contact you are our earliest convenience!
    </p>

    <!-- Form -->
    <div class="w-full lg:w-1/2 mx-auto bg-white/10 p-4 border-white/20 lg:border-2">
      <Badge color="yellow" class="mb-4">Please fill out entire form</Badge>
      <form method="POST" use:enhance on:submit|preventDefault={handleSubmit}>
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
      <!--         style="background: var(--green-gradient);" 
 -->
      <button
        type="submit"
        disabled={contactInfo.name === '' || contactInfo.email === '' || contactInfo.message === '' }
        class="block w-full h-10 rounded text-white text-lg mt-2 disabled:opacity-50 disabled:bg-white/20 bg-[#0e9f0e] hover:bg-[var(--red)] duration-200">
          Submit
      </button>
    </form>
    </div>
  </div>

  <!-- Spacer -->
  <div class="h-10 lg:h-32"></div>
  
</main>
<style>
  @keyframes fade-in-hor {
        0% {
            transform: translateX(-1.25rem);
        }
        100% {
            opacity: 1;
            transform: translateX(0rem);
        }
  }
  @keyframes fade-in-ver {
        0% {
            transform: translateY(1.25rem);
        }
        100% {
            opacity: 1;
            transform: translateY(0rem);
        }
  }

        
    ul {
        list-style-type: disc;
        margin-left: 20px;
    }
    li {
        margin-bottom: 5px;
    }
    .date-info {
        font-size: 0.9em;
        color: #666;
        text-align: center;
        margin-bottom: 20px;
    }
</style>