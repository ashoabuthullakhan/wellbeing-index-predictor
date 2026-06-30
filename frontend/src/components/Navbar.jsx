import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ user, onLogout, onOpenPricing }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Brand */}
        <Link to="/dashboard" className="nav-brand" onClick={closeMobileMenu}>
          <span className="nav-brand-icon">🌐</span>
          <span className="nav-brand-text">HDI Insight</span>
        </Link>

        {/* Center nav links */}
        <div className={`nav-links ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
          <Link
            to="/dashboard"
            className={`nav-link ${location.pathname === '/dashboard' && location.hash !== '#history' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Predict
          </Link>
          <Link
            to="/dashboard#history"
            className={`nav-link ${location.hash === '#history' ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            History
          </Link>
          <Link
            to="/blog"
            className={`nav-link ${location.pathname.startsWith('/blog') ? 'active' : ''}`}
            onClick={closeMobileMenu}
          >
            Blog
          </Link>
        </div>

        {/* Right actions */}
        <div className="nav-actions">
          {/* Credit balance pill */}
          <div className="credit-pill">
            <span className="credit-pill-icon">💎</span>
            <span>{user?.credits ?? 20}</span>
            <button
              className="credit-pill-add"
              onClick={() => {
                onOpenPricing();
                closeMobileMenu();
              }}
              title="Get more credits"
            >
              +
            </button>
          </div>

          {/* User Profile Menu */}
          <div className="profile-menu-container" ref={profileRef}>
            <button 
              className="nav-avatar" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title={user?.username || 'User'}
            >
              {getInitial(user?.username)}
            </button>
            
            {isProfileOpen && (
              <div className="profile-dropdown animate-dropdown">
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-name">{user?.username || 'User'}</div>
                  <div className="profile-dropdown-email">{user?.email || 'user@example.com'}</div>
                  {user?.isPremium && <span className="badge badge-premium" style={{marginTop: '0.5rem', display: 'inline-block'}}>Premium Member</span>}
                </div>
                <div className="profile-dropdown-body">
                  <button className="profile-dropdown-item" onClick={() => {
                    setIsProfileOpen(false);
                    onLogout();
                  }}>
                    <span className="dropdown-icon">🚪</span> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
