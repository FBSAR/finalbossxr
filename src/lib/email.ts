/**
 * Email Module - Final Boss Studios
 * ===================================
 * Centralized email sending system with 8 production email templates.
 * All templates use light background (#ffffff) with dark text for universal mobile compatibility.
 * 
 * TESTING EMAILS
 * ==============
 * 
 * Option 1: Via API Endpoint
 * ---------------------------
 * Send all 9 test emails at once:
 *   GET /api/test-emails?email=your@email.com&template=all
 * 
 * Send a specific template:
 *   GET /api/test-emails?email=your@email.com&template=contact
 *   GET /api/test-emails?email=your@email.com&template=newsletter
 *   GET /api/test-emails?email=your@email.com&template=jobAcceptance
 * 
 * Send multiple templates:
 *   GET /api/test-emails?email=your@email.com&templates=contact,newsletter,jobAcceptance
 * 
 * Available templates:
 *   - contact                        (Contact form confirmation)
 *   - applicationConfirmation        (Job application confirmation to applicant)
 *   - applicationAdminNotification   (Admin notification of new application)
 *   - newsletter                     (Newsletter email)
 *   - newsletterAdminNotification    (Newsletter subscriber notification to admin)
 *   - jobAcceptance                  (Job acceptance email)
 *   - jobRejection                   (Job rejection email)
 *   - applicationResponseAccepted    (Admin: accepted response sent)
 *   - applicationResponseRejected    (Admin: rejected response sent)
 * 
 * Option 2: From Code
 * -------------------
 * import { testAllEmailsAtOnce, testSelectedEmails } from '$lib/email-test';
 * 
 * Send all templates:
 *   await testAllEmailsAtOnce('your@email.com');
 * 
 * Send specific templates:
 *   await testSelectedEmails('your@email.com', ['contact', 'newsletter']);
 * 
 * Option 3: Add to Admin Dashboard
 * ---------------------------------
 * Create a test email form with email input and template selection.
 * POST to /api/test-emails with: { email, template }
 * See src/routes/api/test-emails/+server.ts for full API docs.
 * 
 * DESIGN NOTES
 * ============
 * - All emails use white/light backgrounds to ensure mobile readability
 * - Header is dark purple (#2d0a5e) with green accent (#00ff00)
 * - Content uses dark text (#1d1d1f) on white (#ffffff)
 * - bgcolor HTML attributes + inline styles ensure compatibility across all email clients
 * - NO CSS color rules (stripped by Gmail on Android)
 * - NO rgba() colors (overridden by email client forced dark modes)
 * - Only solid hex colors on bgcolor attributes and inline styles
 * 
 * EMAIL TEMPLATES
 * ===============
 * 1. sendContactConfirmationEmail     - User receives confirmation of contact form
 * 2. sendApplicationConfirmationEmail - Applicant receives confirmation of job application
 * 3. sendApplicationAdminNotificationEmail - Admin receives new application alert
 * 4. sendNewsletterEmail              - Newsletter recipient receives newsletter content
 * 5. sendNewsletterAdminNotificationEmail - Admin receives newsletter subscriber alert
 * 6. sendJobApplicationAcceptanceEmail - Applicant receives job offer
 * 7. sendJobApplicationRejectionEmail - Applicant receives rejection
 * 8. sendApplicationResponseNotificationEmail - Admin notification of response sent
 */

import nodemailer from 'nodemailer';
import { EMAIL_SERVER, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD, ADMIN_EMAIL_01, ADMIN_EMAIL_02 } from '$env/static/private';

// Create reusable transporter using SMTP
const transporter = nodemailer.createTransport({
    host: EMAIL_SERVER,
    port: parseInt(EMAIL_PORT),
    secure: parseInt(EMAIL_PORT) === 465, // true for 465, false for 587
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
});

