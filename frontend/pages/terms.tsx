import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { FileText, Users, ShoppingCart, Truck, CreditCard, Shield, AlertTriangle, Mail, Phone } from 'lucide-react';
import Layout from '@/components/Layout/Layout';

const TermsPage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      title: 'Acceptance of Terms',
      icon: <FileText className="w-6 h-6" />,
      content: [
        'By accessing and using QuickSnack services, you accept and agree to be bound by these Terms of Service',
        'If you do not agree to these terms, please do not use our services',
        'We reserve the right to modify these terms at any time with notice',
        'Continued use of our services after changes constitutes acceptance of new terms'
      ]
    },
    {
      id: 'eligibility',
      title: 'Eligibility and Account',
      icon: <Users className="w-6 h-6" />,
      content: [
        'You must be at least 18 years old to use our services',
        'You are responsible for maintaining the confidentiality of your account',
        'You agree to provide accurate and complete information when creating an account',
        'You are responsible for all activities that occur under your account',
        'One person or entity may not maintain more than one account'
      ]
    },
    {
      id: 'orders',
      title: 'Orders and Pricing',
      icon: <ShoppingCart className="w-6 h-6" />,
      content: [
        'All orders are subject to acceptance and availability',
        'Prices are subject to change without notice',
        'We reserve the right to refuse or cancel any order',
        'Minimum order value of $15 applies to all orders',
        'You agree to pay all charges incurred by your account',
        'Orders cannot be modified once processing has begun'
      ]
    },
    {
      id: 'delivery',
      title: 'Delivery Terms',
      icon: <Truck className="w-6 h-6" />,
      content: [
        'Delivery times are estimates and not guaranteed',
        'You must be available to receive delivery at the specified address',
        'We are not responsible for delays due to weather or circumstances beyond our control',
        'Delivery is only available in our service areas',
        'Additional charges may apply for deliveries to certain locations',
        'You must inspect items upon delivery and report any issues immediately'
      ]
    },
    {
      id: 'payment',
      title: 'Payment and Billing',
      icon: <CreditCard className="w-6 h-6" />,
      content: [
        'Payment is due at the time of order placement',
        'We accept major credit cards, debit cards, and other specified payment methods',
        'You authorize us to charge your payment method for all orders',
        'Refunds will be processed according to our refund policy',
        'You are responsible for any fees charged by your financial institution',
        'Disputed charges must be reported within 30 days'
      ]
    },
    {
      id: 'prohibited',
      title: 'Prohibited Uses',
      icon: <AlertTriangle className="w-6 h-6" />,
      content: [
        'You may not use our services for any illegal or unauthorized purpose',
        'You may not violate any laws in your jurisdiction',
        'You may not transmit any harmful or malicious code',
        'You may not attempt to gain unauthorized access to our systems',
        'You may not interfere with or disrupt our services',
        'You may not use our services to harass or harm others'
      ]
    }
  ];

  return (
    <>
      <Head>
        <title>Terms of Service - QuickSnack</title>
        <meta 
          name="description" 
          content="QuickSnack Terms of Service. Read our terms and conditions for using our grocery delivery service. Important legal information for all users." 
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
                  <FileText className="w-16 h-16 text-blue-400" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white">Terms of Service</h1>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto"
              >
                Please read these terms carefully before using our grocery delivery service.
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
                <h2 className="text-3xl font-bold text-white mb-6">Welcome to QuickSnack</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-6">
                  These Terms of Service ("Terms") govern your use of the QuickSnack grocery delivery service 
                  operated by QuickSnack ("us", "we", or "our"). Our service provides fast delivery of groceries, 
                  snacks, and daily essentials to your doorstep.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  By accessing or using our service, you agree to be bound by these Terms. If you disagree with 
                  any part of these terms, then you may not access the service.
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
                        <span className="text-gray-400 leading-relaxed text-lg">{item}</span>
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
                <h2 className="text-3xl font-bold text-white mb-8">Intellectual Property</h2>
                <p className="text-gray-400 leading-relaxed mb-6 text-lg">
                  The QuickSnack service and its original content, features, and functionality are and will remain 
                  the exclusive property of QuickSnack and its licensors. The service is protected by copyright, 
                  trademark, and other laws.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  You may not reproduce, distribute, modify, create derivative works of, publicly display, 
                  publicly perform, republish, download, store, or transmit any of the material on our service 
                  without prior written consent.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Limitation of Liability</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  In no event shall QuickSnack, nor its directors, employees, partners, agents, suppliers, or 
                  affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, 
                  including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Our total liability to you for all claims arising from or relating to the service shall not 
                  exceed the amount you paid us in the twelve (12) months preceding the claim.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Disclaimer</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  The information on this service is provided on an "as is" basis. To the fullest extent permitted 
                  by law, QuickSnack excludes all representations, warranties, conditions, and terms whether express 
                  or implied.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  We do not guarantee that our service will be uninterrupted, timely, secure, or error-free. 
                  We make no warranty that the service will meet your requirements or be available at any particular 
                  time or location.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Governing Law</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  These Terms shall be interpreted and governed by the laws of the jurisdiction in which QuickSnack 
                  operates, without regard to its conflict of law provisions.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Any disputes arising from these Terms or your use of the service shall be resolved through 
                  binding arbitration in accordance with the rules of the applicable arbitration association.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Changes to Terms</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                  If a revision is material, we will try to provide at least 30 days notice prior to any new 
                  terms taking effect.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  By continuing to access or use our service after those revisions become effective, you agree 
                  to be bound by the revised terms.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 mb-10 border border-white/10"
              >
                <h2 className="text-3xl font-bold text-white mb-8">Termination</h2>
                <p className="text-gray-400 leading-relaxed text-lg mb-4">
                  We may terminate or suspend your account immediately, without prior notice or liability, 
                  for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p className="text-gray-400 leading-relaxed text-lg">
                  Upon termination, your right to use the service will cease immediately. If you wish to 
                  terminate your account, you may simply discontinue using the service or contact our support team.
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
                  If you have any questions about these Terms of Service, please contact us:
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

export default TermsPage;
