import { sequelize } from "../config"

sequelize.sync().then(() => { console.log('db created') })