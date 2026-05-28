import { Op, fn, col, literal } from "sequelize";
import ScientificWork from "../models/scientificWork.js";
import { createLog } from "../middleware/logMiddleware.js";
import { resolveUrl, buildUploadUrl } from "../utils/resolveUrl.js";

export const getWorks = async (req, res) => {
  try {
    const { category, year, month, page = 1, limit = 50 } = req.query;
    const where = {};
    if (category) where.category = category;
    if (year) {
      const y = Number(year);
      if (month) {
        const m = Number(month) - 1;
        where.date = { [Op.between]: [new Date(y, m, 1), new Date(y, m + 1, 1)] };
      } else {
        where.date = { [Op.between]: [new Date(y, 0, 1), new Date(y + 1, 0, 1)] };
      }
    }
    const offset = (page - 1) * limit;
    const { rows, count } = await ScientificWork.findAndCountAll({
      where,
      order: [["date", "DESC"]],
      limit: Number(limit),
      offset,
    });
    res.json({ data: rows, total: count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getWorkById = async (req, res) => {
  try {
    const work = await ScientificWork.findByPk(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });
    res.json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET my works — admin panel
export const getMyWorks = async (req, res) => {
  try {
    let where = {};
    if (req.user.role !== "superAdmin") {
      where.authorId = req.user.id; // admin faqat o'z ishlarini ko'radi
    }

    const works = await ScientificWork.findAll({
      where,
      order: [["date", "DESC"]],
    });

    res.json(works);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE — admin only
export const createWork = async (req, res) => {
  try {
    const { category, title, description, date } = req.body;

    if (!category || !title)
      return res.status(400).json({ message: "category va title majburiy" });

    // FAOL: bitta fayl
    const fileUrl = req.file ? `${process.env.BASE_URL}/uploads/${req.file.filename}` : null;

    const work = await ScientificWork.create({
      category,
      title,
      description,
      authorId: req.user.id,
      authorName: req.user.username,
      authorPosition: req.user.position,
      date: date ? new Date(date) : new Date(),
      files: fileUrl,  // models da string bo‘lgani uchun
    });

    createLog({
      userId: req.user.id,
      action: "create",
      entity: "ScientificWork",
      entityId: work.id,
      description: `Work '${title}' yaratildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.status(201).json(work);
  } catch (err) {
    console.error("WORK ERROR:", err);
    res.status(500).json({ message: err.message });
  }
};

// UPDATE — admin only
export const updateWork = async (req, res) => {
  try {
    const work = await ScientificWork.findByPk(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    // Role check
    if (req.user.role !== "superAdmin" && work.authorId !== req.user.id) {
      return res.status(403).json({ message: "Siz bu ma'lumotni tahrirlay olmaysiz" });
    }

    const { category, title, description, date } = req.body;
    if (category) work.category = category;
    if (title) work.title = title;
    if (description) work.description = description;
    if (date) work.date = new Date(date);
    if (req.files) work.files = JSON.stringify(req.files);

    await work.save();

    createLog({
      userId: req.user.id,
      action: "update",
      entity: "ScientificWork",
      entityId: work.id,
      description: `Work '${work.title}' yangilandi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json(work);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE — admin only
export const deleteWork = async (req, res) => {
  try {
    const work = await ScientificWork.findByPk(req.params.id);
    if (!work) return res.status(404).json({ message: "Work not found" });

    // Role check
    if (req.user.role !== "superAdmin" && work.authorId !== req.user.id) {
      return res.status(403).json({ message: "Siz bu ma'lumotni o'chira olmaysiz" });
    }

    await work.destroy();createLog({
      userId: req.user.id,
      action: "delete",
      entity: "ScientificWork",
      entityId: work.id,
      description: `Work '${work.title}' o'chirildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "O‘chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STATS (by day for a given month)
export const statsByMonth = async (req, res) => {
  try {
    const { category, year, month } = req.query;
    if (!year || !month) return res.status(400).json({ message: "year va month kerak" });

    const y = Number(year);
    const m = Number(month) - 1;
    const start = new Date(y, m, 1);
    const end = new Date(y, m + 1, 1);

    const rows = await ScientificWork.findAll({
      attributes: [
        [fn("DAY", col("date")), "day"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: { category, date: { [Op.between]: [start, end] } },
      group: [fn("DAY", col("date"))],
      order: [[literal("day"), "ASC"]],
    });

    const data = rows.map((r) => ({
      day: Number(r.dataValues.day),
      count: Number(r.dataValues.count),
    }));

    res.json({ year: y, month: m + 1, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};