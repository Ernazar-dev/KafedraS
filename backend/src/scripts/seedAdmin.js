import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const createAdmin = async () => {
  try {
    // .env dan ma'lumotlarni olish
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const existing = await User.findOne({ where: { email: adminEmail } });
    if (existing) {
      console.log("✅ Admin allaqachon mavjud:", existing.email);
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    await User.create({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: "admin",
    });

    console.log("✅ Admin yaratildi:", adminEmail);
  } catch (err) {
    console.error("❌ Admin yaratishda xato:", err);
  }
};