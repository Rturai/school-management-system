import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import enrollmentRoutes from "./routes/enrollmentRoutes.js";

dotenv.config();
const app = express();

// ✅ CORS Problem ko permanently khatam karne ke liye bilkul clean wildcard setup
app.use(cors({ origin: '*' }));


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 🚨 NAYA LOGIN ENDPOINT
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body;

  // Aap apna manpasand Username aur Password yahan set kar sakti hain
  if (username === "admin" && password === "admin123") {
    res.status(200).json({
      success: true,
      message: "Login successful!",
      token: "schoolsync-dummy-token-2026" // Frontend authentication check ke liye token
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid Username or Password! Please try again."
    });
  }
});

// All Live API Routes
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use('/api', enrollmentRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully!"))
  .catch((err) => console.log("MongoDB Error: ", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running smoothly on port ${PORT}`));