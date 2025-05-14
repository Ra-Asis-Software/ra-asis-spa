import { Link } from "react-router-dom";

const LeadGeneration = () => {
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
        <Link to="/register">SIGN UP FOR FREE</Link>
      </div>
    </div>
  );
};

export default LeadGeneration;
