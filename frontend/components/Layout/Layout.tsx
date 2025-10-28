import React from 'react';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 pt-16 bg-gradient-to-b from-black via-gray-900 to-black">
        {children}
      </main>
      {showFooter && <Footer />}
      
      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'rgba(31, 31, 31, 0.95)',
            color: '#ffffff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;
