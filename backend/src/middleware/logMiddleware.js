import { ActivityLog } from "../models/activityLog.js";

export const createLog = async ({
  userId,
  action,
  entity,
  entityId,
  description,
}) => {
  if (!userId) {
    console.log("⚠️ LOG SKIP: userId topilmadi");
    return;
  }

  try {
    await ActivityLog.create({
      userId,
      action,
      entity,
      entityId,
      description,
    });

    console.log("✅ LOG YOZILDI:", action, entity, entityId);
  } catch (err) {
    console.error("❌ Log yozilmadi:", err.message);
  }
};