import React from 'react';
import { Layers, Laptop, Shirt, Footprints, Watch, Home, Sparkles } from 'lucide-react';

const CategoryFilter = ({ categories, selectedCategory, onSelectCategory }) => {
  const totalProducts = categories.reduce((sum, { product_count }) => sum + parseInt(product_count || 0, 10), 0);

  const getCategoryIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('electronic') || lower.includes('device')) return <Laptop size={15} />;
    if (lower.includes('apparel') || lower.includes('cloth')) return <Shirt size={15} />;
    if (lower.includes('footwear') || lower.includes('shoe')) return <Footprints size={15} />;
    if (lower.includes('wearable') || lower.includes('watch') || lower.includes('accessory')) return <Watch size={15} />;
    if (lower.includes('smart') || lower.includes('home') || lower.includes('light')) return <Home size={15} />;
    return <Sparkles size={15} />;
  };

  return (
    <div className="category-filter" id="category-filter-bar">
      <button
        id="category-pill-all"
        className={`category-pill ${selectedCategory === 'all' ? 'active' : ''}`}
        onClick={() => onSelectCategory('all')}
      >
        <Layers size={15} />
        All Collection ({totalProducts})
      </button>

      {categories.map(({ category_id, name, product_count }) => (
        <button
          key={category_id}
          id={`category-pill-${category_id}`}
          className={`category-pill ${selectedCategory === String(category_id) ? 'active' : ''}`}
          onClick={() => onSelectCategory(String(category_id))}
        >
          {getCategoryIcon(name)}
          {name}
          <span className="pill-count">{product_count}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
