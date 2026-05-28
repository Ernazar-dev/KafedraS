import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware/ dan bir daraja yuqori = src/, undan yana yuqori = backend/
// backend/public/uploads
const uploadDir = path.join(__dirname, "../../public/uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = Buffer.from(file.originalname.replace(ext, ""), "latin1")
      .toString("utf8")
      .replace(/\s+/g, "_")
      .replace(/[^a-zA-Z0-9_\-\.]/g, "");
    cb(null, `${Date.now()}-${name || "file"}${ext}`);
  },
});

const allowedTypes = [
  ".jpeg", ".jpg", ".png", ".gif", ".webp",
  ".pdf", ".mp4", ".mov", ".avi", ".mkv", ".pptx", ".docx",
];

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) cb(null, true);
  else cb(new Error("Bu fayl turi qo'llab-quvvatlanmaydi: " + ext));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // max 10MB
});

export const uploadMultiple = multer({ storage, fileFilter }).fields([
  { name: "file", maxCount: 1 },
  { name: "images", maxCount: 5 },
  { name: "video", maxCount: 1 },
]);
