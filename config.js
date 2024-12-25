import { Sequelize } from "sequelize";
import { PostgresDialect } from "@sequelize/postgres";

const sequelize = new Sequelize({
  dialect: "postgres",
  database: "fortest",
  user: "root",
  password: "root",
  host: "127.0.0.1",
  port: 5432,
  logging: true,
  //ssl: true,
  //clientMinMessages: 'notice',
});

export { sequelize };
