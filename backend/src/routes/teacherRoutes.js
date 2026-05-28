import express from "express";
import { 
  getAllTeachers, 
  createTeacher, 
  updateTeacher, 
  deleteTeacher, 
  getTeachersById 
} from "../controller/teacherController.js";
import { upload } from "../middleware/upload.js";
import protect from "../middleware/authMiddleware.js";
import { superAdminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

// SuperAdmin uchun barcha teacher CRUD endpointlar
router.get("/", getAllTeachers);
router.get("/:id", getTeachersById);
router.post("/", protect, superAdminOnly, upload.single("photo"), createTeacher);
router.put("/:id", protect, superAdminOnly, upload.single("photo"), updateTeacher);
router.delete("/:id", protect, superAdminOnly, deleteTeacher);

export default router;