import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from 'joi';



export const getMenusUserId = async (req, res) => {
  const place_id = 0 
  const sequelize = getDatabaseInstance(place_id)

    try {
      const [menuFound, metadata] = await sequelize.query(`execute sp_get_menu_sub_menu_profile_user '${req.params.user_id}'`)

      console.log("este es el param:" + req.params.user_id)

      if(!menuFound[0]) return res.status(400).json({
        message: "not found menu"
      })      
    
      res.json(menuFound)

    } catch (error) {
      console.log(error)
      return res.status(404).json({message: 'menu not found'})
    }  
  }


  /**
 * Esquema de validación para crear un menú.
 * @typedef {Object} CreateMenuSchema
 * @property {string} nombre - El nombre del menú. Obligatorio.
 * @property {string} descripcion - Descripción del menú.
 * @property {string} url - URL asociada al menú.
 * @property {string} icono - Ícono del menú.
 * @property {boolean} activo - Indica si el menú está activo. Obligatorio.
 * @property {string} icon_mui - Ícono de Material-UI asociado al menú.
 * @property {string} route - Ruta asociada al menú.
 * @property {number} id_menu_padre - ID del menú padre.
 */
const createMenuSchema = Joi.object({
  nombre: Joi.string().required(),
  descripcion: Joi.string(),
  url: Joi.string(),
  icono: Joi.string(),
  activo: Joi.boolean().required(),
  icon_mui: Joi.string(),
  route: Joi.string(),
  id_menu_padre: Joi.number(),
});


/**
 * Crea un nuevo menú utilizando los datos proporcionados.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la creación del menú.
 */
export const createMenu = async (req, res) => {
  try {
    // Valida los datos del cuerpo de la solicitud con el esquema
    const { error, value } = createMenuSchema.validate(req.body);

    if (error) {
      // Si hay errores de validación, responde con un error 400 y los detalles del error
      return res.status(400).json({ message: "Cuerpo de solicitud no válido", error: error.details });
    }

    const menuData = extractMenuData(value);

    await insertMenuToDatabase(menuData);

    // Envía una respuesta exitosa o datos adicionales según sea necesario
    res.json({ message: "Menú creado exitosamente" });
  } catch (error) {
    // Registra el error y envía un estado 500 con una respuesta JSON
    console.error(error);
    res.status(500).json({ message: "Error al crear el menú" });
  }
};

/**
 * Inserta datos de menú en la base de datos.
 *
 * @param {Object} menuData - Los datos que se insertarán en la base de datos.
 * @returns {Promise<void>} - Una Promesa que se resuelve una vez que se insertan los datos.
 * @throws {Error} - Lanza un error si la inserción falla.
 */
