import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatbotButton from './components/chatbot/ChatbotButton';
import ChatbotPanel from './components/chatbot/ChatbotPanel';
import PricingModal from './components/pricing/PricingModal';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import BlogList from './pages/Blog/BlogList';
import BlogPost from './pages/Blog/BlogPost';
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PaymentCancel from './pages/Payment/PaymentCancel';
import BackgroundParticles from './components/BackgroundParticles';

/* ── Auth-protected route wrapper ── */
const ProtectedRoute = ({ user, children }) => {
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

/* ── Public-only route (redirect logged-in users away) ── */
const PublicRoute = ({ user, children }) => {
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

/* ── Inner app (needs router context for useNavigate) ── */
const AppContent = () => {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [showPricing, setShowPricing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  /* Restore session */
  useEffect(() => {
    try {
      const stored = localStorage.getItem('hdiUser');
      if (stored) setUser(JSON.parse(stored));
    } catch { /* noop */ }
    setIsInitializing(false);
  }, []);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('hdiUser', JSON.stringify(userData));
    navigate('/dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('hdiUser');
    setChatOpen(false);
    navigate('/');
  };

  const updateUserCredits = useCallback((newCredits) => {
    setUser((prev) => {
      const updated = { ...prev, credits: newCredits };
      localStorage.setItem('hdiUser', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handlePredictFromChat = (predictData) => {
    // Navigate to dashboard if not already there, prediction will be triggered via URL state
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard', { state: { predictData } });
    }
    // If already on dashboard, we rely on Home component to handle it via prop
    setChatOpen(false);
  };

  if (isInitializing) {
    return (
      <div className="app-loader">
        <div className="spinner"></div>
        <p>Loading HDI Insight...</p>
      </div>
    );
  }

  /* Show navbar on authenticated routes */
  const isAuthRoute = user && !['/login', '/register', '/'].includes(location.pathname);

  return (
    <>
      <BackgroundParticles />
      {isAuthRoute && (
        <Navbar
          user={user}
          onLogout={handleLogout}
          onOpenPricing={() => setShowPricing(true)}
        />
      )}

      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <PublicRoute user={user}>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute user={user}>
              <Login onLoginSuccess={handleAuthSuccess} />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute user={user}>
              <Register onRegisterSuccess={handleAuthSuccess} />
            </PublicRoute>
          }
        />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user}>
              <div className="page-wrapper">
                <Home user={user} onCreditsUpdate={updateUserCredits} />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/success"
          element={
            <ProtectedRoute user={user}>
              <PaymentSuccess onCreditsUpdate={updateUserCredits} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment/cancel"
          element={
            <ProtectedRoute user={user}>
              <PaymentCancel />
            </ProtectedRoute>
          }
        />

        {/* Blog Routes */}
        <Route
          path="/blog"
          element={
            <ProtectedRoute user={user}>
              <div className="page-wrapper">
                <BlogList user={user} onOpenPricing={() => setShowPricing(true)} />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <ProtectedRoute user={user}>
              <div className="page-wrapper">
                <BlogPost onOpenPricing={() => setShowPricing(true)} />
                <Footer />
              </div>
            </ProtectedRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Chatbot — visible on all authenticated routes */}
      {user && (
        <>
          <ChatbotButton onClick={() => setChatOpen(!chatOpen)} isOpen={chatOpen} />
          {chatOpen && (
            <ChatbotPanel
              onClose={() => setChatOpen(false)}
              credits={user.credits}
              onCreditsUpdate={updateUserCredits}
              onPredictFromChat={handlePredictFromChat}
              onOpenPricing={() => setShowPricing(true)}
            />
          )}
        </>
      )}

      {/* Global Pricing Modal */}
      {showPricing && <PricingModal onClose={() => setShowPricing(false)} />}
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
