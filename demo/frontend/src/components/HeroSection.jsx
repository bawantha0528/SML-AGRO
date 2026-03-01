import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function HeroSection({ onNavigate }) {
  return (
    <section
      id="hero"
      className="relative min-h-screen pt-24 pb-12 md:pt-32 md:pb-20 flex items-center overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
            }}
            className="z-10"
          >
            <div className="inline-flex items-center space-x-2 text-sml-green font-semibold text-sm tracking-widest uppercase mb-6">
              <span>Sustainable</span>
              <span className="w-1 h-1 rounded-full bg-sml-green"></span>
              <span>Global</span>
              <span className="w-1 h-1 rounded-full bg-sml-green"></span>
              <span>Premium</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold text-sml-dark leading-[1.1] mb-6">
              Exporting <br />
              <span className="text-sml-green">Nature's</span> <br />
              Strength
            </h1>

            <p className="text-lg text-gray-600 max-w-lg mb-10 leading-relaxed">
              Premium coconut coir products for global agriculture. Sustainable
              sourcing, precision processing, transparent operations.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center justify-center px-8 py-4 bg-sml-dark text-sml-cream rounded-full font-medium hover:bg-gray-800 transition-colors group"
              >
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#tour"
                className="group inline-flex items-center justify-center px-8 py-4 border-2 border-sml-dark text-sml-dark rounded-full font-medium hover:bg-sml-dark hover:text-sml-cream transition-colors"
              >
                <img
                  src="/abc.png"
                  alt="Tour"
                  className="mr-3 w-6 h-6 object-contain transition-all duration-300 group-hover:brightness-0 group-hover:invert"
                />
                Virtual Tour
              </a>
            </div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.2,
            }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
              <div className="absolute inset-0 bg-sml-dark/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src="/b-coirproducts.jpg"
                alt="Coir Products"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 z-20 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs border-l-4 border-sml-green">
                <p className="text-xs font-bold text-sml-green uppercase tracking-wider mb-1">
                  Export Volume
                </p>
                <div className="flex items-end gap-2">
                  <p className="text-sml-dark font-serif text-2xl font-bold leading-none">
                    5000+ MT
                  </p>
                  <p className="text-sml-green font-medium text-xs mb-0.5">
                    +45% this year
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-sml-green/10 rounded-full blur-3xl -z-10" />
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-sml-amber/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
