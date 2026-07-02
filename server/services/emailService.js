const nodemailer = require('nodemailer');

console.log('[emailService] startup env check', {
  hasEmailUser: !!process.env.EMAIL_USER,
  emailUserLength: process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0,
  hasEmailPass: !!process.env.EMAIL_PASS,
  emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
  hasClientUrl: !!process.env.CLIENT_URL,
  nodeEnv: process.env.NODE_ENV || 'development',
});

const SENDER_NAME = process.env.EMAIL_SENDER_NAME || 'NAJAH';
const SENDER_EMAIL = process.env.EMAIL_USER || process.env.EMAIL_SENDER_EMAIL || 'noreply@najah.com';

const buildTransporter = () => {
  console.log('[emailService] creating transporter', {
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    senderEmailLength: SENDER_EMAIL.length,
    emailUserConfigured: !!process.env.EMAIL_USER,
    emailPassLength: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
  });

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    debug: true,
    logger: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    connectionTimeout: 20000,
    greetingTimeout: 20000,
    socketTimeout: 30000,
    tls: {
      rejectUnauthorized: process.env.EMAIL_REJECT_UNAUTHORIZED === 'false' ? false : true,
    },
  });
};

const createDetailedError = (error) => ({
  message: error?.message || 'Unknown email error',
  code: error?.code || null,
  command: error?.command || null,
  response: error?.response || null,
  stack: error?.stack || null,
});

const sendMail = async ({ to, subject, html }) => {
  console.log('[emailService] sendMail invoked', {
    to,
    subject,
    from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
  });

  const transporter = buildTransporter();

  try {
    console.log('[emailService] before sendMail promise', { to, subject });

    const info = await new Promise((resolve, reject) => {
      console.log('[emailService] inside sendMail promise', { to, subject });
      transporter.sendMail(
        {
          from: `${SENDER_NAME} <${SENDER_EMAIL}>`,
          to,
          subject,
          html,
        },
        (error, result) => {
          if (error) {
            const detailedError = createDetailedError(error);
            console.error('[emailService] sendMail callback error', detailedError);
            reject(detailedError);
            return;
          }

          console.log('[emailService] sendMail callback success', {
            messageId: result?.messageId,
            response: result?.response,
            accepted: result?.accepted,
            rejected: result?.rejected,
          });
          resolve(result);
        }
      );
    });

    console.log('[emailService] after sendMail completes', {
      to,
      subject,
      messageId: info?.messageId,
      response: info?.response,
    });

    return info;
  } catch (error) {
    const detailedError = createDetailedError(error);
    console.error('[emailService] after sendMail fails', detailedError);
    throw detailedError;
  }
};

const sendVerificationCodeEmail = async (to, code) => {
  return sendMail({
    to,
    subject: 'Your NAJAH verification code',
    html: `
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
};

const sendPasswordResetEmail = async (to, token) => {
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;
  return sendMail({
    to,
    subject: 'Reset your NAJAH password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0084D1;">Password Reset Request</h2>
        <p>Click the button below to reset your password. This link expires in 1 hour.</p>
        <a href="${resetLink}"
           style="display: inline-block; padding: 12px 24px; background: #0084D1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Reset my password
        </a>
        <p style="margin-top: 24px; color: #999; font-size: 12px;">If you didn't request this, please ignore this email.</p>
      </div>`,
  });
};

const sendVerificationEmail = async (to, token) => {
  const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;
  return sendMail({
    to,
    subject: 'Confirm your NAJAH account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0084D1;">Welcome to NAJAH!</h2>
        <p>Please confirm your account by clicking the button below:</p>
        <a href="${verifyLink}"
           style="display: inline-block; padding: 12px 24px; background: #0084D1; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">
          Confirm my account
        </a>
      </div>`,
  });
};

const sendTestEmail = async (to) => {
  return sendMail({
    to,
    subject: 'NAJAH email transport test',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #0084D1;">NAJAH Email Test</h2>
        <p>If you received this, SMTP delivery is working.</p>
      </div>`,
  });
};

module.exports = { sendVerificationCodeEmail, sendPasswordResetEmail, sendVerificationEmail, sendTestEmail };
