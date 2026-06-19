import express from "express";
import { getStats } from "../controllers/dashboardController.js";
const router = express.Router();

// URL: http://localhost:5000/api/dashboard/stats
router.get("/stats", getStats);

export default router;