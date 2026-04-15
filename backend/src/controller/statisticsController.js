import { Op, fn, col, literal } from "sequelize";
import User from "../models/user.js";
import {Student} from "../models/student.js";
import {Subject} from "../models/subject.js";
import {Teacher} from "../models/teacher.js";
import {News} from "../models/news.js";
import { ActivityLog } from "../models/activityLog.js";
/**
 * ✅ OVERVIEW (cardlar uchun)
 */
export const getOverviewStats = async (req, res) => {
  try {
    const [
      users,
      students,
      teachers,
      subjects,
      news,
      todayActivities,
    ] = await Promise.all([
      User.count(),
      Student.count(),
      Teacher.count(),
      Subject.count(),
      News.count(),
      ActivityLog.count({
        where: {
          timestamp: {
            [Op.gte]: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
      }),
    ]);

    res.json({
      users,
      students,
      teachers,
      subjects,
      news,
      todayActivities,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ ACTIVITY STATISTICS
 */
export const getActivityStats = async (req, res) => {
  try {
    const actions = await ActivityLog.findAll({
      attributes: [
        "action",
        [fn("COUNT", col("action")), "count"],
      ],
      group: ["action"],
    });

    const daily = await ActivityLog.findAll({
      attributes: [
        [fn("DATE", col("timestamp")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        timestamp: {
          [Op.gte]: literal("NOW() - INTERVAL 7 DAY"),
        },
      },
      group: [fn("DATE", col("timestamp"))],
      order: [[literal("date"), "ASC"]],
    });

    res.json({ actions, daily });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getTopUsers = async (req, res) => {
  try {
    const users = await ActivityLog.findAll({
      attributes: [
        "userId",
        [fn("COUNT", col("userId")), "activityCount"],
      ],
      where: {
        userId: { [Op.ne]: null },
      },
      group: ["userId"],
      order: [[literal("activityCount"), "DESC"]],
      limit: 10,
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ AI CHAT STATISTICS
 */
export const getAIStats = async (req, res) => {
  try {
    const total = await ActivityLog.count({
      where: { action: "ai_chat" },
    });

    const byDay = await ActivityLog.findAll({
      attributes: [
        [fn("DATE", col("timestamp")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        action: "ai_chat",
        timestamp: {
          [Op.gte]: literal("NOW() - INTERVAL 7 DAY"),
        },
      },
      group: [fn("DATE", col("timestamp"))],
      order: [[literal("date"), "ASC"]],
    });

    res.json({ total, byDay });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ✅ LOGIN STATISTICS
 */
export const getLoginStats = async (req, res) => {
  try {
    const total = await ActivityLog.count({
      where: { action: "login" }, // login action deb hisoblaymiz
    });

    const byDay = await ActivityLog.findAll({
      attributes: [
        [fn("DATE", col("timestamp")), "date"],
        [fn("COUNT", col("id")), "count"],
      ],
      where: {
        action: "login",
        timestamp: {
          [Op.gte]: literal("NOW() - INTERVAL 7 DAY"),
        },
      },
      group: [fn("DATE", col("timestamp"))],
      order: [[literal("date"), "ASC"]],
    });

    res.json({ total, byDay });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};