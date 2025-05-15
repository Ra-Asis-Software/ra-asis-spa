const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Check if MONGO_URI is defined
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("MongoDB Connection Error:", err.message);
    process.exit(1); // Exit the process with failure
  }

  // Handle MongoDB disconnection
  mongoose.connection.on("disconnected", () => {
    console.log("MongoDB disconnected.");
  });
};

module.exports = connectDB;
