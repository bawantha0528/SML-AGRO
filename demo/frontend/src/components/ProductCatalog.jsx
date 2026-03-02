import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, ArrowLeft, Info, Check } from 'lucide-react';
import { productsData } from '../admin/mockData';

export function ProductCatalog({ onNavigate }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract unique categories from data
  const categories = ['All', ...new Set(productsData.map(p => p.category))];

  // Map admin mockData format (which we'll use for now) to display
  // Using some temp images and details since basic mockData lacks them
  const products = productsData.map(p => ({
    ...p,
    image: '📦',
    desc: `High-quality ${p.name.toLowerCase()} for industrial and agricultural use.`,
    details: '100% natural, biodegradable.'
  }));

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="catalog" className="py-12 bg-sml-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header & Search */}
        <div className="mb-12">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-sm text-gray-500 hover:text-sml-green transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-sml-dark mb-4">
                Product Catalog
              </h2>
              <p className="text-gray-600 max-w-2xl">
                Browse our comprehensive range of premium coconut coir products.
              </p>
            </div>

            <div className="relative w-full md:w-80 flex-shrink-0">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 focus:outline-none focus:border-sml-green focus:ring-1 focus:ring-sml-green transition-shadow shadow-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex gap-3 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat
                  ? 'bg-sml-green text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-2xl text-center shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[400px]">
            <div className="text-6xl mb-4 opacity-50">🔍</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No products found</h3>
            <p className="text-gray-500 max-w-md">We couldn't find any products matching your search or category filter. Try using different keywords.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-2 bg-sml-dark text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="h-48 bg-gray-50 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
                  {product.image}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-sml-dark group-hover:text-sml-green transition-colors">
                        {product.name}
                      </h3>
                      <span className="text-xs font-bold text-sml-green bg-sml-green/10 px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.desc}
                    </p>
                  </div>

                  <div className="mt-auto space-y-4">
                    <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Price</p>
                        <p className="text-2xl font-black text-sml-dark">${product.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xs font-semibold flex items-center justify-end ${product.stock > 0 ? 'text-sml-green' : 'text-red-500'
                          }`}>
                          {product.stock > 0 ? (
                            <><Check className="w-3 h-3 mr-1" /> In Stock</>
                          ) : 'Out of Stock'}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('product-details', product.id)}
                      className="w-full bg-sml-dark text-sml-cream py-3 rounded-lg hover:bg-gray-800 font-bold tracking-wide transition-colors flex items-center justify-center group/btn"
                    >
                      <Info className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
                      View Details
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductCatalog;
