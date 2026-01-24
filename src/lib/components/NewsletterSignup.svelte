<script lang="ts">
    import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';
    import { FloatingLabelInput } from 'flowbite-svelte';
    import { slide } from 'svelte/transition';
    import BotProtection from './BotProtection.svelte';

    export let variant: 'inline' | 'stacked' | 'expandable' = 'inline';
    export let placeholder = 'Enter your email for updates';
    export let buttonText = 'Subscribe';
    export let triggerText = 'Sign up for newsletter';
    export let showName = false;

    let email = '';
    let name = '';
    let isSubmitting = false;
    let isExpanded = false;
    let isSubscribed = false;
    let captchaValid = false;

    const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';

    function toggleExpand() {
        isExpanded = !isExpanded;
    }

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        
        if (!email || isSubmitting) return;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorToast('Please enter a valid email address');
            return;
        }

        // Check CAPTCHA
        if (!captchaValid) {
            showErrorToast('Please complete the bot protection challenge');
            return;
        }

        isSubmitting = true;

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, name })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showSuccessToast();
                email = '';
                name = '';
                isExpanded = false;
                isSubscribed = true;
            } else {
                showErrorToast(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Newsletter signup error:', error);
            showErrorToast('Something went wrong. Please try again.');
        } finally {
            isSubmitting = false;
        }
    }
</script>

