import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { createLog } from "../middleware/logMiddleware.js";

// ✅ 1. Foydalanuvchi ma’lumotlarini olish (getMe)
export const getMe = async (req, res) => {
  try {
    res.json({
      id: req.user.id,
      username: req.user.username,
      email: req.user.email,
      role: req.user.role,
      twoFactorEnabled: req.user.twoFactorEnabled, // 2FA holati
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 2. Username o‘zgartirish
export const updateUsername = async (req, res) => {
  try {
    const { username } = req.body;
    if (!username) return res.status(400).json({ message: "Username kerak" });

    const user = await User.findByPk(req.user.id);
    user.username = username;
    await user.save();

    createLog({
      userId: user.id,
      action: "update",
      entity: "User",
      entityId: user.id,
      description: `Username o'zgartirildi: ${username}`,
    }).catch(e => console.error(e));

    res.json({ username: user.username });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 3. Parol o‘zgartirish
export const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Parol kerak" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.findByPk(req.user.id);
    user.password = hashedPassword;
    await user.save();

    createLog({
      userId: user.id,
      action: "update",
      entity: "User",
      entityId: user.id,
      description: "Parol o‘zgartirildi",
    }).catch(e => console.error(e));

    res.json({ message: "Parol muvaffaqiyatli o‘zgartirildi" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ 4. 2FA ni YOQISH YOKI O'CHIRISH (toggle2FA)

export const toggle2FA = async (req, res) => {
  try {
    const { enable, pin } = req.body; 
    const user = await User.findByPk(req.user.id);

    if (enable) {
      // 6 xonali raqam cheklovini olib tashladik, min 3 belgi qo'ydik
      if (!pin || pin.length < 3) {
        return res.status(400).json({ message: "Xavfsizlik kodi kamida 3 belgidan iborat bo'lishi kerak" });
      }
      user.twoFactorPin = await bcrypt.hash(pin, 10);
      user.twoFactorEnabled = true;
    } else {
      user.twoFactorEnabled = false;
      user.twoFactorPin = null;
    }

    await user.save();
    res.json({ 
      message: user.twoFactorEnabled ? "Xavfsizlik kodi o'rnatildi ✅" : "2FA o'chirildi ⚠️",
      enabled: user.twoFactorEnabled 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};