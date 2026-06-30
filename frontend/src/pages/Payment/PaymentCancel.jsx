import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="payment-page">
      <div className="payment-content">
        <div className="payment-cancel-container glass-card animate-fade-in">
          <div className="cancel-icon animate-pulse">❌</div>
          <h1 className="payment-headline">Payment Cancelled</h1>
          <p className="payment-desc">No charge was made. You can try again anytime.</p>
          
          <div className="payment-actions">
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg">
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
