const express = require("express");
const app = express();
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");

app.use(express.json());
app.use("/api", studentRoutes);
app.use("/auth", authRoutes);

module.exports = app;
