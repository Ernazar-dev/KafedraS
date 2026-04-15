import express from "express";
import { superAdminOnly } from "../middleware/roleMiddleware.js";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../controller/studentController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllStudents);
router.get("/:id", getStudentById);
router.post("/", protect, superAdminOnly, createStudent);
router.put("/:id", protect, superAdminOnly, updateStudent);
router.delete("/:id", protect, superAdminOnly, deleteStudent);

export default router;