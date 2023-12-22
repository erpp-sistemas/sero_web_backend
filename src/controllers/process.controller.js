import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";
export const getPlaceServiceProcessByUserId = async (req, res) => {
  
  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 

    try {
      const [processFound, metadata] = await sequelize.query(`execute sp_get_place_service_process_by_user_id '${req.params.user_id}'`)

      if(!processFound[0]) return res.status(400).json({
        message: "not found process"
      })      
    
      res.json(processFound)

    } catch (error) {
      console.log(error)
      return res.status(404).json({message: 'process not found'})
    }  
  }


  /**
 * Validation schema for creating a process.
 * @typedef {Object} CreateProcessSchema
 * @property {string} name - The name of the process. Required.
 * @property {string} image - The image URL of the process.
 * @property {boolean} active - Indicates whether the process is active. Required.
 * @property {string} stored_procedure_management - The stored procedure for management.
 * @property {string} stored_procedure_management_graphic - The stored procedure for graphical management.
 * @property {string} management_table- The management table.
 * @property {string} mobile_application_url - The mobile application URL.
 */
const createProcessSchema = Joi.object({
  nombre: Joi.string(),
  imagen: Joi.string(),
  activo: Joi.boolean(),
  procedimiento_almacenado_gestion: Joi.string(),
  procedimiento_almacenado_gestion_grafico: Joi.string(),
  tabla_gestion: Joi.string(),
  url_aplicacion_movil: Joi.string(),
  });

  /**
 * Creates a new process category using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the process category creation fails.
 */
export const createProcess = async (req, res) => {
  try {
    // Validate the request body data with the schema
    const { error, value } = createProcessSchema.validate(req.body);

    if (error) {
      // If there are validation errors, respond with a 400 error and the error details
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const processData = extractProcessData(value);

    await insertProcessToDatabase(processData);

    // Send a success response or additional data as needed
    res.json({ message: "Process category created successfully" });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to create process category" });
  }
};

/**
 * Inserts process data into the database.
 *
 * @param {Object} processData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
export const insertProcessToDatabase = async (processData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute stored procedure or perform actions to create a new process category
  const [processCreated, metadata] = await sequelize.query(
    `
    INSERT INTO dbo.proceso (
      nombre,
      imagen,
      activo,
      procedimiento_almacenado_gestion,
      procedimiento_almacenado_gestion_grafico,
      tabla_gestion,
      url_aplicacion_movil
    )
    VALUES (
      :nombre,
      :imagen,
      :activo,
      :procedimiento_almacenado_gestion,
      :procedimiento_almacenado_gestion_grafico,
      :tabla_gestion,
      :url_aplicacion_movil
    );
  `,
    {
      replacements: processData,
    }
  );

  /* // Check if the process was created successfully
  if (!(processCreated && processCreated.length > 0)) {
    // If the process creation was not successful, throw an error
    throw new Error("Failed to create process category");
  } */
};

// Helper function to extract process data
/**
 * Extracts process data from the request body.
 *
 * @param {Object} requestBody - The request body containing process data.
 * @returns {Object} - The extracted process data.
 * @throws {Error} - Throws an error if the extraction fails or if required properties are missing.
 */
export const extractProcessData = (requestBody) => {
  const {
    nombre,
    imagen,
    activo,
    procedimiento_almacenado_gestion,
    procedimiento_almacenado_gestion_grafico,
    tabla_gestion,
    url_aplicacion_movil,
  } = requestBody;

 /*  if (!nombre || !imagen  || !procedimiento_almacenado_gestion || !procedimiento_almacenado_gestion_grafico || !tabla_gestion || !url_aplicacion_movil) {
    throw new Error("Invalid request body. Missing required properties.");
  } */

  return {
    nombre,
    imagen,
    activo,
    procedimiento_almacenado_gestion,
    procedimiento_almacenado_gestion_grafico,
    tabla_gestion,
    url_aplicacion_movil,
  };
};