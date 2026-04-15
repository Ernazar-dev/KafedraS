import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const ActivityLog = sequelize.define(
  "ActivityLog",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,  // null bo'lishi mumkin (anonim so'rovlar uchun)
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    action: DataTypes.STRING,
    entity: DataTypes.STRING,
    entityId: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "activity_logs",
    timestamps: false,
    indexes: [
      { fields: ["userId"] },
    ],
  }
);
