import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../models/user.js";

export const createAdmin = async () => {
  try {
    // .env dan ma'lumotlarni olish
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminUsername = process.env.ADMIN_USERNAME;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminUsername || !adminPassword) {
      console.error("❌ Admin ma'lumotlari .env faylda to'liq ko'rsatilmagan!");
      return;
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const existing = await User.findOne({
      where: {
        [Op.or]: [{ email: adminEmail }, { username: adminUsername }]
      }
    });

    if (existing) {
      existing.username = adminUsername;
      existing.email = adminEmail;
      existing.password = hashedPassword;
      await existing.save();
      console.log("✅ Admin allaqachon mavjud, paroli va ma'lumotlari .env dagi qiymatga yangilandi.");
      return;
    }

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