import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  PackageCheck, Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2, Eye, EyeOff 
} from 'lucide-react';
import { toast } from 'react-toastify';

const ForgotPasswordPage = () => {
  const { resetPassword, users } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset Password
  const [emailInput, setEmailInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form for Step 1
  const emailForm = useForm({ defaultValues: { email: '' } });
  // Form for Step 2
  const otpForm = useForm({ defaultValues: { otp: '' } });
  // Form for Step 3
  const resetForm = useForm({ defaultValues: { newPassword: '', confirmPassword: '' } });

  // Handle Step 1 Submit
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

  // Handle Step 2 Submit (OTP verification)
  const handleOtpSubmit = (data) => {
    if (data.otp !== '123456') {
      toast.error('Invalid verification code! Use demo code: 123456');
      return;
    }
    toast.success('Code verified! Enter your new password.');
    setStep(3);
  };

  // Handle Step 3 Submit (Reset password)
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
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 text-slate-100 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-xl shadow-indigo-500/25 mb-3">
          <KeyRound className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Reset Password
        </h2>
        <p className="mt-1 text-xs text-slate-400">
          Step {step} of 3: {step === 1 ? 'Enter Email' : step === 2 ? 'Enter Verification Code' : 'Create New Password'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl py-8 px-6 sm:px-10 shadow-2xl rounded-2xl border border-slate-800 space-y-5">
          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form className="space-y-4" onSubmit={emailForm.handleSubmit(handleEmailSubmit)}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 h-4" />
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
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
                {emailForm.formState.errors.email && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {emailForm.formState.errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Sending Code...' : 'Send Verification Code'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* STEP 2: Enter Verification Code */}
          {step === 2 && (
            <form className="space-y-4" onSubmit={otpForm.handleSubmit(handleOtpSubmit)}>
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-xs text-indigo-300">
                A 6-digit code was sent to <span className="font-semibold text-white">{emailInput}</span>.
                <br />
                <span className="font-mono text-amber-300 font-bold">Demo OTP Code: 123456</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
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
                  className="w-full text-center tracking-widest font-mono text-lg bg-slate-950/70 border border-slate-700/80 rounded-xl py-2.5 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {otpForm.formState.errors.otp && (
                  <p className="mt-1.5 text-xs text-red-400">
                    {otpForm.formState.errors.otp.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 flex items-center justify-center space-x-1.5 py-3 px-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  type="submit"
                  className="w-2/3 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/30 transition-all"
                >
                  <span>Verify Code</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <form className="space-y-4" onSubmit={resetForm.handleSubmit(handleResetSubmit)}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    {...resetForm.register('newPassword', {
                      required: 'New password required',
                      minLength: { value: 6, message: 'Min 6 characters' },
                    })}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-10 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 h-4" /> : <Eye className="h-4 h-4" />}
                  </button>
                </div>
                {resetForm.formState.errors.newPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {resetForm.formState.errors.newPassword.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 h-4" />
                  </div>
                  <input
                    type="password"
                    {...resetForm.register('confirmPassword', {
                      required: 'Please confirm password',
                      validate: (val) =>
                        val === resetForm.watch('newPassword') || 'Passwords do not match',
                    })}
                    placeholder="••••••••"
                    className="w-full bg-slate-950/70 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                {resetForm.formState.errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-400">
                    {resetForm.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-600/30 transition-all disabled:opacity-50"
              >
                <span>{isSubmitting ? 'Updating...' : 'Set New Password'}</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="text-center pt-2">
            <Link
              to="/login"
              className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
