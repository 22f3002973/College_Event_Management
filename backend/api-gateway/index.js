const express = require("express");
const proxy = require("express-http-proxy");

const app = express();

app.use("/users", proxy("http://localhost:5001"));
app.use("/events", proxy("http://localhost:5002"));
app.use("/register", proxy("http://localhost:5003"));

app.listen(5000, () => console.log("Gateway running"));