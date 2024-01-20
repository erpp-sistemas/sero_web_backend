// Import necessary modules and controllers
import { getDatabaseInstance } from "../config/dbManager.config.js";
import Joi from "joi";
import bcrypt from "bcryptjs";
// Define the validation schema for the request body data
const createUserSchema = Joi.object({
  username: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

/**
 * Inserts user data into the database.
 *
 * @param {Object} userData - The data to be inserted into the database.
 * @returns {Promise<void>} - A Promise that resolves once the data is inserted.
 * @throws {Error} - Throws an error if the insertion fails.
 */

const insertUserToDatabase = async (userData) => {
  const place_id = 0;
  const sequelize = getDatabaseInstance(place_id);

  try {
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    const [userCreated,metadata] = await sequelize.query(
      `
      INSERT INTO dbo.[user] (username, email, password)
      VALUES (:username, :email, :password);
    `,
      {
        replacements: { ...userData, password: hashedPassword },
      }
    );

    if (metadata) {
      // If at least one row was affected, assume successful insertion
      return { message: "User created successfully" };
    } else {
      throw new Error("Failed to create user");
    }
  } catch (error) {
    console.error("Error during user creation:", error);
    throw error;
  }
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
    // Validate the request body data with the schema
    const { error, value } = createUserSchema.validate(req.body);

    if (error) {
      // If there are validation errors, respond with a 400 error and error details
      return res
        .status(400)
        .json({ message: "Invalid request body", error: error.details });
    }

    const userData = extractUserData(value);

    await insertUserToDatabase(userData);

    // Send a success response or additional data as needed
    res.json({ message: "User created successfully" });
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to create user" });
  }
};

/**
 * Deletes a specific user by their ID from the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the deletion fails.
 */
export const deleteUser = async (req, res) => {
  const userId = req.params.id;

  console.log(userId);
  
  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to get the user information before deleting
    const [userToDelete, userMetadata] = await sequelize.query(`
      SELECT * FROM dbo.[user] WHERE id = :id;
    `, {
      replacements: { id: userId },
    });

    // Check if the user to delete was found
    if (userToDelete && userToDelete.length > 0) {
      // Execute query to delete the specific user by ID
      const [deletedUser, deleteMetadata] = await sequelize.query(`
        DELETE FROM dbo.[user] WHERE id = :id;
      `, {
        replacements: { id: userId },
      });
  

      if (deleteMetadata > 0) {
        // Send a success response or additional data as needed
        res.json({ message: "User deleted successfully" });
      } else {
        res.status(404).json({ message: "User not found" });
      }
    }
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

/**
 * Extracts user data from the request body.
 *
 * @param {Object} requestBody - The request body containing user data.
 * @returns {Object} - The extracted user data.
 * @throws {Error} - Throws an error if the extraction fails or if required properties are missing.
 */
const extractUserData = (requestBody) => {
  const { username, email, password } = requestBody;

  if (!username || !email || !password) {
    throw new Error("Invalid request body. Missing required properties.");
  }

  return { username, email, password };
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
      SELECT * FROM dbo.[user];
    `);

    // Send the retrieved users as a JSON response
    res.json(users);
  } catch (error) {
    // Log the error and send a 500 status with a JSON response
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve users" });
  }
};

/**
 * Updates a specific user by their ID in the database.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>}
 * @throws {Error} Throws an error if the update fails.
 */
export const updateUser = async (req, res) => {
  const userId = req.params.id;

  const updatedUserData = req.body; /* extractUserData(req.body); */

  try {
    const place_id = 0;
    const sequelize = getDatabaseInstance(place_id);

    // Execute query to update a specific user by ID
    const [updatedUser, metadata] = await sequelize.query(
      `
      UPDATE dbo.[user]
      SET username = :username, email = :email, password = :password
      OUTPUT inserted.*
      WHERE id = :id;
    `,
      {
        replacements: { id: userId, ...updatedUserData },
      }
    );

    if (updatedUser && updatedUser.length > 0) {
      res.json({ message: "User updated successfully", updatedUser });
    } else {
      res.status(404).json({ message: "User not found or not updated" });
    }
  } catch (error) {
    // Log the error and send a 500 status with a JSON response

    console.error(error);
    res.status(500).json({ message: "Failed to update user" });
  }
};
