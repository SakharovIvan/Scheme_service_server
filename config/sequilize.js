import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  logging: Boolean(process.env.DATABASE_LOGGING)||false,
  //ssl: true,
  //clientMinMessages: 'notice',
  acquireConnectionTimeout: 5000,
    pool: {
    min: 0,
    max: 10,
    createTimeoutMillis: 8000,
    acquireTimeoutMillis: 8000,
    idleTimeoutMillis: 8000,
    reapIntervalMillis: 1000,
    createRetryIntervalMillis: 100,
  },

});

export { sequelize };
