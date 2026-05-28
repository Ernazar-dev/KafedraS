import express from "express";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Fayl topilmadi" });
  }
  const fileUrl = `${process.env.BASE_URL}/uploads/${req.file.filename}`;
  res.json({
    message: "Fayl muvaffaqiyatli yuklandi!",
    filePath: fileUrl,
    filename: req.file.filename,
  });
});

export default router;
