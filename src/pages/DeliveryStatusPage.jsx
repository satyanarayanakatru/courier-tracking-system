import React, { useState, useEffect, useMemo } from 'react';
import { getShipments, saveShipments } from '../services/shipmentService';
import { toast } from 'react-toastify';
import {
  CheckCircle2,
  Clock,
  Truck,
  Package,
  AlertTriangle,
  XCircle,
  Search,
  Filter,
  CheckSquare,
  Square,
  ArrowRight,
  RefreshCw,
  Eye,
  History,
  ShieldCheck,
  UserCheck,
  Building
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const STATUS_OPTIONS = [
  'Pending',
  'Picked Up',
  'In Transit',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Failed Delivery'
];

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'In Transit':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'Out for Delivery':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Picked Up':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'Pending':
      return 'bg-amber-100 text-amber-800 border-amber-300';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Failed Delivery':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const DeliveryStatusPage = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('All');

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkStatus, setBulkStatus] = useState('In Transit');

  // Activity Log
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    loadShipments();
  }, []);

  const loadShipments = async () => {
    setLoading(true);
    try {
      const data = await getShipments();
      setShipments(data);
    } catch (e) {
      toast.error('Failed to load shipment data');
    } finally {
      setLoading(false);
    }
  };

  // Status stats counter
  const stats = useMemo(() => {
    return {
      total: shipments.length,
      pending: shipments.filter((s) => s.deliveryStatus === 'Pending').length,
      pickedUp: shipments.filter((s) => s.deliveryStatus === 'Picked Up').length,
      inTransit: shipments.filter((s) => s.deliveryStatus === 'In Transit').length,
      outForDelivery: shipments.filter((s) => s.deliveryStatus === 'Out for Delivery').length,
      delivered: shipments.filter((s) => s.deliveryStatus === 'Delivered').length,
      exceptions: shipments.filter((s) =>
        ['Cancelled', 'Failed Delivery'].includes(s.deliveryStatus)
      ).length
    };
  }, [shipments]);

  // Filtered shipments
  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const matchesSearch =
        s.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.senderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.receiverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.parcelType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTab =
        selectedTab === 'All'
          ? true
          : selectedTab === 'Exceptions'
          ? ['Cancelled', 'Failed Delivery'].includes(s.deliveryStatus)
          : s.deliveryStatus === selectedTab;

      return matchesSearch && matchesTab;
    });
  }, [shipments, searchQuery, selectedTab]);

  // Single status change
  const handleSingleStatusChange = (shipmentId, newStatus) => {
    const target = shipments.find((s) => s.id === shipmentId);
    if (!target) return;

    const oldStatus = target.deliveryStatus;
    if (oldStatus === newStatus) return;

    const updated = shipments.map((s) =>
      s.id === shipmentId ? { ...s, deliveryStatus: newStatus } : s
    );

    setShipments(updated);
    saveShipments(updated);

    // Record activity log
    const logEntry = {
      id: `log-${Date.now()}`,
      trackingNumber: target.trackingNumber,
      from: oldStatus,
      to: newStatus,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setActivityLogs((prev) => [logEntry, ...prev]);

    toast.success(`Tracking #${target.trackingNumber} status updated to '${newStatus}'`);
  };

  // Bulk status update
  const handleBulkStatusChange = () => {
    if (selectedIds.length === 0) return;

    const updated = shipments.map((s) =>
      selectedIds.includes(s.id) ? { ...s, deliveryStatus: bulkStatus } : s
    );

    setShipments(updated);
    saveShipments(updated);

    toast.success(
      `Successfully updated ${selectedIds.length} parcels to '${bulkStatus}' status!`
    );
    setSelectedIds([]);
  };

  // Select all toggle
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredShipments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredShipments.map((s) => s.id));
    }
  };

  const toggleSelectOne = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div>
          <div className="flex items-center space-x-2 text-emerald-600 font-semibold text-xs uppercase tracking-wider mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span>Module 6 • Status Lifecycle Control</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Delivery Status Management
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Monitor, filter, update status transitions, and bulk manage courier parcel lifecycles
          </p>
        </div>

        <button
          onClick={loadShipments}
          className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs shadow-xs transition-colors flex items-center space-x-2 self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-4 h-4 text-emerald-600" />
          <span>Refresh Statuses</span>
        </button>
      </div>

      {/* Quick Stat Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div
          onClick={() => setSelectedTab('All')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTab === 'All'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'glass-card text-slate-800 border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block opacity-70">
            Total Parcels
          </span>
          <p className="text-2xl font-black mt-1">{stats.total}</p>
        </div>

        <div
          onClick={() => setSelectedTab('Pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTab === 'Pending'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'glass-card text-slate-800 border-slate-200 hover:border-amber-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-amber-600">
            Pending
          </span>
          <p className="text-2xl font-black text-amber-700 mt-1">{stats.pending}</p>
        </div>

        <div
          onClick={() => setSelectedTab('In Transit')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTab === 'In Transit'
              ? 'bg-teal-600 text-white border-teal-600 shadow-md'
              : 'glass-card text-slate-800 border-slate-200 hover:border-teal-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-teal-600">
            In Transit
          </span>
          <p className="text-2xl font-black text-teal-700 mt-1">{stats.inTransit}</p>
        </div>

        <div
          onClick={() => setSelectedTab('Out for Delivery')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTab === 'Out for Delivery'
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
              : 'glass-card text-slate-800 border-slate-200 hover:border-indigo-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-indigo-600">
            Out for Delivery
          </span>
          <p className="text-2xl font-black text-indigo-700 mt-1">{stats.outForDelivery}</p>
        </div>

        <div
          onClick={() => setSelectedTab('Delivered')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTab === 'Delivered'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'glass-card text-slate-800 border-slate-200 hover:border-emerald-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-emerald-600">
            Delivered
          </span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{stats.delivered}</p>
        </div>

        <div
          onClick={() => setSelectedTab('Exceptions')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTab === 'Exceptions'
              ? 'bg-red-600 text-white border-red-600 shadow-md'
              : 'glass-card text-slate-800 border-slate-200 hover:border-red-300'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider block text-red-600">
            Cancelled/Failed
          </span>
          <p className="text-2xl font-black text-red-700 mt-1">{stats.exceptions}</p>
        </div>
      </div>

      {/* Filter Tabs & Bulk Action Controls */}
      <div className="glass-card rounded-2xl p-4 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search status by tracking number, sender or recipient..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 bg-white"
            />
          </div>

          {/* Status Tabs Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
            {['All', ...STATUS_OPTIONS, 'Exceptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTab === tab
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Bulk Actions Banner */}
        {selectedIds.length > 0 && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-emerald-900">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              <span>{selectedIds.length} parcel(s) selected for bulk status change</span>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-slate-600">Set Status To:</span>
              <select
                value={bulkStatus}
                onChange={(e) => setBulkStatus(e.target.value)}
                className="py-1.5 px-3 rounded-xl border border-emerald-300 bg-white text-xs font-bold text-slate-800 focus:outline-none"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>

              <button
                onClick={handleBulkStatusChange}
                className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                Apply Bulk Change
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Table View */}
      <div className="glass-card rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold space-y-3">
            <Package className="w-10 h-10 animate-bounce mx-auto text-emerald-600" />
            <p className="text-xs">Loading delivery status dashboard...</p>
          </div>
        ) : filteredShipments.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No Parcels Match Criteria</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search query or status tab selection.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4 w-10 text-center">
                    <button
                      onClick={toggleSelectAll}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {selectedIds.length === filteredShipments.length &&
                      filteredShipments.length > 0 ? (
                        <CheckSquare className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Square className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="p-4">Tracking Code</th>
                  <th className="p-4">Sender & Recipient</th>
                  <th className="p-4">Parcel Info</th>
                  <th className="p-4">Current Status Badge</th>
                  <th className="p-4">Update Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map((shp) => {
                  const isSelected = selectedIds.includes(shp.id);
                  return (
                    <tr
                      key={shp.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? 'bg-emerald-50/40' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleSelectOne(shp.id)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      <td className="p-4">
                        <p className="font-extrabold text-slate-900 text-sm">
                          {shp.trackingNumber}
                        </p>
                        <p className="text-[11px] text-slate-400">Date: {shp.shippingDate}</p>
                      </td>

                      <td className="p-4 space-y-0.5">
                        <p className="font-bold text-slate-800">
                          {shp.senderName} &rarr; {shp.receiverName}
                        </p>
                        <p className="text-slate-400 text-[11px] truncate max-w-[200px]">
                          {shp.deliveryAddress}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-semibold text-slate-800">{shp.parcelType}</p>
                        <p className="text-slate-400 text-[11px]">{shp.parcelWeight} kg</p>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(
                            shp.deliveryStatus
                          )}`}
                        >
                          {shp.deliveryStatus}
                        </span>
                      </td>

                      <td className="p-4">
                        <select
                          value={shp.deliveryStatus}
                          onChange={(e) => handleSingleStatusChange(shp.id, e.target.value)}
                          className="py-1.5 px-3 rounded-xl border border-slate-300 bg-white font-bold text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => navigate(`/shipments/details/${shp.trackingNumber}`)}
                          className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors inline-flex items-center space-x-1 font-semibold"
                          title="View Live Satellite GPS Tracker"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Activity Transition History Log */}
      {activityLogs.length > 0 && (
        <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-2">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Session Status Change Audit History</span>
          </h3>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {activityLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-slate-900">#{log.trackingNumber}</span>
                  <span className="text-slate-400">status changed from</span>
                  <span className="font-bold text-slate-600">{log.from}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-extrabold text-emerald-700">{log.to}</span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryStatusPage;