<div class="newsletter-wrapper">
    <!-- Honeypot field -->
    <div class="honeypot" aria-hidden="true">
        <label for="newsletter-website">Website</label>
        <input type="text" name="website" id="newsletter-website" tabindex="-1" autocomplete="off" />
    </div>

    {#if variant === 'expandable'}
        <!-- Expandable variant for footer -->
        {#if isSubscribed}
            <div class="subscribed-message" transition:slide={{ duration: 300 }}>
                <span class="check-icon">✓</span>
                <span>Thanks for subscribing!</span>
            </div>
        {:else if !isExpanded}
            <div class="trigger-wrapper">
                <button 
                    type="button" 
                    class="trigger-btn"
                    on:click={toggleExpand}
                >
                    {triggerText}
                </button>
            </div>
        {:else}
            <form 
                class="newsletter-form expandable" 
                on:submit={handleSubmit}
                transition:slide={{ duration: 300 }}
            >
                <div class="expandable-inputs">
                    <FloatingLabelInput
                        bind:value={name}
                        name="name"
                        type="text"
                        class={inputClass}
                        style="filled"
                        maxlength={100}
                    >
                        Name (optional)
                    </FloatingLabelInput>
                    
                    <FloatingLabelInput
                        bind:value={email}
                        name="email"
                        type="email"
                        class={inputClass}
                        style="filled"
                        maxlength={100}
                    >
                        Email *
                    </FloatingLabelInput>
                </div>
                
                <!-- Bot Protection CAPTCHA - Only show when email is filled -->
                {#if email}
                    <BotProtection bind:isValid={captchaValid} label="Verify you're human" />
                {/if}
                
                <div class="expandable-actions">
                    <button
                        type="button"
                        class="cancel-btn"
                        on:click={toggleExpand}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={!email || isSubmitting || !captchaValid}
                        class="subscribe-btn"
                    >
                        {#if isSubmitting}
                            <span class="spinner"></span>
                        {:else}
                            {buttonText}
                        {/if}
                    </button>
                </div>
            </form>
        {/if}

    {:else if variant === 'inline'}
        <form class="newsletter-form inline" on:submit={handleSubmit}>
            <div class="inline-wrapper">
                <FloatingLabelInput
                    bind:value={email}
                    name="email"
                    type="email"
                    class={inputClass}
                    style="filled"
                    maxlength={100}
                >
                    {placeholder}
                </FloatingLabelInput>
            </div>
            <!-- Bot Protection CAPTCHA - Only show when email is filled -->
            {#if email}
                <BotProtection bind:isValid={captchaValid} label="Verify you're human" />
            {/if}
            <div class="inline-submit">
                <button
                    type="submit"
                    disabled={!email || isSubmitting || !captchaValid}
                    class="subscribe-btn"
                >
                    {#if isSubmitting}
                        <span class="spinner"></span>
                    {:else}
                        {buttonText}
                    {/if}
                </button>
            </div>
        </form>

    {:else}
        <!-- Stacked variant -->
        <form class="newsletter-form stacked" on:submit={handleSubmit}>
            {#if showName}
                <FloatingLabelInput
                    bind:value={name}
                    name="name"
                    type="text"
                    class="{inputClass} my-4"
                    style="filled"
                    maxlength={100}
                >
                    Name (optional)
                </FloatingLabelInput>
            {/if}
            <!-- Spacer -->
            <div class="my-2"></div>
            <FloatingLabelInput
                bind:value={email}
                name="email"
                type="email"
                class="{inputClass} my-4"
                style="filled"
                maxlength={100}
            >
                {placeholder}
            </FloatingLabelInput>
            <!-- Spacer -->
            <div class="my-2"></div>
            <!-- Bot Protection CAPTCHA - Only show when email is filled -->
            {#if email}
                <BotProtection bind:isValid={captchaValid} label="Verify you're human" />
            {/if}
            <button
                type="submit"
                disabled={!email || isSubmitting || !captchaValid}
                class="subscribe-btn full-width"
            >
                {#if isSubmitting}
                    <span class="spinner"></span>
                    <span>Subscribing...</span>
                {:else}
                    {buttonText}
                {/if}
            </button>
        </form>
    {/if}
</div>

<style>
    .newsletter-wrapper {
        width: 100%;
    }

    .newsletter-form {
        width: 100%;
    }

    /* Trigger Wrapper */
    .trigger-wrapper {
        display: flex;
        justify-content: flex-end;
    }

    /* Trigger Button */
    .trigger-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: transparent;
        color: #00ff00;
        font-weight: 600;
        border: 2px solid #00ff00;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
    }

    .trigger-btn:hover {
        background: #00ff00;
        color: #000;
        transform: translateY(-1px);
    }

    /* Expandable Inputs */
    .expandable-inputs {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-bottom: 1rem;
    }

    @media (min-width: 640px) {
        .expandable-inputs {
            flex-direction: row;
            gap: 1rem;
        }

        .expandable-inputs :global(.floating-label-input) {
            flex: 1;
        }
    }

    /* Expandable Actions */
    .expandable-actions {
        display: flex;
        gap: 0.75rem;
        justify-content: flex-end;
    }

    .cancel-btn {
        padding: 0.75rem 1.5rem;
        background: transparent;
        color: rgba(255, 255, 255, 0.6);
        font-weight: 500;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .cancel-btn:hover {
        color: #fff;
        border-color: rgba(255, 255, 255, 0.4);
    }

    /* Subscribed Message */
    .subscribed-message {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: #00ff00;
        font-weight: 500;
    }

    .check-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        background: #00ff00;
        color: #000;
        border-radius: 50%;
        font-size: 14px;
        font-weight: bold;
    }

    /* Inline Wrapper */
    .inline-wrapper {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .inline-wrapper :global(.floating-label-input) {
        flex: 1;
    }

    /* Subscribe Button */
    .subscribe-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        background: #00ff00;
        color: #000;
        font-weight: 600;
        border: none;
        border-radius: 0.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
        white-space: nowrap;
        min-height: 48px;
    }

    .subscribe-btn:hover:not(:disabled) {
        background: #00cc00;
        transform: translateY(-1px);
    }

    .subscribe-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .subscribe-btn.full-width {
        width: 100%;
    }

    /* Spinner */
    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid transparent;
        border-top-color: currentColor;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
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

    @media (max-width: 480px) {
        .inline-wrapper {
            flex-direction: column;
        }

        .subscribe-btn {
            width: 100%;
        }

        .expandable-actions {
            flex-direction: column-reverse;
        }

        .cancel-btn,
        .expandable-actions .subscribe-btn {
            width: 100%;
        }
    }
</style>
