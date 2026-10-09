import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  getShipments, saveShipments 
} from '../services/shipmentService';
import ShipmentFormModal from '../components/shipments/ShipmentFormModal';
import ShipmentDeleteModal from '../components/shipments/ShipmentDeleteModal';
import { 
  Package, Plus, Search, Filter, ArrowUpDown, Eye, Edit2, Trash2, 
  ChevronLeft, ChevronRight, RefreshCw, CheckCircle2, Truck, Clock, AlertCircle
} from 'lucide-react';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 5;

const getStatusBadgeClass = (status) => {
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

const ShipmentsPage = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter, Sort, Pagination states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [deletingShipment, setDeletingShipment] = useState(null);

  // Load Shipments via API / LocalStorage
  const fetchShipments = async () => {
    setLoading(true);
    try {
      const data = await getShipments();
      setShipments(data);
    } catch (e) {
      toast.error('Failed to load shipments from API');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments();
  }, []);

  // Save changes handler
  const handleSaveShipment = (shipmentData) => {
    let updated;
    const exists = shipments.some((s) => s.id === shipmentData.id);

    if (exists) {
      updated = shipments.map((s) => (s.id === shipmentData.id ? shipmentData : s));
      toast.success(`Shipment #${shipmentData.trackingNumber} updated!`);
    } else {
      updated = [shipmentData, ...shipments];
      toast.success(`Shipment #${shipmentData.trackingNumber} created!`);
    }

    setShipments(updated);
    saveShipments(updated);
  };

  // Delete handler
  const handleDeleteShipment = (id) => {
    const updated = shipments.filter((s) => s.id !== id);
    setShipments(updated);
    saveShipments(updated);
    toast.info('Shipment deleted successfully');
  };

  // Search, Filter, Sort logic
  const filteredShipments = shipments
    .filter((shp) => {
      const matchesSearch = 
        shp.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shp.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shp.receiverName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'All' || shp.parcelType === filterType;
      const matchesStatus = filterStatus === 'All' || shp.deliveryStatus === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.shippingDate) - new Date(a.shippingDate);
      if (sortBy === 'date-asc') return new Date(a.shippingDate) - new Date(b.shippingDate);
      if (sortBy === 'weight-high') return b.parcelWeight - a.parcelWeight;
      if (sortBy === 'weight-low') return a.parcelWeight - b.parcelWeight;
      return 0;
    });

  // Pagination calculation
  const totalPages = Math.ceil(filteredShipments.length / ITEMS_PER_PAGE) || 1;
  const paginatedShipments = filteredShipments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Shipments Management
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Module 3: Create, edit, filter, search, and track all parcels
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={fetchShipments}
            className="p-2.5 rounded-xl glass-input hover:bg-white text-slate-700 font-bold text-sm shadow-xs flex items-center space-x-1.5 cursor-pointer"
            title="Reload from API"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-600' : ''}`} />
            <span className="hidden sm:inline">Reload</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              setEditingShipment(null);
              setIsFormOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 flex items-center space-x-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Shipment</span>
          </motion.button>
        </div>
      </div>

      {/* Controls Bar: Search, Type Filter, Status Filter, Sort */}
      <div className="glass-card p-4 rounded-2xl space-y-3 lg:space-y-0 lg:flex lg:items-center lg:justify-between lg:gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by tracking #, sender, or receiver..."
            className="w-full glass-input rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Filter Parcel Type */}
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setCurrentPage(1);
            }}
            className="glass-input rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="All">All Parcel Types</option>
            <option value="Standard Parcel">Standard Parcel</option>
            <option value="Document Express">Document Express</option>
            <option value="Heavy Freight">Heavy Freight</option>
            <option value="Fragile Cargo">Fragile Cargo</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => {
              setFilterStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="glass-input rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Picked Up">Picked Up</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Failed Delivery">Failed Delivery</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="glass-input rounded-xl px-3 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="weight-high">Weight: High to Low</option>
            <option value="weight-low">Weight: Low to High</option>
          </select>
        </div>
      </div>

      {/* Table / List Container */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-emerald-600" />
            <p className="text-xs font-bold">Loading shipments dataset...</p>
          </div>
        ) : paginatedShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Package className="w-12 h-12 mx-auto text-emerald-600 opacity-60" />
            <h3 className="text-base font-black text-slate-800">No Shipments Found</h3>
            <p className="text-xs max-w-sm mx-auto">
              No shipments match your search or filter criteria.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('All');
                setFilterStatus('All');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700 transition-colors cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100/70 text-slate-500 font-black uppercase tracking-wider border-b border-slate-200/80">
                  <th className="py-3.5 px-4">Tracking #</th>
                  <th className="py-3.5 px-4">Sender → Receiver</th>
                  <th className="py-3.5 px-4">Parcel Type</th>
                  <th className="py-3.5 px-4">Weight</th>
                  <th className="py-3.5 px-4">Ship Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedShipments.map((shp) => (
                  <motion.tr
                    key={shp.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-emerald-50/40 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-black text-emerald-900">
                      <Link 
                        to={`/shipments/details/${shp.trackingNumber}`}
                        className="hover:underline hover:text-emerald-600 flex items-center space-x-1"
                      >
                        <span>{shp.trackingNumber}</span>
                      </Link>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900">{shp.senderName}</div>
                      <div className="text-[11px] text-slate-400">→ {shp.receiverName}</div>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-700">
                      {shp.parcelType}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {shp.parcelWeight} kg
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-600">
                      {shp.shippingDate}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadgeClass(shp.deliveryStatus)}`}>
                        {shp.deliveryStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => navigate(`/shipments/details/${shp.trackingNumber}`)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                          title="View Dedicated Tracking Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingShipment(shp);
                            setIsFormOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                          title="Edit Shipment"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeletingShipment(shp)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Shipment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-bold">
          <span>
            Showing page {currentPage} of {totalPages} ({filteredShipments.length} total shipments)
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl glass-input hover:bg-white disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl glass-input hover:bg-white disabled:opacity-40 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ShipmentFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingShipment(null);
        }}
        onSubmit={handleSaveShipment}
        initialData={editingShipment}
      />

      <ShipmentDeleteModal
        shipment={deletingShipment}
        isOpen={!!deletingShipment}
        onClose={() => setDeletingShipment(null)}
        onConfirm={handleDeleteShipment}
      />
    </div>
  );
};

export default ShipmentsPage;
