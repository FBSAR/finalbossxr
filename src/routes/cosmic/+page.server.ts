import { SLACK_CONTACT_FORM_HOOK_URL } from '$env/static/private';
import { format } from 'date-fns';
import type { Action } from '@sveltejs/kit';

export const prerender = false;
const formattedDate = format(new Date(), 'MMMM do, yyyy');

// Tracking state to ensure only 1 message is sent to slack at a time.
let formSubmitted = false;

async function submitFormData(name: string, email: string, message: string) {
    
    try {
    
        if(!formSubmitted) {
        formSubmitted = true;
        const response = await fetch(SLACK_CONTACT_FORM_HOOK_URL, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    text: `
                    ✉️ FinalBossXR Contact Message\n--- \nDate: ${formattedDate}\nName: ${name} \nEmail: ${email} \nMessage: \n\n"${message}"\n---`
                  })
        });

    
        if (response.ok) {
            const responseData = await response; // Parse the response if it's JSON
            console.log('POST request successful:', responseData);
                setTimeout(() => {
                    return formSubmitted = false
                }, 1000);
        } else {
                console.error('POST request failed:', response);
                return;
        }
        } else {
            // TODO: ???
        }
    } catch (error) {
        
    }
}

export const actions: {default: Action}  = {
    default: async ({ request }) => {  
      console.clear();
      console.log('Sending Contact Message:');

      try {
        const data = await request.formData();
        const name = data.get('name') as string;
        const email = data.get('email') as string;
        const message = data.get('message') as string;
        console.log('Form data:', { name, email, message });
  
        if(name == '' || email == '' || message == '') {
            // Toast
            return console.log('Please fill out entire form');
        }
        
        submitFormData(name, email, message);
        return { success: true };
        
      } catch (error) {
        throw error;
      }
    }
}

