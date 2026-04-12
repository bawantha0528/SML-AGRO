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
            className="z-10 stagger-fade"
          >
            <div className="inline-flex items-center space-x-2 text-sml-green font-semibold text-xs tracking-[0.24em] uppercase mb-6 glass-panel rounded-full px-5 py-2.5">
              <span>Sustainable</span>
              <span className="w-1 h-1 rounded-full bg-sml-amber"></span>
              <span>Global</span>
              <span className="w-1 h-1 rounded-full bg-sml-amber"></span>
              <span>Premium</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-serif font-bold text-sml-dark leading-[1.05] tracking-tight mb-8">
              Exporting <br />
              <span className="text-gradient">Nature's</span> <br />
              Strength
            </h1>

            <p className="text-lg text-sml-text/80 max-w-lg mb-10 leading-relaxed glass-panel p-6">
              Premium coconut coir products for global agriculture. Sustainable
              sourcing, precision processing, transparent operations.
            </p>

            <div className="flex flex-col sm:flex-row gap-5">
              <button
                onClick={() => onNavigate('catalog')}
                className="inline-flex items-center justify-center px-8 py-4 bg-sml-green text-white rounded-full font-bold hover:bg-sml-green-light transition-all duration-300 group shadow-[0_8px_25px_rgba(21,126,84,0.3)] hover:shadow-[0_12px_35px_rgba(21,126,84,0.4)] hover:-translate-y-1"
              >
                Explore Products
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <a
                href="#tour"
                className="group inline-flex items-center justify-center px-8 py-4 text-sml-dark rounded-full font-bold hover:bg-white transition-all duration-300 glass-panel hover:shadow-strong hover:-translate-y-1"
              >
                <img
                  src="/abc.png"
                  alt="Tour"
                  className="mr-3 w-6 h-6 object-contain transition-all duration-300 group-hover:scale-110"
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
            className="relative stagger-fade"
          >
            <div className="relative rounded-[2rem] overflow-hidden shadow-strong aspect-[4/3] group ring-1 ring-white/20">
              <div className="absolute inset-0 bg-sml-dark/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
              <img
                src="/b-coirproducts.jpg"
                alt="Coir Products"
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 z-20 glass-panel p-5 rounded-2xl max-w-xs transform group-hover:-translate-y-2 transition-transform duration-500">
                <p className="text-xs font-bold text-sml-amber uppercase tracking-widest mb-2">
                  Export Volume
                </p>
                <div className="flex items-end gap-3">
                  <p className="text-sml-dark font-serif text-3xl font-bold leading-none">
                    5000+ <span className="text-xl text-sml-green">MT</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-sml-green/20 rounded-full blur-[80px] -z-10 animate-float" />
            <div className="absolute -top-10 -left-10 w-64 h-64 bg-sml-amber/20 rounded-full blur-[80px] -z-10 animate-float-delayed" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
