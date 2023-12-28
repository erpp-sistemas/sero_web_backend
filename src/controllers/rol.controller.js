

import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";
/**
 * Esquema de validación para crear un rol.
 * @typedef {Object} CreateRolSchema
 * @property {string} nombre - El nombre del rol. Obligatorio.
 * @property {boolean} activo - Indica si el rol está activo. Obligatorio.
 */
const createRolSchema = Joi.object({
    nombre: Joi.string().required(),
    activo: Joi.boolean().required(),
  });


  /**
 * Crea un nuevo rol utilizando los datos proporcionados.
 *
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la creación del rol.
 */
export const createRol = async (req, res) => {
    try {
      // Valida los datos del cuerpo de la solicitud con el esquema
      const { error, value } = createRolSchema.validate(req.body);
  
      if (error) {
        // Si hay errores de validación, responde con un error 400 y los detalles del error
        return res
          .status(400)
          .json({ message: "Cuerpo de solicitud no válido", error: error.details });
      }
  
      const rolData = extractRolData(value);
  
      await insertRolToDatabase(rolData);
  
      // Envía una respuesta exitosa o datos adicionales según sea necesario
      res.json({ message: "Rol creado exitosamente" });
    } catch (error) {
      // Registra el error y envía un estado 500 con una respuesta JSON
      console.error(error);
      res.status(500).json({ message: "Error al crear el rol" });
    }
  };
  
  /**
   * Inserta datos de rol en la base de datos.
   *
   * @param {Object} rolData - Los datos que se insertarán en la base de datos.
   * @returns {Promise<void>} - Una Promesa que se resuelve una vez que se insertan los datos.
   * @throws {Error} - Lanza un error si la inserción falla.
   */
  export const insertRolToDatabase = async (rolData) => {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);
  
    // Ejecuta la consulta para insertar un nuevo rol
    const [rolCreated, metadata] = await sequelize.query(
      `
      INSERT INTO db_prueba.dbo.rol (
        nombre,
        activo
      )
      VALUES (
        :nombre,
        :activo
      );
    `,
      {
        replacements: rolData,
      }
    );
  };
  
  /**
   * Extrae datos de rol del cuerpo de la solicitud.
   *
   * @param {Object} requestBody - El cuerpo de la solicitud que contiene datos de rol.
   * @returns {Object} - Los datos de rol extraídos.
   * @throws {Error} - Lanza un error si la extracción falla o si faltan propiedades requeridas.
   */
  export const extractRolData = (requestBody) => {
    const { nombre, activo } = requestBody;
  
    if (!nombre || activo === undefined) {
      throw new Error("Cuerpo de solicitud no válido. Faltan propiedades requeridas.");
    }
  
    return {
      nombre,
      activo,
    };
  };
  /**
 * Obtiene todos los roles de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la recuperación.
 */
export const getAllRoles = async (req, res) => {
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Ejecuta la consulta para obtener todos los roles
      const [roles, metadata] = await sequelize.query(`
        SELECT id_rol, nombre, activo FROM db_prueba.dbo.rol;
      `);
  
      // Envía los roles recuperados como una respuesta JSON
      res.json(roles);
    } catch (error) {
      // Registra el error y envía un estado 500 con una respuesta JSON
      console.error(error);
      res.status(500).json({ message: "Error al recuperar los roles" });
    }
  };
  

  
/**
 * Actualiza un rol específico por su ID en la base de datos.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la actualización.
 */
export const updateRol = async (req, res) => {
    const rolId = req.params.id;
    const updatedRolData = extractRolData(req.body);
  
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Ejecuta la consulta para actualizar un rol específico por su ID
      const [updatedRol, metadata] = await sequelize.query(
        `
        UPDATE db_prueba.dbo.rol
        SET
          nombre = :nombre,
          activo = :activo
        WHERE id_rol = :id ;
      `,
        {
          replacements: { id: rolId, ...updatedRolData },
        }
      );
  
      res.json({ message: "Rol actualizado exitosamente" });
    } catch (error) {
      // Registra el error y envía un estado 500 con una respuesta JSON
      console.error(error);
      res.status(500).json({ message: "Error al actualizar el rol" });
    }
  };