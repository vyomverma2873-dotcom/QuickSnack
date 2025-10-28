import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Shield, ArrowLeft, AlertTriangle, LogIn } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import Link from 'next/link';
import { isAuthenticated, getUser } from '@/lib/auth';

const UnauthorizedPage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authenticated = isAuthenticated();
    setIsLoggedIn(authenticated);
    if (authenticated) {
      setUser(getUser());
    }
  }, []);

  return (
    <>
      <Head>
        <title>Unauthorized Access - QuickSnack Admin</title>
        <meta name="description" content="Unauthorized access to admin panel" />
      </Head>

      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-blue-gray/5 to-mint-green/10 flex items-center justify-center pt-20 pb-12">
          <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 text-center"
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Shield className="w-10 h-10 text-red-600" />
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-2xl font-bold text-slate-blue-gray mb-4"
              >
                Access Denied
              </motion.h1>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mb-6"
              >
                <div className="flex items-center justify-center gap-2 mb-3">
                  {!isLoggedIn ? (
                    <>
                      <LogIn className="w-5 h-5 text-blue-600" />
                      <span className="text-slate-blue-gray/70 font-medium">Login Required</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-yellow-600" />
                      <span className="text-slate-blue-gray/70 font-medium">Admin Access Required</span>
                    </>
                  )}
                </div>
                
                {!isLoggedIn ? (
                  <p className="text-slate-blue-gray/70 text-sm leading-relaxed">
                    You need to be logged in to access the admin panel. Please login with the authorized admin account.
                  </p>
                ) : (
                  <div>
                    <p className="text-slate-blue-gray/70 text-sm leading-relaxed mb-3">
                      Hi <strong>{user?.name || 'User'}</strong> ({user?.email}),
                    </p>
                    <p className="text-slate-blue-gray/70 text-sm leading-relaxed">
                      This admin panel is restricted to authorized administrators only. 
                      Your account does not have admin privileges.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Admin Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="bg-light-grayish-blue/50 rounded-xl p-4 mb-6"
              >
                <p className="text-xs text-slate-blue-gray/60 mb-2">Administrator Contact:</p>
                <p className="text-sm font-medium text-slate-blue-gray">vyomverma2873@gmail.com</p>
                <p className="text-xs text-slate-blue-gray/60 mt-1">+91 8766355495</p>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-3 justify-center"
              >
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/auth/login"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <LogIn className="w-4 h-4" />
                      Login as Admin
                    </Link>
                    <Link
                      href="/"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-blue-gray/10 text-slate-blue-gray font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back to Home
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-mint-green to-peach text-slate-blue-gray font-semibold rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                  </Link>
                )}
              </motion.div>

              {/* Footer */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-xs text-slate-blue-gray/50 mt-6"
              >
                QuickSnack Admin Panel - Secure Access
              </motion.p>
            </motion.div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default UnauthorizedPage;
