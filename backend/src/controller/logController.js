import { ActivityLog } from "../models/activityLog.js";
import User from "../models/user.js";

export const getAllLogs = async (req, res) => {
  try {
    const logs = await ActivityLog.findAll({
      include: [
        {
          model: User,
          attributes: ["id", "username", "email", "role"],
        },
      ],
      order: [["timestamp", "DESC"]],
    });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};