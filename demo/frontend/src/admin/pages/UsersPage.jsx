import React, { useState } from 'react';
import { usersData } from '../mockData';
import { UserPlus, MoreHorizontal, Shield } from 'lucide-react';

export function UsersPage() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                <button className="bg-sml-green text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-sml-dark transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                        <tr>
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">User</th>
                            <th className="px-6 py-4">Role</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {usersData.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-sml-green/20 flex items-center justify-center text-sml-green font-bold text-xs">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.name}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit
                    ${user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                                            user.role === 'Manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                                        <Shield className="w-3 h-3" />
                                        <span>{user.role}</span>
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 relative group">
                                    <button className="text-gray-400 hover:text-gray-600">
                                        <MoreHorizontal className="w-5 h-5" />
                                    </button>
                                    {/* Dropdown would go here */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
