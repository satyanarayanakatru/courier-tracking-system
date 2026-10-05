import React from 'react';
import { Compass, CheckCircle2, Bell, BarChart3 } from 'lucide-react';

export const TrackingPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Parcel Tracking</h1>
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
      <Compass className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
      <h3 className="text-lg font-bold text-slate-900">Parcel Tracking Module Placeholder</h3>
    </div>
  </div>
);

export const StatusPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Delivery Status Management</h1>
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
      <CheckCircle2 className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
      <h3 className="text-lg font-bold text-slate-900">Delivery Status Module Placeholder</h3>
    </div>
  </div>
);

export const NotificationsPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Notification Center</h1>
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
      <Bell className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
      <h3 className="text-lg font-bold text-slate-900">Notifications Module Placeholder</h3>
    </div>
  </div>
);

export const ReportsPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Reports & Analytics</h1>
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
      <BarChart3 className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
      <h3 className="text-lg font-bold text-slate-900">Reports Module Placeholder</h3>
    </div>
  </div>
);
