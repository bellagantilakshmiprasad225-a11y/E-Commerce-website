import React from 'react';
import CartItem from './CartItem';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const Cart = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onOpenCheckout
}) => {
  if (!isOpen) return null;

  const subtotal = cart.reduce((sum, { price, qty }) => sum + parseFloat(price) * qty, 0);
  const tax = subtotal * 0.05;
  const grandTotal = subtotal + tax;

  return (
    <div className="cart-drawer-overlay" onClick={onClose} id="cart-drawer-overlay">
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()} id="cart-drawer">
        <div className="cart-header">
          <div className="cart-title">
            <ShoppingBag size={22} color="#B8963E" />
            <span>Your Shopping Cart</span>
            <span className="cart-badge" style={{ fontSize: '0.8rem', padding: '2px 8px' }}>
              {cart.reduce((sum, { qty }) => sum + qty, 0)} items
            </span>
          </div>
          <button className="close-btn" onClick={onClose} id="close-cart-btn">
            <X size={18} />
          </button>
        </div>

        <div className="cart-body" id="cart-item-list">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingBag size={56} color="#8C8C8C" style={{ opacity: 0.4 }} />
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.2rem', color: 'var(--accent-navy)', fontWeight: 700 }}>Your Cart is Empty</p>
              <p style={{ fontSize: '0.875rem' }}>Explore our catalog and add items to your shopping cart.</p>
            </div>
          ) : (
            cart.map((item) => (
              <CartItem
                key={item.product_id || item.id}
                item={item}
                onUpdateQty={onUpdateQty}
                onRemove={onRemoveItem}
              />
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="cart-footer" id="cart-footer-summary">
            <div className="summary-row">
              <span>Items Subtotal</span>
              <span>{formatINR(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated GST / Tax (5%)</span>
              <span>{formatINR(tax)}</span>
            </div>
            <div className="summary-row grand-total">
              <span>Grand Total</span>
              <span id="cart-grand-total" style={{ color: 'var(--accent-navy)' }}>{formatINR(grandTotal)}</span>
            </div>

            <button
              id="proceed-to-checkout-btn"
              className="checkout-btn"
              onClick={onOpenCheckout}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
