import { DataTypes } from "sequelize";
import dbManager from "../config/dbManager.config";

//const { DataTypes } = require("sequelize");
//const dbManager = require("./dbManager"); // Importa el gestor de bases de datos

const sequelize = dbManager[place_id]; // Usa la conexión según place_id

const Asignacion = sequelize.define('asignacion', {
    cuenta: {
        type: DataTypes.STRING,
        allowNull: false
    },
    tarea: {
        type: DataTypes.STRING,
        allowNull: false
    },
    usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_Servicio: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    timestamps: false,
    freezeTableName: true
});

module.exports = Asignacion;