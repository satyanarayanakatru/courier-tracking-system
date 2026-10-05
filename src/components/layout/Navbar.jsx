import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, Bell, LogOut, Search, PackageCheck, 
  ChevronDown, ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 glass-nav px-4 lg:px-8 py-3.5 flex items-center justify-between text-slate-800 shadow-xs">
      {/* Mobile Menu & App Branding */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 lg:hidden focus:outline-none"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center space-x-3 group">
          <motion.div 
            whileHover={{ rotate: 10, scale: 1.05 }}
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30"
          >
            <PackageCheck className="w-6 h-6" />
          </motion.div>
          <div className="hidden sm:block">
            <span className="font-black text-lg tracking-tight bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 bg-clip-text text-transparent">
              SwiftTrack
            </span>
            <span className="block text-[10px] font-black text-indigo-600 tracking-widest uppercase -mt-1">
              Courier System
            </span>
          </div>
        </Link>
      </div>

      {/* Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search shipment, tracking #, or customer..."
            className="w-full glass-input text-sm text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Notifications & User Menu */}
      <div className="flex items-center space-x-3">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/80 transition-colors"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-600 rounded-full ring-2 ring-white animate-pulse" />
        </motion.button>

        <div className="h-6 w-px bg-slate-200/80 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-1.5 rounded-2xl hover:bg-indigo-50/60 transition-colors focus:outline-none cursor-pointer"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-600/30"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-black text-slate-900 leading-tight">
                {currentUser?.name}
              </p>
              <p className="text-[11px] font-bold text-indigo-600 leading-tight">
                Courier Staff
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          <AnimatePresence>
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowDropdown(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 glass-card rounded-2xl z-50 py-2 divide-y divide-slate-100/80"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-black text-slate-900">{currentUser?.name}</p>
                    <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
                    <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <ShieldCheck className="w-3 h-3" /> Courier Staff
                    </span>
                  </div>

                  <div className="py-1">
                    <div className="px-4 py-2 text-xs text-slate-500">
                      Phone: <span className="text-slate-900 font-bold">{currentUser?.phone || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        logout();
                      }}
                      className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
