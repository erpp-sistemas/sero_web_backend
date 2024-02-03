import {Router} from 'express'

import * as userController from '../controllers/user.controller.js';
import * as usuarioController from '../controllers/usuario.controller.js'
const router = Router()


/* User */

// Create a new user
router.post('/users', userController.createUser);

// Get all users
router.get('/users', userController.getAllUsers);

// Update a user by ID
router.put('/users/:id', userController.updateUser);

// Delete a user by ID
router.delete('/users/:id', userController.deleteUser);


/* Usuarios */
router.post('/usuarios', usuarioController.createUser);

// Route to get all users
router.get('/usuarios', usuarioController.getAllUsers);

// Route to update a user by ID
router.put('/usuarios/:id', usuarioController.updateUser);

// Route to delete a user by ID
router.delete('/usuarios/:id', usuarioController.deleteUser);
router.get('/GetUserById/:id',userController.getUserById)

router.get('/getPlaceAndServiceAndProcessByUser/:id',userController.getPlaceAndServiceAndProcessByUser)

/* getPlaceAndServiceAndProcessByUser */




export default router