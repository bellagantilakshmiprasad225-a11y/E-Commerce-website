import React, { useState } from 'react';
import { X, Lock, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const CheckoutModal = ({
  isOpen,
  onClose,
  cart,
  onOrderSuccess
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, { price, qty }) => sum + parseFloat(price) * qty, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim()) {
      setErrorMsg('Please enter your full customer name.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!customerEmail.trim() || !emailRegex.test(customerEmail)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        items: cart.map(({ product_id, id, qty }) => ({
          product_id: product_id || id,
          quantity: qty
        }))
      };

      const API_KEY = import.meta.env.VITE_API_KEY || 'aura_store_api_key_sec_987654321_x';

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY
        },
        body: JSON.stringify(orderPayload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error?.message || 'Failed to submit order. Please check item stock.');
      }

      onOrderSuccess(data.invoice);
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred during checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="checkout-modal-overlay">
      <div className="modal-card" style={{ maxWidth: '820px' }} onClick={(e) => e.stopPropagation()} id="checkout-modal-card">
        <div className="modal-header">
          <div className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Lock size={18} color="#B8963E" />
            <span>Secure Order Checkout</span>
          </div>
          <button className="close-btn" onClick={onClose} id="close-checkout-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2rem' }}>
          <div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--accent-navy)', marginBottom: '1rem' }}>
              Customer Details
            </h4>

            {errorMsg && (
              <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(198, 40, 40, 0.3)', borderRadius: '6px', padding: '0.75rem 1rem', color: 'var(--status-danger-text)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="customer-name-input">Full Name *</label>
              <input
                id="customer-name-input"
                type="text"
                className="form-input"
                placeholder="e.g. Eleanor Vance"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="customer-email-input">Email Address *</label>
              <input
                id="customer-email-input"
                type="email"
                className="form-input"
                placeholder="e.g. eleanor.vance@example.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1.5rem' }}>
              <ShieldCheck size={16} color="#B8963E" />
              <span>256-Bit SSL Encrypted & Transactional Stock Lock</span>
            </div>
          </div>

          <div style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: 'var(--accent-navy)', marginBottom: '1rem' }}>
                Order Summary ({cart.length} items)
              </h4>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem', maxHeight: '160px', overflowY: 'auto', marginBottom: '1rem', paddingRight: '4px' }}>
                {cart.map((item) => (
                  <div key={item.product_id || item.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.name} × {item.qty}</span>
                    <span>{formatINR(parseFloat(item.price) * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal</span>
                  <span>{formatINR(subtotal)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Estimated GST / Tax (5%)</span>
                  <span>{formatINR(tax)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: 'var(--accent-navy)', fontSize: '1.15rem', paddingTop: '0.6rem', borderTop: '1px dashed var(--border-dark)', marginTop: '0.3rem' }}>
                  <span>Grand Total</span>
                  <span style={{ color: 'var(--accent-gold)' }}>{formatINR(grandTotal)}</span>
                </div>
              </div>
            </div>

            <button
              id="submit-order-btn"
              type="submit"
              className="checkout-btn"
              style={{ width: '100%', marginTop: '1.25rem' }}
              disabled={loading}
            >
              {loading ? (
                <span>Processing Order...</span>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>Place Order ({formatINR(grandTotal)})</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
