import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, Package, Users, Compass, 
  CheckCircle2, Bell, BarChart3, LogOut, X, Box
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Shipments', path: '/shipments', icon: Package },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Parcel Tracking', path: '/tracking', icon: Compass },
    { name: 'Delivery Status', path: '/status', icon: CheckCircle2 },
    { name: 'Notifications', path: '/notifications', icon: Bell },
    { name: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
  ];

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container - STICKY on desktop */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-2xl border-r border-indigo-100/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-[65px] lg:h-[calc(100vh-65px)] lg:z-20 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header inside sidebar (mobile close) */}
        <div className="flex items-center justify-between p-4 lg:hidden border-b border-indigo-100/80">
          <div className="flex items-center space-x-2">
            <Box className="w-6 h-6 text-indigo-600" />
            <span className="font-bold text-slate-900">SwiftTrack</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          <p className="px-3 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/25'
                      : 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70'
                  }`
                }
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Footer logout button */}
        <div className="p-4 border-t border-indigo-100/80">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={logout}
            className="w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout Session</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
