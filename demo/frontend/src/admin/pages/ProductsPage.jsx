import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Settings, ChevronDown, ChevronUp } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/admin/products';

const EMPTY_PRODUCT = { name: '', category: 'COCOPEAT', price: 0, stockQuantity: 0, unit: 'piece', description: '', isAvailable: true, specifications: '' };
const EMPTY_OPTION  = { id: '', label: '', type: 'select', required: false, priceImpact: 0, min: '', max: '', unit: '', options: [], dependsOnId: '', dependsOnValue: '' };
const EMPTY_CHOICE  = { value: '', label: '', priceImpact: 0 };

export function ProductsPage() {
    const [products, setProducts]       = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading]         = useState(true);
    const [error, setError]             = useState(null);
    const [editingProduct, setEditingProduct] = useState(null);

    // Specs builder state
    const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
    const [specOptions, setSpecOptions] = useState([]); // array of option definitions
    const [expandedSpec, setExpandedSpec] = useState(null);

    useEffect(() => { fetchProducts(); }, []);

    const fetchProducts = async () => {
        try { setLoading(true); const r = await fetch(API_BASE_URL); if (!r.ok) throw new Error(); setProducts(await r.json()); setError(null); }
        catch { setError('Failed to load products'); }
        finally { setLoading(false); }
    };

    const openNew = () => { setEditingProduct(null); setProductForm(EMPTY_PRODUCT); setSpecOptions([]); setIsModalOpen(true); };

    const openEdit = (prod) => {
        setEditingProduct(prod);
        setProductForm(prod);
        try { setSpecOptions(JSON.parse(prod.specifications || '[]')); } catch { setSpecOptions([]); }
        setIsModalOpen(true);
    };

    const closeModal = () => { setIsModalOpen(false); setEditingProduct(null); setSpecOptions([]); };

    const buildSpecsJson = () => JSON.stringify(specOptions);

    const handleSave = async (e) => {
        e.preventDefault();
        const body = { ...productForm, specifications: buildSpecsJson() };
        try {
            const url  = editingProduct ? `${API_BASE_URL}/${editingProduct.id}` : API_BASE_URL;
            const method = editingProduct ? 'PUT' : 'POST';
            const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (!r.ok) throw new Error();
            closeModal(); fetchProducts();
        } catch { alert('Error saving product'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        const r = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        if (r.ok) fetchProducts();
    };

    // ── Spec option helpers ───────────────────────────────────────────────
    const addSpec = () => setSpecOptions(prev => [...prev, { ...EMPTY_OPTION, id: `opt_${Date.now()}`, options: [] }]);
    const removeSpec = (idx) => setSpecOptions(prev => prev.filter((_, i) => i !== idx));
    const updateSpec = (idx, key, val) => setSpecOptions(prev => prev.map((s, i) => i === idx ? { ...s, [key]: val } : s));

    const addChoice = (idx) => setSpecOptions(prev => prev.map((s, i) => i === idx ? { ...s, options: [...(s.options||[]), { ...EMPTY_CHOICE }] } : s));
    const removeChoice = (specIdx, cIdx) => setSpecOptions(prev => prev.map((s, i) => i === specIdx ? { ...s, options: s.options.filter((_, ci) => ci !== cIdx) } : s));
    const updateChoice = (specIdx, cIdx, key, val) => setSpecOptions(prev => prev.map((s, i) => i === specIdx ? { ...s, options: s.options.map((c, ci) => ci === cIdx ? { ...c, [key]: val } : c) } : s));

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <button onClick={openNew} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            {loading ? <div className="text-center py-10">Loading...</div>
            : error ? <div className="text-red-500 text-center py-10">{error}</div>
            : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map(prod => (
                        <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="h-28 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-4xl">📦</div>
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{prod.name}</h3>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">{prod.category}</p>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full font-semibold ${prod.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {prod.isAvailable ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                {prod.specifications && prod.specifications !== '[]' && (
                                    <p className="text-xs text-blue-600 mb-2">
                                        <Settings className="inline w-3 h-3 mr-1" />
                                        {(() => { try { return JSON.parse(prod.specifications).length; } catch { return 0; } })()} custom options configured
                                    </p>
                                )}
                                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                    <span className="font-bold text-gray-900">${prod.price}</span>
                                    <span className="text-sm text-gray-500">{prod.stockQuantity} {prod.unit}s</span>
                                </div>
                                <div className="mt-3 flex space-x-2">
                                    <button onClick={() => openEdit(prod)} className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center">
                                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(prod.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center">
                                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">No products found.</div>}
                </div>
            )}

            {/* ── Modal ── */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
                        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
                            <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
                            <button onClick={closeModal}><X className="w-6 h-6 text-gray-400 hover:text-gray-700" /></button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-5">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={productForm.category} onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                                        {['MATS','GROW_BAGS','FIBER','COCOPEAT','ROPE','GEOTEXTILES'].map(c => <option key={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
                                    <input type="number" step="0.01" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={productForm.price} onChange={e => setProductForm({ ...productForm, price: parseFloat(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input type="number" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={productForm.stockQuantity} onChange={e => setProductForm({ ...productForm, stockQuantity: parseInt(e.target.value) })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                                    <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={productForm.unit} onChange={e => setProductForm({ ...productForm, unit: e.target.value })} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <textarea rows={2} className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
                                </div>
                                <div className="col-span-2 flex items-center gap-2">
                                    <input type="checkbox" id="avail" checked={productForm.isAvailable}
                                        onChange={e => setProductForm({ ...productForm, isAvailable: e.target.checked })} className="w-4 h-4" />
                                    <label htmlFor="avail" className="text-sm font-medium text-gray-700">Available for sale</label>
                                </div>
                            </div>

                            {/* ── Customization Options Builder ── */}
                            <div className="border-t pt-5">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h4 className="font-bold text-gray-800 flex items-center gap-2"><Settings className="w-4 h-4 text-green-600" /> Customization Options</h4>
                                        <p className="text-xs text-gray-400 mt-0.5">Define the options buyers can configure for this product.</p>
                                    </div>
                                    <button type="button" onClick={addSpec}
                                        className="flex items-center gap-1 bg-green-50 text-green-700 border border-green-300 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-green-100">
                                        <Plus className="w-4 h-4" /> Add Option
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    {specOptions.map((spec, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden">
                                            {/* Option header */}
                                            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 cursor-pointer"
                                                onClick={() => setExpandedSpec(expandedSpec === idx ? null : idx)}>
                                                <span className="font-medium text-sm text-gray-800">{spec.label || `Option ${idx + 1}`} <span className="text-xs text-gray-400 ml-1">({spec.type})</span></span>
                                                <div className="flex gap-2">
                                                    <button type="button" onClick={e => { e.stopPropagation(); removeSpec(idx); }} className="text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>
                                                    {expandedSpec === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                                </div>
                                            </div>

                                            {/* Option details */}
                                            {expandedSpec === idx && (
                                                <div className="p-4 space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Option ID (unique key)</label>
                                                            <input type="text" placeholder="e.g. thickness" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                                                value={spec.id} onChange={e => updateSpec(idx, 'id', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Display Label</label>
                                                            <input type="text" placeholder="e.g. Thickness" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                                                value={spec.label} onChange={e => updateSpec(idx, 'label', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                                                            <select className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                                                value={spec.type} onChange={e => updateSpec(idx, 'type', e.target.value)}>
                                                                <option value="select">Select (dropdown)</option>
                                                                <option value="checkbox">Checkbox</option>
                                                                <option value="number">Number</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-medium text-gray-600 mb-1">Price Impact (per unit, $)</label>
                                                            <input type="number" step="0.01" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                                                value={spec.priceImpact} onChange={e => updateSpec(idx, 'priceImpact', parseFloat(e.target.value) || 0)} />
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <input type="checkbox" id={`req_${idx}`} checked={spec.required}
                                                                onChange={e => updateSpec(idx, 'required', e.target.checked)} className="w-4 h-4" />
                                                            <label htmlFor={`req_${idx}`} className="text-xs font-medium text-gray-600">Required field</label>
                                                        </div>
                                                    </div>

                                                    {/* Number-specific */}
                                                    {spec.type === 'number' && (
                                                        <div className="grid grid-cols-3 gap-3">
                                                            <div><label className="block text-xs text-gray-500 mb-1">Min</label>
                                                                <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={spec.min} onChange={e => updateSpec(idx, 'min', e.target.value)} /></div>
                                                            <div><label className="block text-xs text-gray-500 mb-1">Max</label>
                                                                <input type="number" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={spec.max} onChange={e => updateSpec(idx, 'max', e.target.value)} /></div>
                                                            <div><label className="block text-xs text-gray-500 mb-1">Unit label</label>
                                                                <input type="text" placeholder="mm" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm" value={spec.unit} onChange={e => updateSpec(idx, 'unit', e.target.value)} /></div>
                                                        </div>
                                                    )}

                                                    {/* Dependency */}
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">Depends On (option ID)</label>
                                                            <input type="text" placeholder="Leave empty if no dependency" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                                                value={spec.dependsOnId} onChange={e => updateSpec(idx, 'dependsOnId', e.target.value)} />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1">When value equals</label>
                                                            <input type="text" placeholder="e.g. true or option value" className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm"
                                                                value={spec.dependsOnValue} onChange={e => updateSpec(idx, 'dependsOnValue', e.target.value)} />
                                                        </div>
                                                    </div>

                                                    {/* Select choices */}
                                                    {spec.type === 'select' && (
                                                        <div>
                                                            <div className="flex items-center justify-between mb-2">
                                                                <label className="text-xs font-medium text-gray-600">Choices</label>
                                                                <button type="button" onClick={() => addChoice(idx)} className="text-xs text-green-600 hover:underline flex items-center gap-1">
                                                                    <Plus className="w-3 h-3" /> Add Choice
                                                                </button>
                                                            </div>
                                                            <div className="space-y-2">
                                                                {(spec.options || []).map((choice, cIdx) => (
                                                                    <div key={cIdx} className="flex gap-2 items-center">
                                                                        <input type="text" placeholder="value" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                                                                            value={choice.value} onChange={e => updateChoice(idx, cIdx, 'value', e.target.value)} />
                                                                        <input type="text" placeholder="label" className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                                                                            value={choice.label} onChange={e => updateChoice(idx, cIdx, 'label', e.target.value)} />
                                                                        <input type="number" step="0.01" placeholder="+$" className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-xs"
                                                                            value={choice.priceImpact} onChange={e => updateChoice(idx, cIdx, 'priceImpact', parseFloat(e.target.value) || 0)} />
                                                                        <button type="button" onClick={() => removeChoice(idx, cIdx)} className="text-red-400 hover:text-red-600"><X className="w-4 h-4" /></button>
                                                                    </div>
                                                                ))}
                                                                {(spec.options || []).length === 0 && <p className="text-xs text-gray-400 italic">No choices yet. Add at least one.</p>}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {specOptions.length === 0 && (
                                        <p className="text-sm text-gray-400 italic text-center py-4">No customization options defined. Click "Add Option" to start.</p>
                                    )}
                                </div>
                            </div>

                            <div className="pt-4 border-t">
                                <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors">
                                    {editingProduct ? 'Update Product' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
