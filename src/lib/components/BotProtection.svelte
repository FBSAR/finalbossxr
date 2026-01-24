<script lang="ts">
    import { onMount } from 'svelte';
    import { FloatingLabelInput } from 'flowbite-svelte';
    
    export let isValid = false;
    export let label = 'Bot Protection';
    
    let num1 = 0;
    let num2 = 0;
    let operator: '+' | '-' | '×' = '+';
    let correctAnswer = 0;
    let userAnswer = '';
    let hasAttempted = false;
    
    const inputClass = 'focus:bg-white/20 focus:border-2 focus:border-[#00FF00]';
    
    function generateChallenge() {
        // Generate random numbers between 1 and 10
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
        
        // Random operator
        const operators: ('+' | '-' | '×')[] = ['+', '-', '×'];
        operator = operators[Math.floor(Math.random() * operators.length)];
        
        // Ensure subtraction doesn't result in negative
        if (operator === '-' && num2 > num1) {
            [num1, num2] = [num2, num1];
        }
        
        // Calculate correct answer
        switch (operator) {
            case '+':
                correctAnswer = num1 + num2;
                break;
            case '-':
                correctAnswer = num1 - num2;
                break;
            case '×':
                correctAnswer = num1 * num2;
                break;
        }
        
        userAnswer = '';
        hasAttempted = false;
        isValid = false;
    }
    
    function validateAnswer() {
        hasAttempted = true;
        const parsed = parseInt(userAnswer, 10);
        isValid = !isNaN(parsed) && parsed === correctAnswer;
    }
    
    $: if (userAnswer !== '') {
        validateAnswer();
    }
    
    onMount(() => {
        generateChallenge();
    });
</script>

<div class="bot-protection">
    <div class="captcha-header">
        <span class="shield-icon">🛡️</span>
        <span class="captcha-label">{label}</span>
        <button 
            type="button" 
            class="refresh-btn" 
            on:click={generateChallenge}
            title="Get new challenge"
        >
            ↻
        </button>
    </div>
    
    <div class="captcha-challenge">
        <div class="math-problem">
            <span class="number">{num1}</span>
            <span class="operator">{operator}</span>
            <span class="number">{num2}</span>
            <span class="equals">=</span>
            <span class="question">?</span>
        </div>
        
        <div class="answer-input">
            <FloatingLabelInput
                bind:value={userAnswer}
                name="captcha"
                type="text"
                inputmode="numeric"
                pattern="[0-9]*"
                class="{inputClass} captcha-input"
                style="filled"
                maxlength={3}
            >
                Your answer
            </FloatingLabelInput>
            
            {#if hasAttempted}
                <span class="validation-icon" class:valid={isValid} class:invalid={!isValid}>
                    {isValid ? '✓' : '✗'}
                </span>
            {/if}
        </div>
    </div>
    
    {#if hasAttempted && !isValid}
        <p class="error-message">Incorrect answer. Please try again.</p>
    {/if}
</div>

<style>
    .bot-protection {
        margin: 1rem 0;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.5rem;
    }
    
    .captcha-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.75rem;
    }
    
    .shield-icon {
        font-size: 1.25rem;
    }
    
    .captcha-label {
        font-size: 0.875rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.8);
        flex-grow: 1;
    }
    
    .refresh-btn {
        background: transparent;
        border: 1px solid rgba(255, 255, 255, 0.2);
        color: rgba(255, 255, 255, 0.6);
        width: 2rem;
        height: 2rem;
        border-radius: 50%;
        cursor: pointer;
        font-size: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .refresh-btn:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border-color: rgba(255, 255, 255, 0.4);
    }
    
    .captcha-challenge {
        display: flex;
        align-items: center;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .math-problem {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        background: rgba(0, 0, 0, 0.3);
        padding: 0.75rem 1rem;
        border-radius: 0.5rem;
        font-family: 'Courier New', monospace;
        font-size: 1.25rem;
        font-weight: bold;
        color: #00FF00;
        user-select: none;
    }
    
    .number {
        min-width: 1.5rem;
        text-align: center;
    }
    
    .operator {
        color: #FFD700;
    }
    
    .equals {
        color: rgba(255, 255, 255, 0.5);
    }
    
    .question {
        color: #00c400;
        animation: pulse 1.5s ease-in-out infinite;
    }
    
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    
    .answer-input {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
        min-width: 120px;
        max-width: 180px;
    }
    
    .answer-input :global(.captcha-input) {
        text-align: center;
        font-size: 1.125rem;
        font-weight: bold;
    }
    
    .validation-icon {
        font-size: 1.25rem;
        font-weight: bold;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .validation-icon.valid {
        color: #00FF00;
    }
    
    .validation-icon.invalid {
        color: #ff4444;
    }
    
    .error-message {
        margin-top: 0.5rem;
        font-size: 0.75rem;
        color: #ff6b6b;
    }
    
    @media (max-width: 480px) {
        .captcha-challenge {
            flex-direction: column;
            align-items: stretch;
        }
        
        .math-problem {
            justify-content: center;
        }
        
        .answer-input {
            max-width: 100%;
        }
    }
</style>
