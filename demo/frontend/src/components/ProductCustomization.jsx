import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Send, ArrowLeft } from 'lucide-react';

export function ProductCustomization({ onNavigate }) {
  const [config, setConfig] = useState({
    productType: 'Coir Mats',
    dimensions: '1m x 10m',
    thickness: '10mm',
    quantity: 100,
    customNotes: '',
  });

  return (
    <section id="customize" className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          {onNavigate && (
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center text-sm text-gray-500 hover:text-sml-green transition-colors mb-6 group"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </button>
          )}

          <h2 className="text-4xl md:text-5xl font-serif font-bold text-sml-dark mb-6">
            Customize Your Order
          </h2>
          <p className="text-gray-600 text-lg">
            Configure your product specifications exactly as you need them.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-2 bg-sml-cream rounded-2xl p-8 shadow-sm border border-sml-cream-dark">
            <div className="mb-8">
              <label className="block text-sm font-bold text-sml-dark uppercase tracking-wider mb-3">
                Select Product Type
              </label>
              <select
                value={config.productType}
                onChange={(e) => setConfig({ ...config, productType: e.target.value })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green focus:border-transparent"
              >
                <option>Coir Mats</option>
                <option>Grow Bags</option>
                <option>Coir Pith Blocks</option>
                <option>Geotextiles</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions
                </label>
                <input
                  type="text"
                  value={config.dimensions}
                  onChange={(e) => setConfig({ ...config, dimensions: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thickness
                </label>
                <input
                  type="text"
                  value={config.thickness}
                  onChange={(e) => setConfig({ ...config, thickness: e.target.value })}
                  className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green"
                />
              </div>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (Units)
              </label>
              <input
                type="number"
                min="1"
                value={config.quantity}
                onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green"
              />
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Notes
              </label>
              <textarea
                rows="4"
                value={config.customNotes}
                onChange={(e) => setConfig({ ...config, customNotes: e.target.value })}
                placeholder="Any additional requirements..."
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sml-green"
              />
            </div>

            <button className="w-full bg-sml-dark text-sml-cream py-3 rounded-lg hover:bg-gray-800 font-bold flex items-center justify-center space-x-2">
              <Send className="w-4 h-4" />
              <span>Submit Configuration</span>
            </button>
          </div>

          {/* Summary Panel */}
          <div className="bg-sml-cream rounded-2xl p-8 h-fit">
            <h3 className="text-lg font-bold text-sml-dark mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Product:</span>
                <span className="font-bold text-sml-dark">{config.productType}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Quantity:</span>
                <span className="font-bold text-sml-dark">{config.quantity} units</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Est. Price:</span>
                <span className="font-bold text-sml-green text-lg">
                  ${config.quantity * 12.50}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
