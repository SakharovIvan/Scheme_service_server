import { Sequelize } from "sequelize";
import { PostgresDialect } from "@sequelize/postgres";
import dotenv from "dotenv";
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3";

dotenv.config();

const sequelize = new Sequelize({
  dialect: "postgres",
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD + '',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  logging: false,
  //ssl: true,
  //clientMinMessages: 'notice',
});

const sequelize_new = new Sequelize({
  dialect: "postgres",
  database: process.env.DATABASE_NAME_NEW,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD + '',
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  logging: false,
  //ssl: true,
  //clientMinMessages: 'notice',
});

const s3_client = new S3Client({
  region: "gis-1",
  endpoint: "https://s3.gis-1.storage.selcloud.ru",
  port: 443,
  credentials: {
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  }
});

export { sequelize, s3_client };
