import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("authToken");
  const navigate = useNavigate();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);

    // Check if token is expired and logout if so
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      navigate("/login");
    }

    // Check if user has one of the allowed roles
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
