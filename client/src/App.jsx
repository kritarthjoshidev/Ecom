import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { StorePage } from './pages/StorePage';
import { MyOrdersPage } from './pages/MyOrdersPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { OrderTrackerModal } from './components/OrderTrackerModal';
import { useAuth } from './context/AuthContext';

export function App() {
  const { isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState('store'); // 'store' | 'orders' | 'admin'
  const [searchQuery, setSearchQuery] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // If a non-admin somehow tries to switch to admin view, fall back to store
  const activeView = (currentView === 'admin' && !isAdmin) ? 'store' : currentView;

  const handleOrderPlaced = (order) => {
    setPlacedOrder(order);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      
      {/* Sticky Navigation */}
      <Navbar
        currentView={activeView}
        setCurrentView={setCurrentView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        {activeView === 'store' && (
          <StorePage searchQuery={searchQuery} />
        )}

        {activeView === 'orders' && (
          <MyOrdersPage onExploreStore={() => setCurrentView('store')} />
        )}

        {activeView === 'admin' && isAdmin && (
          <AdminDashboard />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={(view) => setCurrentView(view)} />

      {/* Cart Drawer */}
      <CartDrawer
        onCheckoutClick={() => setCheckoutModalOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      {/* Authentication Modal */}
      <AuthModal />

      {/* Instant Order Placed Tracker */}
      {placedOrder && (
        <OrderTrackerModal
          order={placedOrder}
          onClose={() => setPlacedOrder(null)}
        />
      )}

    </div>
  );
}

export default App;
