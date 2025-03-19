import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="landing-footer" id="landing">
            <div className="logo-name-socials">
                <div className="logo-name">
                    <Link to="/"><img src="/assets/spa_site_icon.webp" alt="SPA logo" /></Link>
                    <h3>Ra'Asis Analytica</h3>
                </div>
                <div className="socials">
                    <Link to="https://web.facebook.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook"></i></Link>
                    <Link to="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></Link>
                    <Link to="#" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin"></i></Link>
                    <Link to="#" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-x-twitter"></i></Link>
                    <Link to="https://api.whatsapp.com/send?phone=254742807455" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></Link>
                </div>
            </div>
            <div className="what-we-offer footer-links">
                <h3>What We Offer</h3>
                <Link to="/#">Intuitive Dashboards</Link>
                <Link to="/#">Student Analytics</Link>
                <Link to="/#">Progress Reports</Link>
                <Link to="/#">Notifications</Link>
                <Link to="/#">Reminders</Link>
            </div>
            <div className="company footer-links">
                <h3>Company</h3>
                <Link to="/#">Why Ra'Asis Analytica</Link>
                <Link to="/#">Become a Partner</Link>
                <Link to="/#">Our Partners</Link>
                <Link to="/#">About Us</Link>
            </div>
            <div className="popular-links footer-links">
                <h3>Popular Links</h3>
                <Link to="/#">Contact Us</Link>
                <Link to="/#">Resources</Link>
                <Link to="/register">Register</Link>
                <Link to="/login">Login</Link>
            </div>
        </footer>
    );
}

export default Footer;