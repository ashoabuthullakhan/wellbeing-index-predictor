import React, { useState, useEffect } from 'react';
import { createCheckoutSession } from '../../services/api';

const PACKS = [
  { id: 'pack_100', credits: 100, price: 4.99, isPopular: false },
  { id: 'pack_250', credits: 250, price: 9.99, isPopular: true },
  { id: 'pack_700', credits: 700, price: 19.99, isPopular: false },
];

const PricingModal = ({ onClose }) => {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handlePurchase = async (packId) => {
    setLoadingId(packId);
    setError(null);
    try {
      const data = await createCheckoutSession(packId);
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      setError(err.message || 'Failed to start checkout. Please try again.');
      setLoadingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleBackdropClick}>
      <div className="pricing-modal animate-slide-up">
        <button className="pricing-close" onClick={onClose}>✕</button>

        <div className="pricing-header">
          <div className="pricing-icon">💎</div>
          <h2 className="pricing-title">Unlock AI Insights</h2>
          <p className="pricing-desc">
            Purchase credits to continue chatting with the AI assistant and unlock premium features.
          </p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
          </div>
        )}

        <div className="pricing-grid">
          {PACKS.map((pack) => (
            <div key={pack.id} className={`pricing-card ${pack.isPopular ? 'popular' : ''}`}>
              {pack.isPopular && <span className="pricing-popular-badge">Most Popular</span>}
              <div className="pricing-credits">{pack.credits}</div>
              <div className="pricing-credits-label">Credits</div>
              <div className="pricing-amount">${pack.price.toFixed(2)}</div>
              
              <button
                className={`btn btn-block ${pack.isPopular ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => handlePurchase(pack.id)}
                disabled={loadingId !== null}
              >
                {loadingId === pack.id ? (
                  <span className="spinner-container"><span className="spinner"></span></span>
                ) : (
                  'Buy Now'
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-footer">
          🔒 Secure payments powered by <strong>Stripe</strong>
        </div>
      </div>
    </div>
  );
};

export default PricingModal;
