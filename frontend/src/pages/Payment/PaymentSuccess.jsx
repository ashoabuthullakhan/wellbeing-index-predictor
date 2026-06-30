import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { verifyCheckoutSession } from '../../services/api';

const PaymentSuccess = ({ onCreditsUpdate }) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get('session_id');
  const fallbackCredits = searchParams.get('credits') || '0';

  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [creditsAdded, setCreditsAdded] = useState(0);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (!sessionId) {
      setStatus('error');
      return;
    }

    verifyCheckoutSession(sessionId)
      .then((res) => {
        if (res.success || res.alreadyClaimed) {
          setCreditsAdded(res.creditsAdded || fallbackCredits);
          if (res.newTotal && onCreditsUpdate) {
            onCreditsUpdate(res.newTotal);
          }
          setStatus('success');
          // Trigger summary after animation
          setTimeout(() => {
            setShowSummary(true);
            // Auto-redirect to dashboard after 6 seconds of showing summary
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 6000);
          }, 3000); // 3 second animation
        } else {
          setStatus('error');
        }
      })
      .catch((err) => {
        console.error('Session verification failed:', err);
        setStatus('error');
      });
  }, [sessionId, fallbackCredits, navigate]);

  return (
    <div className="payment-page">
      <div className="payment-content">
        {status === 'verifying' && (
          <div className="payment-verifying animate-fade-in">
            <div className="spinner"></div>
            <h2>Verifying Payment...</h2>
            <p>Please do not close this window.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="payment-success-container">
            {!showSummary ? (
              <div className="celebration-animation animate-fade-in">
                <svg className="checkmark-svg" viewBox="0 0 52 52">
                  <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                  <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                </svg>
                <div className="celebration-particles"></div>
                <h1 className="payment-headline animate-slide-up-delay-1">Payment Successful!</h1>
                <div className="big-number credit-added animate-slide-up-delay-2">
                  +{creditsAdded} Credits Added
                </div>
              </div>
            ) : (
              <div className="payment-summary glass-card animate-fade-in">
                <div className="summary-icon">💎</div>
                <h2>Ready to Predict</h2>
                <p>Your account has been successfully credited with {creditsAdded} credits.</p>
                
                <div className="payment-actions">
                  <button onClick={() => navigate('/dashboard')} className="btn btn-primary btn-lg">
                    Back to Dashboard <span className="btn-icon">→</span>
                  </button>
                </div>
                <div className="auto-redirect-text">
                  Redirecting automatically in a few seconds...
                </div>
              </div>
            )}
          </div>
        )}

        {status === 'error' && (
          <div className="payment-error glass-card animate-fade-in">
            <div className="error-icon">⚠️</div>
            <h2>Verification Failed</h2>
            <p>We couldn't verify your payment session. If you were charged, your credits will be added automatically via webhook shortly.</p>
            <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-4">
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
