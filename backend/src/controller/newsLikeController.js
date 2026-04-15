import { Like } from "../models/likes.js";

export const toggleNewsLike = async (req, res) => {
  try {
    const userId = req.user.id;     // Token orqali
    const { newsId } = req.body;

    const existing = await Like.findOne({
      where: { userId, newsId },
    });

    // ❌ Like bor → o‘chiramiz
    if (existing) {
      await existing.destroy();
      return res.json({ liked: false });
    }

    // ✔ Like yo‘q → yaratamiz
    await Like.create({ userId, newsId });
    return res.json({ liked: true });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getNewsLikesCount = async (req, res) => {
  try {
    const { newsId } = req.params;

    const count = await Like.count({ where: { newsId } });

    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};