import React, { useState } from 'react';
import { ShoppingBag, Search, ShoppingCart, User as UserIcon, Shield, Package, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar = ({ currentView, setCurrentView, searchQuery, setSearchQuery }) => {
  const { user, isAuthenticated, isAdmin, logout, openAuth } = useAuth();
  const { itemCount, subtotal, openCart } = useCart();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => { setCurrentView('store'); setMobileMenuOpen(false); }}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                Fresh<span className="text-emerald-600">Mart</span>
              </span>
              <p className="text-[10px] uppercase font-bold tracking-wider text-emerald-600/80 leading-none">Organic & Groceries</p>
            </div>
          </div>

          {/* Search Bar (Visible on desktop & tablet) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fresh avocados, bakery, dairy, juices..."
                className="w-full pl-10 pr-9 py-2.5 bg-slate-100/80 border border-slate-200 rounded-full text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setCurrentView('store')}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                currentView === 'store'
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Store Catalog
            </button>

            {isAuthenticated && (
              <button
                onClick={() => setCurrentView('orders')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                  currentView === 'orders'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Package className="w-4 h-4" />
                My Orders
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  currentView === 'admin'
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : 'text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </nav>

          {/* Right Actions: Cart & User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            
            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              aria-label="Open Shopping Cart"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 stroke-[2.2]" />
                {itemCount > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-rose-500 text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pulse">
                    {itemCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-sm font-bold tracking-tight">
                ${subtotal.toFixed(2)}
              </span>
            </button>

            {/* User Account / Auth */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden sm:block text-left pr-1">
                    <p className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[100px]">{user.name}</p>
                    <p className="text-[10px] text-slate-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {/* Dropdown Menu */}
                {userMenuOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in divide-y divide-slate-100">
                      <div className="px-4 py-2.5">
                        <p className="text-xs text-slate-500 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { setCurrentView('orders'); setUserMenuOpen(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium"
                        >
                          <Package className="w-4 h-4 text-slate-400" />
                          My Orders
                        </button>

                        {isAdmin && (
                          <button
                            onClick={() => { setCurrentView('admin'); setUserMenuOpen(false); }}
                            className="w-full px-4 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5 font-semibold"
                          >
                            <Shield className="w-4 h-4 text-emerald-600" />
                            Admin Dashboard
                          </button>
                        )}
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-medium"
                        >
                          <LogOut className="w-4 h-4 text-rose-500" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuth('login')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-sm transition-all active:scale-95"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groceries, bakery, juices..."
              className="w-full pl-10 pr-9 py-2 bg-slate-100 border border-slate-200 rounded-full text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-slate-200/80 flex flex-col gap-1">
            <button
              onClick={() => { setCurrentView('store'); setMobileMenuOpen(false); }}
              className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold ${
                currentView === 'store' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
              }`}
            >
              Store Catalog
            </button>
            {isAuthenticated && (
              <button
                onClick={() => { setCurrentView('orders'); setMobileMenuOpen(false); }}
                className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2 ${
                  currentView === 'orders' ? 'bg-emerald-50 text-emerald-700' : 'text-slate-700'
                }`}
              >
                <Package className="w-4 h-4" />
                My Orders
              </button>
            )}
            {isAdmin && (
              <button
                onClick={() => { setCurrentView('admin'); setMobileMenuOpen(false); }}
                className={`px-4 py-2.5 rounded-xl text-left text-sm font-semibold flex items-center gap-2 ${
                  currentView === 'admin' ? 'bg-emerald-600 text-white' : 'text-emerald-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
