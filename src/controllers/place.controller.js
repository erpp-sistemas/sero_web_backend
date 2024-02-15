import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";
export const getPlaceByUserId = async (req, res) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const [placeFound, metadata] = await sequelize.query(
      `execute sp_get_place_by_user_id '${req.params.user_id}'`
    );

    console.log("este es el param:" + req.params.user_id);

    if (!placeFound[0])
      return res.status(400).json({
        message: "not found place",
      });

    res.json(placeFound);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "place not found" });
  }
};

export const getPlaceServiceByUserId = async (req, res) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const user_id = req.params.user_id;
    const place_id_parameter = req.params.place_id; // Assuming place_id is in the request body

    const [placeFound, metadata] = await sequelize.query(
      `execute sp_get_user_place_service @user_id = :user_id, @place_id = :place_id`,
      {
        replacements: { user_id, place_id: place_id_parameter },
      }
    );

    console.log("este es el param:" + user_id);

    if (!placeFound[0]) {
      return res.status(400).json({
        message: "not found place",
      });
    }

    res.json(placeFound);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "place not found" });
  }
};

export const getProcessesByUserPlaceAndServiceId = async (req, res) => {
  try {
    const { user_id, place_id, service_id } = req.params;

    // Get the Sequelize instance for the specified place_id
    const plaze_id = 0;
    const sequelize = getDatabaseInstance(plaze_id);

    // Execute the stored procedure to get processes
    const [processes, metadata] = await sequelize.query(
      `execute sp_get_user_place_service_process @user_id = :user_id, @place_id = :place_id, @service_id = :service_id`,
      {
        replacements: { user_id, place_id, service_id },
      }
    );

    if (!processes[0]) {
      return res.status(404).json({
        message:
          "Processes not found for the specified user, place, and service.",
      });
    }

    res.json(processes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getPlaceById = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    const [placeFound, metadata] = await sequelize.query(
      `execute sp_get_place_by_id '${req.params.place_id}'`
    );

    console.log("este es el param:" + req.params.place_id);

    if (!placeFound[0])
      return res.status(400).json({
        message: "not found place",
      });

    res.json(placeFound);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "place not found" });
  }
};



// Define el esquema Joi para la tabla plaza_servicio_proceso
const createPlazaServiceProcessSchema = Joi.object({
  id_plaza: Joi.number().integer().positive().required(),
  id_servicio: Joi.number().integer().positive().required(),
  id_proceso: Joi.number().integer().positive().required(),
  active: Joi.boolean().required(),
});

// Define the validation schema for plaza data
const createPlazaSchema = Joi.object({
  nombre: Joi.string().required(),
  imagen: Joi.string().required(),
  activo: Joi.boolean().required(),
  latitud: Joi.number().required(),
  longitud: Joi.number().required(),
  estado_republica: Joi.string().required(),
  radius: Joi.number().required(),
});

/**
 * Inserts plaza data into the database.
 *
 * @param {Object} plazaData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertPlazaToDatabase = async (plazaData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute the query to insert plaza data into the database
  const [plazaCreated] = await sequelize.query(
    `
    INSERT INTO db_prueba.dbo.plaza (nombre, imagen, activo, latitud, longitud, estado_republica, radius)
    VALUES (:nombre, :imagen, :activo, :latitud, :longitud, :estado_republica, :radius);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: plazaData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  // Check if the plaza was created successfully
  if (!plazaCreated || plazaCreated.length === 0 || !plazaCreated.insertedId) {
    // If the plaza creation was not successful, throw an error
    throw new Error("Failed to create plaza");
  }
  return plazaCreated.insertedId;
};

/**
 * Creates a new plaza using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the plaza creation fails.
 */
