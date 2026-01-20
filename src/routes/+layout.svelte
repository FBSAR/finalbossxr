<script lang="ts">
  import "../app.css";
  import { page } from '$app/stores';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup, Toast  } from 'flowbite-svelte';
  import { toast } from '$lib/stores/toastStore'; // Adjust path based on your project structure
  import { CheckCircleOutline, CloseCircleOutline } from "flowbite-svelte-icons";
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import NewsletterSignup from '$lib/components/NewsletterSignup.svelte';
  $: activeUrl = $page.url.pathname;


  // Navbar Link Classes
  const nonActiveNavLink = 'text-[#fff]/60 text-xl lg:text-sm  my-1 duration-100 raleway';
  const activeNavLink = 'text-[#fff] text-xl lg:text-sm green-header-text lg:bg-transparent my-1 font-bold duration-100 raleway-700';
  
  // Toast Classes - Refined Modern Style
  const baseToastClass = 'toast-refined fixed top-4 right-4 z-[100] max-w-[calc(100vw-2rem)] sm:max-w-md lg:max-w-lg rounded-2xl backdrop-blur-xl shadow-2xl';
  const successToastClass = `${baseToastClass} bg-gradient-to-r from-[#0a2f0a]/95 to-[#0d3d0d]/90 border border-[#00ff00]/30`;
  const errorToastClass = `${baseToastClass} bg-gradient-to-r from-[#3d0a0a]/95 to-[#2f0d0d]/90 border border-[#ff3333]/30`;
  
  $: errorToastMessage = $toast.errorMessage; // Reactive for store

  // Should hide Navbar on mobile when a link is clicked
  let hideNavMenu = true;
  function onNavHamburgerClick()  {
      if(hideNavMenu) {
        hideNavMenu = false;
      } else {
        hideNavMenu = true;
      }
  };
  function onNavLinkClick()  {
      hideNavMenu = true;
  };

  // Bottom Drawer State
  let bottomDrawerOpen = false;

  function toggleBottomDrawer() {
    bottomDrawerOpen = !bottomDrawerOpen;
  }

  function closeDrawer() {
    bottomDrawerOpen = false;
  }

  // Navigation links
  const navLinks = [
    { href: '/', label: 'HOME', icon: '🏠', isImage: false },
    { href: '/cosmic', label: 'COSMIC', icon: 'https://finalbossxr.s3.us-east-1.amazonaws.com/cosmic/logos/CosmicCollisions_Logo_NoText_NoBG.png', isImage: true },
    { href: '/project_v', label: 'PROJECT_V', icon: '🔥', isImage: false },
    { href: '/blog', label: 'BLOG', icon: '📝', isImage: false },
    { href: '/about', label: 'ABOUT US', icon: '👥', isImage: false },
    { href: '/contact', label: 'CONTACT', icon: '✉️', isImage: false },
  ];
 
