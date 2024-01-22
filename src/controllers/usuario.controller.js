import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";

// Define the validation schema for user data
const userSchema = Joi.object({
  id_usuario: Joi.number(),
  nombre: Joi.string().required(),
  apellido_paterno: Joi.string().required(),
  apellido_materno: Joi.string().required(),
  fecha_nacimiento: Joi.date(),
  id_sexo: Joi.number().integer(),
  foto: Joi.string(),
  qr: Joi.string(),
  activo: Joi.boolean().required(),
  fecha_ingreso: Joi.date(),
  fecha_baja: Joi.date(),
  telefono_personal: Joi.string(),
  telefono_empresa: Joi.string(),
  id_user_push: Joi.string(),
  app_version: Joi.string(),
});

/**
 * Inserts user data into the database.
 *
 * @param {Object} userData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
export const insertUserToDatabase = async (userData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  const [userCreated] = await sequelize.query(
    `
    INSERT INTO db_prueba.dbo.usuario (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, id_sexo, foto, qr, activo, fecha_ingreso, fecha_baja, telefono_personal, telefono_empresa, id_user_push, app_version)
    VALUES (:nombre, :apellido_paterno, :apellido_materno, :fecha_nacimiento, :id_sexo, :foto, :qr, :activo, :fecha_ingreso, :fecha_baja, :telefono_personal, :telefono_empresa, :id_user_push, :app_version);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: userData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  // Check if the user was created successfully
  if (!userCreated || userCreated.length === 0 || !userCreated.insertedId) {
    throw new Error("Failed to create user");
  }
  return userCreated.insertedId;
};

/**
 * Creates a new user using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the user creation fails.
 */
export const createUser = async (req, res) => {
  try {
    // Validate the request body data against the schema
    const { error, value } = userSchema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "Invalid request body", error: error.details });
    }

    const userData = value;

    await insertUserToDatabase(userData);

    // Send a success response or additional data as needed
    res.json({ message: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

/**
 * Deletes a specific user by its ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to delete the specific user by ID
    const [deletedUser, deleteMetadata] = await sequelize.query(
      `
      DELETE FROM db_prueba.dbo.usuario WHERE id_usuario = :id_usuario;
    `,
      {
        replacements: { id_usuario: userId },
      }
    );

    if (deleteMetadata > 0) {
      // Send a success response or additional data as needed
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

/**
 * Retrieves all users from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllUsers = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to get all users
    const [users, metadata] = await sequelize.query(`
      SELECT id_usuario, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, id_sexo, foto, qr, activo, fecha_ingreso, fecha_baja, telefono_personal, telefono_empresa, id_user_push, app_version
      FROM db_prueba.dbo.usuario;
    `);

    // Send the retrieved users as a JSON response
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

/**
 * Updates a specific user by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateUser = async (req, res) => {
  const userId = req.params.id;

  const updatedUserData = req.body;

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to update a specific user by ID
    const [updatedUser, metadata] = await sequelize.query(
      `
      UPDATE db_prueba.dbo.usuario
      SET nombre = :nombre, apellido_paterno = :apellido_paterno, apellido_materno = :apellido_materno, fecha_nacimiento = :fecha_nacimiento, id_sexo = :id_sexo, foto = :foto, qr = :qr, activo = :activo, fecha_ingreso = :fecha_ingreso, fecha_baja = :fecha_baja, telefono_personal = :telefono_personal, telefono_empresa = :telefono_empresa, id_user_push = :id_user_push, app_version = :app_version
      OUTPUT inserted.*
      WHERE id_usuario = :id_usuario;
    `,
      {
        replacements: { id_usuario: userId, ...updatedUserData },
      }
    );

    if (updatedUser && updatedUser.length > 0) {
      res.json({ message: "User updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "User not found or not updated" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
