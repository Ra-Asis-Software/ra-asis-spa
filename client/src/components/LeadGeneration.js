import React from "react";
import { Link } from "react-router-dom";

const LeadGeneration = () => {
    return (
        <div className="lead-generation">
            <div className="lead-generation-image">
                <img src="/assets/login_image.webp" alt="" />
            </div>
            <div className="lead-generation-links">
                <Link to="">REQUEST A DEMO</Link>
                <Link to="/register">SIGN UP FOR FREE</Link>
            </div>
        </div>
    );
}

export default LeadGeneration;