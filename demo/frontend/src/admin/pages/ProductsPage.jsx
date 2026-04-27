import { Edit2, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_BASE_URL = 'http://localhost:8081/api/admin/products';

const EMPTY_PRODUCT = {
  name: '',
  category: 'COCOPEAT',
  price: 0,
  stockQuantity: 0,
  unit: 'piece',
  description: '',
  imageUrl: '',
  isAvailable: true,
  specifications: '',
};

export function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [inquirySummaryByProduct, setInquirySummaryByProduct] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState(EMPTY_PRODUCT);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [productResponse, summaryResponse] = await Promise.all([
        fetch(API_BASE_URL),
        fetch(`${API_BASE_URL}/inquiry-summary`),
      ]);

      if (!productResponse.ok) throw new Error();
      const data = await productResponse.json();
      setProducts(data);

      if (summaryResponse.ok) {
        const summary = await summaryResponse.json();
        const summaryMap = (Array.isArray(summary) ? summary : []).reduce((acc, item) => {
          acc[item.productId] = item.inquiryCount || 0;
          return acc;
        }, {});
        setInquirySummaryByProduct(summaryMap);
      } else {
        setInquirySummaryByProduct({});
      }

      setError(null);
    } catch {
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditingProduct(null);
    setProductForm(EMPTY_PRODUCT);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setProductForm({ ...product, specifications: product.specifications || '' });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    try {
      const url = editingProduct ? `${API_BASE_URL}/${editingProduct.id}` : API_BASE_URL;
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productForm),
      });

      if (!response.ok) throw new Error();
      closeModal();
      fetchProducts();
    } catch {
      alert('Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const response = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
    if (response.ok) {
      fetchProducts();
    }
  };

  const categories = ['ALL', ...new Set(products.map((product) => product.category))];
  const filteredProducts = products.filter((product) => {
    const query = search.trim().toLowerCase();
    const byQuery = !query || product.name.toLowerCase().includes(query) || (product.description || '').toLowerCase().includes(query);
    const byCategory = categoryFilter === 'ALL' || product.category === categoryFilter;
    return byQuery && byCategory;
  });

  const activeProducts = products.filter((product) => product.isAvailable).length;
  const totalProductInquiries = Object.values(inquirySummaryByProduct).reduce((sum, count) => sum + Number(count || 0), 0);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Products</h2>
          <p className="text-sm text-gray-500">Manage raw product catalog inventory.</p>
        </div>
        <button onClick={openNew} className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors">
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-green-500">Active</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{activeProducts}</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-gray-500">Categories</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{categories.length - 1}</p>
        </div>
        <div className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-blue-500">Product Inquiries</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{totalProductInquiries}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-col md:flex-row gap-3 md:items-center">
        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products by name or description"
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(event) => setCategoryFilter(event.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>{category === 'ALL' ? 'All Categories' : category}</option>
          ))}
        </select>
      </div>

      {loading ? <div className="text-center py-10">Loading...</div>
      : error ? <div className="text-red-500 text-center py-10">{error}</div>
      : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-28 bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center text-4xl">📦</div>
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-semibold ${product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {product.isAvailable ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                  <span className="font-bold text-gray-900">${product.price}</span>
                  <span className="text-sm text-gray-500">{product.stockQuantity} {product.unit}s</span>
                </div>
                <div className="mt-3 rounded-lg bg-blue-50 border border-blue-100 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-blue-600">Inquiries</span>
                  <span className="text-sm font-bold text-blue-700">{inquirySummaryByProduct[product.id] || 0}</span>
                </div>
                <div className="mt-3 flex space-x-2">
                  <button onClick={() => openEdit(product)} className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center">
                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center">
                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && <div className="col-span-full text-center py-10 text-gray-500">No products found.</div>}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl my-8">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button onClick={closeModal}><X className="w-6 h-6 text-gray-400 hover:text-gray-700" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}>
                    {['MATS', 'GROW_BAGS', 'FIBER', 'COCOPEAT', 'ROPE', 'GEOTEXTILES'].map((category) => <option key={category}>{category}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Base Price ($)</label>
                  <input type="number" step="0.01" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock</label>
                  <input type="number" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.stockQuantity} onChange={(e) => setProductForm({ ...productForm, stockQuantity: parseInt(e.target.value, 10) || 0 })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Unit</label>
                  <input type="text" required className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.unit} onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input type="text" className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.imageUrl || ''} onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })} />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea rows={2} className="mt-1 w-full border border-gray-300 rounded-md p-2"
                    value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <input type="checkbox" id="avail" checked={productForm.isAvailable}
                    onChange={(e) => setProductForm({ ...productForm, isAvailable: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="avail" className="text-sm font-medium text-gray-700">Available for sale</label>
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
