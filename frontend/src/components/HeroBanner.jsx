import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const HeroBanner = ({ onShopNow }) => {
  return (
    <section className="hero-banner" id="hero-banner">
      <div className="hero-content">
        <div>
          <div className="hero-tagline">
            <Sparkles size={16} color="#B8963E" />
            <span>Autumn / Winter Collection 2026</span>
          </div>

          <h1 className="hero-heading">
            Elevate Your Everyday Life with Fine Tech & Design
          </h1>

          <p className="hero-description">
            Discover our meticulously curated collection of premium audio equipment, precision smart wearables, ergonomic workspace accessories, and intelligent home design.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <button
              id="hero-shop-now-btn"
              className="hero-cta-btn"
              onClick={onShopNow}
            >
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#D1C9BD' }}>
              <ShieldCheck size={16} color="#B8963E" />
              <span>Authentic Quality Guarantee</span>
            </div>
          </div>
        </div>

        <div className="hero-image-wrap">
          <img
            src="/images/wireless_headphones.jpg"
            alt="Featured Headphones"
            className="hero-image"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;
