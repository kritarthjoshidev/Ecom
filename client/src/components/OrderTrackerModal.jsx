import React from 'react';
import { X, Package, Truck, CheckCircle2, Clock, AlertCircle, MapPin, Phone, CreditCard, ChevronRight } from 'lucide-react';

export const OrderTrackerModal = ({ order, onClose }) => {
  if (!order) return null;

  const steps = [
    { key: 'Pending', label: 'Order Placed', desc: 'Order received & waiting confirmation', icon: Clock },
    { key: 'Processing', label: 'Processing', desc: 'Items picked & packed carefully', icon: Package },
    { key: 'Shipped', label: 'In Transit', desc: 'Dispatched with delivery partner', icon: Truck },
    { key: 'Delivered', label: 'Delivered', desc: 'Handed over to recipient', icon: CheckCircle2 }
  ];

  const getStepIndex = (status) => {
    switch (status) {
      case 'Pending': return 0;
      case 'Processing': return 1;
      case 'Shipped': return 2;
      case 'Delivered': return 3;
      case 'Cancelled': return -1;
      default: return 0;
    }
  };

  const currentStep = getStepIndex(order.status);
  const isCancelled = order.status === 'Cancelled';

  const getBadgeColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="p-6 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-extrabold text-slate-900">Order #{order._id.substring(0, 10)}...</h2>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Visual Delivery Stepper (from Dribbble clean tracking dashboard) */}
            {!isCancelled ? (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative">
                  {steps.map((step, idx) => {
                    const StepIcon = step.icon;
                    const isDone = idx <= currentStep;
                    const isCurrent = idx === currentStep;

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition-all shadow-sm ${
                            isCurrent
                              ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 scale-105'
                              : isDone
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-white text-slate-300 border border-slate-200'
                          }`}
                        >
                          <StepIcon className="w-5 h-5" />
                        </div>
                        <h4 className={`text-xs font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </h4>
                        <p className="text-[10px] text-slate-400 max-w-[120px] mt-0.5 hidden sm:block">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 flex items-center gap-3">
                <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-rose-900">Order has been cancelled</h4>
                  <p className="text-xs text-rose-700">This order was cancelled. Any authorized payments will be released.</p>
                </div>
              </div>
            )}

            {/* Address & Payment Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  Delivery Destination
                </span>
                <p className="font-semibold text-slate-800">{order.shippingAddress?.fullName}</p>
                <p className="text-slate-600">{order.shippingAddress?.address}</p>
                <p className="text-slate-600">{order.shippingAddress?.city}, {order.shippingAddress?.postalCode}</p>
                <p className="text-slate-500 flex items-center gap-1 pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  {order.shippingAddress?.phone}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
                <span className="font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  Payment Summary
                </span>
                <p className="text-slate-600">Method: <strong className="text-slate-800">{order.paymentMethod}</strong></p>
                <p className="text-slate-600">
                  Payment Status:{' '}
                  <span className={`font-bold ${order.isPaid ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {order.isPaid ? 'Paid' : 'Pending Payment (On Delivery)'}
                  </span>
                </p>
                <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between text-sm">
                  <span className="font-bold text-slate-800">Total Price</span>
                  <span className="font-extrabold text-emerald-700">${Number(order.totalPrice).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Itemized Products in Order */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 mb-3">Ordered Items ({order.orderItems?.length || 0})</h3>
              <div className="border border-slate-200 rounded-2xl divide-y divide-slate-100 overflow-hidden">
                {order.orderItems?.map((item, index) => (
                  <div key={index} className="p-3.5 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-100 shrink-0"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${Number(item.price).toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-slate-900">
                      ${(item.quantity * item.price).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status History Audit Log */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Order Activity Timeline</h3>
                <div className="space-y-2">
                  {order.statusHistory.map((h, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-slate-800">{h.status}:</span> {h.note || 'Status updated'}
                        <span className="text-[10px] text-slate-400 ml-2">
                          ({new Date(h.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })})
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
};
