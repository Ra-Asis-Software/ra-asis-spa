import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Footer.module.css";
import { footerLinkContainers } from "../../data/footerLinksData.js";
import { footerSocials } from "../../data/footerSocialsData.js";

const Footer = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  // Handle Why Us? link click
  const handleWhyUsLinkClick = () => {
    const whyUs = document.getElementById("why_choose");
    whyUs.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle About Us link click
  const handleAboutUsLinkClick = () => {
    const aboutUs = document.getElementById("landing_intro");
    aboutUs.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Handle Contact Us link click
  const handleContactLinkClick = () => {
    const contact = document.getElementById("support");
    contact.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Update only the "Popular Links" section
  const updatedFooterLinks = footerLinkContainers.map((container) => {
    if (container.className === styles.popularLinks) {
      return {
        ...container,
        containerLinks: container.containerLinks.map((link) => {
          if (link.linkText === "Register") {
            return isLoggedIn
              ? { linkText: "Dashboard", linkTo: "/dashboard" }
              : link;
          }
          if (link.linkText === "Login") {
            return isLoggedIn
              ? {
                  linkText: "Logout",
                  linkTo: "#",
                  onClick: (e) => {
                    e.preventDefault();
                    handleLogout();
                  },
                }
              : link;
          }
          return link;
        }),
      };
    }
    return container;
  });

  return (
    <footer className={styles.landingFooter}>
      <div className={styles.logoNameSocials}>
        <div className={styles.logoName}>
          <Link to="/">
            <img
              src="/assets/spa_site_icon.webp"
              alt="SPA logo"
              className={styles.footerLogo}
            />
          </Link>
          <div className={styles.appFooterTexts}>
            <h3 className={styles.appName}>Ra'Analytica</h3>
            <p className={styles.appTagline}>Student Progress Analytics</p>
          </div>
        </div>
        <div className={styles.socials}>
          {footerSocials.map((footerSocial) => (
            <Link
              key={footerSocial.id}
              to={footerSocial.linkTo}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i
                className={`fa-brands ${footerSocial.socialIcon} ${styles.socialIcon}`}
              />
            </Link>
          ))}
        </div>
      </div>
      {updatedFooterLinks.map((footerLinkContainer) => (
        <div
          key={footerLinkContainer.id}
          className={`${footerLinkContainer.className} ${styles.footerLinks}`}
        >
          <h3 className={styles.containerHeading}>
            {footerLinkContainer.containerHeading}
          </h3>
          {footerLinkContainer.containerHeading === "Company" && (
            <Link
              onClick={handleWhyUsLinkClick}
              className={styles.containerLink}
            >
              Why Ra'Analytica
            </Link>
          )}
          {footerLinkContainer.containerHeading === "Popular Links" && (
            <Link
              onClick={handleContactLinkClick}
              className={styles.containerLink}
            >
              Contact Us
            </Link>
          )}
          {footerLinkContainer.containerLinks.map((link, index) => (
            <Link
              key={index}
              to={link.linkTo}
              onClick={link.onClick || undefined}
              className={styles.containerLink}
            >
              {link.linkText}
            </Link>
          ))}
          {footerLinkContainer.containerHeading === "Company" && (
            <Link
              onClick={handleAboutUsLinkClick}
              className={styles.containerLink}
            >
              About Us
            </Link>
          )}
        </div>
      ))}
    </footer>
  );
};

export default Footer;
