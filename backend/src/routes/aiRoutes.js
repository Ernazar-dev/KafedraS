// routes/aiRoutes.js
import express from "express";
import { chatWithAI } from "../controller/aiController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Token bilan himoyalangan route
router.post("/chat", protect, chatWithAI);

export default router;