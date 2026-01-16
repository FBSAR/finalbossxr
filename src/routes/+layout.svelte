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
  const successToastClass = 'fixed top-4 right-4 w-full max-w-xl z-50 p-4 text-white text-3xl bg-black shadow dark:text-white dark:bg-black border-2 border-[#00ff00] rounded gap-3';
  const errorToastClass = 'fixed top-4 right-4 w-full max-w-sm lg:max-w-xl z-50 p-4 text-white text-3xl bg-black shadow dark:text-white dark:bg-black border-2 border-[#dd0000] rounded gap-3';
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
     {#if $toast.success}
    <Toast 
      
      divClass={successToastClass} 
      contentClass={'w-full text-sm lg:text-lg font-normal'} 
      dismissable={true} 
      align={true}>
        <span><CheckCircleOutline size="xl" color="#00ff00"></CheckCircleOutline></span>
        <span>Your message has been submitted! We will get back to you soon! 🙏🏾</span>
    </Toast>
    {/if}
    {#if $toast.error}
    <Toast 
      divClass={errorToastClass} 
      contentClass={'w-full text-sm lg:text-lg font-normal'} 
      dismissable={true} 
      align={true}>
        <span><CloseCircleOutline size="xl" color="#dd0000"></CloseCircleOutline></span>
        <span>{errorToastMessage}</span>
    </Toast>
    {/if}
  </main>

  <Footer class="h-20 bg-black p-10">
    <div class="sm:flex sm:items-center sm:justify-between">
    <FooterCopyright href="/" by="Final Boss Studios" year={2021} />
    <FooterLinkGroup ulClass="flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
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
</style>