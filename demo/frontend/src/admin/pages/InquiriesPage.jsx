import React, { useState } from 'react';
import { inquiriesData } from '../mockData';
import { Filter, Edit, CheckCircle, AlertTriangle } from 'lucide-react';

export function InquiriesPage() {
    const [filter, setFilter] = useState('All');
    const [data, setData] = useState(inquiriesData);
    const [selectedInquiry, setSelectedInquiry] = useState(null);

    const filteredData = filter === 'All' ? data : data.filter(i => i.status === filter);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Inquiries Management</h2>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-sml-green focus:border-sml-green"
                    >
                        <option>All</option>
                        <option>New</option>
                        <option>In Progress</option>
                        <option>Closed</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Products</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Priority</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredData.map((inq) => (
                            <tr key={inq.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{inq.id}</td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900">{inq.customer}</div>
                                    <div className="text-xs text-gray-400">{inq.country}</div>
                                </td>
                                <td className="px-6 py-4">{inq.products.join(', ')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${inq.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                            inq.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {inq.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center space-x-1 ${inq.priority === 'High' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                        {inq.priority === 'High' && <AlertTriangle className="w-3 h-3" />}
                                        <span>{inq.priority}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <button className="text-sml-green hover:text-sml-dark text-xs font-bold uppercase tracking-wider">
                                        View & Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
