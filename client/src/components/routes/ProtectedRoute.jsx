import { Navigate, Outlet, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ allowedRoles, children, isAuthPage = false }) => {
  const token = localStorage.getItem("authToken");
  const location = useLocation();

  if (!token) {
    // Check if user has no token and trying to access protected route
    return isAuthPage ? (
      children ? (
        children
      ) : (
        <Outlet />
      )
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  }

  try {
    const decoded = jwtDecode(token);

    // Check if token is expired and logout if so
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem("authToken");
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If logged-in user tries to access auth pages, do...
    if (isAuthPage) {
      return <Navigate to="/dashboard" replace />;
    }

    // Check if user has one of the allowed roles
    if (allowedRoles && !allowedRoles.includes(decoded.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
  } catch (error) {
    console.error("Invalid token:", error);
    localStorage.removeItem("authToken");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;
