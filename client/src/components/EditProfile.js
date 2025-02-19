import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const EditBlog = () => {
  const { id } = useParams(); // Get the blog ID from the URL
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the blog details to prefill the form
    const fetchBlogDetails = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/login");
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      try {
        const { data } = await axios.get(`https://mernblog-six.vercel.app/api/blogs/${id}`, config);
        setTitle(data.title);
        setContent(data.content);
        setCategory(data.category);
      } catch (error) {
        console.error("Failed to fetch blog details", error);
      }
    };

    fetchBlogDetails();
  }, [id, navigate]);

  const handleSave = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      alert("Please log in");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    try {
      setLoading(true);
      await axios.put(
        `https://mernblog-six.vercel.app/api/blogs/${id}`,
        { title, content, category },
        config
      );
      alert("Blog updated successfully!");
      navigate("/my-blogs");
    } catch (error) {
      console.error("Failed to update blog", error);
      alert("Failed to update blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      alert("Please log in");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    };

    try {
      if (window.confirm("Are you sure you want to delete this blog?")) {
        await axios.delete(`https://mernblog-six.vercel.app/api/blogs/${id}`, config);
        alert("Blog deleted successfully!");
        navigate("/my-blogs");
      }
    } catch (error) {
      console.error("Failed to delete blog", error);
      alert("Failed to delete blog");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Edit Blog</h2>
      <div>
        <label>Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <label>Content:</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>
      <div>
        <label>Category:</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="Technology">Technology</option>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Education">Education</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={handleSave} disabled={loading}>
          Save
        </button>
        <button
          onClick={handleDelete}
          style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default EditBlog;
