const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/users")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

const userRoutes = require("./routes/userRoutes");

// ✅ FIXED HERE
app.use("/users", userRoutes);

app.listen(5001, () => console.log("User Service running on 5001"));