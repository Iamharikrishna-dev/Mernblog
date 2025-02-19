import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProfileMenu.css"; // Add appropriate styles

const ProfileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userInfo"); // Clear user info
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className="profile-menu">
      <button onClick={() => setIsOpen(!isOpen)} className="profile-button">
        Profile
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button onClick={() => navigate("/edit-profile")}>Edit Profile</button>
          <button onClick={() => navigate("/my-blogs")}>Edit My Blogs</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default ProfileMenu;
