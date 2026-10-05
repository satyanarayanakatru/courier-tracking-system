import React from 'react';
import { Users } from 'lucide-react';

const CustomersPage = () => (
  <div className="space-y-6">
    <h1 className="text-2xl font-bold text-white">Customer Management</h1>
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
      <Users className="w-12 h-12 mx-auto text-indigo-400 mb-3" />
      <h3 className="text-lg font-semibold text-white">Customer Module Placeholder</h3>
    </div>
  </div>
);

export default CustomersPage;
