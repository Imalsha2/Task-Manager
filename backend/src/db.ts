import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const dbFile = process.env.DATABASE_FILE || path.resolve(__dirname, "..", "..", "database.sqlite");

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: dbFile,
  logging: false,
});

export default sequelize;
