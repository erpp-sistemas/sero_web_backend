// /controllers/task.controller.js
import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";

// Define el esquema de validación para los datos del cuerpo de la solicitud
const createSubMenuRolSchema = Joi.object({
  id: Joi.number(),
  id_sub_menu: Joi.number(),
  id_rol: Joi.number(),
  activo: Joi.boolean().required(),
});

/**
 * Inserts sub_menu_rol data into the database.
 *
 * @param {Object} subMenuRolData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertSubMenuRolToDatabase = async (subMenuRolData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute stored procedure or perform actions to create a new sub_menu_rol entry
  const [subMenuRolCreated] = await sequelize.query(
    `
    INSERT INTO db_prueba.dbo.sub_menu_rol (id_sub_menu, id_rol, activo)
    VALUES (:id_sub_menu, :id_rol, :activo);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: subMenuRolData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  console.info(subMenuRolCreated);

  // Check if the sub_menu_rol entry was created successfully
  if (
    !subMenuRolCreated ||
    subMenuRolCreated.length === 0 ||
    !subMenuRolCreated.insertedId
  ) {
    // If the sub_menu_rol creation was not successful, throw an error
    throw new Error("Failed to create sub_menu_rol entry");
  }
  return subMenuRolCreated.insertedId;
};

/**
 * Creates a new sub_menu_rol entry using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the sub_menu_rol entry creation fails.
 */
export const createSubMenuRol = async (req, res) => {
  try {
    // Validar los datos del cuerpo de la solicitud con el esquema
    const { error, value } = createSubMenuRolSchema.validate(req.body);

    if (error) {
      // Si hay errores de validación, responde con un error 400 y los detalles del error
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const subMenuRolData = extractSubMenuRolData(value);

    await insertSubMenuRolToDatabase(subMenuRolData);

    // Send a success response or additional data as needed
    res.json({ message: "sub_menu_rol entry created successfully" });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to create sub_menu_rol entry" });
  }
};


/**
 * Deletes a specific sub_menu_rol entry by its ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteSubMenuRol = async (req, res) => {
    const subMenuRolId = req.params.id;
  
    console.log(subMenuRolId);
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get the sub_menu_rol information before deleting
      const [subMenuRolToDelete, subMenuRolMetadata] = await sequelize.query(
        `
        SELECT * FROM db_prueba.dbo.sub_menu_rol WHERE id_sub_menu_rol = :id;
      `,
        {
          replacements: { id: subMenuRolId },
        }
      );
  
      // Check if the sub_menu_rol entry to delete was found
      if (
        subMenuRolToDelete &&
        subMenuRolToDelete.length > 0
      ) {
        // Execute query to delete the specific sub_menu_rol entry by ID
        const [deletedSubMenuRol, deleteMetadata] = await sequelize.query(
          `
          DELETE FROM db_prueba.dbo.sub_menu_rol WHERE id_sub_menu_rol = :id;
        `,
          {
            replacements: { id: subMenuRolId },
          }
        );
  
        if (deleteMetadata > 0) {
          // Send a success response or additional data as needed
          res.json({ message: "sub_menu_rol entry deleted successfully" });
        } else {
          res.status(404).json({ message: "sub_menu_rol entry not found" });
        }
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: 'Failed to delete sub_menu_rol entry' });
    }
  };


/**
 * Extracts sub_menu_rol data from the request body.
 *
 * @param {Object} requestBody - The request body containing sub_menu_rol data.
 * @returns {Object} - The extracted sub_menu_rol data.
 * @throws {Error} - Throws an error if the extraction fails or if required properties are missing.
 */
const extractSubMenuRolData = (requestBody) => {
    const { id_sub_menu, id_rol, activo } = requestBody;
  
    if (!id_sub_menu || !id_rol || !activo) {
      throw new Error("Invalid request body. Missing required properties.");
    }
  
    return { id_sub_menu, id_rol, activo };
  };


