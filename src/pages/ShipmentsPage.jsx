import React from 'react';
import { Package, Plus } from 'lucide-react';

const ShipmentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Shipments Management</h1>
          <p className="text-sm text-slate-500">Module 3: Create, edit, search, and manage parcels</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-sm">
          <Plus className="w-4 h-4" />
          <span>New Shipment</span>
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
        <Package className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
        <h3 className="text-lg font-bold text-slate-900">Shipment Module Ready for Development</h3>
        <p className="text-sm mt-1">Module 1 complete! Tell me when to begin Module 3.</p>
      </div>
    </div>
  );
};

export default ShipmentsPage;
