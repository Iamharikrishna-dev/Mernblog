import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import logo from './blogbv.png';

import HomeIc from '../icons/home-48.png';
import logoutIc from '../icons/logout-50.png';
import writeIc from '../icons/write-48.png';
import loginIc from '../icons/login48.png';
import profileIc from '../icons/account-96.png'; // Import the profile icon
import nameIc from '../icons/name-96.png';
import emailIc from '../icons/email-96.png';

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false); // State to manage profile dropdown

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
  };

  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Blogiverse" className="logo-img" />
        </Link>
      </div>
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/"><img src={HomeIc} alt="home Icon" width="40" height="40" /></Link>
        
        {isLoggedIn && <Link to="/create"><img src={writeIc} alt="write Icon" width="40" height="40" /></Link>}
        {isLoggedIn ? (
          <>
            <div className="profile-container">
              <img src={profileIc} alt="Profile Icon" width="40" height="40" onClick={toggleProfile} className="profile-icon" />
              {profileOpen && (
                <div className="profile-dropdown">
                  <p><img src={nameIc} alt="logout Icon" width="40" height="40" /> {userInfo?.username}</p>
                  <p><img src={emailIc} alt="logout Icon" width="40" height="40" /> {userInfo?.email}</p>
                  <button className="logout-button" onClick={logoutHandler}>
                    <img src={logoutIc} alt="logout Icon" width="40" height="40" /> Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login"><img src={loginIc} alt="login Icon" width="40" height="40" /></Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