export const insertMenuToDatabase = async (menuData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Ejecuta la consulta para insertar un nuevo menú
  const [menuCreated, metadata] = await sequelize.query(`
      INSERT INTO db_prueba.dbo.menu (
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
      replacements: menuData,
    }
  );
};

/**
 * Extrae datos de menú del cuerpo de la solicitud.
 *
 * @param {Object} requestBody - El cuerpo de la solicitud que contiene datos de menú.
 * @returns {Object} - Los datos de menú extraídos.
 * @throws {Error} - Lanza un error si la extracción falla o si faltan propiedades requeridas.
 */
export const extractMenuData = (requestBody) => {
  const { nombre, descripcion, url, icono, activo, icon_mui, route, id_menu_padre } = requestBody;

  if (!nombre || activo === undefined) {
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
 * Obtiene todos los menús de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la recuperación.
 */
export const getAllMenus = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Ejecuta la consulta para obtener todos los menús
    const [menus, metadata] = await sequelize.query(`
        SELECT id_menu, id_menu_padre, nombre, descripcion, url, icono, activo, icon_mui, route
        FROM db_prueba.dbo.menu;
      `);

    // Envía los menús recuperados como una respuesta JSON
    res.json(menus);
  } catch (error) {
    // Registra el error y envía un estado 500 con una respuesta JSON
    console.error(error);
    res.status(500).json({ message: "Error al recuperar los menús" });
  }
};


/**
 * Actualiza un menú específico por su ID en la base de datos.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la actualización.
 */
export const updateMenu = async (req, res) => {
  const menuId = req.params.id;
  const updatedMenuData = extractMenuData(req.body);

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Ejecuta la consulta para actualizar un menú específico por su ID
    const [updatedMenu, metadata] = await sequelize.query(`
        UPDATE db_prueba.dbo.menu
        SET
          nombre = :nombre,
          descripcion = :descripcion,
          url = :url,
          icono = :icono,
          activo = :activo,
          icon_mui = :icon_mui,
          route = :route,
          id_menu_padre = :id_menu_padre
        WHERE id_menu = :id;
      `,
      {
        replacements: { id: menuId, ...updatedMenuData },
      }
    );

    res.json({ message: "Menú actualizado exitosamente" });
  } catch (error) {
    // Registra el error y envía un estado 500 con una respuesta JSON
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el menú" });
  }
};


/**
 * Elimina un menú específico por su ID de la base de datos.
 *
 * @param {Object} req - Objeto de solicitud Express.
 * @param {Object} res - Objeto de respuesta Express.
 * @returns {Promise<void>}
 * @throws {Error} Lanza un error si falla la eliminación.
 */
export const deleteMenu = async (req, res) => {
  const menuId = req.params.id;

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Ejecuta la consulta para eliminar un menú específico por su ID
    const [deletedMenu, metadata] = await sequelize.query(`
        DELETE FROM db_prueba.dbo.menu WHERE id_menu = :id;
      `,
      {
        replacements: { id: menuId },
      }
    );

    // Verifica si el menú se eliminó correctamente
    if (metadata > 0) {
      // Envía una respuesta de éxito o datos adicionales según sea necesario
      res.json({ message: "Menú eliminado exitosamente" });
    } else {
      res.status(404).json({ message: "Menú no encontrado" });
    }
  } catch (error) {
    // Registra el error y envía un estado 500 con una respuesta JSON
    console.error(error);
    res.status(500).json({ message: "Error al eliminar el menú" });
  }
};


/* usuario,rol,menu */

const createMenuRolUsuarioSchema = Joi.object({
  id_menu: Joi.number(),
  id_rol: Joi.number(),
  id_usuario: Joi.number(),
  activo: Joi.boolean(),
});

export const createMenuByRolAndUsuario = async (req, res) => {
  try {
  
    const { error: menuError, value: menuValue } = createMenuRolUsuarioSchema.validate(req.body);

    /* if (menuError) {
      return res.status(400).json({ message: "Cuerpo de solicitud no válido para Menú", error: menuError.details });
    } */

    const menuData = extractMenuByRolAndUsuario(menuValue);

   

    const { error: rolUsuarioError, value: rolUsuarioValue } = createMenuRolUsuarioSchema.validate({
      ...menuValue,
      id_menu: menuData.id_menu,
    });
    console.log("***");
    console.log(rolUsuarioValue);
    console.log("***");

  /*   if (rolUsuarioError) {
      return res.status(400).json({ message: "Cuerpo de solicitud no válido para MenuRolUsuario", error: rolUsuarioError.details });
    } */

    await insertMenuRolUsuarioToDatabase(rolUsuarioValue);

    res.json({ message: " Menú-Rol-Usuario creados exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear  Menú-Rol-Usuario" });
  }
};

export const insertMenuRolUsuarioToDatabase = async (menuRolUsuarioData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  const [menuRolUsuarioCreated, metadata] = await sequelize.query(`
      INSERT INTO db_prueba.dbo.menu_rol_usuario (
        id_menu,
        id_rol,
        id_usuario,
        activo
      )
      VALUES (
        :id_menu,
        :id_rol,
        :id_usuario,
        :activo
      );
    `,
    {
      replacements: menuRolUsuarioData,
    }
  );
};

export const extractMenuByRolAndUsuario = (requestBody) => {
  const { id_menu, id_rol, id_usuario, activo } = requestBody;

  if (id_menu === undefined || id_rol === undefined || id_usuario === undefined || activo === undefined) {
    throw new Error("Cuerpo de solicitud no válido. Faltan propiedades requeridas.");
  }

  return {
    id_menu,
    id_rol,
    id_usuario,
    activo,
  };
};
export const getMenuByUserAndRol = async (req, res) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const user_id = req.params.user_id;
    const rol_id = req.params.rol_id;

    const [menuFound, metadata] = await sequelize.query(
      `execute sp_get_menu_sub_menu_profile_user_register @user_id = :user_id, @id_rol = :rol_id`,
      {
        replacements: { user_id, rol_id },
      }
    );

    console.log(menuFound);

    if (!menuFound[0]) {
      return res.status(400).json({
        message: "not found menu",
      });
    }

    res.json(menuFound);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: 'menu not found' });
  }
};
