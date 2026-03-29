import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8081/api/admin/products';

export function ProductsPage() {
    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [newProduct, setNewProduct] = useState({
        name: '',
        category: 'COCOPEAT',
        price: 0,
        stockQuantity: 0,
        unit: 'piece',
        description: '',
        isAvailable: true
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_BASE_URL);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) throw new Error('Failed to add product');

            setIsModalOpen(false);
            setNewProduct({
                name: '',
                category: 'COCOPEAT',
                price: 0,
                stockQuantity: 0,
                unit: 'piece',
                description: '',
                isAvailable: true
            });
            fetchProducts();
        } catch (err) {
            alert('Error adding product: ' + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) throw new Error('Failed to delete product');
            fetchProducts();
        } catch (err) {
            alert('Error deleting product: ' + err.message);
        }
    };

    const handleEdit = (product) => {
        setNewProduct(product);
        setIsModalOpen(true);
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/${newProduct.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            });
            if (!response.ok) throw new Error('Failed to update product');

            setIsModalOpen(false);
            setNewProduct({
                name: '',
                category: 'COCOPEAT',
                price: 0,
                stockQuantity: 0,
                unit: 'piece',
                description: '',
                isAvailable: true
            });
            fetchProducts();
        } catch (err) {
            alert('Error updating product: ' + err.message);
        }
    };



    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-green-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Loading products...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-10">Error: {error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((prod) => (
                        <div key={prod.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group">
                            <div className="h-32 bg-gray-100 flex items-center justify-center text-4xl">
                                📦
                            </div>
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

                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                    <span className="font-bold text-gray-900 text-lg">${prod.price}</span>
                                    <span className="text-sm text-gray-500">{prod.stockQuantity} {prod.unit}s</span>
                                </div>

                                <div className="mt-4 flex space-x-2">
                                    <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center">
                                        <Edit2 className="w-3 h-3 mr-1" /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prod.id)}
                                        className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center"
                                    >
                                        <Trash2 className="w-3 h-3 mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {products.length === 0 && (
                        <div className="col-span-full text-center py-10 text-gray-500">
                            No products found. Click "Add Product" to create one.
                        </div>
                    )}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b">
                            <h3 className="text-xl font-bold">Add New Product</h3>
                            <button onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
                        </div>
                        <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text" required
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newProduct.name}
                                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <select
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={newProduct.category}
                                        onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                                    >
                                        <option value="MATS">Mats</option>
                                        <option value="GROW_BAGS">Grow Bags</option>
                                        <option value="FIBER">Fiber</option>
                                        <option value="COCOPEAT">Cocopeat</option>
                                        <option value="ROPE">Rope</option>
                                        <option value="GEOTEXTILES">Geotextiles</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price ($)</label>
                                    <input
                                        type="number" step="0.01" required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={newProduct.price}
                                        onChange={e => setNewProduct({ ...newProduct, price: parseFloat(e.target.value) })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                                    <input
                                        type="number" required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={newProduct.stockQuantity}
                                        onChange={e => setNewProduct({ ...newProduct, stockQuantity: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Unit</label>
                                    <input
                                        type="text" required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                        value={newProduct.unit}
                                        onChange={e => setNewProduct({ ...newProduct, unit: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    rows="3"
                                    value={newProduct.description}
                                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                                />
                            </div>
                            <div className="pt-4">
                                <button
                                    type="submit"
                                    className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Save Product
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
