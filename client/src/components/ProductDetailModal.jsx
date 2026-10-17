import React, { useState } from 'react';
import { X, Star, Plus, Minus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart } = useCart();
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    addToast(`Added ${quantity} × "${product.name}" to your cart!`);
    onClose();
  };

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-fade-in">
          
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            
            {/* Product Image */}
            <div className="relative bg-slate-100 aspect-square md:aspect-auto flex items-center justify-center overflow-hidden">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <span className="absolute bottom-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white/90 backdrop-blur-sm text-slate-800 shadow-sm">
                {product.category}
              </span>
            </div>

            {/* Product Info */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div>
                {/* Rating & Stock */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-800">{product.rating || '4.8'}</span>
                    <span className="text-xs text-slate-400">({product.numReviews || 12} reviews)</span>
                  </div>

                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    product.stock > 5 ? 'bg-emerald-50 text-emerald-700' :
                    product.stock > 0 ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight mb-2">
                  {product.name}
                </h2>

                {/* Price */}
                <div className="mb-4">
                  <span className="text-2xl md:text-3xl font-extrabold text-emerald-600">
                    ${Number(product.price).toFixed(2)}
                  </span>
                  <span className="text-xs text-slate-400 ml-1.5">/ unit</span>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Guarantees */}
                <div className="space-y-2 py-3 border-y border-slate-100 mb-6">
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    <span>Free express delivery on orders over $35</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Guaranteed farm-fresh & 100% quality checked</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-slate-600">
                    <RefreshCw className="w-4 h-4 text-emerald-600" />
                    <span>Hassle-free return & instant replacement policy</span>
                  </div>
                </div>
              </div>

              {/* Quantity selector and Add to Cart */}
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 rounded-2xl p-1 bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-bold text-sm select-none">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-600 hover:bg-white disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all active:scale-98"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Currently Unavailable' : 'Add to Cart'}</span>
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
