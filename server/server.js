import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";

// Load environment variables
config();

// Connect to MongoDB
connectDB();

// Initialize express application instance
const app = express();

// Middleware
app.use(json());
app.use(cors());

// Main test route
app.get("/", (req, res) =>
  res.send("API is running, try outrunning it, your breath will run out...")
);

// User auth routes
app.use("/api/auth", authRoutes); // Use user routes for handling user-related requests

// Unit routes
app.use("/api/unit", unitRoutes) // Unit routes: handles all unit-related requests

//Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
