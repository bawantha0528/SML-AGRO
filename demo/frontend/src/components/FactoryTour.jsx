import React, { useState } from 'react';
import { Play, Warehouse, Truck, Settings, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function FactoryTour() {
  const [showLiveTour, setShowLiveTour] = useState(false);

  return (
    <section
      id="tour"
      className="py-20 bg-sml-dark text-sml-cream relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12">
          <span className="text-sml-green-light font-semibold text-sm tracking-widest uppercase">
            Transparency First
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-white mt-3 mb-6">
            360° Virtual Factory Tour
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Experience our sustainable production process from anywhere in the
            world. Walk through our processing units, drying yards, and
            packaging facilities.
          </p>
        </div>

        {/* Tour Container */}
        <div className="relative aspect-video w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 mb-12 group">
          <AnimatePresence mode="wait">
            {!showLiveTour ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowLiveTour(true)}
                className="absolute inset-0 cursor-pointer"
              >
                {/* Fallback pattern if image is missing */}
                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors duration-500 flex flex-col items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-24 h-24 bg-sml-green/90 rounded-full flex items-center justify-center backdrop-blur-md mb-6 shadow-2xl shadow-sml-green/20"
                    >
                      <Play className="w-10 h-10 text-white ml-1 fill-current" />
                    </motion.div>
                    <h3 className="text-white font-serif text-2xl tracking-wide uppercase mb-2">Launch 360° Experience</h3>
                    <p className="text-gray-300 text-sm">Takes approximately 5 seconds to load</p>
                  </div>
                  
                  <div className="absolute bottom-6 left-6 flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium text-white border border-white/10">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span>Live Factory Stream Available</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tour"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full h-full flex flex-col"
              >
                <div className="flex-1 bg-black">
                  <iframe
                    src="https://app.cloudpano.com/tours/5CCdhZ1Gn"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    title="360 Virtual Tour"
                    className="w-full h-full"
                  />
                </div>
                <div className="absolute top-4 right-4 z-20">
                   <button 
                     onClick={(e) => { e.stopPropagation(); setShowLiveTour(false); }}
                     className="bg-black/60 hover:bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold text-white border border-white/10 transition-colors"
                   >
                     Close Tour
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Tour Stops */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Settings,
              title: 'Processing Unit',
              desc: 'See how raw husks are defibered and cleaned.',
            },
            {
              icon: Warehouse,
              title: 'Drying & Storage',
              desc: 'Controlled environments ensuring optimal moisture levels.',
            },
            {
              icon: Truck,
              title: 'Packaging & Logistics',
              desc: 'Precision baling and container loading operations.',
            },
          ].map((stop, idx) => (
            <div
              key={idx}
              className="bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
            >
              <stop.icon className="w-8 h-8 text-sml-green-light mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                {stop.title}
              </h3>
              <p className="text-gray-400 text-sm">{stop.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
