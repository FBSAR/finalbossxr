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

// Shared email styles that support light/dark mode
const getEmailStyles = () => `
<style>
    /* Default (Dark mode) */
    :root {
        color-scheme: light dark;
    }
    
    .email-body {
        background-color: #1b023d !important;
    }
    .email-container {
        background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%) !important;
    }
    .text-primary { color: #ffffff !important; }
    .text-secondary { color: rgba(255, 255, 255, 0.8) !important; }
    .text-muted { color: rgba(255, 255, 255, 0.6) !important; }
    .text-accent { color: #00ff00 !important; }
    .summary-box {
        background: rgba(255, 255, 255, 0.05) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;
    }
    .border-subtle { border-color: rgba(255, 255, 255, 0.1) !important; }
    
    /* Light mode overrides */
    @media (prefers-color-scheme: light) {
        .email-body {
            background-color: #f5f5f7 !important;
        }
        .email-container {
            background: linear-gradient(180deg, #ffffff 0%, #f0f0f2 100%) !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
        }
        .text-primary { color: #1d1d1f !important; }
        .text-secondary { color: #515154 !important; }
        .text-muted { color: #86868b !important; }
        .text-accent { color: #007a00 !important; }
        .summary-box {
            background: rgba(0, 0, 0, 0.03) !important;
            border: 1px solid rgba(0, 0, 0, 0.1) !important;
        }
        .border-subtle { border-color: rgba(0, 0, 0, 0.1) !important; }
        .logo-dark { display: none !important; }
        .logo-light { display: block !important; }
    }
    
    @media (prefers-color-scheme: dark) {
        .logo-dark { display: block !important; }
        .logo-light { display: none !important; }
    }
</style>
`;

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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Thanks for Contacting Us</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">Thanks for Reaching Out! 📬</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-primary" style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Hi ${firstName},
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Thank you for contacting <strong class="text-accent" style="color: #00ff00;">Final Boss Studios</strong>! We've received your message and appreciate you taking the time to reach out.
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Our team will review your message and get back to you as soon as possible, typically within <strong class="text-primary" style="color: #ffffff;">24-48 hours</strong>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Message Summary -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Your Message</h2>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Name</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${name}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Email</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${email}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Message</span><br>
                                            <span class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${message}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                In the meantime, feel free to explore our work at<br>
                                <a href="https://finalbossxr.com" class="text-accent" style="color: #00ff00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Application Confirmation</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">Application Received! 🎮</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-primary" style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Hi ${firstName},
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Thank you for applying for the <strong class="text-accent" style="color: #00ff00;">${jobTitle}</strong> position at Final Boss Studios! We're excited to review your application.
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Our team will carefully review your application and get back to you within <strong class="text-primary" style="color: #ffffff;">5-7 business days</strong>. In the meantime, feel free to explore more about us at <a href="https://finalbossxr.com" class="text-accent" style="color: #00ff00; text-decoration: none;">finalbossxr.com</a>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Application Summary -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Your Application Summary</h2>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Position</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${jobTitle}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Name</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${applicantName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Email</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${applicantEmail}</span>
                                        </td>
                                    </tr>
                                    ${phone ? `
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Phone</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${phone}</span>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${linkedin ? `
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">LinkedIn</span><br>
                                            <a href="${linkedin}" class="text-accent" style="color: #00ff00; font-size: 15px; text-decoration: none;">${linkedin}</a>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${portfolio ? `
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Portfolio</span><br>
                                            <a href="${portfolio}" class="text-accent" style="color: #00ff00; font-size: 15px; text-decoration: none;">${portfolio}</a>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td class="border-subtle" style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Your Experience</span><br>
                                            <span class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${experience}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Why You Want to Join</span><br>
                                            <span class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${whyJoin}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                If you have any questions, feel free to reach out to us at<br>
                                <a href="mailto:eddie@finalbossxr.com" class="text-accent" style="color: #00ff00; text-decoration: none;">eddie@finalbossxr.com</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>New Job Application</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">🚀 New Job Application!</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                A new applicant has submitted an application for the <strong class="text-accent" style="color: #00ff00;">${jobTitle}</strong> position.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Applicant Details -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Applicant Information</h2>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Name</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${applicantName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Email</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${applicantEmail}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Position</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${jobTitle}</span>
                                        </td>
                                    </tr>
                                    ${phone ? `
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Phone</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${phone}</span>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${linkedin ? `
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">LinkedIn</span><br>
                                            <a href="${linkedin}" class="text-accent" style="color: #00ff00; font-size: 15px; text-decoration: none;">${linkedin}</a>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${portfolio ? `
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Portfolio</span><br>
                                            <a href="${portfolio}" class="text-accent" style="color: #00ff00; font-size: 15px; text-decoration: none;">${portfolio}</a>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td class="border-subtle" style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Experience</span><br>
                                            <span class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${experience}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Why They Want to Join</span><br>
                                            <span class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${whyJoin}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA -->
                    <tr>
                        <td align="center" style="padding: 20px 40px 30px;">
                            <a href="https://finalbossxr.com/admin/dashboard" style="display: inline-block; background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">View Application in Dashboard</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 0; text-align: center;">
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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${subject}</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 24px; margin: 20px 0 10px; font-weight: 700;">${subject}</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-primary" style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                ${greeting},
                            </p>
                            <div class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.8;">
                                ${content.split('\n').map(p => p.trim() ? `<p style="margin: 0 0 16px;">${p}</p>` : '').join('')}
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px;">
                            <a href="https://finalbossxr.com" style="display: inline-block; background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">Visit Our Website</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                You're receiving this because you subscribed to our newsletter.<br>
                                <a href="https://finalbossxr.com" class="text-accent" style="color: #00ff00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>New Newsletter Subscription</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">📧 New Newsletter Subscriber</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                A new user has subscribed to your newsletter!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Subscriber Details -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Subscriber Information</h2>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Email</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${email}</span>
                                        </td>
                                    </tr>
                                    ${name ? `
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Name</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${name}</span>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Subscribed</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${new Date().toLocaleString()}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                View all subscribers in your <a href="https://finalbossxr.com/admin/dashboard" class="text-accent" style="color: #00ff00; text-decoration: none;">admin dashboard</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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

export async function sendJobApplicationAcceptanceEmail(data: { applicantName: string; applicantEmail: string; jobTitle: string; customMessage: string; nextSteps: string }) {
    const { applicantName, applicantEmail, jobTitle, customMessage, nextSteps } = data;
    
    const firstName = applicantName.split(' ')[0];
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Congratulations - You're Accepted!</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">🎉 Congratulations!</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-primary" style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Hi ${firstName},
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                We're thrilled to inform you that you've been selected for the <strong class="text-accent" style="color: #00ff00;">${jobTitle}</strong> position at <strong class="text-accent" style="color: #00ff00;">Final Boss Studios</strong>!
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Your skills and experience impressed our team, and we can't wait to have you join us.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Admin Message -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 15px; font-weight: 600;">Message from Our Team</h2>
                                <p class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-line;">${customMessage}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Next Steps -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(0, 255, 0, 0.05); border: 1px solid rgba(0, 255, 0, 0.2); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 15px; font-weight: 600;">🚀 Next Steps</h2>
                                <p class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-line;">${nextSteps}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px;">
                            <a href="https://finalbossxr.com" style="display: inline-block; background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">Visit Our Website</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                We look forward to working with you!<br>
                                <a href="https://finalbossxr.com" class="text-accent" style="color: #00ff00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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

We're thrilled to inform you that you've been selected for the ${jobTitle} position at Final Boss Studios!

Your skills and experience impressed our team, and we can't wait to have you join us.

---

Message from Our Team:

${customMessage}

---

Next Steps:

${nextSteps}

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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Application Status Update</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">Application Status</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-primary" style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Hi ${firstName},
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Thank you for your interest in the <strong class="text-accent" style="color: #00ff00;">${jobTitle}</strong> position at <strong class="text-accent" style="color: #00ff00;">Final Boss Studios</strong>. We appreciate the time and effort you invested in your application.
                            </p>
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                We've reviewed all applications carefully, and while we were impressed with your qualifications, we've decided to move forward with other candidates at this time.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Admin Message -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 15px; font-weight: 600;">Message from Our Team</h2>
                                <p class="text-secondary" style="color: rgba(255, 255, 255, 0.9); font-size: 16px; line-height: 1.6; margin: 0; white-space: pre-line;">${customMessage}</p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Encouragement -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0;">
                                We encourage you to stay updated with our open positions, and we hope our paths may cross again in the future. We wish you the best of luck in your career!
                            </p>
                        </td>
                    </tr>
                    
                    <!-- CTA Button -->
                    <tr>
                        <td align="center" style="padding: 10px 40px 30px;">
                            <a href="https://finalbossxr.com" style="display: inline-block; background: linear-gradient(135deg, #00ff00 0%, #00cc00 100%); color: #000000; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px;">Visit Our Website</a>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                Best of luck in your future endeavors!<br>
                                <a href="https://finalbossxr.com" class="text-accent" style="color: #00ff00; text-decoration: none;">finalbossxr.com</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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

Thank you for your interest in the ${jobTitle} position at Final Boss Studios. We appreciate the time and effort you invested in your application.

We've reviewed all applications carefully, and while we were impressed with your qualifications, we've decided to move forward with other candidates at this time.

---

Message from Our Team:

${customMessage}

---

We encourage you to stay updated with our open positions, and we hope our paths may cross again in the future. We wish you the best of luck in your career!

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
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>Application Response Sent</title>
    ${getEmailStyles()}
</head>
<body class="email-body" style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-body" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" class="email-container" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/FBS_Logo_Initial_Final_NoBG.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 class="text-accent" style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">${statusEmoji} Application Response Sent</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p class="text-secondary" style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                You have sent an application response to a candidate.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Response Details -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div class="summary-box" style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 class="text-accent" style="color: #00ff00; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Response Details</h2>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Status</span><br>
                                            <span style="color: ${statusColor}; font-size: 15px; font-weight: 600;">${statusLabel}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Applicant Name</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${applicantName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="border-subtle" style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Email</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${applicantEmail}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0;">
                                            <span class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Position</span><br>
                                            <span class="text-primary" style="color: #ffffff; font-size: 15px;">${jobTitle}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td class="border-subtle" style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                View all applications in your <a href="https://finalbossxr.com/admin/dashboard" class="text-accent" style="color: #00ff00; text-decoration: none;">admin dashboard</a>
                            </p>
                            <p class="text-muted" style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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
