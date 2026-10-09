import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Package, MapPin, User, Weight, Calendar, CheckCircle2, Tag } from 'lucide-react';
import { generateTrackingNumber } from '../../services/shipmentService';

const ShipmentFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      senderName: '',
      receiverName: '',
      pickupAddress: '',
      deliveryAddress: '',
      parcelType: 'Standard Parcel',
      parcelWeight: '2.5',
      deliveryStatus: 'Pending',
      shippingDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    } else {
      reset({
        senderName: '',
        receiverName: '',
        pickupAddress: '',
        deliveryAddress: '',
        parcelType: 'Standard Parcel',
        parcelWeight: '2.5',
        deliveryStatus: 'Pending',
        shippingDate: new Date().toISOString().split('T')[0],
        expectedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
      });
    }
  }, [initialData, isOpen, reset]);

  if (!isOpen) return null;

  const handleFormSubmit = (data) => {
    const payload = {
      ...data,
      id: isEditing ? initialData.id : `shp-${Date.now()}`,
      trackingNumber: isEditing ? initialData.trackingNumber : generateTrackingNumber(),
      parcelWeight: parseFloat(data.parcelWeight),
    };
    onSubmit(payload);
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  {isEditing ? `Edit Shipment #${initialData.trackingNumber}` : 'Create New Shipment'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {isEditing ? 'Update parcel details & delivery status' : 'Auto-generates unique tracking number'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Sender & Receiver Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
                    className={`w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                      errors.senderName ? 'border-red-500' : ''
                    }`}
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
                    className={`w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                      errors.receiverName ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.receiverName && <p className="mt-1 text-xs text-red-500 font-bold">{errors.receiverName.message}</p>}
              </div>
            </div>

            {/* Pickup & Delivery Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Pickup Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    {...register('pickupAddress', { required: 'Pickup address required' })}
                    placeholder="123 Main St, Springfield, OR"
                    className={`w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                      errors.pickupAddress ? 'border-red-500' : ''
                    }`}
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
                    placeholder="456 Market St, Los Angeles, CA"
                    className={`w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                      errors.deliveryAddress ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.deliveryAddress && <p className="mt-1 text-xs text-red-500 font-bold">{errors.deliveryAddress.message}</p>}
              </div>
            </div>

            {/* Parcel Type, Weight, Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parcel Type
                </label>
                <select
                  {...register('parcelType')}
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="Standard Parcel">Standard Parcel</option>
                  <option value="Document Express">Document Express</option>
                  <option value="Heavy Freight">Heavy Freight</option>
                  <option value="Fragile Cargo">Fragile Cargo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Parcel Weight (kg)
                </label>
                <div className="relative">
                  <Weight className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    step="0.1"
                    {...register('parcelWeight', { required: 'Weight is required' })}
                    placeholder="2.5"
                    className={`w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 ${
                      errors.parcelWeight ? 'border-red-500' : ''
                    }`}
                  />
                </div>
                {errors.parcelWeight && <p className="mt-1 text-xs text-red-500 font-bold">{errors.parcelWeight.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Delivery Status
                </label>
                <select
                  {...register('deliveryStatus')}
                  className="w-full glass-input rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                >
                  <option value="Pending">Pending</option>
                  <option value="Picked Up">Picked Up</option>
                  <option value="In Transit">In Transit</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Failed Delivery">Failed Delivery</option>
                </select>
              </div>
            </div>

            {/* Dates Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Shipping Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    {...register('shippingDate', { required: 'Shipping date required' })}
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Expected Delivery Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    {...register('expectedDeliveryDate', { required: 'Delivery date required' })}
                    className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Form Footer Actions */}
            <div className="pt-3 border-t border-emerald-100 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all flex items-center space-x-2 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{isEditing ? 'Save Changes' : 'Create & Dispatch'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShipmentFormModal;
