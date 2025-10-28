import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Search, 
  ChevronDown, 
  HelpCircle,
  Truck,
  CreditCard,
  ShoppingCart,
  User,
  Settings,
  Shield,
  ChevronRight
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

interface FAQCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  count: number;
}

const faqs: FAQ[] = [
  // Orders & Shopping
  {
    id: '1',
    question: 'How do I place an order?',
    answer: 'Simply browse our categories, add items to your cart, and proceed to checkout. You can create an account or checkout as a guest. We accept various payment methods for your convenience.',
    category: 'orders'
  },
  {
    id: '2',
    question: 'Can I modify or cancel my order?',
    answer: 'You can cancel your order within 2 minutes of placing it through your account dashboard. After that, cancellation may not be possible as we start preparing your order immediately to ensure fast delivery.',
    category: 'orders'
  },
  {
    id: '3',
    question: 'What is the minimum order value?',
    answer: 'The minimum order value is $15. This helps us maintain our fast delivery promise and service quality while keeping delivery costs reasonable.',
    category: 'orders'
  },
  {
    id: '4',
    question: 'Can I schedule a delivery for later?',
    answer: 'Currently, we focus on immediate delivery within 15-30 minutes. Scheduled delivery feature is coming soon! Follow us for updates.',
    category: 'orders'
  },

  // Delivery & Shipping
  {
    id: '5',
    question: 'How fast is the delivery?',
    answer: 'We deliver your orders within 15-30 minutes in most areas. Delivery time may vary based on your location, order size, and current demand. You can track your order in real-time.',
    category: 'delivery'
  },
  {
    id: '6',
    question: 'What are the delivery charges?',
    answer: 'Delivery charges start from $2.99. Free delivery is available on orders above $30. Check our offers page for current promotions and discount codes.',
    category: 'delivery'
  },
  {
    id: '7',
    question: 'Which areas do you deliver to?',
    answer: 'We currently serve 25+ cities and are rapidly expanding. Enter your address on our homepage to check if we deliver to your area. New areas are added regularly.',
    category: 'delivery'
  },
  {
    id: '8',
    question: 'How can I track my order?',
    answer: 'You can track your order in real-time through our app or website. You\'ll receive SMS updates and can see your delivery partner\'s location on the map.',
    category: 'delivery'
  },

  // Payment & Billing
  {
    id: '9',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and cash on delivery in select areas.',
    category: 'payment'
  },
  {
    id: '10',
    question: 'Is my payment information secure?',
    answer: 'Yes, absolutely! We use industry-standard SSL encryption and comply with PCI DSS standards. Your payment information is never stored on our servers and is processed by secure payment gateways.',
    category: 'payment'
  },
  {
    id: '11',
    question: 'How do refunds work?',
    answer: 'Refunds are processed within 3-5 business days to your original payment method. For damaged or incorrect items, we offer immediate refunds or replacements at no extra cost.',
    category: 'payment'
  },

  // Account & Profile
  {
    id: '12',
    question: 'Do I need to create an account?',
    answer: 'No, you can checkout as a guest. However, creating an account allows you to track orders, save addresses, view order history, and receive personalized offers.',
    category: 'account'
  },
  {
    id: '13',
    question: 'How do I reset my password?',
    answer: 'Click on "Forgot Password" on the login page, enter your email address, and we\'ll send you a reset link. Follow the instructions in the email to create a new password.',
    category: 'account'
  },
  {
    id: '14',
    question: 'Can I save multiple delivery addresses?',
    answer: 'Yes! You can save multiple addresses in your account - home, office, or any other location. This makes ordering even faster for your regular locations.',
    category: 'account'
  },

  // Products & Quality
  {
    id: '15',
    question: 'How do you ensure product quality?',
    answer: 'We work directly with trusted suppliers and conduct regular quality checks. All products are stored in temperature-controlled environments and have clear expiry date information.',
    category: 'products'
  },
  {
    id: '16',
    question: 'What if I receive damaged or wrong items?',
    answer: 'Contact us immediately through the app or call our support. We\'ll arrange for immediate replacement or full refund. Customer satisfaction is our top priority.',
    category: 'products'
  },
  {
    id: '17',
    question: 'Do you have organic products?',
    answer: 'Yes! We have a dedicated organic section with certified organic fruits, vegetables, dairy products, and more. Look for the "Organic" label on product listings.',
    category: 'products'
  }
];

