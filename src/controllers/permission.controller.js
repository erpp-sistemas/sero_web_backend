// /controllers/task.controller.js
import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";

// Define el esquema de validación para los datos del cuerpo de la solicitud
const createMenuRolSchema = Joi.object({
  id_menu_rol: Joi.number(),
  id_menu: Joi.number().required(),
  id_rol: Joi.number().required(),
  activo: Joi.boolean().required(),
});

/**
 * Inserts menu_rol data into the database.
 *
 * @param {Object} menuRolData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertMenuRolToDatabase = async (menuRolData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  const [menuRolCreated] = await sequelize.query(
    `
    INSERT INTO db_prueba.dbo.menu_rol (id_menu, id_rol, activo)
    VALUES (:id_menu, :id_rol, :activo);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: menuRolData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  console.info(menuRolCreated);

  if (!menuRolCreated || menuRolCreated.length === 0 || !menuRolCreated.insertedId) {
    throw new Error("Failed to create menu_rol entry");
  }

  return menuRolCreated.insertedId;
};

/**
 * Creates a new menu_rol entry using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the menu_rol entry creation fails.
 */
export const createMenuRol = async (req, res) => {
  try {
    const { error, value } = createMenuRolSchema.validate(req.body);

    if (error) {
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const menuRolData = value;

    await insertMenuRolToDatabase(menuRolData);

    res.json({ message: "MenuRol entry created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create MenuRol entry" });
  }
};



/**
 * Extracts menu_rol data from the request body.
 *
 * @param {Object} requestBody - The request body containing menu_rol data.
 * @returns {Object} - The extracted menu_rol data.
 * @throws {Error} - Throws an error if the extraction fails or if required properties are missing.
 */
const extractMenuRolData = (requestBody) => {
    const { id_menu, id_rol, activo } = requestBody;
  
    if (!id_menu || !id_rol || !activo) {
      throw new Error("Invalid request body. Missing required properties.");
    }
  
    return { id_menu, id_rol, activo };
  };