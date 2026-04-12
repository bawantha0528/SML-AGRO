import {
    Bell,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquare,
    Package,
    Shield,
    SwatchBook,
    Users
} from 'lucide-react';
import { useState } from 'react';
import { CustomOrdersPage } from './pages/CustomOrdersPage';
import { DashboardPage } from './pages/DashboardPage';
import { InquiriesPage } from './pages/InquiriesPage';
import { LoginPage } from './pages/LoginPage';
import { ProductsPage } from './pages/ProductsPage';
import { UsersPage } from './pages/UsersPage';

export function AdminLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');
    // Restore session from sessionStorage so F5 doesn't log the admin out
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const stored = sessionStorage.getItem('adminUser');
        return !!stored;
    });
    const [user, setUser] = useState(() => {
        const stored = sessionStorage.getItem('adminUser');
        return stored ? JSON.parse(stored) : null;
    });
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
        { id: 'customOrders', label: 'Custom Inquiries', icon: SwatchBook },
        { id: 'users', label: 'Users', icon: Users },
    ];

    const handleLogout = () => {
        sessionStorage.removeItem('adminUser');
        setIsAuthenticated(false);
        setUser(null);
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'dashboard': return <DashboardPage />;
            case 'inquiries': return <InquiriesPage />;
            case 'products': return <ProductsPage />;
            case 'customOrders': return <CustomOrdersPage />;
            case 'users': return <UsersPage />;
            default: return <DashboardPage />;
        }
    };

    const activeLabel = menuItems.find((m) => m.id === activeTab)?.label || 'Dashboard';

    return (
        <div className="flex h-screen bg-sml-cream overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-sml-dark text-white flex flex-col transition-all duration-300 border-r border-white/10 ${sidebarOpen ? 'w-64' : 'w-20'
                    }`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-700">
                    {sidebarOpen ? (
                        <h1 className="text-xl font-bold tracking-wider text-sml-cream">SML <span className="text-sml-green">AGRO</span></h1>
                    ) : (
                        <span className="text-xl font-bold text-sml-green">SML</span>
                    )}
                </div>

                <nav className="flex-1 py-6 space-y-2 px-2">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center px-4 py-3 rounded-xl transition-colors ${activeTab === item.id
                                ? 'bg-sml-green text-white shadow-lg'
                                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
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
                        className="w-full flex items-center px-4 py-2 text-sml-green hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <LogOut className="w-5 h-5 min-w-[20px]" />
                        {sidebarOpen && <span className="ml-4 font-medium">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white shadow-sm flex items-center justify-between px-6 z-10 border-b border-gray-100">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="hidden md:flex items-center gap-3 mr-auto ml-4">
                        <div className="w-8 h-8 rounded-lg bg-sml-green/10 flex items-center justify-center text-sml-green">
                            <Shield className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs uppercase tracking-wider text-gray-400">Admin Workspace</p>
                            <p className="text-sm font-semibold text-gray-800">{activeLabel}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-3">
                        <button className="hidden sm:inline-flex w-9 h-9 rounded-lg border border-gray-200 items-center justify-center text-gray-500 hover:bg-gray-50">
                            <Bell className="w-4 h-4" />
                        </button>
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-gray-800">{user?.username}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-10 h-10 bg-sml-green rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {user?.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="w-px h-8 bg-gray-200 mx-1" />
                        <button
                            onClick={handleLogout}
                            title="Logout"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sml-green hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-200 transition-all duration-200 font-medium text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-auto p-6 md:p-8 bg-gradient-to-br from-[#f7f4ee] to-[#f2ebde]">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}
