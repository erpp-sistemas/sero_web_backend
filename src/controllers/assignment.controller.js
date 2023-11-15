
import { getDatabaseInstance } from "../config/dbManager.config.js";


const postWorkAssignment = async (req, res) => {
  const { place_id, service_id, excelData } = req.body;

  try {
    const sequelize = getDatabaseInstance(place_id)  
    
    console.log('este es el excelData',excelData)

    // Elimina todos los registros de la tabla 'asig'
    const deleteQuery = 'DELETE FROM asignacion_excel';
    await sequelize.query(deleteQuery, { type: sequelize.QueryTypes.DELETE });

    for (const item of excelData){
      const [cuenta, tarea, usuario] = item;

      // Inserta el registro en la base de datos uno por uno usando sequelize.query
      const insertQuery = `
        INSERT INTO asignacion_excel (cuenta, tarea, usuario)
        VALUES (:cuenta, :tarea, :usuario)
      `;
      await sequelize.query(insertQuery, {
        replacements: { cuenta, tarea, usuario },
        type: sequelize.QueryTypes.INSERT,
      });

      console.log('Registro insertado correctamente:', item);
    }

    const [assignmentFound, metadata] = await sequelize.query(`execute sp_load_assignment ${service_id}`)

    if(!assignmentFound[0]) return res.status(400).json({
      message: "Assignment not found"
    })

    console.log(assignmentFound)

    res.status(200).json(assignmentFound);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export default postWorkAssignment