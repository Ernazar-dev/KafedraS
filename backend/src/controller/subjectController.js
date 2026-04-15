import { Subject } from "../models/subject.js";
import { createLog } from "../middleware/logMiddleware.js";
import { resolveUrl, buildUploadUrl } from "../utils/resolveUrl.js";

// 🔹 Barcha subjectlar (public)
export const getAllSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll({
      order: [["id", "DESC"]],
    });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 ID bo‘yicha
export const getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject topilmadi" });
    res.json(subject);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Admin faqat o‘z subjectlari
export const getMySubjects = async (req, res) => {
  try {
    const where = req.user.role !== "superAdmin" ? { authorId: req.user.id } : {};
    const subjects = await Subject.findAll({ where, order: [["id", "DESC"]] });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Yangi subject yaratish
export const createSubject = async (req, res) => {
  try {
    const { name, description, videoLink } = req.body;

    if (!name || !description)
      return res.status(400).json({ message: "Name va description majburiy" });

    const fileUrl = req.files?.file
      ? `${process.env.BASE_URL}/uploads/${req.files.file[0].filename}`
      : null;

    const imagesUrl = req.files?.images
      ? req.files.images.map(f => `${process.env.BASE_URL}/uploads/${f.filename}`).join(",")
      : null;

    const videoUrl = req.files?.video
      ? `${process.env.BASE_URL}/uploads/${req.files.video[0].filename}`
      : videoLink || null;

    const subject = await Subject.create({
      name,
      description,
      file: fileUrl,
      images: imagesUrl,
      video: videoUrl,
      authorId: req.user.id,
      authorName: req.user.username,
    });

    createLog({
      userId: req.user.id,
      action: "create",
      entity: "Subject",
      entityId: subject.id,
      description: `Subject '${subject.name}' qo‘shildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.status(201).json(subject);
  } catch (err) {
    console.error("SUBJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Subjectni yangilash
export const updateSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject topilmadi" });

    if (req.user.role !== "superAdmin" && subject.authorId !== req.user.id)
      return res.status(403).json({ message: "Siz bu subjectni tahrirlay olmaysiz" });

    const { name, description, videoLink } = req.body;

    const fileUrl = req.files?.file
      ? `${process.env.BASE_URL}/uploads/${req.files.file[0].filename}`
      : subject.file;

    const imagesUrl = req.files?.images
      ? req.files.images.map(f => `${process.env.BASE_URL}/uploads/${f.filename}`).join(",")
      : subject.images;

    const videoUrl = req.files?.video
      ? `${process.env.BASE_URL}/uploads/${req.files.video[0].filename}`
      : videoLink ?? subject.video;

    await subject.update({
      name: name ?? subject.name,
      description: description ?? subject.description,
      file: fileUrl,
      images: imagesUrl,
      video: videoUrl,
    });

    createLog({
      userId: req.user.id,
      action: "update",
      entity: "Subject",
      entityId: subject.id,
      description: `Subject '${subject.name}' yangilandi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json(subject);
  } catch (err) {
    console.error("SUBJECT ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Subjectni o‘chirish
export const deleteSubject = async (req, res) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject topilmadi" });

    // Admin faqat o‘z subjectini o‘chirishi mumkin
    if (req.user.role !== "superAdmin" && subject.authorId !== req.user.id)
      return res.status(403).json({ message: "Siz bu subjectni o‘chirishingiz mumkin emas" });

    await subject.destroy();createLog({
      userId: req.user.id,
      action: "delete",
      entity: "Subject",
      entityId: subject.id,
      description: `Subject '${subject.name}' o‘chirildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};