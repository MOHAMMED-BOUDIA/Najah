const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  pool: true,
  maxConnections: 5,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendVerificationEmail = async (to, token) => {
  const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;
  console.log(`[sendEmail] Sending verification email to ${to}...`);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Confirm your NAJAH account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Welcome to NAJAH!</h2>
        <p>Please confirm your account by clicking the button below:</p>
        <a href="${verifyLink}"
           style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Confirm my account
        </a>
      </div>
    `,
  });

  console.log(`[sendEmail] Verification email sent to ${to}`);
};

const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  console.log(`[sendEmail] Sending password reset email to ${to}...`);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject: 'Reset your NAJAH password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #4f46e5;">Password Reset Request</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetLink}"
           style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset my password
        </a>
        <p style="margin-top: 24px; color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });

  console.log(`[sendEmail] Password reset email sent to ${to}`);
};

const https = require('https');

const sendVerificationCodeEmail = async (to, code) => {
  console.log(`[sendEmail] Sending verification code to ${to}...`);

  const data = JSON.stringify({
    sender: { name: 'NAJAH', email: 'noreply@najah.com' },
    to: [{ email: to }],
    subject: 'Your NAJAH verification code',
    htmlContent: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <div style="text-align: center; padding: 24px 0;">
          <h1 style="color: #0084D1; margin: 0;">NAJAH</h1>
        </div>
        <div style="background: #ffffff; border-radius: 12px; padding: 32px; border: 1px solid #e5e7eb;">
          <h2 style="color: #1f2937; margin: 0 0 8px 0; font-size: 20px;">Welcome to NAJAH!</h2>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin: 0 0 20px 0;">
            Use the code below to verify your email address.
          </p>
          <div style="background: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center;">
            <span style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #0084D1; font-family: monospace;">
              ${code}
            </span>
          </div>
          <p style="color: #9ca3af; font-size: 13px; margin: 16px 0 0 0;">
            This code expires in 10 minutes.
          </p>
        </div>
        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 20px;">
          If you did not create an account, you can ignore this email.
        </p>
      </div>`,
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.brevo.com',
        path: '/v3/smtp/email',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
          'Content-Length': Buffer.byteLength(data),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => { body += chunk; });
        res.on('end', () => {
          if (res.statusCode === 201 || res.statusCode === 200) {
            console.log(`[sendEmail] Verification code sent to ${to}`);
            resolve();
          } else {
            console.error(`[sendEmail] Brevo API error ${res.statusCode}: ${body}`);
            reject(new Error(`Brevo API error ${res.statusCode}`));
          }
        });
      }
    );
    req.on('error', (err) => {
      console.error('[sendEmail] Brevo request failed:', err);
      reject(err);
    });
    req.write(data);
    req.end();
  });
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendVerificationCodeEmail };
