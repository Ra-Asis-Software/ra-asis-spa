import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { navItems } from "../../data/headerNavData";

const Header = () => {
  // State to track opening and closing of responsive menu
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation(); // Will use this to track current route to set active class

  // Toggle opening and closing menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Close menu on user selection
  const closeMenu = () => {
    setIsMenuOpen(false);
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
        {navItems.map((navItem) => (
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
      </nav>
    </header>
  );
};

export default Header;
