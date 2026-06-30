import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PredictionForm from '../components/PredictionForm';
import ResultCard from '../components/ResultCard';
import HistoryTable from '../components/HistoryTable';
import { predictHDI, getHistory, deletePrediction, verifyCheckoutSession } from '../services/api';

const Home = ({ user, onCreditsUpdate }) => {
  const [activeTab, setActiveTab] = useState('predict');
  const [history, setHistory] = useState([]);
  const [activeResult, setActiveResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
    
    // Switch to history tab if hash is present
    if (location.hash === '#history') {
      setActiveTab('history');
    } else {
      setActiveTab('predict');
    }
    
    // Check for Stripe redirect
    const query = new URLSearchParams(location.search);
    if (query.get('payment') === 'success') {
      const sessionId = query.get('session_id');
      if (sessionId) {
        verifyCheckoutSession(sessionId)
          .then((res) => {
            if (res.success && res.newTotal) {
              onCreditsUpdate(res.newTotal);
              setSuccessMsg(`Payment successful! You now have ${res.newTotal} credits.`);
            } else if (res.alreadyClaimed) {
              setSuccessMsg(`Payment already verified. Thank you!`);
            }
          })
          .catch((err) => setError(err.message))
          .finally(() => {
            // Clean up URL
            navigate('/dashboard', { replace: true });
          });
      }
    } else if (query.get('payment') === 'cancelled') {
      setError('Payment was cancelled.');
      navigate('/dashboard', { replace: true });
    }
  }, [location.hash, location.search, navigate, onCreditsUpdate]);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (err) {
      console.error('Error fetching history:', err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePrediction(id);
      setHistory(prev => prev.filter(item => item._id !== id));
      if (activeResult && activeResult._id === id) {
        setActiveResult(null);
      }
    } catch (err) {
      setError(err.message);
      setTimeout(() => setError(null), 3000);
      throw err; // throw to let HistoryTable know it failed
    }
  };

  const handlePredictSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await predictHDI(formData);
      setActiveResult(response.prediction);
      if (response.credits !== undefined) {
        onCreditsUpdate(response.credits);
      }
      await fetchHistory();
    } catch (err) {
      setError(err.message || 'An error occurred during prediction.');
      setActiveResult(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickPreset = (preset) => {
    handlePredictSubmit(preset);
  };

  const handleSelectHistoryItem = (item) => {
    setActiveResult(item);
    setActiveTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* Preset data */
  const presets = [
    {
      label: '🇳🇴 Norway',
      color: '#10b981',
      data: { countryName: 'Norway', lifeExpectancy: 83.5, meanYearsSchooling: 13.5, expectedYearsSchooling: 18.7, gniPerCapita: 66000 },
    },
    {
      label: '🇮🇳 India',
      color: '#f59e0b',
      data: { countryName: 'India', lifeExpectancy: 67.5, meanYearsSchooling: 6.7, expectedYearsSchooling: 11.9, gniPerCapita: 7000 },
    },
    {
      label: '🇨🇫 Central African Rep.',
      color: '#ef4444',
      data: { countryName: 'Central African Republic', lifeExpectancy: 54.0, meanYearsSchooling: 4.3, expectedYearsSchooling: 8.0, gniPerCapita: 1000 },
    },
  ];

  return (
    <div className="dashboard-page container">
      {/* Dashboard header */}
      <div className="dashboard-header animate-slide-up">
        <div className="eyebrow-pill">
          <span className="eyebrow-pill-icon">🎯</span>
          PREDICTION ENGINE
        </div>
        <h1 className="hero-headline" style={{ marginTop: '1rem' }}>
          Analyze <span className="accent">Development</span>
        </h1>
        <p className="hero-subtitle">
          Enter development indicators below or use a country preset to generate
          an instant HDI classification with contextual insights.
        </p>
      </div>

      {/* Preset pills */}
      <div className="preset-row animate-slide-up-delay-1">
        {presets.map((p, i) => (
          <button
            key={i}
            className="preset-pill"
            onClick={() => handleQuickPreset(p.data)}
            disabled={isLoading}
          >
            <span className="preset-pill-dot" style={{ background: p.color }}></span>
            {p.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="tab-navigation animate-slide-up-delay-2">
        <button
          className={`tab-btn ${activeTab === 'predict' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('predict');
            navigate('/dashboard', { replace: true });
          }}
        >
          Predictor
        </button>
        <button
          className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('history');
            navigate('/dashboard#history', { replace: true });
          }}
        >
          History ({history.length})
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="alert alert-danger animate-fade-in">
          <span className="alert-icon">⚠️</span>
          <div className="alert-content"><strong>Error:</strong> {error}</div>
          <button className="alert-close" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Success alert */}
      {successMsg && (
        <div className="alert alert-success animate-fade-in">
          <span className="alert-icon">💎</span>
          <div className="alert-content">{successMsg}</div>
          <button className="alert-close" onClick={() => setSuccessMsg(null)}>×</button>
        </div>
      )}

      {/* Main content */}
      {activeTab === 'predict' ? (
        <div className="dashboard-grid animate-fade-in">
          <div>
            <PredictionForm onSubmit={handlePredictSubmit} isLoading={isLoading} />
          </div>
          <div>
            {activeResult ? (
              <ResultCard result={activeResult} />
            ) : (
              <div className="result-placeholder">
                <div className="placeholder-icon">📈</div>
                <h3>Analysis Ready</h3>
                <p>
                  Submit the indicators form or click a country preset above
                  to generate an HDI prediction with tailored insights.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="animate-fade-in">
          <HistoryTable history={history} onSelect={handleSelectHistoryItem} onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
};

export default Home;
