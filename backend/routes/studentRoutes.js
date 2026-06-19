import express from "express";
import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent
} from "../controllers/studentController.js";

const router = express.Router();

router.get("/", getStudents);
router.post("/", createStudent);
router.put("/", updateStudent);
router.delete("/", deleteStudent);

export default router;