import { env } from "@/common/utils/envConfig";
import type { MessageType } from "@/types/email.types";
import { type Transporter, createTransport } from "nodemailer";

export class EmailService {
  private static instance: EmailService;
  private transporter: Transporter;
  private isInitialized = false;

  constructor() {
    this.transporter = createTransport({
      host: env.SMTP_HOST,
      pool: true,
      service: env.SMPT_SERVICE,
      maxConnections: 5,
      maxMessages: 100,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.isInitialized) {
      try {
        await this.transporter.verify();
        this.isInitialized = true;
        console.log("Email server connected successfully");
      } catch (error) {
        console.error("Error connecting to email server");
        await new Promise((resolve) => setTimeout(resolve, 5000));
        await this.ensureInitialized();
      }
    }
  }

  async sendEmail(to: string, subject: string, text: string, html?: string): Promise<void> {
    try {
      await this.ensureInitialized();

      const message: MessageType = {
        from: env.EMAIL_FROM,
        to,
        subject,
        text,
        html,
      };

      await this.transporter.sendMail(message);
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error(`Failed to send email: ${(error as Error).message}`);
    }
  }

  async close(): Promise<void> {
    if (this.transporter) {
      this.transporter.close();
      this.isInitialized = false;
    }
  }

  async sendOtpVerification(to: string, otp: string): Promise<void> {
    const subject = "OTP Verification - Weyra Talent";
    const text = `
            You are almost there! 
            Complete the final step by verifying your account.
            Here is your OTP: ${otp}
            Don't hesitate to contact us if you face any problems
            Regards,
            Team Weyra Talent`;

    const html = `
        <div style="
            max-width: 600px;
            margin: 0 auto;
            padding: 30px;
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
        ">
            <div style="
                background: linear-gradient(135deg, #0a2540 0%, #1a5a73 100%);
                padding: 20px;
                border-radius: 8px 8px 0 0;
                margin: -30px -30px 30px -30px;
            ">
                <h1 style="
                    color: #ffffff;
                    margin: 0;
                    font-size: 24px;
                    text-align: center;
                ">
                    Weyra Talent
                </h1>
            </div>
            
            <p style="font-size: 16px; color: #333; line-height: 1.5;">
                You're almost there! Complete the final step by verifying your account.
            </p>
            
            <div style="
                background-color: #e6f7f0;
                border-left: 4px solid #2e8b57;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
            ">
                <p style="margin: 0; font-weight: bold; color: #0a2540;">
                    Your verification code:
                </p>
                <p style="
                    font-size: 28px;
                    font-weight: bold;
                    letter-spacing: 2px;
                    color: #2e8b57;
                    margin: 10px 0 0 0;
                    text-align: center;
                ">
                    ${otp}
                </p>
            </div>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">
                This code will expire in 5 minutes. Please don't share it with anyone.
            </p>
            
            <p style="font-size: 14px; color: #666; line-height: 1.5;">
                If you didn't request this, please ignore this email or contact support.
            </p>
            
            <div style="
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e0e0e0;
                text-align: center;
                color: #666;
                font-size: 14px;
            ">
                <p style="margin: 0;">
                    Regards,<br>
                    <strong style="color: #0a2540;">Team Weyra Talent</strong>
                </p>
            </div>
        </div>`;

    await this.sendEmail(to, subject, text, html);
  }
}

export const emailService = new EmailService();
