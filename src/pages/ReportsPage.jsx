import React, { useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Clock,
  Award,
  Download,
  Printer,
  Calendar,
  Filter,
  Users,
  Building,
  Package,
  CheckCircle2,
  FileSpreadsheet,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const MONTHLY_REVENUE_DATA = [
  { month: 'Jan', revenue: 18400, shipments: 820, sla: 95.2 },
  { month: 'Feb', revenue: 21500, shipments: 950, sla: 96.1 },
  { month: 'Mar', revenue: 24800, shipments: 1100, sla: 97.4 },
  { month: 'Apr', revenue: 22900, shipments: 1020, sla: 96.8 },
  { month: 'May', revenue: 28300, shipments: 1250, sla: 97.9 },
  { month: 'Jun', revenue: 32550, shipments: 1482, sla: 98.4 }
];

const PARCEL_TYPE_PIE = [
  { name: 'Standard Parcel', value: 640, color: '#10b981' },
  { name: 'Document Express', value: 380, color: '#0d9488' },
  { name: 'Heavy Freight', value: 290, color: '#f59e0b' },
  { name: 'Fragile Cargo', value: 172, color: '#6366f1' }
];

const CITY_PERFORMANCE_DATA = [
  { city: 'Austin', onTime: 310, delayed: 12 },
  { city: 'Dallas', onTime: 280, delayed: 15 },
  { city: 'Scranton', onTime: 190, delayed: 8 },
  { city: 'Gotham', onTime: 240, delayed: 18 },
  { city: 'Malibu', onTime: 175, delayed: 5 },
  { city: 'Springfield', onTime: 140, delayed: 9 }
];

const TOP_CUSTOMERS = [
  { rank: 1, name: 'Bruce Wayne', city: 'Gotham', orders: 45, spend: '$14,250', status: 'VIP Premier' },
  { rank: 2, name: 'Michael Scott', city: 'Scranton', orders: 32, spend: '$9,800', status: 'Corporate Gold' },
  { rank: 3, name: 'Alice Johnson', city: 'Dallas', orders: 21, spend: '$6,420', status: 'Regular' },
  { rank: 4, name: 'Pepper Potts', city: 'Malibu', orders: 19, spend: '$8,900', status: 'VIP Premier' },
  { rank: 5, name: 'Sarah Connor', city: 'Austin', orders: 14, spend: '$4,150', status: 'Regular' }
];

const ReportsPage = () => {
  const [timeRange, setTimeRange] = useState('30days'); // '7days' | '30days' | 'quarter' | 'year'
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Export CSV Functionality
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Month,Revenue ($),Shipments,SLA Rate (%)\n';
    MONTHLY_REVENUE_DATA.forEach((row) => {
      csvContent += `${row.month},${row.revenue},${row.shipments},${row.sla}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Courier_Analytics_Report_${timeRange}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Analytics CSV report generated and downloaded!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Module 8 • Executive Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Reports & Analytics
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Analyze courier revenue, SLA delivery performance, category ratios, and top client leaderboards
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 self-start md:self-auto flex-wrap gap-y-2">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-2 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Download CSV Report</span>
          </button>

          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print PDF Summary</span>
          </button>
        </div>
      </div>

      {/* Date Range & Category Filter Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          <span className="text-xs font-bold text-slate-500 flex items-center space-x-1 mr-2">
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Range:</span>
          </span>
          {[
            { id: '7days', label: 'Last 7 Days' },
            { id: '30days', label: 'Last 30 Days' },
            { id: 'quarter', label: 'This Quarter' },
            { id: 'year', label: 'Year to Date' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setTimeRange(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                timeRange === item.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-600">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-1.5 px-3 rounded-xl border border-slate-200 bg-white font-bold text-slate-800 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Standard Parcel">Standard Parcel</option>
            <option value="Document Express">Document Express</option>
            <option value="Heavy Freight">Heavy Freight</option>
            <option value="Fragile Cargo">Fragile Cargo</option>
          </select>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Total Shipping Revenue</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">$148,450.00</p>
          <p className="text-xs text-emerald-600 font-bold flex items-center space-x-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+15.4% vs last period</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">On-Time SLA Rate</span>
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">96.8%</p>
          <p className="text-xs text-teal-600 font-bold flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Optimal SLA Target Met</span>
          </p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Avg Delivery Speed</span>
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">1.6 Days</p>
          <p className="text-xs text-slate-500 font-medium">From pickup to final delivery</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase text-slate-400">Fleet Efficiency Index</span>
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900">94.2%</p>
          <p className="text-xs text-amber-600 font-bold">Route optimization high</p>
        </div>
      </div>

      {/* Recharts Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Revenue & Volume Area Chart */}
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-emerald-600" />
                <span>Monthly Revenue & Shipping Volume</span>
              </h3>
              <p className="text-xs text-slate-500">Gross billing in USD and total volume</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              2026 Growth
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_REVENUE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                  name="Revenue ($)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Parcel Category Donut Chart */}
        <div className="lg:col-span-4 glass-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <PieChartIcon className="w-5 h-5 text-emerald-600" />
              <span>Category Ratio</span>
            </h3>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={PARCEL_TYPE_PIE}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {PARCEL_TYPE_PIE.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {PARCEL_TYPE_PIE.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* City Performance & Top Clients Leaderboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* City Performance Bar Chart */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Building className="w-5 h-5 text-emerald-600" />
              <span>On-Time vs Delayed Deliveries by City</span>
            </h3>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CITY_PERFORMANCE_DATA} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="city" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip />
                <Bar dataKey="onTime" name="On-Time" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="delayed" name="Delayed" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Shipping Clients Leaderboard */}
        <div className="lg:col-span-6 glass-card p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>Top Revenue Shipping Clients</span>
            </h3>
            <span className="text-xs font-semibold text-slate-400">Leaderboard</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase">
                <tr>
                  <th className="p-3">Rank & Client</th>
                  <th className="p-3">City</th>
                  <th className="p-3 text-center">Orders</th>
                  <th className="p-3 text-right">Total Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {TOP_CUSTOMERS.map((c) => (
                  <tr key={c.rank} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-black text-[11px] flex items-center justify-center">
                          #{c.rank}
                        </span>
                        <div>
                          <p className="font-bold text-slate-900">{c.name}</p>
                          <span className="text-[10px] text-emerald-600 font-semibold">{c.status}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-slate-800">{c.city}</td>
                    <td className="p-3 text-center font-bold text-slate-800">{c.orders}</td>
                    <td className="p-3 text-right font-black text-emerald-700">{c.spend}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
