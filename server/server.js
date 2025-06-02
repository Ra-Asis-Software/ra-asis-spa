import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
connectDB();

// Initialize express application instance
const app = express();

// Middleware
app.use(json());
app.use(cors());
// This serves static files from 'uploads'
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Main test route
app.get("/", (req, res) =>
  res.send("API is running, try outrunning it, your breath will run out...")
);

// Admin actions routes
app.use("/api/admin", adminRoutes);

// User auth routes
app.use("/api/auth", authRoutes); // handle user auth-related requests

// User functionality routes
app.use("/api/users", userRoutes); // Use users routes for handling user-related requests

// Unit routes
app.use("/api/unit", unitRoutes); // Unit routes: handles all unit-related requests

// Assignment/Submission routes
app.use("/api/assignments", assignmentRoutes);

//Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
