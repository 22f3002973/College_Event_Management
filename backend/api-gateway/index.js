const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { connectQueue } = require("./config/rabbitmq");

const adminRoutes = require("./routes/adminRoutes");
const registrationRoutes = require("./routes/registrationRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");

const app = express();
const consumeMessages = require("./config/consumer");

consumeMessages();

app.use(cors());
app.use(express.json());

connectDB();
connectQueue();

app.use("/admin", adminRoutes);
app.use("/register", registrationRoutes);
app.use("/feedback", feedbackRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});