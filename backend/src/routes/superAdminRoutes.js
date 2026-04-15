import express from "express";
import protect from "../middleware/authMiddleware.js";
import {authorizeRoles,  superAdminOnly } from "../middleware/roleMiddleware.js";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controller/superAdminController.js";

const router = express.Router();

router.get("/users", protect, superAdminOnly, getAllUsers);
router.put("/users/:id", protect, superAdminOnly,authorizeRoles("superAdmin"), updateUser);
router.delete("/users/:id", protect, superAdminOnly, deleteUser);

export default router;