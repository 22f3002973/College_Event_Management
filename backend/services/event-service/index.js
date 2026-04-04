const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/events");

const eventRoutes = require("./routes/eventRoutes");
app.use("/events", eventRoutes);

app.listen(5002, () => console.log("Event Service running"));