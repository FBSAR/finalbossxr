/**
 * Email testing utilities
 * Send sample emails to verify templates and styling
 */

import {
    sendContactConfirmationEmail,
    sendApplicationConfirmationEmail,
    sendApplicationAdminNotificationEmail,
    sendNewsletterEmail,
    sendNewsletterAdminNotificationEmail,
    sendJobApplicationAcceptanceEmail,
    sendJobApplicationRejectionEmail,
    sendApplicationResponseNotificationEmail
} from './email';

// Test data generators
const testData = {
    contactForm: () => ({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test contact form submission to verify the email template styling and layout.'
    }),

    applicationConfirmation: () => ({
        applicantName: 'Jane Developer',
        applicantEmail: 'jane@example.com',
        jobTitle: 'Senior Game Developer',
        phone: '(555) 123-4567',
        linkedin: 'https://linkedin.com/in/janedeveloper',
        portfolio: 'https://janedeveloper.com',
        experience: 'Experienced game developer with 7+ years shipping AAA titles. Specialized in Unreal Engine 5 and C++. Background in multiplayer systems and graphics optimization.',
        whyJoin: 'Excited to join Final Boss Studios to create innovative gaming experiences. Your commitment to quality and pushing boundaries aligns perfectly with my career goals.'
    }),

    applicationAdminNotification: () => ({
        applicantName: 'John Game Designer',
        applicantEmail: 'john@example.com',
        jobTitle: 'Game Designer',
        phone: '(555) 987-6543',
        linkedin: 'https://linkedin.com/in/johngamedesigner',
        portfolio: 'https://johngamedesigner.portfolio.com',
        experience: '5 years designing engaging game mechanics. Expert in level design, player progression systems, and narrative integration. Shipped 3 indie titles.',
        whyJoin: 'Your studio\'s focus on creativity and innovation excites me. I\'m eager to contribute my design expertise to your upcoming projects.'
    }),

    jobApplicationAcceptance: () => ({
        applicantName: 'Sarah Engineer',
        applicantEmail: 'sarah@example.com',
        jobTitle: 'Lead Programmer',
        customMessage: 'Welcome to the Final Boss Studios team! We\'re thrilled to have you on board. Your technical expertise and collaborative approach will be invaluable to our projects.'
    }),

    jobApplicationRejection: () => ({
        applicantName: 'Michael Creator',
        applicantEmail: 'michael@example.com',
        jobTitle: 'Art Director',
        customMessage: 'Thank you again for your interest. Your portfolio showed strong conceptual skills. We encourage you to stay connected and apply for future opportunities that align with your expertise.'
    }),

    newsletter: () => ({
        subject: 'Final Boss Studios - Q2 2026 Update',
        content: 'Hey there!\n\nWe\'re excited to share some updates from Final Boss Studios.\n\nRecently, we\'ve been working on some groundbreaking game mechanics that push the boundaries of what\'s possible. Our team has grown, and we\'re now hiring for key positions.\n\nStay tuned for announcements about our upcoming title reveal event this summer!\n\nBest regards,\nThe Final Boss Studios Team',
        recipientEmail: 'subscriber@example.com',
        recipientName: 'Newsletter Subscriber'
    }),

    newsletterSubscriber: () => ({
        email: 'newsubscriber@example.com',
        name: 'Alex Newsletter Subscriber'
    }),

    applicationResponse: {
        accepted: () => ({
            status: 'accepted' as const,
            applicantName: 'Emma Developer',
            applicantEmail: 'emma@example.com',
            jobTitle: 'Network Engineer'
        }),
        rejected: () => ({
            status: 'rejected' as const,
            applicantName: 'Chris Designer',
            applicantEmail: 'chris@example.com',
            jobTitle: 'UI/UX Designer'
        })
    }
};

// Individual test functions
export async function testContactConfirmationEmail(recipientEmail: string) {
    const data = testData.contactForm();
    return await sendContactConfirmationEmail({
        name: data.name,
        email: recipientEmail, // Override with test email
        message: data.message
    });
}

export async function testApplicationConfirmationEmail(recipientEmail: string) {
    const data = testData.applicationConfirmation();
    return await sendApplicationConfirmationEmail({
        ...data,
        applicantEmail: recipientEmail // Override with test email
    });
}

export async function testApplicationAdminNotificationEmail(recipientEmail: string) {
    const data = testData.applicationAdminNotification();
    return await sendApplicationAdminNotificationEmail({
        ...data,
        applicantEmail: recipientEmail // Override with test email
    });
}

export async function testNewsletterEmail(recipientEmail: string) {
    const data = testData.newsletter();
    return await sendNewsletterEmail({
        ...data,
        recipientEmail // Override with test email
    });
}

export async function testNewsletterAdminNotificationEmail(recipientEmail: string) {
    const data = testData.newsletterSubscriber();
    return await sendNewsletterAdminNotificationEmail({
        email: recipientEmail, // Override with test email
        name: data.name
    });
}

export async function testJobApplicationAcceptanceEmail(recipientEmail: string) {
    try {
        // Fetch actual Response Template from database
        const response = await fetch('/api/response-templates?type=acceptance');
        const data = await response.json();
        
        let customMessage = testData.jobApplicationAcceptance().customMessage; // fallback
        if (data.success && data.template) {
            customMessage = data.template.message;
        }
        
        return await sendJobApplicationAcceptanceEmail({
            applicantName: 'Sarah Engineer',
            applicantEmail: recipientEmail,
            jobTitle: 'Lead Programmer',
            customMessage
        });
    } catch (error) {
        console.error('Error fetching acceptance template:', error);
        // Fallback to test data if fetch fails
        const data = testData.jobApplicationAcceptance();
        return await sendJobApplicationAcceptanceEmail({
            ...data,
            applicantEmail: recipientEmail
        });
    }
}

