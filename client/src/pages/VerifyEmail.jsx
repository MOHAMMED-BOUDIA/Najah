import { Link } from 'react-router-dom';
import { FaEnvelope, FaProjectDiagram } from 'react-icons/fa';

const VerifyEmail = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0084D1] via-[#0277BD] to-[#0066A0] p-4 transition-colors duration-200">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl dark:bg-gray-900 border border-[#0084D1]/10 text-center">
        <div className="flex flex-col items-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0084D1]/10 text-[#0084D1]">
            <FaEnvelope className="h-7 w-7" />
          </div>
          <h2 className="mt-5 text-xl font-black text-gray-900 dark:text-white">
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Please check your Gmail to confirm your account
          </p>
        </div>

        <div className="mt-8 border-t border-gray-150 pt-6 dark:border-gray-800">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-[#0084D1] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0084D1]/20 hover:bg-[#0277BD] transition"
          >
            <FaProjectDiagram className="h-4 w-4" />
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
