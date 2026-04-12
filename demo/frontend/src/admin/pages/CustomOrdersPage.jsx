import { Download, Eye, Filter, RefreshCw, Search, Tag } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const STATUS_LIST = ['ALL', 'NEW', 'REVIEWED', 'QUOTED', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'];

function badgeClass(status) {
    switch (status) {
        case 'NEW': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'REVIEWED': return 'bg-slate-100 text-slate-700 border-slate-200';
        case 'QUOTED': return 'bg-violet-100 text-violet-700 border-violet-200';
        case 'IN_PRODUCTION': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'COMPLETED': return 'bg-green-100 text-green-700 border-green-200';
        case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
}

function CustomOrderDetailModal({ order, onClose, onStatusUpdate, savingStatus }) {
    const [nextStatus, setNextStatus] = useState(order.status);

    return (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-start">
                    <div>
                        <p className="text-xs text-gray-400 font-mono">{order.orderNumber}</p>
                        <h3 className="text-lg font-bold text-gray-900">{order.customerName}</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700">Close</button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><p className="text-gray-500">Email</p><p className="font-medium text-gray-900">{order.email}</p></div>
                        <div><p className="text-gray-500">Phone</p><p className="font-medium text-gray-900">{order.phone || '—'}</p></div>
                        <div><p className="text-gray-500">Country</p><p className="font-medium text-gray-900">{order.country}</p></div>
                        <div><p className="text-gray-500">Quantity</p><p className="font-medium text-gray-900">{order.quantity}</p></div>
                        <div><p className="text-gray-500">Product Type</p><p className="font-medium text-gray-900">{order.productType}</p></div>
                        <div><p className="text-gray-500">Color / Size</p><p className="font-medium text-gray-900">{order.color} / {order.size}</p></div>
                        <div><p className="text-gray-500">Budget</p><p className="font-medium text-gray-900">{order.budgetRange || '—'}</p></div>
                        <div><p className="text-gray-500">Target Delivery</p><p className="font-medium text-gray-900">{order.targetDeliveryDate || 'Flexible'}</p></div>
                        <div className="md:col-span-2"><p className="text-gray-500">Design</p><p className="font-medium text-gray-900">{order.designName}</p></div>
                        <div className="md:col-span-2"><p className="text-gray-500">Reference Images</p><p className="font-medium text-gray-900 break-words">{order.referenceImages || '—'}</p></div>
                        <div className="md:col-span-2"><p className="text-gray-500">Notes</p><p className="font-medium text-gray-900 whitespace-pre-wrap">{order.specialNotes || '—'}</p></div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Update Status</p>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_LIST.filter((s) => s !== 'ALL').map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setNextStatus(status)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${nextStatus === status ? 'bg-sml-green text-white border-sml-green' : 'bg-white border-gray-200 text-gray-600'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => onStatusUpdate(order.id, nextStatus)}
                            disabled={savingStatus || nextStatus === order.status}
                            className="mt-3 bg-sml-dark text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {savingStatus ? 'Saving...' : 'Save Status'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function CustomOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [status, setStatus] = useState('ALL');
    const [search, setSearch] = useState('');
    const [selectedProductType, setSelectedProductType] = useState('ALL');
    const [selectedCountry, setSelectedCountry] = useState('ALL');
    const [sortBy, setSortBy] = useState('LATEST');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [savingStatus, setSavingStatus] = useState(false);
    const [customProducts, setCustomProducts] = useState([]);
    const [customProductForm, setCustomProductForm] = useState({
        name: '',
        shortDescription: '',
        imageUrl: '',
        isActive: true,
        displayOrder: 0,
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (status && status !== 'ALL') params.set('status', status);
            if (search.trim()) params.set('search', search.trim());

            const res = await fetch(`/api/admin/custom-orders?${params.toString()}`);
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load custom orders');
            setOrders(json.data || []);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load custom orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, [status]);

    const fetchCustomProducts = async () => {
        try {
            const res = await fetch('/api/admin/custom-products');
            if (!res.ok) throw new Error('Failed to load custom products');
            const json = await res.json();
            setCustomProducts(Array.isArray(json) ? json : []);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        fetchCustomProducts();
    }, []);

    const onSearchSubmit = (e) => {
        e.preventDefault();
        fetchOrders();
    };

    const onStatusUpdate = async (id, nextStatus) => {
        try {
            setSavingStatus(true);
            const res = await fetch(`/api/admin/custom-orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: nextStatus }),
            });
            const json = await res.json();
            if (!res.ok || !json.success) throw new Error(json.message || 'Failed to update status');

            setOrders((prev) => prev.map((o) => (o.id === id ? json.data : o)));
            setSelectedOrder((prev) => (prev?.id === id ? json.data : prev));
        } catch (err) {
            alert(err.message || 'Failed to update status');
        } finally {
            setSavingStatus(false);
        }
    };

    const totalNew = useMemo(() => orders.filter((o) => o.status === 'NEW').length, [orders]);
    const totalInProduction = useMemo(() => orders.filter((o) => o.status === 'IN_PRODUCTION').length, [orders]);
    const totalCompleted = useMemo(() => orders.filter((o) => o.status === 'COMPLETED').length, [orders]);

    const productTypes = useMemo(() => {
        const unique = [...new Set(orders.map((o) => o.productType).filter(Boolean))];
        return ['ALL', ...unique.sort()];
    }, [orders]);

    const countries = useMemo(() => {
        const unique = [...new Set(orders.map((o) => o.country).filter(Boolean))];
        return ['ALL', ...unique.sort()];
    }, [orders]);

    const visibleOrders = useMemo(() => {
        let list = [...orders];
        if (selectedProductType !== 'ALL') {
            list = list.filter((o) => o.productType === selectedProductType);
        }
        if (selectedCountry !== 'ALL') {
            list = list.filter((o) => o.country === selectedCountry);
        }
        list.sort((a, b) => {
            const da = new Date(a.createdAt).getTime();
            const db = new Date(b.createdAt).getTime();
            return sortBy === 'OLDEST' ? da - db : db - da;
        });
        return list;
    }, [orders, selectedProductType, selectedCountry, sortBy]);

    const exportCsv = () => {
        const headers = ['Order Number', 'Customer', 'Email', 'Country', 'Product', 'Color', 'Size', 'Design', 'Quantity', 'Budget', 'Target Delivery', 'Status', 'Created At'];
        const rows = visibleOrders.map((o) => [
            o.orderNumber,
            o.customerName,
            o.email,
            o.country,
            o.productType,
            o.color,
            o.size,
            o.designName,
            o.quantity,
            o.budgetRange || '',
            o.targetDeliveryDate || '',
            o.status,
            o.createdAt,
        ]);
        const csv = [headers, ...rows]
            .map((row) => row.map((cell) => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'custom-inquiries.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleCreateCustomProduct = async (event) => {
        event.preventDefault();
        try {
            const res = await fetch('/api/admin/custom-products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(customProductForm),
            });
            if (!res.ok) throw new Error('Failed to add custom product');

            setCustomProductForm({
                name: '',
                shortDescription: '',
                imageUrl: '',
                isActive: true,
                displayOrder: 0,
            });
            fetchCustomProducts();
        } catch (err) {
            alert(err.message || 'Failed to add custom product');
        }
    };

    const handleDeleteCustomProduct = async (id) => {
        if (!window.confirm('Delete this custom product?')) return;
        try {
            const res = await fetch(`/api/admin/custom-products/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete custom product');
            fetchCustomProducts();
        } catch (err) {
            alert(err.message || 'Failed to delete custom product');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Custom Inquiries</h2>
                    <p className="text-sm text-gray-500">Track made-to-order coir product custom inquiry requests from customers.</p>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-blue-50 border border-blue-200 px-3 py-2 text-sm text-blue-700">
                    <Tag className="w-4 h-4" />
                    New custom inquiries: {totalNew}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{orders.length}</p>
                </div>
                <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-blue-500">New</p>
                    <p className="text-2xl font-bold text-blue-700 mt-1">{totalNew}</p>
                </div>
                <div className="bg-white border border-amber-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-amber-500">In Production</p>
                    <p className="text-2xl font-bold text-amber-700 mt-1">{totalInProduction}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-green-500">Completed</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{totalCompleted}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-800">Customized Products Catalog</h3>
                    <p className="text-sm text-gray-500">Add customizable products shown in the public Customized Products section.</p>
                </div>

                <form onSubmit={handleCreateCustomProduct} className="grid grid-cols-1 md:grid-cols-5 gap-3">
                    <input
                        type="text"
                        placeholder="Product name"
                        value={customProductForm.name}
                        onChange={(e) => setCustomProductForm((prev) => ({ ...prev, name: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                        required
                    />
                    <input
                        type="text"
                        placeholder="Short description"
                        value={customProductForm.shortDescription}
                        onChange={(e) => setCustomProductForm((prev) => ({ ...prev, shortDescription: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        value={customProductForm.imageUrl}
                        onChange={(e) => setCustomProductForm((prev) => ({ ...prev, imageUrl: e.target.value }))}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                    />
                    <input
                        type="number"
                        placeholder="Display order"
                        value={customProductForm.displayOrder}
                        onChange={(e) => setCustomProductForm((prev) => ({ ...prev, displayOrder: Number(e.target.value) || 0 }))}
                        className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm"
                    />
                    <button type="submit" className="bg-sml-dark text-white rounded-lg px-4 py-2.5 text-sm font-semibold hover:bg-gray-800">
                        Add Custom Product
                    </button>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Description</th>
                                <th className="px-4 py-3 text-left">Order</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customProducts.map((item) => (
                                <tr key={item.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3 font-semibold text-gray-800">{item.name}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.shortDescription || '—'}</td>
                                    <td className="px-4 py-3 text-gray-600">{item.displayOrder ?? 0}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${item.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {item.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDeleteCustomProduct(item.id)}
                                            className="text-xs font-semibold text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {customProducts.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-4 py-6 text-center text-gray-500">No custom products added yet.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {STATUS_LIST.map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${status === s ? 'bg-sml-green text-white border-sml-green' : 'bg-white text-gray-600 border-gray-200'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>

                <form onSubmit={onSearchSubmit} className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by customer, email, product, or order number"
                            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                        />
                    </div>
                    <button type="submit" className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Search</button>
                    <button type="button" onClick={fetchOrders} className="px-4 py-2.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 inline-flex items-center gap-2"><RefreshCw className="w-4 h-4" />Refresh</button>
                </form>

                <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2 items-center">
                        <div className="inline-flex items-center gap-2 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                            <Filter className="w-3.5 h-3.5" />
                            Advanced Filters
                        </div>
                        <select value={selectedProductType} onChange={(e) => setSelectedProductType(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2">
                            {productTypes.map((p) => <option key={p} value={p}>{p === 'ALL' ? 'All Products' : p}</option>)}
                        </select>
                        <select value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2">
                            {countries.map((c) => <option key={c} value={c}>{c === 'ALL' ? 'All Countries' : c}</option>)}
                        </select>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="text-sm border border-gray-200 rounded-lg px-3 py-2">
                            <option value="LATEST">Sort: Latest</option>
                            <option value="OLDEST">Sort: Oldest</option>
                        </select>
                    </div>

                    <button type="button" onClick={exportCsv} className="px-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 inline-flex items-center gap-2">
                        <Download className="w-4 h-4" /> Export CSV
                    </button>
                </div>
            </div>

            {loading && <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-500">Loading custom inquiries...</div>}
            {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm">{error}</div>}

            {!loading && !error && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-sm admin-table">
                            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
                                <tr>
                                    <th className="px-5 py-3 text-left">Order</th>
                                    <th className="px-5 py-3 text-left">Customer</th>
                                    <th className="px-5 py-3 text-left">Product</th>
                                    <th className="px-5 py-3 text-left">Options</th>
                                    <th className="px-5 py-3 text-left">Status</th>
                                    <th className="px-5 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visibleOrders.map((order) => (
                                    <tr key={order.id} className="border-t border-gray-100 hover:bg-gray-50">
                                        <td className="px-5 py-4">
                                            <p className="font-mono text-xs text-gray-500">{order.orderNumber}</p>
                                            <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleString()}</p>
                                        </td>
                                        <td className="px-5 py-4">
                                            <p className="font-semibold text-gray-800">{order.customerName}</p>
                                            <p className="text-xs text-gray-500">{order.email}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-700">{order.productType}</td>
                                        <td className="px-5 py-4 text-gray-600">{order.color} / {order.size} / {order.designName}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex px-2.5 py-1 rounded-full border text-xs font-semibold ${badgeClass(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <button onClick={() => setSelectedOrder(order)} className="inline-flex items-center gap-1.5 text-xs font-semibold text-sml-green hover:text-green-700">
                                                <Eye className="w-4 h-4" />View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {visibleOrders.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-10 text-center text-gray-500">No custom inquiries found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {selectedOrder && (
                <CustomOrderDetailModal
                    order={selectedOrder}
                    onClose={() => setSelectedOrder(null)}
                    onStatusUpdate={onStatusUpdate}
                    savingStatus={savingStatus}
                />
            )}
        </div>
    );
}