</script>
<main>
  <!-- Mobile -->
  <Navbar let:toggle class="block lg:hidden fixed w-full bottom-0 z-50 backdrop-blur-lg bg-[#1b023d]/80 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]" color="none">
    <NavBrand href="/">
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/F_Logo_White.png" 
          class="h-9 sm:h-12" 
          alt="Final Boss Studios Logo" />
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/Text_Logo_White.png" 
          class="h-6 sm:h-7" 
          alt="Final Boss Studios Text Logo" />
      </NavBrand>
      <button 
        class="hamburger-btn lg:hidden" 
        on:click={toggleBottomDrawer}
        aria-label="Toggle menu"
      >
        <span class="hamburger-icon" class:open={bottomDrawerOpen}>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </span>
      </button>
  </Navbar>

  <!-- Bottom Drawer Overlay -->
  {#if bottomDrawerOpen}
    <button 
      class="drawer-overlay lg:hidden" 
      transition:fade={{ duration: 200 }}
      on:click={closeDrawer}
      aria-label="Close menu"
    ></button>
  {/if}

  <!-- Bottom Drawer -->
  {#if bottomDrawerOpen}
    <div 
      class="bottom-drawer lg:hidden"
      transition:fly={{ y: 400, duration: 300, easing: cubicOut }}
    >
      <div class="drawer-handle-container">
        <div class="drawer-handle"></div>
      </div>
      <div class="drawer-logo-container">
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/F_Logo_White.png" 
          alt="Final Boss Studios Logo"
          class="drawer-logo"
        />
      </div>
      <nav class="drawer-nav">
        {#each navLinks as link, i}
          <a 
            href={link.href} 
            class="drawer-link"
            class:active={activeUrl === link.href}
            on:click={closeDrawer}
            style="animation-delay: {i * 50}ms"
          >
            <span class="drawer-link-icon">
              {#if link.isImage}
                <img src={link.icon} alt={link.label} class="drawer-icon-img" />
              {:else}
                {link.icon}
              {/if}
            </span>
            <span class="drawer-link-label">{link.label}</span>
            {#if activeUrl === link.href}
              <span class="drawer-active-indicator"></span>
            {/if}
          </a>
        {/each}
      </nav>
      <div class="drawer-footer">
        <a href="/privacy" class="drawer-footer-link" on:click={closeDrawer}>Privacy Policy</a>
      </div>
      <button class="drawer-close-btn" on:click={closeDrawer}>
        <span class="close-icon">✕</span>
        <span>Close</span>
      </button>
    </div>
  {/if}

  <!-- Desktop -->
  <Navbar let:toggle class="hidden lg:block fixed w-full top-0 z-50 backdrop-blur-lg bg-[#1b023d]/80 shadow-md" color="none">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <NavBrand href="/">
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/F_Logo_White.png" 
          class="h-9 sm:h-12" 
          alt="Final Boss Studios Logo" />
        <img 
          src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/Text_Logo_White.png" 
          class="h-6 sm:h-7" 
          alt="Final Boss Studios Text Logo" />
      </NavBrand>
      <NavHamburger menuClass={'text-white inline'} onClick={() => onNavHamburgerClick()}  />
      <NavUl {activeUrl} hidden={hideNavMenu}
        on:click={() => onNavLinkClick()}>
        <NavLi href="/" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>HOME</NavLi>
        <NavLi href="/cosmic" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>COSMIC</NavLi>
        <NavLi href="/project_v" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>PROJECT_V</NavLi>
        <NavLi href="/blog" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>BLOG</NavLi>
        <NavLi href="/about" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>ABOUT US</NavLi>
        <!-- <NavLi href="/education" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>EDUCATION</NavLi> -->
        <!-- <NavLi href="/crowdfunding" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>CROWDFUNDING</NavLi> -->
        <NavLi href="/contact" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>CONTACT</NavLi>
      </NavUl>
    </div> 
  </Navbar>

  <main class="scrollbar min-h-screen pt-4 pb-20 lg:py-20" style="background: var(--dark-purple-gradient);">
    <slot></slot>
    
    <!-- Success Toast -->
    {#if $toast.success}
    <div 
      class="toast-container"
      transition:fly={{ x: 100, duration: 300, easing: cubicOut }}
    >
      <Toast 
        divClass={successToastClass} 
        contentClass={'toast-content'} 
        dismissable={true} 
        align={true}
      >
        <div class="toast-icon-wrapper success-icon">
          <CheckCircleOutline size="lg" color="#00ff00" />
        </div>
        <div class="toast-text-wrapper">
          <span class="toast-title success-title">Success!</span>
          <span class="toast-message">Your message has been submitted! We will get back to you soon! 🙏🏾</span>
        </div>
      </Toast>
    </div>
    {/if}
    
    <!-- Error Toast -->
    {#if $toast.error}
    <div 
      class="toast-container"
      transition:fly={{ x: 100, duration: 300, easing: cubicOut }}
    >
      <Toast 
        divClass={errorToastClass} 
        contentClass={'toast-content'} 
        dismissable={true} 
        align={true}
      >
        <div class="toast-icon-wrapper error-icon">
          <CloseCircleOutline size="lg" color="#ff3333" />
        </div>
        <div class="toast-text-wrapper">
          <span class="toast-title error-title">Error</span>
          <span class="toast-message">{errorToastMessage}</span>
        </div>
      </Toast>
    </div>
    {/if}
  </main>

  <Footer class="relative z-10 bg-black py-8 px-6 lg:px-10">
    <div class="max-w-7xl mx-auto">
      <!-- Newsletter Section -->
      <div class="mb-6 pb-6 border-b border-white/10">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 class="text-white font-semibold text-lg gold-header-text">Stay Updated</h3>
            <p class="text-gray-400 text-sm">Get the latest news and updates from Final Boss Studios</p>
          </div>
          <div class="w-full sm:w-auto sm:min-w-[320px]">
            <NewsletterSignup variant="expandable" triggerText="Sign up for newsletter" buttonText="Subscribe" />
          </div>
        </div>
      </div>
      
      <!-- Social Media Links -->
      <div class="mb-6 flex flex-wrap justify-center sm:justify-start gap-3">
        <a href="https://www.instagram.com/finalbossstudios/" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Instagram">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" fill="currentColor"/>
            <path d="M18 5C17.4477 5 17 5.44772 17 6C17 6.55228 17.4477 7 18 7C18.5523 7 19 6.55228 19 6C19 5.44772 18.5523 5 18 5Z" fill="currentColor"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M1.65396 4.27606C1 5.55953 1 7.23969 1 10.6V13.4C1 16.7603 1 18.4405 1.65396 19.7239C2.2292 20.8529 3.14708 21.7708 4.27606 22.346C5.55953 23 7.23969 23 10.6 23H13.4C16.7603 23 18.4405 23 19.7239 22.346C20.8529 21.7708 21.7708 20.8529 22.346 19.7239C23 18.4405 23 16.7603 23 13.4V10.6C23 7.23969 23 5.55953 22.346 4.27606C21.7708 3.14708 20.8529 2.2292 19.7239 1.65396C18.4405 1 16.7603 1 13.4 1H10.6C7.23969 1 5.55953 1 4.27606 1.65396C3.14708 2.2292 2.2292 3.14708 1.65396 4.27606ZM13.4 3H10.6C8.88684 3 7.72225 3.00156 6.82208 3.0751C5.94524 3.14674 5.49684 3.27659 5.18404 3.43597C4.43139 3.81947 3.81947 4.43139 3.43597 5.18404C3.27659 5.49684 3.14674 5.94524 3.0751 6.82208C3.00156 7.72225 3 8.88684 3 10.6V13.4C3 15.1132 3.00156 16.2777 3.0751 17.1779C3.14674 18.0548 3.27659 18.5032 3.43597 18.816C3.81947 19.5686 4.43139 20.1805 5.18404 20.564C5.49684 20.7234 5.94524 20.8533 6.82208 20.9249C7.72225 20.9984 8.88684 21 10.6 21H13.4C15.1132 21 16.2777 20.9984 17.1779 20.9249C18.0548 20.8533 18.5032 20.7234 18.816 20.564C19.5686 20.1805 20.1805 19.5686 20.564 18.816C20.7234 18.5032 20.8533 18.0548 20.9249 17.1779C20.9984 16.2777 21 15.1132 21 13.4V10.6C21 8.88684 20.9984 7.72225 20.9249 6.82208C20.8533 5.94524 20.7234 5.49684 20.564 5.18404C20.1805 4.43139 19.5686 3.81947 18.816 3.43597C18.5032 3.27659 18.0548 3.14674 17.1779 3.0751C16.2777 3.00156 15.1132 3 13.4 3Z" fill="currentColor"/>
          </svg>
        </a>
        <a href="https://x.com/FinalBossXR" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="X (Twitter)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        <a href="https://www.linkedin.com/company/final-boss-studios/" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="LinkedIn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
          </svg>
        </a>
        <a href="https://www.facebook.com/FinalBossStudios" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="Facebook">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/>
          </svg>
        </a>
        <a href="https://www.tiktok.com/@final.boss.studio" target="_blank" rel="noopener noreferrer" class="social-icon" aria-label="TikTok">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
          </svg>
        </a>
        <a href="https://discord.gg/W2c5KHpy" target="_blank" rel="noopener noreferrer" class="social-icon discord" aria-label="Discord">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
        </a>
      </div>
      
      <!-- Footer Links -->
      <div class="sm:flex sm:items-center sm:justify-between">
        <FooterCopyright href="/" by="Final Boss Studios" year={2021} />
        <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
          <FooterLink href="/jobs">Jobs</FooterLink>
          <FooterLink href="/privacy">Privacy Policy</FooterLink>
        </FooterLinkGroup>
      </div>
    </div>
  </Footer>

</main>
<style>
  /* Hamburger Button */
  .hamburger-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    z-index: 60;
  }

  .hamburger-icon {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 24px;
    height: 18px;
    transition: all 0.3s ease;
  }

  .hamburger-icon .bar {
    display: block;
    width: 100%;
    height: 2px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .hamburger-icon.open .bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }

  .hamburger-icon.open .bar:nth-child(2) {
    opacity: 0;
    transform: scaleX(0);
  }

  .hamburger-icon.open .bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }

  /* Drawer Overlay */
  .drawer-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(4px);
    z-index: 40;
    border: none;
    cursor: pointer;
  }

  /* Bottom Drawer */
  .bottom-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: #000;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    border-top: 1px solid rgba(0, 255, 0, 0.2);
    z-index: 50;
    padding: 0.5rem 1.5rem 2rem;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.8), 0 -2px 20px rgba(0, 255, 0, 0.1);
    max-height: 80vh;
    overflow-y: auto;
  }

  .drawer-handle-container {
    display: flex;
    justify-content: center;
    padding: 0.75rem 0;
  }

  .drawer-handle {
    width: 40px;
    height: 4px;
    background: rgba(0, 255, 0, 0.4);
    border-radius: 2px;
    box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
  }

  /* Drawer Logo */
  .drawer-logo-container {
    display: flex;
    justify-content: center;
    padding: 0.25rem 0 0.5rem;
  }

  .drawer-logo {
    height: 40px;
    width: auto;
    filter: drop-shadow(0 0 10px rgba(0, 255, 0, 0.3));
  }

  /* Drawer Navigation */
  .drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.25rem;
  }

  .drawer-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.625rem 1rem;
    border-radius: 0.75rem;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.06);
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.2s ease;
    position: relative;
    animation: slideUp 0.3s ease forwards;
    opacity: 0;
    transform: translateY(20px);
  }

  @keyframes slideUp {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .drawer-link:hover {
    background: rgba(0, 255, 0, 0.08);
    border-color: rgba(0, 255, 0, 0.2);
    color: white;
  }

  .drawer-link.active {
    background: linear-gradient(135deg, rgba(0, 255, 0, 0.15) 0%, rgba(0, 255, 0, 0.05) 100%);
    color: #00ff00;
    border: 1px solid rgba(0, 255, 0, 0.4);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.1);
  }

  .drawer-link-icon {
    font-size: 1rem;
    width: 2rem;
    height: 2rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 255, 0, 0.08);
    border: 1px solid rgba(0, 255, 0, 0.15);
    border-radius: 0.375rem;
    flex-shrink: 0;
  }

  .drawer-link:hover .drawer-link-icon {
    background: rgba(0, 255, 0, 0.15);
    border-color: rgba(0, 255, 0, 0.3);
  }

  .drawer-link.active .drawer-link-icon {
    background: rgba(0, 255, 0, 0.2);
    border-color: rgba(0, 255, 0, 0.5);
    box-shadow: 0 0 10px rgba(0, 255, 0, 0.2);
  }

  .drawer-icon-img {
    width: 1.25rem;
    height: 1.25rem;
    object-fit: contain;
  }

  .drawer-link-label {
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    letter-spacing: 0.5px;
  }

  .drawer-active-indicator {
    position: absolute;
    right: 1rem;
    width: 6px;
    height: 6px;
    background: #00ff00;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ff00, 0 0 20px rgba(0, 255, 0, 0.5);
  }

  /* Drawer Footer */
  .drawer-footer {
    margin-top: 0.75rem;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(0, 255, 0, 0.15);
    text-align: center;
  }

  .drawer-footer-link {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.75rem;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .drawer-footer-link:hover {
    color: #00ff00;
  }

  /* Drawer Close Button */
  .drawer-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.625rem 1rem;
    background: rgba(0, 255, 0, 0.08);
    border: 1px solid rgba(0, 255, 0, 0.2);
    border-radius: 0.75rem;
    color: rgba(0, 255, 0, 0.8);
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .drawer-close-btn:hover {
    background: rgba(0, 255, 0, 0.15);
    color: #00ff00;
    border-color: rgba(0, 255, 0, 0.4);
    box-shadow: 0 0 15px rgba(0, 255, 0, 0.15);
  }

  .drawer-close-btn:active {
    transform: scale(0.98);
  }

  .close-icon {
    font-size: 1.1rem;
  }

  /* width */
::-webkit-scrollbar {
  width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #1a1a1a;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 0, 0.3);
  border-radius: 4px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 0, 0.5);
}

