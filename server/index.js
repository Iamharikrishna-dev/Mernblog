const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const blogRoutes = require('./routes/blogRoutes');
const commentRoutes = require('./routes/commentRoutes');
const connectDB = require('./config/db');  // Importing connectDB from config/db
const path = require('path');

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
app.use(express.json());

app.use(cors({
  origin: true, // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Connect to MongoDB
connectDB();  // Just call the imported function

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/blogs', commentRoutes);


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.post('/api/users/register', (req, res) => {
  console.log('Request received:', req.body);
  res.status(200).json({ message: 'Request successful' });
});
app.post('/api/blogs', async (req, res) => {
  try {
    const { title, content } = req.body;
    const newBlog = new Blog({ title, content });
    const createdBlog = await newBlog.save();
    res.status(201).json(createdBlog); // Return the created blog
  } catch (error) {
    res.status(500).json({ message: 'Error creating blog' });
  }
});
// Express.js backend route
app.get('/api/blogs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id); // Assuming you're using MongoDB
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching blog', error });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
