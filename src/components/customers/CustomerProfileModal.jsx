import React from 'react';
import { X, Mail, Phone, MapPin, Package, Calendar, Award, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CustomerProfileModal = ({ isOpen, onClose, customer, shipments = [] }) => {
  const navigate = useNavigate();

  if (!isOpen || !customer) return null;

  // Find related shipments where customer is sender or receiver
  const customerShipments = shipments.filter(
    (s) =>
      s.senderName?.toLowerCase().includes(customer.name.toLowerCase()) ||
      s.receiverName?.toLowerCase().includes(customer.name.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Banner Header */}
        <div className="relative h-32 bg-gradient-to-r from-emerald-800 via-emerald-600 to-teal-600 p-6 flex justify-between items-start">
          <span className="inline-flex items-center space-x-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-medium">
            <Award className="w-3.5 h-3.5 text-emerald-300" />
            <span>ID: {customer.id}</span>
          </span>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-4 sm:space-y-0 sm:space-x-5 -mt-14 mb-6">
            <img
              src={customer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={customer.name}
              className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg object-cover bg-white"
            />
            <div className="text-center sm:text-left flex-1">
              <h2 className="text-2xl font-bold text-slate-900">{customer.name}</h2>
              <p className="text-slate-500 text-xs flex items-center justify-center sm:justify-start space-x-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{customer.city}, Postal: {customer.postalCode}</span>
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl text-center">
              <span className="block text-2xl font-extrabold text-emerald-700">
                {customer.totalOrders}
              </span>
              <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">
                Total Orders
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start space-x-3">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Email Address</p>
                <p className="text-xs font-semibold text-slate-800 break-all">{customer.email}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start space-x-3">
              <div className="p-2 bg-teal-100 rounded-xl text-teal-700">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Mobile Phone</p>
                <p className="text-xs font-semibold text-slate-800">{customer.mobileNumber}</p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 flex items-start space-x-3 sm:col-span-2">
              <div className="p-2 bg-emerald-100 rounded-xl text-emerald-700">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-semibold text-slate-400">Full Shipping Address</p>
                <p className="text-xs font-semibold text-slate-800">
                  {customer.address}, {customer.city} {customer.postalCode}
                </p>
              </div>
            </div>
          </div>

          {/* Related Shipments Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between">
              <span>Associated Shipments ({customerShipments.length})</span>
              <span className="text-slate-400 font-normal normal-case">Recent Activity</span>
            </h3>

            {customerShipments.length === 0 ? (
              <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-6 text-center text-slate-400 text-xs">
                <Package className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                No active shipments currently linked to this customer.
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {customerShipments.map((shp) => (
                  <div
                    key={shp.id}
                    className="p-3 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between transition-all text-xs"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 flex items-center space-x-2">
                          <span>{shp.trackingNumber}</span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                            {shp.deliveryStatus}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {shp.senderName} &rarr; {shp.receiverName} ({shp.parcelWeight} kg)
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        onClose();
                        navigate(`/shipments/details/${shp.trackingNumber}`);
                      }}
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors flex items-center space-x-1 text-xs font-semibold"
                    >
                      <span>Track</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileModal;
