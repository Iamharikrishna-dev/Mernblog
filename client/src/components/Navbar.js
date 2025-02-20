import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "./blogbv.png";

import HomeIc from "../icons/home-48.png";
import logoutIc from "../icons/logout-50.png";
import writeIc from "../icons/write-48.png";
import loginIc from "../icons/login48.png";
import profileIc from "../icons/account-96.png";
import nameIc from "../icons/name-96.png";
import emailIc from "../icons/email-96.png";

const Navbar = ({ isLoggedIn, setIsLoggedIn }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);
  const profileRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const toggleProfile = () => {
    setProfileOpen((prev) => !prev);
  };

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    setIsLoggedIn(false);
  };

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // ✅ Close navbar & profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        profileRef.current && !profileRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Blogiverse" className="logo-img" />
        </Link>
      </div>

      {/* Hamburger Menu (Mobile) */}
      <button className="hamburger-menu" onClick={toggleMenu}>
        ☰
      </button>

      {/* Navbar Links */}
      <div ref={menuRef} className={`navbar-links ${menuOpen ? "active" : ""}`}>
        <Link to="/">
          <img src={HomeIc} alt="home Icon" width="40" height="40" />
        </Link>

        {isLoggedIn && (
          <Link to="/create">
            <img src={writeIc} alt="write Icon" width="40" height="40" />
          </Link>
        )}

        {/* ✅ Show Either Profile OR Login Icon (Not Both) */}
        {isLoggedIn ? (
          // ✅ Profile Icon (Only when logged in)
          <div ref={profileRef} className="profile-container">
            <img
              src={profileIc}
              alt="Profile Icon"
              width="40"
              height="40"
              onClick={toggleProfile}
              className="profile-icon"
            />

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="profile-dropdown">
                <p>
                  <img src={nameIc} alt="User" width="40" height="40" />{" "}
                  {userInfo?.username}
                </p>
                <p>
                  <img src={emailIc} alt="Email" width="40" height="40" />{" "}
                  {userInfo?.email}
                </p>
                <button className="logout-button" onClick={logoutHandler}>
                  <img src={logoutIc} alt="Logout" width="40" height="40" />{" "}
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          // ✅ Login Icon (Only when NOT logged in)
          <Link to="/login">
            <img src={loginIc} alt="login Icon" width="40" height="40" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
