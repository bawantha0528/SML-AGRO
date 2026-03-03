import React from 'react';
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

const products = [
  {
    id: 1,
    name: 'Coir Fiber',
    description: 'Premium grade coir fiber for industrial and agricultural applications. Our coir fiber is carefully processed to maintain optimal quality.',
    icon: Layers,
    color: 'bg-amber-100 text-amber-800',
    price: 2.50,
  },
  {
    id: 2,
    name: 'Cocopeat',
    description: 'High-quality cocopeat with excellent water retention properties. Perfect for hydroponic growing and soil amendment.',
    icon: Sprout,
    color: 'bg-green-100 text-green-800',
    price: 1.80,
  },
  {
    id: 3,
    name: 'Coir Mats',
    description: 'Durable and eco-friendly coir mats for various applications. Available in different sizes and thicknesses.',
    icon: Grid,
    color: 'bg-orange-100 text-orange-800',
    price: 8.99,
  },
  {
    id: 4,
    name: 'Grow Bags',
    description: 'Biodegradable grow bags made from natural coir fiber. Ideal for plant nurseries and home gardening.',
    icon: Package,
    color: 'bg-blue-100 text-blue-800',
    price: 3.25,
  },
  {
    id: 5,
    name: 'Coir Rope',
    description: 'Strong and durable coir rope for marine, agricultural, and decorative purposes. Available in various diameters.',
    icon: Anchor,
    color: 'bg-yellow-100 text-yellow-800',
    price: 4.50,
  },
  {
    id: 6,
    name: 'Coir Geotextiles',
    description: 'Natural geotextile solutions for erosion control and soil stabilization. Eco-friendly alternative to synthetic materials.',
    icon: Disc,
    color: 'bg-stone-100 text-stone-800',
    price: 12.00,
  },
];

export function ProductsSection({ onNavigate }) {

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
          {products.map((product, index) => (
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
                  className={`w-16 h-16 rounded-full ${product.color} flex items-center justify-center mb-4 transform group-hover:scale-110 transition-transform duration-300`}
                >
                  <product.icon className="w-8 h-8" />
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-serif font-bold text-sml-dark mb-3 group-hover:text-sml-green transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6 line-clamp-2">
                  {product.description}
                </p>

                <a
                  href="#customize"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigate('customize');
                  }}
                  className="inline-flex items-center text-sml-dark font-medium hover:text-sml-green transition-colors group/link"
                >
                  Customize Specs
                  <ArrowRight className="ml-2 w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('catalog')}
            className="inline-flex items-center gap-2 bg-sml-dark text-sml-cream px-8 py-3 rounded-full font-bold hover:bg-gray-800 transition-colors"
          >
            View Full Catalog <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
