import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Eye, Clock, CheckCircle2, AlertCircle, ShoppingBag, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { OrderTrackerModal } from '../components/OrderTrackerModal';

export const MyOrdersPage = ({ onExploreStore }) => {
  const { isAuthenticated, openAuth } = useAuth();
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchMyOrders = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await api.getMyOrders();
      setOrders(data || []);
    } catch (err) {
      addToast(err.message || 'Failed to load your orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrders();
  }, [isAuthenticated]);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Delivered': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Cancelled': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center animate-fade-in">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Package className="w-8 h-8 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Track Your FreshMart Orders</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          Sign in to view your real-time order history, tracking progress, and delivery invoices.
        </p>
        <button
          onClick={() => openAuth('login')}
          className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
        >
          Sign In to Your Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Order History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time status updates and receipts for your farm-fresh deliveries
          </p>
        </div>

        <button
          onClick={onExploreStore}
          className="self-start sm:self-auto flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-sm transition-all"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-600" />
          <span>Continue Shopping</span>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100 animate-pulse space-y-4">
              <div className="h-5 bg-slate-100 rounded w-1/4" />
              <div className="h-16 bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No orders placed yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            When you place orders for fresh organic produce, you can track their preparation and transit here!
          </p>
          <button
            onClick={onExploreStore}
            className="px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
          >
            Explore Fresh Groceries
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-sm hover:shadow-card transition-all"
            >
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">
                      Order #{order._id.substring(0, 10)}...
                    </h3>
                    <p className="text-xs text-slate-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusBadge(order.status)}`}>
                    {order.status}
                  </span>

                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Track Order</span>
                  </button>
                </div>
              </div>

              {/* Items Thumbnails & Price summary */}
              <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {order.orderItems?.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="relative group shrink-0">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-100 bg-slate-50"
                        title={item.name}
                      />
                      <span className="absolute -top-1.5 -right-1.5 bg-slate-800 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                        {item.quantity}
                      </span>
                    </div>
                  ))}
                  {order.orderItems?.length > 4 && (
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
                      +{order.orderItems.length - 4}
                    </div>
                  )}
                </div>

                <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
                  <span className="text-xs text-slate-400 block">Total Amount</span>
                  <span className="text-lg font-extrabold text-emerald-700">
                    ${Number(order.totalPrice).toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-400 block">
                    {order.paymentMethod}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* Tracker Modal */}
      {selectedOrder && (
        <OrderTrackerModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

    </div>
  );
};
