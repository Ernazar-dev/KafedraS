import express from "express";
import protect from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import {
  getWorks,
  getWorkById,
  createWork,
  updateWork,
  deleteWork,
  statsByMonth,
  getMyWorks,
} from "../controller/scientificWorkController.js";
import { upload } from "../middleware/upload.js";
import ScientificWork from "../models/scientificWork.js"; // <-- MUHIM!

const router = express.Router();

// PUBLIC ROUTES
router.get("/", getWorks);
router.get("/stats", statsByMonth);

// ONLY AUTHOR's WORKS (ADMIN PANEL)
router.get("/my", protect, async (req, res) => {
  try {
    const works = await ScientificWork.findAll({
      where: { authorId: req.user.id },
      order: [["date", "DESC"]],
    });

    res.json(works);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server xatosi" });
  }
});

// GET BY ID (DYNAMIC) — must come LAST
router.get("/:id", getWorkById);

// ADMIN CRUD
router.post(
  "/",
  protect,
  authorizeRoles("admin", "superAdmin"),
  upload.single("file"),
  createWork
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  upload.single("file"),
  updateWork
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin", "superAdmin"),
  deleteWork
);

export default router;