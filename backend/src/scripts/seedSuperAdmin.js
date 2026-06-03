import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { sequelize } from "../config/db.js";

export const createSuperAdmin = async () => {
  try {
    await sequelize.sync();

    const saEmail = process.env.SUPERADMIN_EMAIL;
    const saUsername = process.env.SUPERADMIN_USERNAME;
    const saPassword = process.env.SUPERADMIN_PASSWORD;

    if (!saEmail || !saUsername || !saPassword) {
      console.error("❌ SuperAdmin ma'lumotlari .env faylda to'liq ko'rsatilmagan!");
      return;
    }

    const hashedPassword = await bcrypt.hash(saPassword, 10);

    const superAdminExists = await User.findOne({
      where: {
        [Op.or]: [{ email: saEmail }, { username: saUsername }]
      }
    });

    if (superAdminExists) {
      superAdminExists.username = saUsername;
      superAdminExists.email = saEmail;
      superAdminExists.password = hashedPassword;
      await superAdminExists.save();
      console.log("✅ SuperAdmin allaqachon mavjud, paroli va ma'lumotlari .env dagi qiymatga yangilandi.");
      return;
    }

    await User.create({
      username: saUsername,
      email: saEmail,
      password: hashedPassword,
      role: "superAdmin",
    });

    console.log("✅ SuperAdmin yaratildi:", saEmail);
  } catch (error) {
    console.error("❌ SuperAdmin yaratishda xato:", error);
  }
};