import express from "express";
import { createEnrollment, getMonthlyStats } from "../controllers/enrollmentController.js";
import Enrollment from "../models/Enrollment.js"; 

const router = express.Router();

// 1. POST: Student data save karne ke liye
// URL: http://localhost:5000/api/enroll
router.post("/enroll", createEnrollment);

// 2. GET: Dashboard charts ke liye
// URL: http://localhost:5000/api/dashboard/monthly-stats
router.get("/dashboard/monthly-stats", getMonthlyStats);

// 3. GET: Pura data table me live fetch karne ke liye (Naya Endpoint)
// URL: http://localhost:5000/api/all-enrollments
router.get("/all-enrollments", async (req, res) => {
  try {
    const data = await Enrollment.find({}).sort({ createdAt: -1 }); // Naya data hamesha sabse upar dikhega
    res.status(200).json({
      success: true,
      data: data
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;