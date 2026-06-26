import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaProjectDiagram, FaSpinner } from 'react-icons/fa';
import { FiArrowLeft, FiEye, FiEyeOff } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (token && user) {
      navigate('/');
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === 'email') {
      if (value && !value.endsWith('@gmail.com')) {
        setEmailError('Email must be a valid @gmail.com address');
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
    if (met <= 2) return { label: 'Weak', color: 'bg-red-500', width: '20%' };
    if (met <= 3) return { label: 'Medium', color: 'bg-orange-500', width: '50%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  const strength = getPasswordStrength(formData.password);

  const validate = () => {
    const { name, email, password, phone } = formData;
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!email.endsWith('@gmail.com')) return 'Email must be a valid @gmail.com address';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(password)) return 'Password must contain at least 1 uppercase letter';
    if (!/[a-z]/.test(password)) return 'Password must contain at least 1 lowercase letter';
    if (!/[0-9]/.test(password)) return 'Password must contain at least 1 number';
    if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least 1 special character (!@#$%^&*)';
    if (!phone.trim()) return 'Phone number is required';
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
      toast.success('Confirmation email sent to your Gmail');
      navigate('/verify-email');
    } else {
      toast.error(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#FFB900] to-[#0084D1] p-4 transition-colors duration-200">
      <Link
        to="/"
        className="fixed top-5 left-5 flex items-center gap-2 text-white/70 hover:text-white transition text-sm z-10"
      >
        <FiArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-[#0084D1]/10">
        
        {/* Brand Logo */}
        <Link to="/" className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFB900]/10 text-[#FFB900]">
            <FaProjectDiagram className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Join NAJAH to start managing your projects
          </p>
          <p className="mt-2 text-xs text-[#0084D1] font-medium">
            Your path to graduation success 🎓
          </p>
        </Link>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Full Name *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaUser className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-[#0084D1] focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                  placeholder="John Doe"
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Email Address *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaEnvelope className="h-3.5 w-3.5" />
                </span>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`block w-full rounded-xl border py-2.5 pl-9 pr-3 text-xs outline-none transition focus:bg-white dark:text-white dark:focus:bg-gray-800 ${
                    emailError
                      ? 'border-red-400 bg-red-50 focus:border-red-500 dark:border-red-800 dark:bg-red-950/20'
                      : 'border-gray-200 bg-gray-50/50 focus:border-[#0084D1] dark:border-gray-800 dark:bg-gray-800/40'
                  }`}
                  placeholder="john@gmail.com"
                />
              </div>
              {emailError && (
                <p className="text-[11px] font-medium text-red-500 dark:text-red-400">
                  {emailError}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Password */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaLock className="h-3.5 w-3.5" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-10 text-xs outline-none transition focus:border-[#0084D1] focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#0277BD] transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                </button>
              </div>
              {formData.password && (
                <>
                  {/* Strength bar */}
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                    Strength: <span className={`${strength.label === 'Weak' ? 'text-red-500' : strength.label === 'Medium' ? 'text-orange-500' : 'text-emerald-500'}`}>{strength.label}</span>
                  </p>
                </>
              )}
              {/* Checklist */}
              <ul className="space-y-0.5 pt-1">
                {[
                  { label: 'At least 8 characters', fn: passwordRules.minChars },
                  { label: '1 uppercase letter', fn: passwordRules.upper },
                  { label: '1 lowercase letter', fn: passwordRules.lower },
                  { label: '1 number', fn: passwordRules.number },
                  { label: '1 special character (!@#$%^&*)', fn: passwordRules.special },
                ].map((rule) => {
                  const ok = rule.fn(formData.password);
                  return (
                    <li
                      key={rule.label}
                      className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                        ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-400 dark:text-gray-500'
                      }`}
                    >
                      <span className="text-xs">{ok ? '✓' : '○'}</span>
                      {rule.label}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Role select — hidden, always student */}
            <input type="hidden" name="role" value="student" />
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Phone Number *
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                <FaPhone className="h-3.5 w-3.5" />
              </span>
              <input
                type="text"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-[#0084D1] focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                placeholder="+1 (555) 000-0000"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0084D1] py-3 text-sm font-semibold text-white shadow-lg shadow-[#0084D1]/20 hover:bg-[#0277BD] disabled:bg-[#0084D1]/50 focus:outline-none transition"
          >
            {loading && <FaSpinner className="animate-spin" />}
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 border-t border-gray-150 pt-4 text-center dark:border-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-[#0084D1] hover:text-[#0277BD]"
            >
              Sign in here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Register;
