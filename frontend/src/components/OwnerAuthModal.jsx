import React, { useState } from 'react';
import { X, ShieldLock, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';

const OwnerAuthModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const OWNER_PIN = '1234'; // Default Owner Passcode

  const handleVerifyOwner = (e) => {
    e.preventDefault();
    setError('');

    if (pin.trim() === OWNER_PIN) {
      onLoginSuccess();
      setPin('');
    } else {
      setError('Invalid Owner Passcode. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} id="owner-auth-overlay">
      <div className="modal-card" style={{ maxWidth: '420px' }} onClick={(e) => e.stopPropagation()} id="owner-auth-card">
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldLock size={20} color="#B8963E" />
            <span className="modal-title">Owner Portal Access</span>
          </div>
          <button className="close-btn" onClick={onClose} id="close-owner-auth-btn">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleVerifyOwner} className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ width: '48px', height: '48px', background: 'var(--accent-navy)', color: 'var(--accent-gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
              <KeyRound size={22} />
            </div>
            <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: 'var(--accent-navy)', marginBottom: '0.3rem' }}>
              Website Owner Verification
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Enter your owner passcode to view confidential sales revenue and order metrics.
            </p>
          </div>

          {error && (
            <div style={{ background: 'var(--status-danger-bg)', border: '1px solid rgba(198, 40, 40, 0.3)', borderRadius: '6px', padding: '0.75rem', color: 'var(--status-danger-text)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="owner-pin-input">Owner Passcode (Default PIN: 1234)</label>
            <input
              id="owner-pin-input"
              type="password"
              className="form-input"
              placeholder="Enter passcode"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              autoFocus
              required
            />
          </div>

          <button
            id="submit-owner-pin-btn"
            type="submit"
            className="checkout-btn"
            style={{ width: '100%', marginTop: '1rem' }}
          >
            <span>Unlock Sales Analytics</span>
            <ArrowRight size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default OwnerAuthModal;
