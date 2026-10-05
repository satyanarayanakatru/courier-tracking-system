import React from 'react';
import { Compass, CheckCircle2, Bell, BarChart3 } from 'lucide-react';

export const TrackingPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-white">Parcel Tracking</h1>
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
      <Compass className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
      <h3 className="text-lg font-semibold text-white">Parcel Tracking Module Placeholder</h3>
    </div>
  </div>
);

export const StatusPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-white">Delivery Status Management</h1>
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
      <CheckCircle2 className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
      <h3 className="text-lg font-semibold text-white">Delivery Status Module Placeholder</h3>
    </div>
  </div>
);

export const NotificationsPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-white">Notification Center</h1>
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
      <Bell className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
      <h3 className="text-lg font-semibold text-white">Notifications Module Placeholder</h3>
    </div>
  </div>
);

export const ReportsPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-white">Reports & Analytics</h1>
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
      <BarChart3 className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
      <h3 className="text-lg font-semibold text-white">Reports Module Placeholder</h3>
    </div>
  </div>
);
