const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/registrations");

const registerRoutes = require("./routes/registerRoutes");
app.use("/", registerRoutes);

app.listen(5003, () => console.log("Registration Service running"));