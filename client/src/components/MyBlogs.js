import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const MyBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading] = useState(true);  // Change `useState(true)` to `loading` state variable
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBlogs = async () => {
      try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        console.log("User Info from LocalStorage:", userInfo); // Debug userInfo
    
        if (!userInfo) {
          navigate("/login");
          return;
        }
    
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
    
        console.log("Sending request with config:", config);
        const { data } = await axios.get("https://mernblog-six.vercel.app/api/blogs/mine", config);
        console.log("Fetched blogs data:", data); // Debug fetched blogs
    
        setBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error.response?.data || error.message);
        setError(error.response?.data?.message || "An error occurred");
      }
    };
    
    

    fetchMyBlogs();
  }, [navigate]);

  return (
    <div>
      <h2>My Blogs</h2>
      {loading ? (
        <p>Loading your blogs...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : blogs.length === 0 ? (
        <p>You haven't written any blogs yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog._id}>
            <h3>{blog.title}</h3>
            <p>{blog.content.substring(0, 100)}...</p> {/* Preview of blog content */}
            <button onClick={() => navigate(`/edit-blog/${blog}`)}>
              Edit Blog
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBlogs;
