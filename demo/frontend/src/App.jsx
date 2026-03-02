import { useEffect, useState } from 'react';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetails } from './components/ProductDetails';
import { ProductsSection } from './components/ProductsSection';

import { AnimatePresence, motion } from 'framer-motion';
import { AdminLayout } from './admin/AdminLayout';

export function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);

  const navigate = (page, productId = null) => {
    setCurrentPage(page);
    if (productId) {
      setSelectedProductId(productId);
    }
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

      if (hash === '#/admin') {
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

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const appVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  };

  return (
    <AnimatePresence mode="wait">
      {currentPage === 'admin' ? (
        <motion.div
          key="admin"
          variants={appVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
        >
          <AdminLayout />
        </motion.div>
      ) : (
        <motion.div
          key="main-app"
          variants={appVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-sml-cream font-sans text-sml-text selection:bg-sml-green selection:text-white"
        >
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

          <AnimatePresence mode="wait">
            {currentPage === 'home' &&
              <motion.main
                key="home"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="relative z-10"
              >
                <HeroSection onNavigate={navigate} />
                {/* ProductsSection is the homepage preview of products */}
                <ProductsSection onNavigate={navigate} />
                <AboutSection />
              </motion.main>
            }

            {currentPage === 'catalog' &&
              <motion.main
                key="catalog"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="pt-20"
              >
                <ProductCatalog onNavigate={navigate} />
              </motion.main>
            }

            {currentPage === 'product-details' && selectedProductId &&
              <motion.main
                key="product-details"
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.4 }}
                className="pt-20"
              >
                <ProductDetails id={selectedProductId} onNavigate={navigate} />
              </motion.main>
            }
          </AnimatePresence>

          <Footer />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
