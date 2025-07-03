import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../data/headerNavData";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  // Toggle opening and closing menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on user selection
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/");
    closeMenu();
  };

  return (
    <header className="landing-header" id="landing_header">
      <div className="app-logo">
        <Link to="/">
          <img src="/assets/spa_logo.webp" alt="SPA logo" />
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className="mobile-menu-icon" onClick={toggleMenu}>
        <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`}></i>
      </div>

      <nav className={`main-navigation ${isMenuOpen ? "active" : ""}`}>
        {/* Common navigation items */}
        {navItems.slice(0, 5).map((navItem) => (
          <Link
            key={navItem.id}
            to={navItem.linkTo}
            className={location.pathname === navItem.linkTo ? "active" : ""}
            onClick={closeMenu}
          >
            {navItem.linkText}
            {navItem.hasDropdownMenu && (
              <i className="fa-solid fa-chevron-down"></i>
            )}
          </Link>
        ))}

        {/* Conditional navigation items */}
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className={location.pathname === "/dashboard" ? "active" : ""}
              onClick={closeMenu}
            >
              DASHBOARD
            </Link>
            <button onClick={handleLogout} className="logout-button">
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={location.pathname === "/register" ? "active" : ""}
              onClick={closeMenu}
            >
              REGISTER
            </Link>
            <Link
              to="/login"
              className={location.pathname === "/login" ? "active" : ""}
              onClick={closeMenu}
            >
              LOGIN
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
