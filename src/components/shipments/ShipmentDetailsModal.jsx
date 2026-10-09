import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Package, MapPin, User, Calendar, Weight, Tag, 
  Truck, CheckCircle2, Clock, AlertCircle 
} from 'lucide-react';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'In Transit':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Out for Delivery':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'Picked Up':
      return 'bg-sky-100 text-sky-800 border-sky-200';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Failed Delivery':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-200';
  }
};

const ShipmentDetailsModal = ({ shipment, isOpen, onClose }) => {
  if (!isOpen || !shipment) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl glass-card rounded-3xl p-6 sm:p-8 z-10 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-100 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black text-slate-900">
                    Shipment #{shipment.trackingNumber}
                  </h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusBadge(shipment.deliveryStatus)}`}>
                    {shipment.deliveryStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{shipment.parcelType}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Sender */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Sender Information
              </p>
              <p className="text-sm font-black text-slate-900">{shipment.senderName}</p>
              <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{shipment.pickupAddress}</span>
              </p>
            </div>

            {/* Receiver */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-600" /> Receiver Information
              </p>
              <p className="text-sm font-black text-slate-900">{shipment.receiverName}</p>
              <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{shipment.deliveryAddress}</span>
              </p>
            </div>
          </div>

          {/* Parcel Specifications */}
          <div className="grid grid-cols-3 gap-3 p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs">
            <div>
              <p className="font-bold text-slate-500 uppercase">Weight</p>
              <p className="text-sm font-black text-slate-900 mt-0.5">{shipment.parcelWeight} kg</p>
            </div>
            <div>
              <p className="font-bold text-slate-500 uppercase">Shipping Date</p>
              <p className="text-xs font-black text-slate-900 mt-0.5">{shipment.shippingDate}</p>
            </div>
            <div>
              <p className="font-bold text-slate-500 uppercase">Expected SLA</p>
              <p className="text-xs font-black text-emerald-700 mt-0.5">{shipment.expectedDeliveryDate}</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-black text-slate-700 uppercase tracking-wider">
              Status History Timeline
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Shipment Created</p>
                  <p className="text-[11px] text-slate-500">{shipment.shippingDate} • Order processed in system</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-slate-800">Current Status: {shipment.deliveryStatus}</p>
                  <p className="text-[11px] text-slate-500">Live status synchronized via API</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
            >
              Close Details
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ShipmentDetailsModal;