// Shared email styles - minimal resets only; all design uses inline styles + bgcolor attributes
const getEmailStyles = () => `
<style>
    /* Email client resets */
    body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; margin: 0; padding: 0; }
    img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    table { border-collapse: collapse !important; }
    /* Prevent iOS auto-linking phone numbers/addresses */
    a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; }
    /* Prevent Gmail on Android from overriding link colors */
    u + #body a { color: inherit; text-decoration: none; }
</style>
`;

/**
 * Fetches response templates from the database.
 * Used by email functions to get customizable acceptance/rejection messages.
 */
export async function getResponseTemplates() {
    try {
        const response = await fetch('/api/response-templates?all=true');
        const data = await response.json();
        
        if (data.success && data.templates) {
            const templates: Record<string, any> = {};
            for (const template of data.templates) {
                templates[template.template_type] = template;
            }
            return templates;
        }
        return null;
    } catch (error) {
        console.error('Error fetching response templates:', error);
        return null;
    }
}

interface ApplicationEmailData {
    applicantName: string;
    applicantEmail: string;
    jobTitle: string;
    phone?: string | null;
    linkedin?: string | null;
    portfolio?: string | null;
    experience: string;
    whyJoin: string;
    resumeFilename?: string;
    resumeBuffer?: Buffer;
}

interface ContactEmailData {
    name: string;
    email: string;
    message: string;
}

export async function sendContactConfirmationEmail(data: ContactEmailData) {
    const { name, email, message } = data;
    
    const firstName = name.split(' ')[0];
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thanks for Contacting Us</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Thanks for Reaching Out! 📬</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #1d1d1f; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Hi ${firstName},</p>
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Thank you for contacting <strong style="color: #1d1d1f;">Final Boss Studios</strong>! We've received your message and appreciate you taking the time to reach out.
                            </p>
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Our team will review your message and get back to you as soon as possible, typically within <strong style="color: #1d1d1f;">24-48 hours</strong>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message Summary: Light Grey Card -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 8px 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f7" style="background-color: #f5f5f7; border-radius: 8px; border: 1px solid #e0e0e6;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <h2 style="color: #007a00; font-size: 17px; margin: 0 0 16px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Your Message</h2>
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Name</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${name}</p>
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Email</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${email}</p>
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Message</p>
                                        <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${message}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                In the meantime, explore our work at <a href="https://finalbossxr.com" style="color: #007a00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
Hi ${firstName},

Thank you for contacting Final Boss Studios! We've received your message and appreciate you taking the time to reach out.

Our team will review your message and get back to you as soon as possible, typically within 24-48 hours.

YOUR MESSAGE
------------------------
Name: ${name}
Email: ${email}

Message:
${message}

------------------------

In the meantime, feel free to explore our work at finalbossxr.com

Best regards,
The Final Boss Studios Team

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: email,
            subject: `Thanks for Contacting Final Boss Studios!`,
            text: textContent,
            html: htmlContent
        });

        console.log('Contact confirmation email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending contact confirmation email:', error);
        return { success: false, error };
    }
}

