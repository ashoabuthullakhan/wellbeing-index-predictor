import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/api';

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password, confirmPassword } = formData;

    if (!username || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const userData = await registerUser(username, email, password);
      onRegisterSuccess(userData);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="glass-card auth-card animate-slide-up">
        <div className="auth-icon-badge">🌐</div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">
          Sign up to start predicting HDI scores and unlock AI insights.
        </p>

        {error && (
          <div className="alert alert-danger">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <div className="input-wrapper">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="your_username"
                disabled={isLoading}
                className="form-control has-icon"
                required
              />
              <span className="input-icon">👤</span>
            </div>
          </div>

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
                placeholder="Min. 6 characters"
                disabled={isLoading}
                className="form-control has-icon"
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat password"
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
                <span className="spinner"></span> Creating Account...
              </span>
            ) : (
              <>Create Account <span className="btn-icon">→</span></>
            )}
          </button>
        </form>

        <div className="auth-divider">
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">Sign In</Link>
        </div>

        <Link to="/" className="auth-back-link">← Back to Landing</Link>
      </div>
    </div>
  );
};

export default Register;
