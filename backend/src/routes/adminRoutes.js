import express from "express";
import protect from "../middleware/authMiddleware.js";
import {authorizeRoles, adminOrSuperAdmin}  from "../middleware/roleMiddleware.js";
import { dashboard } from "../controller/adminController.js";

const router = express.Router();

router.get("/dashboard", protect, adminOrSuperAdmin, authorizeRoles("admin", "superAdmin"), dashboard);

export default router;