/* Toast Refined Styles */
.toast-container {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 100;
}

:global(.toast-refined) {
  padding: 1rem 1.25rem !important;
  display: flex !important;
  align-items: flex-start !important;
  gap: 0.875rem !important;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.4),
    0 8px 10px -6px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset !important;
}

:global(.toast-content) {
  display: flex !important;
  align-items: flex-start !important;
  gap: 0.875rem !important;
  width: 100% !important;
}

.toast-icon-wrapper {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  animation: iconPulse 2s ease-in-out infinite;
}

.toast-icon-wrapper.success-icon {
  background: rgba(0, 255, 0, 0.15);
  box-shadow: 0 0 20px rgba(0, 255, 0, 0.2);
}

.toast-icon-wrapper.error-icon {
  background: rgba(255, 51, 51, 0.15);
  box-shadow: 0 0 20px rgba(255, 51, 51, 0.2);
}

@keyframes iconPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.toast-text-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-family: "Raleway", sans-serif;
  font-weight: 700;
  font-size: 0.95rem;
  letter-spacing: 0.3px;
}

.toast-title.success-title {
  color: #00ff00;
}

.toast-title.error-title {
  color: #ff3333;
}

.toast-message {
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.875rem;
  line-height: 1.4;
  font-family: "Raleway", sans-serif;
}