export async function sendApplicationConfirmationEmail(data: ApplicationEmailData) {
    const { applicantName, applicantEmail, jobTitle, phone, linkedin, portfolio, experience, whyJoin } = data;
    
    const firstName = applicantName.split(' ')[0];
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Confirmation</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Application Received! 🎮</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #1d1d1f; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Hi ${firstName},</p>
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Thank you for applying for the <strong style="color: #007a00;">${jobTitle}</strong> position at <strong style="color: #1d1d1f;">Final Boss Studios</strong>! We're excited to review your application.
                            </p>
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Our team will carefully review your application and get back to you within <strong style="color: #1d1d1f;">5-7 business days</strong>. In the meantime, feel free to explore more about us at <a href="https://finalbossxr.com" style="color: #007a00; text-decoration: none;">finalbossxr.com</a>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Application Summary: Light Grey Card -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 8px 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f7" style="background-color: #f5f5f7; border-radius: 8px; border: 1px solid #e0e0e6;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <h2 style="color: #007a00; font-size: 17px; margin: 0 0 16px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Your Application Summary</h2>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Position</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${jobTitle}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Name</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${applicantName}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Email</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${applicantEmail}</p>
                                        
                                        ${phone ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Phone</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${phone}</p>
                                        ` : ''}
                                        
                                        ${linkedin ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">LinkedIn</p>
                                        <p style="margin: 0 0 14px; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><a href="${linkedin}" style="color: #007a00; font-size: 15px; text-decoration: none;">${linkedin}</a></p>
                                        ` : ''}
                                        
                                        ${portfolio ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Portfolio</p>
                                        <p style="margin: 0 0 14px; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><a href="${portfolio}" style="color: #007a00; font-size: 15px; text-decoration: none;">${portfolio}</a></p>
                                        ` : ''}
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Your Experience</p>
                                        <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0 0 14px; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${experience}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Why You Want to Join</p>
                                        <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${whyJoin}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Questions? Reach out at <a href="mailto:eddie@finalbossxr.com" style="color: #007a00; text-decoration: none;">eddie@finalbossxr.com</a>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
Hi ${firstName},

Thank you for applying for the ${jobTitle} position at Final Boss Studios! We're excited to review your application.

Our team will carefully review your application and get back to you within 5-7 business days.

YOUR APPLICATION SUMMARY
------------------------
Position: ${jobTitle}
Name: ${applicantName}
Email: ${applicantEmail}
${phone ? `Phone: ${phone}` : ''}
${linkedin ? `LinkedIn: ${linkedin}` : ''}
${portfolio ? `Portfolio: ${portfolio}` : ''}

Your Experience:
${experience}

Why You Want to Join:
${whyJoin}

------------------------

If you have any questions, feel free to reach out to us at eddie@finalbossxr.com

Best regards,
The Final Boss Studios Team

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const mailOptions: any = {
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: applicantEmail,
            subject: `Application Received - ${jobTitle} at Final Boss Studios`,
            text: textContent,
            html: htmlContent
        };

        // Add resume attachment if provided
        if (data.resumeBuffer && data.resumeFilename) {
            mailOptions.attachments = [
                {
                    filename: data.resumeFilename,
                    content: data.resumeBuffer
                }
            ];
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('Confirmation email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return { success: false, error };
    }
}

export async function sendApplicationAdminNotificationEmail(data: ApplicationEmailData & { applicationId?: number; jobId?: number }) {
    const { applicantName, applicantEmail, jobTitle, phone, linkedin, portfolio, experience, whyJoin, applicationId } = data;
    
    const adminEmails = [ADMIN_EMAIL_01, ADMIN_EMAIL_02].filter(email => email); // Filter out any undefined emails
    
    if (adminEmails.length === 0) {
        console.warn('No admin emails configured for job application notifications');
        return { success: false, error: 'No admin emails configured' };
    }
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Application</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🚀 New Job Application!</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                A new applicant has submitted an application for the <strong style="color: #007a00;">${jobTitle}</strong> position.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Applicant Info Card -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 8px 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f7" style="background-color: #f5f5f7; border-radius: 8px; border: 1px solid #e0e0e6;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <h2 style="color: #007a00; font-size: 17px; margin: 0 0 16px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Applicant Information</h2>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Name</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${applicantName}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Email</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${applicantEmail}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Position</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${jobTitle}</p>
                                        
                                        ${phone ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Phone</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${phone}</p>
                                        ` : ''}
                                        
                                        ${linkedin ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">LinkedIn</p>
                                        <p style="margin: 0 0 14px; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><a href="${linkedin}" style="color: #007a00; font-size: 15px; text-decoration: none;">${linkedin}</a></p>
                                        ` : ''}
                                        
                                        ${portfolio ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Portfolio</p>
                                        <p style="margin: 0 0 14px; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;"><a href="${portfolio}" style="color: #007a00; font-size: 15px; text-decoration: none;">${portfolio}</a></p>
                                        ` : ''}
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Experience</p>
                                        <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0 0 14px; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${experience}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 6px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Why They Want to Join</p>
                                        <p style="color: #444444; font-size: 14px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${whyJoin}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="background-color: #ffffff; padding: 0 40px 32px;">
                            <a href="https://finalbossxr.com/admin/dashboard" style="display: inline-block; background-color: #2d0a5e; color: #00ff00; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">View Application in Dashboard</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. Admin notification system.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
NEW JOB APPLICATION NOTIFICATION
================================

Applicant: ${applicantName}
Email: ${applicantEmail}
Position: ${jobTitle}
${phone ? `Phone: ${phone}` : ''}
${linkedin ? `LinkedIn: ${linkedin}` : ''}
${portfolio ? `Portfolio: ${portfolio}` : ''}

EXPERIENCE:
${experience}

WHY THEY WANT TO JOIN:
${whyJoin}

================================

Visit the admin dashboard to review this application.

© ${new Date().getFullYear()} Final Boss Studios.
    `;

    try {
        const mailOptions: any = {
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: adminEmails.join(', '),
            subject: `New Application: ${applicantName} for ${jobTitle}`,
            text: textContent,
            html: htmlContent
        };

        // Add resume attachment if provided
        if (data.resumeBuffer && data.resumeFilename) {
            mailOptions.attachments = [
                {
                    filename: data.resumeFilename,
                    content: data.resumeBuffer
                }
            ];
        }

        const info = await transporter.sendMail(mailOptions);

        console.log('Admin notification email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending admin notification email:', error);
        return { success: false, error };
    }
}

// Newsletter email interface
interface NewsletterEmailData {
    subject: string;
    content: string;
    recipientEmail: string;
    recipientName?: string;
}

export async function sendNewsletterEmail(data: NewsletterEmailData) {
    const { subject, content, recipientEmail, recipientName } = data;
    
    const greeting = recipientName ? `Hi ${recipientName.split(' ')[0]}` : 'Hi there';
    
    // Convert line breaks to HTML paragraphs
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 24px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${subject}</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #1d1d1f; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${greeting},</p>
                            <div style="color: #444444; font-size: 16px; line-height: 1.8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                ${content.split('\n').map(p => p.trim() ? `<p style="margin: 0 0 16px; color: #444444; font-size: 16px; line-height: 1.8; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${p}</p>` : '').join('')}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="background-color: #ffffff; padding: 0 40px 32px;">
                            <a href="https://finalbossxr.com" style="display: inline-block; background-color: #2d0a5e; color: #00ff00; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Visit Our Website</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                You're receiving this because you subscribed to our newsletter. <a href="https://finalbossxr.com" style="color: #007a00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p style="color: #999999; font-size: 13px; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                <a href="https://finalbossxr.com/newsletter/unsubscribe" style="color: #999999; text-decoration: underline;">Unsubscribe</a> from this mailing list
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
${greeting},

${content}

------------------------

Visit us at finalbossxr.com

You're receiving this because you subscribed to our newsletter.
Unsubscribe: https://finalbossxr.com/newsletter/unsubscribe

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: recipientEmail,
            subject: subject,
            text: textContent,
            html: htmlContent
        });

        console.log('Newsletter email sent successfully to:', recipientEmail, info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending newsletter email to:', recipientEmail, error);
        return { success: false, error };
    }
}

