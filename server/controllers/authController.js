const User = require('../models/User');
const crypto = require('crypto');

const validateEmail = (email) => {
  if (!email || !email.endsWith('@gmail.com')) {
    return 'Email must be a valid @gmail.com address';
  }
  return null;
};

const validatePassword = (password) => {
  if (!password) return 'Password is required';
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must contain at least 1 lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
  if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least 1 special character (!@#$%^&*)';
  return null;
};

const generateVerificationCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

exports.register = async (req, res) => {
  try {
    console.log('[authController] register endpoint hit', {
      bodyKeys: Object.keys(req.body || {}),
      hasEmail: !!req.body?.email,
      email: req.body?.email,
    });

    const { name, email, password, role, department } = req.body;

    if (role && role !== 'student') {
      return res.status(403).json({ message: 'Only student accounts can be created via registration' });
    }

    const emailError = validateEmail(email);
    if (emailError) {
      return res.status(400).json({ message: emailError });
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const verificationCode = generateVerificationCode();

    user = new User({
      name,
      email,
      password: hashedPassword,
      role: 'student',
      department: department || '',
      isVerified: false,
      verificationCode,
      codeExpiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await user.save();
    console.log('[authController] user created', {
      userId: user._id,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      verificationCodeLength: user.verificationCode ? String(user.verificationCode).length : 0,
    });

    const { sendVerificationCodeEmail: sendVerificationEmail } = require('../services/emailService');
    console.log('[authController] before email delay');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('[authController] before calling sendVerificationEmail');

    try {
      const emailInfo = await sendVerificationEmail(email, verificationCode);
      console.log('[authController] after sendVerificationEmail success', {
        messageId: emailInfo?.messageId,
        response: emailInfo?.response,
        accepted: emailInfo?.accepted,
        rejected: emailInfo?.rejected,
      });
    } catch (emailError) {
      console.error('[authController] after sendVerificationEmail failure', {
        message: emailError?.message,
        code: emailError?.code,
        command: emailError?.command,
        response: emailError?.response,
        stack: emailError?.stack,
      });

      return res.status(500).json({
        message: 'User created, but verification email failed',
        emailError: {
          message: emailError?.message || 'Unknown email error',
          code: emailError?.code || null,
          command: emailError?.command || null,
          response: emailError?.response || null,
        },
      });
    }

    res.status(201).json({
      message: 'Verification code sent to your email',
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ message: 'Email and code are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.json({ message: 'Email already verified. You can log in.' });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    if (user.codeExpiresAt < new Date()) {
      return res.status(400).json({ message: 'Verification code has expired. Request a new one.' });
    }

    user.isVerified = true;
    user.verificationCode = null;
    user.codeExpiresAt = null;
    await user.save();

    res.json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resendCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.isVerified) {
      return res.json({ message: 'Email already verified. You can log in.' });
    }

    const verificationCode = generateVerificationCode();
    user.verificationCode = verificationCode;
    user.codeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const { sendVerificationCodeEmail: sendVerificationEmail } = require('../services/emailService');
    await sendVerificationEmail(email, verificationCode);

    res.json({ message: 'New verification code sent to your email' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link' });
    }

    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    res.json({ message: 'Email confirmed successfully. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = email?.toLowerCase().trim();
    console.log('[authController] Login attempt:', { email, passwordLength: password?.length || 0 });

    const user = await User.findOne({ email });
    console.log('[authController] User found:', user ? `${user.email} (${user.role})` : 'NO USER FOUND');

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('[authController] Password match:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    console.log('[authController] isVerified check:', { role: user.role, isVerified: user.isVerified });

    if (user.role === 'student' && !user.isVerified) {
      return res.status(400).json({ message: 'Please verify your email first' });
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.oauthLogin = async (req, res) => {
  try {
    const { name, email, avatar, provider } = req.body;

    if (!email || !provider) {
      return res.status(400).json({ message: 'Email and provider are required' });
    }

    let user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      const bcrypt = require('bcryptjs');
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);
      user = await User.create({
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        password: randomPassword,
        avatar: avatar || '',
        role: 'student',
        isVerified: true,
        provider,
      });
    } else {
      user.provider = provider;
      if (avatar) user.avatar = avatar;
      await user.save();
    }

    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -__v')
      .populate('department', 'name')
      .lean()
      .maxTimeMS(3000);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.endsWith('@gmail.com')) {
      return res.status(400).json({ message: 'Please provide a valid @gmail.com address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'No account found with this email' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    process.nextTick(() => {
      const { sendPasswordResetEmail } = require('../services/emailService');
      sendPasswordResetEmail(email, resetToken).catch(err =>
        console.error('[authController] Failed to send password reset email:', err)
      );
    });

    res.json({ message: 'Reset link sent to your Gmail' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const passwordError = validatePassword(password);
    if (passwordError) {
      return res.status(400).json({ message: passwordError });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    if (!user.isVerified) {
      user.isVerified = true;
      user.verificationCode = null;
      user.codeExpiresAt = null;
    }
    await user.save();

    res.json({ message: 'Password reset successful. You can now log in.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.testEmail = async (req, res) => {
  try {
    const testTo = req.query.to || process.env.EMAIL_USER;

    if (!testTo) {
      return res.status(400).json({ message: 'No destination email available for test' });
    }

    console.log('[authController] testEmail endpoint hit', { testTo });
    const { sendTestEmail } = require('../services/emailService');

    try {
      const info = await sendTestEmail(testTo);
      console.log('[authController] testEmail success', {
        messageId: info?.messageId,
        response: info?.response,
        accepted: info?.accepted,
        rejected: info?.rejected,
      });

      return res.json({
        message: 'Test email sent',
        to: testTo,
        messageId: info?.messageId,
        response: info?.response,
      });
    } catch (emailError) {
      console.error('[authController] testEmail failure', {
        message: emailError?.message,
        code: emailError?.code,
        command: emailError?.command,
        response: emailError?.response,
        stack: emailError?.stack,
      });

      return res.status(500).json({
        message: 'Test email failed',
        emailError: {
          message: emailError?.message || 'Unknown email error',
          code: emailError?.code || null,
          command: emailError?.command || null,
          response: emailError?.response || null,
        },
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};