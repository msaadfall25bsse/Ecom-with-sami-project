import nodemailer from 'nodemailer';
import { db } from '../db/index.js';

interface EmailApprovalParams {
  studentName: string;
  email: string;
  accessCode: string;
  courseTitle?: string;
  loginUrl?: string;
}

export class EmailService {
  /**
   * Helper to get setting from SQLite DB
   */
  private getSetting(key: string, defaultVal: string = ''): string {
    try {
      const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as any;
      return row ? row.value : defaultVal;
    } catch {
      return defaultVal;
    }
  }

  /**
   * Create Nodemailer transporter based on DB settings
   */
  private getTransporter() {
    const host = this.getSetting('smtp_host');
    const port = parseInt(this.getSetting('smtp_port', '587'), 10);
    const user = this.getSetting('smtp_user');
    const pass = this.getSetting('smtp_pass');
    const secure = this.getSetting('smtp_secure') === '1' || port === 465;

    if (!host || !user) {
      return null;
    }

    return nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  /**
   * Send Enrollment Approval & LMS Access Code to student
   */
  async sendEnrollmentApprovalEmail(params: EmailApprovalParams): Promise<{ sent: boolean; message: string }> {
    const { studentName, email, accessCode, courseTitle = 'Master UAE & KSA Dropshipping Mentorship', loginUrl = '/login' } = params;
    const storeName = this.getSetting('store_name', 'Ecom With Sami');
    const whatsappNum = this.getSetting('admin_whatsapp', this.getSetting('whatsapp_number', '+92 333 0093269'));
    const whatsappGroupUrl = this.getSetting('whatsapp_group_link', 'https://chat.whatsapp.com/sami-mentorship-mastermind');
    const fromName = this.getSetting('smtp_from_name', `${storeName} Admissions`);
    const fromEmail = this.getSetting('smtp_from_email', 'admissions@ecomwithsami.com');

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0b0f19; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: #111827; border-radius: 12px; border: 1px solid #1f2937; overflow: hidden; }
          .header { background: linear-gradient(135deg, #00A0DF, #0284c7); padding: 30px 20px; text-align: center; }
          .header h1 { margin: 0; font-size: 24px; color: #ffffff; font-weight: 800; letter-spacing: 0.5px; }
          .content { padding: 30px 24px; color: #e2e8f0; line-height: 1.6; }
          .highlight-box { background: #1f2937; border: 1px solid #374151; border-radius: 8px; padding: 20px; text-align: center; margin: 24px 0; }
          .code-label { font-size: 13px; text-transform: uppercase; color: #94a3b8; letter-spacing: 1px; margin-bottom: 8px; }
          .access-code { font-size: 32px; font-weight: 800; color: #38bdf8; letter-spacing: 4px; font-family: monospace; }
          .btn { display: inline-block; background: #00A0DF; color: #ffffff !important; padding: 14px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; margin-top: 10px; }
          .footer { background: #0b0f19; padding: 20px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #1f2937; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to ${storeName}</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${studentName}</strong>,</p>
            <p>Congratulations! Your payment has been verified and your enrollment in <strong>${courseTitle}</strong> has been officially approved.</p>
            
            <p>You now have instant access to our official <strong>Web Browser LMS Classroom</strong>:</p>

            <div class="highlight-box">
              <div class="code-label">Your VIP Student LMS Access Code</div>
              <div class="access-code">${accessCode}</div>
              <p style="font-size: 13px; color: #94a3b8; margin-top: 10px; margin-bottom: 0;">Use your registered email (<strong>${email}</strong>) and this Access Code to log in.</p>
            </div>

            <div style="text-align: center; margin-bottom: 24px;">
              <a href="${loginUrl}" class="btn">🚀 Enter Web LMS Classroom</a>
            </div>

            <div style="background: rgba(16, 185, 129, 0.1); border: 1px solid rgba(16, 185, 129, 0.35); border-radius: 8px; padding: 16px; margin: 20px 0; text-align: center;">
              <div style="font-weight: bold; color: #10B981; margin-bottom: 6px;">📲 Join Official VIP WhatsApp Mentorship Group:</div>
              <a href="${whatsappGroupUrl}" target="_blank" style="color: #38bdf8; word-break: break-all; font-weight: bold; text-decoration: underline;">${whatsappGroupUrl}</a>
            </div>

            <h4 style="color: #38bdf8; margin-bottom: 8px;">Important Student Instructions:</h4>
            <ul style="padding-left: 20px; color: #cbd5e1;">
              <li>Watch all 11 Modules and 36 lectures step-by-step from Module 01.</li>
              <li>Download the VIP Dropshipping Profit Margin Calculator & Supplier Directory inside the portal.</li>
              <li>Attend our live weekly Q&A mastermind sessions.</li>
            </ul>

            <p style="margin-top: 24px;">If you have any questions or need immediate support, feel free to WhatsApp our student desk at: <strong>${whatsappNum}</strong></p>

            <p>Best regards,<br><strong>Sami & The Mentorship Admissions Team</strong></p>
          </div>
          <div class="footer">
            &copy; ${new Date().getFullYear()} ${storeName}. All rights reserved. Direct Web LMS Portal.
          </div>
        </div>
      </body>
      </html>
    `;

    const transporter = this.getTransporter();

    if (!transporter) {
      console.log(`\n📧 [EMAIL SIMULATION] SMTP not configured. Access email for ${email}:`);
      console.log(`   Student: ${studentName}`);
      console.log(`   Access Code: ${accessCode}`);
      console.log(`   Login URL: ${loginUrl}\n`);
      return {
        sent: false,
        message: 'SMTP settings unconfigured. Access Code logged to system.'
      };
    }

    try {
      await transporter.sendMail({
        from: `"${fromName}" <${fromEmail}>`,
        to: email,
        subject: `🎓 Enrollment Approved! Your VIP LMS Access Code - ${storeName}`,
        html: htmlContent
      });

      console.log(`✅ LMS Access Email dispatched successfully to: ${email}`);
      return {
        sent: true,
        message: `Email dispatched successfully to ${email}`
      };
    } catch (err: any) {
      console.error(`❌ Failed to send access email to ${email}:`, err.message);
      return {
        sent: false,
        message: `SMTP Error: ${err.message}`
      };
    }
  }

  /**
   * Test SMTP Connection
   */
  async testConnection(config: { host: string; port: number; user: string; pass: string; secure?: boolean }) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: config.secure || config.port === 465,
        auth: {
          user: config.user,
          pass: config.pass
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      await transporter.verify();
      return { success: true, message: 'SMTP connection verified successfully!' };
    } catch (err: any) {
      return { success: false, message: err.message || 'Failed to connect to SMTP server' };
    }
  }
}

export const emailService = new EmailService();
