<script lang="ts">
  import "../app.css";
  import { page } from '$app/stores';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup, Toast  } from 'flowbite-svelte';
  import { toast } from '$lib/stores/toastStore'; // Adjust path based on your project structure
  import { CheckCircleOutline, CloseCircleOutline } from "flowbite-svelte-icons";
  import { fly, fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
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
    { href: '/leaderboards', label: 'LEADERBOARDS', icon: '🏆', isImage: false },
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
        <NavLi href="/leaderboards" activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>LEADERBOARDS</NavLi>
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

  <Footer class="h-20 bg-black p-10">
    <div class="sm:flex sm:items-center sm:justify-between">
    <FooterCopyright href="/" by="Final Boss Studios" year={2021} />
    <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
      <FooterLink href="/jobs">Jobs</FooterLink>
      <FooterLink href="/privacy">Privacy Policy</FooterLink>
    </FooterLinkGroup>
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
    background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%);
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    z-index: 50;
    padding: 0.5rem 1.5rem 2rem;
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
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
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;
  }

  /* Drawer Navigation */
  .drawer-nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .drawer-link {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.25rem;
    border-radius: 1rem;
    background: rgba(255, 255, 255, 0.05);
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
    background: rgba(255, 255, 255, 0.1);
    color: white;
  }

  .drawer-link.active {
    background: linear-gradient(135deg, rgba(0, 196, 0, 0.2) 0%, rgba(0, 100, 0, 0.1) 100%);
    color: white;
    border: 1px solid rgba(0, 196, 0, 0.3);
  }

  .drawer-link-icon {
    font-size: 1.5rem;
    width: 2rem;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .drawer-icon-img {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
  }

  .drawer-link-label {
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    letter-spacing: 0.5px;
  }

  .drawer-active-indicator {
    position: absolute;
    right: 1.25rem;
    width: 8px;
    height: 8px;
    background: #00ff00;
    border-radius: 50%;
    box-shadow: 0 0 10px #00ff00;
  }

  /* Drawer Footer */
  .drawer-footer {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;
  }

  .drawer-footer-link {
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.875rem;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .drawer-footer-link:hover {
    color: white;
  }

  /* Drawer Close Button */
  .drawer-close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    margin-top: 1rem;
    padding: 0.875rem 1.5rem;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 1rem;
    color: rgba(255, 255, 255, 0.8);
    font-family: "Raleway", sans-serif;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .drawer-close-btn:hover {
    background: rgba(255, 255, 255, 0.12);
    color: white;
    border-color: rgba(255, 255, 255, 0.25);
  }

  .drawer-close-btn:active {
    transform: scale(0.98);
  }

  .close-icon {
    font-size: 1.1rem;
  }

  /* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: red;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
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
</style>