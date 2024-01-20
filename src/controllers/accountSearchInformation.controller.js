import { date } from "zod";
import { getDatabaseInstance } from "../config/dbManager.config.js";

export const getAccountHistoryByParameters = async (req, res) => {
  console.log(req.params.plaza);
  const place_id = Number(req.params.plaza);
  const sequelize = getDatabaseInstance(place_id);
  console.log(req.params.cologne);
  try {
    const [account, metadata] = await sequelize.query(
      `execute sp_search_information '${req.params.account}', '${req.params.owner_name}', '${req.params.street}', '${req.params.cologne}'`
    );
    // Verifica si accountHistory es undefined o tiene algún valor
    if (!account[0])
      return res.status(400).json({
        message: "not found account",
      });

    res.json(account);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "account not found" });
  }
};

export const getUsersByPlaceId = async (req, res) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const [users, metadata] = await sequelize.query(
      `execute sp_get_users_by_place_id ${2}`
    );
    // Verifica si accountHistory es undefined o tiene algún valor
    if (!users[0])
      return res.status(400).json({
        message: "not found users",
      });

    res.json(users);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "users not found" });
  }
};

export const getTaskCatalogData = async (req, res) => {
  const place_id = 1;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const [taskCatalogue, metadata] = await sequelize.query(
      `select * from dbo.cat_tarea`
    );
    // Verifica si accountHistory es undefined o tiene algún valor
    if (!taskCatalogue[0])
      return res.status(400).json({
        message: "not found task catalog",
      });

    res.json(taskCatalogue);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: "task catalogue not found" });
  }
};

const fechaActual = new Date();
const fechaFormateada = fechaActual
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");

  let isInsertPhotoInProgress = false;

export const insertPhoto = async (req, res) => {

  if (isInsertPhotoInProgress) {
    return res.status(429).json({
      message: 'La inserción de fotos ya está en progreso. Inténtelo nuevamente más tarde.',
    });
  }

  // Establecer el indicador de trabajo en progreso
  isInsertPhotoInProgress = true;
  const place_id = Number(req.params.plaza); // Adjust according to your logic
  const sequelize = getDatabaseInstance(place_id);
  const dataToInsert = req.body;

  const {
    account,
    user_id,
    namePhoto,
    task_id,
    date_capture,
    type,
    imageUrl,
    active,
    service_id,
    session_user_id,
   
  } = dataToInsert;

  console.log(dataToInsert);

  try {
    

    const [newPhoto, metadata]= await sequelize.query(
      `
      DECLARE @fechaConvertida DATETIME;
      SET @fechaConvertida = CONVERT(datetime, '${date_capture}', 120);
      execute sp_new_photo '${account}',${user_id},'${namePhoto}',${task_id},@fechaConvertida,'${type}','${imageUrl}',${active},${service_id},${session_user_id}`
    );

    if(!newPhoto[0]) return res.status(400).json({
      message: "not insert photo"
    })      
  
    res.json(newPhoto)

  } catch (error) {
    console.log(error)
    return res.status(404).json({message: 'newPhoto not found'})
  }finally{
     // Restablecer el indicador de trabajo en progreso después de la ejecución
     isInsertPhotoInProgress = false;
  } 
};

export const updateStatePhoto = async (req, res) => {
  const place_id = 2; // Adjust according to your logic
  const sequelize = getDatabaseInstance(place_id);
  const dataToUpdate = req.body;

  const { imageId, active, userId } = dataToUpdate;

  try {
    // Ejecutar el procedimiento almacenado
    await sequelize.query(
      `execute sp_change_photo_status ${imageId}, ${active},${userId}`
    );

    // Verificar si hay errores

    // Puedes agregar una consulta adicional para verificar si hubo errores en el procedimiento almacenado
    // Esto dependerá de cómo esté implementado tu procedimiento almacenado
    const [checkErrors, _] = await sequelize.query(
      "SELECT @@ERROR AS errorCode"
    );
    const errorCode = checkErrors[0].errorCode;

    if (errorCode !== 0) {
      return res.status(500).json({
        message: "Error en el procedimiento almacenado",
        errorCode: errorCode,
      });
    }

    // Si no hay errores, responder con éxito
    return res.json({
      message: "Operación exitosa",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};

export const duplicatePhoto = async (req, res) => {
  
  const dataToUpdate = req.body;
  console.log(dataToUpdate);
 
  const { imageId, account, type, user_id, date_capture, session_user_id } =
    dataToUpdate;
 

  const place_id = Number(req.params.plaza); // Adjust according to your logic
  const sequelize = getDatabaseInstance(place_id);

  try {
    // Ejecutar el procedimiento almacenado
    await sequelize.query(
      `
      DECLARE @fechaConvertida DATETIME;
      SET @fechaConvertida = CONVERT(datetime, '${date_capture}', 120);
      execute sp_duplicate_photo ${imageId}, '${account}','${type}',${user_id},@fechaConvertida, ${session_user_id}`
    );

    // Verificar si hay errores

    // Puedes agregar una consulta adicional para verificar si hubo errores en el procedimiento almacenado
    // Esto dependerá de cómo esté implementado tu procedimiento almacenado
    const [checkErrors, _] = await sequelize.query(
      "SELECT @@ERROR AS errorCode"
    );
    const errorCode = checkErrors[0].errorCode;

    if (errorCode !== 0) {
      return res.status(500).json({
        message: "Error en el procedimiento almacenado",
        errorCode: errorCode,
      });
    }

    // Si no hay errores, responder con éxito


    return res.json({
      message: "Operación exitosa",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error interno del servidor",
      error: error.message,
    });
  }
};
