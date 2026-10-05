import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { 
  Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff 
} from 'lucide-react';
import { toast } from 'react-toastify';

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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-indigo-50/70 to-purple-100/60 flex items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden font-sans">
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-gradient-to-r from-indigo-300/30 to-purple-300/30 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md glass-card p-8 sm:p-10 rounded-3xl z-10 space-y-6"
      >
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 mb-2">
            <KeyRound className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Reset Password
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Enter Verification Code' : 'Create New Password'}
          </p>
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form className="space-y-4" onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Registered Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <input
                  type="email"
                  {...emailForm.register('email', {
                    required: 'Email address is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  placeholder="admin@courier.com"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-bold">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
              <ArrowRight className="w-4.5 h-4.5" />
            </motion.button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form className="space-y-4" onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
            <div className="p-3 bg-indigo-50/80 backdrop-blur-md border border-indigo-200/80 rounded-xl text-xs text-indigo-900 font-medium">
              A 6-digit code was sent to <span className="font-black text-indigo-950">{emailInput}</span>.
              <br />
              <span className="font-mono text-amber-700 font-bold">Demo OTP Code: 123456</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
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
                className="w-full text-center tracking-widest font-mono text-lg glass-input rounded-xl py-2.5 text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
              />
              {otpForm.formState.errors.otp && (
                <p className="mt-1.5 text-xs text-red-500 font-bold">
                  {otpForm.formState.errors.otp.message}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl text-xs font-bold text-slate-700 glass-input hover:bg-slate-200/80 transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
              <button
                type="submit"
                className="w-2/3 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
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
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...resetForm.register('newPassword', {
                    required: 'New password required',
                    minLength: { value: 6, message: 'Min 6 characters' },
                  })}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {resetForm.formState.errors.newPassword && (
                <p className="mt-1 text-xs text-red-500 font-bold">
                  {resetForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4.5 w-4.5" />
                </div>
                <input
                  type="password"
                  {...resetForm.register('confirmPassword', {
                    required: 'Please confirm password',
                    validate: (val) =>
                      val === resetForm.watch('newPassword') || 'Passwords do not match',
                  })}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-600/10"
                />
              </div>
              {resetForm.formState.errors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500 font-bold">
                  {resetForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-xl shadow-emerald-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              <span>{isSubmitting ? 'Updating...' : 'Set New Password'}</span>
              <CheckCircle2 className="w-4.5 h-4.5" />
            </motion.button>
          </form>
        )}

        <div className="text-center pt-2">
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
  );
};

export default ForgotPasswordPage;
