import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Eye, EyeOff, ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { setAuthToken, setUser } from '@/lib/auth';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [useOTP, setUseOTP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetOtpSent, setResetOtpSent] = useState(false);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear messages when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }
    if (successMessage) {
      setSuccessMessage('');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!formData.email) {
      setErrorMessage('Email is required');
      return;
    }

    if (!useOTP && !formData.password) {
      setErrorMessage('Password is required');
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        email: formData.email,
        useOTP,
      };
      if (!useOTP) payload.password = formData.password;

      const response = await authAPI.login(payload);
      console.log("Login success:", response.data);
      setErrorMessage("");
      setSuccessMessage("Login successful!");

      if (response.data.requiresOTP) {
        setOtpSent(true);
        setSuccessMessage('OTP sent to your email');
      } else {
        // Direct login success
        setAuthToken(response.data.token);
        setUser(response.data.user);
        
        // Add smooth transition effect
        setTimeout(() => {
          // Fade out the current page
          document.body.style.transition = 'opacity 0.3s ease-out';
          document.body.style.opacity = '0.7';
          
          // Small delay for smooth visual transition
          setTimeout(() => {
            router.push('/');
          }, 200);
        }, 1000);
      }
    } catch (error: any) {
      if (error.code === 'ECONNABORTED') {
        // Request timed out (10s). If OTP flow, show OTP input anyway.
        if (useOTP) {
          setOtpSent(true);
          setSuccessMessage('If you didn\'t receive the OTP yet, please check spam or try again.');
        }
        setErrorMessage('Request timed out. Please try again.');
      } else if (error.response) {
        const status = error.response.status;
        console.error("Login failed:", error.response.data);
        if (status === 400 || status === 401) {
          setErrorMessage("Invalid email or password. Please try again.");
        } else if (status === 500) {
          // Handle the specific 500 Internal Server Error
          const errorMessage = error.response.data?.message || "Internal server error";
          setErrorMessage(`Server error: ${errorMessage}. Please try again later or contact support.`);
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!otp || otp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyLoginOTP({
        email: formData.email,
        otp,
      });
      console.log("OTP verified:", response.data);
      setErrorMessage("");
      setSuccessMessage("OTP verified successfully! Logging you in...");

      setAuthToken(response.data.token);
      setUser(response.data.user);
      
      // Add smooth transition effect
      setTimeout(() => {
        // Fade out the current page
        document.body.style.transition = 'opacity 0.3s ease-out';
        document.body.style.opacity = '0.7';
        
        // Small delay for smooth visual transition
        setTimeout(() => {
          router.push('/');
        }, 200);
      }, 1000);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        console.error("OTP verification failed:", error.response.data);
        if (status === 400 || status === 401) {
          setErrorMessage("Invalid or expired OTP. Please try again.");
        } else if (status === 500) {
          // Handle the specific 500 Internal Server Error
          const errorMessage = error.response.data?.message || "Internal server error";
          setErrorMessage(`Server error: ${errorMessage}. Please try again later or contact support.`);
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setOtpSent(false);
    setOtp('');
    setUseOTP(false);
    setFormData({ email: '', password: '' });
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleForgotPassword = async () => {
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!formData.email) {
      setErrorMessage('Please enter your email address first');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword({
        email: formData.email,
      });
      console.log("Forgot password:", response.data);
      setErrorMessage("");
      setSuccessMessage("Reset OTP sent! Check your email.");
      setResetPasswordMode(true);
      setResetOtpSent(true);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        console.error("Forgot password failed:", error.response.data);
        if (status === 400 || status === 404) {
          setErrorMessage("Email not found. Please check and try again.");
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!resetOtp || resetOtp.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyResetOTP({
        email: formData.email,
        otp: resetOtp,
      });
      console.log("Reset OTP verified:", response.data);
      setErrorMessage("");
      setSuccessMessage("OTP verified! Now set your new password.");
      setResetOtpSent(false); // Move to password reset step
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        console.error("Reset OTP verification failed:", error.response.data);
        if (status === 400 || status === 401) {
          setErrorMessage("Invalid or expired OTP. Please try again.");
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous messages
    setErrorMessage('');
    setSuccessMessage('');
    
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email: formData.email,
        otp: resetOtp,
        newPassword: newPassword,
      });
      console.log("Password reset successful:", response.data);
      setErrorMessage("");
      setSuccessMessage("Password reset successful! You can now login with your new password.");
      
      // Reset all states after successful password reset
      setTimeout(() => {
        setResetPasswordMode(false);
        setResetOtpSent(false);
        setResetOtp('');
        setNewPassword('');
        setSuccessMessage('');
      }, 3000);
    } catch (error: any) {
      if (error.response) {
        const status = error.response.status;
        console.error("Password reset failed:", error.response.data);
        if (status === 400 || status === 401) {
          setErrorMessage("Invalid or expired OTP. Please try again.");
        } else {
          setErrorMessage("Server error. Please try again later.");
        }
      } else {
        console.error("Unexpected error:", error);
        setErrorMessage("Network error. Please check your connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetAllForms = () => {
    setOtpSent(false);
    setOtp('');
    setUseOTP(false);
    setResetPasswordMode(false);
    setResetOtpSent(false);
    setResetOtp('');
    setNewPassword('');
    setFormData({ email: '', password: '' });
    setErrorMessage('');
    setSuccessMessage('');
  };

  return (
    <>
      <Head>
        <title>Login - QuickSnack</title>
        <meta name="description" content="Login to your QuickSnack account" />
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

          {/* Login Card */}
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
                {resetPasswordMode 
                  ? (resetOtpSent ? 'Verify Reset OTP' : 'Set New Password')
                  : otpSent 
                  ? 'Verify OTP' 
                  : 'Welcome Back'
                }
              </h1>
              <p className="text-gray-400 text-lg">
                {resetPasswordMode 
                  ? (resetOtpSent 
                    ? `Enter the reset OTP sent to ${formData.email}`
                    : 'Enter your new password'
                  )
                  : otpSent 
                  ? `Enter the OTP sent to ${formData.email}`
                  : 'Sign in to your QuickSnack account'
                }
              </p>
            </div>

            {resetPasswordMode ? (
              resetOtpSent ? (
                /* Reset OTP Verification Form */
                <form onSubmit={handleResetOTPVerification} className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">
                      Enter Reset OTP
                    </label>
                    <input
                      type="text"
                      value={resetOtp}
                      onChange={(e) => {
                        setResetOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                        if (errorMessage) setErrorMessage('');
                        if (successMessage) setSuccessMessage('');
                      }}
                      placeholder="123456"
                      className="input-field text-center text-2xl tracking-widest font-bold"
                      maxLength={6}
                      required
                    />
                  </div>

                  {/* Message Display for Reset OTP Form */}
                  {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
                  {successMessage && <p className="text-green-500 mt-2 text-sm">{successMessage}</p>}

                  <button
                    type="submit"
                    disabled={isLoading || resetOtp.length !== 6}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      'Verify Reset OTP'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetAllForms}
                    className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Back to Login
                  </button>
                </form>
              ) : (
                /* New Password Form */
                <form onSubmit={handlePasswordReset} className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-white mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errorMessage) setErrorMessage('');
                          if (successMessage) setSuccessMessage('');
                        }}
                        className="w-full px-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-mint-green focus:border-transparent"
                        placeholder="Enter your new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Message Display for New Password Form */}
                  {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
                  {successMessage && <p className="text-green-500 mt-2 text-sm">{successMessage}</p>}

                  <button
                    type="submit"
                    disabled={isLoading || newPassword.length < 6}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                    ) : (
                      'Reset Password'
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={resetAllForms}
                    className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors font-medium"
                  >
                    Back to Login
                  </button>
                </form>
              )
            ) : otpSent ? (
              /* OTP Verification Form */
              <form onSubmit={handleOTPVerification} className="space-y-8">
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="123456"
                    className="input-field text-center text-2xl tracking-widest font-bold"
                    maxLength={6}
                    required
                  />
                </div>

                {/* Message Display for OTP Form */}
                {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 mt-2 text-sm">{successMessage}</p>}

                <button
                  type="submit"
                  disabled={isLoading || otp.length !== 6}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                  ) : (
                    'Verify OTP'
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors font-medium"
                >
                  Back to Login
                </button>
              </form>
            ) : (
              /* Login Form */
              <form onSubmit={handleLogin} className="space-y-8">
                {/* Email Field */}
                <div>
                  <label className="block text-sm font-bold text-white mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-mint-green focus:border-transparent"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                {/* Password Field (only if not using OTP) */}
                {!useOTP && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-mint-green focus:border-transparent"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* OTP Toggle */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={useOTP}
                      onChange={(e) => setUseOTP(e.target.checked)}
                      className="rounded border-gray-300 text-mint-green focus:ring-mint-green"
                    />
                    <span className="ml-2 text-sm text-gray-600">Login with OTP</span>
                  </label>
                  
                  {!useOTP && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-sm text-slate-blue-gray hover:underline bg-transparent border-none cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>

                {/* Message Display */}
                {errorMessage && <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>}
                {successMessage && <p className="text-green-500 mt-2 text-sm">{successMessage}</p>}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : useOTP ? (
                    'Send OTP'
                  ) : (
                    'Sign In'
                  )}
                </button>

                {/* Sign Up Link */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">Don't have an account? </span>
                  <Link href="/auth/signup" className="text-sm font-medium text-slate-blue-gray hover:underline">
                    Sign up
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

export default LoginPage;
