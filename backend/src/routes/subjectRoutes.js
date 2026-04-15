import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles, superAdminOnly } from "../middleware/roleMiddleware.js";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getMySubjects,
} from "../controller/subjectController.js";
import { uploadMultiple } from "../middleware/upload.js";

const router = express.Router();

// PROTECTED (admin o‘z subjectlarini ko‘rishi)
router.get("/my", protect, getMySubjects); // agar xohlasak alohida mySubjects qilinadi
// PUBLIC
router.get("/", getAllSubjects);
router.get("/:id", getSubjectById);


// ADMIN CRUD
router.post("/", protect, authorizeRoles("admin", "superAdmin"), uploadMultiple, createSubject);
router.put("/:id", protect, authorizeRoles("admin", "superAdmin"), uploadMultiple, updateSubject);
router.delete("/:id", protect, authorizeRoles("admin", "superAdmin"), deleteSubject);

export default router;