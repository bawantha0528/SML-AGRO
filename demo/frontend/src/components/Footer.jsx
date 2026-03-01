import React from 'react';
import {
  Leaf,
  Linkedin,
  Facebook,
  Instagram,
  Twitter,
  Mail,
  ArrowRight,
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-sml-dark text-sml-cream pt-20 pb-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="SML Logo"
                className="w-12 h-12 object-contain"
              />
              <div className="flex flex-col items-center ml-2">
                <span className="text-[#008542] font-black text-2xl leading-none tracking-[0.25em] ml-1">
                  SML
                </span>
                <span className="text-[#39B54A] font-bold text-[8px] tracking-widest leading-none mt-0.5">
                  AGRO LANKA
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Exporting nature's strength to the world. Premium sustainable
              coconut coir products for modern agriculture.
            </p>
            <div className="flex space-x-4">
              {[Linkedin, Facebook, Instagram, Twitter].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="text-gray-400 hover:text-sml-green-light transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div>
            <h3 className="text-sml-light font-serif text-lg mb-6">Products</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {['Coir Fiber', 'Cocopeat Blocks', 'Grow Bags', 'Coir Mats', 'Geotextiles', 'Coir Rope'].map(
                (item) => (
                  <li key={item}>
                    <a href="#products" className="hover:text-sml-green-light transition-colors flex items-center">
                      <span className="w-1.5 h-1.5 bg-sml-green rounded-full mr-2 opacity-0 hover:opacity-100 transition-opacity"></span>
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-sml-light font-serif text-lg mb-6">Company</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              {['About Us', 'Factory Tour', 'Sustainability', 'Certifications', 'Careers', 'News & Insights'].map(
                (item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-sml-green-light transition-colors">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-sml-light font-serif text-lg mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe to get updates on new products and export news.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/10 border border-white/20 rounded-l-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sml-green"
              />
              <button className="bg-sml-green text-white px-4 py-2 rounded-r-lg hover:bg-sml-green-light transition-colors">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2026 SML Agro Lanka. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
            <a href="#" className="hover:text-sml-green-light transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-sml-green-light transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-sml-green-light transition-colors">
              Certifications
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
