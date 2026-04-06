const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

// USERS
app.use("/users", proxy("http://localhost:5001"));

// EVENTS (FIXED)
app.use(
  "/events",
  proxy("http://localhost:5002", {
    proxyReqPathResolver: (req) => {
      return "/events" + req.url;
    },
  })
);

// REGISTRATION (FIXED)
app.use(
  "/register",
  proxy("http://localhost:5003", {
    proxyReqPathResolver: (req) => {
      return "/register" + req.url;
    },
  })
);

app.listen(5000, () => {
  console.log("Gateway running on port 5000");
});