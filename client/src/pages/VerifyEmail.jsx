import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaArrowRight, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import AuthLayout from '../components/auth/AuthLayout';

const VerifyEmail = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const email = localStorage.getItem('pendingVerificationEmail') || '';
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [lastError, setLastError] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.slice(-1);
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...digits];
    for (let i = 0; i < pasted.length; i++) {
      newDigits[i] = pasted[i];
    }
    setDigits(newDigits);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length !== 6) {
      toast.error(t('auth.enterSixDigitCode'));
      return;
    }
    if (!email) {
      toast.error(t('auth.noEmailFound'));
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/verify-code', { email, code });
      localStorage.removeItem('pendingVerificationEmail');
      toast.success(t('auth.emailVerified'));
      navigate('/login');
    } catch (error) {
      const msg = error.response?.data?.message || 'Verification failed';
      setLastError(msg);
      toast.error(msg);
      setDigits(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    try {
      await axiosInstance.post('/auth/resend-code', { email });
      toast.success(t('auth.codeResent'));
      setLastError('');
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to resend code';
      setLastError(msg);
      toast.error(msg);
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout title={t('auth.verifyEmailTitle')} subtitle={t('auth.verifyEmailSubtitle')}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
          {t('auth.enterCodeSent')} <strong className="text-gray-700 dark:text-gray-200">{email}</strong>
        </p>

        {lastError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/20 dark:text-red-300">
            {lastError}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 sm:gap-3">
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={i === 0 ? handlePaste : undefined}
              className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white outline-none transition-all focus:border-[#0084D1] focus:ring-2 focus:ring-[#0084D1]/20"
            />
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB900] to-[#0084D1] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0084D1]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0084D1]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading && <FaSpinner className="h-4 w-4 animate-spin" />}
          {loading ? t('auth.verifying') : t('auth.verifyEmail')}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending}
            className="text-sm text-[#0084D1] hover:underline disabled:text-gray-400 disabled:no-underline disabled:cursor-not-allowed"
          >
            {resending
              ? t('auth.sending')
              : t('auth.resendCode')}
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('auth.rememberPassword')}{' '}
        <Link to="/login" className="font-semibold text-[#0084D1] hover:text-[#0277BD] transition-colors">
          {t('auth.signInHere')}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default VerifyEmail;
