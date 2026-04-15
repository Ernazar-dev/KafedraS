import express from "express";
import { getAllLogs } from "../controller/logController.js";
import protect from "../middleware/authMiddleware.js"; // JWT middleware
import { superAdminOnly } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", protect, superAdminOnly, getAllLogs);

export default router;