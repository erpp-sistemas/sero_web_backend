import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";
export const getPlaceServiceByUserId = async (req, res) => {

  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id) 
  
    try {
      const [serviceFound, metadata] = await sequelize.query(`execute sp_get_place_service_by_user_id '${req.params.user_id}','${req.params.place_id}'`)

      if(!serviceFound[0]) return res.status(400).json({
        message: "not found service"
      })      
    
      res.json(serviceFound)

    } catch (error) {
      console.log(error)
      return res.status(404).json({message: 'service not found'})
    }  
  }


  /**
 * Joi schema for creating a service.
 * @typedef {Object} CreateServiceSchema
 * @property {string} name - The name of the service. Required.
 * @property {string} image - The image URL of the service.
 * @property {boolean} active - Indicates whether the service is active. Required.
 * @property {number} order - The order of the service (integer).
 * @property {string} mobile_app_icon - The icon URL for the mobile app.
 */
/**
 * Define the validation schema for creating a service.
 * @type {Joi.ObjectSchema<CreateServiceSchema>}
 */
const createServiceSchema = Joi.object({
  nombre: Joi.string(),
  imagen: Joi.string(),
  activo: Joi.boolean(),
  orden: Joi.number().integer(),
  icono_app_movil: Joi.string(),
});


/**
 * Creates a new service using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the service creation fails.
 */
export const createService = async (req, res) => {
  try {
    // Validate the request body data with the schema
    const { error, value } = createServiceSchema.validate(req.body);

    if (error) {
      // If there are validation errors, respond with a 400 error and the error details
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const serviceData = extractServiceData(value);

    await insertServiceToDatabase(serviceData);

    // Send a success response or additional data as needed
    res.json({ message: "Service created successfully" });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to create service" });
  }
};



const insertServiceToDatabase = async (serviceData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute stored procedure or perform actions to create a new service
  const [serviceCreated, metadata] = await sequelize.query(
    `
    INSERT INTO [dbo].[servicio] (nombre, imagen, activo, orden, icono_app_movil)
  VALUES (:nombre, :imagen, :activo, :orden, :icono_app_movil);
  SELECT SCOPE_IDENTITY() AS newServiceId;
  `,
    {
      replacements: serviceData,
    }
  );

  console.log(serviceCreated);

  // Check if the service was created successfully
  if (!(serviceCreated && serviceCreated.length > 0)) {
    // If the service creation was not successful, throw an error
    throw new Error("Failed to create service");
  }
};


const extractServiceData = (requestBody) => {
  const { nombre, imagen, activo, orden, icono_app_movil } = requestBody;

 /*  if (!nombre || !imagen || !activo || !orden || !icono_app_movil) {
    throw new Error("Invalid request body. Missing required properties.");
  } */

  return {
    nombre,
    imagen,
    activo,
    orden,
    icono_app_movil,
  };
};