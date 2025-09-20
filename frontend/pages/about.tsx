import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Clock, Shield, Truck, Heart, Users, Award } from 'lucide-react';
import Layout from '@/components/Layout/Layout';

const AboutPage: React.FC = () => {
  const features = [
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lightning Fast Delivery",
      description: "Get your groceries and snacks delivered to your doorstep in under 30 minutes."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Quality Guaranteed",
      description: "We ensure all products meet our high quality standards before delivery."
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Wide Coverage",
      description: "Serving multiple cities with expanding delivery zones every month."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We're here to serve you better every day."
    }
  ];

  const stats = [
    { number: "50,000+", label: "Happy Customers" },
    { number: "10,000+", label: "Products Available" },
    { number: "25+", label: "Cities Covered" },
    { number: "99.9%", label: "Uptime Guarantee" }
  ];

  return (
    <>
      <Head>
        <title>About Us - QuickSnack</title>
        <meta 
          name="description" 
          content="Learn about QuickSnack's mission to deliver fresh groceries and snacks to your doorstep in minutes. Fast, reliable, and quality guaranteed." 
        />
      </Head>

      <Layout>
        <div className="min-h-screen">
          {/* Hero Section */}
          <section className="bg-gradient-to-br from-black via-gray-900 to-black py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-7xl font-bold text-white mb-8"
              >
                About QuickSnack
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto leading-relaxed"
              >
                We're revolutionizing grocery delivery by bringing fresh products to your doorstep 
                in minutes, not hours. Founded with a mission to make daily essentials accessible 
                to everyone, everywhere.
              </motion.p>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-4xl font-bold text-white mb-8">Our Mission</h2>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8">
                    At QuickSnack, we believe that getting quality groceries and snacks shouldn't be 
                    a time-consuming task. Our mission is to provide lightning-fast delivery of fresh, 
                    high-quality products while maintaining affordability and convenience.
                  </p>
                  <p className="text-gray-400 text-xl leading-relaxed">
                    We're committed to supporting local communities, reducing food waste, and making 
                    healthy eating accessible to everyone through our innovative delivery platform.
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-white/10">
                    <img 
                      src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&q=80"
                      alt="Fresh groceries"
                      className="rounded-xl shadow-2xl w-full"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Why Choose QuickSnack?</h2>
                <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                  We're more than just a delivery service. We're your trusted partner in making 
                  daily life easier and more convenient.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="text-center p-8 bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-2xl mb-6 shadow-lg">
                      {feature.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 text-lg">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Meet Our Founder</h2>
                <p className="text-gray-400 text-xl max-w-3xl mx-auto">
                  QuickSnack was founded with a vision to transform how people access daily essentials.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="max-w-lg mx-auto"
              >
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-1 rounded-3xl shadow-2xl">
                  <div className="bg-gray-900/50 backdrop-blur-sm rounded-3xl p-10 border border-white/10">
                    <div className="w-32 h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-full mx-auto mb-8 flex items-center justify-center shadow-2xl">
                      <span className="text-4xl font-bold text-white">VV</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">Vyom Verma</h3>
                    <p className="text-blue-400 font-bold mb-6 text-lg">Founder & CEO</p>
                    <p className="text-gray-400 text-lg leading-relaxed">
                      Passionate about technology and customer service, Vyom founded QuickSnack 
                      to make quality groceries accessible to everyone through innovative delivery solutions.
                    </p>
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

export default AboutPage;
