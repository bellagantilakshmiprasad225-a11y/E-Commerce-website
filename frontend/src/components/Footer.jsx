import React from 'react';
import { Store, ShieldCheck, Truck, RefreshCw, Mail, Phone, MapPin } from 'lucide-react';

const Footer = ({ onNavigateTab }) => {
  return (
    <footer className="footer" id="app-footer">
      <div className="footer-content">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div className="brand-symbol" style={{ width: '34px', height: '34px', fontSize: '1.1rem' }}>A</div>
            <h3 className="footer-brand-title">Aura Store</h3>
          </div>
          <p className="footer-desc">
            A premium retail destination specializing in high-performance electronics, luxury wearables, and ambient lifestyle innovations.
          </p>
          <div style={{ display: 'flex', gap: '1rem', color: '#B8963E' }}>
            <ShieldCheck size={20} title="Quality Guarantee" />
            <Truck size={20} title="Express Delivery" />
            <RefreshCw size={20} title="Easy Returns" />
          </div>
        </div>

        <div>
          <h4 className="footer-title">Navigation</h4>
          <ul className="footer-links">
            <li><a href="#catalog" onClick={() => onNavigateTab('storefront')}>Storefront Catalog</a></li>
            <li><a href="#reports" onClick={() => onNavigateTab('reports')}>Sales & Billing Reports (Owner Only)</a></li>
            <li><a href="#featured">Featured Collection</a></li>
            <li><a href="#about">About Aura Store</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Customer Care</h4>
          <ul className="footer-links">
            <li><a href="#faq">Frequently Asked Questions</a></li>
            <li><a href="#shipping">Shipping & Handling</a></li>
            <li><a href="#returns">Returns & Exchange</a></li>
            <li><a href="#privacy">Privacy & Terms</a></li>
          </ul>
        </div>

        <div>
          <h4 className="footer-title">Contact & Support</h4>
          <ul className="footer-links" style={{ gap: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MapPin size={16} color="#B8963E" />
              <span>Madanapalle, Andhra Pradesh 517326</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Phone size={16} color="#B8963E" />
              <span>+91 7288841446</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Mail size={16} color="#B8963E" />
              <span>jayaprakash72888@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div>© 2026 Aura Store Retail Inc. All rights reserved.</div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Security</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