export const createPlaza = async (req, res) => {
  try {

    console.log(req.body);
   
    // Validate the request body against the schema
    const { error, value } = createPlazaSchema.validate(req.body);

    if (error) {
      // If there are validation errors, respond with a 400 error and error details
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const plazaData = value;

    await insertPlazaToDatabase(plazaData);

    // Send a success response or additional data as needed
    res.json({ message: "Plaza created successfully" });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to create plaza" });
  }
};

/**
 * Deletes a specific plaza by its ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deletePlaza = async (req, res) => {
  const plazaId = req.params.id;

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to delete the specific plaza by ID
    const [deletedPlaza, deleteMetadata] = await sequelize.query(
      `
      DELETE FROM db_prueba.dbo.plaza WHERE id_plaza = :id;
    `,
      {
        replacements: { id: plazaId },
      }
    );

    if (deleteMetadata > 0) {
      // Send a success response or additional data as needed
      res.json({ message: "Plaza deleted successfully" });
    } else {
      res.status(404).json({ message: "Plaza not found" });
    }
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to delete plaza" });
  }
};

/**
 * Retrieves all plazas from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllPlazas = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to get all plazas
    const [plazas, metadata] = await sequelize.query(`
      SELECT * FROM db_prueba.dbo.plaza;
    `);

    // Send the retrieved plazas as a JSON response
    res.json(plazas);
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve plazas" });
  }
};

/**
 * Updates a specific plaza by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updatePlaza = async (req, res) => {
  const plazaId = req.params.id;

  const updatedPlazaData = req.body;

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to update a specific plaza by ID
    const [updatedPlaza, metadata] = await sequelize.query(
      `
      UPDATE db_prueba.dbo.plaza
      SET nombre = :nombre, imagen = :imagen, activo = :activo, orden = :orden, 
          fecha_ingreso = :fecha_ingreso, id_horario = :id_horario, latitud = :latitud,
          longitud = :longitud, estado_republica = :estado_republica, radius = :radius
      OUTPUT inserted.*
      WHERE id_plaza = :id_plaza;
    `,
      {
        replacements: { id_plaza: plazaId, ...updatedPlazaData },
      }
    );

    if (updatedPlaza && updatedPlaza.length > 0) {
      res.json({ message: "Plaza updated successfully", updatedPlaza });
    } else {
      res.status(404).json({ message: "Plaza not found or not updated" });
    }
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to update plaza" });
  }
};

// Define the validation schema for user plaza service process data
const createUserPlazaServiceProcessSchema = Joi.object({
  id_usuario_plaza: Joi.number(),
  id_usuario: Joi.number(),
  id_plaza: Joi.number(),
  id_servicio: Joi.number(),
  id_proceso: Joi.number().integer(),
});

/**
 * Inserts user plaza service process data into the database.
 *
 * @param {Object} userPlazaServiceProcessData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertUserPlazaServiceProcessToDatabase = async (
  userPlazaServiceProcessData
) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute the query to insert user plaza service process data into the database
  const [userPlazaServiceProcessCreated] = await sequelize.query(
    `
    INSERT INTO dbo.usuario_plaza_servicio_proceso (id_usuario, id_plaza, id_servicio, id_proceso)
    VALUES (:id_usuario, :id_plaza, :id_servicio, :id_proceso);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: userPlazaServiceProcessData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  console.info(userPlazaServiceProcessCreated);

  // Check if the user plaza service process data was created successfully
  if (
    !userPlazaServiceProcessCreated ||
    userPlazaServiceProcessCreated.length === 0 ||
    !userPlazaServiceProcessCreated.insertedId
  ) {
    // If the user plaza service process data creation was not successful, throw an error
    throw new Error("Failed to create user plaza service process data");
  }
  return userPlazaServiceProcessCreated.insertedId;
};



/**
 * Inserts user plaza service process data into the database.
 *
 * @param {Object} PlazaServiceProcessData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertPlazaServiceProcessToDatabase = async (
  PlazaServiceProcessData
) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute the query to insert user plaza service process data into the database
  const [PlazaServiceProcessCreated] = await sequelize.query(
    `
    INSERT INTO dbo.plaza_servicio_proceso ( id_plaza, id_servicio, id_proceso,active)
    VALUES (:id_plaza, :id_servicio, :id_proceso, :active);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: PlazaServiceProcessData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  console.info(PlazaServiceProcessCreated);

  // Check if the user plaza service process data was created successfully
  if (
    !PlazaServiceProcessCreated ||
    PlazaServiceProcessCreated.length === 0 ||
    !PlazaServiceProcessCreated.insertedId
  ) {
    // If the user plaza service process data creation was not successful, throw an error
    throw new Error("Failed to create user plaza service process data");
  }
  return PlazaServiceProcessCreated.insertedId;
};

/**
 * Creates a new user plaza service process data using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the user plaza service process data creation fails.
 */
export const createUserPlazaServiceProcess = async (req, res) => {
  try {
    // Validate the request body against the schema
    const { error, value } = createUserPlazaServiceProcessSchema.validate(
      req.body
    );

    if (error) {
      // If there are validation errors, respond with a 400 error and error details
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const userPlazaServiceProcessData = value;

    await insertUserPlazaServiceProcessToDatabase(userPlazaServiceProcessData);

    // Send a success response or additional data as needed
    res.json({
      message: "User plaza service process data created successfully",
    });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create user plaza service process data" });
  }
};




/**
 * Creates a new user plaza service process data using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the user plaza service process data creation fails.
 */
export const createPlazaServiceProcess = async (req, res) => {
  try {
    // Validate the request body against the schema
    console.log(req.body);
    const { error, value } = createPlazaServiceProcessSchema.validate(
      req.body
    );

    if (error) {
      // If there are validation errors, respond with a 400 error and error details
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const userPlazaServiceProcessData = value;

    await insertPlazaServiceProcessToDatabase(userPlazaServiceProcessData);

    // Send a success response or additional data as needed
    res.json({
      message: "plaza service process data created successfully",
    });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to create user plaza service process data" });
  }
};

/**
 * Obtains user plaza service process data from the database based on plaza ID.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves once the data is obtained.
 * @throws {Error} - Throws an error if the retrieval fails.
 */

export const getAllPlaceAndServiceAndProcess = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute the query to obtain all plaza service process data from the database
    const allPlazaServiceProcessData = await sequelize.query(
      `
      SELECT id_plaza_servicio_proceso, id_plaza, id_servicio, id_proceso, active
      FROM db_prueba.dbo.plaza_servicio_proceso;
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Check if plaza service process data was retrieved successfully
    if (
      !allPlazaServiceProcessData ||
      allPlazaServiceProcessData.length === 0
    ) {
      // If the retrieval was not successful, throw an error
      throw new Error("Failed to retrieve plaza service process data");
    }

    res.json(allPlazaServiceProcessData); // Send the data as a JSON response
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to retrieve plaza service process data" });
  }
};

/**
 * Inserts user plaza service process data into the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
export const insertPlaceAndServiceAndProcess = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Extract plazaId and other data from req.body

    const { id_plaza, id_servicio, id_proceso } = req.body;

    // Execute the query to insert user plaza service process data into the database
    const [insertedData, metadata] = await sequelize.query(
      `
      INSERT INTO db_prueba.dbo.plaza_servicio_proceso (id_plaza, id_servicio, id_proceso)
      VALUES (:id_plaza, :id_servicio, :id_proceso);
    `,
      {
        replacements: { id_plaza, id_servicio, id_proceso },
      }
    );

    if (insertedData) {
      res.json({
        message: "User plaza service process data inserted successfully",
        insertedData,
      });
    } else {
      res
        .status(500)
        .json({ message: "Failed to insert user plaza service process data" });
    }
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res
      .status(500)
      .json({ message: "Failed to insert user plaza service process data" });
  }
};
