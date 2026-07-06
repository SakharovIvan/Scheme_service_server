import { Sequelize } from "sequelize";
import { PostgresDialect } from "@sequelize/postgres";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD + '',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  logging: true,
  //ssl: true,
  //clientMinMessages: 'notice',
});

export { sequelize };
