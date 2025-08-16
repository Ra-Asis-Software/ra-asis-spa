import React, { useEffect, useState } from "react";
import styles from "./Header.module.css";
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
    <header className={styles.landingHeader}>
      <div className="app-logo">
        <Link to="/">
          <img src="/assets/spa_logo.webp" alt="SPA logo" />
        </Link>
      </div>

      {/* Mobile Menu Icon */}
      <div className={styles.mobileMenuIcon} onClick={toggleMenu}>
        <i className={`fa-solid ${isMenuOpen ? "fa-xmark" : "fa-bars"}`} />
      </div>

      <nav
        className={`${styles.mainNavigation} ${
          isMenuOpen ? styles.active : ""
        }`}
      >
        {/* Common navigation items */}
        {navItems.slice(0, 5).map((navItem) => (
          <Link
            key={navItem.id}
            to={navItem.linkTo}
            className={
              location.pathname === navItem.linkTo ? styles.active : ""
            }
            onClick={closeMenu}
          >
            {navItem.linkText}
            {navItem.hasDropdownMenu && (
              <i className="fa-solid fa-chevron-down" />
            )}
          </Link>
        ))}

        {/* Conditional navigation items */}
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className={
                location.pathname === "/dashboard" ? styles.active : ""
              }
              onClick={closeMenu}
            >
              DASHBOARD
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton}>
              LOGOUT
            </button>
          </>
        ) : (
          <>
            <Link
              to="/register"
              className={location.pathname === "/register" ? styles.active : ""}
              onClick={closeMenu}
            >
              REGISTER
            </Link>
            <Link
              to="/login"
              className={location.pathname === "/login" ? styles.active : ""}
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
