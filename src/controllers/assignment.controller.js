
import { getDatabaseInstance } from "../config/dbManager.config.js";


const postWorkAssignment = async (req, res) => {
  const { place_id, service_id, excelData } = req.body;

  try {
    const sequelize = getDatabaseInstance(place_id)   

    // Elimina todos los registros de la tabla 'asig'
    const deleteQuery = 'DELETE FROM asig';
    await sequelize.query(deleteQuery, { type: sequelize.QueryTypes.DELETE });

    for (const item of excelData) {
      const dataToInsert = {
        cuenta: String(item.cuenta),
        tarea: String(item.tarea),
        usuario: String(item.usuario),
      };

      // Inserta el registro en la base de datos uno por uno
      const insertQuery = `
        INSERT INTO asig (cuenta, tarea, usuario)
        VALUES (:cuenta, :tarea, :usuario)
      `;
      await sequelize.query(insertQuery, {
        replacements: dataToInsert,
        type: sequelize.QueryTypes.INSERT,
      });
    }

    res.status(200).json({
      message: 'Datos procesados con éxito',
      place_id,
      service_id,
      excelData // Devuelve los datos insertados
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export default postWorkAssignment