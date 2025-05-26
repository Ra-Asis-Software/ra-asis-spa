const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const unitRoutes = require("./routes/unitRoutes")

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize express application instance
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Main test route
app.get("/", (req, res) =>
  res.send("API is running, try outrunning it, your breath will run out...")
);

// User auth routes
app.use("/api/auth", authRoutes); // Use user routes for handling user-related requests
app.use("/api/unit", unitRoutes) // unit routes: handles all unit-related requests

//Global error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
