import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ShoppingCart, Clock, Leaf, Tag, Shield, Zap } from 'lucide-react';
import { useRouter } from 'next/router';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaAction: string;
  icon: React.ReactNode;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Shop Electronics",
    subtitle: "Discover cutting-edge technology and smart devices at unbeatable prices",
    ctaText: "Get Started",
    ctaAction: "/categories/electronics",
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: 2,
    title: "Order Now",
    subtitle: "Get your groceries delivered to your doorstep in just 10 minutes",
    ctaText: "Get Started",
    ctaAction: "/categories",
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: 3,
    title: "Shop Fresh",
    subtitle: "Handpicked fruits and vegetables delivered fresh from local farms",
    ctaText: "Get Started",
    ctaAction: "/categories/fruits",
    icon: <Leaf className="w-6 h-6" />
  },
  {
    id: 4,
    title: "Shop Essentials",
    subtitle: "Everything you need for your daily routine, delivered instantly",
    ctaText: "Get Started",
    ctaAction: "/categories/instant",
    icon: <ShoppingCart className="w-6 h-6" />
  },
  {
    id: 5,
    title: "See Deals",
    subtitle: "Amazing discounts and exclusive deals on your favorite products",
    ctaText: "Get Started",
    ctaAction: "/offers",
    icon: <Tag className="w-6 h-6" />
  },
  {
    id: 6,
    title: "Learn More",
    subtitle: "Shop with confidence knowing your data and deliveries are protected",
    ctaText: "Get Started",
    ctaAction: "/about",
    icon: <Shield className="w-6 h-6" />
  }
];

const HeroSection: React.FC = () => {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [windowWidth, setWindowWidth] = useState(1200); // Default width for SSR

  // Window width for animations
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Set initial width
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // 5 seconds per slide

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const handleCTAClick = (action: string) => {
    router.push(action);
  };

  const currentSlideData = heroSlides[currentSlide];

  return (
    <section className="relative w-full h-[60vh] min-h-[400px] overflow-hidden">
      {/* Vertical gradient background */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{
          background: `linear-gradient(to bottom, 
            #0D0D0D 0%, 
            #1E2A47 35%, 
            #3C4D7C 70%, 
            #E18AB4 100%)`
        }}
      />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Moving snack elements */}
        <motion.div
          animate={{ 
            x: [-100, windowWidth + 100],
            rotate: [0, 360]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear",
            delay: 0
          }}
          className="absolute top-20 text-4xl opacity-20"
        >
          🍕
        </motion.div>
        
        <motion.div
          animate={{ 
            x: [windowWidth + 100, -100],
            rotate: [360, 0]
          }}
          transition={{ 
            duration: 25, 
            repeat: Infinity, 
            ease: "linear",
            delay: 5
          }}
          className="absolute top-32 text-3xl opacity-15"
        >
          🍔
        </motion.div>

        <motion.div
          animate={{ 
            x: [-80, windowWidth + 80],
            y: [0, -20, 0],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: "linear",
            delay: 10
          }}
          className="absolute top-40 text-3xl opacity-10"
        >
          🍿
        </motion.div>

        <motion.div
          animate={{ 
            x: [windowWidth + 60, -60],
            y: [0, 15, 0]
          }}
          transition={{ 
            duration: 22, 
            repeat: Infinity, 
            ease: "linear",
            delay: 15
          }}
          className="absolute top-52 text-2xl opacity-20"
        >
          🥤
        </motion.div>

        <motion.div
          animate={{ 
            x: [-120, windowWidth + 120],
            rotate: [0, -360]
          }}
          transition={{ 
            duration: 28, 
            repeat: Infinity, 
            ease: "linear",
            delay: 8
          }}
          className="absolute bottom-32 text-3xl opacity-15"
        >
          🍎
        </motion.div>

        <motion.div
          animate={{ 
            x: [windowWidth + 90, -90],
            y: [0, -10, 0]
          }}
          transition={{ 
            duration: 24, 
            repeat: Infinity, 
            ease: "linear",
            delay: 12
          }}
          className="absolute bottom-20 text-2xl opacity-10"
        >
          🥕
        </motion.div>

        {/* Floating particles */}
        <motion.div
          animate={{ 
            y: [-20, 20, -20],
            opacity: [0.1, 0.3, 0.1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut"
          }}
          className="absolute top-16 left-20 w-2 h-2 bg-white rounded-full"
        />

        <motion.div
          animate={{ 
            y: [20, -20, 20],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 5, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute top-24 right-32 w-1.5 h-1.5 bg-white rounded-full"
        />

        <motion.div
          animate={{ 
            y: [-15, 15, -15],
            x: [-5, 5, -5],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-28 left-16 w-1 h-1 bg-white rounded-full"
        />
      </div>

      {/* Carousel container */}
      <div className="relative w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full flex items-center"
          >
            <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 w-full">
              <div className="max-w-4xl">
                {/* Content */}
                <div className="text-center lg:text-left space-y-6">
                  {/* Icon */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-xl text-white mb-2"
                  >
                    {currentSlideData.icon}
                  </motion.div>

                  {/* Main headline */}
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                    className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight"
                  >
                    {currentSlideData.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
                    className="text-lg sm:text-xl lg:text-2xl font-light leading-relaxed max-w-2xl mx-auto lg:mx-0"
                    style={{ color: '#B0B0B0' }}
                  >
                    {currentSlideData.subtitle}
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Minimal pagination dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-white/60'
                  : 'bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
