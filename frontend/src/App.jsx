import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import CategoryFilter from './components/CategoryFilter';
import ProductList from './components/ProductList';
import ProductDetailModal from './components/ProductDetailModal';
import Cart from './components/Cart';
import CheckoutModal from './components/CheckoutModal';
import InvoiceModal from './components/InvoiceModal';
import ReportsDashboard from './components/ReportsDashboard';
import OwnerAuthModal from './components/OwnerAuthModal';
import Footer from './components/Footer';
import { CheckCircle2 } from 'lucide-react';

const API_KEY = import.meta.env.VITE_API_KEY || 'aura_store_api_key_sec_987654321_x';

function App() {
  const [activeTab, setActiveTab] = useState('storefront'); // 'storefront' | 'reports'

  // Owner Authentication State
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState(false);
  const [isOwnerAuthOpen, setIsOwnerAuthOpen] = useState(false);

  // Products & Categories state
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cart state owned by App
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Active Modals state
  const [selectedProductDetail, setSelectedProductDetail] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [activeInvoice, setActiveInvoice] = useState(null);

  // Toast notification state
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => {
      setToastMsg('');
    }, 3200);
  };

  // Tab switching handler enforcing owner auth for sales reports
  const handleTabSwitch = (tab) => {
    if (tab === 'reports' && !isOwnerLoggedIn) {
      setIsOwnerAuthOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  const handleOwnerLoginSuccess = () => {
    setIsOwnerLoggedIn(true);
    setIsOwnerAuthOpen(false);
    setActiveTab('reports');
    showToast('Welcome, Owner! Confidential Sales & Revenue Dashboard unlocked.');
  };

  const handleOwnerLogout = () => {
    setIsOwnerLoggedIn(false);
    setActiveTab('storefront');
    showToast('Logged out of Owner Portal');
  };

  // Fetch Categories with API key header
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', {
        headers: { 'x-api-key': API_KEY }
      });
      const json = await res.json();
      if (json.success) {
        setCategories(json.data);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  // Fetch Products with API key header
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = '/api/products';
      const queryParams = [];
      if (selectedCategory && selectedCategory !== 'all') {
        queryParams.push(`category_id=${selectedCategory}`);
      }
      if (searchQuery.trim()) {
        queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }
      if (queryParams.length > 0) {
        url += '?' + queryParams.join('&');
      }

      const res = await fetch(url, {
        headers: { 'x-api-key': API_KEY }
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error?.message || 'Failed to fetch products');
      }
      setProducts(json.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, searchQuery]);

  // ES6 Add to Cart state updater
  const addToCart = (product) => {
    const pId = product.product_id || product.id;

    setCart((prev) => {
      const found = prev.find((i) => (i.product_id || i.id) === pId);
      if (found) {
        return prev.map((i) =>
          (i.product_id || i.id) === pId ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [...prev, { ...product, id: pId, qty: 1 }];
    });

    showToast(`Added '${product.name}' to cart!`);
  };

  // Update Cart Item Quantity
  const handleUpdateCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(productId);
      return;
    }

    setCart((prev) =>
      prev.map((item) =>
        (item.product_id || item.id) === productId ? { ...item, qty: newQty } : item
      )
    );
  };

  // Remove Item from Cart
  const handleRemoveCartItem = (productId) => {
    setCart((prev) => prev.filter((item) => (item.product_id || item.id) !== productId));
    showToast('Item removed from shopping cart');
  };

  // Order Success Handler
  const handleOrderSuccess = (invoice) => {
    setCart([]);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    setActiveInvoice(invoice);
    showToast('Order placed successfully! Invoice generated.');
    fetchProducts();
    fetchCategories();
  };

  // Fetch invoice by order ID for reports invoice modal view
  const handleViewInvoiceById = async (orderId) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        headers: { 'x-api-key': API_KEY }
      });
      const json = await res.json();
      if (json.success) {
        setActiveInvoice(json.data);
      }
    } catch (err) {
      console.error('Error fetching invoice:', err);
    }
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // Cart totals
  const cartCount = cart.reduce((sum, { qty }) => sum + qty, 0);
  const cartSubtotal = cart.reduce((sum, { price, qty }) => sum + parseFloat(price) * qty, 0);
  const cartGrandTotal = cartSubtotal * 1.05;

  return (
    <div className="app-container">
      <Header
        activeTab={activeTab}
        setActiveTab={handleTabSwitch}
        cartCount={cartCount}
        cartTotal={cartGrandTotal}
        setIsCartOpen={setIsCartOpen}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isOwnerLoggedIn={isOwnerLoggedIn}
        onOpenOwnerAuth={() => setIsOwnerAuthOpen(true)}
        onOwnerLogout={handleOwnerLogout}
      />

      {activeTab === 'storefront' && (
        <HeroBanner onShopNow={scrollToCatalog} />
      )}

      <main className="main-content">
        {activeTab === 'storefront' ? (
          <div id="catalog-section">
            <div className="section-header">
              <div>
                <h2 className="section-title-large">Curated Product Catalog</h2>
                <p className="section-subtitle">Select a category or filter items by search keywords</p>
              </div>
            </div>

            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />

            <ProductList
              products={products}
              cart={cart}
              onAddToCart={addToCart}
              onViewDetails={setSelectedProductDetail}
              loading={loading}
              error={error}
            />
          </div>
        ) : (
          isOwnerLoggedIn && <ReportsDashboard onViewInvoice={handleViewInvoiceById} />
        )}
      </main>

      <Footer onNavigateTab={handleTabSwitch} />

      {/* Cart Drawer */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Detail Quick View Modal */}
      {selectedProductDetail && (
        <ProductDetailModal
          product={selectedProductDetail}
          onClose={() => setSelectedProductDetail(null)}
          onAddToCart={addToCart}
          inCartQty={
            cart.find((i) => (i.product_id || i.id) === selectedProductDetail.product_id)?.qty || 0
          }
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Invoice Modal */}
      {activeInvoice && (
        <InvoiceModal
          invoice={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}

      {/* Owner Passcode Auth Modal */}
      <OwnerAuthModal
        isOpen={isOwnerAuthOpen}
        onClose={() => setIsOwnerAuthOpen(false)}
        onLoginSuccess={handleOwnerLoginSuccess}
      />

      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast-notification">
          <CheckCircle2 size={18} color="#B8963E" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}

export default App;
