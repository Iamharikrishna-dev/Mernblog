import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import BlogDetails from './pages/BlogDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateBlog from './pages/CreateBlog';
import Header from './components/Header';
import Footer from './components/Footer';
import EditProfile from "./components/EditProfile";
import MyBlogs from "./components/MyBlogs";
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem('userInfo') || !!sessionStorage.getItem('userInfo'); // Check login state from localStorage or sessionStorage
  });

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(!!localStorage.getItem('userInfo') || !!sessionStorage.getItem('userInfo')); // Update login state on storage change
    };

    window.addEventListener('storage', handleStorageChange); // Sync across tabs
    return () => {
      window.removeEventListener('storage', handleStorageChange); // Cleanup
    };
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      
      
      <main>
        <Routes>
          {/* Home is accessible without login */}
          <Route path="/" element={<Home isLoggedIn={isLoggedIn} />} />

          {/* Blog details accessible without login */}
          <Route path="/blogs/:id" element={<BlogDetails />} />

          {/* Public Routes */}
          <Route 
            path="/login" 
            element={isLoggedIn ? <Navigate to="/" /> : <Login setIsLoggedIn={setIsLoggedIn} />} 
          />
          <Route 
            path="/register" 
            element={isLoggedIn ? <Navigate to="/" /> : <Register />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/create" 
            element={isLoggedIn ? <CreateBlog /> : <Navigate to="/login" />} 
          />
          <Route path="/edit-profile" element={isLoggedIn ? <Navigate to="/" /> :<EditProfile />} />
          <Route path="/my-blogs" element={<MyBlogs />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
