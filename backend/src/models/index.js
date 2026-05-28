import { News } from "./news.js";
import { Like } from "./likes.js";
import User from "./user.js";
import { ActivityLog } from "./activityLog.js";

// News <-> Like
News.hasMany(Like, { foreignKey: "newsId", onDelete: "CASCADE" });
Like.belongsTo(News, { foreignKey: "newsId" });

// User <-> Like
User.hasMany(Like, { foreignKey: "userId", onDelete: "CASCADE" });
Like.belongsTo(User, { foreignKey: "userId" });

// User <-> ActivityLog (optional assotsiatsiya - FK constraint yo'q)
User.hasMany(ActivityLog, { foreignKey: "userId", onDelete: "SET NULL", constraints: false });
ActivityLog.belongsTo(User, { foreignKey: "userId", constraints: false });

export { News, Like, User, ActivityLog };
