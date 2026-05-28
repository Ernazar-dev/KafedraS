import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Subject = sequelize.define(
  "Subject",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    file: { type: DataTypes.STRING, allowNull: true },
    images: { type: DataTypes.STRING, allowNull: true },
    video: { type: DataTypes.STRING, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: false },
    authorName: { type: DataTypes.STRING, allowNull: false },
  },
  {
    tableName: "subjects",
    timestamps: true, // createdAt, updatedAt bo'lsin
  }
);