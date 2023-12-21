// /controllers/task.controller.js
import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";
import { login } from "./auth.controller.js";

// Define el esquema de validación para los datos del cuerpo de la solicitud
const createTaskSchema = Joi.object({
  id: Joi.number(),
  id_tarea: Joi.number(),
  nombre: Joi.string().required(),
  activo: Joi.boolean().required(),
  id_proceso: Joi.number().integer().required(),
});

/**
 * Inserts task data into the database.
 *
 * @param {Object} taskData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */
const insertTaskToDatabase = async (taskData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  // Execute stored procedure or perform actions to create a new task category
  const [taskCreated] = await sequelize.query(
    `
    INSERT INTO dbo.cat_tarea (nombre, activo, id_proceso)
    VALUES (:nombre, :activo, :id_proceso);
    SELECT SCOPE_IDENTITY() AS insertedId;
  `,
    {
      replacements: taskData,
      type: sequelize.QueryTypes.SELECT,
    }
  );

  console.info(taskCreated);

  // Check if the task was created successfully
  if (!taskCreated || taskCreated.length === 0 || !taskCreated.insertedId) {
    // If the task creation was not successful, throw an error
    throw new Error("Failed to create task category");
  }
  return taskCreated.insertedId;
};

/**
 * Creates a new task category using the provided data.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the task category creation fails.
 */
export const createTask = async (req, res) => {
  try {
    // Validar los datos del cuerpo de la solicitud con el esquema

    const { error, value } = createTaskSchema.validate(req.body);

    if (error) {
      // Si hay errores de validación, responde con un error 400 y los detalles del error

      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const taskData = extractTaskData(value);

    await insertTaskToDatabase(taskData);

    // Send a success response or additional data as needed
    res.json({ message: "Task category created successfully" });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to create task category" });
  }
};

/**
 * Extracts task data from the request body.
 *
 * @param {Object} requestBody - The request body containing task data.
 * @returns {Object} - The extracted task data.
 * @throws {Error} - Throws an error if the extraction fails or if required properties are missing.
 */

const extractTaskData = (requestBody) => {
  console.log("***********");
  console.log(requestBody);
  console.log("***********");

  const { nombre, activo, id_proceso } = requestBody;

  if (!nombre || !id_proceso || !activo) {
    throw new Error("Invalid request body. Missing required properties.");
  }

  return { nombre, activo, id_proceso };
};

/**
 * Retrieves all task categories from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the retrieval fails.
 */
export const getAllTasks = async (req, res) => {
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to get all task categories
    const [tasks, metadata] = await sequelize.query(`
      SELECT * FROM dbo.cat_tarea;
    `);

    // Send the retrieved tasks as a JSON response
    res.json(tasks);
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve task categories" });
  }
};
/**
 * Updates a specific task category by its ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateTask = async (req, res) => {
  const taskId = req.params.id;

  const updatedTaskData = req.body; /* extractTaskData(req.body); */

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to update a specific task category by ID
    const [updatedTask, metadata] = await sequelize.query(
      `
      UPDATE dbo.cat_tarea
      SET nombre = :nombre, activo = :activo, id_proceso = :id_proceso
      OUTPUT inserted.*
      WHERE id_tarea = :id_tarea;
    `,
      {
        replacements: { id_tarea: taskId, ...updatedTaskData },
      }
    );

    if (updatedTask && updatedTask.length > 0) {
      res.json({ message: "Task updated successfully", updatedTask });
    } else {
      res.status(404).json({ message: "Task not found or not updated" });
    }
  } catch (error) {
    // Log the error and send a 500 status with a JSON response

    console.error(error);
    res.status(500).json({ message: "Failed to update task category" });
  }
};
