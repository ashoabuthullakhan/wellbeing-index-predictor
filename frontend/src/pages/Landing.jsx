import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* ─── Hero Section ─── */}
      <section className="landing-hero">
        <div className="eyebrow-pill animate-slide-up">
          <span className="eyebrow-pill-icon">✨</span>
          AI-POWERED DEVELOPMENT ANALYSIS
        </div>

        <h1 className="hero-headline animate-slide-up-delay-1">
          Decode a Nation's<br />
          <span className="accent">Development.</span>
        </h1>

        <p className="hero-subtitle animate-slide-up-delay-2">
          Predict the Human Development Index using machine learning trained on real
          UNDP datasets. Evaluate health, education, and economic indicators to
          classify 204 nations into development tiers — instantly.
        </p>

        <div className="landing-ctas animate-slide-up-delay-3">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start Predicting
            <span className="btn-icon">→</span>
          </Link>
          <Link to="/login" className="btn btn-outline btn-lg">
            Sign In
          </Link>
        </div>

        <div className="trust-row animate-slide-up-delay-3">
          <div className="trust-badge">
            <span className="trust-badge-icon">🔒</span>
            100% Encrypted
          </div>
          <div className="trust-badge">
            <span className="trust-badge-icon">📊</span>
            Real UNDP Data
          </div>
          <div className="trust-badge">
            <span className="trust-badge-icon">🎯</span>
            97.5% Accuracy
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="landing-features container">
        <div className="section-eyebrow">
          <div className="eyebrow-pill">
            <span className="eyebrow-pill-icon">🧠</span>
            CAPABILITIES
          </div>
        </div>
        <h2 className="section-heading">Everything you need for HDI analysis</h2>
        <p className="section-desc">
          From instant predictions to historical tracking and AI-powered insights,
          HDI Insight gives researchers and policymakers a complete toolkit.
        </p>

        <div className="features-grid">
          <div className="glass-card glass-card-interactive feature-card">
            <div className="feature-icon">📈</div>
            <h3 className="feature-title">ML-Powered Predictions</h3>
            <p className="feature-desc">
              Linear Regression model trained on 204 countries achieving an R² of
              0.975. Enter four indicators and receive instant HDI classification.
            </p>
          </div>

          <div className="glass-card glass-card-interactive feature-card">
            <div className="feature-icon">🗂️</div>
            <h3 className="feature-title">Historical Tracking</h3>
            <p className="feature-desc">
              Every prediction is securely stored in your private MongoDB Atlas
              profile. Track simulations, compare scenarios, and export data.
            </p>
          </div>

          <div className="glass-card glass-card-interactive feature-card">
            <div className="feature-icon">🤖</div>
            <h3 className="feature-title">AI Development Assistant</h3>
            <p className="feature-desc">
              Chat with our Gemini-powered assistant to understand HDI methodology,
              interpret results, or run predictions through natural conversation.
            </p>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="how-it-works container">
        <div className="section-eyebrow">
          <div className="eyebrow-pill">
            <span className="eyebrow-pill-icon">⚡</span>
            HOW IT WORKS
          </div>
        </div>
        <h2 className="section-heading">Three steps to insight</h2>
        <p className="section-desc">
          Get from raw indicators to actionable development intelligence in under 60 seconds.
        </p>

        <div className="steps-grid">
          <div className="glass-card glass-card-interactive step-card">
            <div className="step-number">1</div>
            <h3 className="step-title">Enter Indicators</h3>
            <p className="step-desc">
              Input life expectancy, schooling years, and GNI per capita — or use
              preset country profiles for quick analysis.
            </p>
          </div>

          <div className="glass-card glass-card-interactive step-card">
            <div className="step-number">2</div>
            <h3 className="step-title">Get Prediction</h3>
            <p className="step-desc">
              Our ML model processes your data through a trained pipeline, scaling
              and predicting the composite HDI score in real time.
            </p>
          </div>

          <div className="glass-card glass-card-interactive step-card">
            <div className="step-number">3</div>
            <h3 className="step-title">Explore Insights</h3>
            <p className="step-desc">
              Receive a development tier classification with contextual policy
              insights and detailed metric breakdowns.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Bottom CTA ─── */}
      <section className="landing-bottom-cta container" style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, rgba(6, 182, 212, 0.08) 0%, transparent 60%)',
          pointerEvents: 'none',
          zIndex: 0
        }}></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-heading">Ready to analyze development?</h2>
        <p className="section-desc">
          Join researchers and policymakers using AI to decode human development.
        </p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create Free Account
          <span className="btn-icon">→</span>
        </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;
