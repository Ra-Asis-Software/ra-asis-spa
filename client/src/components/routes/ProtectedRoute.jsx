import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const token = localStorage.getItem("authToken");

  // Redirect to login if no token is found
  if (!token) {
    return <Navigate to="/login" />;
  }

  return <Outlet />; // Render the protected component
};

export default ProtectedRoute;
