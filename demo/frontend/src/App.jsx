import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { AgriBotChat } from './components/AgriBotChat';
import { ContactSection } from './components/ContactSection';
import { FactoryTour } from './components/FactoryTour';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductCustomization } from './components/ProductCustomization';
import { ProductDetailPage } from './components/ProductDetailPage';
import { ProductsSection } from './components/ProductsSection';

import { AdminLayout } from './admin/AdminLayout';
import { InquiryPage } from './components/InquiryPage';

const PAGE_TO_PATH = {
  home: '/',
  catalog: '/catalog',
  customize: '/customize',
  product: '/product',
  inquiry: '/inquiry',
  admin: '/admin',
};

const PATH_TO_PAGE = {
  '/': 'home',
  '/catalog': 'catalog',
  '/customize': 'customize',
  '/product': 'product',
  '/inquiry': 'inquiry',
  '/admin': 'admin',
};

const resolvePageFromPath = (path) => PATH_TO_PAGE[path] || 'home';

const applyRouteState = (setCurrentPage, setCustomizationData, path, state = null) => {
  const page = resolvePageFromPath(path);
  setCurrentPage(page);

  const routedData = state?.data || null;
  if (page === 'product' || page === 'inquiry') {
    setCustomizationData(routedData);
  } else {
    setCustomizationData(null);
  }

  if (page === 'home' && window.location.hash) {
    const id = window.location.hash.substring(1);
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }
};

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [customizationData, setCustomizationData] = useState(null);

  const navigate = (page, data = null, options = {}) => {
    const { replace = false } = options;
    const path = PAGE_TO_PATH[page] || '/';

    if (data) setCustomizationData(data);
    else if (page !== 'inquiry' && page !== 'product') setCustomizationData(null);

    const state = { page, data };
    if (replace) {
      window.history.replaceState(state, '', path);
    } else {
      window.history.pushState(state, '', path);
    }

    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    applyRouteState(setCurrentPage, setCustomizationData, window.location.pathname, window.history.state);

    const handlePopState = (event) => {
      applyRouteState(setCurrentPage, setCustomizationData, window.location.pathname, event.state);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  if (currentPage === 'admin') {
    return <AdminLayout />;
  }

  if (currentPage === 'inquiry') {
    return <InquiryPage onNavigate={navigate} initialCustomization={customizationData} />;
  }

  return (
    <div className="min-h-screen bg-sml-cream font-sans text-sml-text selection:bg-sml-green selection:text-white relative overflow-x-hidden selection-glass">
      {/* Global Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-mesh-gradient opacity-60" />

      {/* Decorative Blur Orbs for premium feel */}
      <div className="fixed top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-sml-amber/10 blur-[100px] pointer-events-none z-[1]" />
      <div className="fixed bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-sml-green/5 blur-[120px] pointer-events-none z-[1]" />

      {/* Background image for navbar and hero - fixed to viewport */}
      {currentPage === 'home' && (
        <div
          className="fixed inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: 'url("/coconut-plantation-21901848.webp")',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            backgroundAttachment: 'fixed',
            opacity: 0.08,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      <div className="relative z-10 font-sans">
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

      {currentPage === 'product' &&
        <main className="pt-20">
          <ProductDetailPage onNavigate={navigate} product={customizationData} />
        </main>
      }

      <Footer />
      <AgriBotChat />
      </div>
    </div>);

}
