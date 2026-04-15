import bcrypt from "bcryptjs";
import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import { createLog } from "../middleware/logMiddleware.js";
import { sendEmail } from "../utils/sendEmail.js";

// 1. REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Barcha maydonlarni to'ldiring" });
    }

    // Email bandligini tekshirish
    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    // Username bandligini tekshirish
    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(409).json({ message: "Bu username band" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: "user", // Yangi ro'yxatdan o'tganlar doim 'user'
    });

    // Log yaratish
    createLog({
      userId: user.id,
      action: "register",
      entity: "User",
      entityId: user.id,
      description: `Yangi foydalanuvchi '${user.username}' ro'yxatdan o'tdi`,
    }).catch((err) => console.error("Log xatosi:", err.message));

    res.status(201).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 2. LOGIN
export const login = async (req, res) => {
  const loginAttemptStart = Date.now(); // 1. Urinish boshlangan vaqtni saqlaymiz

  try {
    const { username, password } = req.body;

    // Minimal validatsiya
    if (!username || !password) {
      return res.status(400).json({ message: "Username va parol kerak" });
    }

    // Foydalanuvchini qidiramiz
    const user = await User.findOne({ where: { username } });

    // Parolni tekshirish (Timing attack oldini olish uchun mantiq)
    let isMatch = false;
    if (user) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // User topilmasa ham, "fake" solishtirish qilamiz.
      // Bu buzg'unchini chalg'itish uchun kerak (vaqt sarflash uchun).
      await bcrypt.compare(
        password,
        "$2b$10$fakehashfakehashfakehashfakehashfakehashfakehash",
      );
    }

    // 2. Artificial Delay (Sun'iy kechikish)
    // Server har doim kamida 1.5 sekundda javob qaytarishi uchun
    const elapsed = Date.now() - loginAttemptStart;
    const minWait = 1500; // 1.5 sekund
    if (elapsed < minWait) {
      await new Promise((resolve) => setTimeout(resolve, minWait - elapsed));
    }

    // Endi natijani tekshiramiz
    if (!user || !isMatch) {
      return res.status(401).json({ message: "Username yoki parol noto'g'ri" });
    }

    // 3. 2FA Tekshiruvi
    // Agar 2FA yoqilgan bo'lsa (Faqat admin va superAdmin uchun)
    if (
      (user.role === "admin" || user.role === "superAdmin") &&
      user.twoFactorEnabled
    ) {
      return res.json({
        twoFactorRequired: true,
        username: user.username,
      });
    }

    // 4. Muvaffaqiyatli login uchun LOG yozish
    createLog({
      userId: user.id,
      action: "login",
      entity: "User",
      entityId: user.id,
      description: `Foydalanuvchi '${user.username}' tizimga kirdi`,
    }).catch((err) => console.error("Log xatosi:", err.message));

    // 5. Token va ma'lumotlarni qaytarish
    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    // Xatolik bo'lsa ham kechikishni saqlab qolamiz
    const elapsed = Date.now() - loginAttemptStart;
    if (elapsed < 1500) {
      await new Promise((resolve) => setTimeout(resolve, 1500 - elapsed));
    }

    res.status(500).json({ message: "Serverda xatolik yuz berdi" });
  }
};

// 3. VERIFY PIN
export const verifyPIN = async (req, res) => {
  try {
    const { username, pin } = req.body;
    const user = await User.findOne({ where: { username } });

    if (!user || !(await bcrypt.compare(pin, user.twoFactorPin))) {
      return res.status(400).json({ message: "PIN kod noto'g'ri" });
    }

    // 2FA orqali kirganda log yozamiz
    createLog({
      userId: user.id,
      action: "login_2fa",
      entity: "User",
      entityId: user.id,
      description: `Foydalanuvchi PIN kod orqali tizimga kirdi`,
    }).catch((err) => console.error("Log xatosi:", err.message));

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 4. REQUEST RECOVERY (PIN esdan chiqqanda)
export const requestRecovery = async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(404).json({ message: "User topilmadi" });

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.recoveryCode = code;
    user.recoveryExpires = Date.now() + 10 * 60 * 1000; // 10 daqiqa
    await user.save();

    try {
      await sendEmail({
        email: user.email,
        subject: "Kirish uchun tasdiqlash kodi",
        message: `Sizning bir martalik kirish kodingiz: ${code}. Uni 10 daqiqa ichida ishlating.`,
      });
      res.json({ message: "Emailga kod yuborildi" });
    } catch (mailErr) {
      console.error("NODEMAILER XATOSI:", mailErr);
      return res.status(500).json({
        message:
          "Email yuborishda xato yuz berdi. Iltimos, keyinroq urunib ko'ring.",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 5. VERIFY RECOVERY
export const verifyRecovery = async (req, res) => {
  try {
    const { username, code } = req.body;
    const user = await User.findOne({
      where: { username, recoveryCode: code },
    });

    if (!user || user.recoveryExpires < Date.now()) {
      return res
        .status(400)
        .json({ message: "Kod noto'g'ri yoki muddati tugagan" });
    }

    user.recoveryCode = null;
    user.recoveryExpires = null;
    await user.save();

    createLog({
      userId: user.id,
      action: "login_recovery",
      entity: "User",
      entityId: user.id,
      description: `Foydalanuvchi email recovery orqali tizimga kirdi`,
    }).catch((err) => console.error("Log xatosi:", err.message));

    res.json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
