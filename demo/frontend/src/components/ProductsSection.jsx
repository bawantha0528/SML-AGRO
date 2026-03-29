import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sprout,
  Layers,
  Package,
  Grid,
  Anchor,
  Disc,
} from 'lucide-react';

export function ProductsSection({ onNavigate }) {
  const [products, setProducts] = useState([]);

  const categoryIcons = {
    'FIBER': { icon: Layers, color: 'bg-amber-100 text-amber-800' },
    'COCOPEAT': { icon: Sprout, color: 'bg-green-100 text-green-800' },
    'MATS': { icon: Grid, color: 'bg-orange-100 text-orange-800' },
    'GROW_BAGS': { icon: Package, color: 'bg-blue-100 text-blue-800' },
    'ROPE': { icon: Anchor, color: 'bg-yellow-100 text-yellow-800' },
    'GEOTEXTILES': { icon: Disc, color: 'bg-stone-100 text-stone-800' },
  };

  useEffect(() => {
    fetch('http://localhost:8081/api/public/products')
      .then(res => res.json())
      .then(data => {
        // Show only first 6 on landing page
        setProducts(data.slice(0, 6));
      })
      .catch(err => console.error('Error fetching landing products:', err));
  }, []);

  return (
    <section id="products" className="py-20 bg-sml-cream-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sml-green font-semibold text-sm tracking-widest uppercase">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-sml-dark mt-3 mb-6">
            Our Premium Products
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Sourced from the finest coconut plantations in Sri Lanka, processed
            with precision to meet global standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const style = categoryIcons[product.category] || { icon: Package, color: 'bg-gray-100 text-gray-800' };
            const IconComponent = style.icon;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-sml-cream-dark/30"
              >
                <div className="h-48 bg-sml-cream-dark/10 relative overflow-hidden flex items-center justify-center group-hover:bg-sml-cream-dark/20 transition-colors">
                  <div
                    className={`w-16 h-16 rounded-full ${style.color} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-serif font-bold text-sml-dark mb-3 group-hover:text-sml-green transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-6 line-clamp-2">
                    {product.description || 'Quality export coconut coir product from SML Agro.'}
                  </p>

                  <button
                    onClick={() => onNavigate('catalog')}
                    className="inline-flex items-center text-sml-dark font-medium hover:text-sml-green transition-colors group/link"
                  >
                    View Details
                    <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {products.length === 0 && (
          <div className="text-center py-10 text-gray-400">
            Wait for it... Loading our finest products.
          </div>
        )}

        <div className="mt-16 text-center">
          <button
            onClick={() => onNavigate('catalog')}
            className="bg-sml-dark text-sml-cream px-8 py-4 rounded-full font-bold hover:bg-gray-800 transition-all shadow-lg"
          >
            Explore Full Catalog
          </button>
        </div>
      </div>
    </section>
  );
}
