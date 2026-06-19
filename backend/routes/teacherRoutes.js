import express from "express";
import { 
  getTeachers, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher 
} from "../controllers/teacherController.js";

const router = express.Router();

// सभी टीचर्स को देखने के लिए रूट
router.get("/", getTeachers);

// नया टीचर जोड़ने के लिए रूट
router.post("/", createTeacher);

// टीचर का डेटा अपडेट करने के लिए रूट
router.put("/", updateTeacher);

// टीचर को डिलीट करने के लिए रूट
router.delete("/", deleteTeacher);

// 🔥 यह लाइन सबसे ज़रूरी है, जिसके बिना एरर आ रहा था:
export default router;