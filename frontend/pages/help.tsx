import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  Clock, 
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Truck,
  CreditCard,
  ShoppingCart,
  User
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface HelpCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  color: string;
}

const faqs: FAQ[] = [
  {
    id: '1',
    question: 'How fast is the delivery?',
    answer: 'We deliver your orders within 15-30 minutes in most areas. Delivery time may vary based on your location and order size.',
    category: 'delivery'
  },
  {
    id: '2',
    question: 'What are the delivery charges?',
    answer: 'Delivery charges start from $2.99. Free delivery is available on orders above $30. Check our offers page for current promotions.',
    category: 'delivery'
  },
  {
    id: '3',
    question: 'How can I track my order?',
    answer: 'You can track your order in real-time through our app or website. You\'ll receive SMS updates and can see your delivery partner\'s location.',
    category: 'orders'
  },
  {
    id: '4',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards, PayPal, Apple Pay, Google Pay, and cash on delivery in select areas.',
    category: 'payment'
  },
  {
    id: '5',
    question: 'Can I cancel my order?',
    answer: 'Yes, you can cancel your order within 2 minutes of placing it. After that, cancellation may not be possible as we start preparing your order immediately.',
    category: 'orders'
  },
  {
    id: '6',
    question: 'Do you have a minimum order value?',
    answer: 'Yes, the minimum order value is $15. This helps us maintain our fast delivery promise and service quality.',
    category: 'orders'
  }
];

const helpCategories: HelpCategory[] = [
  {
    id: 'orders',
    title: 'Orders & Tracking',
    icon: <ShoppingCart className="w-6 h-6" />,
    description: 'Help with placing orders, tracking, and order management',
    color: 'from-mint-green to-sky-blue'
  },
  {
    id: 'delivery',
    title: 'Delivery & Shipping',
    icon: <Truck className="w-6 h-6" />,
    description: 'Information about delivery times, charges, and areas',
    color: 'from-sky-blue to-pale-blue'
  },
  {
    id: 'payment',
    title: 'Payment & Billing',
    icon: <CreditCard className="w-6 h-6" />,
    description: 'Payment methods, billing issues, and refunds',
    color: 'from-peach to-mint-green'
  },
  {
    id: 'account',
    title: 'Account & Profile',
    icon: <User className="w-6 h-6" />,
    description: 'Account settings, profile management, and security',
    color: 'from-peach to-sky-blue'
  }
];

const HelpPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <>
      <Head>
        <title>Help & Support - QuickSnack</title>
        <meta 
          name="description" 
          content="Get help with your QuickSnack orders. Find answers to common questions about delivery, payments, and more. 24/7 customer support available." 
        />
      </Head>

      <Layout>
        <div className="min-h-screen">
          {/* Header Section */}
          <section className="bg-gradient-to-br from-black via-gray-900 to-black py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-6xl font-bold text-white mb-8"
              >
                Help & Support
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto mb-12"
              >
                We're here to help! Find answers to common questions or get in touch with our support team.
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search for help..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 rounded-2xl bg-gray-800/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-gray-400 text-xl backdrop-blur-sm"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Quick Contact */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Need Immediate Help?</h2>
                <p className="text-gray-400 text-xl">Choose the best way to reach us</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="text-center p-10 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl mb-8 shadow-lg">
                    <Phone className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Call Us</h3>
                  <p className="text-gray-400 mb-6 text-lg">Speak directly with our support team</p>
                  <a 
                    href="tel:8766355495"
                    className="inline-flex items-center text-blue-400 font-bold hover:text-blue-300 transition-colors text-lg"
                  >
                    8766355495
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </a>
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    24/7 Available
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="text-center p-10 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 text-white rounded-2xl mb-8 shadow-lg">
                    <Mail className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">Email Us</h3>
                  <p className="text-gray-400 mb-6 text-lg">Send us a detailed message</p>
                  <a 
                    href="mailto:vyomverma2873@gmail.com"
                    className="inline-flex items-center text-blue-400 font-bold hover:text-blue-300 transition-colors text-lg"
                  >
                    vyomverma2873@gmail.com
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </a>
                  <div className="flex items-center justify-center mt-4 text-sm text-gray-400">
                    <Clock className="w-4 h-4 mr-2" />
                    Response within 2 hours
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ y: -8 }}
                  className="text-center p-10 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-2xl mb-8 shadow-lg">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-blue-gray mb-3">Live Chat</h3>
                  <p className="text-gray-600 mb-4">Chat with our support agents</p>
                  <button 
                    onClick={() => router.push('/contact')}
                    className="inline-flex items-center text-mint-green font-semibold hover:text-sky-blue transition-colors"
                  >
                    Start Chat
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                  <div className="flex items-center justify-center mt-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Usually online
                  </div>
                </motion.div>
              </div>

              {/* Help Categories */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Browse by Category</h2>
                <p className="text-gray-400 text-xl">Find help topics organized by category</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
                {helpCategories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`text-left p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                      selectedCategory === category.id ? 'border-blue-500' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-6 shadow-lg`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{category.title}</h3>
                    <p className="text-gray-400 text-lg">{category.description}</p>
                  </motion.button>
                ))}
              </div>

              {/* FAQ Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <p className="text-gray-400 text-xl">Quick answers to common questions</p>
              </motion.div>

              <div className="max-w-4xl mx-auto">
                {filteredFAQs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center">
                            <HelpCircle className="w-6 h-6 text-blue-400 mr-4" />
                            <span className="font-bold text-white text-lg">{faq.question}</span>
                          </div>
                          <ChevronDown 
                            className={`w-6 h-6 text-gray-400 transition-transform ${
                              openFAQ === faq.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {openFAQ === faq.id && (
                          <div className="px-8 pb-6">
                            <div className="pl-10 text-gray-400 leading-relaxed text-lg">
                              {faq.answer}
                            </div>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No results found</h3>
                    <p className="text-gray-400">Try adjusting your search or browse by category</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Still Need Help */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 text-white">Still Need Help?</h2>
                <p className="text-gray-400 text-xl mb-10">
                  Can't find what you're looking for? Our support team is here to help you 24/7.
                </p>
                <button
                  onClick={() => router.push('/contact')}
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  Contact Support
                  <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                </button>
              </motion.div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default HelpPage;
