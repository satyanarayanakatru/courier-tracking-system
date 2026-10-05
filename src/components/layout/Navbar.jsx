import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Menu, Bell, LogOut, User, Search, PackageCheck, 
  ChevronDown, ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Navbar = ({ onToggleSidebar }) => {
  const { currentUser, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3.5 flex items-center justify-between text-slate-100">
      {/* Left side: Mobile menu & App branding */}
      <div className="flex items-center space-x-3 lg:space-x-4">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Toggle Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <Link to="/dashboard" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <PackageCheck className="w-6 h-6" />
          </div>
          <div className="hidden sm:block">
            <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
              SwiftTrack
            </span>
            <span className="block text-[10px] font-semibold text-indigo-400 tracking-wider uppercase -mt-1">
              Courier & Logistics
            </span>
          </div>
        </Link>
      </div>

      {/* Middle: Global Search Bar */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search shipment, tracking #, or customer..."
            className="w-full bg-slate-800/80 border border-slate-700/80 text-sm text-slate-200 placeholder-slate-400 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Right side: Notifications & User Profile */}
      <div className="flex items-center space-x-3">
        {/* Notification Bell */}
        <button className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-indigo-500 rounded-full ring-2 ring-slate-900 animate-pulse" />
        </button>

        <div className="h-6 w-px bg-slate-800 hidden sm:block" />

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors focus:outline-none"
          >
            <img
              src={currentUser?.avatar}
              alt={currentUser?.name}
              className="w-9 h-9 rounded-lg object-cover ring-2 ring-indigo-500/50"
            />
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-slate-200 leading-tight">
                {currentUser?.name}
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                {currentUser?.role || 'Staff Member'}
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block" />
          </button>

          {showDropdown && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 py-2 divide-y divide-slate-800 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-3">
                  <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{currentUser?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <ShieldCheck className="w-3 h-3" /> {currentUser?.role || 'Staff Member'}
                  </span>
                </div>

                <div className="py-1">
                  <div className="px-4 py-2 text-xs text-slate-400">
                    Phone: <span className="text-slate-200 font-medium">{currentUser?.phone || 'N/A'}</span>
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowDropdown(false);
                      logout();
                    }}
                    className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
