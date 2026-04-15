import app from "./app.js";
import dotenv from "dotenv";
import { sequelize } from "./config/db.js";
import { runSeeders } from "./scripts/seeders.js";

// Barcha modellarni import qilish (Sequelize sync uchun shart)
import "./models/user.js";
import "./models/student.js";
import "./models/teacher.js";
import "./models/subject.js";
import "./models/news.js";
import "./models/likes.js";
import "./models/scientificWork.js";
import "./models/activityLog.js";
// Assotsiatsiyalarni ishga tushirish
import "./models/index.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// server.js ichida
const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // FAQAT DEVELOPMENTDA 'alter: true' ISHLATISH
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ alter: true });
      console.log("⚠️ Development: Jadvallar alter orqali sinxronlandi");
    } else {
      // Productionda shunchaki sync (jadval bo'lsa hech nima qilmaydi)
      await sequelize.sync(); 
      console.log("✅ Production: Jadvallar tekshirildi");
    }

    await runSeeders();
    app.listen(PORT, () => console.log(`🚀 Server ${PORT}-portda ishga tushdi`));
  } catch (error) {
    console.error("❌ Server ishga tushmadi:", error);
  }
};

startServer();
