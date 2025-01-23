import React from "react";
import { Link } from "react-router-dom";

const Header = () => {

    return(
        <header className="landing-header" id="landing_header">
            <div className="app-logo">
                <Link to="/">
                    <img src="/assets/spa_logo.svg" alt="SPA logo" />
                </Link>
            </div>
            <nav className="main-navigation">
                <Link to="#">WHAT WE OFFER<i className="fa-solid fa-chevron-down"></i></Link>
                <Link to="#">SUPPORT</Link>
                <Link to="#">COMPANY</Link>
                <Link to="#">RESOURCES</Link>
                <Link to="#">SEARCH</Link>
                <Link to="#">REGISTER / LOGIN</Link>
            </nav>
        </header>
    );
}

export default Header;