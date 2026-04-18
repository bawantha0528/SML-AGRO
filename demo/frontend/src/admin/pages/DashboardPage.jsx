import { AlertTriangle, ArrowUpRight, Clock, Loader2, RefreshCw, TrendingUp, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell, Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis, YAxis
} from 'recharts';

const COLORS = ['#2E7D32', '#C8A45C', '#1C1A17', '#4A90D9', '#E67E22'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white border border-gray-100 rounded-lg shadow-lg p-3 text-sm">
                <p className="font-bold text-gray-700 mb-1">{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color }} className="font-semibold">
                        {p.name}: {p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export function DashboardPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/admin/dashboard/stats');
            if (!res.ok) throw new Error('Failed to load dashboard data');
            const json = await res.json();
            setStats(json.data);
        } catch (e) {
            setError('Could not connect to backend. Using cached data.');
            // Fallback data so dashboard still renders
            setStats({
                totalInquiries: 0,
                newToday: 0,
                openInquiries: 0,
                conversionRate: 0,
                avgResponseHours: 0,
                weeklyTrend: [
                    { name: 'Week 1', inquiries: 0 }, { name: 'Week 2', inquiries: 0 },
                    { name: 'Week 3', inquiries: 0 }, { name: 'Week 4', inquiries: 0 }
                ],
                countryBreakdown: [],
                statusBreakdown: [],
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 gap-3 text-gray-400">
                <Loader2 className="w-7 h-7 animate-spin text-sml-green" />
                <span className="text-sm font-medium">Loading dashboard...</span>
            </div>
        );
    }

    const metrics = [
        {
            title: 'Total Inquiries',
            value: stats.totalInquiries,
            sub: `${stats.newToday} new today`,
            icon: TrendingUp,
            color: 'bg-green-100 text-green-700',
        },
        {
            title: 'Open Inquiries',
            value: stats.openInquiries,
            sub: 'Awaiting response',
            icon: Users,
            color: 'bg-blue-100 text-blue-700',
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversionRate}%`,
            sub: 'Inquiries closed',
            icon: ArrowUpRight,
            color: 'bg-purple-100 text-purple-700',
        },
        {
            title: 'Avg Response',
            value: `${stats.avgResponseHours}h`,
            sub: 'Average time to respond',
            icon: Clock,
            color: 'bg-orange-100 text-orange-700',
        },
    ];

    const STATUS_COLORS = {
        NEW: '#3B82F6', RESPONDED: '#EAB308', FOLLOWUP: '#F97316',
        QUOTED: '#A855F7', CLOSED: '#22C55E',
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh
                </button>
            </div>

            {error && (
                <div className="bg-amber-50 border border-amber-200 text-amber-700 p-3 rounded-xl text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" /> {error}
                </div>
            )}

            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {metrics.map((m, idx) => (
                    <div key={idx} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{m.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
                        </div>
                        <div className={`p-3 rounded-xl ${m.color}`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line chart — weekly trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-5">Inquiry Trend (Weekly)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                            <LineChart data={stats.weeklyTrend}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone" dataKey="inquiries" stroke="#2E7D32"
                                    strokeWidth={3} dot={{ r: 5, fill: '#2E7D32', strokeWidth: 0 }}
                                    activeDot={{ r: 7, fill: '#2E7D32' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie chart — by country */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-5">Inquiries by Country</h3>
                    <div className="h-64">
                        {stats.countryBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                                <PieChart>
                                    <Pie
                                        data={stats.countryBreakdown}
                                        cx="50%" cy="50%"
                                        outerRadius={90}
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        labelLine={false}
                                    >
                                        {stats.countryBreakdown.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                                No country data yet
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Status breakdown bar chart */}
            {stats.statusBreakdown.length > 0 && (
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-base font-bold text-gray-800 mb-5">Inquiries by Status</h3>
                    <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%" minHeight={180}>
                            <BarChart data={stats.statusBreakdown} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                                    {stats.statusBreakdown.map((entry, index) => (
                                        <Cell key={index} fill={STATUS_COLORS[entry.name] || '#2E7D32'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Recent Inquiries Preview */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base font-bold text-gray-800 mb-4">Quick Stats</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries({ NEW: 'New', RESPONDED: 'Responded', FOLLOWUP: 'Follow-Up', CLOSED: 'Closed' }).map(([k, label]) => {
                        const entry = stats.statusBreakdown.find(s => s.name === k);
                        return (
                            <div key={k} className="text-center p-3 bg-gray-50 rounded-xl">
                                <p className="text-2xl font-bold text-gray-900">{entry?.value ?? 0}</p>
                                <p className="text-xs text-gray-500 mt-1">{label}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
