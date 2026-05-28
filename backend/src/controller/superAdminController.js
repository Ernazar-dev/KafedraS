import { createLog } from "../middleware/logMiddleware.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User topilmadi" });

    const { username, email, password, role } = req.body;
    const oldRole = user.role;

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (role) user.role = role;

    await user.save();

    createLog({
      userId: req.user.id,
      action: "update",
      entity: "User",
      entityId: user.id,
      description: `Role: ${oldRole} -> ${role || oldRole}`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "User yangilandi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    if (Number(req.user.id) === Number(req.params.id)) {
      return res.status(400).json({ message: "O'zingizni o'chira olmaysiz" });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: "User topilmadi" });

    await user.destroy();
    res.json({ message: "User o'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
