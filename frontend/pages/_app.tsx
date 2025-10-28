import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import Lenis from 'lenis';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize Lenis with improved settings
    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
    });

    // Animation frame loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Add scroll event listener for navbar
    lenis.on('scroll', ({ scroll }: { scroll: number }) => {
      // Dispatch custom event for navbar scroll detection
      window.dispatchEvent(new CustomEvent('lenisScroll', { detail: { scroll } }));
    });

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Toaster
        position="top-right"
        toastOptions={{
          // Default options for all toasts
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '500',
            padding: '12px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          // Success toasts - shorter duration
          success: {
            duration: 1000, // 1 second for success messages
            style: {
              background: '#10B981',
              color: '#fff',
              border: 'none',
              transform: 'translateY(0px)',
              transition: 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10B981',
            },
          },
          // Error toasts - longer duration so users can read them
          error: {
            duration: 4000, // 4 seconds for error messages
            style: {
              background: '#EF4444',
              color: '#fff',
              border: 'none',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#EF4444',
            },
          },
        }}
      />
    </>
  );
}

// Force SSR for all pages by adding getInitialProps
App.getInitialProps = async () => {
  return {
    pageProps: {}
  }
}

export default App;
