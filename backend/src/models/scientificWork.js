import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";

const ScientificWork = sequelize.define(
  "ScientificWork",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    category: {
      type: DataTypes.ENUM("maqalalar", "tezisler", "dgular", "patentler", "proyektler"),
      allowNull: false,
    },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    authorId: { type: DataTypes.INTEGER, allowNull: true },
    authorName: {type: DataTypes.STRING, allowNull: true},
    authorPosition: {type: DataTypes.STRING, allowNull: true},
    date: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    files: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "scientific_works",
    timestamps: false,
  }
);

export default ScientificWork;