export async function sendNewsletterAdminNotificationEmail(data: { email: string; name?: string | null }) {
    const { email, name } = data;
    
    const adminEmails = [ADMIN_EMAIL_01, ADMIN_EMAIL_02].filter(email => email);
    
    if (adminEmails.length === 0) {
        console.warn('No admin emails configured for newsletter notifications');
        return { success: false, error: 'No admin emails configured' };
    }

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Newsletter Subscription</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">📧 New Newsletter Subscriber</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                A new user has subscribed to your newsletter!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Subscriber Info Card -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 8px 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f7" style="background-color: #f5f5f7; border-radius: 8px; border: 1px solid #e0e0e6;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <h2 style="color: #007a00; font-size: 17px; margin: 0 0 16px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Subscriber Information</h2>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Email</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${email}</p>
                                        
                                        ${name ? `
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Name</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${name}</p>
                                        ` : ''}
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Subscribed</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0; font-weight: 500; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${new Date().toLocaleString()}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                View all subscribers in your <a href="https://finalbossxr.com/admin/dashboard" style="color: #007a00; text-decoration: none;">admin dashboard</a>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
New Newsletter Subscriber

Email: ${email}
${name ? `Name: ${name}` : ''}
Subscribed: ${new Date().toLocaleString()}

---

View all subscribers in your admin dashboard:
https://finalbossxr.com/admin/dashboard

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: adminEmails.join(', '),
            subject: `New Newsletter Subscriber: ${name || email}`,
            text: textContent,
            html: htmlContent
        });

        console.log('Newsletter subscription notification sent to admins:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending newsletter subscription notification:', error);
        return { success: false, error };
    }
}

