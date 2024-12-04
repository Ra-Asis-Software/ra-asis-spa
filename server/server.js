const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express application instance
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Main route
app.get("/", (req, res) => res.send("API is running, try outrunning it, your breath will run out..."));

// User routes
app.use("/api/auth", authRoutes); // Use user routes for handling user-related requests

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));