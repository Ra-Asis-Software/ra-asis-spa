import { jwtDecode } from "jwt-decode";
import PropTypes from "prop-types";

const RoleRestricted = ({ allowedRoles, children }) => {
  // Retrieve JWT token from local storage
  const token = localStorage.getItem("authToken");

  // If no token exists, we don't render anything (user not authenticated)
  if (!token) return null;

  try {
    // Here I use jwtDecode to decode the JWT to extract the user's role
    const { role } = jwtDecode(token);
    return allowedRoles.includes(role) ? children : null;
  } catch {
    return null;
  }
};

// Finally I validate the Prop type
RoleRestricted.propTypes = {
  allowedRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleRestricted;
