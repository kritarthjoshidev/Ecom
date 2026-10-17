import React from 'react';
import { ShoppingBag, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export const Footer = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-slate-900">
                Fresh<span className="text-emerald-600">Mart</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
              Premium full-stack organic e-commerce experience built with React, Vite, Tailwind CSS, Express, and MongoDB. Delivering farm-fresh goodness directly to your doorstep.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold bg-emerald-50 px-3 py-1.5 rounded-xl w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Full-Stack Role-Based Authorization & Trusted DB Pricing</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Shop Categories</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li><button onClick={() => onNavigate('store')} className="hover:text-emerald-600 transition-colors">Fruits & Vegetables</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-emerald-600 transition-colors">Dairy & Pasture Eggs</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-emerald-600 transition-colors">Artisan Sourdough Bakery</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-emerald-600 transition-colors">Cold-Pressed Juices</button></li>
              <li><button onClick={() => onNavigate('store')} className="hover:text-emerald-600 transition-colors">Organic Honey & Snacks</button></li>
            </ul>
          </div>

          {/* Demo Accounts */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Evaluation Accounts</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Admin Account</p>
                <p className="text-[11px] text-slate-500 font-mono">admin@store.com / admin123</p>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                <p className="font-bold text-slate-800">Customer Account</p>
                <p className="text-[11px] text-slate-500 font-mono">user@store.com / user123</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
          <p>© 2026 FreshMart Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Antigravity Full-Stack Showcase
          </p>
        </div>

      </div>
    </footer>
  );
};
