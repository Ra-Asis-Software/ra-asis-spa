import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Introduction.module.css";

const Introduction = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  return (
    <div className={styles.landingIntro}>
      <h1>Empower Student Success With Real-Time Analytics</h1>
      <video
        className={styles.introVideo}
        src="/assets/landing_intro.mp4"
        autoPlay
        muted
        loop
      />
      <Link to={isLoggedIn ? "/dashboard" : "/register"}>
        {isLoggedIn ? "GO TO YOUR DASHBOARD" : "SIGN UP FOR FREE!"}
      </Link>
    </div>
  );
};

export default Introduction;
