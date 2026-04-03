import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Send, ArrowLeft, CheckCircle, AlertTriangle, BookMarked, Trash2 } from 'lucide-react';

const API = 'http://localhost:8081/api';

// (Hardcoded specifications removed; now fetched from backend API)

export function ProductCustomization({ onNavigate }) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selections, setSelections] = useState({});
  const [quantity, setQuantity] = useState(100);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  // Template saving
  const [userEmail, setUserEmail] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Fetch products from API on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API}/public/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
        if (data.length > 0) setSelectedProduct(data[0]);
      } catch (err) {
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const specs = useMemo(() => {
    if (!selectedProduct || !selectedProduct.specifications) return [];
    try {
      return JSON.parse(selectedProduct.specifications);
    } catch (e) {
      console.error('Error parsing specifications for', selectedProduct.name, e);
      return [];
    }
  }, [selectedProduct]);

  // Reset selections when product changes
  useEffect(() => {
    setSelections({});
    setErrors({});
  }, [selectedProduct]);

  // Load templates from localStorage (as fallback) + API
  useEffect(() => {
    const stored = localStorage.getItem('sml_templates');
    if (stored) setSavedTemplates(JSON.parse(stored));
  }, []);

  // ── Determine visible options (dependent options logic) ──────────────────
  const visibleSpecs = useMemo(() => {
    return specs.filter(spec => {
      if (!spec.dependsOn) return true;
      const dep = spec.dependsOn;
      const currentVal = selections[dep.id];
      if (dep.value === true) return currentVal === true;
      return currentVal === dep.value;
    });
  }, [specs, selections]);

  // ── Price calculation ────────────────────────────────────────────────────
  const { unitPrice, totalPrice, priceBreakdown } = useMemo(() => {
    const base = selectedProduct?.price || 10;
    let extra = 0;
    const breakdown = [];

    visibleSpecs.forEach(spec => {
      const val = selections[spec.id];
      if (spec.type === 'select' && val) {
        const opt = spec.options?.find(o => o.value === val);
        if (opt && opt.priceImpact !== 0) {
          extra += opt.priceImpact;
          breakdown.push({ label: `${spec.label}: ${opt.label}`, impact: opt.priceImpact });
        }
      } else if (spec.type === 'checkbox' && val === true) {
        extra += spec.priceImpact || 0;
        breakdown.push({ label: spec.label, impact: spec.priceImpact });
      } else if (spec.type === 'number' && val) {
        const impact = (spec.priceImpact || 0) * (parseFloat(val) - (spec.min || 1));
        if (impact > 0) {
          extra += impact;
          breakdown.push({ label: `${spec.label} (${val}${spec.unit || ''})`, impact });
        }
      }
    });

    const unit = base + extra;
    return { unitPrice: unit, totalPrice: unit * quantity, priceBreakdown: breakdown };
  }, [selections, selectedProduct, quantity, visibleSpecs]);

  // ── Validation ───────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    visibleSpecs.forEach(spec => {
      const val = selections[spec.id];
      if (spec.required && (val === undefined || val === '' || val === null)) {
        errs[spec.id] = `${spec.label} is required`;
      }
      if (spec.type === 'number' && val !== undefined && val !== '') {
        const n = parseFloat(val);
        if (spec.min !== undefined && n < spec.min) errs[spec.id] = `Min value is ${spec.min}`;
        if (spec.max !== undefined && n > spec.max) errs[spec.id] = `Max value is ${spec.max}`;
      }
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (id, value) => {
    setSelections(prev => ({ ...prev, [id]: value }));
    setErrors(prev => ({ ...prev, [id]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const customizationDetails = JSON.stringify({ product: selectedProduct, options: selections, quantity, unitPrice, totalPrice });
    onNavigate('inquiry', { productsRequested: selectedProduct, customizationDetails, estimatedQuantity: String(quantity) });
  };

  const handleSaveTemplate = async () => {
    if (!userEmail) { setSaveMsg('Please enter your email to save.'); return; }
    if (!templateName) { setSaveMsg('Please enter a template name.'); return; }
    const configurationData = JSON.stringify({ product: selectedProduct?.name, options: selections, quantity });
    const template = { templateName, userEmail, productId: selectedProduct?.id, configurationData, savedAt: new Date().toISOString() };

    // Save to backend
    try {
      await fetch(`${API}/customization/templates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });
    } catch (_) { /* backend may not be running; fallback to local */ }

    // Always save locally too
    const updated = [...savedTemplates, { ...template, id: Date.now() }];
    setSavedTemplates(updated);
    localStorage.setItem('sml_templates', JSON.stringify(updated));
    setSaveMsg('✓ Template saved!');
    setTimeout(() => setSaveMsg(''), 3000);
  };

  const handleLoadTemplate = (t) => {
    const cfg = JSON.parse(t.configurationData);
    const prod = products.find(p => p.name === cfg.product);
    if (prod) {
      setSelectedProduct(prod);
      setTimeout(() => {
        setSelections(cfg.options || {});
        setQuantity(cfg.quantity || 100);
      }, 50);
    }
    setShowTemplates(false);
  };

  const handleDeleteTemplate = (id) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('sml_templates', JSON.stringify(updated));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center p-12">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-2">Inquiry Submitted!</h2>
          <button onClick={() => onNavigate('home')} className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg">Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          {onNavigate && (
            <button onClick={() => onNavigate('home')} className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 transition-colors mb-6 group">
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Home
            </button>
          )}
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Customize Your Order</h2>
          <p className="text-gray-500 text-lg">Configure your product with real-time pricing and validation.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ── Left: Configuration Form ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Product selector */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">1. Select Product</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {products.map(p => (
                  <button key={p.id} onClick={() => setSelectedProduct(p)}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${selectedProduct?.id === p.id ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 bg-white text-gray-600 hover:border-green-300'}`}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic option fields */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">2. Configure Options</label>
              <div className="space-y-5">
                <AnimatePresence>
                  {visibleSpecs.map(spec => (
                    <motion.div key={spec.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>

                      {/* SELECT */}
                      {spec.type === 'select' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {spec.label} {spec.required && <span className="text-red-500">*</span>}
                          </label>
                          <select value={selections[spec.id] || ''}
                            onChange={e => handleChange(spec.id, e.target.value)}
                            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-400 focus:border-transparent bg-white ${errors[spec.id] ? 'border-red-400' : 'border-gray-300'}`}>
                            <option value="">-- Select --</option>
                            {spec.options.map(o => (
                              <option key={o.value} value={o.value}>
                                {o.label}{o.priceImpact > 0 ? ` (+$${o.priceImpact.toFixed(2)})` : ''}
                              </option>
                            ))}
                          </select>
                          {errors[spec.id] && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{errors[spec.id]}</p>}
                        </div>
                      )}

                      {/* CHECKBOX */}
                      {spec.type === 'checkbox' && (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input type="checkbox" checked={selections[spec.id] === true}
                            onChange={e => handleChange(spec.id, e.target.checked)}
                            className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-green-400" />
                          <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">
                            {spec.label}
                            {spec.priceImpact > 0 && <span className="ml-2 text-green-600 font-semibold">+${spec.priceImpact.toFixed(2)}/unit</span>}
                            {spec.dependsOn && <span className="ml-2 text-xs text-gray-400 italic">(requires {specs.find(s => s.id === spec.dependsOn.id)?.label})</span>}
                          </span>
                        </label>
                      )}

                      {/* NUMBER */}
                      {spec.type === 'number' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {spec.label} {spec.required && <span className="text-red-500">*</span>}
                            <span className="ml-2 text-xs text-gray-400">(min: {spec.min}, max: {spec.max})</span>
                          </label>
                          <input type="number" min={spec.min} max={spec.max}
                            value={selections[spec.id] ?? spec.min ?? ''}
                            onChange={e => handleChange(spec.id, e.target.value)}
                            className={`w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-400 bg-white ${errors[spec.id] ? 'border-red-400' : 'border-gray-300'}`} />
                          {errors[spec.id] && <p className="text-red-500 text-xs mt-1 flex items-center"><AlertTriangle className="w-3 h-3 mr-1" />{errors[spec.id]}</p>}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Quantity */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-3">3. Quantity (Units)</label>
              <input type="number" min={1} value={quantity}
                onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-green-400 bg-white text-lg font-semibold" />
            </div>

            {/* Template Save */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <div className="flex items-center gap-2 mb-4">
                <BookMarked className="w-5 h-5 text-green-600" />
                <span className="font-bold text-gray-800">Save as Template for Reuse</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <input type="text" placeholder="Template name (e.g. Bulk Coir Order)" value={templateName}
                  onChange={e => setTemplateName(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-400 bg-white" />
                <input type="email" placeholder="Your email" value={userEmail}
                  onChange={e => setUserEmail(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-green-400 bg-white" />
              </div>
              <div className="flex gap-3 flex-wrap">
                <button onClick={handleSaveTemplate}
                  className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                  <Save className="w-4 h-4" /> Save Template
                </button>
                {savedTemplates.length > 0 && (
                  <button onClick={() => setShowTemplates(!showTemplates)}
                    className="flex items-center gap-2 border border-green-400 text-green-700 px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-green-100 transition-colors">
                    <BookMarked className="w-4 h-4" /> My Templates ({savedTemplates.length})
                  </button>
                )}
              </div>
              {saveMsg && <p className="mt-2 text-sm text-green-700 font-medium">{saveMsg}</p>}

              {/* Templates list */}
              <AnimatePresence>
                {showTemplates && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mt-4 space-y-2">
                    {savedTemplates.map(t => (
                      <div key={t.id} className="flex items-center justify-between bg-white border border-green-200 rounded-lg px-4 py-3">
                        <div>
                          <p className="font-semibold text-sm text-gray-800">{t.templateName}</p>
                          <p className="text-xs text-gray-400">{JSON.parse(t.configurationData).product} · {new Date(t.savedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleLoadTemplate(t)} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded-lg font-medium hover:bg-green-200">Load</button>
                          <button onClick={() => handleDeleteTemplate(t.id)} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit}
              className="w-full bg-gray-900 text-white py-4 rounded-xl hover:bg-gray-700 font-bold text-lg flex items-center justify-center gap-3 transition-colors">
              <Send className="w-5 h-5" /> Proceed to Inquiry
            </button>
          </div>

          {/* ── Right: Live Preview Panel ── */}
          <div className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-gray-900 text-white rounded-2xl p-6">
              <h3 className="text-lg font-bold mb-5 border-b border-gray-700 pb-3">Live Order Preview</h3>

              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Product</span>
                  <span className="font-semibold">{selectedProduct?.name}</span>
                </div>
                {visibleSpecs.map(spec => {
                  const val = selections[spec.id];
                  if (val === undefined || val === '') return null;
                  let display = '';
                  if (spec.type === 'select') display = spec.options?.find(o => o.value === val)?.label || val;
                  else if (spec.type === 'checkbox') display = val ? '✓ Yes' : '✗ No';
                  else display = `${val}${spec.unit || ''}`;
                  return (
                    <div key={spec.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">{spec.label}</span>
                      <span className="font-medium">{display}</span>
                    </div>
                  );
                })}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Quantity</span>
                  <span className="font-medium">{quantity} units</span>
                </div>
              </div>

              {/* Price breakdown */}
              {priceBreakdown.length > 0 && (
                <div className="mb-5 bg-gray-800 rounded-xl p-4">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Price Breakdown</p>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-300">Base price</span>
                    <span>${(selectedProduct?.price || 10).toFixed(2)}</span>
                  </div>
                  {priceBreakdown.map((b, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-gray-400 text-xs">{b.label}</span>
                      <span className="text-green-400 text-xs">+${b.impact.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-gray-400 text-sm">Unit Price</span>
                  <span className="text-white font-bold">${unitPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-semibold">Estimated Total</span>
                  <span className="text-green-400 text-2xl font-bold">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3 italic">* Prices are estimates. Final quote confirmed after review.</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
