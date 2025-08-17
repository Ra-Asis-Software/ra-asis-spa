import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { featuresContent } from "../../data/featuresOverviewData";
import styles from "./FeaturesOverview.module.css";

const FeaturesOverview = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  return (
    <div className={styles.featuresOverview}>
      <div className={styles.featuresHeading}>
        <h2>Features Overview</h2>
      </div>
      <div className={styles.featuresDescriptions}>
        {featuresContent.map((featureContent) => (
          <div key={featureContent.id} className={styles.featureBox}>
            <img
              src={featureContent.image}
              alt={featureContent.title}
              className={styles.featureContentImage}
            />
            <div className={styles.descriptionsTexts}>
              <h3>{featureContent.title}</h3>
              <p>{featureContent.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.featuresCtaButtons}>
        <Link to={isLoggedIn ? "/dashboard" : "/register"}>
          {isLoggedIn ? "DASHBOARD" : "SIGN UP"}
        </Link>
        <Link to="/contact">REQUEST A DEMO</Link>
      </div>
    </div>
  );
};

export default FeaturesOverview;
