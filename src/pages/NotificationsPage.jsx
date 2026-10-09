import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Bell,
  CheckCircle2,
  AlertTriangle,
  Truck,
  Trash2,
  CheckCheck,
  ExternalLink,
  Plus,
  Filter,
  Clock,
  ShieldAlert,
  Inbox
} from 'lucide-react';
import { getNotifications, saveNotifications } from '../services/notificationService';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('All'); // 'All' | 'Unread' | 'Delivery' | 'System'

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = () => {
    const data = getNotifications();
    setNotifications(data);
  };

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => n.unread).length;
  }, [notifications]);

  // Filtered List
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'Unread') return n.unread;
      if (activeTab === 'Delivery') return n.type === 'delivery' || n.type === 'success';
      if (activeTab === 'System') return n.type === 'system' || n.type === 'warning';
      return true;
    });
  }, [notifications, activeTab]);

  // Actions
  const handleMarkAsRead = (id) => {
    const updated = notifications.map((n) => (n.id === id ? { ...n, unread: false } : n));
    setNotifications(updated);
    saveNotifications(updated);
    toast.success('Notification marked as read');
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, unread: false }));
    setNotifications(updated);
    saveNotifications(updated);
    toast.success('All notifications marked as read');
  };

  const handleDelete = (id) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
    toast.info('Notification removed');
  };

  const handleClearAll = () => {
    setNotifications([]);
    saveNotifications([]);
    toast.info('Notification center cleared');
  };

  const handleAddDemoNotification = () => {
    const demo = {
      id: `notif-${Date.now()}`,
      title: 'New Dispatch Broadcast',
      message: 'System audit completed. All parcel routes updated automatically for optimal SLA delivery.',
      type: 'system',
      unread: true,
      timestamp: 'Just now',
      createdAt: new Date().toISOString()
    };
    const updated = [demo, ...notifications];
    setNotifications(updated);
    saveNotifications(updated);
    toast.success('New system test notification generated!');
  };

  const getNotifIcon = (type) => {
    switch (type) {
      case 'delivery':
        return <Truck className="w-5 h-5 text-indigo-600" />;
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      default:
        return <Bell className="w-5 h-5 text-teal-600" />;
    }
  };

  const getNotifBg = (type, unread) => {
    if (!unread) return 'bg-white border-slate-200';
    switch (type) {
      case 'warning':
        return 'bg-rose-50/60 border-rose-200';
      case 'success':
        return 'bg-emerald-50/60 border-emerald-200';
      case 'delivery':
        return 'bg-indigo-50/60 border-indigo-200';
      default:
        return 'bg-emerald-50/30 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Module 7 • System Alert Hub</span>
          </div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Notification Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs animate-pulse">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Real-time delivery status alerts, delay notices, and system broadcast updates
          </p>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          <button
            onClick={handleAddDemoNotification}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Test Alert</span>
          </button>
        </div>
      </div>

      {/* Control Bar & Filter Tabs */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto">
          {['All', 'Unread', 'Delivery', 'System'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab === 'All'
                ? `All Notifications (${notifications.length})`
                : tab === 'Unread'
                ? `Unread (${unreadCount})`
                : tab}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <CheckCheck className="w-4 h-4" />
              <span>Mark All as Read</span>
            </button>
          )}

          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600 text-xs font-semibold transition-colors flex items-center space-x-1 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* Notification Items List */}
      {filteredNotifications.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
          <p className="text-xs text-slate-400">
            You are all caught up! No notifications found for this filter tab.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((n) => (
            <div
              key={n.id}
              className={`p-5 rounded-3xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs relative overflow-hidden ${getNotifBg(
                n.type,
                n.unread
              )}`}
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-white rounded-2xl shadow-xs shrink-0 border border-slate-100">
                  {getNotifIcon(n.type)}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h3 className="font-bold text-slate-900 text-sm">{n.title}</h3>
                    {n.unread && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-slate-400 font-semibold flex items-center space-x-1 pt-0.5">
                    <Clock className="w-3 h-3" />
                    <span>{n.timestamp}</span>
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                {n.trackingNumber && (
                  <button
                    onClick={() => navigate(`/shipments/details/${n.trackingNumber}`)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200 text-emerald-700 text-xs font-bold shadow-xs transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Track</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {n.unread && (
                  <button
                    onClick={() => handleMarkAsRead(n.id)}
                    className="p-2 rounded-xl bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 text-xs font-semibold transition-colors"
                    title="Mark as Read"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </button>
                )}

                <button
                  onClick={() => handleDelete(n.id)}
                  className="p-2 rounded-xl bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 text-xs transition-colors"
                  title="Delete Notification"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
