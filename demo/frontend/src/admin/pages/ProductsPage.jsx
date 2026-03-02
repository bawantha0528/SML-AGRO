import React from 'react';
import { productsData } from '../mockData';
import { Plus, Trash2, Edit2 } from 'lucide-react';

export function ProductsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Products</h2>
                <button className="bg-sml-green text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-sml-dark transition-colors">
                    <Plus className="w-4 h-4 mr-2" /> Add Product
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {productsData.map((prod) => (
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
                                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${prod.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {prod.status}
                                </span>
                            </div>

                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                <span className="font-bold text-sml-dark text-lg">${prod.price}</span>
                                <span className="text-sm text-gray-500">{prod.stock} units</span>
                            </div>

                            <div className="mt-4 flex space-x-2">
                                <button className="flex-1 bg-gray-50 text-gray-600 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 flex items-center justify-center">
                                    <Edit2 className="w-3 h-3 mr-1" /> Edit
                                </button>
                                <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100 flex items-center justify-center">
                                    <Trash2 className="w-3 h-3 mr-1" /> Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
