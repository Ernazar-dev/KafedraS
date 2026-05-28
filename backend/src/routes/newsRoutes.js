import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { upload } from "../middleware/upload.js";

import {
  getAllNews,
  getNewsById,
  getMyNews,
  createNews,
  updateNews,
  deleteNews,
} from "../controller/newsController.js";

import {
  toggleNewsLike, getNewsLikesCount
} from "../controller/newsLikeController.js";
import { optionalAuth } from "../middleware/optionalAuthMiddleware.js";

const router = express.Router();

// =========================
//      LIKE ROUTES
// =========================

// Like bosish
router.get("/like/count/:newsId", getNewsLikesCount);
router.post("/like", protect, toggleNewsLike);
// Like olib tashlash

// Like soni


// =========================
//      NEWS ROUTES
// =========================

// PROTECTED
router.get("/my", protect, getMyNews);

// PUBLIC
router.get("/:id", getNewsById);
router.get("/", optionalAuth, getAllNews);

// ADMIN CRUD
router.post(
  "/",
  protect,
  authorizeRoles("admin", "superAdmin"),
  upload.single("file"),
  createNews
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  upload.single("file"),
  updateNews
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  deleteNews
);

export default router;


