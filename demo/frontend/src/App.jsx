import { lazy, Suspense, useEffect, useState } from 'react';
import { Footer } from './components/Footer';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { LazyMount } from './components/LazyMount';

const AboutSection = lazy(() => import('./components/AboutSection').then((m) => ({ default: m.AboutSection })));
const AgriBotChat = lazy(() => import('./components/AgriBotChat').then((m) => ({ default: m.AgriBotChat })));
const ContactSection = lazy(() => import('./components/ContactSection').then((m) => ({ default: m.ContactSection })));
const FactoryTour = lazy(() => import('./components/FactoryTour').then((m) => ({ default: m.FactoryTour })));
const ProductCatalog = lazy(() => import('./components/ProductCatalog').then((m) => ({ default: m.ProductCatalog })));
const ProductCustomization = lazy(() => import('./components/ProductCustomization').then((m) => ({ default: m.ProductCustomization })));
const ProductDetailPage = lazy(() => import('./components/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })));
const ProductsSection = lazy(() => import('./components/ProductsSection').then((m) => ({ default: m.ProductsSection })));
const AdminLayout = lazy(() => import('./admin/AdminLayout').then((m) => ({ default: m.AdminLayout })));
const InquiryPage = lazy(() => import('./components/InquiryPage').then((m) => ({ default: m.InquiryPage })));

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

  useEffect(() => {
    const optimizeImages = () => {
      document.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('loading') && img.dataset.priority !== 'high') {
          img.setAttribute('loading', 'lazy');
        }
        if (!img.hasAttribute('decoding')) {
          img.setAttribute('decoding', 'async');
        }
      });
    };

    optimizeImages();
    const observer = new MutationObserver(optimizeImages);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  if (currentPage === 'admin') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-sml-cream" />}>
        <AdminLayout />
      </Suspense>
    );
  }

  if (currentPage === 'inquiry') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-sml-cream" />}>
        <InquiryPage onNavigate={navigate} initialCustomization={customizationData} />
      </Suspense>
    );
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
          <LazyMount fallback={<div className="h-40" />}>
            <Suspense fallback={<div className="h-40" />}>
              <ProductsSection onNavigate={navigate} />
            </Suspense>
          </LazyMount>
          <LazyMount fallback={<div className="h-32" />}>
            <Suspense fallback={<div className="h-32" />}>
              <AboutSection />
            </Suspense>
          </LazyMount>
          <LazyMount fallback={<div className="h-32" />}>
            <Suspense fallback={<div className="h-32" />}>
              <FactoryTour />
            </Suspense>
          </LazyMount>
          <LazyMount fallback={<div className="h-32" />}>
            <Suspense fallback={<div className="h-32" />}>
              <ContactSection />
            </Suspense>
          </LazyMount>
        </main>
      }

      {currentPage === 'catalog' &&
        <main className="pt-20">
          <Suspense fallback={<div className="h-40" />}>
            <ProductCatalog onNavigate={navigate} />
          </Suspense>
        </main>
      }

      {currentPage === 'customize' &&
        <main className="pt-20">
          <Suspense fallback={<div className="h-40" />}>
            <ProductCustomization onNavigate={navigate} />
          </Suspense>
        </main>
      }

      {currentPage === 'product' &&
        <main className="pt-20">
          <Suspense fallback={<div className="h-40" />}>
            <ProductDetailPage onNavigate={navigate} product={customizationData} />
          </Suspense>
        </main>
      }

      <Footer />
      <Suspense fallback={null}>
        <AgriBotChat />
      </Suspense>
      </div>
    </div>);

}
