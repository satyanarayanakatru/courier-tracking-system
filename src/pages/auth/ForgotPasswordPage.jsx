import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  PackageCheck, Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck, Leaf 
} from 'lucide-react';
import { toast } from 'react-toastify';
import bgImage from '../../assets/courier_login_bg.jpg';

const ForgotPasswordPage = () => {
  const { resetPassword, users } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [emailInput, setEmailInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailForm = useForm({ defaultValues: { email: '' } });
  const otpForm = useForm({ defaultValues: { otp: '' } });
  const resetForm = useForm({ defaultValues: { newPassword: '', confirmPassword: '' } });

  const handleEmailSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const userExists = users.some(
        (u) => u.email.toLowerCase() === data.email.toLowerCase().trim()
      );

      if (!userExists) {
        toast.error('No registered user found with this email.');
        return;
      }

      setEmailInput(data.email);
      toast.success('Verification code sent! (Use demo code: 123456)');
      setStep(2);
    }, 400);
  };

  const handleOtpSubmit = (data) => {
    if (data.otp !== '123456') {
      toast.error('Invalid verification code! Use demo code: 123456');
      return;
    }
    toast.success('Code verified! Enter your new password.');
    setStep(3);
  };

  const handleResetSubmit = (data) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      const res = resetPassword(emailInput, data.newPassword);
      if (res.success) {
        navigate('/login');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 sm:p-6 lg:p-12 overflow-hidden font-sans select-none">
      <img 
        src={bgImage} 
        alt="Courier & Logistics Hero Background" 
        className="absolute inset-0 w-full h-full object-cover object-center scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/70 via-slate-900/40 to-slate-950/20 backdrop-blur-[1px]" />

      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-8 relative z-10">
        
        {/* LEFT SIDE: Hero Text */}
        <motion.div 
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-7 text-white space-y-6 px-4 lg:px-6"
        >
          <div className="inline-flex items-center space-x-2.5 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 text-xs font-bold shadow-lg">
            <KeyRound className="w-5 h-5 text-emerald-400" />
            <span className="text-white tracking-wide">SwiftTrack Security</span>
            <span className="text-emerald-300 font-semibold">• Password Recovery</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-xl">
            Account Access <br />
            <span className="bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent flex items-center gap-3">
              Recovery <Leaf className="w-10 h-10 text-emerald-400 inline-block animate-bounce" />
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-100 font-medium max-w-xl leading-relaxed drop-shadow-md">
            Easily reset your account password using verification code OTP authentication.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <div className="flex items-center space-x-2.5 px-4 py-2.5 bg-slate-900/60 backdrop-blur-md rounded-2xl border border-white/20 text-xs font-bold shadow-lg">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Secure 2-Factor OTP Verification</span>
            </div>
          </div>
        </motion.div>

        {/* RIGHT SIDE: Floating Glass Auth Card */}
        <motion.div 
          initial={{ opacity: 0, x: 40, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="lg:col-span-5 ml-auto w-full max-w-md bg-white/85 backdrop-blur-2xl rounded-[2.2rem] p-6 sm:p-8 border border-white/90 shadow-2xl shadow-slate-950/20 space-y-5"
        >
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 mb-1">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Reset Password
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Enter Code' : 'Set New Password'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-3 gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 text-xs font-bold text-slate-600">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="py-2 rounded-xl hover:bg-slate-200/80 text-center transition-colors cursor-pointer"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="py-2 rounded-xl hover:bg-slate-200/80 text-center transition-colors cursor-pointer"
            >
              Register
            </button>
            <button
              type="button"
              className="py-2 rounded-xl bg-emerald-600 text-white shadow-xs text-center font-extrabold"
            >
              Reset
            </button>
          </div>

          {/* STEP 1 */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="email"
                    {...emailForm.register('email', {
                      required: 'Email address is required',
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'Invalid email address',
                      },
                    })}
                    placeholder="Enter your email address"
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-600/10 transition-all"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-1 text-xs text-red-500 font-bold">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
                <ArrowRight className="w-4.5 h-4.5" />
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form className="space-y-4" onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
              <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl text-xs text-slate-700 font-medium">
                OTP sent to <span className="font-bold text-slate-900">{emailInput}</span>.
                <br />
                <span className="font-mono text-amber-700 font-bold">Demo OTP Code: 123456</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Verification Code (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  {...otpForm.register('otp', {
                    required: 'Verification code is required',
                    minLength: { value: 6, message: '6-digit code required' },
                  })}
                  placeholder="123456"
                  className="w-full text-center tracking-widest font-mono text-lg glass-input rounded-xl py-2.5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                />
              </div>

              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 flex items-center justify-center space-x-1 py-3 px-3 rounded-xl text-xs font-bold text-slate-700 glass-input hover:bg-slate-200/80 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="w-2/3 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer"
                >
                  <span>Verify Code</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form className="space-y-4" onSubmit={resetForm.handleSubmit(handleResetSubmit)}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...resetForm.register('newPassword', {
                      required: 'Required',
                      minLength: { value: 6, message: 'Min 6 chars' },
                    })}
                    placeholder="••••••••"
                    className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input
                    type="password"
                    {...resetForm.register('confirmPassword', {
                      required: 'Required',
                      validate: (val) => val === resetForm.watch('newPassword') || 'No match',
                    })}
                    placeholder="••••••••"
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-emerald-600/10"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/25 transition-all cursor-pointer"
              >
                <span>{isSubmitting ? 'Updating...' : 'Set New Password'}</span>
                <CheckCircle2 className="w-4.5 h-4.5" />
              </button>
            </form>
          )}

          <div className="text-center pt-1">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-500 font-bold hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Login</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