export async function testJobApplicationRejectionEmail(recipientEmail: string) {
    try {
        // Fetch actual Response Template from database
        const response = await fetch('/api/response-templates?type=rejection');
        const data = await response.json();
        
        let customMessage = testData.jobApplicationRejection().customMessage; // fallback
        if (data.success && data.template) {
            customMessage = data.template.message;
        }
        
        return await sendJobApplicationRejectionEmail({
            applicantName: 'Michael Creator',
            applicantEmail: recipientEmail,
            jobTitle: 'Art Director',
            customMessage
        });
    } catch (error) {
        console.error('Error fetching rejection template:', error);
        // Fallback to test data if fetch fails
        const data = testData.jobApplicationRejection();
        return await sendJobApplicationRejectionEmail({
            ...data,
            applicantEmail: recipientEmail
        });
    }
}

export async function testApplicationResponseNotificationEmail(
    recipientEmail: string,
    status: 'accepted' | 'rejected' = 'accepted'
) {
    const data = status === 'accepted' 
        ? testData.applicationResponse.accepted()
        : testData.applicationResponse.rejected();
    
    return await sendApplicationResponseNotificationEmail({
        ...data,
        applicantEmail: recipientEmail // Override with test email
    });
}

// Batch test - send all email templates
export async function testAllEmailsAtOnce(recipientEmail: string) {
    const results: Record<string, any> = {};
    
    try {
        console.log(`\n🧪 Testing all email templates and sending to: ${recipientEmail}\n`);

        // Contact confirmation
        console.log('Sending: Contact Confirmation...');
        results.contactConfirmation = await testContactConfirmationEmail(recipientEmail);

        // Application confirmation
        console.log('Sending: Application Confirmation...');
        results.applicationConfirmation = await testApplicationConfirmationEmail(recipientEmail);

        // Application admin notification
        console.log('Sending: Application Admin Notification...');
        results.applicationAdminNotification = await testApplicationAdminNotificationEmail(recipientEmail);

        // Newsletter
        console.log('Sending: Newsletter...');
        results.newsletter = await testNewsletterEmail(recipientEmail);

        // Newsletter admin notification
        console.log('Sending: Newsletter Admin Notification...');
        results.newsletterAdminNotification = await testNewsletterAdminNotificationEmail(recipientEmail);

        // Job acceptance
        console.log('Sending: Job Application Acceptance...');
        results.jobApplicationAcceptance = await testJobApplicationAcceptanceEmail(recipientEmail);

        // Job rejection
        console.log('Sending: Job Application Rejection...');
        results.jobApplicationRejection = await testJobApplicationRejectionEmail(recipientEmail);

        // Application response - accepted
        console.log('Sending: Application Response (Accepted)...');
        results.applicationResponseAccepted = await testApplicationResponseNotificationEmail(recipientEmail, 'accepted');

        // Application response - rejected
        console.log('Sending: Application Response (Rejected)...');
        results.applicationResponseRejected = await testApplicationResponseNotificationEmail(recipientEmail, 'rejected');

        console.log('\n✅ All test emails sent successfully!\n');

        return {
            success: true,
            message: `All 9 email templates sent to ${recipientEmail}`,
            results
        };

    } catch (error) {
        console.error('\n❌ Error sending test emails:', error);
        return {
            success: false,
            error,
            results
        };
    }
}

// Selective batch test
export async function testSelectedEmails(
    recipientEmail: string,
    templates: Array<'contact' | 'applicationConfirmation' | 'applicationAdminNotification' | 'newsletter' | 'newsletterAdminNotification' | 'jobAcceptance' | 'jobRejection' | 'applicationResponseAccepted' | 'applicationResponseRejected'>
) {
    const results: Record<string, any> = {};
    const templateMap = {
        contact: () => testContactConfirmationEmail(recipientEmail),
        applicationConfirmation: () => testApplicationConfirmationEmail(recipientEmail),
        applicationAdminNotification: () => testApplicationAdminNotificationEmail(recipientEmail),
        newsletter: () => testNewsletterEmail(recipientEmail),
        newsletterAdminNotification: () => testNewsletterAdminNotificationEmail(recipientEmail),
        jobAcceptance: () => testJobApplicationAcceptanceEmail(recipientEmail),
        jobRejection: () => testJobApplicationRejectionEmail(recipientEmail),
        applicationResponseAccepted: () => testApplicationResponseNotificationEmail(recipientEmail, 'accepted'),
        applicationResponseRejected: () => testApplicationResponseNotificationEmail(recipientEmail, 'rejected')
    };

    try {
        console.log(`\n🧪 Testing ${templates.length} email template(s) and sending to: ${recipientEmail}\n`);

        for (const template of templates) {
            console.log(`Sending: ${template}...`);
            results[template] = await templateMap[template]();
        }

        console.log(`\n✅ ${templates.length} test email(s) sent successfully!\n`);

        return {
            success: true,
            message: `${templates.length} email template(s) sent to ${recipientEmail}`,
            results
        };

    } catch (error) {
        console.error('\n❌ Error sending test emails:', error);
        return {
            success: false,
            error,
            results
        };
    }
}
