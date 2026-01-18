<script lang="ts">
  import { enhance } from '$app/forms';
  
  export let form;

  // Login state
  let loginStep: 'email' | 'code' = form?.step === 'code' ? 'code' : 'email';
  let pendingEmail = form?.email || '';
  let isSubmitting = false;

  // Reset to email step
  function backToEmail() {
    loginStep = 'email';
    pendingEmail = '';
  }
</script>

<svelte:head>
  <title>Admin Login | FinalBoss XR</title>
</svelte:head>

<div class="admin-container">
  <div class="login-card">
    <div class="login-header">
      <h1>🔐 Admin Access</h1>
      <p>{loginStep === 'email' ? 'Enter your admin email' : 'Enter the 6-digit code'}</p>
    </div>
    
    {#if form?.error}
      <div class="error-msg">{form.error}</div>
    {/if}

    {#if loginStep === 'email'}
      <form method="POST" action="?/requestCode" use:enhance={() => {
        isSubmitting = true;
        return async ({ result, update }) => {
          isSubmitting = false;
          if (result.type === 'success' && result.data?.step === 'code') {
            loginStep = 'code';
            pendingEmail = String(result.data.email || '');
          }
          await update();
        };
      }}>
        <input type="email" name="email" placeholder="admin@finalbossxr.com" required autocomplete="email" />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending...' : 'Send Code'}
        </button>
      </form>
    {:else}
      <form method="POST" action="?/verifyCode">
        <input type="hidden" name="email" value={pendingEmail} />
        <p class="code-sent">Code sent to <strong>{pendingEmail}</strong></p>
        <input 
          type="text" 
          name="code" 
          placeholder="000000" 
          required 
          maxlength="6" 
          inputmode="numeric"
          autocomplete="one-time-code"
          class="code-input"
        />
        <button type="submit">Verify Code</button>
        <button type="button" class="btn-link" on:click={backToEmail}>← Back</button>
      </form>
    {/if}
  </div>
</div>

<style>
  .admin-container {
    min-height: 100vh;
    background: #0a0a0f;
    color: #e0e0e0;
    padding: 1.5rem;
  }

  .login-card {
    max-width: 320px;
    margin: 15vh auto;
    padding: 2rem;
    background: #12121a;
    border: 1px solid #222;
    border-radius: 0.75rem;
  }
  .login-header { text-align: center; margin-bottom: 1.5rem; }
  .login-header h1 { font-size: 1.5rem; margin-bottom: 0.25rem; }
  .login-header p { color: #666; font-size: 0.875rem; }
  .login-card input {
    width: 100%;
    padding: 0.75rem;
    background: #1a1a24;
    border: 1px solid #333;
    border-radius: 0.5rem;
    color: white;
    margin-bottom: 1rem;
  }
  .login-card button[type="submit"] {
    width: 100%;
    padding: 0.75rem;
    background: #00c400;
    border: none;
    border-radius: 0.5rem;
    color: #000;
    font-weight: 600;
    cursor: pointer;
  }
  .login-card button[type="submit"]:disabled {
    background: #444;
    color: #888;
    cursor: wait;
  }
  .code-sent {
    text-align: center;
    color: #888;
    font-size: 0.8rem;
    margin: 0 0 1rem;
  }
  .code-sent strong { color: #00c400; }
  .code-input {
    text-align: center;
    font-size: 1.5rem;
    letter-spacing: 0.5rem;
    font-weight: bold;
  }
  .btn-link {
    width: 100%;
    background: none !important;
    border: none;
    color: #666;
    font-size: 0.8rem;
    cursor: pointer;
    margin-top: 0.5rem;
    padding: 0.5rem;
  }
  .btn-link:hover { color: #888; }
  .error-msg {
    background: rgba(255,50,50,0.1);
    border: 1px solid #f55;
    color: #f88;
    padding: 0.5rem;
    border-radius: 0.25rem;
    margin-bottom: 1rem;
    font-size: 0.875rem;
    text-align: center;
  }
</style>
