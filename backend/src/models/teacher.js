import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

export const Teacher = sequelize.define(
  "Teacher",
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
    photo: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: { 
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: "teachers",
    timestamps: false,
  }
);
