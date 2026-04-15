import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const News = sequelize.define(
  "News",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    authorId: {   // admin kim qo‘shganini saqlash
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    authorName: { // adminning to‘liq ismi
      type: DataTypes.STRING,
      allowNull: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "news",
    timestamps: false,
  }
);