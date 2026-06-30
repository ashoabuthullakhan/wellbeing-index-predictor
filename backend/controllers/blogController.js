const BlogPost = require('../models/BlogPost');

// @desc    Get all blog posts (metadata only for list view)
// @route   GET /api/blog
// @access  Protected
exports.getPosts = async (req, res) => {
  try {
    // Return all posts but exclude full content for the list view to save bandwidth
    const posts = await BlogPost.find()
      .select('-content')
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    console.error('Blog fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch blog posts.' });
  }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog/:slug
// @access  Protected
exports.getPostBySlug = async (req, res) => {
  try {
    const post = await BlogPost.findOne({ slug: req.params.slug });
    
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found.' });
    }

    // Check premium gating
    // If the post is premium-only, and the user is NOT premium, deny access
    if (post.isPremiumOnly && (!req.user || !req.user.isPremium)) {
      return res.status(403).json({ 
        error: 'This is a premium article. Upgrade to Premium to read it.',
        isPremiumOnly: true
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Blog fetch error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch blog post.' });
  }
};
