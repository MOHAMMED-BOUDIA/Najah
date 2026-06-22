import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaBuilding, FaPhone, FaProjectDiagram, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const { register, token, user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    department: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (token && user) {
      navigate('/');
    }
  }, [token, user, navigate]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const { name, email, password, department, phone } = formData;
    if (!name.trim()) return 'Name is required';
    if (!email.trim()) return 'Email is required';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    if (!department.trim()) return 'Department is required';
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
      toast.success('Account created successfully!');
      navigate('/');
    } else {
      toast.error(result.message || 'Registration failed. Please check your details.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800 p-4 transition-colors duration-200">
      <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-indigo-100/10">
        
        {/* Brand Logo */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <FaProjectDiagram className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-black text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Join PFE Hub to start managing your projects
          </p>
        </div>

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
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
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
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                  placeholder="john@university.edu"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Password */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Password * (min. 6 chars)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaLock className="h-3.5 w-3.5" />
                </span>
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Role *
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
              >
                <option value="student">Student</option>
                <option value="supervisor">Supervisor</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Department */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Department *
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <FaBuilding className="h-3.5 w-3.5" />
                </span>
                <input
                  type="text"
                  name="department"
                  required
                  value={formData.department}
                  onChange={handleChange}
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                  placeholder="Computer Science"
                />
              </div>
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
                  className="block w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-xs outline-none transition focus:border-indigo-500 focus:bg-white dark:border-gray-800 dark:bg-gray-800/40 dark:text-white dark:focus:bg-gray-800"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 disabled:bg-indigo-400 focus:outline-none transition dark:bg-indigo-600 dark:hover:bg-indigo-500"
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
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
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
