const express = require('express');
const Comment = require('../models/Comment');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();
const Blog = require('../models/Blog');


// Add a comment
router.post('/', authMiddleware, async (req, res) => {
  const { text, blogId } = req.body;
  try {
    const comment = await Comment.create({
      text,
      blog: blogId,
      author: req.user.id,
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post('/:id/comments', authMiddleware, async (req, res) => {
  const { text } = req.body;

  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const comment = {
      user: req.user._id,
      text,
      createdAt: new Date(),
    };

    blog.comments.push(comment);
    await blog.save();

    const updatedBlog = await Blog.findById(req.params.id).populate('comments.user', 'username');
    res.status(201).json(updatedBlog.comments); // Return updated comments
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment', error: error.message });
  }
});

module.exports = router;

