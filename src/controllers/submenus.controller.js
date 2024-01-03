import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from 'joi';




/**
 * Crea un nuevo submenú utilizando los datos proporcionados.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la creación del submenú.
 */
export const createSubMenu = async (req, res) => {
    try {
      // Valida los datos del cuerpo de la solicitud con el esquema
      const { error, value } = createSubMenuSchema.validate(req.body);
  
      if (error) {
        // Si hay errores de validación, responde con un error 400 y los detalles del error
        return res.status(400).json({ message: "Cuerpo de solicitud no válido", error: error.details });
      }
  
      const subMenuData = extractSubMenuData(value);
  
      await insertSubMenuToDatabase(subMenuData);
  
      // Envía una respuesta exitosa o datos adicionales según sea necesario
      res.json({ message: "Submenú creado exitosamente" });
    } catch (error) {
      // Registra el error y envía un estado 500 con una respuesta JSON
      console.error(error);
      res.status(500).json({ message: "Error al crear el submenú" });
    }
  };
/**
 * Inserta datos de submenú en la base de datos.
 *
 * @param {Object} subMenuData - Los datos que se insertarán en la base de datos.
 * @returns {Promise<void>} - Una Promesa que se resuelve una vez que se insertan los datos.
 * @throws {Error} - Lanza un error si la inserción falla.
 */
export const insertSubMenuToDatabase = async (subMenuData) => {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);
  
    // Ejecuta la consulta para insertar un nuevo submenú
    const [subMenuCreated, metadata] = await sequelize.query(`
        INSERT INTO db_prueba.dbo.sub_menu (
          nombre,
          descripcion,
          url,
          icono,
          activo,
          icon_mui,
          route,
          id_menu_padre
        )
        VALUES (
          :nombre,
          :descripcion,
          :url,
          :icono,
          :activo,
          :icon_mui,
          :route,
          :id_menu_padre
        );
      `,
      {
        replacements: subMenuData,
      }
    );
  };
  

// Resto del código de actualización y eliminación de submenús (updateSubMenu y deleteSubMenu)...

/**
 * Extrae datos de submenú del cuerpo de la solicitud.
 *
 * @param {Object} requestBody - El cuerpo de la solicitud que contiene datos de submenú.
 * @returns {Object} - Los datos de submenú extraídos.
 * @throws {Error} - Lanza un error si la extracción falla o si faltan propiedades requeridas.
 */
export const extractSubMenuData = (requestBody) => {
    const { nombre, descripcion, url, icono, activo, icon_mui, route, id_menu_padre } = requestBody;
  
    if (!nombre || activo === undefined || !id_menu_padre) {
      throw new Error("Cuerpo de solicitud no válido. Faltan propiedades requeridas.");
    }
  
    return {
      nombre,
      descripcion,
      url,
      icono,
      activo,
      icon_mui,
      route,
      id_menu_padre,
    };
  };


  /**
 * Obtiene todos los submenús de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la recuperación.
 */
export const getAllSubMenus = async (req, res) => {
    try {
      const place_id = 0;
      const sequelize = getDatabaseInstance(place_id);
  
      // Ejecuta la consulta para obtener todos los submenús
      const [subMenus, metadata] = await sequelize.query(`
          SELECT id_sub_menu, id_menu_padre, nombre, descripcion, url, icono, activo, icon_mui, route
          FROM db_prueba.dbo.sub_menu;
        `);
  
      // Envía los submenús recuperados como una respuesta JSON
      res.json(subMenus);
    } catch (error) {
      // Registra el error y envía un estado 500 con una respuesta JSON
      console.error(error);
      res.status(500).json({ message: "Error al recuperar los submenús" });
    }
  };