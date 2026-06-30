import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBlogPost } from '../../services/api';

const BlogPost = ({ onOpenPricing }) => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPremiumGated, setIsPremiumGated] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await getBlogPost(slug);
        setPost(data);
      } catch (err) {
        if (err.message.includes('Premium')) {
          setIsPremiumGated(true);
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (isPremiumGated) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: 800 }}>
        <Link to="/blog" style={{ color: 'var(--accent-blue)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
          ← Back to Insights
        </Link>
        <div className="glass-card" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          background: 'linear-gradient(135deg, rgba(16,22,42,0.9), rgba(217,70,239,0.05))',
          border: '1px solid rgba(168, 85, 247, 0.3)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💎</div>
          <h1 style={{ color: '#fff', marginBottom: '1rem', fontFamily: 'Outfit' }}>Premium Content Locked</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
            This article contains advanced predictive analysis and is exclusively available to HDI Insight Premium members.
          </p>
          <button className="btn btn-primary" onClick={onOpenPricing} style={{ padding: '1rem 3rem' }}>
            Unlock Premium Access
          </button>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div className="alert alert-danger" style={{ maxWidth: 600, margin: '0 auto' }}>
          <span className="alert-icon">⚠️</span>
          <div className="alert-content">{error || 'Post not found.'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: 800 }}>
      <Link to="/blog" style={{ color: 'var(--accent-blue)', textDecoration: 'none', marginBottom: '2rem', display: 'inline-block' }}>
        ← Back to Insights
      </Link>

      <article className="glass-card" style={{ padding: '3rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <span className="badge badge-medium" style={{ textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>
            {post.category}
          </span>
          <h1 style={{ color: '#fff', fontSize: '2.5rem', lineHeight: 1.2, fontFamily: 'Outfit', marginBottom: '1rem' }}>
            {post.title}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginBottom: '2rem' }}>
            {post.excerpt}
          </p>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem 0'
          }}>
            <div style={{ 
              width: 40, height: 40, 
              borderRadius: '50%', 
              background: 'linear-gradient(135deg, var(--accent-blue), var(--accent-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', color: '#fff', marginRight: '1rem'
            }}>
              {post.author.charAt(0)}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 500 }}>{post.author}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                {new Date(post.createdAt).toLocaleDateString()} · {post.readTimeMinutes} min read
              </div>
            </div>
          </div>
        </div>

        <div style={{ color: 'var(--text-primary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
          {post.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} style={{ marginBottom: '1.5rem' }}>{paragraph}</p>
          ))}
        </div>
      </article>
    </div>
  );
};

export default BlogPost;
