import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const router = useRouter();
  const [step, setStep] = useState<'email' | 'otp' | 'password' | 'success'>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.forgotPassword({
        email: formData.email
      });

      toast.success('Password reset OTP sent to your email');
      setStep('otp');
    } catch (error: any) {
      console.error('Forgot password error:', error);
      
      let message = 'Failed to send reset email. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 400) {
        message = 'User not found or not verified. Please check your email.';
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp || formData.otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.verifyResetOTP({
        email: formData.email,
        otp: formData.otp
      });

      setStep('password');
      toast.success('OTP verified! Please set your new password.');
    } catch (error: any) {
      console.error('OTP verification error:', error);
      
      let message = 'Invalid OTP. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 400) {
        message = 'Invalid or expired OTP. Please check and try again.';
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.newPassword) {
      toast.error('New password is required');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      const response = await authAPI.resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });

      toast.success('Password reset successful!');
      setStep('success');
    } catch (error: any) {
      console.error('Reset password error:', error);
      
      let message = 'Failed to reset password. Please try again.';
      
      if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.response?.status === 400) {
        message = 'Invalid or expired OTP. Please try again.';
      }
      
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    // Add smooth transition effect
    document.body.style.transition = 'opacity 0.3s ease-out';
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
      router.push('/auth/login');
    }, 200);
  };

  const renderStepContent = () => {
    switch (step) {
      case 'email':
        return (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email Address
              </label>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Reset OTP'
              )}
            </button>
          </form>
        );

      case 'otp':
        return (
          <form onSubmit={handleVerifyOTP} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Enter OTP
              </label>
              <input
                type="text"
                name="otp"
                value={formData.otp}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  otp: e.target.value.replace(/\D/g, '').slice(0, 6)
                }))}
                placeholder="123456"
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-mint-green focus:border-transparent text-center text-lg tracking-widest"
                maxLength={6}
                required
              />
              <p className="text-sm text-gray-400 mt-2">
                OTP sent to {formData.email}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || formData.otp.length !== 6}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-center text-sm text-gray-400 hover:text-blue-400 transition-colors"
            >
              Back to Email
            </button>
          </form>
        );

      case 'password':
        return (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-mint-green focus:border-transparent"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 pr-12 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-mint-green focus:border-transparent"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-medium transition-all hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        );

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Password Reset Successful!
              </h3>
              <p className="text-gray-600">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
            </div>

            <button
              onClick={handleBackToLogin}
              className="w-full btn-primary"
            >
              Back to Login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 'email':
        return 'Forgot Password';
      case 'otp':
        return 'Verify OTP';
      case 'password':
        return 'Set New Password';
      case 'success':
        return 'Success!';
      default:
        return 'Forgot Password';
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case 'email':
        return 'Enter your email to receive a password reset OTP';
      case 'otp':
        return 'Enter the 6-digit OTP sent to your email';
      case 'password':
        return 'Create a new secure password for your account';
      case 'success':
        return 'Your password has been successfully reset';
      default:
        return '';
    }
  };

  return (
    <>
      <Head>
        <title>Forgot Password - QuickSnack</title>
        <meta name="description" content="Reset your QuickSnack account password" />
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
            href="/auth/login"
            className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Login</span>
          </Link>

          {/* Reset Password Card */}
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
                {getStepTitle()}
              </h1>
              <p className="text-gray-400">
                {getStepDescription()}
              </p>
            </div>

            {/* Step Content */}
            {renderStepContent()}

            {/* Progress Indicator */}
            {step !== 'success' && (
              <div className="mt-8">
                <div className="flex items-center justify-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${step === 'email' ? 'bg-mint-green' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step === 'otp' ? 'bg-mint-green' : 'bg-gray-300'}`} />
                  <div className={`w-2 h-2 rounded-full ${step === 'password' ? 'bg-mint-green' : 'bg-gray-300'}`} />
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Step {step === 'email' ? '1' : step === 'otp' ? '2' : '3'} of 3
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
