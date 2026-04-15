const express = require("express");
const cors = require("cors");
const proxy = require("express-http-proxy");


const app = express();

// Enable CORS
app.use(cors());


const adminRoutes = require("./routes/adminRoutes");

// ---------------- ADMIN ROUTES ----------------
app.use("/admin", adminRoutes);

// ---------------- USERS SERVICE ----------------
app.use(
  "/users",
  proxy("http://localhost:5001", {
    proxyReqPathResolver: (req) => "/users" + req.url,
  })
);

// ---------------- EVENT SERVICE ----------------
app.use(
  "/events",
  proxy("http://localhost:5002", {
    proxyReqPathResolver: (req) => "/events" + req.url,
  })
);

// ---------------- REGISTRATION SERVICE ----------------
app.use(
  "/register",
  proxy("http://localhost:5003", {
    proxyReqPathResolver: (req) => "/register" + req.url,
  })
);

// Start server
app.listen(5000, () => {
  console.log("Gateway running on 5000");
});