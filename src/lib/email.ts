import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from }: EmailOptions) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('RESEND_API_KEY not configured, email not sent');
    return { success: false, error: 'Email service not configured' };
  }

  try {
    const result = await resend.emails.send({
      from: from || process.env.FROM_EMAIL || 'Oravo Analytics <noreply@analytics.imoogleai.xyz>',
      to,
      subject,
      html,
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error: error.message };
  }
}

export function generateVerificationEmailHtml(name: string, verificationUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - Oravo Analytics</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2680eb;
        }
        .content {
          padding: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #2680eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .footer {
          border-top: 1px solid #eee;
          padding: 20px 0;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Oravo Analytics</div>
      </div>
      
      <div class="content">
        <h1>Welcome to Oravo Analytics, ${name}!</h1>
        
        <p>Thank you for signing up for Oravo Analytics. To complete your registration and start using our analytics platform, please verify your email address by clicking the button below:</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">Verify Email Address</a>
        </div>
        
        <p>If the button doesn't work, you can also copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #2680eb;">${verificationUrl}</p>
        
        <p>This verification link will expire in 24 hours for security reasons.</p>
        
        <p>If you didn't create an account with Oravo Analytics, you can safely ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Oravo Analytics. All rights reserved.</p>
        <p>This email was sent to ${to}. If you have any questions, please contact our support team.</p>
      </div>
    </body>
    </html>
  `;
}

export function generateWelcomeEmailHtml(name: string, dashboardUrl: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Oravo Analytics</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2680eb;
        }
        .content {
          padding: 30px 0;
        }
        .button {
          display: inline-block;
          background-color: #2680eb;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin: 20px 0;
        }
        .feature {
          background-color: #f8f9fa;
          padding: 15px;
          margin: 10px 0;
          border-radius: 6px;
        }
        .footer {
          border-top: 1px solid #eee;
          padding: 20px 0;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Oravo Analytics</div>
      </div>
      
      <div class="content">
        <h1>Welcome to Oravo Analytics, ${name}!</h1>
        
        <p>Your email has been verified successfully! You're now ready to start using Oravo Analytics to gain powerful insights into your website's performance.</p>
        
        <div style="text-align: center;">
          <a href="${dashboardUrl}" class="button">Go to Dashboard</a>
        </div>
        
        <h2>What you can do with Oravo Analytics:</h2>
        
        <div class="feature">
          <h3>📊 Real-time Analytics</h3>
          <p>Monitor your website traffic and user behavior in real-time with our intuitive dashboard.</p>
        </div>
        
        <div class="feature">
          <h3>🎯 Goal Tracking</h3>
          <p>Set up and track conversion goals to measure your website's success.</p>
        </div>
        
        <div class="feature">
          <h3>🔒 Privacy-Focused</h3>
          <p>Respect your users' privacy with our GDPR-compliant analytics solution.</p>
        </div>
        
        <div class="feature">
          <h3>📈 Custom Reports</h3>
          <p>Create detailed reports and insights tailored to your specific needs.</p>
        </div>
        
        <p>Need help getting started? Check out our documentation or contact our support team.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Oravo Analytics. All rights reserved.</p>
        <p>Happy analyzing!</p>
      </div>
    </body>
    </html>
  `;
}

export function generateVerificationCodeEmailHtml(name: string, code: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Verification Code - Oravo Analytics</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          text-align: center;
          padding: 20px 0;
          border-bottom: 1px solid #eee;
        }
        .logo {
          font-size: 24px;
          font-weight: bold;
          color: #2680eb;
        }
        .content {
          padding: 30px 0;
          text-align: center;
        }
        .code {
          background: #000;
          color: #fff;
          padding: 20px;
          border-radius: 8px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 8px;
          margin: 30px 0;
          display: inline-block;
        }
        .footer {
          border-top: 1px solid #eee;
          padding: 20px 0;
          font-size: 14px;
          color: #666;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">Oravo Analytics</div>
      </div>
      
      <div class="content">
        <h1>Verify Your Email Address</h1>
        
        <p>Hi ${name},</p>
        
        <p>Thank you for signing up for Oravo Analytics! Please use the verification code below to verify your email address and complete your account setup.</p>
        
        <div class="code">${code}</div>
        
        <p style="color: #666; font-size: 14px;">This verification code will expire in 15 minutes for security reasons.</p>
        
        <p style="color: #666; font-size: 14px;">If you didn't request this verification code, please ignore this email.</p>
      </div>
      
      <div class="footer">
        <p>© 2024 Oravo Analytics. All rights reserved.</p>
      </div>
    </body>
    </html>
  `;
}

export async function sendVerificationEmail(email: string, code: string, name: string) {
  const html = generateVerificationCodeEmailHtml(name, code);
  
  return await sendEmail({
    to: email,
    subject: 'Your Verification Code - Oravo Analytics',
    html,
  });
}

export async function sendWelcomeEmail(email: string, name: string) {
  const dashboardUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/setup`;
  const html = generateWelcomeEmailHtml(name, dashboardUrl);
  
  return await sendEmail({
    to: email,
    subject: 'Welcome to Oravo Analytics!',
    html,
  });
}