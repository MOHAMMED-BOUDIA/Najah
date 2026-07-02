const router = require('express').Router();
const { register, login, getMe, verifyEmail, verifyCode, resendCode, forgotPassword, resetPassword, oauthLogin, testEmail } = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/oauth-login', oauthLogin);
router.post('/verify-code', verifyCode);
router.post('/resend-code', resendCode);
router.get('/test-email', testEmail);
router.get('/verify/:token', verifyEmail);
router.get('/me', auth, getMe);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

module.exports = router;