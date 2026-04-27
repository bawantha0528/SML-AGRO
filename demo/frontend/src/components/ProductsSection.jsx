import { motion } from 'framer-motion';
import {
    Anchor,
    ArrowRight,
    Disc,
    Grid,
    Layers,
    Package,
    Sprout,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProductImage, PRODUCT_FALLBACK_IMAGE } from '../utils/productImages';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sml-agro-backend-production.up.railway.app';

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
    fetch(`${API_BASE_URL}/api/public/products`)
      .then(res => res.json())
      .then(data => {
        // Show only first 6 on landing page
        setProducts(data.slice(0, 6));
      })
      .catch(err => console.error('Error fetching landing products:', err));
  }, []);

  return (
    <section id="products" className="py-24 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sml-amber/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-sml-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20 stagger-fade">
          <span className="inline-block py-1.5 px-4 rounded-full bg-sml-green/10 text-sml-green font-bold text-xs tracking-[0.2em] uppercase mb-4 shadow-[inset_0_0_0_1px_rgba(21,126,84,0.2)]">
            Our Collection
          </span>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-sml-dark mb-6 tracking-tight">
            Premium <span className="text-gradient">Products</span>
          </h2>
          <p className="text-lg text-sml-text/70 max-w-2xl mx-auto leading-relaxed">
            Sourced from the finest coconut plantations in Sri Lanka, processed
            with precision to meet the highest global standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => {
            const style = categoryIcons[product.category] || { icon: Package, color: 'bg-gray-100 text-gray-800' };
            const IconComponent = style.icon;

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group surface-card flex flex-col overflow-hidden relative"
              >
                <div className="h-56 relative overflow-hidden bg-black/5">
                  <img
                    src={getProductImage(product)}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    onError={(event) => {
                      if (event.currentTarget.src.includes(PRODUCT_FALLBACK_IMAGE)) {
                        return;
                      }
                      event.currentTarget.src = PRODUCT_FALLBACK_IMAGE;
                    }}
                  />
                  <div className="absolute top-4 right-4 z-20">
                    <div
                      className={`w-12 h-12 rounded-2xl ${style.color} flex items-center justify-center shadow-lg backdrop-blur-md bg-white/90 border border-white/50 rotate-3 group-hover:rotate-0 transition-transform duration-300`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                  </div>
                  {/* Glassmorphic image overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-sml-dark/80 via-sml-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                </div>

                <div className="p-8 flex flex-col flex-grow relative z-20 bg-white">
                  <h3 className="text-2xl font-serif font-bold text-sml-dark mb-4 group-hover:text-sml-green transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-sml-text/70 mb-8 line-clamp-2 text-sm leading-relaxed flex-grow">
                    {product.description || 'Quality export coconut coir product from SML Agro.'}
                  </p>

                  <button
                    onClick={() =>
                      onNavigate('product', {
                        ...product,
                        productType: product.name,
                        productKind: 'raw',
                        imageUrl: getProductImage(product),
                      })
                    }
                    className="inline-flex items-center font-bold text-sm tracking-wide text-sml-dark group/link pt-4 border-t border-gray-100 mt-auto w-full"
                  >
                    <span className="relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-sml-green group-hover/link:after:w-full after:transition-all after:duration-300">
                      View Details
                    </span>
                    <ArrowRight className="ml-2 w-4 h-4 text-sml-green transform group-hover/link:translate-x-2 transition-transform duration-300" />
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

        <div className="mt-20 text-center flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={() => onNavigate('catalog')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-sml-dark text-white rounded-full font-bold hover:bg-[#1A2620] transition-all duration-300 shadow-xl hover:-translate-y-1"
          >
            Explore Full Catalog
          </button>
          <button
            onClick={() => onNavigate('customize')}
            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-4 bg-white text-sml-dark rounded-full font-bold hover:bg-gray-50 transition-all duration-300 shadow-xl border border-gray-100 hover:-translate-y-1"
          >
            Customized Products
          </button>
        </div>
      </div>
    </section>
  );
}
