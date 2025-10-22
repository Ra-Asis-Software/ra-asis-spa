import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  // Handle What We Offer link click
  const handleOffersLinkClick = () => {
    const whatWeOffer = document.getElementById("features_overview");
    whatWeOffer.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle Support link click
  const handleSupportLinkClick = () => {
    const support = document.getElementById("support");
    support.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle Why Us? link click
  const handleWhyUsLinkClick = () => {
    const whyUs = document.getElementById("why_choose");
    whyUs.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <Link
          onClick={() => {
            handleOffersLinkClick();
            closeMenu();
          }}
        >
          WHAT WE OFFER
        </Link>
        <Link
          onClick={() => {
            handleSupportLinkClick();
            closeMenu();
          }}
        >
          SUPPORT
        </Link>
        <Link
          onClick={() => {
            handleWhyUsLinkClick();
            closeMenu();
          }}
        >
          WHY US?
        </Link>
        <Link to="/dashboard" onClick={closeMenu}>
          RESOURCES
        </Link>

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
