import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Alert } from '../components/Alert';
import { User, Mail, Lock, Phone, Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const navigate = useNavigate();
  const { register, loading } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
    const special = /[!@#$%^&*(),.?":{}|<>_\-\\\/\[\];'`+=~]/;
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
    setErrors({});

    // client-side validation
    const validationErrors = validateAll(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      navigate('/');
    } else {
      if (typeof result.error === 'object') {
        setErrors(result.error);
      } else {
        setErrors({ general: result.error });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center py-12 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-slide-in">
        <h1 className="text-3xl font-bold text-center mb-2 gradient-text">Join CaterHub</h1>
        <p className="text-center text-gray-600 mb-8">Create your account to get started</p>

        {errors.general && <Alert type="error" message={errors.general} />}

        <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
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
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
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
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
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
                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
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
                className="w-full pl-10 pr-10 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-600 transition"
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
          <Link to="/login" className="text-purple-600 font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
