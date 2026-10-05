import React from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, User, Calendar, Weight, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const QuickShipmentModal = ({ isOpen, onClose, onCreated }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      senderName: '',
      receiverName: '',
      pickupAddress: '',
      deliveryAddress: '',
      parcelType: 'Standard Parcel',
      weight: '2.5',
    }
  });

  if (!isOpen) return null;

  const onSubmit = (data) => {
    const trackingNum = `ST-${Math.floor(100000 + Math.random() * 900000)}`;
    const newShipment = {
      ...data,
      trackingNumber: trackingNum,
      shippingDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      deliveryStatus: 'Pending',
    };

    // Store in LocalStorage if available
    const existing = JSON.parse(localStorage.getItem('courier_shipments') || '[]');
    localStorage.setItem('courier_shipments', JSON.stringify([newShipment, ...existing]));

    toast.success(`Shipment #${trackingNum} created successfully!`);
    if (onCreated) onCreated(newShipment);
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg glass-card rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-indigo-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Create Quick Shipment</h3>
                <p className="text-xs text-slate-500 font-medium">Generate tracking number & dispatch parcel</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Sender & Receiver */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Sender Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('senderName', { required: 'Sender name is required' })}
                    placeholder="John Sender"
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                {errors.senderName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.senderName.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Receiver Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('receiverName', { required: 'Receiver name is required' })}
                    placeholder="Alice Receiver"
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                {errors.receiverName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.receiverName.message}</p>}
              </div>
            </div>

            {/* Pickup & Delivery Address */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pickup Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('pickupAddress', { required: 'Pickup address required' })}
                    placeholder="123 Main St, New York, NY"
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                {errors.pickupAddress && <p className="mt-1 text-xs text-red-500 font-bold">{errors.pickupAddress.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('deliveryAddress', { required: 'Delivery address required' })}
                    placeholder="456 Market St, San Francisco, CA"
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
                {errors.deliveryAddress && <p className="mt-1 text-xs text-red-500 font-bold">{errors.deliveryAddress.message}</p>}
              </div>
            </div>

            {/* Parcel Type & Weight */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parcel Type
                </label>
                <select
                  {...register('parcelType')}
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                >
                  <option value="Standard Parcel">Standard Parcel</option>
                  <option value="Document Express">Document Express</option>
                  <option value="Heavy Freight">Heavy Freight</option>
                  <option value="Fragile Cargo">Fragile Cargo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Weight (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('weight', { required: 'Weight is required' })}
                    placeholder="2.5"
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Dispatch Shipment</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default QuickShipmentModal;