/* Toast close button styling */
:global(.toast-refined button) {
  color: rgba(255, 255, 255, 0.5) !important;
  transition: all 0.2s ease !important;
  border-radius: 50% !important;
  padding: 0.25rem !important;
}

:global(.toast-refined button:hover) {
  color: white !important;
  background: rgba(255, 255, 255, 0.1) !important;
}

/* Mobile responsiveness for toasts */
@media (max-width: 640px) {
  .toast-container {
    top: auto;
    bottom: 5rem;
    right: 0.75rem;
    left: 0.75rem;
  }
  
  :global(.toast-refined) {
    padding: 0.875rem 1rem !important;
  }
  
  .toast-icon-wrapper {
    width: 2rem;
    height: 2rem;
  }
  
  .toast-title {
    font-size: 0.875rem;
  }
  
  .toast-message {
    font-size: 0.8rem;
  }
}

/* Social Media Icons */
.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #00ff00;
  transition: all 0.2s ease;
}

.social-icon:hover {
  background: rgba(0, 255, 0, 0.1);
  border-color: #00ff00;
  transform: translateY(-2px);
}

.social-icon.discord {
  color: #5865F2;
}

.social-icon.discord:hover {
  background: rgba(88, 101, 242, 0.1);
  border-color: #5865F2;
}
</style>