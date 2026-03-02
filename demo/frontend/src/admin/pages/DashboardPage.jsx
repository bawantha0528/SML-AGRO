import React from 'react';
import { Package, Users, Activity, TrendingUp } from 'lucide-react';

export function DashboardPage() {
    const stats = [
        { title: 'Total Products', value: '24', icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
        { title: 'Active Users', value: '3', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
        { title: 'System Status', value: 'Online', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' },
        { title: 'Server Load', value: '12%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-100' },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                        <div className={`${stat.bg} ${stat.color} p-4 rounded-xl mr-4`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                            <h3 className="text-2xl font-black text-gray-800">{stat.value}</h3>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Analytics Chart Placeholder</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
                    <p className="text-gray-400 font-medium">Recent Activity Placeholder</p>
                </div>
            </div>
        </div>
    );
}

export default DashboardPage;
