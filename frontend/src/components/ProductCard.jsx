import React from 'react';
import { Plus, Check, Eye } from 'lucide-react';
import { formatINR } from '../utils/formatCurrency';

const ProductCard = ({ product, onAddToCart, onViewDetails, inCartQty = 0 }) => {
  const { product_id, name, description, price, stock, category_name, image_url } = product;
  const numPrice = parseFloat(price);

  const getStockStatus = () => {
    if (stock <= 0) return { label: 'Out of Stock', class: 'out-of-stock' };
    if (stock <= 5) return { label: `Only ${stock} Left`, class: 'low-stock' };
    return { label: `In Stock`, class: 'in-stock' };
  };

  const stockStatus = getStockStatus();
  const isOutOfStock = stock <= 0 || inCartQty >= stock;

  return (
    <div className="product-card" id={`product-card-${product_id}`}>
      <div className="product-image-wrap">
        <img
          src={image_url || 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80'}
          alt={name}
          className="product-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <span className="category-badge">{category_name}</span>
        <span className={`stock-badge ${stockStatus.class}`}>{stockStatus.label}</span>
      </div>

      <div className="product-info">
        <h3 className="product-title" title={name}>{name}</h3>
        <p className="product-desc" title={description}>{description}</p>

        <div className="product-footer">
          <div className="product-price">{formatINR(numPrice)}</div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              id={`view-details-btn-${product_id}`}
              className="qty-btn"
              style={{ width: '36px', height: '36px', borderRadius: '6px' }}
              title="Quick View"
              onClick={() => onViewDetails(product)}
            >
              <Eye size={15} />
            </button>
            <button
              id={`add-to-cart-btn-${product_id}`}
              className="add-btn"
              disabled={isOutOfStock}
              onClick={() => onAddToCart(product)}
            >
              {inCartQty > 0 ? <Check size={15} /> : <Plus size={15} />}
              {isOutOfStock ? 'Out of Stock' : inCartQty > 0 ? `In Cart (${inCartQty})` : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
