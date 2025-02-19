const Blog = require('../models/Blog');

// Get all blogs with author populated
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate('author', 'username');
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get blogs written by the logged-in user
const getMyBlogs = async (req, res) => {
  try {
    console.log("Request user in /mine:", req.user);

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const blogs = await Blog.find({ author: req.user._id });
    console.log("Blogs fetched for user:", blogs);

    if (!blogs.length) {
      return res.status(404).json({ message: "No blogs found for this user" });
    }

    res.json(blogs);
  } catch (error) {
    console.error("Error in /mine controller:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// Controller: Blog creation with image
const createBlog = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    let imageBase64 = null;

    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
      image: imageBase64,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};
// Controller: Blog creation with image
const createBlog = async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: 'Title and content are required' });
  }

  try {
    let imageBase64 = null;

    if (req.file) {
      imageBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const blog = await Blog.create({
      title,
      content,
      author: req.user._id,
      image: imageBase64,
    });

    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog', error: error.message });
  }
};

// Like a blog
const likeBlog = async (req, res) => {
  const { blogId } = req.params;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    blog.likes += 1;  // Increment the likes
    await blog.save();

    res.status(200).json({ message: 'Blog liked successfully', likes: blog.likes });
  } catch (error) {
    console.error('Error liking the blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a comment to a blog
const addCommentToBlog = async (req, res) => {
  const { blogId } = req.params;
  const { text } = req.body;

  try {
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    const newComment = {
      user: req.user.id,  // Assuming `req.user.id` is the logged-in user
      text,
    };

    // Push the new comment to the blog's comments array
    blog.comments.push(newComment);
    await blog.save();

    res.status(200).json({ message: 'Comment added successfully', comment: newComment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getAllBlogs, getUserBlogs, createBlog, likeBlog, addCommentToBlog };
