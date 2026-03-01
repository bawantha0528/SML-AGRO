import React, { useEffect, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductsSection } from './components/ProductsSection';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductCustomization } from './components/ProductCustomization';
import { AboutSection } from './components/AboutSection';
import { FactoryTour } from './components/FactoryTour';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { AgriBotChat } from './components/AgriBotChat';

import { InquiryPage } from './components/InquiryPage';
import { AdminLayout } from './admin/AdminLayout';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const navigate = (page) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      const path = window.location.pathname;

      if (path === '/admin') {
        window.history.pushState(null, '', '/#/admin');
        setCurrentPage('admin');
        return;
      }

      if (hash === '#inquiry') {
        setCurrentPage('inquiry');
      } else if (hash === '#/admin') {
        setCurrentPage('admin');
      } else if (hash) {
        const id = hash.substring(1);
        setTimeout(() => {
          const el = document.getElementById(id);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 500);
      }
    };

    // Initial check
    handleHash();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  if (currentPage === 'admin') {
    return <AdminLayout />;
  }

  if (currentPage === 'inquiry') {
    return <InquiryPage onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen bg-sml-cream font-sans text-sml-text selection:bg-sml-green selection:text-white">
      {/* Background image for navbar and hero - fixed to viewport */}
      {currentPage === 'home' && (
        <div
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: 'url("/coconut-plantation-21901848.webp")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            opacity: 0.20,
            zIndex: 0,
          }}
        />
      )}

      <Navbar onNavigate={navigate} currentPage={currentPage} />

      {currentPage === 'home' &&
        <main className="relative z-10">
          <HeroSection onNavigate={navigate} />
          <ProductsSection onNavigate={navigate} />
          <AboutSection />
          <FactoryTour />
          <ContactSection />
        </main>
      }

      {currentPage === 'catalog' &&
        <main className="pt-20">
          <ProductCatalog onNavigate={navigate} />
        </main>
      }

      {currentPage === 'customize' &&
        <main className="pt-20">
          <ProductCustomization onNavigate={navigate} />
        </main>
      }

      <Footer />
      <AgriBotChat />
    </div>);

}
