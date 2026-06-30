import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const userData = await loginUser(formData.email, formData.password);
      onLoginSuccess(userData);
    } catch (err) {
      setError(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card animate-slide-up">
        {/* Icon badge */}
        <div className="auth-icon-badge">🌐</div>

        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">
          Sign in to access your predictions and AI insights.
        </p>

        {error && (
          <div className="alert alert-danger">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                disabled={isLoading}
                className="form-control has-icon"
                required
              />
              <span className="input-icon">✉️</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={isLoading}
                className="form-control has-icon"
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block btn-lg submit-btn" disabled={isLoading}>
            {isLoading ? (
              <span className="spinner-container">
                <span className="spinner"></span> Signing In...
              </span>
            ) : (
              <>Sign In <span className="btn-icon">→</span></>
            )}
          </button>
        </form>

        <div className="auth-divider">
          Don't have an account?{' '}
          <Link to="/register" className="auth-switch-link">Create Account</Link>
        </div>

        <Link to="/" className="auth-back-link">← Back to Landing</Link>
      </div>
    </div>
  );
};

export default Login;
