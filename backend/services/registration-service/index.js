const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/eventify")
  .then(() => console.log("Registration DB connected"))
  .catch(err => console.error(err));

// Routes
const registerRoutes = require("./routes/registerRoutes");

// ✅ IMPORTANT: mount with /register
app.use("/register", registerRoutes);

// Start server
app.listen(5003, () => {
  console.log("Registration Service running on 5003");
});