const categories: FAQCategory[] = [
  {
    id: 'all',
    title: 'All Questions',
    icon: <HelpCircle className="w-5 h-5" />,
    color: 'from-slate-blue-gray to-gray-600',
    count: faqs.length
  },
  {
    id: 'orders',
    title: 'Orders & Shopping',
    icon: <ShoppingCart className="w-5 h-5" />,
    color: 'from-mint-green to-sky-blue',
    count: faqs.filter(faq => faq.category === 'orders').length
  },
  {
    id: 'delivery',
    title: 'Delivery & Shipping',
    icon: <Truck className="w-5 h-5" />,
    color: 'from-sky-blue to-pale-blue',
    count: faqs.filter(faq => faq.category === 'delivery').length
  },
  {
    id: 'payment',
    title: 'Payment & Billing',
    icon: <CreditCard className="w-5 h-5" />,
    color: 'from-peach to-mint-green',
    count: faqs.filter(faq => faq.category === 'payment').length
  },
  {
    id: 'account',
    title: 'Account & Profile',
    icon: <User className="w-5 h-5" />,
    color: 'from-peach to-sky-blue',
    count: faqs.filter(faq => faq.category === 'account').length
  },
  {
    id: 'products',
    title: 'Products & Quality',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-mint-green to-peach',
    count: faqs.filter(faq => faq.category === 'products').length
  }
];

const FAQPage: React.FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
        <title>Frequently Asked Questions - QuickSnack</title>
        <meta 
          name="description" 
          content="Find answers to common questions about QuickSnack. Learn about delivery, payments, orders, and more. Get help with your grocery delivery needs." 
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
                Frequently Asked Questions
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto mb-12"
              >
                Find quick answers to the most common questions about QuickSnack
              </motion.p>

              {/* Search Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="max-w-3xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-mint-green focus:border-transparent text-lg"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          {/* Categories */}
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Browse by Category</h2>
                <p className="text-gray-400 text-xl">Find answers organized by topic</p>
              </motion.div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-20">
                {categories.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`p-6 rounded-2xl text-center transition-all duration-500 ${
                      selectedCategory === category.id
                        ? 'bg-gray-900/50 backdrop-blur-sm shadow-2xl border-2 border-blue-500'
                        : 'bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-2xl border-2 border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-4 shadow-lg`}>
                      {category.icon}
                    </div>
                    <h3 className="font-bold text-white text-lg mb-2">{category.title}</h3>
                    <p className="text-sm text-gray-400">{category.count} questions</p>
                  </motion.button>
                ))}
              </div>

              {/* FAQ List */}
              <div className="max-w-4xl mx-auto">
                {filteredFAQs.length > 0 ? (
                  <div className="space-y-4">
                    {filteredFAQs.map((faq, index) => (
                      <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.05 }}
                        viewport={{ once: true }}
                        className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg border border-white/10 overflow-hidden hover:shadow-2xl transition-all duration-500"
                      >
                        <button
                          onClick={() => toggleFAQ(faq.id)}
                          className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-800/50 transition-colors"
                        >
                          <div className="flex items-center flex-1">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                              <span className="text-white font-bold text-sm">Q</span>
                            </div>
                            <span className="font-bold text-white pr-4 text-lg">{faq.question}</span>
                          </div>
                          <ChevronDown 
                            className={`w-6 h-6 text-gray-400 transition-transform flex-shrink-0 ${
                              openFAQ === faq.id ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        
                        {openFAQ === faq.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="px-6 pb-5"
                          >
                            <div className="pl-12 text-gray-600 leading-relaxed">
                              {faq.answer}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-16"
                  >
                    <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-500 mb-2">No results found</h3>
                    <p className="text-gray-400 mb-6">Try adjusting your search or browse by category</p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('all');
                      }}
                      className="text-mint-green font-semibold hover:text-sky-blue transition-colors"
                    >
                      Clear filters
                    </button>
                  </motion.div>
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
                <h2 className="text-4xl font-bold mb-6 text-white">Still Have Questions?</h2>
                <p className="text-gray-400 text-xl mb-10">
                  Can't find the answer you're looking for? Our support team is here to help you 24/7.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <button
                    onClick={() => router.push('/contact')}
                    className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                  >
                    Contact Support
                    <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                  <button
                    onClick={() => router.push('/help')}
                    className="inline-flex items-center px-10 py-4 border-2 border-blue-500 text-blue-400 font-bold rounded-xl hover:bg-blue-500 hover:text-white transition-all duration-300 group"
                  >
                    Browse Help Center
                    <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default FAQPage;
