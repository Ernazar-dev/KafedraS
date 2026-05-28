import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { sequelize } from "../config/db.js";

export const createSuperAdmin = async () => {
  try {
    await sequelize.sync();

    const saEmail = process.env.SUPERADMIN_EMAIL;
    const saUsername = process.env.SUPERADMIN_USERNAME;
    const saPassword = process.env.SUPERADMIN_PASSWORD;

    const superAdminExists = await User.findOne({ where: { email: saEmail } });
    if (superAdminExists) {
      console.log("SuperAdmin allaqachon mavjud");
      return;
    }

    const hashedPassword = await bcrypt.hash(saPassword, 10);

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