import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, X, ShoppingBag, Check, ArrowLeft } from 'lucide-react';

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
      const response = await fetch('http://localhost:8081/api/public/products');
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

  const handleInquiry = () => {
    onNavigate('home');
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

  return (
    <section id="catalog" className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-sml-green transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-sml-dark mb-6">
            Product Catalog
          </h2>
          <p className="text-gray-600 max-w-2xl">
            Browse our comprehensive range of premium coconut coir products.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                ? 'bg-sml-dark text-sml-cream'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
              >
                <div className="h-48 bg-gradient-to-br from-amber-200 to-orange-400 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-sml-dark">
                        {product.name}
                      </h3>
                      <span className="text-[10px] bg-sml-cream-dark px-2 py-0.5 rounded text-sml-dark font-bold uppercase">
                        {product.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">
                      {product.description || 'Premium quality coconut coir product.'}
                    </p>
                    <p className="text-xs text-gray-500 italic">
                      {product.specifications || 'Natural, sustainable, biodegradable.'}
                    </p>
                  </div>

                  <div className="mt-auto space-y-3">
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-700 font-medium">
                        Price: <span className="text-sml-dark font-bold">${product.price} /{product.unit}</span>
                      </p>
                      <p className={`text-xs font-semibold mt-1 flex items-center ${product.stockQuantity > 0 ? 'text-sml-green' : 'text-red-500'}`}>
                        <Check className="w-3 h-3 mr-1" />
                        {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity})` : 'Out of Stock'}
                      </p>
                    </div>
                    <button
                      onClick={() => onNavigate('inquiry')}
                      className="w-full bg-sml-dark text-sml-cream py-3 rounded-lg hover:bg-gray-800 font-bold tracking-wide transition-colors flex items-center justify-center"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Inquire Now
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
