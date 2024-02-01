import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getUserById = async (req, res) => {
  try {
    // Obtén el id del usuario desde los parámetros de la solicitud
    const { usuario } = req.params;

    // Verifica si se proporcionó un id de usuario válido
    if (!usuario) {
      return res
        .status(400)
        .json({ message: "ID de usuario no proporcionado" });
    }

    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Ejecuta la consulta para obtener la información del usuario por su ID
    const [userData, metadata] = await sequelize.query(
      `
            SELECT id_acceso,id_usuario FROM dbo.acceso WHERE usuario = :usuario;
        `,
      {
        replacements: { usuario: usuario },
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Verifica si se encontraron datos para el usuario
    if (userData) {
      // Envía los datos del usuario como respuesta JSON
      res.json(userData);
    } else {
      // Envía un mensaje indicando que no se encontraron datos para el usuario
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    // Registra el error y envía un estado 500 con una respuesta JSON
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al recuperar la información del usuario" });
  }
};

export const updateAccesUserById = async (req, res) => {
  try {
    // Obtain user id from request parameters
    const { id_acceso } = req.params;

    // Check if a valid user id is provided
    if (!id_acceso) {
      return res
        .status(400)
        .json({ message: "ID de usuario no proporcionado" });
    }

    // Obtain update data from request body

    const { usuario, password, activo_app_desktop, activo_app_movil } =
      req.body;

    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute the update query
    const [updatedRowsCount, metadata] = await sequelize.query(
      `
      UPDATE db_prueba.dbo.acceso
      SET 
        usuario = :usuario,
        contraseña = :password,
        activo_app_movil = :activo_app_movil,
        activo_app_desktop = :activo_app_desktop
      WHERE id_acceso = :id_acceso;
      `,
      {
        replacements: {
          id_acceso,
          /* Specify the values for the update */

          usuario,
          password,

          activo_app_movil,
          activo_app_desktop,
        },
        type: sequelize.QueryTypes.UPDATE,
      }
    );
    res.json({ message: "Usuario actualizado exitosamente" });


    // Check if any rows were updated
   /*  if (updatedRowsCount > 0) {
      res.json({ message: "Usuario actualizado exitosamente" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    } */
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la información del usuario" });
  }
};
