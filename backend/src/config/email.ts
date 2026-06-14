import nodemailer from 'nodemailer';
import { config } from './index';
import { logger } from './logger';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: config.email.port,
  secure: config.email.port === 465,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

// Verify transporter connection
transporter.verify((error) => {
  if (error) {
    logger.warn('⚠️  Email transporter verification failed:', error.message);
    logger.info('💡 Email sending will be simulated in development mode');
  } else {
    logger.info('✅ Email transporter ready');
  }
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const info = await transporter.sendMail({
      from: `"Wash Laundry" <${config.email.from}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });

    logger.info(`📧 Email sent: ${info.messageId}`);

    // In development with Ethereal, log the preview URL
    if (config.isDev) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        logger.info(`📬 Preview URL: ${previewUrl}`);
      }
    }

    return true;
  } catch (error) {
    logger.error('❌ Email send failed:', error);
    return false;
  }
}

// ─── Email Templates ─────────────────────────────────────

export function otpEmailTemplate(name: string, otp: string, type: string): string {
  const actionText =
    type === 'SIGNUP' ? 'verify your account' :
    type === 'LOGIN' ? 'log in to your account' :
    'reset your password';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Wash - OTP Verification</title>
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f9;padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;font-weight:700;">🧺 Wash</h1>
                  <p style="color:#e0e7ff;margin:8px 0 0;font-size:14px;">Laundry Marketplace</p>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:32px;">
                  <h2 style="color:#1e293b;margin:0 0 8px;font-size:20px;">Hello${name ? ` ${name}` : ''}! 👋</h2>
                  <p style="color:#64748b;font-size:15px;line-height:1.6;margin:0 0 24px;">
                    Use the following OTP to ${actionText}. This code is valid for <strong>10 minutes</strong>.
                  </p>
                  <!-- OTP Box -->
                  <div style="background:#f8fafc;border:2px dashed #6366f1;border-radius:8px;padding:20px;text-align:center;margin:0 0 24px;">
                    <span style="font-size:36px;font-weight:700;letter-spacing:8px;color:#6366f1;">${otp}</span>
                  </div>
                  <p style="color:#94a3b8;font-size:13px;line-height:1.5;margin:0;">
                    If you didn't request this, please ignore this email. Do not share this OTP with anyone.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">
                    © ${new Date().getFullYear()} Wash Laundry Marketplace. All rights reserved.
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
}

export function welcomeEmailTemplate(name: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f9;padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:28px;">🧺 Welcome to Wash!</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <h2 style="color:#1e293b;margin:0 0 16px;">Hey ${name}! 🎉</h2>
                  <p style="color:#64748b;font-size:15px;line-height:1.6;">
                    Your account has been verified successfully. You're all set to enjoy premium laundry services at your doorstep.
                  </p>
                  <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:24px 0;">
                    <p style="color:#166534;margin:0;font-size:14px;"><strong>What's next?</strong></p>
                    <ul style="color:#166534;font-size:14px;margin:8px 0 0;padding-left:20px;">
                      <li>Browse nearby laundry shops</li>
                      <li>Schedule a pickup</li>
                      <li>Track your order in real-time</li>
                    </ul>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="background:#f8fafc;padding:20px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Wash Laundry Marketplace</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

export function orderNotificationTemplate(
  name: string,
  orderNumber: string,
  status: string,
  details: string
): string {
  const statusColors: Record<string, string> = {
    PLACED: '#6366f1',
    CONFIRMED: '#3b82f6',
    PICKED_UP: '#f59e0b',
    PROCESSING: '#8b5cf6',
    READY: '#10b981',
    OUT_FOR_DELIVERY: '#f97316',
    DELIVERED: '#22c55e',
    CANCELLED: '#ef4444',
  };

  const color = statusColors[status] || '#6366f1';

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#f4f6f9;padding:40px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="480" cellspacing="0" cellpadding="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
              <tr>
                <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:24px;text-align:center;">
                  <h1 style="color:#ffffff;margin:0;font-size:24px;">🧺 Order Update</h1>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  <p style="color:#64748b;font-size:15px;">Hi ${name},</p>
                  <div style="text-align:center;margin:24px 0;">
                    <span style="display:inline-block;background:${color};color:#fff;padding:8px 20px;border-radius:20px;font-size:14px;font-weight:600;">
                      ${status.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div style="background:#f8fafc;border-radius:8px;padding:16px;margin:16px 0;">
                    <p style="margin:0 0 4px;color:#94a3b8;font-size:12px;">ORDER NUMBER</p>
                    <p style="margin:0;color:#1e293b;font-size:16px;font-weight:600;">#${orderNumber}</p>
                  </div>
                  <p style="color:#64748b;font-size:14px;line-height:1.6;">${details}</p>
                </td>
              </tr>
              <tr>
                <td style="background:#f8fafc;padding:16px 32px;text-align:center;border-top:1px solid #e2e8f0;">
                  <p style="color:#94a3b8;font-size:12px;margin:0;">© ${new Date().getFullYear()} Wash Laundry Marketplace</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}
