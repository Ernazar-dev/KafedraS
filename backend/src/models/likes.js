import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Like = sequelize.define("Like", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  newsId: { type: DataTypes.INTEGER, allowNull: false },
});