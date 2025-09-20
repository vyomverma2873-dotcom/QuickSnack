import React, { useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout/Layout';
import HeroSection from '@/components/Home/HeroSection';
import ProductCategories from '@/components/Home/ProductCategories';
import FeaturedProducts from '@/components/Home/FeaturedProducts';

const HomePage: React.FC = () => {
  useEffect(() => {
    // Reset body opacity when homepage loads (for smooth transition from auth pages)
    document.body.style.transition = 'opacity 0.5s ease-in';
    document.body.style.opacity = '1';
  }, []);

  return (
    <>
      <Head>
        <title>QuickSnack - Fast Grocery & Snack Delivery</title>
        <meta 
          name="description" 
          content="Get groceries, snacks, and daily essentials delivered to your doorstep in minutes. Fresh products, great prices, lightning-fast delivery." 
        />
        <meta name="keywords" content="grocery delivery, snacks, fast delivery, fresh food, online grocery" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://quicksnack.com/" />
        <meta property="og:title" content="QuickSnack - Fast Grocery & Snack Delivery" />
        <meta property="og:description" content="Get groceries, snacks, and daily essentials delivered to your doorstep in minutes." />
        <meta property="og:image" content="/og-image.jpg" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://quicksnack.com/" />
        <meta property="twitter:title" content="QuickSnack - Fast Grocery & Snack Delivery" />
        <meta property="twitter:description" content="Get groceries, snacks, and daily essentials delivered to your doorstep in minutes." />
        <meta property="twitter:image" content="/og-image.jpg" />
      </Head>

      <Layout>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <HeroSection />
          <ProductCategories />
          <FeaturedProducts />
        </motion.div>
      </Layout>
    </>
  );
};

// Force server-side rendering to prevent static generation
export async function getServerSideProps() {
  return {
    props: {
      timestamp: new Date().toISOString()
    }
  }
}

export default HomePage;
