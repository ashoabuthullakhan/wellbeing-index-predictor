const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getPosts, getPostBySlug } = require('../controllers/blogController');

// GET /api/blog — Get all posts (metadata)
router.get('/', protect, getPosts);

// GET /api/blog/:slug — Get single post by slug
router.get('/:slug', protect, getPostBySlug);

module.exports = router;
