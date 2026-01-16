<script lang="ts">
    import { showSuccessToast, showErrorToast } from '$lib/stores/toastStore';
    import { FloatingLabelInput } from 'flowbite-svelte';

    export let variant: 'inline' | 'stacked' = 'inline';
    export let placeholder = 'Enter your email for updates';
    export let buttonText = 'Subscribe';

    let email = '';
    let isSubmitting = false;

    const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';

    async function handleSubmit(event: SubmitEvent) {
        event.preventDefault();
        
        if (!email || isSubmitting) return;

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showErrorToast('Please enter a valid email address');
            return;
        }

        isSubmitting = true;

        try {
            const response = await fetch('/api/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showSuccessToast();
                email = '';
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

<form 
    class="newsletter-form {variant}" 
    on:submit={handleSubmit}
>
    <!-- Honeypot field -->
    <div class="honeypot" aria-hidden="true">
        <label for="newsletter-website">Website</label>
        <input type="text" name="website" id="newsletter-website" tabindex="-1" autocomplete="off" />
    </div>

    {#if variant === 'inline'}
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
            <button
                type="submit"
                disabled={!email || isSubmitting}
                class="subscribe-btn"
            >
                {#if isSubmitting}
                    <span class="spinner"></span>
                {:else}
                    {buttonText}
                {/if}
            </button>
        </div>
    {:else}
        <FloatingLabelInput
            bind:value={email}
            name="email"
            type="email"
            class="{inputClass} mb-3"
            style="filled"
            maxlength={100}
        >
            {placeholder}
        </FloatingLabelInput>
        <button
            type="submit"
            disabled={!email || isSubmitting}
            class="subscribe-btn full-width"
        >
            {#if isSubmitting}
                <span class="spinner"></span>
                <span>Subscribing...</span>
            {:else}
                {buttonText}
            {/if}
        </button>
    {/if}
</form>

<style>
    .newsletter-form {
        width: 100%;
    }

    .inline-wrapper {
        display: flex;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .inline-wrapper :global(.floating-label-input) {
        flex: 1;
    }

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
    }
</style>
