import React from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Package, Truck, Users, CheckCircle2, 
  TrendingUp, Activity, Plus, ShieldCheck 
} from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 font-sans"
    >
      {/* Top Hero Banner */}
      <motion.div 
        variants={itemVariants}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600/95 via-indigo-700/95 to-purple-800/95 backdrop-blur-2xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-600/20 border border-white/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-bold border border-white/25">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>Role: Courier Staff</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome back, {currentUser?.name}! 👋
            </h1>
            <p className="text-sm text-indigo-100 max-w-xl font-medium">
              Logged in as <span className="font-bold text-white">{currentUser?.email}</span>. Courier Dispatcher workspace active with Glassmorphic UI.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/95 text-indigo-700 font-bold text-sm shadow-md hover:bg-white transition-all cursor-pointer border border-white"
            >
              <Plus className="w-4 h-4" />
              <span>New Shipment</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Overview Glass Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Shipments', val: '1,284', change: '+12.4%', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50/80' },
          { label: 'In Transit', val: '342', change: 'Active Now', icon: Truck, color: 'text-amber-600', bg: 'bg-amber-50/80' },
          { label: 'Delivered', val: '896', change: '98.2% Rate', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/80' },
          { label: 'Total Customers', val: '450', change: 'Registered', icon: Users, color: 'text-purple-600', bg: 'bg-purple-50/80' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={i}
              variants={itemVariants}
              whileHover={{ y: -4 }}
              className="glass-card rounded-2xl p-5 shadow-xs transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-500 uppercase tracking-wider">{card.label}</span>
                <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <p className="text-2xl font-black text-slate-900">{card.val}</p>
                <span className={`text-xs font-bold ${card.color} flex items-center`}>
                  <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {card.change}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Module 1 Summary Box */}
      <motion.div 
        variants={itemVariants}
        className="glass-card rounded-2xl p-6 shadow-xs space-y-4"
      >
        <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Module 1: Authentication Glassmorphic Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 glass-input rounded-xl space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">Active Dispatcher</p>
            <p className="text-sm font-black text-slate-900">{currentUser?.name}</p>
            <p className="text-xs text-indigo-600 font-bold truncate">{currentUser?.email}</p>
          </div>
          <div className="p-4 glass-input rounded-xl space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">System Role</p>
            <p className="text-sm font-black text-indigo-700">Courier Staff (Single Role)</p>
          </div>
          <div className="p-4 glass-input rounded-xl space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase">LocalStorage Token</p>
            <p className="text-xs font-mono text-emerald-700 font-bold truncate">courier_auth_user</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
