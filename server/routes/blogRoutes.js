const express = require('express');
const Blog = require('../models/Blog');
const { authMiddleware } = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');
const router = express.Router();

// Cloudinary Configuration
const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: 'dgt2r0fxe',
  api_key: '559862427916353',
  api_secret: 's_l31Il6ELEQcyP_UDLyKVABvi0',
});

// Route: Get all blogs with pagination (ordered by latest)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9 } = req.query;

    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate('author', 'username');

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit);

    res.status(200).json({
      blogs,
      currentPage: Number(page),
      totalPages,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blogs', error: error.message });
  }
});

// Route: Create a new blog with image upload
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, image } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    let imageUrl = null;

    // Upload image to Cloudinary if available
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image, {
        folder: 'blog_images',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const newBlog = new Blog({
      title,
      content,
      author: req.user._id,
      image: imageUrl,
    });

    const createdBlog = await newBlog.save();
    res.status(201).json(createdBlog);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create blog', error: error.message });
  }
});

// Other routes...
module.exports = router;
