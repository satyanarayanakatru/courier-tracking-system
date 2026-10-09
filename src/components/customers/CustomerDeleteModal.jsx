import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const CustomerDeleteModal = ({ isOpen, onClose, onConfirm, customer }) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="p-6 pb-0 flex justify-between items-start">
          <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900">Delete Customer Profile</h3>
          <p className="text-slate-500 text-xs mt-2 leading-relaxed">
            Are you sure you want to delete customer <strong className="text-slate-900">{customer.name}</strong> ({customer.email})? This action will remove their record from local storage.
          </p>

          {/* Customer snippet badge */}
          <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center space-x-3 text-xs">
            <img
              src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={customer.name}
              className="w-10 h-10 rounded-xl object-cover"
            />
            <div>
              <p className="font-bold text-slate-800">{customer.name}</p>
              <p className="text-slate-400 text-[11px]">{customer.city} • {customer.totalOrders} Orders</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm(customer.id);
                onClose();
              }}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold text-xs shadow-md shadow-red-600/20 transition-all"
            >
              Confirm Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDeleteModal;
