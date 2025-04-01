import React from "react";
import { Link } from "react-router-dom";

const Introduction = () => {
    return (
        <div className="landing-intro">
            <h1>Empower Student Success With Real-Time Analytics</h1>
            <video id="intro_video" src="/assets/landing_intro.mp4" autoPlay muted loop />
            <Link to="/register">SIGN UP FOR FREE!</Link>
        </div>
    );
}

export default Introduction;