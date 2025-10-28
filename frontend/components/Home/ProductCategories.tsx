import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { 
  Cookie, 
  Coffee, 
  Leaf, 
  Candy,
  ChevronRight 
} from 'lucide-react';
import api from '@/lib/api';

interface Category {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  itemCount: number;
  image?: string;
}

const ProductCategories: React.FC = () => {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([
    {
      id: 'snacks-and-munchies',
      name: 'Snacks and Munchies',
      icon: <Cookie className="w-6 h-6" />,
      color: 'from-orange-500 to-red-500',
      itemCount: 0,
    },
    {
      id: 'cold-drinks',
      name: 'Cold Drinks',
      icon: <Coffee className="w-6 h-6" />,
      color: 'from-blue-500 to-cyan-500',
      itemCount: 0,
    },
    {
      id: 'paan-corner',
      name: 'Paan Corner',
      icon: <Leaf className="w-6 h-6" />,
      color: 'from-green-500 to-emerald-600',
      itemCount: 0,
    },
    {
      id: 'sweet-tooth',
      name: 'Sweet Tooth',
      icon: <Candy className="w-6 h-6" />,
      color: 'from-pink-500 to-purple-500',
      itemCount: 0,
    },
  ]);

  // Fetch product counts for each category
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await api.get('/products');
        if (response.data.success) {
          const products = response.data.data;
          
          // Count products by category
          const categoryCounts: { [key: string]: number } = {};
          products.forEach((product: any) => {
            const category = product.category;
            categoryCounts[category] = (categoryCounts[category] || 0) + 1;
          });

          // Update categories with real counts
          setCategories(prevCategories => 
            prevCategories.map(category => ({
              ...category,
              itemCount: categoryCounts[category.name] || 0
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    fetchCategoryCounts();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    // Route to dedicated category pages
    router.push(`/categories/${categoryId}`);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Shop by Category
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Discover fresh products across all categories, delivered fast to your doorstep
          </motion.p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -8 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCategoryClick(category.id)}
              className="cursor-pointer group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-sm shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/10 hover:border-white/20">
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-15 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative p-8 text-center">
                  {/* Icon Container */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${category.color} text-white mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-lg`}>
                    {category.icon}
                  </div>
                  
                  {/* Category Name */}
                  <h3 className="font-bold text-white mb-3 group-hover:text-blue-200 transition-colors duration-300 text-lg">
                    {category.name}
                  </h3>
                  
                  {/* Item Count */}
                  <p className="text-sm text-gray-400 mb-4 group-hover:text-gray-300 transition-colors duration-300">
                    {category.itemCount} items available
                  </p>
                  
                  {/* Hover Arrow */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ChevronRight className="w-6 h-6 text-blue-400 mx-auto" />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-3 right-3 w-3 h-3 bg-white/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-3 left-3 w-2 h-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Categories Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <button
            onClick={() => router.push('/categories')}
            className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-500 hover:to-purple-500 hover:shadow-2xl hover:scale-105 transition-all duration-300 group border border-white/20"
          >
            View All Categories
            <ChevronRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300" />
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductCategories;
