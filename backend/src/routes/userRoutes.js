import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  toggle2FA,
  getMe,
  updateUsername,
  updatePassword,
} from "../controller/usersController.js";

const router = express.Router();

router.get(
  "/me",
  protect,
  authorizeRoles("user", "admin", "superAdmin"),
  getMe,
);
router.post("/2fa/toggle", protect, toggle2FA);
router.put("/me/username", protect, updateUsername);
router.put("/me/password", protect, updatePassword);

export default router;
