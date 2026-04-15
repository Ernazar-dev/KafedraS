import { News } from "../models/news.js";
import { createLog } from "../middleware/logMiddleware.js";
import { Like } from "../models/likes.js";
import { resolveUrl, buildUploadUrl } from "../utils/resolveUrl.js";

export const getAllNews = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const newsList = await News.findAll({ order: [["date", "DESC"]] });

    const result = await Promise.all(
      newsList.map(async (n) => {
        const likesCount = await Like.count({ where: { newsId: n.id } });
        let isLiked = false;
        if (userId) {
          const like = await Like.findOne({ where: { newsId: n.id, userId } });
          isLiked = !!like;
        }
        return {
          ...n.dataValues,
          file: resolveUrl(n.file),
          likesCount,
          isLiked,
        };
      })
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNewsById = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi" });
    res.json({ ...news.dataValues, file: resolveUrl(news.file) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyNews = async (req, res) => {
  try {
    const where = req.user.role !== "superAdmin" ? { authorId: req.user.id } : {};
    const newsList = await News.findAll({ where, order: [["date", "DESC"]] });
    res.json(newsList.map(n => ({ ...n.dataValues, file: resolveUrl(n.file) })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createNews = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) return res.status(400).json({ message: "title va content majburiy" });

    const fileUrl = req.file ? buildUploadUrl(req.file.filename) : null;

    const news = await News.create({
      title,
      content,
      authorId: req.user.id,
      authorName: req.user.username,
      file: fileUrl,
    });

    createLog({
      userId: req.user.id,
      action: "create",
      entity: "News",
      entityId: news.id,
      description: `Yangilik '${news.title}' qo'shildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.status(201).json({ ...news.dataValues, file: resolveUrl(news.file) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi" });

    if (req.user.role !== "superAdmin" && news.authorId !== req.user.id)
      return res.status(403).json({ message: "Siz bu yangilikni tahrirlay olmaysiz" });

    const { title, content } = req.body;
    const fileUrl = req.file ? buildUploadUrl(req.file.filename) : news.file;

    await news.update({
      title: title ?? news.title,
      content: content ?? news.content,
      file: fileUrl,
    });

    createLog({
      userId: req.user.id,
      action: "update",
      entity: "News",
      entityId: news.id,
      description: `Yangilik '${news.title}' yangilandi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ ...news.dataValues, file: resolveUrl(news.file) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteNews = async (req, res) => {
  try {
    const news = await News.findByPk(req.params.id);
    if (!news) return res.status(404).json({ message: "Yangilik topilmadi" });

    if (req.user.role !== "superAdmin" && news.authorId !== req.user.id)
      return res.status(403).json({ message: "Siz bu yangilikni o'chirishingiz mumkin emas" });

    await news.destroy();

    createLog({
      userId: req.user.id,
      action: "delete",
      entity: "News",
      entityId: news.id,
      description: `Yangilik '${news.title}' o'chirildi`,
    }).catch(e => console.error("Log xatosi:", e.message));

    res.json({ message: "O'chirildi" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
