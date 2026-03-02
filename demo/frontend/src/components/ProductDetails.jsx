import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Package, AlertCircle } from 'lucide-react';
import { productsData } from '../admin/mockData';

export function ProductDetails({ id, onNavigate }) {
    // Find product in mock data (will be replaced with API call later)
    const product = productsData.find(p => p.id === parseInt(id));

    // If not found (invalid ID in URL)
    if (!product) {
        return (
            <div className="min-h-screen bg-sml-cream flex flex-col items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600 mb-6">The product you are looking for does not exist or has been removed.</p>
                    <button
                        onClick={() => onNavigate('catalog')}
                        className="w-full bg-sml-green text-white py-3 rounded-lg font-bold hover:bg-sml-dark transition-colors"
                    >
                        Return to Catalog
                    </button>
                </div>
            </div>
        );
    }

    // Extend mock product with dummy rich data for display
    const richProduct = {
        ...product,
        image: '📦',
        description: `Premium grade ${product.name.toLowerCase()} manufactured in our state-of-the-art facility. Ideal for a wide variety of agricultural and industrial applications. Our ${product.category.toLowerCase()} products are renowned for their high quality, durability, and eco-friendly nature.`,
        features: [
            '100% natural and biodegradable',
            'High moisture retention capacity',
            'Environmentally sustainable production',
            'Quality tested for consistency'
        ],
        sku: `SML-${product.id.toString().padStart(4, '0')}`
    };

    return (
        <section className="py-12 bg-sml-cream min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Back Button */}
                <button
                    onClick={() => onNavigate('catalog')}
                    className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-sml-green transition-colors mb-8 group bg-white px-4 py-2 rounded-full shadow-sm"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Catalog
                </button>

                <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
                    <div className="flex flex-col lg:flex-row">

                        {/* Image Section */}
                        <div className="lg:w-1/2 bg-gray-50 p-12 flex items-center justify-center min-h-[400px]">
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="text-9xl drop-shadow-2xl hover:scale-110 transition-transform duration-500 cursor-pointer"
                            >
                                {richProduct.image}
                            </motion.div>
                        </div>

                        {/* Details Section */}
                        <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
                            <div className="mb-2">
                                <span className="inline-block px-3 py-1 bg-sml-green/10 text-sml-green text-xs font-black tracking-wider uppercase rounded-full">
                                    {richProduct.category}
                                </span>
                                <span className="ml-3 text-xs text-gray-400 font-mono">SKU: {richProduct.sku}</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-black text-sml-dark mb-4 leading-tight">
                                {richProduct.name}
                            </h1>

                            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-gray-100">
                                <p className="text-5xl font-black text-sml-green">
                                    ${richProduct.price.toFixed(2)}
                                </p>
                                <div className={`flex items-center text-sm font-bold mb-2 ${richProduct.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                    {richProduct.stock > 0 ? (
                                        <><Check className="w-5 h-5 mr-1" /> {richProduct.stock} Units Available</>
                                    ) : 'Currently Out of Stock'}
                                </div>
                            </div>

                            <div className="mb-8 flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-sml-green" /> Product Description
                                </h3>
                                <p className="text-gray-600 leading-relaxed mb-6">
                                    {richProduct.description}
                                </p>

                                <h4 className="font-bold text-gray-900 mb-3">Key Features</h4>
                                <ul className="space-y-2">
                                    {richProduct.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start text-gray-600 text-sm">
                                            <Check className="w-4 h-4 text-sml-green mr-2 flex-shrink-0 mt-0.5" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ProductDetails;
