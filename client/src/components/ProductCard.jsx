import React from 'react';
import { Star, Plus, Minus, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from './Toast';

export const ProductCard = ({ product, onQuickView }) => {
  const { items, addToCart, updateQuantity } = useCart();
  const { addToast } = useToast();

  const cartItem = items.find((item) => item.product === product._id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;
  const isOutOfStock = product.stock <= 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product, 1);
    addToast(`Added "${product.name}" to cart!`);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    if (quantityInCart >= product.stock) {
      addToast(`Only ${product.stock} items available in stock.`, 'error');
      return;
    }
    updateQuantity(product._id, quantityInCart + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    updateQuantity(product._id, quantityInCart - 1);
  };

  return (
    <div
      onClick={() => onQuickView(product)}
      className="group relative flex flex-col bg-white rounded-3xl border border-slate-200/90 hover:border-emerald-300 p-4 transition-all duration-300 hover:shadow-card cursor-pointer"
    >
      {/* Product Image Container */}
      <div className="relative aspect-[4/3] w-full rounded-2xl bg-slate-50 overflow-hidden mb-3.5">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Featured / Low Stock Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.featured && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-900 shadow-sm">
              Featured
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white shadow-sm">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Quick View Floating Action */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onQuickView(product);
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-600 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-emerald-600 hover:text-white hover:border-emerald-600 shadow-sm"
          title="Quick View Details"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Product Meta */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
          {product.category}
        </span>
        <div className="flex items-center gap-1 text-slate-700">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-semibold">{product.rating || '4.8'}</span>
          <span className="text-[10px] text-slate-400">({product.numReviews || 12})</span>
        </div>
      </div>

      {/* Product Title */}
      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-emerald-700 transition-colors">
        {product.name}
      </h3>

      {/* Short Description */}
      <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
        {product.description}
      </p>

      {/* Pricing & Add to Cart Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-auto">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Price</span>
          <span className="text-lg font-extrabold text-slate-900 tracking-tight">
            ${Number(product.price).toFixed(2)}
          </span>
        </div>

        {isOutOfStock ? (
          <span className="text-xs font-bold text-rose-500 px-3 py-1.5 bg-rose-50 rounded-xl">
            Sold Out
          </span>
        ) : quantityInCart > 0 ? (
          /* Quantity Stepper when in cart */
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center bg-emerald-600 text-white rounded-2xl shadow-sm overflow-hidden p-0.5"
          >
            <button
              onClick={handleDecrement}
              className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-xl transition-colors active:scale-90"
              aria-label="Decrease quantity"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-6 text-center text-xs font-bold select-none">
              {quantityInCart}
            </span>
            <button
              onClick={handleIncrement}
              className="w-7 h-7 flex items-center justify-center hover:bg-emerald-700 rounded-xl transition-colors active:scale-90"
              aria-label="Increase quantity"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          /* Clean Add Button */
          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white font-bold text-xs border border-emerald-200 hover:border-emerald-600 shadow-sm transition-all active:scale-95 group/btn"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add</span>
          </button>
        )}
      </div>
    </div>
  );
};