export async function sendJobApplicationAcceptanceEmail(data: { applicantName: string; applicantEmail: string; jobTitle: string; customMessage: string }) {
    const { applicantName, applicantEmail, jobTitle, customMessage } = data;
    
    const firstName = applicantName.split(' ')[0];
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Congratulations - You're Accepted!</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">🎉 Congratulations!</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #1d1d1f; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Hi ${firstName},</p>
                            <div style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                ${customMessage.split('\n').map(p => p.trim() ? `<p style="margin: 0 0 12px; color: #444444; font-size: 16px; line-height: 1.6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${p}</p>` : '').join('')}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="background-color: #ffffff; padding: 0 40px 32px;">
                            <a href="https://finalbossxr.com" style="display: inline-block; background-color: #2d0a5e; color: #00ff00; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Visit Our Website</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                We look forward to working with you! <a href="https://finalbossxr.com" style="color: #007a00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
Hi ${firstName},

${customMessage}

---

We look forward to working with you!
Visit us at finalbossxr.com

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: applicantEmail,
            subject: `Congratulations! Your Application for ${jobTitle} has been Accepted`,
            text: textContent,
            html: htmlContent
        });

        console.log('Job application acceptance email sent to:', applicantEmail, info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending job application acceptance email to:', applicantEmail, error);
        return { success: false, error };
    }
}

export async function sendJobApplicationRejectionEmail(data: { applicantName: string; applicantEmail: string; jobTitle: string; customMessage: string }) {
    const { applicantName, applicantEmail, jobTitle, customMessage } = data;
    
    const firstName = applicantName.split(' ')[0];
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Status Update</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Application Status</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #1d1d1f; font-size: 16px; line-height: 1.6; margin: 0 0 16px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Hi ${firstName},</p>
                            <div style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                ${customMessage.split('\n').map(p => p.trim() ? `<p style="margin: 0 0 12px; color: #444444; font-size: 16px; line-height: 1.6; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${p}</p>` : '').join('')}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td bgcolor="#ffffff" align="center" style="background-color: #ffffff; padding: 0 40px 32px;">
                            <a href="https://finalbossxr.com" style="display: inline-block; background-color: #2d0a5e; color: #00ff00; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Visit Our Website</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                Best of luck in your future endeavors! <a href="https://finalbossxr.com" style="color: #007a00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
Hi ${firstName},

${customMessage}

Best of luck in your future endeavors!
Visit us at finalbossxr.com

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: applicantEmail,
            subject: `Application Status - ${jobTitle} Position`,
            text: textContent,
            html: htmlContent
        });

        console.log('Job application rejection email sent to:', applicantEmail, info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending job application rejection email to:', applicantEmail, error);
        return { success: false, error };
    }
}

