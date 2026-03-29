import React from 'react';
import { Play, Warehouse, Truck, Settings } from 'lucide-react';

export function FactoryTour() {
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

        {/* Tour Placeholder */}
        <div className="relative aspect-video w-full bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 mb-12 group cursor-pointer">
          <div className="w-full h-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🏭</div>
              <p className="text-white font-serif text-lg">Interactive Factory Tour</p>
            </div>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-sml-green/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          <div className="absolute bottom-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-lg text-sm font-medium text-white">
            Click to Start Interactive Tour
          </div>
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
