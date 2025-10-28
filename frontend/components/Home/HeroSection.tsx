import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Clock, Sparkles, Star, Zap, Heart, Coffee, Candy } from 'lucide-react';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  emoji: string;
  color: string;
  bgPattern: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Lightning Fast Delivery",
    subtitle: "Get your favorite snacks delivered in just 10 minutes to your doorstep",
    icon: <Zap className="w-12 h-12" />,
    emoji: "⚡",
    color: "from-yellow-400 to-orange-500",
    bgPattern: "radial-gradient(circle at 20% 80%, rgba(255, 193, 7, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 152, 0, 0.1) 0%, transparent 50%)"
  },
  {
    id: 2,
    title: "Premium Quality Snacks",
    subtitle: "Handpicked snacks and munchies from the finest brands worldwide",
    icon: <Heart className="w-12 h-12" />,
    emoji: "🍿",
    color: "from-red-400 to-pink-500",
    bgPattern: "radial-gradient(circle at 30% 70%, rgba(244, 63, 94, 0.1) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(239, 68, 68, 0.1) 0%, transparent 50%)"
  },
  {
    id: 3,
    title: "Refreshing Cold Drinks",
    subtitle: "Ice-cold beverages to quench your thirst and refresh your day",
    icon: <Coffee className="w-12 h-12" />,
    emoji: "🥤",
    color: "from-blue-400 to-cyan-500",
    bgPattern: "radial-gradient(circle at 25% 75%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)"
  },
  {
    id: 4,
    title: "Sweet Tooth Paradise",
    subtitle: "Indulge in our collection of delicious sweets and desserts",
    icon: <Candy className="w-12 h-12" />,
    emoji: "🍭",
    color: "from-purple-400 to-pink-500",
    bgPattern: "radial-gradient(circle at 40% 60%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 60% 40%, rgba(236, 72, 153, 0.1) 0%, transparent 50%)"
  },
  {
    id: 5,
    title: "Exclusive Daily Deals",
    subtitle: "Amazing discounts and special offers on your favorite products",
    icon: <Sparkles className="w-12 h-12" />,
    emoji: "✨",
    color: "from-emerald-400 to-teal-500",
    bgPattern: "radial-gradient(circle at 35% 65%, rgba(16, 185, 129, 0.1) 0%, transparent 50%), radial-gradient(circle at 65% 35%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)"
  },
  {
    id: 6,
    title: "24/7 Quick Service",
    subtitle: "Round the clock service with instant ordering and quick delivery",
    icon: <Clock className="w-12 h-12" />,
    emoji: "🕐",
    color: "from-indigo-400 to-purple-500",
    bgPattern: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 30% 70%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)"
  },
  {
    id: 7,
    title: "Smart Shopping Experience",
    subtitle: "Intelligent recommendations and seamless checkout for the perfect experience",
    icon: <ShoppingCart className="w-12 h-12" />,
    emoji: "🛒",
    color: "from-rose-400 to-orange-500",
    bgPattern: "radial-gradient(circle at 45% 55%, rgba(251, 113, 133, 0.1) 0%, transparent 50%), radial-gradient(circle at 55% 45%, rgba(251, 146, 60, 0.1) 0%, transparent 50%)"
  }
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3500); // 3.5 seconds per slide

    return () => clearInterval(interval);
  }, []);

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative w-full h-[70vh] bg-black overflow-hidden pt-16">
      {/* Pure Black Background with Subtle Pattern */}
      <div className="absolute inset-0 bg-black">
        <div 
          className="absolute inset-0 opacity-30"
          style={{ background: currentSlideData.bgPattern }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.02),transparent_70%)]" />
      </div>

      {/* Animated Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Geometric Shapes */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear"
          }}
          className="absolute top-20 left-20 w-40 h-40 border-2 border-white/10 rounded-full"
        />
        
        <motion.div
          animate={{ 
            rotate: [360, 0],
            y: [-30, 30, -30],
            opacity: [0.05, 0.15, 0.05]
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute top-60 right-40 w-32 h-32 bg-white/5 rounded-3xl backdrop-blur-sm"
        />

        <motion.div
          animate={{ 
            scale: [1, 2, 1],
            opacity: [0.03, 0.1, 0.03],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute bottom-40 left-1/3 w-24 h-24 bg-gradient-to-r from-white/10 to-transparent rounded-full blur-xl"
        />

        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ 
              duration: 4 + i * 0.5, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: i * 0.3
            }}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${10 + (i * 7)}%`,
              left: `${5 + (i * 8)}%`,
            }}
          />
        ))}

        {/* Large Emoji Animation */}
        <motion.div
          animate={{ 
            scale: [0.8, 1.2, 0.8],
            rotate: [0, 10, -10, 0],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute top-1/2 right-20 text-9xl opacity-20"
        >
          {currentSlideData.emoji}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center justify-center" style={{ height: 'calc(70vh - 4rem)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 100, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -100, scale: 0.9 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-center space-y-8"
            >
              {/* Icon with Glow Effect */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                className="relative inline-block"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${currentSlideData.color} rounded-full blur-2xl opacity-30 scale-150`} />
                <div className={`relative p-8 bg-gradient-to-r ${currentSlideData.color} rounded-full shadow-2xl`}>
                  {currentSlideData.icon}
                </div>
              </motion.div>

              {/* Main Title */}
              <motion.h1
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.4 }}
                className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black text-white leading-none tracking-tight"
              >
                <motion.span
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                  className={`bg-gradient-to-r ${currentSlideData.color} bg-clip-text text-transparent bg-[length:200%_100%]`}
                >
                  {currentSlideData.title}
                </motion.span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-xl lg:text-2xl text-gray-400 leading-relaxed max-w-4xl mx-auto font-light"
              >
                {currentSlideData.subtitle}
              </motion.p>

              {/* Decorative Elements */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex justify-center items-center space-x-8"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ 
                      scale: [1, 1.5, 1],
                      opacity: [0.3, 0.8, 0.3]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity, 
                      delay: i * 0.2,
                      ease: "easeInOut"
                    }}
                    className={`w-3 h-3 rounded-full bg-gradient-to-r ${currentSlideData.color}`}
                  />
                ))}
              </motion.div>

              {/* Large Emoji Display */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.5, delay: 1, ease: "easeOut" }}
                className="text-6xl lg:text-7xl"
              >
                <motion.span
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity, 
                    ease: "easeInOut"
                  }}
                  className="inline-block"
                >
                  {currentSlideData.emoji}
                </motion.span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/10">
        <motion.div
          key={currentSlide}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 3.5, ease: "linear" }}
          className={`h-full bg-gradient-to-r ${currentSlideData.color}`}
        />
      </div>
    </section>
  );
};

export default HeroSection;
