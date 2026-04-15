import { ActivityLog } from "../models/activityLog.js";

// Admin dashboard
export const dashboard = async (req, res) => {
  try {
    const username = req.user.username;
    const role = req.user.role;

    // 🔹 Activity log yaratish
    await ActivityLog.create({
      userId: req.user.id,
      action: "Dashboardga kirildi",
      timestamp: new Date(),
      entity: "Dashboard",
      entityId: null
    });

    res.status(200).json({
      message: `Salom, ${username}! Bu admin dashboard.`,
      role: role
    });
  } catch (err) {
    console.error("Dashboard xatolik:", err);
    res.status(500).json({
      message: "Server xatosi",
      error: err.message
    });
  }
};