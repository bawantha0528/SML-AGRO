import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatSpecifications } from '../utils/formatSpecifications';
import { getProductImage, PRODUCT_FALLBACK_IMAGE } from '../utils/productImages';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://sml-agro-backend-production.up.railway.app';

export function ProductCatalog({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'COCOPEAT', 'FIBER', 'GEOTEXTILES', 'GROW_BAGS', 'MATS', 'ROPE'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/public/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="catalog" className="py-24 bg-[#FAFAF7] min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sml-amber/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-sml-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16 stagger-fade">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-sml-text/60 hover:text-sml-green transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h2 className="text-4xl md:text-6xl font-serif font-bold text-sml-dark mb-6 tracking-tight">
            Product <span className="text-gradient">Catalog</span>
          </h2>
          <p className="text-lg text-sml-text/70 max-w-2xl leading-relaxed">
            Browse our comprehensive range of premium coconut coir products.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-12 flex gap-3 flex-wrap stagger-fade" style={{ animationDelay: '0.1s' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 ${selectedCategory === cat
                ? 'bg-sml-green text-white shadow-[0_4px_15px_rgba(21,126,84,0.3)]'
                : 'bg-white text-sml-text/70 hover:bg-sml-green/5 hover:text-sml-green border border-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status messages */}
        {loading && <div className="text-center py-20 text-gray-500">Loading catalog...</div>}
        {error && <div className="text-center py-20 text-red-500 font-bold">{error}</div>}

        {/* Products Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-sml-dark/80 via-sml-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                </div>
                <div className="p-8 flex-1 flex flex-col relative z-20 bg-white">
                  <div className="mb-6 flex-grow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-serif font-bold text-sml-dark group-hover:text-sml-green transition-colors duration-300">
                        {product.name}
                      </h3>
                      <span className="text-[9px] bg-sml-green/10 px-2 py-1 rounded text-sml-green font-bold uppercase tracking-widest ml-2 border border-sml-green/20">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-sml-text/70 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {product.description || 'Premium quality coconut coir product.'}
                    </p>
                    <p className="text-xs text-sml-text/50 italic bg-gray-50 p-3 rounded-lg border border-gray-100">
                      {formatSpecifications(product.specifications)}
                    </p>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-sml-text/60 font-medium uppercase tracking-widest mb-1">Price</p>
                        <p className="text-sml-dark font-bold text-lg">${product.price} <span className="text-xs text-sml-text/60 font-normal">/{product.unit}</span></p>
                      </div>
                      <p className={`text-xs font-bold flex items-center bg-gray-50 px-2 py-1 rounded-md border ${product.stockQuantity > 0 ? 'text-sml-green border-sml-green/20' : 'text-red-500 border-red-500/20'}`}>
                        <Check className="w-3 h-3 mr-1" />
                        {product.stockQuantity > 0 ? `Stock: ${product.stockQuantity}` : 'Out of Stock'}
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('product', { ...product, productType: product.name, productKind: 'raw', imageUrl: getProductImage(product) })}
                      className="w-full bg-sml-dark text-white py-3.5 px-4 rounded-xl hover:bg-sml-green font-bold text-xs uppercase tracking-widest transition-all duration-300 shadow-md flex items-center justify-center group/btn"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found in this category.
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
