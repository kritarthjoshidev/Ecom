import React, { useState, useEffect } from 'react';
import { Sparkles, SlidersHorizontal, ArrowUpDown, RefreshCw, ShoppingBag, ShieldCheck, Truck, Clock } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailModal } from '../components/ProductDetailModal';
import { useToast } from '../components/Toast';

export const StorePage = ({ searchQuery }) => {
  const { addToast } = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('featured');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts({
        search: searchQuery,
        category: selectedCategory,
        sort: sortOption === 'featured' ? '' : sortOption,
      });
      setProducts(data.products || []);
      if (data.categories) {
        setCategories(data.categories);
      }
    } catch (err) {
      addToast(err.message || 'Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, selectedCategory, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8 animate-fade-in">
      
      {/* Hero Grocery Banner (inspired by Dribbble Vedant Mehra Day 30) */}
      <div className="relative rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-6 sm:p-10 overflow-hidden shadow-card">
        {/* Decorative background glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 -top-20 w-60 h-60 rounded-full bg-teal-400/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-emerald-200 text-xs font-bold mb-4 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>100% Certified Organic & Farm Hand-Picked</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-3">
            Freshness You Can Taste, <br className="hidden sm:inline" />
            <span className="text-emerald-300">Delivered in 30 Mins.</span>
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed mb-6 max-w-xl">
            Pure organic produce harvested every morning from local partner farms. Enjoy zero pesticides, artisanal sourdoughs, and farm-fresh dairy.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <div className="flex items-center gap-2.5 text-xs text-white/90">
              <Truck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Free Delivery Over $35</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-white/90">
              <ShieldCheck className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>100% Quality Guarantee</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-white/90 col-span-2 sm:col-span-1">
              <Clock className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>Same-Day Fast Dispatch</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Category Pills Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all shadow-sm ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-emerald-600/25 scale-105'
                    : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200/90'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2.5 self-end md:self-auto shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort by:</span>
          </div>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-3 py-2 text-xs font-bold rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
          >
            <option value="featured">Featured Picks</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
            <option value="name-asc">Alphabetical (A - Z)</option>
          </select>
        </div>

      </div>

      {/* Active Search & Filter Indicator */}
      {(searchQuery || selectedCategory !== 'All') && (
        <div className="flex items-center justify-between bg-emerald-50/70 border border-emerald-100 rounded-2xl px-4 py-2.5 text-xs text-emerald-900 font-medium">
          <span>
            Showing results {searchQuery && <span>matching "<strong>{searchQuery}</strong>"</span>}
            {searchQuery && selectedCategory !== 'All' && <span> in </span>}
            {selectedCategory !== 'All' && <span>category "<strong>{selectedCategory}</strong>"</span>}
            {' '}({products.length} found)
          </span>

          <button
            onClick={() => { setSelectedCategory('All'); }}
            className="text-emerald-700 hover:text-emerald-900 font-bold underline underline-offset-2 ml-4"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-3xl p-4 border border-slate-100 animate-pulse space-y-3">
              <div className="aspect-[4/3] bg-slate-100 rounded-2xl" />
              <div className="h-4 bg-slate-100 rounded w-1/3" />
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-full" />
              <div className="h-8 bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">No products found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            We couldn't find any groceries matching your search or filters. Try adjusting keywords or category selection.
          </p>
          <button
            onClick={() => { setSelectedCategory('All'); }}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition-all"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      )}

      {/* Quick View Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

    </div>
  );
};
