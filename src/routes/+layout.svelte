<script lang="ts">
  import "../app.css";
  import { page } from '$app/stores';
  import { Navbar, NavBrand, NavLi, NavUl, NavHamburger, Footer, FooterBrand, FooterCopyright, FooterIcon, FooterLink, FooterLinkGroup, Toast  } from 'flowbite-svelte';
  import { toast } from '$lib/stores/toastStore'; // Adjust path based on your project structure
  import { CheckCircleOutline, CloseCircleOutline } from "flowbite-svelte-icons";
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
 
</script>
<main>
  <!-- Mobile -->
  <Navbar let:toggle class="block lg:hidden fixed w-full top-0 z-50 backdrop-blur-lg bg-[#1b023d]/80 shadow-md" color="none">
    <NavBrand href="/">
        <img 
          src="https://ik.imagekit.io/lgpq0vloy/logos/F_Logo_White.png?updatedAt=1721187101575" 
          class="h-9 sm:h-12" 
          alt="Final Boss Studios Logo" />
        <img 
          src="https://ik.imagekit.io/lgpq0vloy/logos/Text_Logo_White.png?updatedAt=1721187101565" 
          class="h-6 sm:h-7" 
          alt="Final Boss Studios Logo" />
      </NavBrand>
      <NavHamburger menuClass={'text-white inline'} onClick={() => onNavHamburgerClick()}  />
      <NavUl {activeUrl} hidden={hideNavMenu}
        on:click={() => onNavLinkClick()}>
        <NavLi href="/" active={true} activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>HOME</NavLi>
        <NavLi href="/cosmic" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>COSMIC</NavLi>
        <NavLi href="/about" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>ABOUT US</NavLi>
        <!-- <NavLi href="/education" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>EDUCATION</NavLi> -->
        <!-- <NavLi href="/crowdfunding" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>CROWDFUNDING</NavLi> -->
        <NavLi href="/contact" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>CONTACT</NavLi>
      </NavUl>
  </Navbar>

  <!-- Desktop -->
  <Navbar let:toggle class="hidden lg:block fixed w-full top-0 z-50 backdrop-blur-lg bg-[#1b023d]/80 shadow-md" color="none">
    <div class="max-w-7xl mx-auto flex items-center justify-between">
      <NavBrand href="/">
        <img 
          src="https://ik.imagekit.io/lgpq0vloy/logos/F_Logo.svg?updatedAt=1721187102011" 
          class="h-9 sm:h-12" 
          alt="Final Boss Studios Logo" />
        <img 
          src="https://ik.imagekit.io/lgpq0vloy/logos/Text_Logo_White.png?updatedAt=1721187101565" 
          class="h-6 sm:h-7" 
          alt="Final Boss Studios Logo" />
      </NavBrand>
      <NavHamburger menuClass={'text-white inline'} onClick={() => onNavHamburgerClick()}  />
      <NavUl {activeUrl} hidden={hideNavMenu}
        on:click={() => onNavLinkClick()}>
        <NavLi href="/" active={true} activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>HOME</NavLi>
        <NavLi href="/cosmic" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>COSMIC</NavLi>
        <NavLi href="/about" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>ABOUT US</NavLi>
        <!-- <NavLi href="/education" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>EDUCATION</NavLi> -->
        <!-- <NavLi href="/crowdfunding" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>CROWDFUNDING</NavLi> -->
        <NavLi href="/contact" active={true}  activeClass={activeNavLink} nonActiveClass={nonActiveNavLink}>CONTACT</NavLi>
      </NavUl>
    </div> 
  </Navbar>

  <main class="scrollbar min-h-screen py-14 lg:py-20" style="background: var(--dark-purple-gradient);">
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
      <!-- <FooterLink href="/about">About</FooterLink>
      <FooterLink href="/contact">Contact</FooterLink> -->
    </FooterLinkGroup>
    </div>
  </Footer>

</main>
<style>
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