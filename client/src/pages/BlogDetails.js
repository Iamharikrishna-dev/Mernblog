import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate for routing
import axios from 'axios';
import './BlogDetails.css';
import backIc from '../icons/back.png';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const BlogDetails = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // Fetch blog details
    const fetchBlog = async () => {
      const { data } = await axios.get(`https://mernblog-six.vercel.app/api/blogs/${id}`);
      setBlog(data);
      setComments(data.comments);
      setLikes(data.likes.length); // Assuming likes is an array of user IDs
    };
    fetchBlog();
  }, [id]);

  const handleAddComment = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        alert('Please log in to comment');
        return;
      }
  
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          'Content-Type': 'application/json',
        },
      };
  
      const { data } = await axios.post(
        `https://mernblog-six.vercel.app/api/blogs/${id}/comments`,
        { text: newComment },
        config
      );
  
      setComments(data); // Update comments with response
      setNewComment(''); // Clear input field
    } catch (error) {
      console.error('Failed to add comment', error);
      alert('An error occurred while adding your comment.');
    }
  };
  
  const handleLike = async () => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      const token = userInfo?.token;
      

      if (!token) {
        alert('Please log in');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `https://mernblog-six.vercel.app/api/blogs/${id}/like`,
        {},
        config
      );
      setLikes(data.likes.length); // Update likes count
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('An error occurred. Please try again.');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/blog/${id}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Blog URL copied to clipboard!');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  if (!blog) return <p>Loading...</p>;

  let blogContent;
  try {
    const contentState = convertFromRaw(JSON.parse(blog.content));
    blogContent = stateToHTML(contentState);
  } catch (error) {
    console.error('Error parsing blog content:', error);
    blogContent = blog.content;
  }

  return (
    <div className="blog-details">
      <div className="blog-card">
        {/* Back Button */}
        <button className="back-button" onClick={handleGoBack}>
          <img src={backIc} alt="Back Icon" width="40" height="40" />
        </button>
      
        <div className="blog-card__content">
          {blog.image && (
            <img
              src={`https://mernblog-six.vercel.app/${blog.image}`}
              alt={blog.title}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
          <h1>{blog.title}</h1>
          <div class="blog-cin" dangerouslySetInnerHTML={{ __html: blogContent }} />
          <p>
            <strong>Author:</strong> {blog.author.username}
          </p>
          <div className="blog-card__actions">
            <button onClick={handleLike}>❤️ Like ({likes})</button>
            <button onClick={handleShare}>🔗 Share</button>
          </div>
        </div>
      </div>

      <h3>Comments</h3>
      <div className="comments-section">
        {comments.map((comment) => (
          <div key={comment._id} className="comment">
            <p>{comment.text}</p>
            <small>By {comment.user?.username || 'Anonymous'}</small>
          </div>
        ))}
      </div>

      <div className="add-comment">
        <h4>Add a Comment</h4>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write your comment here..."
        />
        <button onClick={handleAddComment}>Submit</button>
      </div>
    </div>
  );
};

export default BlogDetails;
