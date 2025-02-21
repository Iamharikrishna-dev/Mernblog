import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Home.css';
import moment from 'moment';
import Modal from 'react-modal';
import ShareOptions from '../components/ShareOptions';
import { convertFromRaw } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

const Home = ({ isLoggedIn }) => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [shareDropdownOpen, setShareDropdownOpen] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const { data } = await axios.get(
          `https://mernblog-six.vercel.app/api/blogs?page=${currentPage}&limit=9`
        );
        setBlogs(data.blogs);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };
    fetchBlogs();
  }, [currentPage]);

  const handleLike = async (blogId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo'));
      if (!userInfo || !userInfo.token) {
        alert('Please log in to like the blog');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const blog = blogs.find((b) => b._id === blogId);
      const hasLiked = blog.likes?.includes(userInfo.userId);

      const url = hasLiked
        ? `https://mernblog-six.vercel.app/api/blogs/${blogId}/unlike`
        : `https://mernblog-six.vercel.app/api/blogs/${blogId}/like`;

      const { data } = await axios.post(url, {}, config);

      setBlogs((prevBlogs) =>
        prevBlogs.map((b) =>
          b._id === blogId ? { ...b, likes: data.likes } : b
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async (blogId, commentText) => {
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
        `https://mernblog-six.vercel.app/api/blogs/${blogId}/comment`,
        { text: commentText },
        config
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, comments: data } : blog
        )
      );
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const openCommentsModal = (blog) => {
    setSelectedBlog(blog);
    setIsCommentsOpen(true);
  };

  const closeModal = () => {
    setSelectedBlog(null);
    setIsCommentsOpen(false);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePageInputChange = (e) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleShareDropdown = (blogId) => {
    setShareDropdownOpen(shareDropdownOpen === blogId ? null : blogId);
  };

  return (
    <div className="home-container">
      <div className="blogs-grid">
        {blogs.length > 0 ? (
          blogs.map((blog) => (
            <div key={blog._id} className="blog-card">
              {blog.image && (
                <img src={blog.image} alt={blog.title} className="blog-image" />
              )}

              <h2>{blog.title}</h2>
              <div className="blog-cin">
                {(() => {
                  try {
                    const contentState = convertFromRaw(JSON.parse(blog.content));
                    const htmlContent = stateToHTML(contentState);
                    const plainText = contentState.getPlainText();
                    const shouldShowReadMore = plainText.length > 200;

                    return (
                      <div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: shouldShowReadMore
                              ? `${htmlContent.slice(0, 200)}...`
                              : htmlContent,
                          }}
                        />
                        {shouldShowReadMore && (
                          <p>
                            <a href={`/blogs/${blog._id}`}>Read More</a>
                          </p>
                        )}
                      </div>
                    );
                  } catch (error) {
                    console.error('Error parsing blog content:', error);
                    return (
                      <p>
                        {blog.content.slice(0, 200)}...{' '}
                        <a href={`/blogs/${blog._id}`}>Read More</a>
                      </p>
                    );
                  }
                })()}
              </div>
              <div className="blog-meta">
                <p>
                  {blog.author?.username || 'Anonymous'} |{' '}
                  {moment().diff(moment(blog.createdAt), 'days') > 1
                    ? moment(blog.createdAt).format('MMMM Do YYYY')
                    : moment(blog.createdAt).fromNow()}
                </p>
              </div>
              <div className="blog-actions">
                <button onClick={() => handleLike(blog._id)}>
                  {Array.isArray(blog.likes) &&
                  blog.likes.includes(localStorage.getItem('userId'))
                    ? '💔 Unlike'
                    : '❤️ Like'}{' '}
                  {Array.isArray(blog.likes) ? blog.likes.length : 0}
                </button>
                <button onClick={() => toggleShareDropdown(blog._id)}>
                  🔗 Share
                </button>
                {shareDropdownOpen === blog._id && (
                  <ShareOptions blogId={blog._id} closeDropdown={() => setShareDropdownOpen(null)} />
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-blogs">No blogs available.</p>
        )}
      </div>
      
      {/* Pagination */}
      <div className="pagination">
        <button
          className="side-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <div className="pagination-input">
          <label htmlFor="page-number">Page</label>
          <input
            type="number"
            id="page-number"
            value={currentPage}
            onChange={handlePageInputChange}
            min="1"
            max={totalPages}
          />
          <span>of {totalPages}</span>
        </div>
        <button
          className="side-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* Comments Modal */}
      <Modal
        isOpen={isCommentsOpen}
        onRequestClose={closeModal}
        contentLabel="Comments"
        className="modal"
        overlayClassName="overlay"
      >
        {selectedBlog && (
          <div>
            <h3>Comments</h3>
            <div className="comments-container">
              {selectedBlog.comments?.length > 0 ? (
                selectedBlog.comments.map((comment) => (
                  <div key={comment._id} className="comment">
                    <p>
                      <strong>{comment.author?.username || 'Guest'}:</strong>{' '}
                      {comment.text}
                    </p>
                    <span>{moment(comment.createdAt).fromNow()}</span>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>
            {isLoggedIn && (
              <div className="add-comment">
                <textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                ></textarea>
                <button
                  onClick={() =>
                    handleAddComment(selectedBlog._id, newComment)
                  }
                  disabled={!newComment.trim()}
                >
                  Add Comment
                </button>
              </div>
            )}
            <button onClick={closeModal}>Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Home;
