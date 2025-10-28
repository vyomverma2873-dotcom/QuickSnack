import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Mail, Phone } from 'lucide-react';
import Layout from '@/components/Layout/Layout';

const PrivacyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: <Database className="w-6 h-6" />,
      content: [
        'Personal information you provide when creating an account (name, email, phone number)',
        'Delivery addresses and payment information',
        'Order history and preferences',
        'Device information and IP addresses',
        'Location data when you use our delivery services',
        'Communications between you and our customer service team'
      ]
    },
    {
      id: 'information-use',
      title: 'How We Use Your Information',
      icon: <Eye className="w-6 h-6" />,
      content: [
        'Process and fulfill your orders',
        'Provide customer support and respond to inquiries',
        'Send order confirmations, delivery updates, and important notices',
        'Improve our services and user experience',
        'Personalize product recommendations',
        'Prevent fraud and ensure platform security',
        'Comply with legal obligations'
      ]
    },
    {
      id: 'information-sharing',
      title: 'Information Sharing',
      icon: <Shield className="w-6 h-6" />,
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with delivery partners to fulfill orders',
        'Payment information is processed by secure third-party payment processors',
        'We may share data with service providers who help us operate our platform',
        'Information may be disclosed if required by law or to protect our rights',
        'Aggregated, non-personal data may be shared for business purposes'
      ]
    },
    {
      id: 'data-security',
      title: 'Data Security',
      icon: <Lock className="w-6 h-6" />,
      content: [
        'We use industry-standard SSL encryption to protect data transmission',
        'Payment information is processed using PCI DSS compliant systems',
        'Access to personal information is restricted to authorized personnel only',
        'Regular security audits and updates are performed',
        'Data is stored on secure servers with appropriate safeguards',
        'We have incident response procedures in place for any security breaches'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Privacy Policy - QuickSnack</title>
        <meta 
          name="description" 
          content="QuickSnack Privacy Policy. Learn how we collect, use, and protect your personal information. Your privacy and data security are our top priorities." 
        />
      </Head>

      <Layout>
        <div className="min-h-screen bg-near-white">
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
                  <Shield className="w-16 h-16 text-blue-400" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">Privacy Policy</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto"
              >
                Your privacy is important to us. This policy explains how we collect, use, and protect your information.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
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
                <h2 className="text-3xl font-bold text-white mb-6">Introduction</h2>
                <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                  At QuickSnack, we are committed to protecting your privacy and ensuring the security of your personal information. 
                  This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our 
                  grocery delivery service.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  By using our service, you agree to the collection and use of information in accordance with this policy. 
                  We will not use or share your information with anyone except as described in this Privacy Policy.
                </p>
              </motion.div>

              {/* Main Sections */}
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
                >
                  <div className="flex items-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white mr-6 shadow-lg">
                      {section.icon}
                    </div>
                    <h2 className="text-3xl font-bold text-white">{section.title}</h2>
                  </div>
                  <ul className="space-y-4">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-4 flex-shrink-0"></div>
                        <span className="text-gray-600 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}

              {/* Additional Sections */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Your Rights and Choices</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Access and Update</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      You can access and update your personal information through your account settings at any time.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Delete Account</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      You can request to delete your account and personal information by contacting our support team.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Marketing Communications</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      You can opt out of marketing communications at any time by clicking the unsubscribe link in emails or updating your preferences.
                    </p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Cookies and Tracking</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-6">
                  We use cookies and similar tracking technologies to enhance your experience on our platform. 
                  These technologies help us remember your preferences, analyze site traffic, and improve our services.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  You can control cookie settings through your browser preferences. However, disabling cookies may 
                  affect the functionality of our service. For more details, please see our Cookie Policy.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Children's Privacy</h2>
                <p className="text-gray-600 leading-relaxed">
                  Our service is not intended for children under the age of 13. We do not knowingly collect personal 
                  information from children under 13. If you are a parent or guardian and believe your child has 
                  provided us with personal information, please contact us immediately.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Changes to This Policy</h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting 
                  the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We encourage you to review this Privacy Policy periodically for any changes. Changes to this 
                  Privacy Policy are effective when they are posted on this page.
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
                <h2 className="text-3xl font-bold mb-8">Contact Us</h2>
                <p className="mb-8 opacity-90 text-lg">
                  If you have any questions about this Privacy Policy or our privacy practices, please contact us:
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

export default PrivacyPage;
