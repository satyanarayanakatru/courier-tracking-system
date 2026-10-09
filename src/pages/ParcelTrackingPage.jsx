import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { getShipments, saveShipments } from '../services/shipmentService';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  Clock,
  User,
  Share2,
  Printer,
  Navigation,
  AlertCircle,
  Plus,
  ArrowRight,
  ShieldCheck,
  FileText,
  Building
} from 'lucide-react';
import { toast } from 'react-toastify';

const SAMPLE_TRACKING_NUMBERS = [
  'ST-994201',
  'ST-882194',
  'ST-773019',
  'ST-661928',
  'ST-554812',
  'ST-443701'
];

const getStatusBadgeClass = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'In Transit':
      return 'bg-teal-100 text-teal-800 border-teal-300';
    case 'Out for Delivery':
      return 'bg-indigo-100 text-indigo-800 border-indigo-300';
    case 'Picked Up':
      return 'bg-sky-100 text-sky-800 border-sky-300';
    case 'Cancelled':
      return 'bg-red-100 text-red-800 border-red-300';
    case 'Failed Delivery':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300';
  }
};

const ParcelTrackingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [inputTracking, setInputTracking] = useState('');
  const [currentTracking, setCurrentTracking] = useState('');
  const [shipment, setShipment] = useState(null);
  const [shipmentsList, setShipmentsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // New Checkpoint Note Form
  const [newCheckpointNote, setNewCheckpointNote] = useState('');
  const [newCheckpointLocation, setNewCheckpointLocation] = useState('');

  useEffect(() => {
    loadAllShipments();
  }, []);

  useEffect(() => {
    const queryTrack = searchParams.get('tracking');
    if (queryTrack) {
      setInputTracking(queryTrack);
      performSearch(queryTrack);
    }
  }, [searchParams]);

  const loadAllShipments = async () => {
    const list = await getShipments();
    setShipmentsList(list);
  };

  const performSearch = async (numToSearch) => {
    const target = (numToSearch || inputTracking).trim();
    if (!target) {
      toast.info('Please enter a tracking number to search');
      return;
    }

    setLoading(true);
    setSearched(true);
    setCurrentTracking(target);

    const all = await getShipments();
    setShipmentsList(all);

    const found = all.find(
      (s) => s.trackingNumber.toLowerCase() === target.toLowerCase()
    );

    if (found) {
      setShipment(found);
      // Generate standard timeline if not exists
      if (!found.timeline) {
        found.timeline = generateInitialTimeline(found);
      }
    } else {
      setShipment(null);
    }

    setLoading(false);
  };

  const generateInitialTimeline = (item) => {
    return [
      {
        id: 't-1',
        title: 'Shipment Order Created',
        location: item.pickupAddress,
        timestamp: `${item.shippingDate} 09:00 AM`,
        status: 'Completed',
        description: 'Order details registered in courier system'
      },
      {
        id: 't-2',
        title: 'Package Picked Up',
        location: item.pickupAddress,
        timestamp: `${item.shippingDate} 02:30 PM`,
        status: item.deliveryStatus !== 'Pending' ? 'Completed' : 'Upcoming',
        description: 'Courier driver collected parcel from origin'
      },
      {
        id: 't-3',
        title: 'Arrived at Sorting Hub',
        location: 'Central Logistics Center (Hub A)',
        timestamp: `${item.shippingDate} 07:15 PM`,
        status: ['In Transit', 'Out for Delivery', 'Delivered'].includes(item.deliveryStatus)
          ? 'Completed'
          : 'Upcoming',
        description: 'Barcode scanned and sorted into delivery route'
      },
      {
        id: 't-4',
        title: 'Out for Final Delivery',
        location: item.deliveryAddress,
        timestamp: `${item.expectedDeliveryDate} 08:30 AM`,
        status: ['Out for Delivery', 'Delivered'].includes(item.deliveryStatus)
          ? 'Completed'
          : 'Upcoming',
        description: 'Assigned to driver for doorstep delivery'
      },
      {
        id: 't-5',
        title: 'Successfully Delivered',
        location: item.deliveryAddress,
        timestamp: `${item.expectedDeliveryDate} 02:45 PM`,
        status: item.deliveryStatus === 'Delivered' ? 'Completed' : 'Upcoming',
        description: 'Package handed over to recipient'
      }
    ];
  };

  const handleAddCheckpoint = async (e) => {
    e.preventDefault();
    if (!newCheckpointNote.trim() || !shipment) return;

    const newLog = {
      id: `t-${Date.now()}`,
      title: newCheckpointNote.trim(),
      location: newCheckpointLocation.trim() || 'Regional Logistics Station',
      timestamp: new Date().toLocaleString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'Completed',
      description: 'Manual checkpoint update by Courier Staff'
    };

    const updatedTimeline = [newLog, ...(shipment.timeline || generateInitialTimeline(shipment))];
    const updatedShipment = { ...shipment, timeline: updatedTimeline };

    // Persist
    const all = await getShipments();
    const updatedAll = all.map((s) => (s.id === shipment.id ? updatedShipment : s));
    saveShipments(updatedAll);

    setShipment(updatedShipment);
    setNewCheckpointNote('');
    setNewCheckpointLocation('');
    toast.success('New tracking checkpoint added to parcel timeline!');
  };

  const copyTrackingLink = () => {
    const url = `${window.location.origin}/tracking?tracking=${shipment?.trackingNumber}`;
    navigator.clipboard.writeText(url);
    toast.info(`Shareable tracking link copied for #${shipment?.trackingNumber}!`);
  };

  const statusSteps = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = shipment ? statusSteps.indexOf(shipment.deliveryStatus) : -1;
  const activeStep = currentStepIdx >= 0 ? currentStepIdx : 2;

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* Hero Search Section */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-700 p-8 sm:p-12 text-white shadow-xl overflow-hidden">
        {/* Background Decorative Rings */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-teal-400/10 rounded-full blur-xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-emerald-100 text-xs font-semibold">
            <Compass className="w-4 h-4 text-emerald-300 animate-spin" style={{ animationDuration: '10s' }} />
            <span>Module 5 • Real-Time Satellite GPS Tracker</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Track Your Parcel Live
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            Enter your unique shipment tracking number below to view real-time location, delivery progress, vehicle GPS route, and complete checkpoint history.
          </p>

          {/* Search Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSearchParams({ tracking: inputTracking });
              performSearch();
            }}
            className="mt-6 flex flex-col sm:flex-row items-center gap-3 max-w-2xl mx-auto"
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={inputTracking}
                onChange={(e) => setInputTracking(e.target.value)}
                placeholder="Enter Tracking Number (e.g. ST-994201)"
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-emerald-400/40 shadow-inner transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-950/30 transition-all flex items-center justify-center space-x-2 shrink-0 cursor-pointer"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <span>Track Parcel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Sample Tracking Numbers Quick Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-emerald-200 font-medium">Quick Demo Samples:</span>
            {SAMPLE_TRACKING_NUMBERS.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setInputTracking(num);
                  setSearchParams({ tracking: num });
                  performSearch(num);
                }}
                className="px-3 py-1 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/10 hover:border-white/30"
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-slate-200">
          <Package className="w-12 h-12 animate-bounce mx-auto text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-800">Searching Courier Network...</h3>
          <p className="text-xs text-slate-500">Retrieving satellite tracking details for #{currentTracking}</p>
        </div>
      ) : searched && !shipment ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-red-200 bg-red-50/30 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Shipment Not Found</h3>
            <p className="text-slate-500 text-xs mt-1 max-w-md mx-auto">
              We couldn't find any parcel matching tracking code <strong className="text-slate-900">{currentTracking}</strong>. Please double-check your tracking number or select one of our demo samples above.
            </p>
          </div>
        </div>
      ) : shipment ? (
        <div className="space-y-6">
          {/* Tracking Summary Header Bar */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="p-3.5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl shadow-md">
                <Package className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center space-x-3 flex-wrap gap-y-1">
                  <h2 className="text-2xl font-black text-slate-900">
                    #{shipment.trackingNumber}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadgeClass(
                      shipment.deliveryStatus
                    )}`}
                  >
                    {shipment.deliveryStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {shipment.parcelType} • {shipment.parcelWeight} kg • Expected: {shipment.expectedDeliveryDate}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-start md:self-auto">
              <button
                onClick={copyTrackingLink}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer border border-slate-200"
              >
                <Share2 className="w-4 h-4 text-emerald-600" />
                <span>Copy Link</span>
              </button>

              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer border border-slate-200"
              >
                <Printer className="w-4 h-4 text-slate-600" />
                <span>Print Invoice</span>
              </button>
            </div>
          </div>

          {/* 5-Step Animated Progress Bar */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <Truck className="w-5 h-5 text-emerald-600" />
                <span>Live Delivery Progress Checkpoints</span>
              </h3>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Step {activeStep + 1} of 5 Active
              </span>
            </div>

            <div className="relative py-4 px-2">
              {/* Line track */}
              <div className="absolute top-9 left-[10%] right-[10%] h-2 bg-slate-200 rounded-full z-0" />
              {/* Active line */}
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${(activeStep / (statusSteps.length - 1)) * 80}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="absolute top-9 left-[10%] h-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full z-0 shadow-xs"
              />

              <div className="grid grid-cols-5 gap-2 relative z-10">
                {statusSteps.map((stepName, i) => {
                  const isCompleted = i <= activeStep;
                  const isCurrent = i === activeStep;
                  return (
                    <div key={stepName} className="text-center space-y-2">
                      <div
                        className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                          isCompleted
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white ring-4 ring-emerald-100'
                            : 'bg-white text-slate-400 border-2 border-slate-300'
                        }`}
                      >
                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                      </div>
                      <p
                        className={`text-xs font-extrabold ${
                          isCurrent
                            ? 'text-emerald-700 font-black scale-105'
                            : isCompleted
                            ? 'text-slate-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {stepName}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Grid Layout: Simulated Live Map & Timeline / Add Checkpoint */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Live GPS Route Map & Addresses */}
            <div className="lg:col-span-7 space-y-6">
              {/* GPS Route Map Visualizer Card */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Navigation className="w-4 h-4 text-emerald-600 animate-pulse" />
                    <span>Live GPS Satellite Route Visualizer</span>
                  </h3>
                  <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                    Courier Van #104 Active
                  </span>
                </div>

                <div className="h-64 w-full bg-slate-950 rounded-2xl relative overflow-hidden flex items-center justify-center p-6 border border-slate-800">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:2.5rem_2.5rem] opacity-50" />

                  {/* SVG Route Line */}
                  <svg className="absolute inset-0 w-full h-full stroke-emerald-500/50 fill-none stroke-2 stroke-dashed">
                    <path d="M 60 180 Q 220 50 420 140 T 680 70" />
                  </svg>

                  {/* Origin */}
                  <div className="absolute left-10 bottom-10 text-center">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-2 ring-emerald-500 mx-auto">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-white block mt-1 bg-slate-900/90 px-2 py-0.5 rounded">
                      Origin Hub
                    </span>
                  </div>

                  {/* Vehicle */}
                  <motion.div
                    animate={{ x: [-80, 100, -80] }}
                    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
                    className="absolute left-1/2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-2.5 rounded-2xl shadow-2xl ring-4 ring-emerald-500/30 flex items-center space-x-2"
                  >
                    <Truck className="w-5 h-5" />
                    <span className="text-[10px] font-extrabold">In Transit • 58 mph</span>
                  </motion.div>

                  {/* Destination */}
                  <div className="absolute right-10 top-10 text-center">
                    <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center ring-2 ring-sky-500 mx-auto">
                      <Navigation className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold text-white block mt-1 bg-slate-900/90 px-2 py-0.5 rounded">
                      Destination
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Pickup Location
                    </span>
                    <p className="text-slate-800 font-bold mt-0.5 truncate">
                      {shipment.pickupAddress}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">
                      Delivery Destination
                    </span>
                    <p className="text-slate-800 font-bold mt-0.5 truncate">
                      {shipment.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sender & Receiver Card */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-600" />
                  <span>Sender & Recipient Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Sender</span>
                    <p className="text-sm font-bold text-slate-900">{shipment.senderName}</p>
                    <p className="text-slate-500">{shipment.pickupAddress}</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Recipient</span>
                    <p className="text-sm font-bold text-slate-900">{shipment.receiverName}</p>
                    <p className="text-slate-500">{shipment.deliveryAddress}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Timeline Log & Staff Add Checkpoint */}
            <div className="lg:col-span-5 space-y-6">
              {/* Timeline Card */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Tracking Event History</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-400">
                    {(shipment.timeline || []).length} Checkpoints
                  </span>
                </div>

                {/* Event Logs List */}
                <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 pl-8">
                  {(shipment.timeline || generateInitialTimeline(shipment)).map((item, idx) => (
                    <div key={item.id || idx} className="relative group">
                      <div
                        className={`absolute -left-[30px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          item.status === 'Completed'
                            ? 'bg-emerald-600 border-emerald-600 text-white'
                            : 'bg-white border-slate-300 text-slate-300'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" />
                      </div>

                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-colors">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 text-xs">{item.title}</p>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.timestamp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">{item.description}</p>
                        {item.location && (
                          <p className="text-[10px] text-emerald-700 font-semibold mt-1 flex items-center space-x-1">
                            <MapPin className="w-3 h-3" />
                            <span>{item.location}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Checkpoint Form Card */}
              <div className="glass-card rounded-3xl p-6 border border-slate-200 shadow-sm space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                  <Plus className="w-4 h-4 text-emerald-600" />
                  <span>Update Parcel Checkpoint (Staff)</span>
                </h4>

                <form onSubmit={handleAddCheckpoint} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={newCheckpointNote}
                      onChange={(e) => setNewCheckpointNote(e.target.value)}
                      placeholder="Checkpoint Note (e.g. Arrived at Regional Hub 2)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={newCheckpointLocation}
                      onChange={(e) => setNewCheckpointLocation(e.target.value)}
                      placeholder="Location / Station Name (Optional)"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-emerald-500 bg-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs shadow-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Log Checkpoint Update</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ParcelTrackingPage;
