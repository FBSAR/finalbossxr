import nodemailer from 'nodemailer';
import { EMAIL_SERVER, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } from '$env/static/private';

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

interface ApplicationEmailData {
    applicantName: string;
    applicantEmail: string;
    jobTitle: string;
    phone?: string | null;
    linkedin?: string | null;
    portfolio?: string | null;
    experience: string;
    whyJoin: string;
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
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #1b023d;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #1b023d;">
        <tr>
            <td align="center" style="padding: 40px 20px;">
                <table role="presentation" width="600" cellspacing="0" cellpadding="0" style="background: linear-gradient(180deg, #2d0a5e 0%, #1b023d 100%); border-radius: 16px; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="padding: 40px 40px 20px;">
                            <img src="https://finalbossxr.s3.us-east-1.amazonaws.com/logos/F_Logo_White.png" alt="Final Boss Studios" width="60" style="display: block;">
                            <h1 style="color: #00ff00; font-size: 28px; margin: 20px 0 10px; font-weight: 700;">Application Received! 🎮</h1>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 20px 40px;">
                            <p style="color: #ffffff; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Hi ${firstName},
                            </p>
                            <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                                Thank you for applying for the <strong style="color: #00ff00;">${jobTitle}</strong> position at Final Boss Studios! We're excited to review your application.
                            </p>
                            <p style="color: rgba(255, 255, 255, 0.8); font-size: 16px; line-height: 1.6; margin: 0 0 30px;">
                                Our team will carefully review your application and get back to you within <strong style="color: #ffffff;">5-7 business days</strong>. In the meantime, feel free to explore more about us at <a href="https://finalbossxr.com" style="color: #00ff00; text-decoration: none;">finalbossxr.com</a>.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Application Summary -->
                    <tr>
                        <td style="padding: 0 40px 30px;">
                            <div style="background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 24px;">
                                <h2 style="color: #00ff00; font-size: 18px; margin: 0 0 20px; font-weight: 600;">Your Application Summary</h2>
                                
                                <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Position</span><br>
                                            <span style="color: #ffffff; font-size: 15px;">${jobTitle}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Name</span><br>
                                            <span style="color: #ffffff; font-size: 15px;">${applicantName}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Email</span><br>
                                            <span style="color: #ffffff; font-size: 15px;">${applicantEmail}</span>
                                        </td>
                                    </tr>
                                    ${phone ? `
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Phone</span><br>
                                            <span style="color: #ffffff; font-size: 15px;">${phone}</span>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${linkedin ? `
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">LinkedIn</span><br>
                                            <a href="${linkedin}" style="color: #00ff00; font-size: 15px; text-decoration: none;">${linkedin}</a>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    ${portfolio ? `
                                    <tr>
                                        <td style="padding: 8px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Portfolio</span><br>
                                            <a href="${portfolio}" style="color: #00ff00; font-size: 15px; text-decoration: none;">${portfolio}</a>
                                        </td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Your Experience</span><br>
                                            <span style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${experience}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0;">
                                            <span style="color: rgba(255, 255, 255, 0.6); font-size: 14px;">Why You Want to Join</span><br>
                                            <span style="color: rgba(255, 255, 255, 0.9); font-size: 14px; line-height: 1.5; display: block; margin-top: 8px;">${whyJoin}</span>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px 40px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                            <p style="color: rgba(255, 255, 255, 0.6); font-size: 14px; line-height: 1.6; margin: 0 0 15px; text-align: center;">
                                If you have any questions, feel free to reach out to us at<br>
                                <a href="mailto:eddie@finalbossxr.com" style="color: #00ff00; text-decoration: none;">eddie@finalbossxr.com</a>
                            </p>
                            <p style="color: rgba(255, 255, 255, 0.4); font-size: 12px; margin: 20px 0 0; text-align: center;">
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
        const info = await transporter.sendMail({
            from: `"Final Boss Studios" <${EMAIL_USERNAME}>`,
            to: applicantEmail,
            subject: `Application Received - ${jobTitle} at Final Boss Studios`,
            text: textContent,
            html: htmlContent
        });

        console.log('Confirmation email sent successfully:', info.messageId);
        return { success: true, messageId: info.messageId };
        
    } catch (error) {
        console.error('Error sending confirmation email:', error);
        return { success: false, error };
    }
}
