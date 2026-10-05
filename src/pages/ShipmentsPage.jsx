import React from 'react';
import { Package, Plus } from 'lucide-react';

const ShipmentsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Shipments Management</h1>
          <p className="text-sm text-slate-400">Module 3: Create, edit, search, and manage parcels</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm">
          <Plus className="w-4 h-4" />
          <span>New Shipment</span>
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <Package className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
        <h3 className="text-lg font-semibold text-white">Shipment Module Ready for Development</h3>
        <p className="text-sm mt-1">Module 1 is complete! Request Module 3 anytime to activate DummyJSON / MockAPI shipment creation and filters.</p>
      </div>
    </div>
  );
};

export default ShipmentsPage;
