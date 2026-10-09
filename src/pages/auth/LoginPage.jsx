import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PackageCheck, Eye, EyeOff, Lock, Mail, ArrowRight, Zap, 
  ShieldCheck, CheckCircle2, Sparkles
} from 'lucide-react';
import bgImage from '../../assets/courier_login_bg.jpg';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
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
    <div className="h-screen w-full relative flex items-center justify-center p-3 sm:p-6 overflow-hidden font-sans select-none">
      {/* Background Image */}
      <img 
        src={bgImage} 
        alt="SwiftTrack Logistics Hero Background" 
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-slate-950/20 backdrop-blur-[1px]" />

      {/* Content Container - Compact height to fit viewport without scrolling */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-6 relative z-10 my-auto">
        
        {/* LEFT SIDE: Original Hero Text (Green Theme) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-7 text-white space-y-4 px-3 lg:px-6"
        >
          {/* Brand Tag */}
          <div className="inline-flex items-center space-x-2 bg-emerald-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-bold shadow-lg">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white tracking-wide">SwiftTrack Logistics</span>
            <span className="text-emerald-400 font-semibold">• Green Smart Fleet</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xl">
            Next-Gen Courier <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200 bg-clip-text text-transparent">
              Dispatching System
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-lg leading-relaxed drop-shadow-md">
            Streamline your parcel dispatches with automated routing, live satellite GPS tracking, and real-time operational metrics.
          </p>

          {/* Feature Badges */}
          <div className="pt-1 flex flex-wrap gap-2.5">
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/20 text-xs font-bold shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Dispatching Controls</span>
            </div>
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/20 text-xs font-bold shadow-md">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>DummyJSON API Integration</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Floating Glass Auth Card */}
        <motion.div 
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="lg:col-span-5 ml-auto w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/90 shadow-2xl shadow-slate-950/20 space-y-4"
        >
          {/* Header */}
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-0.5">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Portal Sign In
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Access your courier staff dispatcher workspace
            </p>
          </div>

          {/* Demo Login Quick Fill Button */}
          <div className="p-2 bg-emerald-50/90 border border-emerald-200/90 rounded-xl flex items-center justify-between text-xs">
            <span className="font-bold text-slate-700 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> Demo Login:
            </span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold shadow-xs transition-all cursor-pointer text-xs"
            >
              Courier Staff
            </button>
          </div>

          {/* Auth Tab Navigation (Login | Register | Reset) */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-600">
            <button
              type="button"
              className="py-1.5 rounded-lg bg-emerald-600 text-white shadow-xs text-center font-extrabold"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="py-1.5 rounded-lg hover:bg-slate-200/80 text-center transition-colors cursor-pointer"
            >
              Register
            </button>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="py-1.5 rounded-lg hover:bg-slate-200/80 text-center transition-colors cursor-pointer"
            >
              Reset
            </button>
          </div>

          {/* Form */}
          <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email format',
                    },
                  })}
                  placeholder="admin@courier.com"
                  className={`w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                    errors.email ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-[11px] text-red-500 font-bold">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
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
                  className={`w-full glass-input rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                    errors.password ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-[11px] text-red-500 font-bold">{errors.password.message}</p>
              )}
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between text-xs pt-0.5">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5"
                />
                <span className="text-slate-600 font-semibold text-[11px]">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="font-bold text-emerald-600 hover:text-emerald-700 hover:underline text-[11px]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          {/* Social Sign-In */}
          <div className="text-center space-y-2 pt-1 border-t border-slate-200/80">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Or quick login with</p>
            <div className="flex justify-center space-x-2.5">
              <button 
                type="button" 
                onClick={handleDemoFill}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-200 text-xs transition-colors"
              >
                G
              </button>
              <button 
                type="button" 
                onClick={handleDemoFill}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-200 text-xs transition-colors"
              >
                f
              </button>
              <button 
                type="button" 
                onClick={handleDemoFill}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 font-bold border border-slate-200 text-xs transition-colors"
              >
                
              </button>
            </div>

            <p className="text-[11px] text-slate-500 font-medium">
              Need an account?{' '}
              <Link
                to="/register"
                className="font-black text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
