import { AlertTriangle, ArrowUpRight, CalendarDays, CheckCircle2, Clock, Download, Loader2, RefreshCw, TrendingUp, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
const METRIC_DETAIL_TITLE = {
    TOTAL_INQUIRIES: 'All Inquiries',
    NEW_TODAY: 'Inquiries in Last 24 Hours',
    CONVERSION_RATE: 'Quoted Inquiries',
    AVG_RESPONSE_TIME: 'Responded Inquiries',
};

const TREND_GRANULARITIES = ['daily', 'weekly', 'monthly'];

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
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 29);
    const toIsoDate = (date) => date.toISOString().slice(0, 10);

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [detailMetric, setDetailMetric] = useState(null);
    const [detailList, setDetailList] = useState([]);
    const [detailLoading, setDetailLoading] = useState(false);
    const [trendGranularity, setTrendGranularity] = useState('daily');
    const [trendData, setTrendData] = useState([]);
    const [trendLoading, setTrendLoading] = useState(true);
    const [countryFromDate, setCountryFromDate] = useState(() => toIsoDate(thirtyDaysAgo));
    const [countryToDate, setCountryToDate] = useState(() => toIsoDate(today));
    const [countryBreakdown, setCountryBreakdown] = useState([]);
    const [countryBreakdownLoading, setCountryBreakdownLoading] = useState(true);
    const [countryDetailsName, setCountryDetailsName] = useState(null);
    const [countryDetailsList, setCountryDetailsList] = useState([]);
    const [countryDetailsLoading, setCountryDetailsLoading] = useState(false);
    const trendChartRef = useRef(null);

    const fetchStats = async (showLoader = true) => {
        if (showLoader) {
            setLoading(true);
        } else {
            setRefreshing(true);
        }
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
                totalInquiriesChangePct: 0,
                newTodayChangePct: 0,
                conversionRateChangePct: 0,
                avgResponseHoursChangePct: 0,
                pendingFollowups: 0,
                overdueFollowups: 0,
                todaysFollowups: [],
                weeklyTrend: [
                    { name: 'Week 1', inquiries: 0 }, { name: 'Week 2', inquiries: 0 },
                    { name: 'Week 3', inquiries: 0 }, { name: 'Week 4', inquiries: 0 }
                ],
                countryBreakdown: [],
                statusBreakdown: [],
            });
        } finally {
            if (showLoader) {
                setLoading(false);
            }
            setRefreshing(false);
        }
    };

    const fetchMetricDetails = async (metric) => {
        setDetailMetric(metric);
        setDetailLoading(true);
        try {
            const res = await fetch(`/api/admin/dashboard/details?metric=${encodeURIComponent(metric)}`);
            if (!res.ok) throw new Error('Failed to load metric details');
            const json = await res.json();
            setDetailList(Array.isArray(json.data) ? json.data : []);
        } catch {
            setDetailList([]);
        } finally {
            setDetailLoading(false);
        }
    };

    const fetchTrendData = async (granularity, showLoader = true) => {
        if (showLoader) {
            setTrendLoading(true);
        }
        try {
            const response = await fetch(`/api/admin/dashboard/trend?granularity=${encodeURIComponent(granularity)}&days=30`);
            if (!response.ok) throw new Error('Failed to load trend data');
            const json = await response.json();
            setTrendData(Array.isArray(json.data) ? json.data : []);
        } catch {
            setTrendData([]);
        } finally {
            if (showLoader) {
                setTrendLoading(false);
            }
        }
    };

    const fetchCountryBreakdown = async (showLoader = true) => {
        if (showLoader) {
            setCountryBreakdownLoading(true);
        }
        try {
            const params = new URLSearchParams();
            if (countryFromDate) params.set('fromDate', countryFromDate);
            if (countryToDate) params.set('toDate', countryToDate);

            const response = await fetch(`/api/admin/dashboard/country-breakdown?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to load country breakdown');
            const json = await response.json();
            setCountryBreakdown(Array.isArray(json.data) ? json.data : []);
        } catch {
            setCountryBreakdown([]);
        } finally {
            if (showLoader) {
                setCountryBreakdownLoading(false);
            }
        }
    };

    const fetchCountryDetails = async (countryName) => {
        setCountryDetailsName(countryName);
        setCountryDetailsLoading(true);
        try {
            const params = new URLSearchParams({ country: countryName });
            if (countryFromDate) params.set('fromDate', countryFromDate);
            if (countryToDate) params.set('toDate', countryToDate);

            const response = await fetch(`/api/admin/dashboard/country-details?${params.toString()}`);
            if (!response.ok) throw new Error('Failed to load country details');
            const json = await response.json();
            setCountryDetailsList(Array.isArray(json.data) ? json.data : []);
        } catch {
            setCountryDetailsList([]);
        } finally {
            setCountryDetailsLoading(false);
        }
    };

    const exportCountryBreakdownCsv = () => {
        const header = ['Country', 'Inquiries', 'Percentage', 'FromDate', 'ToDate'];
        const rows = countryBreakdown.map((row) => [
            row.name,
            row.value,
            `${row.percentage ?? 0}%`,
            countryFromDate,
            countryToDate,
        ]);
        const csv = [header, ...rows]
            .map((line) => line.map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `country-inquiries-${countryFromDate}-to-${countryToDate}.csv`;
        anchor.click();
        URL.revokeObjectURL(url);
    };

    const exportTrendAsPng = () => {
        const container = trendChartRef.current;
        const svg = container?.querySelector('svg');
        if (!svg) return;

        const serializer = new XMLSerializer();
        let source = serializer.serializeToString(svg);

        if (!source.includes('xmlns="http://www.w3.org/2000/svg"')) {
            source = source.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        const rect = svg.getBoundingClientRect();
        const width = Math.max(1200, Math.round(rect.width * 2));
        const height = Math.max(700, Math.round(rect.height * 2));
        const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const image = new Image();

        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const context = canvas.getContext('2d');
            if (!context) {
                URL.revokeObjectURL(url);
                return;
            }

            context.fillStyle = '#ffffff';
            context.fillRect(0, 0, width, height);
            context.drawImage(image, 0, 0, width, height);

            const anchor = document.createElement('a');
            anchor.download = `inquiry-trend-${trendGranularity}-${new Date().toISOString().slice(0, 10)}.png`;
            anchor.href = canvas.toDataURL('image/png');
            anchor.click();
            URL.revokeObjectURL(url);
        };

        image.src = url;
    };

    useEffect(() => {
        fetchStats(true);
        fetchTrendData('daily', true);
        fetchCountryBreakdown(true);
        const intervalId = setInterval(() => {
            fetchStats(false);
            fetchTrendData(trendGranularity, false);
            fetchCountryBreakdown(false);
        }, 5 * 60 * 1000);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        fetchTrendData(trendGranularity, true);
    }, [trendGranularity]);

    useEffect(() => {
        fetchCountryBreakdown(true);
    }, [countryFromDate, countryToDate]);

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
            sub: 'All time',
            change: stats.totalInquiriesChangePct,
            metricKey: 'TOTAL_INQUIRIES',
            icon: TrendingUp,
            color: 'bg-green-100 text-green-700',
        },
        {
            title: 'New Today',
            value: stats.newToday,
            sub: 'Last 24 hours',
            change: stats.newTodayChangePct,
            metricKey: 'NEW_TODAY',
            icon: Users,
            color: 'bg-blue-100 text-blue-700',
        },
        {
            title: 'Conversion Rate',
            value: `${stats.conversionRate}%`,
            sub: 'Quoted / Total',
            change: stats.conversionRateChangePct,
            metricKey: 'CONVERSION_RATE',
            icon: ArrowUpRight,
            color: 'bg-purple-100 text-purple-700',
        },
        {
            title: 'Avg Response Time',
            value: `${stats.avgResponseHours}h`,
            sub: 'Hours',
            change: stats.avgResponseHoursChangePct,
            metricKey: 'AVG_RESPONSE_TIME',
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
                    onClick={() => {
                        fetchStats(false);
                        fetchTrendData(trendGranularity, false);
                        fetchCountryBreakdown(false);
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                    {refreshing ? 'Refreshing...' : 'Refresh'}
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
                    <button
                        key={idx}
                        onClick={() => fetchMetricDetails(m.metricKey)}
                        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between text-left hover:shadow-md transition-shadow"
                    >
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{m.title}</p>
                            <h3 className="text-3xl font-bold text-gray-900 mt-1">{m.value}</h3>
                            <p className="text-xs text-gray-400 mt-1">{m.sub}</p>
                            <p className={`text-xs mt-2 font-semibold ${m.change >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                                {m.change >= 0 ? '+' : ''}{m.change}% vs previous period
                            </p>
                        </div>
                        <div className={`p-3 rounded-xl ${m.color}`}>
                            <m.icon className="w-6 h-6" />
                        </div>
                    </button>
                ))}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
                    <h3 className="text-base font-bold text-gray-800 flex items-center gap-2">
                        <CalendarDays className="w-4 h-4 text-sml-green" />
                        Today's Follow-Ups
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-semibold">
                            Pending: {stats.pendingFollowups ?? 0}
                        </span>
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-100 text-red-700 font-semibold">
                            Overdue: {stats.overdueFollowups ?? 0}
                        </span>
                    </div>
                </div>

                {Array.isArray(stats.todaysFollowups) && stats.todaysFollowups.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-gray-600">
                            <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Inquiry #</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Priority</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {stats.todaysFollowups.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold text-gray-800">{item.inquiryNumber}</td>
                                        <td className="px-4 py-3">{item.customerName}</td>
                                        <td className="px-4 py-3">{item.email}</td>
                                        <td className="px-4 py-3">{item.priority || '-'}</td>
                                        <td className="px-4 py-3">{item.status || '-'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 py-6 text-center">
                        No follow-ups scheduled for today.
                    </div>
                )}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Line chart — weekly trend */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-gray-800">Inquiry Trend (Last 30 Days)</h3>
                        <div className="flex items-center gap-2">
                            <div className="inline-flex rounded-lg border border-gray-200 overflow-hidden">
                                {TREND_GRANULARITIES.map((granularity) => (
                                    <button
                                        key={granularity}
                                        onClick={() => setTrendGranularity(granularity)}
                                        className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition-colors ${
                                            trendGranularity === granularity
                                                ? 'bg-sml-green text-white'
                                                : 'bg-white text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {granularity}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={exportTrendAsPng}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                            >
                                <Download className="w-3.5 h-3.5" /> Export PNG
                            </button>
                        </div>
                    </div>
                    <div className="h-64" ref={trendChartRef}>
                        {trendLoading ? (
                            <div className="h-full flex items-center justify-center text-gray-400 gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-sml-green" />
                                <span className="text-sm">Loading trend data...</span>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                                    <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                    <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                                    <Tooltip
                                        formatter={(value) => [`${value}`, 'Inquiries']}
                                        labelFormatter={(_, payload) => {
                                            const point = payload && payload[0] ? payload[0].payload : null;
                                            return point?.date ? `Date: ${point.date}` : 'Date: -';
                                        }}
                                        contentStyle={{ borderRadius: '8px', borderColor: '#e5e7eb' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        name="Inquiries"
                                        stroke="#2E7D32"
                                        strokeWidth={3}
                                        dot={{ r: 3, fill: '#2E7D32', strokeWidth: 0 }}
                                        activeDot={{ r: 6, fill: '#2E7D32' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </div>
                </div>

                {/* Pie chart — by country */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                        <h3 className="text-base font-bold text-gray-800">Top Countries (Inquiries)</h3>
                        <button
                            onClick={exportCountryBreakdownCsv}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50"
                        >
                            <Download className="w-3.5 h-3.5" /> Export CSV
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        <label className="text-xs text-gray-500">
                            From
                            <input
                                type="date"
                                value={countryFromDate}
                                onChange={(event) => setCountryFromDate(event.target.value)}
                                className="mt-1 block w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm text-gray-700"
                            />
                        </label>
                        <label className="text-xs text-gray-500">
                            To
                            <input
                                type="date"
                                value={countryToDate}
                                onChange={(event) => setCountryToDate(event.target.value)}
                                className="mt-1 block w-full border border-gray-200 rounded-lg px-2.5 py-2 text-sm text-gray-700"
                            />
                        </label>
                    </div>

                    <div className="h-64">
                        {countryBreakdownLoading ? (
                            <div className="h-full flex items-center justify-center text-gray-400 gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-sml-green" />
                                <span className="text-sm">Loading country data...</span>
                            </div>
                        ) : countryBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%" minHeight={240}>
                                <PieChart>
                                    <Pie
                                        data={countryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={90}
                                        dataKey="value"
                                        label={({ name, payload }) => `${name} ${payload?.percentage ?? 0}%`}
                                        labelLine={false}
                                        onClick={(entry) => {
                                            if (entry?.name) {
                                                fetchCountryDetails(entry.name);
                                            }
                                        }}
                                    >
                                        {countryBreakdown.map((_, index) => (
                                            <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(value, name, item) => {
                                            const pct = item?.payload?.percentage ?? 0;
                                            return [`${value} (${pct}%)`, name];
                                        }}
                                    />
                                    <Legend wrapperStyle={{ fontSize: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-full flex items-center justify-center text-gray-300 text-sm">
                                No country data for selected dates
                            </div>
                        )}
                    </div>

                    {countryBreakdown.length > 0 && (
                        <div className="mt-3 grid grid-cols-1 gap-1">
                            {countryBreakdown.map((row, idx) => (
                                <button
                                    key={row.name}
                                    onClick={() => fetchCountryDetails(row.name)}
                                    className="text-left text-xs px-2 py-1.5 rounded-md hover:bg-gray-50 flex items-center justify-between"
                                >
                                    <span className="flex items-center gap-2 text-gray-600">
                                        <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                                        {row.name}
                                    </span>
                                    <span className="text-gray-500">{row.value} ({row.percentage}%)</span>
                                </button>
                            ))}
                        </div>
                    )}
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

            {detailMetric && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">
                                {METRIC_DETAIL_TITLE[detailMetric] || 'Metric Details'}
                            </h3>
                            <button
                                onClick={() => setDetailMetric(null)}
                                className="text-gray-400 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6">
                            {detailLoading ? (
                                <div className="flex items-center justify-center h-40 gap-2 text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin text-sml-green" />
                                    <span>Loading details...</span>
                                </div>
                            ) : detailList.length === 0 ? (
                                <div className="text-center py-14 text-gray-400">No records found for this metric.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Inquiry #</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Status</th>
                                                <th className="px-4 py-3">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {detailList.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-semibold text-gray-800">{item.inquiryNumber}</td>
                                                    <td className="px-4 py-3">{item.customerName}</td>
                                                    <td className="px-4 py-3">{item.email}</td>
                                                    <td className="px-4 py-3">
                                                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 text-gray-700 px-2 py-0.5 text-xs font-semibold">
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {countryDetailsName && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-start justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl my-8 border border-gray-100">
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-800">
                                Inquiries from {countryDetailsName}
                            </h3>
                            <button
                                onClick={() => setCountryDetailsName(null)}
                                className="text-gray-400 hover:text-gray-700"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            {countryDetailsLoading ? (
                                <div className="flex items-center justify-center h-40 gap-2 text-gray-400">
                                    <Loader2 className="w-5 h-5 animate-spin text-sml-green" />
                                    <span>Loading country inquiries...</span>
                                </div>
                            ) : countryDetailsList.length === 0 ? (
                                <div className="text-center py-14 text-gray-400">No inquiries found for this country.</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-600">
                                        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3">Inquiry #</th>
                                                <th className="px-4 py-3">Customer</th>
                                                <th className="px-4 py-3">Email</th>
                                                <th className="px-4 py-3">Country</th>
                                                <th className="px-4 py-3">Created</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {countryDetailsList.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-semibold text-gray-800">{item.inquiryNumber}</td>
                                                    <td className="px-4 py-3">{item.customerName}</td>
                                                    <td className="px-4 py-3">{item.email}</td>
                                                    <td className="px-4 py-3">{item.country || 'Unknown'}</td>
                                                    <td className="px-4 py-3">{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
