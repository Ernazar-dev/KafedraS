import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles, superAdminOnly } from "../middleware/roleMiddleware.js";
import {
  getOverviewStats,
  getActivityStats,
  getTopUsers,
  getAIStats,
  getLoginStats,
} from "../controller/statisticsController.js";

const router = express.Router();

router.use(protect, superAdminOnly);

router.get("/overview", getOverviewStats);
router.get("/activity", getActivityStats);
router.get("/users", getTopUsers);
router.get("/ai", getAIStats);
router.get("/logins",getLoginStats)

export default router;