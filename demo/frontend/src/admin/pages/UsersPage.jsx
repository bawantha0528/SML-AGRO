import { Filter, MoreHorizontal, Search, Shield, UserPlus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { usersData } from '../mockData';

export function UsersPage() {
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('ALL');

    const roles = useMemo(() => ['ALL', ...new Set(usersData.map((u) => u.role))], []);

    const filteredUsers = useMemo(() => {
        return usersData.filter((user) => {
            const byRole = role === 'ALL' || user.role === role;
            const q = search.trim().toLowerCase();
            const bySearch = !q || user.name.toLowerCase().includes(q) || user.email.toLowerCase().includes(q);
            return byRole && bySearch;
        });
    }, [search, role]);

    const activeCount = useMemo(() => filteredUsers.filter((u) => u.status === 'Active').length, [filteredUsers]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                    <p className="text-sm text-gray-500">Manage team roles, status, and access visibility.</p>
                </div>
                <button className="bg-sml-green text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-sml-dark transition-colors">
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Visible Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{filteredUsers.length}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-green-500">Active</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{activeCount}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Roles</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{roles.length - 1}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by name or email"
                        className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>{r === 'ALL' ? 'All Roles' : r}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600 admin-table">
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
                        {filteredUsers.map((user) => (
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
                        {filteredUsers.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No users match current filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
