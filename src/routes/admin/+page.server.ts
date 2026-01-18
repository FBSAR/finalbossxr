import { getDb } from '$lib/db';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import nodemailer from 'nodemailer';
import { EMAIL_SERVER, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } from '$env/static/private';

// Allowed admin emails
const ALLOWED_ADMINS = ['eddie@finalbossxr.com', 'keith@finalbossxr.com'];

// In-memory store for login codes (in production, use Redis or DB)
const loginCodes = new Map<string, { code: string; expires: number }>();

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_SERVER,
  port: parseInt(EMAIL_PORT),
  secure: parseInt(EMAIL_PORT) === 465,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD
  }
});

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendLoginCode(email: string, code: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"FinalBoss XR Admin" <${EMAIL_USERNAME}>`,
      to: email,
      subject: 'Your Admin Login Code',
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 400px; margin: 0 auto; padding: 40px 20px; background: #0a0a0f; color: #fff;">
          <h2 style="margin: 0 0 20px; font-size: 20px;">🔐 Admin Login</h2>
          <p style="color: #888; margin: 0 0 20px;">Your one-time login code:</p>
          <div style="background: #12121a; border: 1px solid #333; border-radius: 8px; padding: 20px; text-align: center; margin: 0 0 20px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #00c400;">${code}</span>
          </div>
          <p style="color: #666; font-size: 13px; margin: 0;">This code expires in 10 minutes. If you didn't request this, ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error('Failed to send login code:', error);
    return false;
  }
}

export const load: PageServerLoad = async ({ cookies }) => {
  const adminEmail = cookies.get('admin_auth');
  const isAuthenticated = adminEmail && ALLOWED_ADMINS.includes(adminEmail);
  
  // If already authenticated, redirect to dashboard
  if (isAuthenticated) {
    throw redirect(303, '/admin/dashboard');
  }

  return { authenticated: false };
};

export const actions: Actions = {
  // Step 1: Request login code
  requestCode: async ({ request }) => {
    const data = await request.formData();
    const email = (data.get('email') as string)?.toLowerCase().trim();

    if (!email || !ALLOWED_ADMINS.includes(email)) {
      return fail(401, { error: 'Unauthorized email address', step: 'email' });
    }

    const code = generateCode();
    loginCodes.set(email, { 
      code, 
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    const sent = await sendLoginCode(email, code);
    if (!sent) {
      return fail(500, { error: 'Failed to send code. Try again.', step: 'email' });
    }

    return { success: true, step: 'code', email };
  },

  // Step 2: Verify code
  verifyCode: async ({ request, cookies }) => {
    const data = await request.formData();
    const email = (data.get('email') as string)?.toLowerCase().trim();
    const code = (data.get('code') as string)?.trim();

    console.log('Verifying code for:', email, 'code:', code);

    const stored = loginCodes.get(email);
    console.log('Stored code:', stored);
    
    if (!stored || stored.expires < Date.now()) {
      loginCodes.delete(email);
      return fail(401, { error: 'Code expired. Request a new one.', step: 'email' });
    }

    if (stored.code !== code) {
      console.log('Code mismatch - stored:', stored.code, 'received:', code);
      return fail(401, { error: 'Invalid code', step: 'code', email });
    }

    console.log('Code verified! Setting cookie and redirecting...');

    // Success - clear code and set auth cookie
    loginCodes.delete(email);
    cookies.set('admin_auth', email, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // Set to true in production with HTTPS
      maxAge: 60 * 60 * 24 // 24 hours
    });

    console.log('Cookie set, redirecting to dashboard');
    throw redirect(303, '/admin/dashboard');
  }
};
