import { Sequelize } from "sequelize";
import { DB_NAME, PSSWD, SERVER, USER } from "./env.js";

const sequelize = new Sequelize(DB_NAME, USER, PSSWD, {
    host: SERVER,
    dialect: 'mssql',
    dialectOptions: {
        options: {
            requestTimeout: 0,
            encrypt: false
        },
    },
})

export default sequelize