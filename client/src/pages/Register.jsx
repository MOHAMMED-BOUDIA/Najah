import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaUser, FaEnvelope, FaLock, FaSpinner } from 'react-icons/fa';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';

const Register = () => {
  const { t } = useTranslation();
  const { register, token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (token && user) {
      navigate('/');
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'email') {
      if (value && !value.endsWith('@gmail.com')) {
        setEmailError(t('auth.validation.emailGmail'));
      } else {
        setEmailError('');
      }
    }
  };

  const passwordRules = {
    minChars: (v) => v.length >= 8,
    upper: (v) => /[A-Z]/.test(v),
    lower: (v) => /[a-z]/.test(v),
    number: (v) => /[0-9]/.test(v),
    special: (v) => /[!@#$%^&*]/.test(v),
  };

  const getPasswordStrength = (pwd) => {
    if (!pwd) return { label: '', color: '', width: '0%' };
    const met = Object.values(passwordRules).filter((fn) => fn(pwd)).length;
    if (met <= 2) return { label: t('profile.weak'), color: 'bg-red-500', width: '20%' };
    if (met <= 3) return { label: t('profile.fair'), color: 'bg-orange-500', width: '50%' };
    return { label: t('profile.strong'), color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const { name, email, password } = formData;
    if (!name.trim()) return t('auth.validation.nameRequired');
    if (!email.trim()) return t('auth.validation.emailRequired');
    if (!email.endsWith('@gmail.com')) return t('auth.validation.emailGmail');
    if (!password) return t('auth.validation.passwordRequired');
    if (password.length < 8) return t('auth.validation.passwordMinChars');
    if (!/[A-Z]/.test(password)) return t('auth.validation.passwordUpper');
    if (!/[a-z]/.test(password)) return t('auth.validation.passwordLower');
    if (!/[0-9]/.test(password)) return t('auth.validation.passwordNumber');
    if (!/[!@#$%^&*]/.test(password)) return t('auth.validation.passwordSpecial');
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errorMsg = validate();
    if (errorMsg) {
      toast.error(errorMsg);
      return;
    }
    setLoading(true);
    const result = await register(formData);
    setLoading(false);
    if (result.success) {
      toast.success(t('auth.validation.confirmEmailSent'));
      navigate('/verify-email');
    } else {
      toast.error(result.message || t('auth.validation.registrationFailed'));
    }
  };

  const inputClass = 'block w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 py-3 pl-11 pr-10 text-sm outline-none transition-all duration-200 focus:border-[#0084D1] focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-[#0084D1]/20 dark:text-white placeholder:text-gray-400';
  const inputClassError = 'block w-full rounded-xl border border-red-400 dark:border-red-800 bg-red-50 dark:bg-red-950/20 py-3 pl-11 pr-10 text-sm outline-none transition-all duration-200 focus:border-red-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-2 focus:ring-red-500/20 dark:text-white placeholder:text-gray-400';

  return (
    <AuthLayout title={t('auth.createAccountTitle')} subtitle={t('auth.createAccountSubtitle')}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('auth.fullName')} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaUser className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={inputClass}
                placeholder={t('auth.fullName')}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {t('auth.email')} *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                <FaEnvelope className="h-3.5 w-3.5" />
              </span>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={emailError ? inputClassError : inputClass}
                placeholder={t('auth.placeholders.email')}
              />
            </div>
            {emailError && (
              <p className="text-[11px] font-medium text-red-500 dark:text-red-400">{emailError}</p>
            )}
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
            {t('auth.password')} *
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
              <FaLock className="h-3.5 w-3.5" />
            </span>
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className={inputClass}
              placeholder={t('auth.placeholders.password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-[#0084D1] transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
            </button>
          </div>
          {formData.password && (
            <div className="space-y-1.5 pt-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`} style={{ width: strength.width }} />
                </div>
                <span className={`text-[10px] font-semibold ${strength.label === t('profile.weak') ? 'text-red-500' : strength.label === t('profile.fair') ? 'text-orange-500' : 'text-emerald-500'}`}>
                  {strength.label}
                </span>
              </div>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-0.5 pt-0.5">
                {[
                  { label: t('auth.passwordRules.chars'), fn: passwordRules.minChars },
                  { label: t('auth.passwordRules.upper'), fn: passwordRules.upper },
                  { label: t('auth.passwordRules.lower'), fn: passwordRules.lower },
                  { label: t('auth.passwordRules.number'), fn: passwordRules.number },
                  { label: t('auth.passwordRules.special'), fn: passwordRules.special },
                ].map((rule) => {
                  const ok = rule.fn(formData.password);
                  return (
                    <li key={rule.label} className={`flex items-center gap-1.5 text-[11px] transition-colors ${ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'}`}>
                      <span className="text-xs">{ok ? '✓' : '○'}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {/* Role hidden */}
        <input type="hidden" name="role" value="student" />



        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#FFB900] to-[#0084D1] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#0084D1]/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#0084D1]/30 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <span className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors" />
          {loading && <FaSpinner className="h-4 w-4 animate-spin" />}
          {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
        </button>
      </form>

      {/* Footer */}
      <p className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
        {t('auth.haveAccount')}{' '}
        <Link
          to="/login"
          className="font-semibold text-[#0084D1] hover:text-[#0277BD] transition-colors"
        >
          {t('auth.signInHere')}
        </Link>
      </p>
    </AuthLayout>
  );
};

export default Register;
