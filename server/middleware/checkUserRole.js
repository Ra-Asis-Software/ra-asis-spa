import { checkPermission } from "../config/rolesConfig.js";
import jwt from "jsonwebtoken";

// Middleware to check if the user has required permission
export const hasPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // Get token from header
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check permission
      if (!checkPermission(decoded.role, requiredPermission)) {
        return res.status(403).json({ message: "Insufficient permissions" });
      }

      // Attach user to request
      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};

// Middleware to check if our user has one of the required roles
export const hasRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");

      if (!token) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!allowedRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Role not authorized" });
      }

      req.user = decoded;
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  };
};
