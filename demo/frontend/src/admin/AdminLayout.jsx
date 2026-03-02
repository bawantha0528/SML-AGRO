import React, { useState } from 'react';
import {
    LayoutDashboard,
    MessageSquare,
    Package,
    Users,
    LogOut,
    Menu
} from 'lucide-react';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { ProductsPage } from './pages/ProductsPage';
import { UsersPage } from './pages/UsersPage';

export function AdminLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    if (!isAuthenticated) {
        return (
            <LoginPage
                onLogin={(userData) => {
                    setUser(userData);
                    setIsAuthenticated(true);
                }}
            />
        );
    }

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'users', label: 'Users', icon: Users },
    ];

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardPage />;
            case 'inquiries': return <InquiriesPage />;
            case 'products': return <ProductsPage />;
            case 'users': return <UsersPage />;
            default: return <DashboardPage />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-sml-dark text-white flex flex-col transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-700">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold tracking-wider text-sml-cream">SML <span className="text-sml-green">AGRO</span></h1>
                    ) : (
                        <span className="text-xl font-bold text-sml-green">SML</span>
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-6 py-3 transition-colors ${activeTab === item.id
                                ? 'bg-sml-green text-white border-r-4 border-white'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="w-5 h-5 min-w-[20px]" />
                            {sidebarOpen && <span className="ml-4 font-medium truncate">{item.label}</span>}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        {sidebarOpen && <span className="ml-4 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{user?.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-sml-green rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
