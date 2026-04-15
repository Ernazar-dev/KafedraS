import { Student } from "../models/student.js";
import { createLog } from "../middleware/logMiddleware.js";

// Barcha studentlarni olish
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.findAll({ order: [["id", "ASC"]] });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ID bo‘yicha student
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "Student topilmadi" });
    res.json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Student qo‘shish
export const createStudent = async (req, res) => {
  try {
    const { fullname, faculty, course, lang } = req.body;
    if (!fullname || !course || !lang)
      return res.status(400).json({ message: "fullname, course va lang majburiy!" });

    const student = await Student.create({ fullname, faculty, course, lang });

    // 🔹 Activity log
    createLog({
      userId: req.user.id,
      action: "create",
      entity: "Student",
      entityId: student.id,
      description: `${student.fullname} qo‘shildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.status(201).json({ message: "Student qo‘shildi ✅", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Studentni update qilish
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, faculty, course, lang } = req.body;

    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "Student topilmadi" });

    student.fullname = fullname || student.fullname;
    student.faculty = faculty || student.faculty;
    student.course = course || student.course;
    student.lang = lang || student.lang;

    await student.save();

    // 🔹 Activity log
    createLog({
      userId: req.user.id,
      action: "update",
      entity: "Student",
      entityId: student.id,
      description: `${student.fullname} yangilandi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "Student yangilandi ✅", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Studentni o‘chirish
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id);
    if (!student) return res.status(404).json({ message: "Student topilmadi" });

    await student.destroy();

    // 🔹 Activity log
    createLog({
      userId: req.user.id,
      action: "delete",
      entity: "Student",
      entityId: id,
      description: `${student.fullname} o‘chirildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "Student o‘chirildi 🗑️" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};