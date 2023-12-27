import { Sequelize } from "sequelize";

const dbManager = {
  db_prueba: new Sequelize("db_prueba", "sa", "Erpp123.", {
    host: "201.163.165.20",
    /* host: '172.25.3.114', esta es privadfa */
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 0,
      },
    },
  }),
  sero_central: new Sequelize("sero_central", "sa", "Erpp123.", {
    host: "201.163.165.20",
    /* host: '172.25.3.114', esta es privadfa */
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
        requestTimeout: 0,
      },
    },
  }),
  sero_cuautitlan_izcalli: new Sequelize(
    "sero_cuautitlan_izcalli",
    "sa",
    "Erpp123.",
    {
      host: "201.163.165.20",
      dialect: "mssql",
      dialectOptions: {
        options: {
          encrypt: false,
          trustServerCertificate: true,
          requestTimeout: 0,
        },
      },
    }
  ),
  sero_naucalpan: new Sequelize("sero_naucalpan", "sa", "Erpp123.", {
    host: "201.163.165.20",
    dialect: "mssql",
    dialectOptions: {
      options: {
        encrypt: false,
        trustServerCertificate: true,
      },
    },
  }),
};

export const getDatabaseInstance = (place_id) => {
  // Aquí debes mapear place_id al nombre de la instancia correcta en dbManager
  switch (place_id) {
    case 0:
      return dbManager.db_prueba;
    case 1:
      return dbManager.sero_central;
    case 2:
      return dbManager.sero_cuautitlan_izcalli;
    case 4:
      return dbManager.sero_naucalpan;
    default:
      return null; // Manejo de error si el place_id no es válido
  }
};

export default dbManager;
