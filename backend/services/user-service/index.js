const express = require("express");
const connectDB = require("../../shared/config/db");

const userRoutes = require("./routes/userRoutes");

const app = express();
app.use(express.json());

connectDB();

app.use("/users", userRoutes);

app.listen(5001, () => console.log("User Service running on 5001"));