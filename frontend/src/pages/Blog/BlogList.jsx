import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getBlogPosts } from '../../services/api';

const BlogList = ({ user, onOpenPricing }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper app-loader">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: 600, width: '100%' }}>
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container blog-page">
      <div className="dashboard-header">
        <div className="eyebrow-pill">Insights</div>
        <h1 className="hero-headline">
          Development <span className="accent">Blog</span>
        </h1>
        <p className="hero-subtitle">
          Latest analysis on human development, economics, and predictive health.
        </p>
      </div>

      <div className="blog-grid">
        {posts.map((post) => (
          <Link to={`/blog/${post.slug}`} key={post._id} className="blog-card-link">
            <div className="glass-card blog-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <span className="badge badge-medium">{post.category}</span>
                {post.isPremiumOnly && (
                  <span className="badge badge-premium">
                    💎 Premium
                  </span>
                )}
              </div>
              <h2 className="blog-card-title">
                {post.title}
              </h2>
              <p className="blog-card-excerpt" style={{ flexGrow: 1 }}>
                {post.excerpt}
              </p>
              <div className="blog-card-meta" style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem' }}>
                <span>{post.readTimeMinutes} min read</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {!user?.isPremium && (
        <div className="glass-card" style={{ 
          maxWidth: 1000, 
          margin: '4rem auto 0', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(217,70,239,0.1))',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}>
          <h3 style={{ color: '#fff', marginBottom: '1rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 700 }}>Unlock Premium Insights</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
            Get unlimited access to exclusive data analysis and predictive health reports.
          </p>
          <button className="btn btn-primary" onClick={onOpenPricing}>
            View Premium Plans
          </button>
        </div>
      )}
    </div>
  );
};

export default BlogList;
