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

// Define el esquema de validación para los datos del cuerpo de la solicitud de menu_rol
const createMenuRolSchema = Joi.object({
    id_menu_rol: Joi.number(),
    id_menu: Joi.number(),
    id_rol: Joi.number(),
    activo: Joi.boolean().required(),
  });

// Define el esquema de validación para los datos del cuerpo de la solicitud de menu_rol_usuario
const createMenuRolUsuarioSchema = Joi.object({
    id_menu_rol_usuario: Joi.number(),
    id_menu: Joi.number(),
    id_rol: Joi.number(),
    id_usuario: Joi.number(),
    activo: Joi.boolean().required(),
  });


  // Define el esquema de validación para los datos del cuerpo de la solicitud de sub_menu_rol_usuario
const createSubMenuRolUsuarioSchema = Joi.object({
    id_sub_menu_rol_usuario: Joi.number(),
    id_sub_menu: Joi.number(),
    id_rol: Joi.number(),
    id_usuario: Joi.number(),
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
 * Retrieves all sub_menu_rol entries from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllSubMenuRol = async (req, res) => {
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get all sub_menu_rol entries
      const [subMenuRols, metadata] = await sequelize.query(`
        SELECT * FROM db_prueba.dbo.sub_menu_rol;
      `);
  
      // Send the retrieved sub_menu_rol entries as a JSON response
      res.json(subMenuRols);
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve sub_menu_rol entries" });
    }
  };


  
/**
 * Updates a specific sub_menu_rol entry by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateSubMenuRol = async (req, res) => {
    const subMenuRolId = req.params.id;
  
    const updatedSubMenuRolData = req.body;
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to update a specific sub_menu_rol entry by ID
      const [updatedSubMenuRol, metadata] = await sequelize.query(
        `
        UPDATE db_prueba.dbo.sub_menu_rol
        SET id_sub_menu = :id_sub_menu, id_rol = :id_rol, activo = :activo
        OUTPUT inserted.*
        WHERE id_sub_menu_rol = :id_sub_menu_rol;
      `,
        {
          replacements: { id_sub_menu_rol: subMenuRolId, ...updatedSubMenuRolData },
        }
      );
  
      if (updatedSubMenuRol && updatedSubMenuRol.length > 0) {
        res.json({ message: "sub_menu_rol entry updated successfully", updatedSubMenuRol });
      } else {
        res.status(404).json({ message: "sub_menu_rol entry not found or not updated" });
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to update sub_menu_rol entry" });
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
  
    // Execute stored procedure or perform actions to create a new menu_rol entry
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
  
    // Check if the menu_rol entry was created successfully
    if (
      !menuRolCreated ||
      menuRolCreated.length === 0 ||
      !menuRolCreated.insertedId
    ) {
      // If the menu_rol creation was not successful, throw an error
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
      // Validar los datos del cuerpo de la solicitud con el esquema
      const { error, value } = createMenuRolSchema.validate(req.body);
  
      if (error) {
        // Si hay errores de validación, responde con un error 400 y los detalles del error
        return res
          .status(400)
          .json({ message: "Invalid request body", error: error.details });
      }
  
      const menuRolData = extractMenuRolData(value);
  
      await insertMenuRolToDatabase(menuRolData);
  
      // Send a success response or additional data as needed
      res.json({ message: "menu_rol entry created successfully" });
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to create menu_rol entry" });
    }
  };


  /**
 * Retrieves all menu_rol entries from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllMenuRol = async (req, res) => {
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get all menu_rol entries
      const [menuRols, metadata] = await sequelize.query(`
        SELECT id_menu_rol, id_menu, id_rol, activo FROM db_prueba.dbo.menu_rol;
      `);
  
      // Send the retrieved menu_rol entries as a JSON response
      res.json(menuRols);
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve menu_rol entries" });
    }
  };


  /**
 * Updates a specific menu_rol entry by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateMenuRol = async (req, res) => {
    const menuRolId = req.params.id;
  
    const updatedMenuRolData = req.body;
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to update a specific menu_rol entry by ID
      const [updatedMenuRol, metadata] = await sequelize.query(
        `
        UPDATE db_prueba.dbo.menu_rol
        SET id_menu = :id_menu, id_rol = :id_rol, activo = :activo
        OUTPUT inserted.*
        WHERE id_menu_rol = :id_menu_rol;
      `,
        {
          replacements: { id_menu_rol: menuRolId, ...updatedMenuRolData },
        }
      );
  
      if (updatedMenuRol && updatedMenuRol.length > 0) {
        res.json({ message: "menu_rol entry updated successfully", updatedMenuRol });
      } else {
        res.status(404).json({ message: "menu_rol entry not found or not updated" });
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to update menu_rol entry" });
    }
  };


  /**
 * Deletes a specific menu_rol entry by its ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteMenuRol = async (req, res) => {
    const menuRolId = req.params.id;
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get the menu_rol information before deleting
      const [menuRolToDelete, menuRolMetadata] = await sequelize.query(
        `
        SELECT * FROM db_prueba.dbo.menu_rol WHERE id_menu_rol = :id;
      `,
        {
          replacements: { id: menuRolId },
        }
      );
  
      // Check if the menu_rol entry to delete was found
      if (
        menuRolToDelete &&
        menuRolToDelete.length > 0
      ) {
        // Execute query to delete the specific menu_rol entry by ID
        const [deletedMenuRol, deleteMetadata] = await sequelize.query(
          `
          DELETE FROM db_prueba.dbo.menu_rol WHERE id_menu_rol = :id;
        `,
          {
            replacements: { id: menuRolId },
          }
        );
  
        if (deleteMetadata > 0) {
          // Send a success response or additional data as needed
          res.json({ message: "menu_rol entry deleted successfully" });
        } else {
          res.status(404).json({ message: "menu_rol entry not found" });
        }
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: 'Failed to delete menu_rol entry' });
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



/**
 * Inserts menu_rol_usuario data into the database.
 *
 * @param {Object} menuRolUsuarioData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertMenuRolUsuarioToDatabase = async (menuRolUsuarioData) => {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);
  
    // Execute stored procedure or perform actions to create a new menu_rol_usuario entry
    const [menuRolUsuarioCreated] = await sequelize.query(
      `
      INSERT INTO db_prueba.dbo.menu_rol_usuario (id_menu, id_rol, id_usuario, activo)
      VALUES (:id_menu, :id_rol, :id_usuario, :activo);
      SELECT SCOPE_IDENTITY() AS insertedId;
    `,
      {
        replacements: menuRolUsuarioData,
        type: sequelize.QueryTypes.SELECT,
      }
    );
  
    console.info(menuRolUsuarioCreated);
  
    // Check if the menu_rol_usuario entry was created successfully
    if (
      !menuRolUsuarioCreated ||
      menuRolUsuarioCreated.length === 0 ||
      !menuRolUsuarioCreated.insertedId
    ) {
      // If the menu_rol_usuario creation was not successful, throw an error
      throw new Error("Failed to create menu_rol_usuario entry");
    }
    return menuRolUsuarioCreated.insertedId;
  };
  
  /**
   * Creates a new menu_rol_usuario entry using the provided data.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if the menu_rol_usuario entry creation fails.
   */
  export const createMenuRolUsuario = async (req, res) => {
    try {
      // Validar los datos del cuerpo de la solicitud con el esquema
      const { error, value } = createMenuRolUsuarioSchema.validate(req.body);
  
      if (error) {
        // Si hay errores de validación, responde con un error 400 y los detalles del error
        return res
          .status(400)
          .json({ message: "Invalid request body", error: error.details });
      }
  
      const menuRolUsuarioData = extractMenuRolUsuarioData(value);
  
      await insertMenuRolUsuarioToDatabase(menuRolUsuarioData);
  
      // Send a success response or additional data as needed
      res.json({ message: "menu_rol_usuario entry created successfully" });
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to create menu_rol_usuario entry" });
    }
  };


  
/**
 * Retrieves all menu_rol_usuario entries from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllMenuRolUsuario = async (req, res) => {
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get all menu_rol_usuario entries
      const [menuRolUsuarios, metadata] = await sequelize.query(`
        SELECT id_menu_rol_usuario, id_menu, id_rol, id_usuario, activo FROM db_prueba.dbo.menu_rol_usuario;
      `);
  
      // Send the retrieved menu_rol_usuario entries as a JSON response
      res.json(menuRolUsuarios);
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve menu_rol_usuario entries" });
    }
  };


  /**
 * Updates a specific menu_rol_usuario entry by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateMenuRolUsuario = async (req, res) => {
    const menuRolUsuarioId = req.params.id;
  
    const updatedMenuRolUsuarioData = req.body;
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to update a specific menu_rol_usuario entry by ID
      const [updatedMenuRolUsuario, metadata] = await sequelize.query(
        `
        UPDATE db_prueba.dbo.menu_rol_usuario
        SET id_menu = :id_menu, id_rol = :id_rol, id_usuario = :id_usuario, activo = :activo
        OUTPUT inserted.*
        WHERE id_menu_rol_usuario = :id_menu_rol_usuario;
      `,
        {
          replacements: { id_menu_rol_usuario: menuRolUsuarioId, ...updatedMenuRolUsuarioData },
        }
      );
  
      if (updatedMenuRolUsuario && updatedMenuRolUsuario.length > 0) {
        res.json({ message: "menu_rol_usuario entry updated successfully", updatedMenuRolUsuario });
      } else {
        res.status(404).json({ message: "menu_rol_usuario entry not found or not updated" });
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to update menu_rol_usuario entry" });
    }
  };




  /**
 * Deletes a specific menu_rol_usuario entry by its ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteMenuRolUsuario = async (req, res) => {
    const menuRolUsuarioId = req.params.id;
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get the menu_rol_usuario information before deleting
      const [menuRolUsuarioToDelete, menuRolUsuarioMetadata] = await sequelize.query(
        `
        SELECT * FROM db_prueba.dbo.menu_rol_usuario WHERE id_menu_rol_usuario = :id;
      `,
        {
          replacements: { id: menuRolUsuarioId },
        }
      );
  
      // Check if the menu_rol_usuario entry to delete was found
      if (
        menuRolUsuarioToDelete &&
        menuRolUsuarioToDelete.length > 0
      ) {
        // Execute query to delete the specific menu_rol_usuario entry by ID
        const [deletedMenuRolUsuario, deleteMetadata] = await sequelize.query(
          `
          DELETE FROM db_prueba.dbo.menu_rol_usuario WHERE id_menu_rol_usuario = :id;
        `,
          {
            replacements: { id: menuRolUsuarioId },
          }
        );
  
        if (deleteMetadata > 0) {
          // Send a success response or additional data as needed
          res.json({ message: "menu_rol_usuario entry deleted successfully" });
        } else {
          res.status(404).json({ message: "menu_rol_usuario entry not found" });
        }
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: 'Failed to delete menu_rol_usuario entry' });
    }
  };
  



  const extractMenuRolUsuarioData = (requestBody) => {
    const { id_menu, id_rol, id_usuario, activo } = requestBody;
  
    if (!id_menu || !id_rol || !id_usuario || !activo) {
      throw new Error("Invalid request body. Missing required properties.");
    }
  
    return { id_menu, id_rol, id_usuario, activo };
  };







  
/**
 * Inserts sub_menu_rol_usuario data into the database.
 *
 * @param {Object} subMenuRolUsuarioData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertSubMenuRolUsuarioToDatabase = async (subMenuRolUsuarioData) => {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);
  
    // Execute stored procedure or perform actions to create a new sub_menu_rol_usuario entry
    const [subMenuRolUsuarioCreated] = await sequelize.query(
      `
      INSERT INTO db_prueba.dbo.sub_menu_rol_usuario (id_sub_menu, id_rol, id_usuario, activo)
      VALUES (:id_sub_menu, :id_rol, :id_usuario, :activo);
      SELECT SCOPE_IDENTITY() AS insertedId;
    `,
      {
        replacements: subMenuRolUsuarioData,
        type: sequelize.QueryTypes.SELECT,
      }
    );
  
    console.info(subMenuRolUsuarioCreated);
  
    // Check if the sub_menu_rol_usuario entry was created successfully
    if (
      !subMenuRolUsuarioCreated ||
      subMenuRolUsuarioCreated.length === 0 ||
      !subMenuRolUsuarioCreated.insertedId
    ) {
      // If the sub_menu_rol_usuario creation was not successful, throw an error
      throw new Error("Failed to create sub_menu_rol_usuario entry");
    }
    return subMenuRolUsuarioCreated.insertedId;
  };
  
  /**
   * Creates a new sub_menu_rol_usuario entry using the provided data.
   *
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if the sub_menu_rol_usuario entry creation fails.
   */
  export const createSubMenuRolUsuario = async (req, res) => {
    try {
      // Validar los datos del cuerpo de la solicitud con el esquema
      const { error, value } = createSubMenuRolUsuarioSchema.validate(req.body);
  
      if (error) {
        // Si hay errores de validación, responde con un error 400 y los detalles del error
        return res
          .status(400)
          .json({ message: "Invalid request body", error: error.details });
      }
  
      const subMenuRolUsuarioData = extractSubMenuRolUsuarioData(value);
  
      await insertSubMenuRolUsuarioToDatabase(subMenuRolUsuarioData);
  
      // Send a success response or additional data as needed
      res.json({ message: "sub_menu_rol_usuario entry created successfully" });
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to create sub_menu_rol_usuario entry" });
    }
  };

  
/**
 * Retrieves all sub_menu_rol_usuario entries from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllSubMenuRolUsuario = async (req, res) => {
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to get all sub_menu_rol_usuario entries
      const [subMenuRolUsuarios, metadata] = await sequelize.query(`
        SELECT id_sub_menu_rol_usuario, id_sub_menu, id_rol, id_usuario, activo FROM db_prueba.dbo.sub_menu_rol_usuario;
      `);
  
      // Send the retrieved sub_menu_rol_usuario entries as a JSON response
      res.json(subMenuRolUsuarios);
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to retrieve sub_menu_rol_usuario entries" });
    }
  };


  
/**
 * Updates a specific sub_menu_rol_usuario entry by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateSubMenuRolUsuario = async (req, res) => {
    const subMenuRolUsuarioId = req.params.id;
  
    const updatedSubMenuRolUsuarioData = req.body;
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Execute query to update a specific sub_menu_rol_usuario entry by ID
      const [updatedSubMenuRolUsuario, metadata] = await sequelize.query(
        `
        UPDATE db_prueba.dbo.sub_menu_rol_usuario
        SET id_sub_menu = :id_sub_menu, id_rol = :id_rol, id_usuario = :id_usuario, activo = :activo
        OUTPUT inserted.*
        WHERE id_sub_menu_rol_usuario = :id_sub_menu_rol_usuario;
      `,
        {
          replacements: { id_sub_menu_rol_usuario: subMenuRolUsuarioId, ...updatedSubMenuRolUsuarioData },
        }
      );
  
      if (updatedSubMenuRolUsuario && updatedSubMenuRolUsuario.length > 0) {
        res.json({ message: "sub_menu_rol_usuario entry updated successfully", updatedSubMenuRolUsuario });
      } else {
        res.status(404).json({ message: "sub_menu_rol_usuario entry not found or not updated" });
      }
    } catch (error) {
      // Log the error and send a 500 status with a JSON response
      console.error(error);
      res.status(500).json({ message: "Failed to update sub_menu_rol_usuario entry" });
    }
  };




  
/**
 * Extracts sub_menu_rol_usuario data from the request body.
 *
 * @param {Object} requestBody - The request body containing sub_menu_rol_usuario data.
 * @returns {Object} - The extracted sub_menu_rol_usuario data.
 * @throws {Error} - Throws an error if the extraction fails or if required properties are missing.
 */
const extractSubMenuRolUsuarioData = (requestBody) => {
    const { id_sub_menu, id_rol, id_usuario, activo } = requestBody;
  
    if (!id_sub_menu || !id_rol || !id_usuario || !activo) {
      throw new Error("Invalid request body. Missing required properties.");
    }
  
    return { id_sub_menu, id_rol, id_usuario, activo };
  };


