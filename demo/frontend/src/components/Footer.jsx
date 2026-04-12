import {
    ArrowRight,
    Facebook,
    Instagram,
    Linkedin,
    Twitter
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-sml-dark text-sml-cream pt-20 pb-10 border-t border-gray-800 relative overflow-hidden">
      <div className="absolute -top-20 -left-20 w-72 h-72 bg-sml-green/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-24 -right-20 w-80 h-80 bg-sml-amber/10 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2 group cursor-pointer">
              <img
                src="/logo.png"
                alt="SML Logo"
                className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col items-center ml-2">
                <span className="text-[#10B981] font-black text-2xl leading-none tracking-[0.2em] ml-1">
                  SML
                </span>
                <span className="text-[#34D399] font-bold text-[8px] tracking-[0.3em] leading-none mt-0.5">
                  AGRO LANKA
                </span>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
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
            <h3 className="text-sml-light font-serif text-xl mb-6">Products</h3>
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
            <h3 className="text-sml-light font-serif text-xl mb-6">Company</h3>
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
            <h3 className="text-white font-serif text-xl mb-6">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              Subscribe to get updates on new products and export news.
            </p>
            <div className="flex group">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 bg-white/5 border border-white/10 rounded-l-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-sml-green/50 transition-colors"
              />
              <button className="bg-sml-green text-white px-5 py-3 rounded-r-lg hover:bg-sml-green-light transition-colors border border-sml-green group-hover:border-sml-green-light">
                <ArrowRight className="w-5 h-5" />
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
