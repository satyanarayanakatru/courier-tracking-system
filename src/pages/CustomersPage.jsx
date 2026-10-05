import React from 'react';
import { Users } from 'lucide-react';

const CustomersPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Customer Management</h1>
    <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 shadow-xs">
      <Users className="w-12 h-12 mx-auto text-indigo-600 mb-3" />
      <h3 className="text-lg font-bold text-slate-900">Customer Module Placeholder</h3>
    </div>
  </div>
);

export default CustomersPage;
