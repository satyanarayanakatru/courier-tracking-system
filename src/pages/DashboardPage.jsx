import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import QuickShipmentModal from '../components/dashboard/QuickShipmentModal';
import { 
  Package, Truck, CheckCircle2, Clock, Users, Calendar, TrendingUp, 
  Activity, Plus, Search, RefreshCw, BarChart2, PieChart as PieChartIcon, 
  ArrowUpRight, ShieldCheck, Sparkles, FileText
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MONTHLY_DATA = [
  { month: 'Jan', total: 820, delivered: 780, transit: 40 },
  { month: 'Feb', total: 950, delivered: 910, transit: 40 },
  { month: 'Mar', total: 1100, delivered: 1040, transit: 60 },
  { month: 'Apr', total: 1020, delivered: 980, transit: 40 },
  { month: 'May', total: 1250, delivered: 1190, transit: 60 },
  { month: 'Jun', total: 1482, delivered: 1410, transit: 72 },
];

const STATUS_PIE_DATA = [
  { name: 'Delivered', value: 994, color: '#10b981' },
  { name: 'In Transit', value: 385, color: '#f59e0b' },
  { name: 'Pending', value: 103, color: '#0d9488' },
  { name: 'Cancelled', value: 24, color: '#ef4444' },
];

const RECENT_ACTIVITIES = [
  { id: 'act-1', type: 'status', title: 'Parcel Status Updated', desc: 'Shipment #ST-994201 updated to Out for Delivery', time: '10 mins ago', badge: 'Out for Delivery', color: 'bg-amber-100 text-amber-800' },
  { id: 'act-2', type: 'shipment', title: 'New Shipment Created', desc: 'Alex Morgan created shipment for John Doe (2.5 kg)', time: '25 mins ago', badge: 'Created', color: 'bg-emerald-100 text-emerald-800' },
  { id: 'act-3', type: 'status', title: 'Delivery Successful', desc: 'Shipment #ST-882194 delivered to Receiver', time: '1 hour ago', badge: 'Delivered', color: 'bg-teal-100 text-teal-800' },
  { id: 'act-4', type: 'customer', title: 'New Customer Added', desc: 'Sarah Jenkins registered in system database', time: '2 hours ago', badge: 'Customer', color: 'bg-green-100 text-green-800' },
  { id: 'act-5', type: 'shipment', title: 'Express Cargo Dispatched', desc: 'Air cargo #ST-773019 departed regional hub', time: '4 hours ago', badge: 'In Transit', color: 'bg-emerald-100 text-emerald-800' },
];

const DashboardPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activityFilter, setActivityFilter] = useState('all');
  const [activities, setActivities] = useState(RECENT_ACTIVITIES);

  const [stats, setStats] = useState({
    totalShipments: 1482,
    inTransit: 385,
    delivered: 994,
    pending: 103,
    totalCustomers: 520,
    todaysShipments: 42,
    successRate: 98.4,
  });

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Dashboard metrics updated!');
    }, 600);
  };

  const handleShipmentCreated = (newShipment) => {
    setStats((prev) => ({
      ...prev,
      totalShipments: prev.totalShipments + 1,
      pending: prev.pending + 1,
      todaysShipments: prev.todaysShipments + 1,
    }));

    setActivities((prev) => [
      {
        id: `act-${Date.now()}`,
        type: 'shipment',
        title: 'New Shipment Created',
        desc: `Shipment #${newShipment.trackingNumber} for ${newShipment.receiverName}`,
        time: 'Just now',
        badge: 'Created',
        color: 'bg-emerald-100 text-emerald-800'
      },
      ...prev
    ]);
  };

  const filteredActivities = activities.filter(
    (act) => activityFilter === 'all' || act.type === activityFilter
  );

  return (
    <div className="space-y-6 font-sans">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-xs font-bold mb-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Module 2: Dashboard Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Logistics Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Welcome back, <span className="font-bold text-slate-800">{currentUser?.name}</span> ({currentUser?.role})
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleRefresh}
            className="p-2.5 rounded-xl glass-input hover:bg-white text-slate-700 font-bold text-sm shadow-xs flex items-center space-x-1.5 cursor-pointer"
            title="Refresh Metrics"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Shipment</span>
          </motion.button>
        </div>
      </div>

      {/* 2. Responsive Stat Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="h-28 bg-slate-200/70 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Shipments */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Shipments</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Package className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900">{stats.totalShipments.toLocaleString()}</p>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +14.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">All time processed shipments</p>
          </motion.div>

          {/* Card 2: In Transit Parcels */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">In Transit Parcels</span>
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Truck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900">{stats.inTransit}</p>
              <span className="text-xs font-bold text-amber-600 px-2 py-0.5 bg-amber-50 rounded-md border border-amber-200">
                Active Live
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Parcels currently on route</p>
          </motion.div>

          {/* Card 3: Delivered Parcels */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Delivered Parcels</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900">{stats.delivered}</p>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +8.5%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Successfully completed</p>
          </motion.div>

          {/* Card 4: Pending Deliveries */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Pending Deliveries</span>
              <div className="p-2.5 rounded-xl bg-teal-50 text-teal-600 border border-teal-100">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
              <span className="text-xs font-bold text-teal-600">Awaiting Pickup</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Queued for dispatch</p>
          </motion.div>

          {/* Card 5: Total Customers */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Total Customers</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900">{stats.totalCustomers}</p>
              <span className="text-xs font-bold text-emerald-600 flex items-center">
                <ArrowUpRight className="w-4 h-4 mr-0.5" /> +5.2%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Registered customer profiles</p>
          </motion.div>

          {/* Card 6: Today's Shipments */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Today's Shipments</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <Calendar className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <p className="text-2xl font-black text-slate-900">{stats.todaysShipments}</p>
              <span className="text-xs font-bold text-emerald-600">New Today</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">Created in last 24h</p>
          </motion.div>

          {/* Card 7: Delivery Success Rate */}
          <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-5 shadow-xs col-span-1 sm:col-span-2 lg:col-span-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Delivery Success Rate</span>
              <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl font-black text-slate-900">{stats.successRate}%</p>
                <span className="text-xs text-emerald-600 font-bold">Optimal Target</span>
              </div>
              <div className="w-24 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200">
                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stats.successRate}%` }} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 font-medium">98.4% of parcels delivered within SLA timeline</p>
          </motion.div>
        </div>
      )}

      {/* 3. Quick Action Cards */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsModalOpen(true)}
            className="glass-card p-5 rounded-2xl text-left hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
              Create New Shipment
            </h3>
            <p className="text-xs text-slate-500 mt-1">Generate tracking # and record sender & receiver addresses.</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/tracking')}
            className="glass-card p-5 rounded-2xl text-left hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
              Track Parcel
            </h3>
            <p className="text-xs text-slate-500 mt-1">Look up live tracking history and current GPS location.</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/customers')}
            className="glass-card p-5 rounded-2xl text-left hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
              Manage Customers
            </h3>
            <p className="text-xs text-slate-500 mt-1">Add, edit, or search customer database profiles.</p>
          </motion.button>

          <motion.button
            whileHover={{ y: -3, scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              toast.info('Downloading Monthly Shipment Performance Report...');
              setTimeout(() => toast.success('Report downloaded!'), 1000);
            }}
            className="glass-card p-5 rounded-2xl text-left hover:border-emerald-300 transition-all cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-green-600 text-white flex items-center justify-center shadow-md mb-3 group-hover:scale-110 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
              Export Performance Report
            </h3>
            <p className="text-xs text-slate-500 mt-1">Generate PDF summary of monthly logistics analytics.</p>
          </motion.button>
        </div>
      </div>

      {/* 4. Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-emerald-600" />
                Monthly Shipment Trends
              </h3>
              <p className="text-xs text-slate-500">Volume of delivered vs in-transit parcels per month</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              2026 Analytics
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="delivered" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorDelivered)" name="Delivered Parcels" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 glass-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-5 h-5 text-emerald-600" />
              Parcel Status Ratio
            </h3>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={STATUS_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {STATUS_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
            {STATUS_PIE_DATA.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 font-medium">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Recent Activities List */}
      <div className="glass-card p-6 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-600" />
              Recent Dispatch Activities
            </h3>
            <p className="text-xs text-slate-500">Live operational events & shipment status updates</p>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'shipment', 'status', 'customer'].map((filter) => (
              <button
                key={filter}
                onClick={() => setActivityFilter(filter)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  activityFilter === filter
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          <AnimatePresence>
            {filteredActivities.map((act) => (
              <motion.div
                key={act.id}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="py-3.5 flex items-center justify-between hover:bg-emerald-50/40 rounded-xl px-3 transition-colors"
              >
                <div className="flex items-center space-x-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{act.title}</p>
                    <p className="text-xs text-slate-500">{act.desc}</p>
                  </div>
                </div>

                <div className="text-right flex items-center space-x-3">
                  <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${act.color}`}>
                    {act.badge}
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">{act.time}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <QuickShipmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleShipmentCreated}
      />
    </div>
  );
};

export default DashboardPage;
