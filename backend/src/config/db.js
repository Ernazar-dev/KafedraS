import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: "postgres",
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false, // Neon uchun SSL talab qilinadi
        },
      },
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST,
        dialect: "mysql",
        logging: false,
      }
    );

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Ma'lumotlar bazasiga ulanish muvaffaqiyatli");
  } catch (error) {
    console.error("❌ Bazaga ulanishda xato:", error.message);
    process.exit(1);
  }
};