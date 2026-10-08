import React from 'react';
import ProductCard from './ProductCard';
import { PackageSearch, RefreshCw } from 'lucide-react';

const ProductList = ({ products, cart, onAddToCart, onViewDetails, loading, error }) => {
  if (loading) {
    return (
      <div className="product-grid">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="product-card" style={{ height: '380px', opacity: 0.6, animation: 'pulseBadge 1s infinite alternate' }}>
            <div style={{ height: '220px', background: '#E7E3DC' }}></div>
            <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ height: '20px', background: '#D1C9BD', borderRadius: '4px', width: '70%' }}></div>
              <div style={{ height: '14px', background: '#E7E3DC', borderRadius: '4px', width: '100%' }}></div>
              <div style={{ height: '14px', background: '#E7E3DC', borderRadius: '4px', width: '80%' }}></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(198, 40, 40, 0.3)', borderRadius: '12px', padding: '2.5rem', color: 'var(--status-danger-text)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-serif)', fontWeight: 700, fontSize: '1.3rem' }}>Unable to load catalog items</p>
        <p style={{ fontSize: '0.9rem', marginTop: '0.4rem', color: 'var(--text-secondary)' }}>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 1rem', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
        <PackageSearch size={52} color="#8C8C8C" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', color: 'var(--accent-navy)', marginBottom: '0.5rem' }}>No Products Found</h3>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>We couldn't find any products matching your current search or category filter.</p>
      </div>
    );
  }

  return (
    <div className="product-grid" id="product-grid">
      {products.map((product) => {
        const cartItem = cart.find((item) => (item.product_id || item.id) === product.product_id);
        const inCartQty = cartItem ? cartItem.qty : 0;
        return (
          <ProductCard
            key={product.product_id}
            product={product}
            inCartQty={inCartQty}
            onAddToCart={onAddToCart}
            onViewDetails={onViewDetails}
          />
        );
      })}
    </div>
  );
};

export default ProductList;
