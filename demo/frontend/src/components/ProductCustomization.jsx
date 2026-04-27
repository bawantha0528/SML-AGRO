import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getCustomCollectionImage } from '../utils/productImages';

export function ProductCustomization({ onNavigate }) {
  const [customProducts, setCustomProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    fetch('/api/public/custom-products')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch custom products');
        }
        return response.json();
      })
      .then((data) => {
        setCustomProducts(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch((error) => {
        console.error(error);
        setError('Failed to load customized products.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[#FAFAF7] min-h-screen relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-sml-amber/5 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-sml-green/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 stagger-fade">
        <div className="mb-10">
          <button
            onClick={() => onNavigate('home')}
            className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-sml-text/60 hover:text-sml-green transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-sml-dark mb-4 tracking-tight">
            Customized <span className="text-gradient">Products</span>
          </h2>
          <p className="text-lg text-sml-text/70 max-w-3xl leading-relaxed">
            This page is only for customizable coir craft products such as mats, bags,
            hats, baskets, statues, and wall art.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-serif font-bold text-sml-dark">Custom Coir Collection</h3>
          <p className="text-sm text-gray-500 mt-1">Choose a style and place your custom order on the dedicated custom product page.</p>
        </div>

        {loading && <div className="text-sm text-gray-500 mb-4">Loading customized products...</div>}
        {error && <div className="text-sm text-red-600 mb-4">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customProducts.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: index * 0.05 }}
              className="group surface-card flex flex-col overflow-hidden relative"
            >
              <div className="h-48 relative overflow-hidden bg-black/5">
                <img
                  src={item.imageUrl || getCustomCollectionImage(item.name)}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sml-dark/80 via-sml-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
              </div>
              <div className="p-6 relative z-20 bg-white">
                <h4 className="text-lg font-bold text-sml-dark group-hover:text-sml-green transition-colors duration-300">{item.name}</h4>
                <p className="text-sml-text/70 text-sm mt-2 leading-relaxed">{item.shortDescription || 'Customizable coir product'}</p>
                <button
                  onClick={() =>
                    onNavigate('product', {
                      name: item.name,
                      productType: item.name,
                      productKind: 'custom',
                      description: item.shortDescription || 'Customizable coir product',
                      category: 'CUSTOM',
                      imageUrl: item.imageUrl || getCustomCollectionImage(item.name),
                      price: 0,
                      unit: 'piece',
                      stockQuantity: null,
                    })
                  }
                  className="mt-6 w-full bg-sml-dark text-white py-3 rounded-lg text-xs uppercase tracking-widest font-bold hover:bg-sml-green transition-all duration-300 inline-flex items-center justify-center group/btn"
                >
                  Open Product Page
                  <ArrowRight className="w-4 h-4 ml-1.5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
          {!loading && customProducts.length === 0 && (
            <div className="col-span-full text-center py-10 text-gray-500">
              No customizable products are available yet.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
