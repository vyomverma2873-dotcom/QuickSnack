import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageCircle,
  User,
  MessageSquare
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  const contactMethods = [
    {
      icon: <Phone className="w-6 h-6" />,
      title: 'Phone Support',
      description: 'Call us for immediate assistance',
      contact: '8766355495',
      action: 'tel:8766355495',
      availability: '24/7 Available',
      color: 'from-mint-green to-sky-blue'
    },
    {
      icon: <Mail className="w-6 h-6" />,
      title: 'Email Support',
      description: 'Send us a detailed message',
      contact: 'vyomverma2873@gmail.com',
      action: 'mailto:vyomverma2873@gmail.com',
      availability: 'Response within 2 hours',
      color: 'from-sky-blue to-pale-blue'
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Start Chat',
      action: '#',
      availability: 'Usually online',
      color: 'from-peach to-mint-green'
    }
  ];

  return (
    <>
      <Head>
        <title>Contact Us - QuickSnack</title>
        <meta 
          name="description" 
          content="Get in touch with QuickSnack. Contact our customer support team via phone, email, or live chat. We're here to help 24/7." 
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
                Contact Us
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto"
              >
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </motion.p>
            </div>
          </section>

          {/* Contact Methods */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Get in Touch</h2>
                <p className="text-gray-400 text-xl">Choose the best way to reach us</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {contactMethods.map((method, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center p-10 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20"
                  >
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl mb-8 shadow-lg`}>
                      {method.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{method.title}</h3>
                    <p className="text-gray-400 mb-6 text-lg">{method.description}</p>
                    <a 
                      href={method.action}
                      className="inline-block text-blue-400 font-bold hover:text-blue-300 transition-colors mb-4 text-lg"
                    >
                      {method.contact}
                    </a>
                    <div className="flex items-center justify-center text-sm text-gray-400">
                      <Clock className="w-4 h-4 mr-2" />
                      {method.availability}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Contact Form and Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-white/10"
                >
                  <div className="flex items-center mb-8">
                    <div className="p-2 bg-blue-500/20 rounded-lg mr-4">
                      <MessageSquare className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white">Send us a Message</h3>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-lg font-medium text-white mb-3">
                          Full Name *
                        </label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="email" className="block text-lg font-medium text-white mb-3">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-6 h-6" />
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-gray-400 text-lg backdrop-blur-sm"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-lg font-medium text-white mb-3">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-4 bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white text-lg backdrop-blur-sm"
                      >
                        <option value="" className="bg-gray-800 text-gray-400">Select a subject</option>
                        <option value="order-inquiry" className="bg-gray-800 text-white">Order Inquiry</option>
                        <option value="delivery-issue" className="bg-gray-800 text-white">Delivery Issue</option>
                        <option value="payment-problem" className="bg-gray-800 text-white">Payment Problem</option>
                        <option value="product-feedback" className="bg-gray-800 text-white">Product Feedback</option>
                        <option value="general-support" className="bg-gray-800 text-white">General Support</option>
                        <option value="partnership" className="bg-gray-800 text-white">Partnership Inquiry</option>
                        <option value="other" className="bg-gray-800 text-white">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-lg font-medium text-white mb-3">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-4 bg-gray-800/50 border border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400/50 focus:border-blue-400/50 text-white placeholder-gray-400 text-lg backdrop-blur-sm resize-none"
                        placeholder="Tell us how we can help you..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                    >
                      {isSubmitting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Send className="w-5 h-5 mr-2" />
                      )}
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="space-y-8"
                >
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg p-10 border border-white/10">
                    <h3 className="text-3xl font-bold text-white mb-8">Contact Information</h3>
                    
                    <div className="space-y-8">
                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Phone className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-2 text-xl">Phone</h4>
                          <p className="text-gray-400 text-lg">8766355495</p>
                          <p className="text-sm text-gray-500">Available 24/7</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Mail className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white mb-2 text-xl">Email</h4>
                          <p className="text-gray-400 text-lg">vyomverma2873@gmail.com</p>
                          <p className="text-sm text-gray-500">Response within 2 hours</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-slate-blue-gray mb-1">Founder</h4>
                          <p className="text-gray-600">Vyom Verma</p>
                          <p className="text-sm text-gray-500">QuickSnack Founder & CEO</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-10 text-white shadow-2xl">
                    <h3 className="text-2xl font-bold mb-6">Business Hours</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between text-lg">
                        <span>Customer Support:</span>
                        <span className="font-bold">24/7</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Delivery Hours:</span>
                        <span className="font-bold">6:00 AM - 11:00 PM</span>
                      </div>
                      <div className="flex justify-between text-lg">
                        <span>Order Processing:</span>
                        <span className="font-bold">24/7</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
};

export default ContactPage;
