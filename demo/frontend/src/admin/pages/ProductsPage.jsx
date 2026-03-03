import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, Search, RefreshCw, Package, CheckCircle, AlertCircle } from 'lucide-react';

const API_BASE = 'http://localhost:8081/api/admin/products';

const CATEGORIES = [
    'Coir Fiber', 'Cocopeat', 'Grow Bags', 'Geotextiles',
    'Rope', 'Mats', 'Other'
];
const STATUSES = ['Active', 'Inactive', 'Out of Stock'];

const EMPTY_FORM = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'Coir Fiber',
    status: 'Active',
    imageUrl: '',
};

// ─── Toast Notification ──────────────────────────────────────────────────────

function Toast({ message, type, onClose }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3500);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-xl text-white text-sm font-medium animate-fade-in
            ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {type === 'success'
                ? <CheckCircle className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{message}</span>
            <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
                <X className="w-4 h-4" />
            </button>
        </div>
    );
}

// ─── Confirm Delete Dialog ────────────────────────────────────────────────────

function ConfirmDialog({ productName, onConfirm, onCancel }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg text-center mb-2">Delete Product</h3>
                <p className="text-gray-500 text-sm text-center mb-6">
                    Are you sure you want to delete <span className="font-semibold text-gray-700">"{productName}"</span>?
                    This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 font-medium text-sm">
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 bg-red-600 text-white py-2.5 rounded-xl hover:bg-red-700 font-semibold text-sm">
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Product Form Modal ───────────────────────────────────────────────────────

function ProductModal({ product, onSave, onClose, saving }) {
    const [form, setForm] = useState(
        product
            ? {
                name: product.name,
                description: product.description || '',
                price: product.price,
                stock: product.stock,
                category: product.category,
                status: product.status,
                imageUrl: product.imageUrl || '',
            }
            : { ...EMPTY_FORM }
    );
    const [errors, setErrors] = useState({});

    const set = (key, value) => {
        setForm(prev => ({ ...prev, [key]: value }));
        setErrors(prev => ({ ...prev, [key]: '' }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = 'Product name is required';
        if (!form.price || isNaN(form.price) || Number(form.price) <= 0)
            e.price = 'A valid price greater than 0 is required';
        if (form.stock === '' || isNaN(form.stock) || Number(form.stock) < 0)
            e.stock = 'Stock must be 0 or more';
        if (!form.category) e.category = 'Category is required';
        return e;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }
        onSave({
            ...form,
            price: parseFloat(form.price),
            stock: parseInt(form.stock, 10),
        });
    };

    const inputClass = (key) =>
        `w-full border rounded-lg px-3 py-2 text-sm outline-none transition-colors
        ${errors[key]
            ? 'border-red-400 bg-red-50 focus:ring-1 focus:ring-red-300'
            : 'border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-200'}`;

    return (
        <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b shrink-0">
                    <h2 className="text-lg font-bold text-gray-800">
                        {product ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                            Product Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={e => set('name', e.target.value)}
                            className={inputClass('name')}
                            placeholder="e.g. Coir Fiber"
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={e => set('description', e.target.value)}
                            rows={3}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200 resize-none"
                            placeholder="Brief product description..."
                        />
                    </div>

                    {/* Price + Stock */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                Price (USD) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={form.price}
                                onChange={e => set('price', e.target.value)}
                                className={inputClass('price')}
                                placeholder="0.00"
                            />
                            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                Stock (units) <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                value={form.stock}
                                onChange={e => set('stock', e.target.value)}
                                className={inputClass('stock')}
                                placeholder="0"
                            />
                            {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                        </div>
                    </div>

                    {/* Category + Status */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                Category <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={form.category}
                                onChange={e => set('category', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                                Status
                            </label>
                            <select
                                value={form.status}
                                onChange={e => set('status', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200">
                                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
                            Image URL <span className="text-gray-400 font-normal normal-case">(or emoji)</span>
                        </label>
                        <input
                            type="text"
                            value={form.imageUrl}
                            onChange={e => set('imageUrl', e.target.value)}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 focus:ring-1 focus:ring-green-200"
                            placeholder="https://... or 📦"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 border border-gray-200 text-gray-700 py-2.5 rounded-xl hover:bg-gray-50 font-medium text-sm">
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 bg-green-600 text-white py-2.5 rounded-xl hover:bg-green-700 font-semibold text-sm disabled:opacity-60 disabled:cursor-not-allowed transition-colors">
                            {saving ? 'Saving…' : (product ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// ─── Status badge helper ─────────────────────────────────────────────────────

function StatusBadge({ status }) {
    const map = {
        'Active': 'bg-green-100 text-green-700',
        'Inactive': 'bg-gray-100 text-gray-500',
        'Out of Stock': 'bg-red-100 text-red-600',
    };
    return (
        <span className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${map[status] ?? 'bg-yellow-100 text-yellow-700'}`}>
            {status}
        </span>
    );
}

// ─── Skeleton Cards ──────────────────────────────────────────────────────────

function SkeletonCard() {
    return (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-32 bg-gray-100" />
            <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full mt-2" />
                <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                    <div className="h-8 bg-gray-100 rounded-lg flex-1" />
                </div>
            </div>
        </div>
    );
}

// ─── Main ProductsPage ────────────────────────────────────────────────────────

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fetchError, setFetchError] = useState(null);
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(null);         // null | 'add' | product object
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [toast, setToast] = useState(null);

    const showToast = useCallback((message, type = 'success') => {
        setToast({ message, type });
    }, []);

    // ── Fetch all products ──────────────────────────────────────────────────
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setFetchError(null);
        try {
            const res = await fetch(API_BASE);
            if (!res.ok) throw new Error(`Server returned ${res.status}`);
            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            setFetchError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchProducts(); }, [fetchProducts]);

    // ── Create / Update ─────────────────────────────────────────────────────
    const handleSave = async (formData) => {
        setSaving(true);
        const isEdit = modal && modal !== 'add';
        const url = isEdit ? `${API_BASE}/${modal.id}` : API_BASE;
        const method = isEdit ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.message || 'Save failed');
            await fetchProducts();
            setModal(null);
            showToast(isEdit ? 'Product updated successfully!' : 'Product created successfully!');
        } catch (err) {
            showToast(err.message, 'error');
        } finally {
            setSaving(false);
        }
    };

    // ── Delete ──────────────────────────────────────────────────────────────
    const handleDelete = async () => {
        try {
            const res = await fetch(`${API_BASE}/${deleteTarget.id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Delete failed');
            setDeleteTarget(null);
            await fetchProducts();
            showToast('Product deleted.');
        } catch (err) {
            showToast(err.message, 'error');
            setDeleteTarget(null);
        }
    };

    // ── Filter ──────────────────────────────────────────────────────────────
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
    );

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                    <p className="text-sm text-gray-400 mt-0.5">
                        {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} in database`}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={fetchProducts}
                        title="Refresh"
                        className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-500 transition-colors">
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => setModal('add')}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 font-medium shadow-sm transition-colors">
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name or category…"
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-green-400 focus:ring-1 focus:ring-green-200 transition-colors"
                />
                {search && (
                    <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <X className="w-4 h-4" />
                    </button>
                )}
            </div>

            {/* Loading Skeletons */}
            {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            )}

            {/* Fetch Error */}
            {!loading && fetchError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <div>
                        <p className="font-semibold">Could not load products</p>
                        <p className="text-red-500 text-xs mt-0.5">{fetchError}</p>
                    </div>
                    <button
                        onClick={fetchProducts}
                        className="ml-auto text-red-600 underline font-medium text-xs hover:text-red-800">
                        Retry
                    </button>
                </div>
            )}

            {/* Empty State */}
            {!loading && !fetchError && filtered.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                    <Package className="w-14 h-14 mx-auto mb-4 opacity-30" />
                    <p className="font-semibold text-gray-500">
                        {search ? 'No products match your search' : 'No products yet'}
                    </p>
                    <p className="text-sm mt-1">
                        {search ? 'Try a different keyword' : 'Click "Add Product" to create the first one'}
                    </p>
                </div>
            )}

            {/* Product Grid */}
            {!loading && !fetchError && filtered.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map(prod => (
                        <div
                            key={prod.id}
                            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group">

                            {/* Image / Emoji */}
                            <div className="h-32 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center overflow-hidden">
                                {prod.imageUrl?.startsWith('http') ? (
                                    <img
                                        src={prod.imageUrl}
                                        alt={prod.name}
                                        className="h-full w-full object-cover"
                                        onError={e => { e.target.style.display = 'none'; }}
                                    />
                                ) : (
                                    <span className="text-5xl">{prod.imageUrl || '📦'}</span>
                                )}
                            </div>

                            {/* Card Body */}
                            <div className="p-5">
                                <div className="flex justify-between items-start gap-2 mb-1">
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-800 text-base truncate">{prod.name}</h3>
                                        <p className="text-xs text-gray-400 uppercase tracking-wide mt-0.5">{prod.category}</p>
                                    </div>
                                    <StatusBadge status={prod.status} />
                                </div>

                                {prod.description && (
                                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                        {prod.description}
                                    </p>
                                )}

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="font-bold text-green-700 text-lg">
                                        ${Number(prod.price).toFixed(2)}
                                    </span>
                                    <span className={`text-sm font-medium ${prod.stock === 0 ? 'text-red-500' : prod.stock < 50 ? 'text-yellow-600' : 'text-gray-500'}`}>
                                        {prod.stock} units
                                    </span>
                                </div>

                                <div className="mt-4 flex gap-2">
                                    <button
                                        onClick={() => setModal(prod)}
                                        className="flex-1 bg-gray-50 border border-gray-100 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 hover:border-blue-100 flex items-center justify-center gap-1.5 transition-colors">
                                        <Edit2 className="w-3.5 h-3.5" /> Edit
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(prod)}
                                        className="flex-1 bg-red-50 border border-red-100 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center gap-1.5 transition-colors">
                                        <Trash2 className="w-3.5 h-3.5" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add / Edit Modal */}
            {modal && (
                <ProductModal
                    product={modal === 'add' ? null : modal}
                    onSave={handleSave}
                    onClose={() => { if (!saving) setModal(null); }}
                    saving={saving}
                />
            )}

            {/* Delete Confirm Dialog */}
            {deleteTarget && (
                <ConfirmDialog
                    productName={deleteTarget.name}
                    onConfirm={handleDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* Toast */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
