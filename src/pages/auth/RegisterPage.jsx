import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PackageCheck, Eye, EyeOff, Lock, Mail, User, Phone, ArrowRight, Zap, 
  CheckCircle2, ShieldCheck
} from 'lucide-react';
import bgImage from '../../assets/courier_login_bg.jpg';

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
    <div className="h-screen w-full relative flex items-center justify-center p-3 sm:p-6 overflow-hidden font-sans select-none">
      <img 
        src={bgImage} 
        alt="SwiftTrack Logistics Hero Background" 
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-slate-900/40 to-slate-950/20 backdrop-blur-[1px]" />

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-6 relative z-10 my-auto">
        
        {/* LEFT SIDE */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="lg:col-span-7 text-white space-y-4 px-3 lg:px-6"
        >
          <div className="inline-flex items-center space-x-2 bg-emerald-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-500/30 text-xs font-bold shadow-lg">
            <PackageCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-white tracking-wide">SwiftTrack Dispatch</span>
            <span className="text-emerald-400 font-semibold">• Staff Onboarding</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-xl">
            Create Your Official <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-green-200 bg-clip-text text-transparent">
              Dispatcher Profile
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-100 font-medium max-w-lg leading-relaxed drop-shadow-md">
            Register to access live shipment creation, customer profile tools, and real-time parcel status tracking.
          </p>

          <div className="pt-1 flex flex-wrap gap-2.5">
            <div className="flex items-center space-x-2 px-3.5 py-2 bg-slate-900/70 backdrop-blur-md rounded-xl border border-white/20 text-xs font-bold shadow-md">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Instant LocalStorage Session Setup</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE */}
        <motion.div 
          initial={{ opacity: 0, x: 30, scale: 0.96 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="lg:col-span-5 ml-auto w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-3xl p-5 sm:p-6 border border-white/90 shadow-2xl shadow-slate-950/20 space-y-3.5"
        >
          <div className="text-center space-y-1">
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-0.5">
              <PackageCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Create Account
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Register your courier dispatcher credentials
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="py-1.5 rounded-lg hover:bg-slate-200/80 text-center transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              className="py-1.5 rounded-lg bg-emerald-600 text-white shadow-xs text-center font-extrabold"
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

          <form className="space-y-2.5" onSubmit={handleSubmit(onSubmit)}>
            {/* Name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  {...register('name', { required: 'Name required' })}
                  placeholder="John Doe"
                  className={`w-full glass-input rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.name && <p className="mt-0.5 text-[10px] text-red-500 font-bold">{errors.name.message}</p>}
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email',
                      },
                    })}
                    placeholder="email@domain.com"
                    className={`w-full glass-input rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.email && <p className="mt-0.5 text-[10px] text-red-500 font-bold">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                  Phone
                </label>
                <div className="relative">
                  <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    {...register('phone', { required: 'Phone required' })}
                    placeholder="+1 (555) 019"
                    className={`w-full glass-input rounded-xl pl-8 pr-2 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                      errors.phone ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.phone && <p className="mt-0.5 text-[10px] text-red-500 font-bold">{errors.phone.message}</p>}
              </div>
            </div>

            {/* Role Badge */}
            <div className="p-2 bg-emerald-50/90 border border-emerald-200/90 rounded-xl flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> System Role:
              </span>
              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-lg font-bold text-[10px]">
                Courier Staff
              </span>
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...register('password', {
                      required: 'Required',
                      minLength: { value: 6, message: 'Min 6 chars' },
                    })}
                    placeholder="••••••••"
                    className={`w-full glass-input rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                      errors.password ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                {errors.password && <p className="mt-0.5 text-[10px] text-red-500 font-bold">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-0.5">
                  Confirm
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    {...register('confirmPassword', {
                      required: 'Required',
                      validate: (val) => val === password || 'No match',
                    })}
                    placeholder="••••••••"
                    className={`w-full glass-input rounded-xl pl-8 pr-7 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 transition-all ${
                      errors.confirmPassword ? 'border-red-500' : ''
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-0.5 text-[10px] text-red-500 font-bold">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Registering...' : 'Register Staff Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </form>

          <div className="text-center pt-1 border-t border-slate-200/80">
            <p className="text-[11px] text-slate-500 font-medium">
              Already registered?{' '}
              <Link
                to="/login"
                className="font-black text-emerald-600 hover:text-emerald-700 hover:underline"
              >
                Sign In here
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
