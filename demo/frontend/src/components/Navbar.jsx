import React, { useEffect, useState } from 'react';
import {
  Menu,
  X,
  Sparkles,
  Leaf,
  ChevronDown,
  Search,
  Sliders,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function Navbar({ onNavigate, currentPage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: 'ABOUT US',
      href: '#about',
    },
    {
      name: 'FACTORY TOUR',
      href: '#tour',
    },
    {
      name: 'CONTACT',
      href: '#contact',
    },
  ];

  const productSubLinks = [
    {
      name: 'Explore Products',
      page: 'catalog',
      icon: Search,
      desc: 'Browse our full catalog',
    },
    {
      name: 'Customize Order',
      page: 'customize',
      icon: Sliders,
      desc: 'Configure your specs',
    },
  ];

  const handleHomeClick = () => {
    if (currentPage !== 'home') {
      onNavigate('home');
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleNavLinkClick = (href) => {
    if (currentPage !== 'home') {
      onNavigate('home');
      // Wait for home page to render, then scroll to section
      setTimeout(() => {
        const el = document.querySelector(href);
        if (el)
          el.scrollIntoView({
            behavior: 'smooth',
          });
      }, 100);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-sml-dark shadow-lg py-3' : 'bg-sml-dark py-5'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 group"
          >
            <img
              src="/logo.png"
              alt="SML Logo"
              className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col items-center ml-2">
              <span className="text-[#008542] font-black text-2xl leading-none tracking-[0.25em] ml-1">
                SML
              </span>
              <span className="text-[#39B54A] font-bold text-[8px] tracking-widest leading-none mt-0.5">
                AGRO LANKA
              </span>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {/* HOME link */}
            <button
              onClick={handleHomeClick}
              className="text-sml-light text-xs font-medium tracking-widest hover:text-sml-green-light transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-sml-green-light after:transition-all hover:after:w-full"
            >
              HOME
            </button>

            {/* PRODUCTS with Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProductDropdownOpen(true)}
              onMouseLeave={() => setProductDropdownOpen(false)}
            >
              <button className="flex items-center space-x-1 text-sml-light text-xs font-medium tracking-widest hover:text-sml-green-light transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-sml-green-light after:transition-all hover:after:w-full">
                <span>PRODUCTS</span>
                <ChevronDown
                  className={`w-3 h-3 transition-transform duration-200 ${productDropdownOpen ? 'rotate-180' : ''
                    }`}
                />
              </button>

              <AnimatePresence>
                {productDropdownOpen && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 8,
                      scale: 0.96,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: 8,
                      scale: 0.96,
                    }}
                    transition={{
                      duration: 0.15,
                      ease: 'easeOut',
                    }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    {/* Dropdown arrow */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-gray-100" />

                    <div className="relative z-10 py-2">
                      {productSubLinks.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setProductDropdownOpen(false);
                            onNavigate(sub.page);
                          }}
                          className="w-full flex items-center px-4 py-3 hover:bg-sml-cream transition-colors group/item text-left"
                        >
                          <div className="w-9 h-9 rounded-lg bg-sml-cream-dark/50 flex items-center justify-center mr-3 group-hover/item:bg-sml-green group-hover/item:text-white transition-colors">
                            <sub.icon className="w-4 h-4 text-sml-dark group-hover/item:text-white transition-colors" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-sml-dark group-hover/item:text-sml-green transition-colors">
                              {sub.name}
                            </p>
                            <p className="text-xs text-gray-400">{sub.desc}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Remaining nav links */}
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={currentPage === 'home' ? link.href : undefined}
                onClick={(e) => {
                  if (currentPage !== 'home') {
                    e.preventDefault();
                    handleNavLinkClick(link.href);
                  }
                }}
                className="text-sml-light text-xs font-medium tracking-widest hover:text-sml-green-light transition-colors relative cursor-pointer after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-sml-green-light after:transition-all hover:after:w-full"
              >
                {link.name}
              </a>
            ))}

            <button
              onClick={() =>
                document.getElementById('agribot-trigger')?.click()
              }
              className="flex items-center space-x-2 bg-sml-green-light text-sml-dark px-4 py-2 rounded-full text-xs font-bold hover:bg-white transition-colors shadow-[0_0_15px_rgba(76,175,80,0.3)] animate-pulse"
            >
              <span>AGRI BOT</span>
              <Sparkles className="w-3 h-3" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-sml-cream hover:text-sml-green-light transition-colors"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: 'auto',
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="md:hidden bg-sml-dark border-t border-gray-800"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {/* HOME */}
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleHomeClick();
                }}
                className="block w-full text-left px-3 py-3 text-sml-cream hover:text-sml-green-light text-sm font-medium border-b border-gray-800"
              >
                HOME
              </button>

              {/* PRODUCTS with mobile sub-menu */}
              <div className="border-b border-gray-800">
                <button
                  onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                  className="w-full flex items-center justify-between px-3 py-3 text-sml-cream hover:text-sml-green-light text-sm font-medium"
                >
                  <span>PRODUCTS</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${mobileProductsOpen ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                <AnimatePresence>
                  {mobileProductsOpen && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        height: 0,
                      }}
                      animate={{
                        opacity: 1,
                        height: 'auto',
                      }}
                      exit={{
                        opacity: 0,
                        height: 0,
                      }}
                      className="overflow-hidden"
                    >
                      {productSubLinks.map((sub) => (
                        <button
                          key={sub.name}
                          onClick={() => {
                            setIsOpen(false);
                            setMobileProductsOpen(false);
                            onNavigate(sub.page);
                          }}
                          className="w-full flex items-center pl-8 pr-3 py-3 text-gray-400 hover:text-sml-green-light text-sm text-left"
                        >
                          <sub.icon className="w-4 h-4 mr-3" />
                          <div>
                            <p className="font-medium">{sub.name}</p>
                            <p className="text-xs opacity-60">{sub.desc}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Remaining links */}
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={currentPage === 'home' ? link.href : undefined}
                  onClick={(e) => {
                    setIsOpen(false);
                    if (currentPage !== 'home') {
                      e.preventDefault();
                      handleNavLinkClick(link.href);
                    }
                  }}
                  className="block px-3 py-3 text-sml-cream hover:text-sml-green-light text-sm font-medium border-b border-gray-800 cursor-pointer"
                >
                  {link.name}
                </a>
              ))}

              <button
                onClick={() => {
                  setIsOpen(false);
                  document.getElementById('agribot-trigger')?.click();
                }}
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-sml-green-light text-sml-dark px-4 py-3 rounded-md text-sm font-bold"
              >
                <span>CHAT WITH AGRI BOT</span>
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
