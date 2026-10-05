import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Package, Truck, Users, CheckCircle2, Clock, 
  TrendingUp, Activity, Plus, ShieldCheck, ArrowUpRight 
} from 'lucide-react';

const DashboardPage = () => {
  const { currentUser } = useAuth();

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 p-6 sm:p-8 border border-indigo-500/20 shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Module 1: Authentication Verified</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {currentUser?.name}! 👋
            </h1>
            <p className="text-sm text-slate-400 max-w-xl">
              Logged in as <span className="text-indigo-300 font-medium">{currentUser?.email}</span> ({currentUser?.role}). Your authentication session is active and stored in LocalStorage.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all">
              <Plus className="w-4 h-4" />
              <span>Create Shipment</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Shipments</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">1,284</p>
            <span className="text-xs text-emerald-400 flex items-center font-medium">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> +12.4%
            </span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">In Transit</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
              <Truck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">342</p>
            <span className="text-xs text-amber-400 font-medium">Active Now</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Delivered</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">896</p>
            <span className="text-xs text-emerald-400 font-medium">98.2% Success</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Customers</span>
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <p className="text-2xl font-bold text-white">450</p>
            <span className="text-xs text-slate-400 font-medium">Registered</span>
          </div>
        </div>
      </div>

      {/* Module 1 Summary Box */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Module 1: Authentication Overview & Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase">Active Session User</p>
            <p className="text-sm font-semibold text-slate-200">{currentUser?.name}</p>
            <p className="text-xs text-indigo-400 truncate">{currentUser?.email}</p>
          </div>
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase">Session Token / Data</p>
            <p className="text-xs font-mono text-emerald-400 truncate">Stored in LocalStorage ('courier_auth_user')</p>
          </div>
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1">
            <p className="text-xs font-semibold text-slate-400 uppercase">Protected Route Protection</p>
            <p className="text-xs text-indigo-400">Active (Redirects to /login when unauthenticated)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
