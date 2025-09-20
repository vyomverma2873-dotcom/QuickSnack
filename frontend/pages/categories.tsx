import React from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Apple, 
  Milk, 
  Sandwich, 
  Coffee, 
  Candy, 
  Beef, 
  Carrot, 
  Zap,
  Smartphone,
  ChevronRight 
} from 'lucide-react';
import Layout from '@/components/Layout/Layout';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  itemCount: number;
  description: string;
}

const categories: Category[] = [
  {
    id: 'fruits',
    name: 'Fresh Fruits',
    icon: <Apple className="w-8 h-8" />,
    color: 'from-mint-green to-sky-blue',
    itemCount: 5,
    description: 'Fresh, organic fruits delivered daily'
  },
  {
    id: 'dairy',
    name: 'Dairy & Eggs',
    icon: <Milk className="w-8 h-8" />,
    color: 'from-sky-blue to-pale-blue',
    itemCount: 4,
    description: 'Fresh dairy products and farm eggs'
  },
  {
    id: 'snacks',
    name: 'Snacks & Munchies',
    icon: <Candy className="w-8 h-8" />,
    color: 'from-peach to-mint-green',
    itemCount: 3,
    description: 'Delicious snacks for every craving'
  },
  {
    id: 'beverages',
    name: 'Beverages',
    icon: <Coffee className="w-8 h-8" />,
    color: 'from-slate-blue-gray to-sky-blue',
    itemCount: 3,
    description: 'Refreshing drinks and beverages'
  },
  {
    id: 'ready-to-eat',
    name: 'Ready to Eat',
    icon: <Sandwich className="w-8 h-8" />,
    color: 'from-peach to-sky-blue',
    itemCount: 6,
    description: 'Quick meals ready to enjoy'
  },
  {
    id: 'meat',
    name: 'Meat & Fish',
    icon: <Beef className="w-8 h-8" />,
    color: 'from-mint-green to-peach',
    itemCount: 6,
    description: 'Fresh meat and seafood selection'
  },
  {
    id: 'vegetables',
    name: 'Fresh Vegetables',
    icon: <Carrot className="w-8 h-8" />,
    color: 'from-sky-blue to-mint-green',
    itemCount: 5,
    description: 'Farm-fresh vegetables daily'
  },
  {
    id: 'instant',
    name: 'Instant Food',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-peach to-pale-blue',
    itemCount: 8,
    description: 'Quick and easy instant meals'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    icon: <Smartphone className="w-8 h-8" />,
    color: 'from-slate-blue-gray to-mint-green',
    itemCount: 6,
    description: 'Tech gadgets and electronic accessories'
  },
];

const CategoriesPage: React.FC = () => {
  const router = useRouter();

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  return (
    <>
      <Head>
        <title>All Categories - QuickSnack</title>
        <meta 
          name="description" 
          content="Browse all product categories at QuickSnack. Fresh fruits, vegetables, dairy, snacks, beverages and more with fast delivery." 
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
                All Categories
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl text-gray-400 max-w-4xl mx-auto"
              >
                Discover fresh products across all categories, delivered fast to your doorstep
              </motion.p>
            </div>
          </section>

          {/* Categories Grid */}
          <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {categories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCategoryClick(category.id)}
                    className="cursor-pointer group"
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20 h-full">
                      {/* Gradient Background */}
                      <div className={`absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                      
                      {/* Content */}
                      <div className="relative p-10 text-center h-full flex flex-col justify-between">
                        {/* Icon Container */}
                        <div>
                          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-white mb-8 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                            {category.icon}
                          </div>
                          
                          {/* Category Name */}
                          <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-blue-200 transition-colors">
                            {category.name}
                          </h3>
                          
                          {/* Description */}
                          <p className="text-gray-400 text-lg mb-6 leading-relaxed">
                            {category.description}
                          </p>
                        </div>
                        
                        <div>
                          {/* Item Count */}
                          <p className="text-xl font-bold text-white mb-6">
                            {category.itemCount} items
                          </p>
                          
                          {/* Hover Arrow */}
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="inline-flex items-center text-blue-400 font-bold text-lg">
                              <span className="mr-3">Shop Now</span>
                              <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Decorative Elements */}
                      <div className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 w-8 h-8 bg-white bg-opacity-30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
                <h2 className="text-4xl font-bold mb-6 text-white">Can't Find What You're Looking For?</h2>
                <p className="text-gray-400 text-xl mb-10">
                  We're constantly adding new products and categories. Let us know what you need!
                </p>
                <button
                  onClick={() => router.push('/contact')}
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-600 to-blue-600 text-white font-bold rounded-xl hover:from-emerald-500 hover:to-blue-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  Contact Us
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

export default CategoriesPage;
