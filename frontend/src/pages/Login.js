import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

const FORM_STORAGE_KEY = 'login_form_data';

// Initialize form data from localStorage or default
const getInitialFormData = () => {
  try {
    const stored = localStorage.getItem(FORM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { email: parsed.email || '', password: parsed.password || '' };
    }
  } catch (e) {
    // Ignore errors
  }
  return { email: '', password: '' };
};

export const Login = () => {
  const navigate = useNavigate();
  const { login, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData);
  const [error, setError] = useState('');
  // Use ref to persist form data across re-renders
  const formDataRef = useRef(formData);
  const isMountedRef = useRef(true);

  // Keep ref in sync with state and persist to localStorage
  useEffect(() => {
    formDataRef.current = formData;
    // Persist to localStorage whenever formData changes
    try {
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [formData]);

  // Restore form data on mount if component was remounted
  useEffect(() => {
    if (isMountedRef.current) {
      const stored = getInitialFormData();
      if (stored.email || stored.password) {
        setFormData(stored);
        formDataRef.current = stored;
      }
    }
    return () => {
      // Don't clear on unmount - keep data for next mount
    };
  }, []);

  const handleChange = (e) => {
    const fieldName = e.target.name;
    const fieldValue = e.target.value;
    
    // Clear error when user starts typing (good UX feedback)
    if (error) {
      setError('');
    }
    
    // Use functional update to avoid stale closure issues
    setFormData((prevData) => {
      const newData = {
        ...prevData,
        [fieldName]: fieldValue,
      };
      formDataRef.current = newData;
      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don't clear error here - let it persist until success or user dismisses it

    // Use ref to get the latest form data to avoid stale closures
    const currentFormData = formDataRef.current;
    const result = await login(currentFormData.email, currentFormData.password);
    if (result.success) {
      // Only clear form and error on successful login (navigation will unmount component anyway)
      setError('');
      const emptyData = { email: '', password: '' };
      setFormData(emptyData);
      formDataRef.current = emptyData;
      // Clear from localStorage on success
      try {
        localStorage.removeItem(FORM_STORAGE_KEY);
      } catch (e) {
        // Ignore
      }
      navigate(result.user.role === 'admin' ? '/admin' : '/');
    } else {
      // Preserve form values on error - do NOT clear them
      // Force restore from ref if state was lost
      setFormData((prevData) => {
        // If state was lost (empty), restore from ref
        const hasPrevData = prevData.email || prevData.password;
        const hasRefData = currentFormData.email || currentFormData.password;
        
        if (!hasPrevData && hasRefData) {
          // State was lost, restore from ref
          return currentFormData;
        }
        // State is intact, keep it
        return prevData;
      });
      setError(result.error);
      // Ensure ref is updated
      formDataRef.current = currentFormData;
      // formData remains unchanged, so user can correct and resubmit
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Logo */}
        <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
          <Link 
            to="/" 
            onClick={(e) => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="relative w-full max-w-sm lg:max-w-md cursor-pointer hover:opacity-90 transition-opacity"
          >
            <img
              src="/images/cater-chef-logo.png"
              alt="CaterHub Logo"
              className="w-full h-auto"
              style={{
                filter: 'drop-shadow(0 25px 50px rgba(255, 106, 40, 0.4)) drop-shadow(0 15px 30px rgba(0, 0, 0, 0.25)) drop-shadow(0 5px 15px rgba(255, 106, 40, 0.2))',
              }}
            />
          </Link>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white rounded-2xl shadow-2xl w-full p-8 animate-slide-in order-1 lg:order-2">
          <h1 className="text-3xl font-bold text-center mb-2 text-[#FF6A28]">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-8">Sign in to your account</p>

        {error && <Alert type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 transition"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <LoadingSpinner size="sm" text="Signing in..." /> : 'Sign In'}
          </button>
        </form>

        {/* Register Link */}
        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-[#FF6A28] font-semibold hover:underline">
            Register here
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};
