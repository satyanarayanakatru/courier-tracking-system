import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import {
  Users,
  Search,
  Filter,
  Plus,
  LayoutGrid,
  List,
  Mail,
  Phone,
  MapPin,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Building,
  PackageCheck
} from 'lucide-react';
import { getCustomers, saveCustomers } from '../services/customerService';
import { getShipments } from '../services/shipmentService';
import CustomerFormModal from '../components/customers/CustomerFormModal';
import CustomerProfileModal from '../components/customers/CustomerProfileModal';
import CustomerDeleteModal from '../components/customers/CustomerDeleteModal';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [currentPage, setCurrentPage] = useState(1);

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [customerData, shipmentData] = await Promise.all([
        getCustomers(),
        getShipments()
      ]);
      setCustomers(customerData);
      setShipments(shipmentData);
    } catch (e) {
      toast.error('Failed to load customer records');
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for filter dropdown
  const cities = useMemo(() => {
    const list = customers.map((c) => c.city).filter(Boolean);
    return ['All', ...Array.from(new Set(list))];
  }, [customers]);

  // Filter & Sort Logic
  const filteredCustomers = useMemo(() => {
    return customers
      .filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.mobileNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.postalCode.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCity = selectedCity === 'All' || c.city === selectedCity;

        return matchesSearch && matchesCity;
      })
      .sort((a, b) => {
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
        if (sortBy === 'orders-desc') return (b.totalOrders || 0) - (a.totalOrders || 0);
        if (sortBy === 'orders-asc') return (a.totalOrders || 0) - (b.totalOrders || 0);
        return 0;
      });
  }, [customers, searchQuery, selectedCity, sortBy]);

  // Pagination calculation
  const itemsPerPage = viewMode === 'grid' ? 6 : 5;
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage) || 1;
  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCustomers.slice(start, start + itemsPerPage);
  }, [filteredCustomers, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, sortBy, viewMode]);

  // Handlers
  const handleCreateOrUpdateCustomer = async (formData) => {
    if (selectedCustomer && selectedCustomer.id) {
      // Edit
      const updated = customers.map((c) =>
        c.id === selectedCustomer.id ? { ...c, ...formData } : c
      );
      setCustomers(updated);
      saveCustomers(updated);
      toast.success(`Customer "${formData.name}" updated successfully!`);
    } else {
      // Create
      const newCustomer = {
        id: `cust-${Date.now().toString().slice(-4)}`,
        ...formData,
        totalOrders: 0,
        avatar: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 100000)}?w=150&auto=format&fit=crop&q=80`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      const updated = [newCustomer, ...customers];
      setCustomers(updated);
      saveCustomers(updated);
      toast.success(`New customer "${formData.name}" added successfully!`);
    }
  };

  const handleDeleteCustomer = (id) => {
    const updated = customers.filter((c) => c.id !== id);
    setCustomers(updated);
    saveCustomers(updated);
    toast.success('Customer profile deleted successfully');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Module 4 • Client Database</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Customer Directory
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Manage courier clients, shipping contacts, address books & order history
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedCustomer(null);
            setIsFormOpen(true);
          }}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center space-x-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Controls Header: Search, Filters, View Switch */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by customer name, email, phone, city..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
          />
        </div>

        {/* Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-3">
          {/* City Filter */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <Building className="w-4 h-4 text-slate-400" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city === 'All' ? 'All Cities' : city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-600">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="orders-desc">Orders (High to Low)</option>
              <option value="orders-asc">Orders (Low to High)</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'table'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="glass-card rounded-3xl p-6 border border-slate-200 space-y-4 animate-pulse"
            >
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded-md w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-md w-1/2" />
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Customers Found</h3>
          <p className="text-slate-500 text-xs mt-1">
            Try resetting your search query or city filters.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCustomers.map((cust) => (
            <div
              key={cust.id}
              className="glass-card rounded-3xl p-6 border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="space-y-4">
                {/* Header with Avatar & Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <img
                      src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt={cust.name}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/20 group-hover:scale-105 transition-transform"
                    />
                    <div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                        {cust.name}
                      </h3>
                      <span className="inline-block mt-0.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {cust.city}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-100">
                      {cust.totalOrders} Orders
                    </span>
                  </div>
                </div>

                {/* Contact & Address List */}
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-slate-600 truncate">
                    <Mail className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{cust.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{cust.mobileNumber}</span>
                  </div>
                  <div className="flex items-start space-x-2 text-slate-600 line-clamp-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      {cust.address}, {cust.city} {cust.postalCode}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedCustomer(cust);
                    setIsProfileOpen(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-semibold transition-colors flex items-center space-x-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Profile</span>
                </button>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => {
                      setSelectedCustomer(cust);
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                    title="Edit Customer"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCustomer(cust);
                      setIsDeleteOpen(true);
                    }}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Customer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact Info</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-center">Total Orders</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedCustomers.map((cust) => (
                  <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <img
                          src={cust.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                          alt={cust.name}
                          className="w-10 h-10 rounded-xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{cust.name}</p>
                          <p className="text-[11px] text-slate-400">ID: {cust.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 space-y-0.5">
                      <p className="font-semibold text-slate-800">{cust.email}</p>
                      <p className="text-slate-400 text-[11px]">{cust.mobileNumber}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-semibold text-slate-800">{cust.city}</p>
                      <p className="text-slate-400 text-[11px] truncate max-w-[180px]">
                        {cust.address} ({cust.postalCode})
                      </p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-block bg-emerald-100 text-emerald-800 font-extrabold px-3 py-1 rounded-xl text-xs">
                        {cust.totalOrders}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsProfileOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsDeleteOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && filteredCustomers.length > 0 && (
        <div className="glass-card rounded-2xl p-4 border border-slate-200 shadow-xs flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{(currentPage - 1) * itemsPerPage + 1}</strong> to{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredCustomers.length)}
            </strong>{' '}
            of <strong className="text-slate-800">{filteredCustomers.length}</strong> customers
          </p>

          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-bold text-slate-700 px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modals */}
      <CustomerFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOrUpdateCustomer}
        initialData={selectedCustomer}
      />

      <CustomerProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        customer={selectedCustomer}
        shipments={shipments}
      />

      <CustomerDeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteCustomer}
        customer={selectedCustomer}
      />
    </div>
  );
};

export default CustomersPage;
