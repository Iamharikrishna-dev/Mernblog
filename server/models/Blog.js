const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: String,
      enum: ['Technology', 'Lifestyle', 'Education', 'Entertainment', 'Other'],
      default: 'Other',
    },
    tags: {
      type: [String],
      default: [],
    },
    thumbnail: {
      type: String,
      default: '',
    },
    image: {
      type: String, // Store image path
  },
  // Existing fields
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],

  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);
