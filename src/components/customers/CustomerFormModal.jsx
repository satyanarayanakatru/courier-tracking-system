import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, User, Mail, Phone, MapPin, Building, Hash } from 'lucide-react';

const CustomerFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      mobileNumber: '',
      address: '',
      city: '',
      postalCode: ''
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || '',
        email: initialData.email || '',
        mobileNumber: initialData.mobileNumber || '',
        address: initialData.address || '',
        city: initialData.city || '',
        postalCode: initialData.postalCode || ''
      });
    } else {
      reset({
        name: '',
        email: '',
        mobileNumber: '',
        address: '',
        city: '',
        postalCode: ''
      });
    }
  }, [initialData, reset, isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">
              {initialData ? 'Edit Customer Details' : 'Add New Customer'}
            </h2>
            <p className="text-emerald-100 text-xs mt-1">
              {initialData ? 'Update customer profile and shipping contact details' : 'Register a new customer account into the courier system'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                {...register('name', { required: 'Full name is required' })}
                placeholder="e.g. Eleanor Vance"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.name
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.name.message}</p>
            )}
          </div>

          {/* Email & Mobile Number Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  placeholder="eleanor@example.com"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.email
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Mobile Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  {...register('mobileNumber', { required: 'Mobile number is required' })}
                  placeholder="+1 (555) 019-2834"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.mobileNumber
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
              {errors.mobileNumber && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.mobileNumber.message}</p>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Street Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                {...register('address', { required: 'Address is required' })}
                placeholder="742 Evergreen Terrace, Suite 100"
                className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                  errors.address
                    ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                }`}
              />
            </div>
            {errors.address && (
              <p className="text-red-500 text-xs mt-1 font-medium">{errors.address.message}</p>
            )}
          </div>

          {/* City & Postal Code Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                City *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  {...register('city', { required: 'City is required' })}
                  placeholder="Austin"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.city
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
              {errors.city && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.city.message}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Postal Code *
              </label>
              <div className="relative">
                <Hash className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  {...register('postalCode', { required: 'Postal Code is required' })}
                  placeholder="78701"
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${
                    errors.postalCode
                      ? 'border-red-500 focus:ring-2 focus:ring-red-200'
                      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200'
                  }`}
                />
              </div>
              {errors.postalCode && (
                <p className="text-red-500 text-xs mt-1 font-medium">{errors.postalCode.message}</p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2"
            >
              {isSubmitting ? 'Saving...' : initialData ? 'Update Customer' : 'Create Customer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomerFormModal;
