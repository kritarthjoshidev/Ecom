import React, { useState } from 'react';
import { X, CheckCircle, Truck, CreditCard, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from './Toast';
import { api } from '../services/api';

export const CheckoutModal = ({ isOpen, onClose, onOrderPlaced }) => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    address: '104 Lotus Boulevard',
    city: 'Mumbai',
    postalCode: '400050',
    country: 'India',
    phone: '+91 98765 43210',
  });

  const [paymentMethod, setPaymentMethod] = useState('Cash On Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const estimatedTax = Number((subtotal * 0.05).toFixed(2));
  const shippingCost = subtotal >= 35.0 ? 0.0 : 4.99;
  const estimatedTotal = Number((subtotal + estimatedTax + shippingCost).toFixed(2));

  const handleChange = (e) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!shippingAddress.fullName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.phone) {
      setError('Please fill in all mandatory delivery details');
      return;
    }

    setLoading(true);

    try {
      // Backend validates products, re-fetches prices from DB and calculates final totals
      const orderData = {
        orderItems: items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
      };

      const createdOrder = await api.createOrder(orderData);

      // Trigger celebratory confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      addToast('Order placed successfully! Track its status anytime.', 'success');
      clearCart();
      onClose();
      onOrderPlaced(createdOrder);
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
      addToast(err.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Complete Your Order</h2>
              <p className="text-xs text-slate-500">Fast & contactless checkout — no payment gateway required</p>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            
            {/* Delivery Details */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <Truck className="w-4 h-4 text-emerald-600" />
                Shipping & Delivery Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={shippingAddress.fullName}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="e.g. Jane Doe"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={shippingAddress.phone}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="e.g. +91 98765 43210"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Street Address</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={shippingAddress.address}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="Flat / House No., Apartment, Street Area"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={shippingAddress.city}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="e.g. Mumbai"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Postal / PIN Code</label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={shippingAddress.postalCode}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500"
                    placeholder="e.g. 400050"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Option */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
                <CreditCard className="w-4 h-4 text-emerald-600" />
                Select Payment Mode
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label
                  onClick={() => setPaymentMethod('Cash On Delivery')}
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'Cash On Delivery'
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Cash On Delivery'}
                    onChange={() => setPaymentMethod('Cash On Delivery')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Cash On Delivery</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Pay cash or UPI directly when your fresh items arrive.
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setPaymentMethod('Direct Demo Payment')}
                  className={`p-3.5 rounded-2xl border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'Direct Demo Payment'
                      ? 'border-emerald-600 bg-emerald-50/60'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'Direct Demo Payment'}
                    onChange={() => setPaymentMethod('Direct Demo Payment')}
                    className="mt-1 text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="block text-xs font-bold text-slate-900">Direct Demo Payment</span>
                    <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                      Simulated instant payment clearance for testing.
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* Order Summary Pill */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Sales Tax (5%)</span>
                <span className="font-semibold text-slate-900">${estimatedTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Express Delivery</span>
                <span className="font-semibold">
                  {shippingCost === 0 ? <strong className="text-emerald-600">FREE</strong> : `$${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-slate-900">
                <span>Final Order Amount</span>
                <span className="text-emerald-700 text-base">${estimatedTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Verifying Prices & Creating Order in MongoDB...</span>
                </>
              ) : (
                <>
                  <span>Confirm & Place Order (${estimatedTotal.toFixed(2)})</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Prices verified strictly against trusted database records</span>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
};
