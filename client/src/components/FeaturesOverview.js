import React, { Link } from "react-router-dom";

const FeaturesOverview = () => {
    return (
        <div className="features-overview">
            <div className="features-heading">
                <h2>Features Overview</h2>
            </div>
            <div className="features-descriptions">
                <div className="feature-box">
                    <img src="/assets/login_image.webp" alt="" />
                    <div className="descriptions-texts">
                        <h3>User-Friendly Dashboards</h3>
                        <p>Get real-time updates and personalised insights, as you navigate an intuitive dashboard tailored for you to easily track your academic progress.</p>
                    </div>
                </div>
                <div className="feature-box">
                    <img src="/assets/login_image.webp" alt="" />
                    <div className="descriptions-texts">
                        <h3>Student Progress Reports</h3>
                        <p>Gain actionable insights with detailed performance metrics, trends and customisable reports designed to monitor outcomes for future planning.</p>
                    </div>
                </div>
                <div className="feature-box">
                    <img src="/assets/login_image.webp" alt="" />
                    <div className="descriptions-texts">
                        <h3>Reminders & Notifications</h3>
                        <p>Never miss a task with smart reminders and seamless calendar integration, keeping students, teachers and parents organized and informed.</p>
                    </div>
                </div>
                <div className="feature-box">
                    <img src="/assets/login_image.webp" alt="" />
                    <div className="descriptions-texts">
                        <h3>Collaborative Tools</h3>
                        <p>Enhanced teamwork with intuitive group chats, shared documents and collective performance tracking for an enriched learning experience.</p>
                    </div>
                </div>
            </div>
            <div className="features-cta-buttons">
                <Link to="/register">SIGN UP</Link>
                <Link to="/contact">REQUEST A DEMO</Link>
            </div>
        </div>
    );
}

export default FeaturesOverview;