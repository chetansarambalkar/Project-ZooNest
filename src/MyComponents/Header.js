import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser =
      JSON.parse(sessionStorage.getItem("user")) || JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    localStorage.removeItem("user");
    setUser(null);
    setProfileMenuOpen(false);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </button>
        <ul className={`navbar-menu ${menuOpen ? "open" : ""}`} onClick={() => setMenuOpen(false)}>
          <li className="navbar-item"><Link to="/">Home</Link></li>
          <li>|</li>
          <li className="navbar-item"><Link to="/about">About</Link></li>
          <li>|</li>
          <li className="navbar-item"><Link to="/contact">Contact</Link></li>
          <li>|</li>
          <li className="navbar-item"><Link to="/gallary">Gallary</Link></li>
          <li>|</li>
          <li className="navbar-item"><Link to="/event">Event</Link></li>
        </ul>

        {user ? (
          <div className="profile-section">
            <div className="profile" onClick={() => setProfileMenuOpen(!profileMenuOpen)}>
              <img
                src={user.profileImage ? user.profileImage : "/profile.webp"}
                alt="Profile"
                className="profile-img"
              />
              <span className="profile-name">{user.name}</span>
            </div>
            <div className={`profile-menu ${profileMenuOpen ? "open" : ""}`}>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/register" className="auth-btn">
              Register
            </Link>
            <Link to="/login" className="auth-btn">
              Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
