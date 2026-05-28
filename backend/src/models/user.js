import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_username", // Atribut darajasida nomlash
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: "unique_email", // Atribut darajasida nomlash
    },
    password: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("user", "admin", "superAdmin"),
      defaultValue: "user",
      allowNull: false,
    },
    twoFactorEnabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    twoFactorPin: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recoveryCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    recoveryExpires: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    // ⚠️ MODEL DARAGAJASIDAGI INDEXLAR (Bu eng xavfsiz yo'l)
    indexes: [
      {
        unique: true,
        fields: ["username"],
        name: "unique_username", // MySQL-da aynan shu nom bilan qoladi
      },
      {
        unique: true,
        fields: ["email"],
        name: "unique_email", // MySQL-da aynan shu nom bilan qoladi
      },
    ],
  },
);

export default User;
