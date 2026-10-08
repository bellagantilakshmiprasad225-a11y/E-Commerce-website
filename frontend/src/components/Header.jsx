import React from 'react';
import { Store, BarChart3, Search, ShoppingBag, ShieldLock, LogOut } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const Header = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  setIsCartOpen,
  searchQuery,
  setSearchQuery,
  isOwnerLoggedIn,
  onOpenOwnerAuth,
  onOwnerLogout
}) => {
  return (
    <header className="header" id="app-header">
      <div className="brand-link" onClick={() => setActiveTab('storefront')}>
        <div className="brand-symbol">A</div>
        <div>
          <h1 className="brand-title">Aura Store</h1>
          <p className="brand-subtitle">Curated Store & Orders</p>
        </div>
      </div>

      <div className="nav-tabs" id="nav-tabs">
        <button
          id="nav-storefront-btn"
          className={`nav-btn ${activeTab === 'storefront' ? 'active' : ''}`}
          onClick={() => setActiveTab('storefront')}
        >
          <Store size={16} /> Storefront
        </button>

        {isOwnerLoggedIn ? (
          <button
            id="nav-reports-btn"
            className={`nav-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            <BarChart3 size={16} /> Sales & Revenue (Owner)
          </button>
        ) : (
          <button
            id="nav-owner-portal-btn"
            className="nav-btn"
            onClick={onOpenOwnerAuth}
            title="Website Owner Access"
          >
            <ShieldLock size={16} color="#B8963E" /> Owner Portal
          </button>
        )}
      </div>

      <div className="header-actions">
        {activeTab === 'storefront' && (
          <div className="search-bar">
            <Search className="search-icon" size={16} />
            <input
              id="product-search-input"
              type="text"
              className="search-input"
              placeholder="Search catalog..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}

        {isOwnerLoggedIn && (
          <button
            id="owner-logout-btn"
            className="nav-btn"
            style={{ background: 'var(--bg-surface-secondary)', border: '1px solid var(--border-light)', fontSize: '0.8rem' }}
            onClick={onOwnerLogout}
            title="Logout from Owner Portal"
          >
            <LogOut size={14} /> Exit Owner Mode
          </button>
        )}

        <button
          id="open-cart-btn"
          className="cart-toggle-btn"
          onClick={() => setIsCartOpen(true)}
        >
          <ShoppingBag size={18} color="#1B2A41" />
          <span>Cart</span>
          <span className="cart-badge" id="cart-badge-count">{cartCount}</span>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1B2A41', marginLeft: '2px' }}>
            {formatINR(cartTotal)}
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;
