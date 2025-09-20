import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-t from-black via-gray-900 to-gray-800 text-white border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              {/* Updated logo to match navbar */}
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg border border-white/20">
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white rounded-full"></div>
                    <div className="absolute w-2 h-0.5 bg-white rounded-full transform rotate-45 translate-x-0.5 translate-y-0.5"></div>
                  </div>
                </div>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">QuickSnack</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Fast grocery and snack delivery service bringing fresh products to your doorstep in minutes.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-white/10 transition-all duration-300"
                aria-label="Follow us on Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-blue-400 hover:bg-white/10 transition-all duration-300"
                aria-label="Follow us on X (Twitter)"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/imvyomverma" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/5 rounded-lg text-gray-400 hover:text-pink-400 hover:bg-white/10 transition-all duration-300"
                aria-label="Follow @imvyomverma on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  Categories
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  Offers & Deals
                </Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  Help & Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Customer Service</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-blue-400 transition-colors text-sm hover:translate-x-1 inline-block transition-transform duration-300">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Contact Info</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                  <a href="mailto:vyomverma2873@gmail.com" className="text-sm font-medium text-gray-300 hover:text-blue-400 transition-colors">
                    vyomverma2873@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-center space-x-3 group">
                <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors duration-300">
                  <Phone className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                  <a href="tel:8766355495" className="text-sm font-medium text-gray-300 hover:text-emerald-400 transition-colors">
                    8766355495
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3 group">
                <div className="p-2 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors duration-300 mt-0.5">
                  <MapPin className="w-4 h-4 text-purple-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Founder</p>
                  <p className="text-sm font-medium text-gray-300">Vyom Verma</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © 2024 QuickSnack. All rights reserved. Made with ❤️ by Vyom Verma
            </p>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
