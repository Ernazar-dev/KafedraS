import { Teacher } from "../models/teacher.js";
import { createLog } from "../middleware/logMiddleware.js";
import { resolveUrl, buildUploadUrl } from "../utils/resolveUrl.js";

export const createTeacher = async (req, res) => {
  try {
    const { fullname, position, phone } = req.body;
    if (!fullname) return res.status(400).json({ message: "fullname majburiy." });

    const photoUrl = req.file ? buildUploadUrl(req.file.filename) : null;
    const teacher = await Teacher.create({ fullname, position, phone, photo: photoUrl });

    createLog({
      userId: req.user.id,
      action: "create",
      entity: "Teacher",
      entityId: teacher.id,
      description: `${fullname} qo'shildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.status(201).json({ message: "Teacher qo'shildi ✅", teacher });
  } catch (error) {
    res.status(500).json({ message: "Server xatosi!", error: error.message });
  }
};

export const getTeachersById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: "Teacher topilmadi!" });
    res.json({ ...teacher.dataValues, photo: resolveUrl(teacher.photo) });
  } catch (error) {
    res.status(500).json({ message: "Xatolik: " + error.message });
  }
};

export const getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    const result = teachers.map(t => ({
      ...t.dataValues,
      photo: resolveUrl(t.photo),
    }));
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, position, phone } = req.body;

    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: "Ustoz topilmadi!" });

    teacher.fullname = fullname || teacher.fullname;
    teacher.position = position || teacher.position;
    teacher.phone = phone || teacher.phone;
    if (req.file) teacher.photo = buildUploadUrl(req.file.filename);

    await teacher.save();

    createLog({
      userId: req.user.id,
      action: "update",
      entity: "Teacher",
      entityId: teacher.id,
      description: `${teacher.fullname} yangilandi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "Ustoz yangilandi ✅", teacher });
  } catch (error) {
    res.status(500).json({ message: "Xatolik: " + error.message });
  }
};

export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);
    if (!teacher) return res.status(404).json({ message: "Ustoz topilmadi!" });

    await teacher.destroy();

    createLog({
      userId: req.user.id,
      action: "delete",
      entity: "Teacher",
      entityId: id,
      description: `${teacher.fullname} o'chirildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "Ustoz muvaffaqiyatli o'chirildi 🗑️" });
  } catch (error) {
    res.status(500).json({ message: "Xatolik: " + error.message });
  }
};
