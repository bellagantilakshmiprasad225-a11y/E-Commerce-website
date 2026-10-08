import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const CartItem = ({ item, onUpdateQty, onRemove }) => {
  const { product_id, id, name, price, qty, stock, image_url } = item;
  const pId = product_id || id;
  const numPrice = parseFloat(price);
  const lineTotal = numPrice * qty;

  return (
    <div className="cart-item" id={`cart-item-${pId}`}>
      <img
        src={image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
        alt={name}
        className="cart-item-img"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
        }}
      />

      <div className="cart-item-details">
        <div className="cart-item-name">{name}</div>
        <div className="cart-item-price">{formatINR(numPrice)}</div>

        <div className="cart-item-controls">
          <button
            id={`cart-qty-minus-${pId}`}
            className="qty-btn"
            onClick={() => onUpdateQty(pId, qty - 1)}
          >
            <Minus size={12} />
          </button>

          <span className="qty-val" id={`cart-qty-val-${pId}`}>{qty}</span>

          <button
            id={`cart-qty-plus-${pId}`}
            className="qty-btn"
            disabled={stock && qty >= stock}
            onClick={() => onUpdateQty(pId, qty + 1)}
          >
            <Plus size={12} />
          </button>
        </div>
      </div>

      <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
        <span style={{ fontWeight: 800, color: 'var(--accent-navy)', fontSize: '0.95rem' }}>
          {formatINR(lineTotal)}
        </span>
        <button
          id={`cart-remove-btn-${pId}`}
          className="remove-btn"
          title="Remove Item"
          onClick={() => onRemove(pId)}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default CartItem;
