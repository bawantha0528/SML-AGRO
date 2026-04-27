import { Edit2, Filter, KeyRound, Search, Shield, Trash2, UserPlus, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

const API_BASE_URL = '/api/admin/users';
const ROLES = ['ADMIN', 'SALES', 'SUPPORT'];

const EMPTY_FORM = {
    username: '',
    email: '',
    password: '',
    role: 'SUPPORT',
    isActive: true,
};

export function UsersPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [search, setSearch] = useState('');
    const [role, setRole] = useState('ALL');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [userForm, setUserForm] = useState(EMPTY_FORM);
    const [submitting, setSubmitting] = useState(false);
    const [actionMessage, setActionMessage] = useState('');

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (search.trim()) {
                params.set('search', search.trim());
            }
            if (role !== 'ALL') {
                params.set('role', role);
            }

            const query = params.toString();
            const response = await fetch(query ? `${API_BASE_URL}?${query}` : API_BASE_URL);
            const payload = await response.json();

            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to load users');
            }

            setUsers(Array.isArray(payload.data) ? payload.data : []);
            setError('');
        } catch (err) {
            setError(err.message || 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [search, role]);

    const activeCount = useMemo(() => users.filter((u) => u.isActive).length, [users]);

    const openCreate = () => {
        setEditingUser(null);
        setUserForm(EMPTY_FORM);
        setActionMessage('');
        setIsModalOpen(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setUserForm({
            username: user.username,
            email: user.email,
            password: '',
            role: user.role,
            isActive: !!user.isActive,
        });
        setActionMessage('');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
        setSubmitting(false);
    };

    const handleSave = async (event) => {
        event.preventDefault();
        setSubmitting(true);

        try {
            const isEdit = !!editingUser;
            const url = isEdit ? `${API_BASE_URL}/${editingUser.id}` : API_BASE_URL;
            const method = isEdit ? 'PUT' : 'POST';

            const body = isEdit
                ? {
                    username: userForm.username,
                    email: userForm.email,
                    role: userForm.role,
                    isActive: userForm.isActive,
                }
                : {
                    username: userForm.username,
                    email: userForm.email,
                    password: userForm.password,
                };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to save user');
            }

            closeModal();
            await fetchUsers();
            setActionMessage(isEdit ? 'User updated successfully.' : 'User created successfully.');
        } catch (err) {
            setActionMessage(err.message || 'Failed to save user');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            const response = await fetch(`${API_BASE_URL}/${userId}/role`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role: newRole }),
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to update role');
            }
            await fetchUsers();
            setActionMessage('Role updated successfully.');
        } catch (err) {
            setActionMessage(err.message || 'Failed to update role');
        }
    };

    const handleStatusToggle = async (user) => {
        const action = user.isActive ? 'disable' : 'enable';
        if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${user.id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isActive: !user.isActive }),
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to update status');
            }
            await fetchUsers();
            setActionMessage(`User ${action}d successfully.`);
        } catch (err) {
            setActionMessage(err.message || 'Failed to update status');
        }
    };

    const handleResetPassword = async (user) => {
        if (!window.confirm(`Reset password and send email to ${user.email}?`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${user.id}/reset-password`, {
                method: 'POST',
            });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to reset password');
            }
            setActionMessage(`Password reset email sent to ${user.email}.`);
        } catch (err) {
            setActionMessage(err.message || 'Failed to reset password');
        }
    };

    const handleDelete = async (user) => {
        if (!window.confirm(`Delete user ${user.username}? This action cannot be undone.`)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${user.id}`, { method: 'DELETE' });
            const payload = await response.json();
            if (!response.ok || !payload.success) {
                throw new Error(payload.message || 'Failed to delete user');
            }
            await fetchUsers();
            setActionMessage('User deleted successfully.');
        } catch (err) {
            setActionMessage(err.message || 'Failed to delete user');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Users</h2>
                    <p className="text-sm text-gray-500">Manage team roles, status, and access visibility.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="bg-sml-green text-white px-4 py-2 rounded-lg flex items-center shadow-md hover:bg-sml-dark transition-colors"
                >
                    <UserPlus className="w-4 h-4 mr-2" /> Add User
                </button>
            </div>

            {actionMessage && (
                <div className="px-4 py-3 rounded-lg border border-green-200 bg-green-50 text-green-700 text-sm">
                    {actionMessage}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Visible Users</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
                </div>
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-green-500">Active</p>
                    <p className="text-2xl font-bold text-green-700 mt-1">{activeCount}</p>
                </div>
                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-wider text-gray-500">Roles</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{ROLES.length}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-col md:flex-row gap-3 md:items-center">
                <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            setSearch(searchInput);
                        }}
                    >
                        <input
                            type="text"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            placeholder="Search by username or email"
                            className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                        />
                    </form>
                </div>
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-sml-green focus:border-transparent outline-none"
                    >
                        <option value="ALL">All Roles</option>
                        {ROLES.map((r) => (
                            <option key={r} value={r}>{r}</option>
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
                        {loading && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">Loading users...</td>
                            </tr>
                        )}

                        {!loading && error && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-red-500">{error}</td>
                            </tr>
                        )}

                        {!loading && !error && users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{user.id}</td>
                                <td className="px-6 py-4 flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-sml-green/20 flex items-center justify-center text-sml-green font-bold text-xs">
                                        {user.username.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">{user.username}</div>
                                        <div className="text-xs text-gray-400">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1 w-fit bg-blue-100 text-blue-700">
                                        <Shield className="w-3 h-3" />
                                        <span>{user.role}</span>
                                    </span>
                                    <select
                                        value={user.role}
                                        onChange={(event) => handleRoleChange(user.id, event.target.value)}
                                        className="mt-2 px-2 py-1 text-xs border border-gray-200 rounded-md"
                                    >
                                        {ROLES.map((roleValue) => (
                                            <option key={roleValue} value={roleValue}>{roleValue}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${user.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                        {user.isActive ? 'Active' : 'Disabled'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => openEdit(user)}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs"
                                        >
                                            <Edit2 className="w-3 h-3" /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleResetPassword(user)}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-amber-100 text-amber-700 hover:bg-amber-200 text-xs"
                                        >
                                            <KeyRound className="w-3 h-3" /> Reset
                                        </button>
                                        <button
                                            onClick={() => handleStatusToggle(user)}
                                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                                                user.isActive
                                                    ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                                            }`}
                                        >
                                            {user.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user)}
                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-xs"
                                        >
                                            <Trash2 className="w-3 h-3" /> Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {!loading && !error && users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No users match current filters.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-xl my-8">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-800">
                                {editingUser ? 'Edit User' : 'Add User'}
                            </h3>
                            <button onClick={closeModal} className="text-gray-400 hover:text-gray-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Username</label>
                                <input
                                    type="text"
                                    required
                                    minLength={3}
                                    value={userForm.username}
                                    onChange={(event) => setUserForm((current) => ({ ...current, username: event.target.value }))}
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={userForm.email}
                                    onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))}
                                    className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                />
                            </div>

                            {!editingUser && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Password</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={8}
                                        value={userForm.password}
                                        onChange={(event) => setUserForm((current) => ({ ...current, password: event.target.value }))}
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                    />
                                </div>
                            )}

                            {editingUser && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Role</label>
                                        <select
                                            value={userForm.role}
                                            onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}
                                            className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        >
                                            {ROLES.map((roleValue) => (
                                                <option key={roleValue} value={roleValue}>{roleValue}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                                        <input
                                            type="checkbox"
                                            checked={userForm.isActive}
                                            onChange={(event) => setUserForm((current) => ({ ...current, isActive: event.target.checked }))}
                                        />
                                        Account active
                                    </label>
                                </>
                            )}

                            <div className="pt-3 border-t border-gray-100">
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full bg-sml-green text-white font-semibold py-2.5 rounded-lg hover:bg-sml-dark transition-colors disabled:opacity-60"
                                >
                                    {submitting ? 'Saving...' : editingUser ? 'Update User' : 'Create User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
