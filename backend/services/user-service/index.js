const express = require("express");
const connectDB = require("../../shared/config/db");

const app = express();

app.use(express.json());

// Connect DB
connectDB();

app.get("/", (req, res) => {
  res.send("User Service Running");
});

app.listen(5001, () => {
  console.log("User Service running on port 5001");
});