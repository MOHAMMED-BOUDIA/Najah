import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaEnvelope, FaSpinner, FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import axiosInstance from '../api/axios';
import AuthLayout from '../components/auth/AuthLayout';

const ForgotPassword = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email address.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Reset link sent to your Gmail');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = 'block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3.5 pl-11 pr-4 text-sm outline-none transition-all duration-200 focus:border-[#0084D1] focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#0084D1]/20 dark:text-white placeholder:text-gray-400';

  return (
    <AuthLayout title={t('auth.resetPasswordTitle')} subtitle={t('auth.resetPasswordSubtitle')}>
      {sent ? (
        <div className="space-y-6 animate-fadeIn">
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 p-6 text-center space-y-3">
            <FaCheckCircle className="h-10 w-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
              {t('auth.resetLinkSent')}
            </p>
            <p className="text-xs text-emerald-600 dark:text-emerald-500">
              {t('auth.resetLinkSentDesc')}
            </p>
          </div>
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FFB900] to-[#0084D1] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0084D1]/25 transition-all duration-300 hover:scale-[1.02]"
          >
            <FaArrowLeft className="h-4 w-4" />
            {t('auth.backToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('auth.email')}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
                <FaEnvelope className="h-4 w-4" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@gmail.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FFB900] to-[#0084D1] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0084D1]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0084D1]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
            {loading && <FaSpinner className="h-4 w-4 animate-spin" />}
            {loading ? t('auth.sending') : t('auth.sendResetLink')}
          </button>
        </form>
      )}

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('auth.rememberPassword')}{' '}
        <Link
          to="/login"
          className="font-semibold text-[#0084D1] hover:text-[#0277BD] transition-colors"
        >
          {t('auth.signIn')}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPassword;
