import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PackageCheck, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, ShieldCheck, 
  Sparkles, CheckCircle2 
} from 'lucide-react';

const RegisterPage = () => {
  const { register: registerAuth } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  const password = watch('password', '');

  const onSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = registerAuth({
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: 'Courier Staff',
        password: data.password,
      });
      setIsSubmitting(false);
      if (res.success) {
        navigate('/dashboard');
      }
    }, 450);
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
            src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=1200&auto=format&fit=crop&q=85" 
            alt="Express Delivery Cargo" 
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

          {/* Top Header */}
          <div className="relative z-10">
            <div className="inline-flex items-center space-x-2 bg-slate-900/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-bold shadow-lg">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-white">Join SwiftTrack Network</span>
            </div>

            <h1 className="mt-6 text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white drop-shadow-lg">
              Register New Dispatcher Profile
            </h1>
            <p className="mt-3 text-sm text-slate-100 leading-relaxed font-medium max-w-md drop-shadow-md">
              Gain instant access to real-time shipment creation, tracking updates, and customer management tools.
            </p>
          </div>

          {/* Feature Badges */}
          <div className="my-6 relative z-10 space-y-2.5">
            {[
              'Real-Time Parcel Tracking & History',
              'Third-Party API Integration (DummyJSON)',
              'Live Delivery Status & Notifications',
            ].map((text, idx) => (
              <div key={idx} className="flex items-center space-x-3 p-3 bg-slate-900/75 backdrop-blur-md border border-white/20 rounded-xl shadow-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold text-white">{text}</span>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="relative z-10 text-xs text-slate-200 flex items-center justify-between font-bold drop-shadow-md">
            <span>Role: Courier Staff</span>
            <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Instant Access</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Section */}
        <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-center bg-white/50 backdrop-blur-md relative z-10">
          <div className="space-y-2 mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 mb-1">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Create Staff Account
            </h2>
            <p className="text-sm text-slate-500 font-medium">
              Register your dispatcher profile in seconds
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4.5 w-4.5" />
                </div>
                <input
                  type="text"
                  {...register('name', { required: 'Full name is required' })}
                  placeholder="John Doe"
                  className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email format',
                      },
                    })}
                    placeholder="john@example.com"
                    className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-500 font-bold">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type="text"
                    {...register('phone', { required: 'Phone number is required' })}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.phone && <p className="mt-1 text-xs text-red-500 font-bold">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Assigned Role Badge */}
            <div className="p-3 bg-indigo-50/80 backdrop-blur-md border border-indigo-200/80 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-indigo-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Assigned System Role:</span>
              </div>
              <span className="px-2.5 py-1 bg-indigo-600 text-white rounded-lg font-bold">
                Courier Staff
              </span>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Password required',
                      minLength: { value: 6, message: 'Min 6 chars' },
                    })}
                    placeholder="••••••••"
                    className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500 font-bold">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4.5 w-4.5" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Confirm password required',
                      validate: (val) => val === password || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    className={`w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-500 font-bold">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Account...' : 'Register Staff Account'}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </motion.button>
          </form>

          <div className="text-center mt-5 pt-4 border-t border-slate-200/80">
            <p className="text-xs text-slate-500 font-medium">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-black text-indigo-600 hover:text-indigo-700 hover:underline"
              >
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
