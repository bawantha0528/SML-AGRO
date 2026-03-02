import React from 'react';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { inquiriesData, productsData } from '../mockData';
import { TrendingUp, ArrowUpRight, Users, Clock } from 'lucide-react';

const COLORS = ['#2E7D32', '#C8A45C', '#1C1A17', '#FF8042'];

export function DashboardPage() {
    // Mock aggregations
    const totalInquiries = 124;
    const newToday = 8;
    const metrics = [
        { title: 'Total Inquiries', value: totalInquiries, change: '+12%', icon: TrendingUp, color: 'bg-green-100 text-green-700' },
        { title: 'New Today', value: newToday, change: '+2', icon: Users, color: 'bg-blue-100 text-blue-700' },
        { title: 'Conversion Rate', value: '68%', change: '+5%', icon: ArrowUpRight, color: 'bg-purple-100 text-purple-700' },
        { title: 'Avg Response', value: '4.2h', change: '-1.5h', icon: Clock, color: 'bg-orange-100 text-orange-700' },
    ];

    // Chart Data preparation
    const lineData = [
        { name: 'Week 1', inquiries: 24 },
        { name: 'Week 2', inquiries: 35 },
        { name: 'Week 3', inquiries: 28 },
        { name: 'Week 4', inquiries: 45 },
    ];

    const pieData = [
        { name: 'USA', value: 45 },
        { name: 'Germany', value: 25 },
        { name: 'China', value: 20 },
        { name: 'Others', value: 10 },
    ];

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Overview</h2>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {metrics.map((m, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">{m.title}</p>
                            <h3 className="text-2xl font-bold text-gray-900 mt-1">{m.value}</h3>
                            <p className="text-xs font-semibold text-green-600 mt-1">{m.change} <span className="text-gray-400 font-normal">vs last month</span></p>
                        </div>
                        <div className={`p-3 rounded-lg ${m.color}`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Inquiry Trend (30 Days)</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} />
                                <Tooltip />
                                <Line type="monotone" dataKey="inquiries" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Inquiries by Country</h3>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    label
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Recent Inquiries Preview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 font-semibold uppercase text-xs">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">ID</th>
                                <th className="px-4 py-3">Customer</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 rounded-tr-lg">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inquiriesData.slice(0, 5).map((row) => (
                                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-900">{row.id}</td>
                                    <td className="px-4 py-3">{row.customer}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                      ${row.status === 'New' ? 'bg-blue-100 text-blue-700' :
                                                row.status === 'Closed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {row.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">{row.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
