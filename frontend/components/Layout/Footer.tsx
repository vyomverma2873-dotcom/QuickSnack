import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Zap, Heart, Coffee, Candy, Cookie, Leaf, Star, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-gray-900/50 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(59,130,246,0.1),transparent_50%)] opacity-50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(168,85,247,0.1),transparent_50%)] opacity-50" />
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            rotate: [0, 180, 360],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute top-20 left-20 text-4xl opacity-20"
        >
          🍕
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [20, -20, 20],
            x: [-10, 10, -10],
            opacity: [0.05, 0.2, 0.05]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 5
          }}
          className="absolute bottom-32 right-32 text-3xl opacity-20"
        >
          🥤
        </motion.div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Top Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center justify-center space-x-4 mb-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-2xl">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent">
              QuickSnack
            </span>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Lightning-fast delivery of premium snacks and beverages to your doorstep
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Categories Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-orange-400" />
              <span>Categories</span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/categories/snacks-and-munchies" className="group flex items-center space-x-3 text-gray-400 hover:text-orange-400 transition-all duration-300">
                  <div className="w-2 h-2 bg-orange-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Snacks & Munchies</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/cold-drinks" className="group flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-all duration-300">
                  <div className="w-2 h-2 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Cold Drinks</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/paan-corner" className="group flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-all duration-300">
                  <div className="w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Paan Corner</span>
                </Link>
              </li>
              <li>
                <Link href="/categories/sweet-tooth" className="group flex items-center space-x-3 text-gray-400 hover:text-pink-400 transition-all duration-300">
                  <div className="w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Sweet Tooth</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span>Quick Links</span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/about" className="group flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">About Us</span>
                </Link>
              </li>
              <li>
                <Link href="/categories" className="group flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">All Categories</span>
                </Link>
              </li>
              <li>
                <Link href="/offers" className="group flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Offers & Deals</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="group flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Help & Support</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-400" />
              <span>Support</span>
            </h3>
            <ul className="space-y-4">
              <li>
                <Link href="/contact" className="group flex items-center space-x-3 text-gray-400 hover:text-red-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Contact Us</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="group flex items-center space-x-3 text-gray-400 hover:text-red-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">FAQ</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="group flex items-center space-x-3 text-gray-400 hover:text-red-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link href="/terms" className="group flex items-center space-x-3 text-gray-400 hover:text-red-400 transition-all duration-300">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="group-hover:translate-x-2 transition-transform duration-300">Terms of Service</span>
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-purple-400" />
              <span>Get in Touch</span>
            </h3>
            <div className="space-y-6">
              <div className="group">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-blue-400/30 transition-all duration-300">
                  <div className="p-3 bg-blue-500/20 rounded-lg group-hover:bg-blue-500/30 transition-colors duration-300 flex-shrink-0">
                    <Mail className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Email</p>
                    <a href="mailto:vyomverma2873@gmail.com" className="text-sm font-semibold text-white hover:text-blue-400 transition-colors break-all">
                      vyomverma2873@gmail.com
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="group">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-emerald-400/30 transition-all duration-300">
                  <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors duration-300 flex-shrink-0">
                    <Phone className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Phone</p>
                    <a href="tel:8766355495" className="text-sm font-semibold text-white hover:text-emerald-400 transition-colors">
                      +91 8766355495
                    </a>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-400/30 transition-all duration-300">
                  <div className="p-3 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors duration-300 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">Founder</p>
                    <p className="text-sm font-semibold text-white">Vyom Verma</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <h3 className="text-2xl font-bold text-white mb-6">Follow Us</h3>
          <div className="flex justify-center space-x-6 mb-8">
            <motion.a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group p-4 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
              aria-label="Follow us on Facebook"
            >
              <Facebook className="w-6 h-6 text-white" />
            </motion.a>
            
            <motion.a
              href="https://x.com"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-2xl shadow-lg hover:shadow-gray-500/25 transition-all duration-300"
              aria-label="Follow us on X (Twitter)"
            >
              <Twitter className="w-6 h-6 text-white" />
            </motion.a>
            
            <motion.a
              href="https://instagram.com/imvyomverma"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="group p-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
              aria-label="Follow @imvyomverma on Instagram"
            >
              <Instagram className="w-6 h-6 text-white" />
            </motion.a>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="border-t border-white/10 mt-16 pt-12"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
            <div className="text-center lg:text-left">
              <p className="text-lg font-semibold text-white mb-2">
                © 2025 QuickSnack. All rights reserved.
              </p>
              <p className="text-gray-400 flex items-center justify-center lg:justify-start space-x-2">
                <span>Made with</span>
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                  className="text-red-400"
                >
                  ❤️
                </motion.span>
                <span>by</span>
                <span className="font-semibold text-white">Vyom Verma</span>
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end items-center gap-6">
              <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 font-medium">
                Privacy Policy
              </Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 font-medium">
                Terms of Service
              </Link>
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <Link href="/cookies" className="text-gray-400 hover:text-blue-400 transition-colors duration-300 font-medium">
                Cookie Policy
              </Link>
            </div>
          </div>
          
          {/* Final Touch */}
          <div className="text-center mt-8 pt-8 border-t border-white/5">
            <p className="text-sm text-gray-500">
              🚀 Delivering happiness, one snack at a time
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
