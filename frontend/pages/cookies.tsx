import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Cookie, Settings, Shield, BarChart, Target, Mail, Phone, Check, X } from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

const CookiesPage: React.FC = () => {
  const [cookieSettings, setCookieSettings] = useState({
    necessary: true, // Always true, cannot be disabled
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handleSettingChange = (setting: string, value: boolean) => {
    if (setting === 'necessary') return; // Cannot disable necessary cookies
    
    setCookieSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const saveSettings = () => {
    // In a real app, you would save these settings to localStorage or send to server
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    toast.success('Cookie preferences saved successfully!');
  };

  const cookieTypes = [
    {
      id: 'necessary',
      title: 'Necessary Cookies',
      icon: <Shield className="w-6 h-6" />,
      description: 'These cookies are essential for the website to function properly. They enable basic functions like page navigation and access to secure areas.',
      examples: [
        'Authentication and login status',
        'Shopping cart contents',
        'Security and fraud prevention',
        'Load balancing and performance'
      ],
      color: 'from-slate-blue-gray to-gray-600',
      required: true
    },
    {
      id: 'analytics',
      title: 'Analytics Cookies',
      icon: <BarChart className="w-6 h-6" />,
      description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
      examples: [
        'Page views and user behavior',
        'Popular products and categories',
        'Site performance metrics',
        'Error tracking and debugging'
      ],
      color: 'from-mint-green to-sky-blue',
      required: false
    },
    {
      id: 'marketing',
      title: 'Marketing Cookies',
      icon: <Target className="w-6 h-6" />,
      description: 'These cookies are used to deliver personalized advertisements and track the effectiveness of our marketing campaigns.',
      examples: [
        'Personalized product recommendations',
        'Targeted advertisements',
        'Social media integration',
        'Marketing campaign tracking'
      ],
      color: 'from-peach to-mint-green',
      required: false
    },
    {
      id: 'preferences',
      title: 'Preference Cookies',
      icon: <Settings className="w-6 h-6" />,
      description: 'These cookies remember your preferences and settings to provide a more personalized experience.',
      examples: [
        'Language and region settings',
        'Display preferences',
        'Saved addresses and payment methods',
        'Notification preferences'
      ],
      color: 'from-sky-blue to-pale-blue',
      required: false
    }
  ];

  return (
    <>
      <Head>
        <title>Cookie Policy - QuickSnack</title>
        <meta 
          name="description" 
          content="QuickSnack Cookie Policy. Learn about how we use cookies to improve your experience and manage your cookie preferences." 
        />
      </Head>

      <Layout>
        <div className="min-h-screen">
          {/* Header Section */}
          <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center mb-8"
              >
                <div className="p-3 bg-blue-500/20 rounded-2xl mr-6">
                  <Cookie className="w-16 h-16 text-blue-400" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">Cookie Policy</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto"
              >
                Learn about how we use cookies and manage your preferences to enhance your experience.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-gray-400 mt-6 text-lg"
              >
                Last updated: December 1, 2024
              </motion.p>
            </div>
          </section>

          {/* Content */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Introduction */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-4">What Are Cookies?</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  Cookies are small text files that are placed on your computer or mobile device when you visit 
                  our website. They help us provide you with a better experience by remembering your preferences 
                  and understanding how you use our service.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  We use cookies and similar technologies to enhance functionality, analyze usage, and deliver 
                  personalized content. This policy explains what cookies we use, why we use them, and how you 
                  can manage your preferences.
                </p>
              </motion.div>

              {/* Cookie Settings Panel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-10 text-white mb-12 shadow-2xl"
              >
                <h2 className="text-3xl font-bold mb-8">Manage Your Cookie Preferences</h2>
                <p className="mb-8 opacity-90 text-lg">
                  You can control which cookies we use below. Note that disabling some cookies may affect 
                  the functionality of our website.
                </p>
                <button
                  onClick={saveSettings}
                  className="bg-white text-gray-900 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-colors text-lg shadow-lg"
                >
                  Save Preferences
                </button>
              </motion.div>

              {/* Cookie Types */}
              {cookieTypes.map((type, index) => (
                <motion.div
                  key={type.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="flex items-center">
                      <div className={`w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mr-6 shadow-lg`}>
                        {type.icon}
                      </div>
                      <div>
                        <h3 className="text-3xl font-bold text-white">{type.title}</h3>
                        {type.required && (
                          <span className="inline-block bg-red-500/20 text-red-400 text-sm px-3 py-1.5 rounded-full mt-2 border border-red-500/30">
                            Required
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Toggle Switch */}
                    <div className="flex items-center">
                      <button
                        onClick={() => handleSettingChange(type.id, !cookieSettings[type.id as keyof typeof cookieSettings])}
                        disabled={type.required}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          cookieSettings[type.id as keyof typeof cookieSettings]
                            ? 'bg-mint-green'
                            : 'bg-gray-300'
                        } ${type.required ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            cookieSettings[type.id as keyof typeof cookieSettings]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <p className="text-gray-400 leading-relaxed text-lg mb-6">{type.description}</p>

                  <div>
                    <h4 className="font-semibold text-slate-blue-gray mb-3">Examples of use:</h4>
                    <ul className="space-y-2">
                      {type.examples.map((example, exampleIndex) => (
                        <li key={exampleIndex} className="flex items-start">
                          <div className="w-2 h-2 bg-mint-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                          <span className="text-gray-400">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              ))}

              {/* Additional Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Third-Party Cookies</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  Some cookies on our site are set by third-party services that appear on our pages. These may include:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-mint-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-400">Google Analytics for website analytics</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-mint-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-400">Payment processors for secure transactions</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-mint-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-400">Social media platforms for sharing features</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-mint-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-400">Customer support chat services</span>
                  </li>
                </ul>
                <p className="text-gray-400 leading-relaxed text-lg">
                  These third parties have their own privacy policies and cookie policies. We recommend reviewing 
                  their policies to understand how they use your information.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Managing Cookies in Your Browser</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  You can also control cookies through your browser settings. Most browsers allow you to:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-mint-green mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">View what cookies are stored on your device</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-mint-green mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Delete cookies individually or all at once</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-mint-green mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Block cookies from specific websites</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="w-5 h-5 text-mint-green mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-gray-400">Block all cookies (not recommended)</span>
                  </li>
                </ul>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Please note that blocking or deleting cookies may affect your ability to use certain features 
                  of our website and may impact your overall experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-6">Updates to This Policy</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  We may update this Cookie Policy from time to time to reflect changes in our practices or 
                  for other operational, legal, or regulatory reasons.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  We encourage you to review this policy periodically to stay informed about how we use cookies. 
                  The "Last updated" date at the top of this page indicates when this policy was last revised.
                </p>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-10 text-white shadow-2xl"
              >
                <h2 className="text-3xl font-bold mb-8">Questions About Cookies?</h2>
                <p className="mb-8 opacity-90 text-lg">
                  If you have any questions about our use of cookies, please don't hesitate to contact us:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 rounded-xl mr-4">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Email</p>
                      <p className="opacity-90 text-lg">vyomverma2873@gmail.com</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="p-3 bg-white/20 rounded-xl mr-4">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-lg">Phone</p>
                      <p className="opacity-90 text-lg">8766355495</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default CookiesPage;
