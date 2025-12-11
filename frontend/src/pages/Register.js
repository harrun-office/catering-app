import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';

const REGISTER_FORM_STORAGE_KEY = 'register_form_data';

// Initialize form data from localStorage or default
const getInitialFormData = () => {
  try {
    const stored = localStorage.getItem(REGISTER_FORM_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        first_name: parsed.first_name || '',
        last_name: parsed.last_name || '',
        email: parsed.email || '',
        password: parsed.password || '',
        phone: parsed.phone || '',
      };
    }
  } catch (e) {
    // Ignore errors
  }
  return {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  };
};

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const initialFormData = {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  };
  const [formData, setFormData] = useState(getInitialFormData);
  const [errors, setErrors] = useState({});
  // Use ref to persist form data across re-renders
  const formDataRef = useRef(formData);
  const isMountedRef = useRef(true);

  // Keep ref in sync with state and persist to localStorage
  useEffect(() => {
    formDataRef.current = formData;
    // Persist to localStorage whenever formData changes
    try {
      localStorage.setItem(REGISTER_FORM_STORAGE_KEY, JSON.stringify(formData));
    } catch (e) {
      // Ignore localStorage errors
    }
  }, [formData]);

  // Restore form data on mount if component was remounted
  useEffect(() => {
    if (isMountedRef.current) {
      const stored = getInitialFormData();
      const hasStoredData = Object.values(stored).some(val => val);
      if (hasStoredData) {
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
    
    // Clear errors when user starts typing in that field (good UX feedback)
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      if (newErrors[fieldName]) {
        delete newErrors[fieldName];
      }
      // Clear general error when user starts typing in any field
      if (newErrors.general) {
        delete newErrors.general;
      }
      return newErrors;
    });
    
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

  // Validation helpers
  const validateName = (name) => {
    if (!name || name.trim().length === 0) {
      return 'This field is required.';
    }
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      return 'Must be at least 2 characters.';
    }
    // allow letters, spaces, hyphens, apostrophes
    const nameRe = /^[A-Za-zÀ-ÖØ-öø-ÿ' -]+$/;
    if (!nameRe.test(trimmed)) {
      return 'Only letters, spaces, hyphens and apostrophes allowed.';
    }
    return null;
  };

  // Email rule: must start with a letter and be a valid email form.
  // This will reject local parts that start with a digit like "1@gmail.com".
  const validateEmail = (email) => {
    if (!email || email.trim().length === 0) {
      return 'Email is required.';
    }
    const e = email.trim();
    // Local part must start with a letter and be at least 2 chars
    // and follow common RFC-like constraints for simple validation.
    const emailRe = /^[A-Za-z][A-Za-z0-9._%+-]{1,}@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailRe.test(e)) {
      return 'Enter a valid email address (must start with a letter).';
    }
    return null;
  };

  const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
      return null; // phone optional
    }
    const digits = phone.replace(/[\s()-]/g, '');
    const phoneRe = /^\+?\d{10,15}$/; // allow leading +, 10-15 digits
    if (!phoneRe.test(digits)) {
      return 'Enter a valid phone number (10–15 digits, optional +).';
    }
    return null;
  };

  const validatePassword = (pw) => {
    if (!pw || pw.length === 0) {
      return 'Password is required.';
    }
    if (pw.length < 8) {
      return 'Password must be at least 8 characters.';
    }
    // at least one lowercase, one uppercase, one digit, one special char
    const lower = /[a-z]/;
    const upper = /[A-Z]/;
    const digit = /\d/;
    const special = new RegExp("[!@#$%^&*(),.?\":{}|<>_\\\\/\\u005b\\u005d;'`+=~-]");
    if (!lower.test(pw) || !upper.test(pw) || !digit.test(pw) || !special.test(pw)) {
      return 'Password must include uppercase, lowercase, number and special character.';
    }
    return null;
  };

  const validateAll = (data) => {
    const newErrors = {};
    const firstNameErr = validateName(data.first_name);
    if (firstNameErr) newErrors.first_name = firstNameErr;
    const lastNameErr = validateName(data.last_name);
    if (lastNameErr) newErrors.last_name = lastNameErr;
    const emailErr = validateEmail(data.email);
    if (emailErr) newErrors.email = emailErr;
    const phoneErr = validatePhone(data.phone);
    if (phoneErr) newErrors.phone = phoneErr;
    const passwordErr = validatePassword(data.password);
    if (passwordErr) newErrors.password = passwordErr;

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Don't clear all errors here - only clear on success or when user types

    // Use ref to get the latest form data to avoid stale closures
    const currentFormData = formDataRef.current;
    
    // client-side validation
    const validationErrors = validateAll(currentFormData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register(currentFormData);
    if (result.success) {
      // Only clear form and errors on successful registration (navigation will unmount component anyway)
      setErrors({});
      setFormData(initialFormData);
      formDataRef.current = initialFormData;
      // Clear from localStorage on success
      try {
        localStorage.removeItem(REGISTER_FORM_STORAGE_KEY);
      } catch (e) {
        // Ignore
      }
      navigate('/');
    } else {
      // Preserve form values on error - do NOT clear them
      // Force restore from ref if state was lost
      setFormData((prevData) => {
        // If state was lost (empty), restore from ref
        const hasPrevData = Object.values(prevData).some(val => val);
        const hasRefData = Object.values(currentFormData).some(val => val);
        
        if (!hasPrevData && hasRefData) {
          // State was lost, restore from ref
          return currentFormData;
        }
        // State is intact, keep it
        return prevData;
      });
      // Ensure ref is updated
      formDataRef.current = currentFormData;
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        setErrors({ general: result.error });
      }
      // formData remains unchanged, so user can correct and resubmit
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F7] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Side - Logo */}
        <div className="flex items-center justify-center lg:justify-start order-2 lg:order-1">
          <Link to="/" className="relative w-full max-w-sm lg:max-w-md cursor-pointer hover:opacity-90 transition-opacity">
            <img
              src="/images/logo-caterhub-removebg-preview.png"
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
          <h1 className="text-3xl font-bold text-center mb-2 text-[#FF6A28]">Join CaterHub</h1>
          <p className="text-center text-gray-600 mb-8">Create your account to get started</p>

        {errors.general && <Alert type="error" message={errors.general} />}

        <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">First Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="John"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 transition"
                  required
                />
              </div>
              {errors.first_name && <p className="text-red-600 text-xs mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Last Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={20} />
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 transition"
                  required
                />
              </div>
              {errors.last_name && <p className="text-red-600 text-xs mt-1">{errors.last_name}</p>}
            </div>
          </div>

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
            {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone Field */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 9876543210"
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#FF6A28] focus:ring-2 focus:ring-[#FF6A28]/20 transition"
              />
            </div>
            {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
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
            {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-[#FF6A28] font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
        </div>
      </div>
    </div>
  );
};
