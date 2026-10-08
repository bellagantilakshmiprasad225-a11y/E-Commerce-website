import React from 'react';
import { X, Plus, Check, ShieldCheck, Truck, RefreshCw } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const ProductDetailModal = ({ product, onClose, onAddToCart, inCartQty = 0 }) => {
  if (!product) return null;

  const { product_id, name, description, price, stock, category_name, image_url } = product;
  const numPrice = parseFloat(price);
  const isOutOfStock = stock <= 0 || inCartQty >= stock;

  return (
    <div className="modal-overlay" onClick={onClose} id="product-detail-modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span className="category-badge" style={{ position: 'static' }}>{category_name}</span>
            <h3 className="modal-title">{name}</h3>
          </div>
          <button className="close-btn" onClick={onClose} id="close-product-detail-btn">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
          <div>
            <img
              src={image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
              alt={name}
              style={{ width: '100%', height: '260px', objectFit: 'cover', borderRadius: '8px', background: '#F3EFEA', border: '1px solid var(--border-light)' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: '1.75rem', fontWeight: 800, color: 'var(--accent-navy)', marginBottom: '0.75rem' }}>
                {formatINR(numPrice)}
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {description}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ShieldCheck size={16} color="#B8963E" /> Official 1-Year Brand Warranty
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={16} color="#1B2A41" /> Express Pan-India Delivery
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <RefreshCw size={16} color="#1B2A41" /> 30-Day Hassle-Free Returns
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: stock > 0 ? 'var(--status-success-text)' : 'var(--status-danger-text)' }}>
                {stock > 0 ? `In Stock (${stock} available)` : 'Out of Stock'}
              </span>

              <button
                id={`modal-add-to-cart-btn-${product_id}`}
                className="add-btn"
                disabled={isOutOfStock}
                onClick={() => onAddToCart(product)}
              >
                {inCartQty > 0 ? <Check size={16} /> : <Plus size={16} />}
                {isOutOfStock ? 'Out of Stock' : inCartQty > 0 ? `Add Another (${inCartQty})` : 'Add to Cart'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
