import React, { useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Percent, 
  Clock, 
  Gift, 
  Star, 
  Tag, 
  Zap,
  ChevronRight,
  Copy,
  Check
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';
import toast from 'react-hot-toast';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validUntil: string;
  type: 'percentage' | 'fixed' | 'bogo' | 'free-delivery';
  minOrder?: number;
  category?: string;
  featured?: boolean;
}

const offers: Offer[] = [
  {
    id: 'welcome50',
    title: 'Welcome Offer',
    description: 'Get 50% off on your first order. Perfect for new customers!',
    discount: '50% OFF',
    code: 'WELCOME50',
    validUntil: '2024-12-31',
    type: 'percentage',
    minOrder: 25,
    featured: true
  },
  {
    id: 'free-delivery',
    title: 'Free Delivery',
    description: 'Free delivery on orders above $30. No delivery charges!',
    discount: 'FREE DELIVERY',
    code: 'FREEDEL30',
    validUntil: '2024-12-31',
    type: 'free-delivery',
    minOrder: 30
  },
  {
    id: 'fruits20',
    title: 'Fresh Fruits Deal',
    description: '20% off on all fresh fruits. Healthy eating made affordable!',
    discount: '20% OFF',
    code: 'FRUITS20',
    validUntil: '2024-11-30',
    type: 'percentage',
    category: 'fruits',
    featured: true
  },
  {
    id: 'snacks-bogo',
    title: 'Snacks BOGO',
    description: 'Buy one get one free on selected snacks and munchies.',
    discount: 'BOGO',
    code: 'SNACKBOGO',
    validUntil: '2024-11-15',
    type: 'bogo',
    category: 'snacks'
  },
  {
    id: 'dairy15',
    title: 'Dairy Discount',
    description: '15% off on all dairy products including milk, cheese, and yogurt.',
    discount: '15% OFF',
    code: 'DAIRY15',
    validUntil: '2024-11-20',
    type: 'percentage',
    category: 'dairy'
  },
  {
    id: 'weekend25',
    title: 'Weekend Special',
    description: '25% off on weekend orders. Make your weekends special!',
    discount: '25% OFF',
    code: 'WEEKEND25',
    validUntil: '2024-12-31',
    type: 'percentage',
    minOrder: 40,
    featured: true
  }
];

const OffersPage: React.FC = () => {
  const router = useRouter();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success(`Code ${code} copied to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getOfferIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-6 h-6" />;
      case 'fixed':
        return <Tag className="w-6 h-6" />;
      case 'bogo':
        return <Gift className="w-6 h-6" />;
      case 'free-delivery':
        return <Zap className="w-6 h-6" />;
      default:
        return <Star className="w-6 h-6" />;
    }
  };

  const getOfferColor = (type: string) => {
    switch (type) {
      case 'percentage':
        return 'from-mint-green to-sky-blue';
      case 'fixed':
        return 'from-peach to-mint-green';
      case 'bogo':
        return 'from-sky-blue to-pale-blue';
      case 'free-delivery':
        return 'from-peach to-sky-blue';
      default:
        return 'from-mint-green to-sky-blue';
    }
  };

  const featuredOffers = offers.filter(offer => offer.featured);
  const regularOffers = offers.filter(offer => !offer.featured);

  return (
    <>
      <Head>
        <title>Offers & Deals - QuickSnack</title>
        <meta 
          name="description" 
          content="Discover amazing offers and deals at QuickSnack. Save money on groceries, snacks, and daily essentials with our exclusive discount codes." 
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
                Offers & Deals
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto"
              >
                Save big on your favorite products with our exclusive offers and discount codes
              </motion.p>
            </div>
          </section>

          {/* Featured Offers */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">Featured Offers</h2>
                <p className="text-gray-400 text-xl">Don't miss out on these amazing deals!</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {featuredOffers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20"
                  >
                    {/* Featured Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-mint-green to-sky-blue text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>

                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getOfferColor(offer.type)} opacity-5`} />
                    
                    <div className="relative p-8">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${getOfferColor(offer.type)} text-white mb-6`}>
                        {getOfferIcon(offer.type)}
                      </div>

                      {/* Discount Badge */}
                      <div className="text-3xl font-bold text-slate-blue-gray mb-2">{offer.discount}</div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-slate-blue-gray mb-3">{offer.title}</h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 mb-6">{offer.description}</p>

                      {/* Code */}
                      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Code:</span>
                          <span className="font-mono font-bold text-slate-blue-gray ml-2">{offer.code}</span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(offer.code)}
                          className="flex items-center text-mint-green hover:text-sky-blue transition-colors"
                        >
                          {copiedCode === offer.code ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <Copy className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {/* Details */}
                      <div className="text-sm text-gray-500 space-y-1">
                        {offer.minOrder && (
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            Min order: ${offer.minOrder}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Valid until: {offer.validUntil}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* All Offers */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl font-bold text-white mb-6">All Offers</h2>
                <p className="text-gray-400 text-xl">More ways to save on your orders</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {regularOffers.map((offer, index) => (
                  <motion.div
                    key={offer.id}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="bg-gray-900/50 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20 p-8"
                  >
                    <div className="flex items-start space-x-6">
                      <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white flex items-center justify-center shadow-lg`}>
                        {getOfferIcon(offer.type)}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl font-bold text-white">{offer.title}</h3>
                          <span className="text-xl font-bold text-blue-400">{offer.discount}</span>
                        </div>
                        
                        <p className="text-gray-400 mb-6 text-lg">{offer.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-gray-800/50 rounded-xl px-4 py-3 border border-white/10">
                            <span className="font-mono font-bold text-white mr-3 text-lg">{offer.code}</span>
                            <button
                              onClick={() => copyToClipboard(offer.code)}
                              className="text-blue-400 hover:text-blue-300 transition-colors"
                            >
                              {copiedCode === offer.code ? (
                                <Check className="w-5 h-5" />
                              ) : (
                                <Copy className="w-5 h-5" />
                              )}
                            </button>
                          </div>
                          
                          <span className="text-sm text-gray-400">Until {offer.validUntil}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                <h2 className="text-4xl font-bold mb-6 text-white">Ready to Start Saving?</h2>
                <p className="text-gray-400 text-xl mb-10">
                  Browse our categories and apply these amazing offers at checkout!
                </p>
                <button
                  onClick={() => router.push('/categories')}
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  Shop Now
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

export default OffersPage;
