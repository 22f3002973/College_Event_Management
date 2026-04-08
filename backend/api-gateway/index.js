const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");

const app = express();

// ✅ Enable CORS FIRST
app.use(cors());

// Routes
app.use("/users", proxy("http://localhost:5001"));
app.use("/events", proxy("http://localhost:5002"));
app.use("/register", proxy("http://localhost:5003"));

// Start server
app.listen(5000, () => console.log("Gateway running on 5000"));