import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    faculty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    course: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    lang: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "students", 
    timestamps: false, 
  }
);