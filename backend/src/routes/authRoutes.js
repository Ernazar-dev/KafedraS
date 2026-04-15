import express from "express";
import { register, login,verifyPIN, requestRecovery, verifyRecovery } from "../controller/authController.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/user.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", protect, (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    role: req.user.role,
    username: req.user.username,
  });
});

// PATCH /api/auth/me — Sequelize bilan to'g'ri yozildi
router.patch("/me", protect, async (req, res) => {
  try {
    const { email, username } = req.body;

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: "User topilmadi" });

    if (email !== undefined) user.email = email;
    if (username !== undefined) user.username = username;
    await user.save();

    res.json({
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/verify-pin", verifyPIN);
router.post("/request-recovery", requestRecovery);
router.post("/verify-recovery", verifyRecovery);

export default router;
