import { useState } from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaLock } from 'react-icons/fa';

const PasswordInput = ({ label, name, value, onChange, placeholder, required = false }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
          <FaLock className="h-3.5 w-3.5" />
        </span>
        <input
          type={visible ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-200 bg-gray-50/50 py-3 pl-11 pr-12 text-xs outline-none transition-all duration-200 focus:border-[#0084D1] focus:bg-white focus:ring-2 focus:ring-[#0084D1]/40 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:bg-gray-800"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          tabIndex={-1}
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? (
            <FiEyeOff className="h-4 w-4" />
          ) : (
            <FiEye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
};

export default PasswordInput;
