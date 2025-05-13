const express = require("express");
const app = express();
const studentRoutes = require("./routes/students");
const authRoutes = require("./routes/auth");

// Add logging middleware
// app.use((req, res, next) => {
//   console.log("Request path:", req.path);
//   console.log("Request method:", req.method);
//   next();
// });

app.use(express.json());
app.use("/api", studentRoutes);
app.use("/auth", authRoutes);

// Add catch-all route for debugging
// app.use((req, res) => {
//   console.log("No route matched:", req.method, req.path);
//   res.status(404).send("Route not found");
// });

module.exports = app;
