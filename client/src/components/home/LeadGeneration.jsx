import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./LeadGeneration.module.css";

const LeadGeneration = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  return (
    <div className={styles.leadGeneration}>
      <div className={styles.leadGenerationImage}>
        <img
          src="/assets/think_want_get.webp"
          alt="Think it want it get it graphic"
        />
        <img
          src="/assets/think_want_get_res.webp"
          alt="Think it want it get it graphic"
          className={styles.mobileResponsive}
        />
      </div>
      <div className={styles.leadGenerationLinks}>
        <Link to="">REQUEST A DEMO</Link>
        <Link to={isLoggedIn ? "/dashboard" : "/register"}>
          {isLoggedIn ? "GO TO DASHBOARD" : "SIGN UP FOR FREE"}
        </Link>
      </div>
    </div>
  );
};

export default LeadGeneration;
