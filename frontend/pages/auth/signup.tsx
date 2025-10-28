import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { setAuthToken, setUser } from '@/lib/auth';
import toast from 'react-hot-toast';

const SignupPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return false;
    }
    if (!formData.email.trim()) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.phone.trim()) {
      toast.error('Phone number is required');
      return false;
    }
    if (formData.phone.replace(/\D/g, '').length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const signupData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.replace(/\D/g, ''),
        password: formData.password || undefined
      };
      
      console.log('Sending signup data:', signupData);
      const response = await authAPI.signup(signupData);

      setTempUserData(response.data.tempData);
      setOtpSent(true);
      toast.success('OTP sent to your email. Please verify to complete signup.');
    } catch (error: any) {
      console.error('Signup error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      let message = 'Signup failed. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 400) {
        message = 'Invalid signup data. Please check your information.';
      } else if (error.response?.status === 409) {
        message = 'User already exists with this email.';
      } else if (error.message) {
        message = error.message;
      }
      
      console.log('Showing error message:', message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous error message
    setErrorMessage('');
    
    if (!otp || otp.length !== 6) {
      const error = 'Please enter a valid 6-digit OTP';
      setErrorMessage(error);
      toast.error(error);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyOTP({
        email: formData.email,
        otp,
        userData: tempUserData
      });

      setAuthToken(response.data.token);
      setUser(response.data.user);
      const toastId = toast.success('Account created successfully! Welcome to QuickSnack!', {
        duration: 1000,
      });
      
      // Add smooth transition effect
      setTimeout(() => {
        // Fade out the current page
        document.body.style.transition = 'opacity 0.3s ease-out';
        document.body.style.opacity = '0.7';
        
        // Dismiss toast and redirect with smooth transition
        toast.dismiss(toastId);
        
        // Small delay for smooth visual transition
        setTimeout(() => {
          router.push('/');
        }, 200);
      }, 1000);
    } catch (error: any) {
      // Comprehensive error handling to prevent runtime overlay
      console.error('OTP verification error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let message = 'Something went wrong. Please try again.';
      
      // Check for structured error messages from backend
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 400) {
        message = 'Invalid OTP. Please try again.';
      } else if (error.response?.status === 401) {
        message = 'OTP has expired. Please request a new one.';
      } else if (error.response?.status === 404) {
        message = 'OTP not found. Please request a new one.';
      } else if (error.response?.status >= 500) {
        message = 'Server error. Please try again later.';
      } else if (error.code === 'ERR_NETWORK') {
        message = 'Network error. Please check your connection.';
      } else if (error.message && error.message !== 'Network Error') {
        message = 'Something went wrong. Please try again.';
      }
      
      // Set inline error message as fallback
      setErrorMessage(message);
      
      // Show user-friendly error message
      toast.error(message, {
        duration: 4000,
        position: 'top-center',
      });
      
      // Log technical details for debugging (not shown to user)
      console.log('Showing OTP error message:', message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setTempUserData(null);
    setErrorMessage('');
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
      return numbers;
    }
    return numbers.slice(0, 10);
  };

  return (
    <>
      <Head>
        <title>Sign Up - QuickSnack</title>
        <meta name="description" content="Create your QuickSnack account" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Back Button */}
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>

          {/* Signup Card */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-white/10">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <div className="relative w-12 h-12">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-white rounded-full"></div>
                    <div className="absolute w-4 h-1 bg-white rounded-full transform rotate-45 translate-x-1 translate-y-1"></div>
                  </div>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">
                {otpSent ? 'Verify Your Email' : 'Join QuickSnack'}
              </h1>
              <p className="text-gray-600">
                {otpSent 
                  ? `Enter the OTP sent to ${formData.email}`
                  : 'Create your account to start ordering'
                }
              </p>
            </div>

            {otpSent ? (
              /* OTP Verification Form */
              <form onSubmit={handleOTPVerification} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                      // Clear error message when user starts typing
                      if (errorMessage) {
                        setErrorMessage('');
                      }
                    }}
                    placeholder="123456"
                    className="input-field text-center text-lg tracking-widest"
                    maxLength={6}
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    OTP is valid for 10 minutes
                  </p>
                </div>

                {/* Error Message Display */}
                {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Verify & Create Account'
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full text-center text-sm text-gray-600 hover:text-slate-blue-gray transition-colors"
                >
                  Back to Sign Up
                </button>
              </form>
            ) : (
              /* Signup Form */
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="input-field px-4"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      className="input-field px-4"
                      required
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        phone: formatPhoneNumber(e.target.value)
                      }))}
                      placeholder="10-digit phone number"
                      className="input-field px-4"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                {/* Password Field (Optional) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password <span className="text-gray-400 text-xs">(Optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a password (optional)"
                      className="input-field px-4 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    You can always login with OTP if you skip this
                  </p>
                </div>

                {/* Terms & Conditions */}
                <div className="text-xs text-gray-600">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="text-slate-blue-gray hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-slate-blue-gray hover:underline">
                    Privacy Policy
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    'Create Account'
                  )}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">Already have an account? </span>
                  <Link href="/auth/login" className="text-sm font-medium text-slate-blue-gray hover:underline">
                    Sign in
                  </Link>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default SignupPage;
