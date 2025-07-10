import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const LeadGeneration = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const location = useLocation();

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIsLoggedIn(!!token);
  }, [location]); // Re-check when location changes

  return (
    <div className="lead-generation">
      <div className="lead-generation-image">
        <img
          src="/assets/think_want_get.webp"
          alt="Think it want it get it graphic"
        />
        <img
          src="/assets/think_want_get_res.webp"
          alt="Think it want it get it graphic"
          className="mobile-responsive"
        />
      </div>
      <div className="lead-generation-links">
        <Link to="">REQUEST A DEMO</Link>
        <Link to={isLoggedIn ? "/dashboard" : "/register"}>
          {isLoggedIn ? "GO TO DASHBOARD" : "SIGN UP FOR FREE"}
        </Link>
      </div>
    </div>
  );
};

export default LeadGeneration;
