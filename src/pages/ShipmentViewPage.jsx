import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getShipments, saveShipments } from '../services/shipmentService';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Package, Truck, MapPin, CheckCircle2, Clock, User, 
  Weight, Calendar, Share2, Printer, Navigation, AlertCircle, ShieldCheck 
} from 'lucide-react';
import { toast } from 'react-toastify';

const getStatusBadge = (status) => {
  switch (status) {
    case 'Delivered':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'In Transit':
      return 'bg-amber-100 text-amber-800 border-amber-300';
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

const ShipmentViewPage = () => {
  const { trackingNumber } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadShipment = async () => {
      setLoading(true);
      const all = await getShipments();
      const found = all.find(
        (s) => s.trackingNumber.toLowerCase() === trackingNumber.toLowerCase()
      );
      if (found) {
        setShipment(found);
      } else {
        toast.error(`Shipment #${trackingNumber} not found.`);
      }
      setLoading(false);
    };
    loadShipment();
  }, [trackingNumber]);

  const handleStatusChange = async (newStatus) => {
    if (!shipment) return;
    const all = await getShipments();
    const updatedAll = all.map((s) =>
      s.id === shipment.id ? { ...s, deliveryStatus: newStatus } : s
    );
    saveShipments(updatedAll);
    setShipment((prev) => ({ ...prev, deliveryStatus: newStatus }));
    toast.success(`Shipment #${shipment.trackingNumber} status updated to '${newStatus}'!`);
  };

  const copyTrackingLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.info('Tracking link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-bold space-y-3">
        <Package className="w-10 h-10 animate-bounce mx-auto text-emerald-600" />
        <p className="text-sm">Loading live parcel tracking details...</p>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="p-12 text-center space-y-4">
        <AlertCircle className="w-12 h-12 mx-auto text-red-500" />
        <h2 className="text-xl font-black text-slate-900">Shipment Not Found</h2>
        <p className="text-xs text-slate-500">No parcel matches tracking number: {trackingNumber}</p>
        <Link
          to="/shipments"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-emerald-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shipments</span>
        </Link>
      </div>
    );
  }

  // Calculate timeline active step index
  const statusSteps = ['Pending', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered'];
  const currentStepIdx = statusSteps.indexOf(shipment.deliveryStatus);
  const activeStep = currentStepIdx >= 0 ? currentStepIdx : 2;

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/shipments')}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Shipment #{shipment.trackingNumber}
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-black border ${getStatusBadge(shipment.deliveryStatus)}`}>
                {shipment.deliveryStatus}
              </span>
            </div>
            <p className="text-xs text-slate-500 font-semibold">Real-Time Satellite GPS Parcel Tracking View</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={copyTrackingLink}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-emerald-600" />
            <span>Copy Link</span>
          </button>
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-xs hover:bg-slate-50 transition-colors flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print Label</span>
          </button>
        </div>
      </div>

      {/* Real-Time Live Status Timeline */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              Real-Time Tracking Progress
            </h3>
            <p className="text-xs text-slate-500">Live SLA status & checkpoint updates</p>
          </div>

          {/* Status Changer */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="font-bold text-slate-600">Update Status:</span>
            <select
              value={shipment.deliveryStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600/20"
            >
              <option value="Pending">Pending</option>
              <option value="Picked Up">Picked Up</option>
              <option value="In Transit">In Transit</option>
              <option value="Out for Delivery">Out for Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Failed Delivery">Failed Delivery</option>
            </select>
          </div>
        </div>

        {/* 5-Step Animated Progress Bar with Connected Green Line */}
        <div className="relative py-4 px-2">
          {/* Background Track Line */}
          <div className="absolute top-9 left-[10%] right-[10%] h-2 bg-slate-200 rounded-full z-0" />

          {/* Active Green Progress Line */}
          <motion.div 
            initial={{ width: '0%' }}
            animate={{ width: `${(activeStep / (statusSteps.length - 1)) * 80}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute top-9 left-[10%] h-2 bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-400 rounded-full z-0 shadow-sm"
          />

          {/* 5-Step Circles */}
          <div className="grid grid-cols-5 gap-2 relative z-10">
            {statusSteps.map((stepName, i) => {
              const isCompleted = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={stepName} className="text-center space-y-2">
                  <div className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold text-xs shadow-md transition-all ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                      : 'bg-white text-slate-400 border-2 border-slate-300'
                  }`}>
                    {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                  </div>
                  <p className={`text-xs font-extrabold ${isCurrent ? 'text-emerald-700 font-black' : isCompleted ? 'text-slate-800' : 'text-slate-400'}`}>
                    {stepName}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Simulated Live GPS Map Visualizer & Address Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live GPS Route Visualizer Map */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-600 animate-pulse" />
              Live Vehicle Route Map
            </h3>
            <span className="text-[11px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
              GPS Active • 62 mph
            </span>
          </div>

          {/* Graphic Simulated Map Canvas */}
          <div className="h-64 w-full bg-slate-900 rounded-2xl relative overflow-hidden flex items-center justify-center p-6 border border-slate-800">
            {/* Map Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-40" />

            {/* Simulated Animated Flight Path Line */}
            <svg className="absolute inset-0 w-full h-full stroke-emerald-500/40 fill-none stroke-2 stroke-dashed">
              <path d="M 50 180 Q 200 40 400 130 T 650 80" />
            </svg>

            {/* Location Pins */}
            <div className="absolute left-10 bottom-12 text-center">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center ring-2 ring-emerald-500 mx-auto">
                <MapPin className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-white block mt-1 bg-slate-950/80 px-2 py-0.5 rounded">Origin Hub</span>
            </div>

            {/* Vehicle Icon moving */}
            <motion.div 
              animate={{ x: [0, 180, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute left-1/3 top-1/2 -translate-y-1/2 bg-emerald-600 text-white p-2.5 rounded-2xl shadow-xl ring-4 ring-emerald-500/30 flex items-center gap-1.5"
            >
              <Truck className="w-5 h-5" />
              <span className="text-[10px] font-bold">Courier Unit #42</span>
            </motion.div>

            <div className="absolute right-10 top-12 text-center">
              <div className="w-8 h-8 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center ring-2 ring-sky-500 mx-auto">
                <Navigation className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-bold text-white block mt-1 bg-slate-950/80 px-2 py-0.5 rounded">Destination</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs pt-1">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Current Location</span>
              <p className="text-slate-900 font-black mt-0.5">Highway Express Depot (Zone 4)</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Estimated SLA Arrival</span>
              <p className="text-emerald-700 font-black mt-0.5">{shipment.expectedDeliveryDate}</p>
            </div>
          </div>
        </div>

        {/* Parcel Details & Addresses */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              Sender & Destination Details
            </h3>

            {/* Sender */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Sender Name</p>
              <p className="text-sm font-black text-slate-900">{shipment.senderName}</p>
              <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{shipment.pickupAddress}</span>
              </p>
            </div>

            {/* Receiver */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Receiver Name</p>
              <p className="text-sm font-black text-slate-900">{shipment.receiverName}</p>
              <p className="text-xs text-slate-500 flex items-start gap-1 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{shipment.deliveryAddress}</span>
              </p>
            </div>

            {/* Parcel Specs */}
            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Parcel Weight</span>
                <p className="text-sm font-black text-slate-900 mt-0.5">{shipment.parcelWeight} kg</p>
              </div>
              <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-100">
                <span className="text-slate-500 font-bold uppercase text-[10px]">Parcel Category</span>
                <p className="text-xs font-black text-slate-900 mt-0.5">{shipment.parcelType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShipmentViewPage;
