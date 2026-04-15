import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import hpp from "hpp";

// Middleware va Config importlari
import { connectDB } from "./config/db.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import sanitize from "./middleware/sanitize.js";
import security from "./middleware/security.js";

// Route importlari
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import superAdminRoutes from "./routes/superAdminRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import worksRoutes from "./routes/worksRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// 1. CORS sozlamalari
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://kafedrasayd.uz",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS xatosi: Ruxsat berilmagan manba"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// 2. Xavfsizlik Middleware-larini qo'llash
app.use(security); // Helmet (Security headers)
app.use(cors(corsOptions)); // CORS
app.use(globalLimiter); // DDoS himoyasi (Rate Limit)

// Body parser - hajmni cheklash (DDoS payload himoyasi)
app.use(express.json({ limit: "10kb" }));

app.use(hpp()); // HTTP Parameter Pollution himoyasi
app.use(sanitize); // XSS (Sanitization) himoyasi

// 3. Statik fayllar (Uploads)
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// 4. API Yo'nalishlari (Routes)
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/news", newsRoutes);
app.use("/api", uploadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/superadmin", superAdminRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/stats", statisticsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/works", worksRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Backend xavfsiz holatda ishlamoqda 🚀" });
});

// Bazaga ulanish
connectDB();

export default app;
