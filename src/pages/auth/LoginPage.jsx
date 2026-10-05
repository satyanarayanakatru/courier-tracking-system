import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PackageCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Zap, 
  Truck, ShieldCheck, MapPin, Navigation, Sparkles 
} from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = login(data.email, data.password);
      setIsSubmitting(false);
      if (res.success) {
        navigate('/dashboard');
      }
    }, 450);
  };

  const handleDemoFill = () => {
    setValue('email', 'admin@courier.com');
    setValue('password', 'password123');
    login('admin@courier.com', 'password123');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/70 to-purple-100/60 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      {/* Background blobs */}
      <motion.div 
        animate={{ scale: [1, 1.25, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-indigo-400/30 to-purple-400/30 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.3, 1], x: [0, -40, 0], y: [0, 30, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-r from-sky-400/30 to-indigo-300/30 rounded-full blur-3xl pointer-events-none"
      />

      {/* Main Split Glass Card with Vivid Image */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="w-full max-w-5xl glass-card rounded-[2.5rem] grid grid-cols-1 lg:grid-cols-12 overflow-hidden z-10 shadow-2xl"
      >
        {/* LEFT COLUMN: Bright Vibrant Logistics Image Showcase */}
        <div className="lg:col-span-6 relative flex flex-col justify-between p-8 sm:p-12 text-white overflow-hidden min-h-[440px]">
          {/* High resolution bright image */}
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=85" 
            alt="Logistics Hub" 
            className="absolute inset-0 w-full h-full object-cover object-center brightness-105 contrast-105"
          />
          
          {/* Subtle gradient overlay to ensure text readability without darkening image */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-slate-900/30" />

          {/* SVG Curved Cut Edge on the right side */}
          <div className="hidden lg:block absolute top-0 bottom-0 -right-1 w-16 pointer-events-none z-10 text-white/90 fill-current">
            <svg viewBox="0 0 100 800" preserveAspectRatio="none" className="w-full h-full">
              <path d="M100,0 C30,250 100,500 0,800 L100,800 Z" />
            </svg>
          </div>

          {/* Top Branding */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white">SwiftTrack Logistics</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
              Courier & Parcel Dispatching System
            </h1>
            <p className="mt-3 text-sm text-slate-100 leading-relaxed font-medium max-w-md drop-shadow-md">
              Manage shipments, track live deliveries, update statuses, and serve customers with precision.
            </p>
          </div>

          {/* Live Tracking Glass Pill Card */}
          <div className="my-6 relative z-10">
            <motion.div 
              whileHover={{ y: -4, scale: 1.01 }}
              className="bg-slate-900/75 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-white">Tracking #ST-992140</p>
                    <p className="text-[11px] text-indigo-200">Express Air Courier</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  In Transit
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-slate-200 font-semibold">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-sky-300" /> Regional Depot</span>
                  <span className="flex items-center gap-1"><Navigation className="w-3.5 h-3.5 text-emerald-300" /> Destination</span>
                </div>
                <div className="h-2 w-full bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-white/20">
                  <motion.div 
                    initial={{ width: '0%' }}
                    animate={{ width: '80%' }}
                    transition={{ duration: 1.6, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-sky-400 via-indigo-400 to-emerald-400 rounded-full"
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer note */}
          <div className="relative z-10 text-xs text-slate-200 flex items-center justify-between font-bold drop-shadow-md">
            <span>Role: Courier Staff</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified System</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Section */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white/50 backdrop-blur-md relative z-10">
          <div className="space-y-2 mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-2">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Sign In to Account
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Access your courier dispatcher control panel
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="admin@courier.com"
                  className={`w-full glass-input rounded-xl pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Minimum 6 characters required',
                    },
                  })}
                  placeholder="••••••••"
                  className={`w-full glass-input rounded-xl pl-10 pr-10 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-bold">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </motion.button>
          </form>

          {/* Single Demo Credential Shortcut */}
          <div className="mt-6 pt-5 border-t border-slate-200/80">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Demo Credentials:
            </p>
            <button
              type="button"
              onClick={handleDemoFill}
              className="w-full p-3 glass-input hover:bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between text-left transition-all group cursor-pointer shadow-xs"
            >
              <div>
                <p className="text-xs font-black text-indigo-950 group-hover:text-indigo-600">
                  Courier Staff (Default User)
                </p>
                <p className="text-[11px] text-slate-500 font-medium">admin@courier.com • password123</p>
              </div>
              <span className="text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-indigo-200 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                1-Click Login
              </span>
            </button>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-500 font-medium">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-black text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