export async function sendApplicationResponseNotificationEmail(data: { status: 'accepted' | 'rejected'; applicantName: string; applicantEmail: string; jobTitle: string }) {
    const { status, applicantName, applicantEmail, jobTitle } = data;
    
    const adminEmails = [ADMIN_EMAIL_01, ADMIN_EMAIL_02].filter(email => email);
    
    if (adminEmails.length === 0) {
        console.warn('No admin emails configured for application response notifications');
        return { success: false, error: 'No admin emails configured' };
    }

    const statusLabel = status === 'accepted' ? 'ACCEPTED' : 'REJECTED';
    const statusColor = status === 'accepted' ? '#00ff00' : '#ff6b6b';
    const statusEmoji = status === 'accepted' ? '✅' : '❌';
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Response Sent</title>
    ${getEmailStyles()}
</head>
<body id="body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f0f0f4;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f0f0f4" style="background-color: #f0f0f4;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="border-radius: 12px; overflow: hidden; border: 1px solid #dddde6;">
                    
                    <!-- Header: Dark Purple Branding -->
                    <tr>
                        <td align="center" bgcolor="#2d0a5e" style="background-color: #2d0a5e; padding: 36px 40px 28px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block; margin: 0 auto 16px;">
                            <h1 style="color: #00ff00; font-size: 26px; margin: 0; font-weight: 700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${statusEmoji} Application Response Sent</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content: White Background -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 32px 40px 24px;">
                            <p style="color: #444444; font-size: 16px; line-height: 1.6; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                You have sent an application response to a candidate.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Response Details Card -->
                    <tr>
                        <td bgcolor="#ffffff" style="background-color: #ffffff; padding: 8px 40px 32px;">
                            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" bgcolor="#f5f5f7" style="background-color: #f5f5f7; border-radius: 8px; border: 1px solid #e0e0e6;">
                                <tr>
                                    <td style="padding: 20px 24px;">
                                        <h2 style="color: #007a00; font-size: 17px; margin: 0 0 16px; font-weight: 600; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Response Details</h2>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Status</p>
                                        <p style="color: ${statusColor}; font-size: 15px; margin: 0 0 14px; font-weight: 600; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${statusLabel}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Applicant Name</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${applicantName}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Email</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0 0 14px; font-weight: 500; border-bottom: 1px solid #e0e0e6; padding-bottom: 14px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${applicantEmail}</p>
                                        
                                        <p style="color: #666666; font-size: 12px; margin: 0 0 3px; text-transform: uppercase; letter-spacing: 0.5px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">Position</p>
                                        <p style="color: #1d1d1f; font-size: 15px; margin: 0; font-weight: 500; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">${jobTitle}</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td bgcolor="#f5f5f7" style="background-color: #f5f5f7; padding: 24px 40px; text-align: center; border-top: 1px solid #e0e0e6;">
                            <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 8px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                View all applications in your <a href="https://finalbossxr.com/admin/dashboard" style="color: #007a00; text-decoration: none;">admin dashboard</a>
                            </p>
                            <p style="color: #999999; font-size: 12px; margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                                © ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    const textContent = `
Application Response Sent

You have sent an application response to a candidate.

---

Response Details:

Status: ${statusLabel}
Applicant Name: ${applicantName}
Email: ${applicantEmail}
Position: ${jobTitle}

---

View all applications in your admin dashboard:
https://finalbossxr.com/admin/dashboard

© ${new Date().getFullYear()} Final Boss Studios. All rights reserved.
    `;

    try {
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: adminEmails.join(', '),
            subject: `[${statusLabel}] Application Response Sent - ${applicantName} - ${jobTitle}`,
            text: textContent,
            html: htmlContent
        });

        console.log('Application response notification sent to admins:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending application response notification:', error);
        return { success: false, error };
    }
}
