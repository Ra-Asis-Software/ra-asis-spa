import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { featuresContent } from "../../data/featuresOverviewData";

const FeaturesOverview = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  return (
    <div className="features-overview">
      <div className="features-heading">
        <h2>Features Overview</h2>
      </div>
      <div className="features-descriptions">
        {featuresContent.map((featureContent) => (
          <div key={featureContent.id} className="feature-box">
            <img src={featureContent.image} alt={featureContent.title} />
            <div className="descriptions-texts">
              <h3>{featureContent.title}</h3>
              <p>{featureContent.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="features-cta-buttons">
        <Link to={isLoggedIn ? "/dashboard" : "/register"}>
          {isLoggedIn ? "DASHBOARD" : "SIGN UP"}
        </Link>
        <Link to="/contact">REQUEST A DEMO</Link>
      </div>
    </div>
  );
};

export default FeaturesOverview;
